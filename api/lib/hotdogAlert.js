const HOTDOG_MAX = 15;
const OVERLOAD_DURATION_MS = 60000;
const DECAY_DELAY_MS = 2000;

const eventTypes = {
  hotdog: "hotdog",
  communityAlerts: {
    hotdog: {
      active: "community-alerts.hotdog.active",
      inactive: "community-alerts.hotdog.inactive",
    },
  },
};

const createHotdogAlert = ({
  notifyClients,
  max = HOTDOG_MAX,
  overloadDurationMs = OVERLOAD_DURATION_MS,
  decayDelayMs = DECAY_DELAY_MS,
}) => {
  const stateByCommunityId = {};

  const getSlot = (communityId) => {
    if (!stateByCommunityId[communityId]) {
      stateByCommunityId[communityId] = { active: false, value: 0 };
    }
    return stateByCommunityId[communityId];
  };

  const lowerLevels = (communityId) => {
    const slot = getSlot(communityId);
    slot.value = slot.value ? slot.value - 1 : 0;
  };

  const endOverload = (communityId, { event, userId, username, userColor }) => {
    const slot = getSlot(communityId);
    slot.active = false;
    slot.value = 0;

    notifyClients({
      message: {
        type: eventTypes.communityAlerts.hotdog.inactive,
        payload: { event, userId, username, userColor, hotdogCapacity: 0 },
      },
      communityId,
    });
  };

  const beginOverload = (communityId, { event, userId, username, userColor }) => {
    const slot = getSlot(communityId);
    slot.active = true;

    setTimeout(
      () => endOverload(communityId, { event, userId, username, userColor }),
      overloadDurationMs
    );

    notifyClients({
      message: {
        type: eventTypes.communityAlerts.hotdog.active,
        payload: { event, userId, username, userColor },
      },
      communityId,
    });
  };

  const handleReaction = (payload) => {
    const { community, ...reactor } = payload;
    const { id: communityId } = community;
    const slot = getSlot(communityId);

    if (slot.value < max) {
      slot.value += 1;
    }

    const overloaded = slot.value >= max;

    if (overloaded && !slot.active) {
      beginOverload(communityId, reactor);
    }

    if (!slot.active) {
      setTimeout(() => lowerLevels(communityId), decayDelayMs);
    }
  };

  return { handleReaction, getSlot };
};

module.exports = { createHotdogAlert, eventTypes, HOTDOG_MAX };
