import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import * as uuid from "uuid";
import useCommunity from "../../hooks/useCommunity";
import {
  TRAJECTORIES,
  floatingReactionSx,
  reactionOverlaySx,
} from "./ReactionMachine.styles";

const REACTION_LIFETIME_MS = 2500;

export const ReactionMachine = () => {
  const [reactions, setReactions] = useState([]);
  const { lastReaction } = useCommunity();

  useEffect(() => {
    if (!lastReaction) return;

    setReactions((prev) => [...prev, { ...lastReaction, id: uuid.v4() }]);
  }, [lastReaction]);

  return (
    <Box id="reaction-container" sx={reactionOverlaySx}>
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setReactions((prev) => prev.filter((reaction) => reaction.id !== id));
    }, REACTION_LIFETIME_MS);

    return () => clearTimeout(timeoutId);
  }, [id, setReactions]);

  return <Box sx={floatingReactionSx(variant)}>{message}</Box>;
};
