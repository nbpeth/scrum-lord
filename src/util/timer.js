export const MAX_TIMER_SECONDS = 600;
export const DEFAULT_TIMER_SECONDS = 60;

export const TIMER_PRESETS = [15, 30, 60, 120, 300];

export const formatCountdown = (totalSeconds) => {
  const safe = Math.max(0, Math.floor(totalSeconds ?? 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const countdownTone = (secondsRemaining, totalSeconds) => {
  if (secondsRemaining <= 10) {
    return "error";
  }
  if (totalSeconds > 0 && secondsRemaining / totalSeconds <= 0.25) {
    return "warning";
  }

  return "secondary";
};

export const clampTimerSeconds = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return Math.min(MAX_TIMER_SECONDS, Math.max(1, parsed));
};
