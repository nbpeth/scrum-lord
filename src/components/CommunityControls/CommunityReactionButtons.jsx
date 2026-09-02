import { AddReactionOutlined } from "@mui/icons-material";
import { Box, ButtonBase, IconButton, Popover, Tooltip } from "@mui/material";
import { useState } from "react";
import {
  OVERFLOW_REACTIONS,
  PINNED_REACTIONS,
  REACTION_EMOJI,
} from "../../util/reactions";
import {
  moreReactionsIconSx,
  moreReactionsSx,
  reactionButtonSx,
  reactionRowSx,
  reactionTrayGridSx,
  reactionTraySx,
} from "./CommunityReactionButtons.styles";

export const CommunityReactionButtons = ({ onReaction }) => {
  const [trayAnchor, setTrayAnchor] = useState(null);

  const react = (event) => {
    onReaction({ event });
    setTrayAnchor(null);
  };

  return (
    <Box sx={reactionRowSx}>
      {PINNED_REACTIONS.map((event) => (
        <ReactionButton key={event} event={event} onReact={react} />
      ))}

      <Tooltip title="More reactions" placement="top" arrow>
        <IconButton
          id="more-reactions-button"
          size="small"
          aria-label="More reactions"
          onClick={(e) => setTrayAnchor(e.currentTarget)}
          sx={moreReactionsSx}
        >
          <AddReactionOutlined sx={moreReactionsIconSx} />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(trayAnchor)}
        anchorEl={trayAnchor}
        onClose={() => setTrayAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: reactionTraySx } }}
      >
        <Box id="reaction-tray" sx={reactionTrayGridSx}>
          {OVERFLOW_REACTIONS.map((event) => (
            <ReactionButton key={event} event={event} onReact={react} />
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

const ReactionButton = ({ event, onReact }) => (
  <ButtonBase
    title={event}
    aria-label={event}
    onClick={() => onReact(event)}
    sx={reactionButtonSx}
  >
    {REACTION_EMOJI[event]}
  </ButtonBase>
);
