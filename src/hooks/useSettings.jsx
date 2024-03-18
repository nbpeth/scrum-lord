import { useEffect, useState } from "react";

export const useSettings = () => {
  const [settings, setSettings] = useState(
    (localStorage.getItem("settings") &&
      JSON.parse(localStorage.getItem("settings"))) ||
      {}
  );
  const [yourPrivateRooms, setYourPrivateRooms] = useState(
    (localStorage.getItem("privateRooms") &&
      JSON.parse(localStorage.getItem("privateRooms"))) ||
      {}
  );

  const setSettingsGuard = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
  };

  const toggleMessageBoard = (enabled) => {
    setSettingsGuard({ messageBoardVisible: enabled });
  };

  const toggleCommunityAnimation = (enabled) => {
    setSettingsGuard({
      communityAnimation: enabled,
    });
  };

  const toggleReactions = (enabled) => {
    setSettingsGuard({ reactionsVisible: enabled });
  };

  const toggleLurkerBox = (enabled) => {
    setSettingsGuard({ lurkerBoxVisible: enabled });
  };

  const toggleTimerVisible = (enabled) => {
    setSettingsGuard({ timerVisible: enabled });
  };

  //   const recoverUserFromStorage = () => {
  //     const userstate = localStorage.getItem("userstate") ?? "{}";
  //     const userstateObj = JSON.parse(userstate);
  //     const cachedUserIdForCommunity = userstateObj[communityId];
  //     const citizens = currentCommunity?.citizens || [];

  //     if (cachedUserIdForCommunity && citizens.length) {
  //       const user = citizens.find(
  //         (citizen) => citizen.userId === cachedUserIdForCommunity
  //       );
  //       setIAmCitizen(user);
  //     }
  //   };

  //   // when a user joins, save their id to local storage for this session so they can reclaim their user if they return
  //   const saveUserToStorage = (userId) => {
  //     const userState = localStorage.getItem("userstate") || "{}";
  //     const userStateObj = JSON.parse(userState);
  //     userStateObj[communityId] = userId;

  //     localStorage.setItem("userstate", JSON.stringify(userStateObj));
  //   };

  const updatePrivateRooms = (community) => {
    if (!community) {
      return;
    }

    const updatedRooms = { ...yourPrivateRooms, [community.id]: community };

    setYourPrivateRooms(updatedRooms);

    localStorage.setItem("privateRooms", JSON.stringify(updatedRooms));
  };

  const removePrivateRoom = (communityId) => {
    const updatedRooms = { ...yourPrivateRooms };

    delete updatedRooms[communityId];

    localStorage.setItem("privateRooms", JSON.stringify(updatedRooms));

    setYourPrivateRooms(updatedRooms);
  };

  return {
    removePrivateRoom,
    settings,
    toggleCommunityAnimation,
    toggleMessageBoard,
    toggleReactions,
    toggleLurkerBox,
    toggleTimerVisible,
    yourPrivateRooms,
    updatePrivateRooms,
  };
};
