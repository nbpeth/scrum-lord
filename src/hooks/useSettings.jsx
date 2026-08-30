import { useCallback, useState } from "react";

const defaultSettings = {
  communityAnimation: true,
  messageBoardVisible: true,
  reactionsVisible: true,
  lurkerBoxVisible: true,
  timerVisible: true,
};

const readJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useSettings = () => {
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...readJson("settings"),
  }));
  const [yourPrivateRooms, setYourPrivateRooms] = useState(() =>
    readJson("privateRooms")
  );

  const updateSettings = (patch) => {
    const updated = { ...settings, ...patch };
    writeJson("settings", updated);
    setSettings(updated);
  };

  const toggleSetting = (key) => (enabled) => updateSettings({ [key]: enabled });

  const updatePrivateRooms = useCallback((community) => {
    if (!community) {
      return;
    }
    setYourPrivateRooms((prev) => {
      const updated = { ...prev, [community.id]: community };
      writeJson("privateRooms", updated);
      return updated;
    });
  }, []);

  const removePrivateRoom = useCallback((communityId) => {
    setYourPrivateRooms((prev) => {
      const updated = { ...prev };
      delete updated[communityId];
      writeJson("privateRooms", updated);
      return updated;
    });
  }, []);

  return {
    settings,
    yourPrivateRooms,
    updatePrivateRooms,
    removePrivateRoom,
    toggleCommunityAnimation: toggleSetting("communityAnimation"),
    toggleMessageBoard: toggleSetting("messageBoardVisible"),
    toggleReactions: toggleSetting("reactionsVisible"),
    toggleLurkerBox: toggleSetting("lurkerBoxVisible"),
    toggleTimerVisible: toggleSetting("timerVisible"),
  };
};
