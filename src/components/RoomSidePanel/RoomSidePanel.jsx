import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { RoomControls } from "../RoomControls/RoomControls";
import {
  collapseButtonSx,
  sidePanelBodySx,
  sidePanelHeaderSx,
  sidePanelSx,
  sidePanelTitleSx,
} from "./RoomSidePanel.styles";

export const RoomSidePanel = ({
  collapsed,
  onToggleCollapsed,
  iAmCitizen,
  onJoin,
  onLeave,
  onEditPointScheme,
  onDeleteRoom,
}) => {
  return (
    <Box id="room-side-panel" sx={sidePanelSx(collapsed)}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={sidePanelHeaderSx}
      >
        {!collapsed && (
          <Typography variant="overline" sx={sidePanelTitleSx}>
            Room
          </Typography>
        )}
        <Tooltip
          title={collapsed ? "Expand panel" : "Collapse panel"}
          placement="right"
          arrow
        >
          <IconButton
            id="room-side-panel-toggle"
            size="small"
            aria-label={collapsed ? "Expand panel" : "Collapse panel"}
            onClick={onToggleCollapsed}
            sx={collapseButtonSx}
          >
            {collapsed ? (
              <ChevronRight fontSize="small" />
            ) : (
              <ChevronLeft fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      <Box sx={sidePanelBodySx(collapsed)}>
        <RoomControls
          compact={collapsed}
          iAmCitizen={iAmCitizen}
          onJoin={onJoin}
          onLeave={onLeave}
          onEditPointScheme={onEditPointScheme}
          onDeleteRoom={onDeleteRoom}
        />
      </Box>
    </Box>
  );
};
