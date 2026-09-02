import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";

export const useCountdown = (community) => {
  const running = Boolean(community?.timer?.running);
  const timerEnd = community?.timer?.timerEnd;
  const totalSeconds = community?.timer?.value ?? 0;

  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (!running || !timerEnd) {
      setSecondsRemaining(0);
      return;
    }

    const tick = () =>
      setSecondsRemaining(
        Math.max(0, differenceInSeconds(new Date(timerEnd), new Date()))
      );

    tick();
    const countdown = setInterval(tick, 1000);

    return () => clearInterval(countdown);
  }, [running, timerEnd]);

  return {
    running,
    secondsRemaining,
    totalSeconds,
    fractionRemaining:
      totalSeconds > 0 ? Math.min(1, secondsRemaining / totalSeconds) : 0,
  };
};
