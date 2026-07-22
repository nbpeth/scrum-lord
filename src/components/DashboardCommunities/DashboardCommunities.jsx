import { Schedule } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { differenceInDays, format, isValid, parseISO } from "date-fns";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import emptyImgUrl from "../../missing-5.png";
import {
  emptyDashHintSx,
  emptyDashImageSx,
  emptyDashSx,
  emptyDashTitleSx,
  idleChipIconSx,
  idleChipSx,
  lastActivitySx,
  roomCardActionSx,
  roomCardSx,
  roomListStackSx,
  roomNameBoxSx,
  roomNameSx,
} from "./DashboardCommunities.styles";

function sortCommunitiesForDisplay(communities) {
  if (!communities?.length) return [];
  return [...communities]
    .sort((a, b) => (b.synergy?.value ?? 0) - (a.synergy?.value ?? 0))
    .map((community) => {
      if (!community?.lastModified) {
        return { ...community, idle: null };
      }
      const idle = differenceInDays(
        new Date(),
        parseISO(community.lastModified)
      );
      return { ...community, idle };
    })
    .sort((a, b) => (a.idle ?? 0) - (b.idle ?? 0));
}

function formatLastActivity(lastModified) {
  if (!lastModified) return null;
  const d =
    typeof lastModified === "string"
      ? parseISO(lastModified)
      : new Date(lastModified);
  if (!isValid(d)) return null;
  return format(d, "MMM d, yyyy · h:mm a");
}

export const DashboardCommunities = ({ communities, fullsizeScreen }) => {
  const sorted = useMemo(
    () => sortCommunitiesForDisplay(communities),
    [communities]
  );

  return (
    <Stack spacing={1.5} sx={roomListStackSx}>
      {sorted.length > 0 ? (
        sorted.map((community) => (
          <CommunityCard
            key={community.id}
            fullsizeScreen={fullsizeScreen}
            community={community}
          />
        ))
      ) : (
        <EmptyDash />
      )}
    </Stack>
  );
};

export const CommunityCard = ({ community, fullsizeScreen }) => {
  const { idle } = community;
  const isIdle = Boolean(idle);
  const lastActivityLabel = formatLastActivity(community?.lastModified);

  return (
    <Card elevation={0} sx={roomCardSx}>
      <CardActionArea
        component={NavLink}
        to={`/communities/${community.id}`}
        sx={roomCardActionSx}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box sx={roomNameBoxSx}>
            <Typography
              variant="h6"
              component="span"
              sx={roomNameSx(fullsizeScreen)}
            >
              {community.name}
            </Typography>
            {fullsizeScreen && lastActivityLabel && (
              <Typography variant="body2" sx={lastActivitySx}>
                Last activity {lastActivityLabel}
              </Typography>
            )}
          </Box>
          {fullsizeScreen && isIdle && (
            <Tooltip placement="top" arrow title="No recent activity">
              <Chip
                icon={<Schedule sx={idleChipIconSx} />}
                label={`${idle}d idle`}
                size="small"
                sx={idleChipSx}
                variant="outlined"
              />
            </Tooltip>
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export const EmptyDash = () => {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} sx={emptyDashSx}>
      <Box component="img" src={emptyImgUrl} alt="" sx={emptyDashImageSx} />
      <Typography variant="h6" sx={emptyDashTitleSx}>
        No rooms here yet
      </Typography>
      <Typography variant="body2" sx={emptyDashHintSx}>
        Create a room with <strong>New room</strong> and it will show up in
        this list.
      </Typography>
    </Stack>
  );
};
