import {
  Celebration,
  ChevronLeft,
  Edit,
  Gavel,
  KeyboardArrowDown,
  ModeComment,
  ModeNight,
  Timer,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { VoteOptionsLabels } from "../../util/voteOptions";
import { ConnectionStatusArt } from "./dashboardTutorialPages";
import {
  citizenTileSx,
  citizenTileVoteSx,
  citizenTilesRowSx,
  colorSwatchPreviewSx,
  colorSwatchSelectedPreviewSx,
  mockChipRowSx,
  mockChipSelectedSx,
  mockChipSx,
  mockFieldLabelSx,
  mockFieldSx,
  mockFilledButtonSx,
  mockMenuLabelSx,
  mockMenuRowSx,
  mockMenuSectionLabelSx,
  mockMenuSx,
  mockOutlineButtonSx,
  mockPanelSx,
  mockSidePanelBodySx,
  mockSidePanelHeaderSx,
  mockSidePanelSx,
  mockSidePanelTitleSx,
  timerReadoutSx,
  toggleIconSx,
} from "./TutorialModal.styles";

const MenuRow = ({ icon: Icon, label, toggledOn }) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={mockMenuRowSx}>
    <Icon fontSize="small" color="disabled" />
    <Typography variant="body2" sx={mockMenuLabelSx}>
      {label}
    </Typography>
    {toggledOn === undefined ? null : toggledOn ? (
      <ToggleOn fontSize="small" sx={toggleIconSx(true)} />
    ) : (
      <ToggleOff fontSize="small" sx={toggleIconSx(false)} />
    )}
  </Stack>
);

const JoinPanelArt = () => (
  <Box sx={mockSidePanelSx}>
    <Stack direction="row" alignItems="center" sx={mockSidePanelHeaderSx}>
      <Typography variant="overline" sx={mockSidePanelTitleSx}>
        Room
      </Typography>
      <ChevronLeft fontSize="small" color="disabled" />
    </Stack>
    <Box sx={mockSidePanelBodySx}>
      <Typography variant="body2" sx={mockFilledButtonSx("success")}>
        Join room
      </Typography>
    </Box>
  </Box>
);

const swatchPreview = [
  "#AD28FC",
  "#D160BD",
  "#4F90DA",
  "#DFB48D",
  "#EA0208",
  "#71EB28",
  "#6FE7BD",
];

const JoinDialogArt = () => (
  <Stack spacing={1.25} sx={mockPanelSx}>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={mockFieldLabelSx}>
        User name
      </Typography>
      <Typography variant="body2" sx={mockFieldSx}>
        cheerfulOtter
      </Typography>
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={mockFieldLabelSx}>
        Tile color
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        {swatchPreview.map((color) =>
          color === "#4F90DA" ? (
            <Box key={color} sx={colorSwatchSelectedPreviewSx(color)} />
          ) : (
            <Box key={color} sx={colorSwatchPreviewSx(color)} />
          )
        )}
      </Stack>
    </Box>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="body2" color="text.secondary" sx={mockMenuLabelSx}>
        Join as
      </Typography>
      <Typography variant="caption" sx={mockChipSelectedSx}>
        Voter
      </Typography>
      <Typography variant="caption" sx={mockChipSx}>
        Scrumlord
      </Typography>
      <Typography variant="body2" sx={mockFilledButtonSx("primary")}>
        Join
      </Typography>
    </Stack>
  </Stack>
);

const VoteControlsArt = () => (
  <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
    <Box>
      <Typography variant="caption" color="text.secondary" sx={mockFieldLabelSx}>
        Pts
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2} sx={mockFieldSx}>
        <Typography variant="body2">8</Typography>
        <KeyboardArrowDown fontSize="small" color="disabled" />
      </Stack>
    </Box>
    <Typography variant="body2" sx={mockFilledButtonSx("primary")}>
      Vote
    </Typography>
  </Stack>
);

const CitizenTile = ({ username, vote, voted, doubleVote }) => (
  <Box sx={citizenTileSx({ voted, doubleVote })}>
    <Typography variant="caption" noWrap display="block">
      {username}
    </Typography>
    <Typography variant="h6" sx={citizenTileVoteSx}>
      {vote}
    </Typography>
  </Box>
);

const votedTiles = [
  { username: "cheerfulOtter", vote: "?", voted: true },
  { username: "quietFalcon", vote: "?", voted: true },
  { username: "brightMoose", vote: "-", voted: false },
];

const revealedTiles = [
  { username: "cheerfulOtter", vote: "8", voted: true },
  { username: "quietFalcon", vote: "5", voted: true },
  { username: "brightMoose", vote: "13", voted: true, doubleVote: true },
];

const RevealArt = () => (
  <Stack spacing={2} alignItems="center" sx={mockPanelSx}>
    <Stack direction="row" spacing={1} sx={citizenTilesRowSx}>
      {votedTiles.map((tile) => (
        <CitizenTile key={tile.username} {...tile} />
      ))}
    </Stack>
    <Stack direction="row" spacing={1}>
      <Typography variant="body2" sx={mockOutlineButtonSx("warning")}>
        Reset
      </Typography>
      <Typography variant="body2" sx={mockFilledButtonSx("success")}>
        Reveal
      </Typography>
    </Stack>
  </Stack>
);

const DoubleVoteArt = () => (
  <Stack direction="row" spacing={1} sx={citizenTilesRowSx}>
    {revealedTiles.map((tile) => (
      <CitizenTile key={tile.username} {...tile} />
    ))}
  </Stack>
);

