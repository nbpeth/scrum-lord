const { Pool } = require("pg");
const uuid = require("uuid");

const dbConnectionProperties = {
  connectionString: process.env.DATABASE_URL,
  ...(process.env.ENV === "production"
    ? { ssl: { rejectUnauthorized: false } }
    : { ssl: false }),
};

const pool = new Pool(dbConnectionProperties);

const executeQuery = async ({ query, values }) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(query, values);

    return result.rows;
  } catch (err) {
    console.error(err.stack);
  } finally {
    client?.release();
  }
};

const addCommunity = async ({ community }) => {
  const id = uuid.v4();
  const query =
    "INSERT INTO communities(id, data, last_modified) VALUES($1, $2, NOW()) RETURNING *;";
  const values = [id, { ...community, id }];

  return executeQuery({ query, values });
};

const getCommunities = async () => {
  return executeQuery({ query: "SELECT * FROM communities" });
};

const getCommunityById = async ({ id }) => {
  const query = "SELECT * FROM communities where id = $1";

  return executeQuery({ query, values: [id] });
};

const joinCommunity = async ({
  communityId,
  username,
  userId,
  userColor,
  userType,
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
    { username, userId, userType, votingMember, userColor },
  ]);

  return executeQuery({ query, values: [citizen, communityId] });
};

const leaveCommunity = async ({ communityId, userId }) => {
  const query = `
    WITH to_remove AS (
      SELECT
        elem ->> 'userId' AS citizen_userId,
        (ord - 1) AS index
      FROM communities,
           jsonb_array_elements(data::jsonb->'citizens') WITH ORDINALITY AS t(elem, ord)
      WHERE id = $1
    ),
    idx AS (
      SELECT index
      FROM to_remove
      WHERE citizen_userId = $2
      LIMIT 1
    )
    UPDATE communities
    SET data = data::jsonb #- ARRAY['citizens', (SELECT CAST(index AS TEXT) FROM idx)],
    last_modified = NOW()
    WHERE id = $1
    RETURNING *;
      `;

  return executeQuery({ query, values: [communityId, userId] });
};

const deleteCommunity = async ({ community }) => {
  const query = "DELETE FROM communities where id = $1";

  return executeQuery({ query, values: [community.id] });
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

  return executeQuery({ query, values: [communityId] });
};

const submitVote = async ({ communityId, userId, vote, doubleVote }) => {
  // Pair each citizen with their array index using WITH ORDINALITY — do not
  // cross join jsonb_array_elements with generate_series (that returns many
  // rows per user and breaks scalar subqueries on idx).
  const query = `
      WITH to_update AS (
        SELECT
          elem ->> 'userId' AS citizen_userId,
          (ord - 1) AS index
        FROM communities,
             jsonb_array_elements(data::jsonb->'citizens') WITH ORDINALITY AS t(elem, ord)
        WHERE id = $1
      ),
      idx AS (
        SELECT index
        FROM to_update
        WHERE citizen_userId = $2
        LIMIT 1
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

  return executeQuery({ query, values });
};

const revealCommunity = async ({ communityId }) => {
  // Show all votes and increment synergy total votes.
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

  return executeQuery({ query, values: [communityId] });
};

const editPointScheme = async ({ communityId, scheme }) => {
  const query = `
        UPDATE communities
        SET data = jsonb_set(data::jsonb, '{pointScheme}', $1::jsonb)
        WHERE id = $2
        RETURNING *;
    `;

  return executeQuery({
    query,
    values: [JSON.stringify(scheme), communityId],
  });
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

  return executeQuery({ query, values });
};

const stopTimer = async ({ communityId }) => {
  const query = `
        UPDATE communities
        SET data = jsonb_set(jsonb_set(data::jsonb, '{timer}', $1::jsonb), '{revealed}', 'true')
        WHERE id = $2
        RETURNING *;
    `;
  const values = [JSON.stringify({ running: false }), communityId];

  return executeQuery({ query, values });
};

const cancelTimer = async ({ communityId }) => {
  const query = `
        UPDATE communities
        SET data = jsonb_set(data::jsonb, '{timer}', $1::jsonb)
        WHERE id = $2
        RETURNING *;
    `;
  const values = [JSON.stringify({ running: false }), communityId];

  return executeQuery({ query, values });
};

const synergizeCommunity = async ({ communityId }) => {
  // Increment synergy hits.
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

  return executeQuery({ query, values: [communityId] });
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
