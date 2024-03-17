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
import emptyImgUrl from "../../missing-5.png";

export const DashboardCommunities = ({
  communities,
  context,
  fullsizeScreen,
}) => {
  const isPrivateContext = context === "private";

  return (
    <Grid
      container
      item
      spacing={2}
      xs={12}
      justifyContent="center"
      // sx={{ height: "100%" }}
    >
      {communities && communities.length > 0 ? (
        communities
          ?.sort((a, b) => b.synergy?.value - a.synergy?.value)
          .map((community) => {
            if (!community?.lastModified) {
              return community;
            }
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
                <CommunityCard
                  fullsizeScreen={fullsizeScreen}
                  isPrivateContext={isPrivateContext}
                  community={community}
                />
              </Grid>
            );
          })
      ) : (
        <EmptyDash />
      )}
    </Grid>
  );
};

export const CommunityCard = ({
  community,
  isPrivateContext,
  fullsizeScreen,
}) => {
  const theme = useTheme();

  const { idle } = community;

  return (
    <NavLink
      to={`/communities/${community.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
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
        <CardContent
          sx={{
            backgroundColor: isPrivateContext
              ? alpha(theme.palette.secondary.dark, 0.25)
              : "none",
          }}
        >
          <Grid
            container
            // justifyContent="space-between"
            alignItems="center"
            alignContent="center"
          >
            <Grid item xs={6}>
              <Typography variant="h5" color={theme.palette.grey[500]}>
                {community.name}
              </Typography>
            </Grid>
            {fullsizeScreen && (
              <Grid container item xs={6}>
                <Grid container spacing={1} item xs={12} textAlign="right">
                  <Grid item xs={10}>
                    {community?.lastModified && (
                      <Typography
                        variant="body2"
                        color={theme.palette.grey[300]}
                      >
                        Last Activity{": "}
                        {format(community?.lastModified, "MM/dd/yyyy:HH:mm")}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={2}>
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
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </NavLink>
  );
};

export const EmptyDash = () => {
  const theme = useTheme();
  return (
    <Grid
      container
      xs={12}
      sx={{
        // height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      direction="column"
      justifyContent="center"
      spacing={2}
    >
      <Grid item>
        <img
          src={emptyImgUrl}
          alt="Scrum lord"
          style={{
            height: "20vh",
            width: "20vh",
            borderRadius: "50%",
            objectFit: "contain",
          }}
        />
      </Grid>
      <Grid item alignContent="center" textAlign="center">
        <Typography
          variant="h5"
          fontStyle="italic"
          color={theme.palette.grey[500]}
        >
          The stars show me nothing
        </Typography>
      </Grid>
    </Grid>
  );
};
