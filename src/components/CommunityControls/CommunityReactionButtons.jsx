import { Box, Button } from "@mui/material";
import { REACTION_EMOJI, REACTION_EVENTS } from "../../util/reactions";
import {
  reactionButtonSx,
  reactionRowSx,
} from "./CommunityReactionButtons.styles";

export const CommunityReactionButtons = ({ onReaction }) => {
  return (
    <Box sx={reactionRowSx}>
      {REACTION_EVENTS.map((key) => (
        <Button
          key={key}
          size="small"
          variant="outlined"
          onClick={() => onReaction({ event: key })}
          title={key}
          sx={reactionButtonSx}
        >
          {REACTION_EMOJI[key]}
        </Button>
      ))}
    </Box>
  );
};
