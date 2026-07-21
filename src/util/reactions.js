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

export const reactionEmojiFor = (event) => REACTION_EMOJI[event] ?? "🤷";
