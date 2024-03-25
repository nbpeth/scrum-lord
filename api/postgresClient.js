const { Pool } = require("pg");
const uuid = require("uuid");

const DB_CONNECTION_STRING = process.env.DATABASE_URL;

const dbConnectionProperties = {
  connectionString: DB_CONNECTION_STRING,
  ...(process.env.ENV === "production"
    ? { ssl: { rejectUnauthorized: false } }
    : { ssl: false }),
};

let pool;
try {
  console.log("opening up db connection pool");
  pool = new Pool({
    ...dbConnectionProperties,
  });
} catch (err) {
  console.error("could not connect to db!", err);
  throw err;
}

const executeQuery = async ({ query, values }) => {
  try {
    const client = await pool.connect();

    const result = await client.query(query, values);
    client.release();

    return result.rows;
  } catch (err) {
    console.error(err.stack);
  }
};

const addCommunity = async ({ community }) => {
  const id = uuid.v4();
  const query =
    "INSERT INTO communities(id, data, last_modified) VALUES($1, $2, NOW()) RETURNING *;";
  const values = [id, { ...community, id }];

  const result = await executeQuery({ query, values });

  return result;
};

const getCommunities = async () => {
  const query = "SELECT * FROM communities";

  const result = await executeQuery({ query });

  return result;
};

const getCommunityById = async ({ id }) => {
  const query = "SELECT * FROM communities where id = $1";
  const result = await executeQuery({ query, values: [id] });

  return result;
};

const joinCommunity = async ({
  communityId,
  username,
  userId,
  userColor,
  votingMember,
}) => {
  const query = `
    UPDATE communities
    SET data = jsonb_set(data::jsonb, '{citizens}', COALESCE(data::jsonb->'citizens', '[]'::jsonb) || $1::jsonb),
    last_modified = NOW()
    WHERE id = $2
    RETURNING data;
  `;
  const citizen = JSON.stringify([
    { username, userId, votingMember, userColor },
  ]);
  const values = [citizen, communityId];

  const result = await executeQuery({ query, values });

  return result;
};

const leaveCommunity = async ({ communityId, userId }) => {
  const query = `
    WITH to_remove AS (
      SELECT jsonb_array_elements(data::jsonb->'citizens') ->> 'userId' AS citizen_userId, generate_series(0, jsonb_array_length(data::jsonb->'citizens')) AS index
      FROM communities
      WHERE id = $1
    ),
    idx AS (
      SELECT index
      FROM to_remove
      WHERE citizen_userId = $2
    )
    UPDATE communities
    SET data = data::jsonb #- ARRAY['citizens', (SELECT CAST(index AS TEXT) FROM idx)],
    last_modified = NOW()
    WHERE id = $1
    RETURNING *;
      `;
  const values = [communityId, userId];

  const result = await executeQuery({ query, values });

  return result;
};

const deleteCommunity = async ({ community }) => {
  const query = "DELETE FROM communities where id = $1";
  const values = [community.id];

  const result = await executeQuery({ query, values });

  return result;
};

const resetCommunity = async ({ communityId }) => {
  const query = `
    WITH updated_citizens AS (
      SELECT jsonb_agg(
        jsonb_set(
          jsonb_set(
            jsonb_set(citizen::jsonb, '{vote}', 'null'), 
            '{hasVoted}', 'false'
          ),
          '{doubleVote}', 'false'
        )
      ) AS citizens
      FROM jsonb_array_elements((SELECT data::jsonb->'citizens' FROM communities WHERE id = $1)) AS citizen
    )
    UPDATE communities
    SET data = jsonb_set(
      jsonb_set(
        data::jsonb, 
        '{citizens}', 
        (SELECT citizens::jsonb FROM updated_citizens)
      ),
      '{revealed}', 
      'false'::jsonb
    ),
    last_modified = NOW()
    WHERE id = $1
    RETURNING *;
  `;
  const values = [communityId];

  const result = await executeQuery({ query, values });

  return result;
};

