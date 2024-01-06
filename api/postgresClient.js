const { Pool } = require("pg");
const uuid = require("uuid");

const dbConnectionProperties = {
  host: process.env.DB_HOST ?? "localhost",
  port: process.env.DB_PORT ?? 5432,
  database: process.env.DB_DATABASE ?? "postgres",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL ?? false,
};

const pool = new Pool({
  ...dbConnectionProperties,
});

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
  const query = "INSERT INTO communities(id, data) VALUES($1, $2) RETURNING *;";
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
  votingMember,
}) => {
  const query = `
    UPDATE communities
    SET data = jsonb_set(data::jsonb, '{citizens}', COALESCE(data::jsonb->'citizens', '[]'::jsonb) || $1::jsonb)
    WHERE id = $2
    RETURNING data;
  `;
  const citizen = JSON.stringify([{ username, userId, votingMember }]);
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
    SET data = data::jsonb #- ARRAY['citizens', (SELECT CAST(index AS TEXT) FROM idx)]
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
    UPDATE communities
    SET data = jsonb_set(
      data::jsonb, 
      '{citizens}', 
      (
        SELECT jsonb_agg(
          jsonb_set(
            jsonb_set(citizen::jsonb, '{vote}', 'null'), 
            '{hasVoted}', 'false'
          )
        )
        FROM jsonb_array_elements(data::jsonb->'citizens') AS citizen
      )::json
    )
    WHERE id = $1
    RETURNING *;
  `;
  const values = [communityId];

  const result = await executeQuery({ query, values });

  return result;
};

module.exports = {
  addCommunity,
  deleteCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  resetCommunity,
};