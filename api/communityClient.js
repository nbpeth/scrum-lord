const datefns = require("date-fns");
const postgresClient = require("./postgresClient");

const firstRowData = (result) => result?.[0]?.data ?? null;

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

  if (!result || result.length === 0) {
    console.warn("no community found", id);
    return null;
  }

  return result[0].data;
};

const addCommunity = async (community) => {
  const result = await postgresClient.addCommunity({
    community: { ...community, citizens: [], synergy: {} },
  });

  return result.map(({ id, data }) => ({
    id,
    isPrivate: data.isPrivate,
    name: data.name,
    description: data.description,
    citizens: data.citizens.length,
  }));
};

const joinCommunity = async ({
  communityId,
  username,
  userId,
  userColor,
  userType,
  votingMember,
}) => {
  const result = await postgresClient.joinCommunity({
    communityId,
    username,
    userId,
    userColor,
    userType,
    votingMember,
  });

  if (!result || result.length === 0) {
    console.error(
      "unable to join community",
      { communityId, username, userId, userType, votingMember },
      result
    );
  }

  return firstRowData(result);
};

const leaveCommunity = async ({ communityId, username, userId }) => {
  const result = await postgresClient.leaveCommunity({
    communityId,
    username,
    userId,
  });

  return firstRowData(result);
};

const editPointScheme = async ({ communityId, scheme }) => {
  const result = await postgresClient.editPointScheme({ communityId, scheme });

  return firstRowData(result);
};

const startTimer = async ({ communityId, timerLength, enabled }) => {
  const timerEnd = datefns.addSeconds(new Date(), timerLength);
  const result = await postgresClient.startTimer({
    communityId,
    timerLength,
    enabled,
    timerEnd,
  });

  return firstRowData(result);
};

const stopTimer = async ({ communityId }) => {
  const result = await postgresClient.stopTimer({ communityId });

  return firstRowData(result);
};

const cancelTimer = async ({ communityId }) => {
  const result = await postgresClient.cancelTimer({ communityId });

  return firstRowData(result);
};

const submitVote = async ({ communityId, userId, vote }) => {
  const communityState = await getCommunityBy(communityId);
  const { revealed, citizens } = communityState;

  const votingCitizen = citizens.find((citizen) => citizen.userId === userId);

  const previousVote = votingCitizen?.vote;
  const previousDoubleVote = votingCitizen?.doubleVote;
  const doubleVote =
    revealed &&
    (previousDoubleVote ||
      (previousVote !== undefined &&
        previousVote !== null &&
        previousVote !== vote));

  const result = await postgresClient.submitVote({
    communityId,
    userId,
    vote,
    communityState,
    doubleVote,
  });

  return { ...firstRowData(result), doubleVote };
};

const verifySynergy = (community) => {
  const citizens = community?.citizens;
  if (!citizens || citizens.length < 2) {
    return false;
  }

  const votes = citizens
    .filter((citizen) => citizen.votingMember)
    .map((citizen) => citizen.vote);

  if (!votes.length) {
    return false;
  }

  return votes.every(
    (vote) => vote === votes[0] && vote !== null && vote !== undefined
  );
};

const reveal = async ({ communityId }) => {
  const result = await postgresClient.revealCommunity({ communityId });
  let data = firstRowData(result);

  const isSynergized = verifySynergy(data);
  if (isSynergized) {
    const synergyResult = await postgresClient.synergizeCommunity({
      communityId,
    });

    data = firstRowData(synergyResult);
  }

  return { ...data, isSynergized };
};

const reset = async ({ communityId }) => {
  const result = await postgresClient.resetCommunity({ communityId });

  return firstRowData(result);
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
  deleteCommunity,
  editPointScheme,
  getCommunitiesAsArray,
  getCommunityBy,
  joinCommunity,
  leaveCommunity,
  reveal,
  reset,
  startTimer,
  stopTimer,
  submitVote,
  verifySynergy,
};
