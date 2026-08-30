import {
  BookmarkAdd,
  ContentCopy,
  Search,
  WarningAmber,
} from "@mui/icons-material";
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
  mockUrlBarSx,
  mockUrlTextSx,
  previewLogoStyle,
  startButtonPreviewSx,
  warningCalloutIconSx,
  warningCalloutSx,
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

const SaveTheUrlArt = () => (
  <Stack spacing={1.5} sx={mockPanelSx}>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={mockFieldLabelSx}>
        Room address
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={mockUrlBarSx}
      >
        <Typography variant="caption" sx={mockUrlTextSx}>
          https://s.crumlord.com/communities/3c6adf27-3a03-4056-91ee-21c361fae2ad
        </Typography>
        <ContentCopy fontSize="small" color="disabled" />
        <BookmarkAdd fontSize="small" color="disabled" />
      </Stack>
    </Box>
    <Stack direction="row" alignItems="center" spacing={1} sx={warningCalloutSx}>
      <WarningAmber sx={warningCalloutIconSx} />
      <Typography variant="body2" fontWeight={700}>
        Lose the link, lose the room
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
    title: "Save that URL now",
    body: "There is no room discovery in Scrum Lord, and the address is a random ID rather than the name you picked, so nobody is guessing it or typing it from memory. Your rooms list only remembers what this browser has visited, so on another device or after clearing your data, the URL is the only way back in. Copy it or bookmark it as soon as you land, and share that same link with anyone you want in the room.",
    art: <SaveTheUrlArt />,
  },
  {
    title: "Watch the status light",
    body: "The light in the top right corner shows whether the app is talking to the server.",
    art: <ConnectionStatusArt />,
  },
];
