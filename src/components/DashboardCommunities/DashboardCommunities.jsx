import { Schedule } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { differenceInDays, format, isValid, parseISO } from "date-fns";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import emptyImgUrl from "../../missing-5.png";

function sortCommunitiesForDisplay(communities) {
  if (!communities?.length) return [];
  return [...communities]
    .sort((a, b) => (b.synergy?.value ?? 0) - (a.synergy?.value ?? 0))
    .map((community) => {
      if (!community?.lastModified) {
        return { ...community, idle: null };
      }
      const idle = differenceInDays(new Date(), parseISO(community.lastModified));
      return { ...community, idle };
    })
    .sort((a, b) => (a.idle ?? 0) - (b.idle ?? 0));
}

function formatLastActivity(lastModified) {
  if (!lastModified) return null;
  const d =
    typeof lastModified === "string" ? parseISO(lastModified) : new Date(lastModified);
  if (!isValid(d)) return null;
  return format(d, "MMM d, yyyy · h:mm a");
}

export const DashboardCommunities = ({ communities, fullsizeScreen }) => {
  const sorted = useMemo(
    () => sortCommunitiesForDisplay(communities),
    [communities]
  );

  return (
    <Stack spacing={1.5} sx={{ width: "100%" }}>
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
  const theme = useTheme();
  const { idle } = community;
  const isIdle = Boolean(idle);
  const lastActivityLabel = formatLastActivity(community?.lastModified);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        background: alpha(theme.palette.background.paper, 0.55),
        backdropFilter: "blur(8px)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.35)}`,
          borderColor: alpha(theme.palette.primary.main, 0.45),
        },
      }}
    >
      <CardActionArea
        component={NavLink}
        to={`/communities/${community.id}`}
        sx={{
          textAlign: "left",
          px: 2,
          py: 1.75,
          "&.Mui-focusVisible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 600,
                fontSize: fullsizeScreen ? "1.1rem" : "1rem",
                color: "text.primary",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: { xs: "normal", sm: "nowrap" },
              }}
            >
              {community.name}
            </Typography>
            {fullsizeScreen && lastActivityLabel && (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5 }}
              >
                Last activity {lastActivityLabel}
              </Typography>
            )}
          </Box>
          {fullsizeScreen && isIdle && (
            <Tooltip placement="top" arrow title="No recent activity">
              <Chip
                icon={
                  <Schedule sx={{ fontSize: "1rem !important", opacity: 0.9 }} />
                }
                label={`${idle}d idle`}
                size="small"
                sx={{
                  flexShrink: 0,
                  borderColor: alpha(theme.palette.warning.main, 0.5),
                  color: "warning.light",
                  bgcolor: alpha(theme.palette.warning.dark, 0.2),
                }}
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
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{
        py: 4,
        px: 2,
        textAlign: "center",
      }}
    >
      <Box
        component="img"
        src={emptyImgUrl}
        alt=""
        sx={{
          height: { xs: 100, sm: 120 },
          width: { xs: 100, sm: 120 },
          borderRadius: "50%",
          objectFit: "contain",
          opacity: 0.85,
        }}
      />
      <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 500 }}>
        No rooms here yet
      </Typography>
      <Typography variant="body2" sx={{ color: "text.disabled", maxWidth: 280 }}>
        Create a room with <strong>New room</strong> and it will show up in this list.
      </Typography>
    </Stack>
  );
};
