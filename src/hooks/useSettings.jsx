import { useEffect, useState } from "react";

export const useSettings = () => {
  const [settings, setSettings] = useState();
  const [yourPrivateRooms, setYourPrivateRooms] = useState(
    (localStorage.getItem("privateRooms") &&
      JSON.parse(localStorage.getItem("privateRooms"))) ||
      {}
  );

  // load saved settings
  // loading settings from local storage is broken with hooks because they overwrite each other
  useEffect(() => {
    try {
      const settingsState = localStorage.getItem("settings");
      const savedSettings = JSON.parse(settingsState);

      setSettings(savedSettings);
    } catch (e) {
      console.error(e);
      setSettings({
        communityAnimation: false,
        messageBoardVisible: true,
        reactionsVisible: true,
        lurkerBoxVisible: false,
        timerVisible: false,
      });
    }
  }, []);

  // save settings when they change
  useEffect(() => {
    // debugger;
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const toggleCommunityAnimation = (enabled) => {
    setSettings({
      ...settings,
      communityAnimation: enabled,
    });
  };

  const toggleMessageBoard = (enabled) => {
    setSettings({ ...settings, messageBoardVisible: enabled });
  };

  const toggleReactions = (enabled) => {
    setSettings({ ...settings, reactionsVisible: enabled });
  };

  const toggleLurkerBox = (enabled) => {
    setSettings({ ...settings, lurkerBoxVisible: enabled });
  };

  const toggleTimerVisible = (enabled) => {
    setSettings({ ...settings, timerVisible: enabled });
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
