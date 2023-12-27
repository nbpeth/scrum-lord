const uuid = require("uuid");

const communities = {};

const getCommunities = () => {
  return communities;
};

const getCommunitiesAsArray = () => {
  return Object.values(communities);
};

const getCommunityBy = (id) => {
  return communities[id];
};

const addCommunity = (community) => {
  const id = uuid.v4();
  const communityWithId = { ...community, id: id, citizens: [] };

  communities[id] = communityWithId;
};

const joinCommunity = ({ communityId, username, userId }) => {
  const targetCommunity = communities[communityId];

  if (!targetCommunity) {
    return Error(`Community "${communityId}" does not exist`);
  }

  communities[communityId].citizens.push({ username, userId });

  return communities[communityId];
};

const leaveCommunity = ({ communityId, username, userId }) => {
  const targetCommunity = communities[communityId];

  if (!targetCommunity) {
    return Error(`Community "${communityId}" does not exist`);
  }

  const filteredCitizens = targetCommunity.citizens.filter(
    (citizen) => citizen.userId !== userId
  );
  communities[communityId].citizens = filteredCitizens;

  return communities[communityId];
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

//   console.log("##commiunities", communities);
//   console.log("##communityId", communityId);
//   console.log("##communities[communityId]", communities[communityId]);

  return communities[communityId];
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

// just a hard and rough replace
const updateCommunity = (community) => {
  communities[community.id] = community;
};

const deleteCommunity = (community) => {
  delete communities[community.id];

  return communities;
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
  submitVote,
  updateCommunity,
};
