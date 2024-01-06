const { post } = require("./http-server");
const postgresClient = require("./postgresClient");

const communities = {};

const getCommunities = () => {
  return communities;
};

const getCommunitiesAsArray = async () => {
  const result = await postgresClient.getCommunities();

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
  votingMember,
}) => {
  const result = await postgresClient.joinCommunity({
    communityId,
    username,
    userId,
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

const submitVote = ({ communityId, userId, vote }) => {
  const targetCommunity = communities[communityId];

  if (!targetCommunity) {
    return Error(`Community "${communityId}" does not exist`);
  }

  const citizen = targetCommunity.citizens.find(
    (citizen) => citizen.userId === userId
  );

  if (!citizen) {
    return Error(`Citizen "${userId}" does not exist`);
  }

  citizen.vote = vote;
  citizen.hasVoted = true;

  return communities[communityId];
};

const reveal = ({ communityId }) => {
  const targetCommunity = communities[communityId];

  if (!targetCommunity) {
    return Error(`Community "${communityId}" does not exist`);
  }

  targetCommunity.revealed = true;

  return communities[communityId];
};

const reset = async ({ communityId }) => {
  const result = await postgresClient.resetCommunity({ communityId });

  const { data } = result[0];

  return data;
  // const targetCommunity = communities[communityId];

  // if (!targetCommunity) {
  //   return Error(`Community "${communityId}" does not exist`);
  // }

  // targetCommunity.revealed = false;
  // targetCommunity.citizens.forEach((citizen) => {
  //   citizen.vote = null;
  //   citizen.hasVoted = false;
  // });

  // return communities[communityId];
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
