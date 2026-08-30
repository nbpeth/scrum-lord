import { Search } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import logoUrl from "../../scrum-lord.png";
import { WebSocketReadyState } from "../../util/websocketUtils";
import { ConnectionStatus } from "../ConnectionStatus/ConnectionStatus";
import {
  connectionRowSx,
  mockFilledButtonSx,
  mockFieldLabelSx,
  mockFieldSx,
  mockPanelSx,
  mockRoomRowSx,
  previewLogoStyle,
  startButtonPreviewSx,
} from "./TutorialModal.styles";

const StartButtonArt = () => (
  <Box sx={startButtonPreviewSx}>
    <img src={logoUrl} alt="" style={previewLogoStyle} />
  </Box>
);

const RoomMenuArt = () => (
  <Stack spacing={1.5} sx={mockPanelSx}>
    <Typography variant="subtitle2" fontWeight={700}>
      Your rooms
    </Typography>
    <Stack direction="row" spacing={1} alignItems="stretch">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={mockFieldSx}
      >
        <Typography variant="body2" color="text.secondary">
          Search
        </Typography>
        <Search fontSize="small" color="disabled" />
      </Stack>
      <Typography variant="body2" sx={mockFilledButtonSx("primary")}>
        New room
      </Typography>
    </Stack>
    <Stack spacing={1}>
      <Typography variant="body2" sx={mockRoomRowSx}>
        sprint-planning
      </Typography>
      <Typography variant="body2" sx={mockRoomRowSx}>
        backlog-grooming
      </Typography>
    </Stack>
  </Stack>
);

const NewRoomArt = () => (
  <Stack spacing={1.5} sx={mockPanelSx}>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={mockFieldLabelSx}>
        Room Name
      </Typography>
      <Typography variant="body2" sx={mockFieldSx}>
        mighty-quiet-otter
      </Typography>
    </Box>
    <Stack direction="row" spacing={2}>
      <Typography variant="body2" sx={mockFilledButtonSx("primary")}>
        Create
      </Typography>
      <Typography variant="body2" color="error.main" alignSelf="center">
        Cancel
      </Typography>
    </Stack>
  </Stack>
);

const connectionStates = [
  { readyState: WebSocketReadyState.OPEN, description: "Connected and live" },
  {
    readyState: WebSocketReadyState.CONNECTING,
    description: "Connecting or reconnecting",
  },
  {
    readyState: WebSocketReadyState.CLOSED,
    description: "Disconnected, votes will not sync",
  },
];

export const ConnectionStatusArt = () => (
  <Stack spacing={1} sx={mockPanelSx}>
    {connectionStates.map(({ readyState, description }) => (
      <Stack
        key={readyState}
        direction="row"
        alignItems="center"
        spacing={2}
        sx={connectionRowSx}
      >
        <ConnectionStatus readyState={readyState} size={12} />
        <Typography variant="body2">{description}</Typography>
      </Stack>
    ))}
  </Stack>
);

export const dashboardTutorialPages = [
  {
    title: "Press the big button",
    body: "The glowing button in the middle of the dashboard is your way in. Clicking it opens the room menu.",
    art: <StartButtonArt />,
  },
  {
    title: "Find a room, or start one",
    body: "The room menu lists every room you have created. Search by name to jump back into one, or pick New room to open a brand new space.",
    art: <RoomMenuArt />,
  },
  {
    title: "Name it and go",
    body: "New room lets you name your room, or keep the randomly generated one, and hit Create. Scrum Lord drops you straight into it, ready to point.",
    art: <NewRoomArt />,
  },
  {
    title: "Watch the status light",
    body: "The light in the top right corner shows whether the app is talking to the server.",
    art: <ConnectionStatusArt />,
  },
];
