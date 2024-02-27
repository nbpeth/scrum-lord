const postgresClient = require("./postgresClient");
const datefns = require("date-fns");

const communities = {};

const getCommunities = () => {
  return communities;
};

const getCommunitiesAsArray = async () => {
  const result = await postgresClient.getCommunities();

  if (!result) {
    // SQL error, oops?
    return [];
  }

  return result
    .map(({ id, data, last_modified }) => {
      if (!data) {
        return null;
      }
      return {
        id,
        name: data.name,
        description: data.description,
        citizens: data.citizens.length,
        lastModified: last_modified,
        synergy: data.synergy,
        isPrivate: data.isPrivate,
      };
    })
    ?.filter((x) => !!x && !x.isPrivate);
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
    community: { ...community, citizens: [], synergy: {} },
  });

  return result.map(({ id, data }) => {
    return {
      id,
      isPrivate: data.isPrivate,
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

const editPointScheme = async ({ communityId, scheme }) => {
  const result = await postgresClient.editPointScheme({ communityId, scheme });

  const { data } = result[0];

  return data;
};

const startTimer = async ({ communityId, timerLength, enabled }) => {
  const timerEnd = datefns.addSeconds(new Date(), timerLength);
  const result = await postgresClient.startTimer({
    communityId,
    timerLength,
    enabled,
    timerEnd,
  });

  const { data } = result[0];

  return data;
};

const stopTimer = async ({ communityId }) => {
  const result = await postgresClient.stopTimer({ communityId });

  const { data } = result[0];

  return data;
};

const cancelTimer = async ({ communityId }) => {
  const result = await postgresClient.cancelTimer({ communityId });

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
  const communityState = await getCommunityBy(communityId);
  const { revealed, citizens } = communityState;
  const doubleVote =
    revealed &&
    Boolean(citizens.find((citizen) => citizen.userId === userId)?.vote);

  const result = await postgresClient.submitVote({
    communityId,
    userId,
    vote,
    communityState,
    doubleVote,
  });

  const { data } = result[0];

  return { ...data, doubleVote };
};

// if all votes are the same for at least two people, let's party
const verifySynergy = (result) => {
  return (
    result &&
    result.citizens &&
    result.citizens?.length > 1 &&
    result.citizens
      // don't count votes for lurkers
      ?.filter((citizen) => citizen.votingMember)
      .map((citizen) => citizen.vote)
      .every((vote) => {
        // all votes are the same and all votes were cast
        return (
          vote === result.citizens[0].vote &&
          vote !== null &&
          vote !== undefined
        );
      })
  );
};

const reveal = async ({ communityId }) => {
  const result = await postgresClient.revealCommunity({ communityId });
  const { data } = result[0];

  const isSynergized = verifySynergy(data);
  if (isSynergized) {
    const synergyResult = await postgresClient.synergizeCommunity({
      communityId,
    });
    return { ...synergyResult, isSynergized };
  }

  return { ...data, isSynergized };
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
  cancelTimer,
  communitiesSummary,
  deleteCommunity,
  editPointScheme,
  getCommunities,
  getCommunitiesAsArray,
  getCommunityBy,
  joinCommunity,
  leaveCommunity,
  reveal,
  reset,
  startTimer,
  stopTimer,
  submitVote,
};
