import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import * as uuid from "uuid";
import useCommunity from "../../hooks/useCommunity";

const TRAJECTORIES = [
  { left: "40%", scale: 7 },
  { left: "30%", scale: 6 },
  { left: "50%", scale: 5 },
  { left: "60%", scale: 4 },
  { left: "70%", scale: 5 },
  { left: "20%", scale: 6 },
];

const REACTION_LIFETIME_MS = 2500;

export const ReactionMachine = () => {
  const [reactions, setReactions] = useState([]);
  const { lastReaction } = useCommunity();

  useEffect(() => {
    if (!lastReaction) return;

    setReactions((prev) => [...prev, { ...lastReaction, id: uuid.v4() }]);
  }, [lastReaction]);

  return (
    <Box
      id="reaction-container"
      sx={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 8,
      }}
    >
      {reactions.map((reaction) => (
        <Reaction
          key={reaction.id}
          id={reaction.id}
          message={reaction.message}
          setReactions={setReactions}
        />
      ))}
    </Box>
  );
};

const Reaction = ({ id, message, setReactions }) => {
  const [variant] = useState(() =>
    Math.floor(Math.random() * TRAJECTORIES.length)
  );
  const { left, scale } = TRAJECTORIES[variant];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setReactions((prev) => prev.filter((reaction) => reaction.id !== id));
    }, REACTION_LIFETIME_MS);

    return () => clearTimeout(timeoutId);
  }, [id, setReactions]);

  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "90%",
        fontSize: "3rem",
        animation: `reaction-float-${variant} 3s ease-in-out`,
        [`@keyframes reaction-float-${variant}`]: {
          "0%": {
            top: "90%",
            opacity: 1,
            left: "50%",
            transform: "translate(-50%, -50%) scale(1)",
          },
          "100%": {
            top: "0%",
            opacity: 0,
            left,
            transform: `translate(-50%, -50%) scale(${scale})`,
          },
        },
      }}
    >
      {message}
    </Box>
  );
};