const submitVote = async ({ communityId, userId, vote, doubleVote }) => {
  const query = `
      WITH to_update AS (
        SELECT jsonb_array_elements(data::jsonb->'citizens') ->> 'userId' AS citizen_userId, generate_series(0, jsonb_array_length(data::jsonb->'citizens')) AS index
        FROM communities
        WHERE id = $1
      ),
      idx AS (
        SELECT index
        FROM to_update
        WHERE citizen_userId = $2
      )
      UPDATE communities
      SET data = jsonb_set(
        jsonb_set(
          jsonb_set(
            data::jsonb, 
            ARRAY['citizens', (SELECT CAST(index AS TEXT) FROM idx), 'hasVoted'], 
            'true'::jsonb
          ),
          ARRAY['citizens', (SELECT CAST(index AS TEXT) FROM idx), 'vote'], 
          $3::jsonb
        ),
        ARRAY['citizens', (SELECT CAST(index AS TEXT) FROM idx), 'doubleVote'], 
        $4::jsonb
      ),
      last_modified = NOW()
      WHERE id = $1
      RETURNING *;
    `;
  const values = [
    communityId,
    userId,
    JSON.stringify(vote),
    doubleVote ?? false,
  ];

  const result = await executeQuery({ query, values });

  return result;
};

const revealCommunity = async ({ communityId }) => {
  // show all votes and increment synergy total votes
  const query = `
    UPDATE communities
    SET data = jsonb_set(
                jsonb_set(
                        data::jsonb,
                        '{synergy, total}',
                        ((COALESCE((data -> 'synergy' ->> 'total')::integer, 0) + 1)::text)::jsonb
                ),
                '{revealed}',
                'true'
              )
    WHERE id = $1
    RETURNING *;
  `;
  const values = [communityId];

  const result = await executeQuery({ query, values });

  return result;
};

const editPointScheme = async ({ communityId, scheme }) => {
  const query = `
        UPDATE communities
        SET data = jsonb_set(data::jsonb, '{pointScheme}', $1::jsonb)
        WHERE id = $2
        RETURNING *;
    `;
  const values = [JSON.stringify(scheme), communityId];

  const result = await executeQuery({ query, values });

  return result;
};

const startTimer = async ({ communityId, timerLength, timerEnd }) => {
  const query = `
        UPDATE communities
        SET data = jsonb_set(data::jsonb, '{timer}', $1::jsonb)
        WHERE id = $2
        RETURNING *;
    `;
  const values = [
    JSON.stringify({ running: true, value: timerLength, timerEnd }),
    communityId,
  ];

  const result = await executeQuery({ query, values });

  return result;
};

const stopTimer = async ({ communityId, timerLength }) => {
  const query = `
        UPDATE communities
        SET data = jsonb_set(jsonb_set(data::jsonb, '{timer}', $1::jsonb), '{revealed}', 'true')
        WHERE id = $2
        RETURNING *;
    `;
  const values = [
    JSON.stringify({ running: false, value: undefined }),
    communityId,
  ];

  const result = await executeQuery({ query, values });

  return result;
};

const cancelTimer = async ({ communityId, timerLength }) => {
  const query = `
        UPDATE communities
        SET data = jsonb_set(data::jsonb, '{timer}', $1::jsonb)
        WHERE id = $2
        RETURNING *;
    `;
  const values = [
    JSON.stringify({ running: false, value: undefined }),
    communityId,
  ];

  const result = await executeQuery({ query, values });

  return result;
};

const synergizeCommunity = async ({ communityId }) => {
  // increment synergy hits
  const query = `
    UPDATE communities
    SET data =
            jsonb_set(
                    data::jsonb,
                    '{synergy, hits}',
                    ((COALESCE((data -> 'synergy' ->> 'hits')::integer, 0) + 1)::text)::jsonb)
    
    WHERE id = $1
    RETURNING *;
`;
  const values = [communityId];

  const result = await executeQuery({ query, values });

  return result;
};

module.exports = {
  addCommunity,
  cancelTimer,
  deleteCommunity,
  editPointScheme,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  resetCommunity,
  revealCommunity,
  startTimer,
  stopTimer,
  submitVote,
  synergizeCommunity,
};
