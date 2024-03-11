import {
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { differenceInDays, format, parseISO } from "date-fns";
import { NavLink } from "react-router-dom";

import { Schedule } from "@mui/icons-material";

export const DashboardCommunities = ({ communities }) => {
  return (
    <Grid container item spacing={2} xs={12} justifyContent="center">
      {communities
        ?.sort((a, b) => b.synergy?.value - a.synergy?.value)
        .map((community) => {
          const idle = differenceInDays(
            new Date(),
            parseISO(community?.lastModified)
          );

          return { ...community, idle };
        })
        .sort((a, b) => a.idle - b.idle)
        .map((community) => {
          return (
            <Grid item xs={12} md={12} key={community.id}>
              <CommunityCard community={community} />
            </Grid>
          );
        })}
    </Grid>
  );
};

export const CommunityCard = ({ community }) => {
  const theme = useTheme();

  const { idle } = community;

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: idle
          ? alpha(theme.palette.grey[900], 0.5)
          : alpha(theme.palette.primary.dark, 0.5),

        transition: "background .25s ease-in-out",
        "&:hover": {
          backgroundColor: idle
            ? alpha(theme.palette.grey[500], 0.5)
            : alpha(theme.palette.secondary.dark, 1),
        },
      }}
    >
      <CardContent>
        <NavLink
          to={`/communities/${community.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            alignContent="center"
          >
            <Grid item xs={6}>
              <Typography variant="h5" color={theme.palette.grey[100]}>
                {community.name}
              </Typography>
            </Grid>

            <Grid container item xs={6}>
              <Grid item xs={11} textAlign="right">
                {Boolean(idle) && (
                  <Tooltip placement="top-end" arrow title="Idle">
                    <Schedule
                      sx={{
                        fontSize: "medium",
                        color: theme.palette.secondary.dark,
                      }}
                    />
                  </Tooltip>
                )}
                {community?.lastModified && (
                  <Typography variant="body2" color={theme.palette.grey[300]}>
                    Last Activity{" "}
                    {format(community?.lastModified, "MM/dd/yyyy:HH:mm")}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </NavLink>
      </CardContent>
    </Card>
  );
};
