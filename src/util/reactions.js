export const REACTION_EMOJI = {
  lightning: "⚡",
  hotdog: "🌭",
  party: "🎉",
  thinking: "🤔",
  upvote: "👍",
  downvote: "👎",
  love: "❤️‍🔥",
  heartbreak: "💔",
  shrug: "🤷",
};

export const REACTION_EVENTS = Object.keys(REACTION_EMOJI);

export const PINNED_REACTIONS = ["hotdog", "thinking", "upvote", "downvote"];

export const OVERFLOW_REACTIONS = REACTION_EVENTS.filter(
  (event) => !PINNED_REACTIONS.includes(event)
);

export const reactionEmojiFor = (event) => REACTION_EMOJI[event] ?? "🤷";
