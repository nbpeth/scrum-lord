import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const REVEAL_KEYFRAMES = [
  {
    "0%": { transform: "perspective(300px) rotateY(0deg)" },
    "100%": { transform: "perspective(300px) rotateY(180deg)" },
  },
  {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  {
    "0%": { opacity: 0, transform: "translateY(50px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.5)" },
    "100%": { transform: "scale(1)" },
  },
  {
    "0%, 100%": { filter: "blur(0px)" },
    "50%": { filter: "blur(1000px)" },
  },
];

export const CitizenCard = ({
  citizen,
  currentCommunity,
  handleDeleteUser,
  iAmCitizen,
  position,
  fullsizeScreen,
  animationClassPosition,
}) => {
  const theme = useTheme();

  const isMyCard = iAmCitizen && citizen.userId === iAmCitizen.userId;
  const { revealed } = currentCommunity;
  const { vote, hasVoted, username, userColor, doubleVote } = citizen;

  const [cardAnimating, setCardAnimating] = useState(false);
  const [contentHidden, setContentHidden] = useState(false);

  useEffect(() => {
    if (!revealed) {
      return;
    }

    const staggerMs = position * 250;
    const timers = [];
    setContentHidden(true);
    timers.push(
      setTimeout(() => {
        setCardAnimating(true);
        timers.push(
          setTimeout(() => {
            setCardAnimating(false);
            setContentHidden(false);
          }, 2000)
        );
      }, staggerMs)
    );

    return () => timers.forEach(clearTimeout);
  }, [position, revealed]);

  const backgroundColor = hasVoted
    ? alpha(
        doubleVote ? theme.palette.warning.dark : theme.palette.primary.dark,
        0.8
      )
    : "none";

  return (
    <Card
      sx={{
        padding: "10px",
        minWidth: "100px",
        border: `1px solid ${
          isMyCard ? theme.palette.primary.dark : theme.palette.grey[800]
        }`,
        backgroundColor,
        cursor: "pointer",
        transition: "background .5s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.grey[800],
        },
        ...(cardAnimating && {
          animation: `citizen-card-reveal-${animationClassPosition} 2s ease-in-out`,
          [`@keyframes citizen-card-reveal-${animationClassPosition}`]:
            REVEAL_KEYFRAMES[animationClassPosition] ?? REVEAL_KEYFRAMES[0],
        }),
      }}
    >
      <Box
        component="span"
        sx={
          contentHidden
            ? { visibility: "hidden" }
            : {
                animation: "citizen-card-content-show 500ms ease-in forwards",
                "@keyframes citizen-card-content-show": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }
        }
      >
        {fullsizeScreen ? (
          <>
            <CardContent sx={{ padding: "5px", textAlign: "center" }}>
              <CitizenName username={username} userColor={userColor} />
              <CitizenVote isMyCard={isMyCard} vote={vote} revealed={revealed} />
            </CardContent>
            <CardActionArea>
              <CardActions>
                <DeleteTwoToneIcon
                  fontSize="x-small"
                  sx={
                    isMyCard
                      ? { cursor: "none", opacity: 0 }
                      : { cursor: "pointer" }
                  }
                  onClick={isMyCard ? undefined : () => handleDeleteUser(citizen)}
                />
              </CardActions>
            </CardActionArea>
          </>
        ) : (
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            direction="row"
          >
            <Grid item xs={8}>
              <CitizenName username={username} userColor={userColor} />
            </Grid>
            <Grid item xs={2}>
              <CitizenVote isMyCard={isMyCard} vote={vote} revealed={revealed} />
            </Grid>
            <Grid item xs={2}>
              {!isMyCard && (
                <DeleteTwoToneIcon
                  fontSize="x-small"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleDeleteUser(citizen)}
                />
              )}
            </Grid>
          </Grid>
        )}
      </Box>
    </Card>
  );
};

const CitizenName = ({ username, userColor }) => {
  const theme = useTheme();
  return (
    <Typography
      variant="body"
      fontWeight="bold"
      color={userColor ?? theme.palette.grey[100]}
    >
      {username}
    </Typography>
  );
};

export const CitizenVote = ({ isMyCard, revealed, vote }) => {
  const value = revealed || isMyCard ? vote ?? "-" : "?";

  return (
    <Typography variant="h3" sx={{ fontWeight: "bold" }}>
      {value}
    </Typography>
  );
};