const TimerArt = () => (
  <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
    <Typography variant="body2" sx={mockFilledButtonSx("secondary")}>
      Timer
    </Typography>
    <Typography variant="body2" sx={mockFieldSx}>
      60
    </Typography>
    <Typography variant="body2" sx={timerReadoutSx}>
      0:42
    </Typography>
  </Stack>
);

const displayToggles = [
  { icon: Celebration, label: "Reactions", toggledOn: true },
  { icon: ModeNight, label: "Stars", toggledOn: true },
  { icon: Gavel, label: "Scrumlords", toggledOn: false },
  { icon: ModeComment, label: "Activity", toggledOn: true },
  { icon: Timer, label: "Timer", toggledOn: false },
];

const DisplayTogglesArt = () => (
  <Box sx={mockMenuSx}>
    <Typography variant="overline" sx={mockMenuSectionLabelSx}>
      Display
    </Typography>
    {displayToggles.map((toggle) => (
      <MenuRow key={toggle.label} {...toggle} />
    ))}
  </Box>
);

const schemePreview = [
  "fibonacci",
  "tshirt",
  "yesNo",
  "thumbs",
  "foodEmojis",
  "naturalNumbers",
];

const PointSchemeArt = () => (
  <Stack spacing={1.5} sx={mockPanelSx}>
    <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
      <Edit fontSize="small" color="primary" />
      <Typography variant="body2" sx={mockOutlineButtonSx("primary")}>
        Point scheme
      </Typography>
    </Stack>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={mockFieldSx}
    >
      <Typography variant="body2">Fibonacci</Typography>
      <KeyboardArrowDown fontSize="small" color="disabled" />
    </Stack>
    <Stack direction="row" sx={mockChipRowSx}>
      {schemePreview.map((scheme) => (
        <Typography key={scheme} variant="caption" sx={mockChipSx}>
          {VoteOptionsLabels[scheme]}
        </Typography>
      ))}
    </Stack>
  </Stack>
);

const LeaveArt = () => (
  <Box sx={mockSidePanelSx}>
    <Stack direction="row" alignItems="center" sx={mockSidePanelHeaderSx}>
      <Typography variant="overline" sx={mockSidePanelTitleSx}>
        Room
      </Typography>
      <ChevronLeft fontSize="small" color="disabled" />
    </Stack>
    <Stack spacing={1} sx={mockSidePanelBodySx}>
      <Typography variant="caption" color="text.disabled">
        Joined as
      </Typography>
      <Typography variant="body2" sx={mockOutlineButtonSx("secondary")}>
        Leave
      </Typography>
      <Typography variant="body2" sx={mockOutlineButtonSx("primary")}>
        Point scheme
      </Typography>
      <Typography variant="body2" sx={mockOutlineButtonSx("error")}>
        Delete room
      </Typography>
    </Stack>
  </Box>
);

export const communityTutorialPages = [
  {
    title: "Join the room",
    body: "The Room panel runs down the left side. Hit Join room to take a seat at the table. Once you are in, the panel shows who you joined as, with Leave underneath. Scrumlords also get Point scheme and Delete room there. Use the chevron to collapse it to a strip of icons.",
    art: <JoinPanelArt />,
  },
  {
    title: "Set yourself up",
    body: "Pick a user name and a color for your tile, then choose how you are joining. Voters get a card and estimate. Scrumlords run the session from their own panel without casting votes. Then hit Join.",
    art: <JoinDialogArt />,
  },
  {
    title: "Cast your vote",
    body: "Choose your points from the Pts dropdown and press Vote. Changed your mind? Vote again any time before the reveal.",
    art: <VoteControlsArt />,
  },
  {
    title: "Reveal, then reset",
    body: "Tiles turn blue as people lock in their votes, but the numbers stay hidden. Once everyone is in, hit Reveal to flip them all, then Reset to clear the board for the next story.",
    art: <RevealArt />,
  },
  {
    title: "Second thoughts show up orange",
    body: "Voting stays open after the reveal. If someone changes their number once the cards are face up, their card switches from blue to orange and stays that way until the next reset, so a late change never slips by unnoticed.",
    art: <DoubleVoteArt />,
  },
  {
    title: "Put a clock on it",
    body: "The voting timer gives the room a deadline. Set the seconds, start it, and when it runs out the votes reveal themselves automatically. Cancel stops the clock without revealing.",
    art: <TimerArt />,
  },
  {
    title: "Show only what you need",
    body: "The Display section of the menu switches each piece of the room on and off: the reactions bar, the animated background, the scrumlords panel, the activity log, and the voting timer.",
    art: <DisplayTogglesArt />,
  },
  {
    title: "Pick a point scheme",
    body: "Point scheme, in the Room panel, changes what the room votes with. Fibonacci, t-shirt sizes, yes/no, thumbs, even food emojis. The whole room switches together, and only scrumlords can change it.",
    art: <PointSchemeArt />,
  },
  {
    title: "Leaving and cleaning up",
    body: "Leave takes you out of the group and frees up your tile; you can always rejoin. Delete room, which only scrumlords see, removes the room for everyone in it, so use that one carefully.",
    art: <LeaveArt />,
  },
  {
    title: "Watch the status light",
    body: "The light in the top right corner shows whether the app is talking to the server.",
    art: <ConnectionStatusArt />,
  },
];
