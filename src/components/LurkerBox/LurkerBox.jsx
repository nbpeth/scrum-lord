import { Gavel } from "@mui/icons-material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import {
  deleteLurkerIconSx,
  lurkerColorDotSx,
  lurkerCountSx,
  lurkerEmptySx,
  lurkerHeaderIconSx,
  lurkerHeaderSx,
  lurkerListSx,
  lurkerNameSx,
  lurkerPanelSx,
  lurkerRowSx,
  lurkerTitleSx,
} from "./LurkerBox.styles";

const titleFor = (count) => (count === 1 ? "Scrumlord" : "Scrumlords");

export const LurkerBox = ({ lurkers, handleDeleteUser }) => {
  return (
    <Box id="lurker-box" sx={lurkerPanelSx}>
      <Tooltip
        title="Scrumlords run the room without casting a vote"
        placement="top-start"
        arrow
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={lurkerHeaderSx}
        >
          <Gavel sx={lurkerHeaderIconSx} />
          <Typography variant="overline" sx={lurkerTitleSx}>
            {titleFor(lurkers.length)}
          </Typography>
          <Box component="span" sx={lurkerCountSx}>
            {lurkers.length}
          </Box>
        </Stack>
      </Tooltip>

      <Box id="lurker-box-list" sx={lurkerListSx}>
        {lurkers.length ? (
          lurkers.map((lurker) => (
            <Stack
              id="lurker-box-list-item"
              key={lurker.userId}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={lurkerRowSx}
            >
              <Box sx={lurkerColorDotSx(lurker.userColor)} />
              <Typography variant="body2" sx={lurkerNameSx}>
                {lurker.username}
              </Typography>
              <IconButton
                className="lurker-remove"
                size="small"
                aria-label={`Remove ${lurker.username}`}
                onClick={() => handleDeleteUser(lurker)}
                sx={deleteLurkerIconSx}
              >
                <DeleteTwoToneIcon fontSize="inherit" />
              </IconButton>
            </Stack>
          ))
        ) : (
          <Typography variant="caption" sx={lurkerEmptySx}>
            No one is running the show
          </Typography>
        )}
      </Box>
    </Box>
  );
};
