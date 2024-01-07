const { post } = require("./http-server");
const postgresClient = require("./postgresClient");

const communities = {};

const getCommunities = () => {
  return communities;
};

const getCommunitiesAsArray = async () => {
  const result = await postgresClient.getCommunities();

  if(!result) {
    // SQL error, oops?
    return [];
  }

  return result.map(({ id, data }) => {
    return {
      id,
      name: data.name,
      description: data.description,
      citizens: data.citizens.length,
    };
  });
};

const getCommunityBy = async (id) => {
  const result = await postgresClient.getCommunityById({ id });

  if (result.length === 0) {
    console.warn("no community found", id);
    return null;
  }

  return result[0].data;
};

const addCommunity = async (community) => {
  const result = await postgresClient.addCommunity({
    community: { ...community, citizens: [] },
  });

  return result.map(({ id, data }) => {
    return {
      id,
      name: data.name,
      description: data.description,
      citizens: data.citizens.length,
    };
  });
};

const joinCommunity = async ({
  communityId,
  username,
  userId,
  userColor,
  votingMember,
}) => {
  const result = await postgresClient.joinCommunity({
    communityId,
    username,
    userId,
    userColor,
    votingMember,
  });

  console.log("joinCommunity result", result);

  if (result.length === 0) {
    // something bad happened, what do
    console.error(
      "unable to join community",
      { communityId, username, userId, votingMember },
      result
    );
  }

  const { data } = result[0];

  return data;
};

const leaveCommunity = async ({ communityId, username, userId }) => {
  const result = await postgresClient.leaveCommunity({
    communityId,
    username,
    userId,
  });

  const { data } = result[0];

  return data;
};

const submitVote = async ({ communityId, userId, vote }) => {
  const result = await postgresClient.submitVote({ communityId, userId, vote });

  const { data } = result[0];

  return data;
};

const reveal = async ({ communityId }) => {
  const result = await postgresClient.revealCommunity({ communityId });

  const { data } = result[0];

  return data;
};

const reset = async ({ communityId }) => {
  const result = await postgresClient.resetCommunity({ communityId });

  const { data } = result[0];

  return data;
};

const communitiesSummary = () => {
  return Object.values(communities).map((community) => {
    return {
      id: community.id,
      name: community.name,
      description: community.description,
      citizens: community.citizens.length,
    };
  });
};

const deleteCommunity = async ({ community, userId, username }) => {
  await postgresClient.deleteCommunity({ community });

  return {
    deleted: true,
    id: community.id,
    userId,
    username,
  };
};

module.exports = {
  addCommunity,
  communitiesSummary,
  deleteCommunity,
  getCommunities,
  getCommunitiesAsArray,
  getCommunityBy,
  joinCommunity,
  leaveCommunity,
  reveal,
  reset,
  submitVote,
};
