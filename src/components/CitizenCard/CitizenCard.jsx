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
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const useStyles = makeStyles({
  cardReveal: {
    animation: `$reveal-card-${getRandomInt(0,4)} 2s ease-in-out`,
  },
  "@keyframes reveal-card-0": {
    "0%": { transform: "perspective(300px) rotateY(0deg)" },
    "100%": { transform: "perspective(300px) rotateY(180deg)" },
  },
  "@keyframes reveal-card-1": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  "@keyframes reveal-card-2": {
    "0%": { opacity: 0, transform: "translateY(50px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  "@keyframes reveal-card-3": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.5)" },
    "100%": { transform: "scale(1)" },
  },
  "@keyframes reveal-card-4": {
    "0%, 100%": { filter: "blur(0px)" },
    "50%": { filter: "blur(1000px)" },
  },
  contentHide: {
    visibility: "hidden",
  },
  contentShow: {
    animation: "$show-content 500ms ease-in forwards",
  },
  "@keyframes show-content": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
});

export const CitizenCard = ({
  citizen,
  currentCommunity,
  handleDeleteUser,
  iAmCitizen,
  position,
  fullsizeScreen,
}) => {
  const classes = useStyles();

  const isMyCard = iAmCitizen && citizen.userId === iAmCitizen.userId;
  const theme = useTheme();
  const { revealed } = currentCommunity;
  const { vote, hasVoted, username, userColor, doubleVote } = citizen;

  const [cardAnimating, setCardAnimating] = useState(false);
  const [cardAnimationInitiated, setCardAnimationInitiated] = useState(false);

  useEffect(() => {
    // animation triggers, probably could use some refinement

    // initial 'reveal' trigger from the server, we should display the card values
    if (revealed) {
      // initiate the animation which hides the content of the card, so you can't see the values while it's "flipping"
      setCardAnimationInitiated(true);

      setTimeout(() => {
        // initiate the flipping animation offset by the position of the card (flip them in order left to right)
        setCardAnimating(true);

        setTimeout(() => {
          // clear animation state after two seconds
          setCardAnimating(false);
          setCardAnimationInitiated(false);
        }, 2000);
      }, position * 250);
    }
  }, [position, revealed]);

  const getBackgroundColor = () => {
    if (hasVoted && doubleVote) {
      return alpha(theme.palette.warning.dark, 0.8);
    } else if (hasVoted && !doubleVote) {
      return alpha(theme.palette.primary.dark, 0.8);
    }

    return "none";
  };

  if (fullsizeScreen) {
    return (
      <CitizenCardDesktop
        theme={theme}
        revealed={revealed}
        cardAnimationInitiated={cardAnimationInitiated}
        handleDeleteUser={handleDeleteUser}
        citizen={citizen}
        getBackgroundColor={getBackgroundColor}
        isMyCard={isMyCard}
        classes={classes}
        cardAnimating={cardAnimating}
      />
    );
  }

  return (
    <CitizenCardMobile
      theme={theme}
      revealed={revealed}
      cardAnimationInitiated={cardAnimationInitiated}
      handleDeleteUser={handleDeleteUser}
      citizen={citizen}
      getBackgroundColor={getBackgroundColor}
      isMyCard={isMyCard}
      classes={classes}
      cardAnimating={cardAnimating}
    />
  );
};

export const CitizenCardDesktop = ({
  handleDeleteUser,
  cardAnimationInitiated,
  citizen,
  getBackgroundColor,
  isMyCard,
  classes,
  revealed,
  cardAnimating,
  theme,
}) => {
  const { vote, hasVoted, username, userColor, doubleVote } = citizen;
  return (
    <Card
      className={cardAnimating ? classes.cardReveal : null}
      key={citizen.id}
      sx={{
        padding: "10px",
        minWidth: "100px",
        border: isMyCard
          ? `1px solid ${theme.palette.primary.dark}`
          : `1px solid ${theme.palette.grey[800]}`,
        backgroundColor: getBackgroundColor(),
        cursor: "pointer",
        transition: "background .5s ease-in-out",
        "&:hover": {
          backgroundColor: alpha(theme.palette.grey[800], 1),
        },
      }}
    >
      <span
        className={
          cardAnimationInitiated ? classes.contentHide : classes.contentShow
        }
      >
        <div>
          <CardContent
            sx={{
              padding: "5px",
              textAlign: "center",
            }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <Typography
                  variant="body"
                  fontWeight="bold"
                  color={userColor ?? theme.palette.grey[100]}
                >
                  {username}
                </Typography>
              </Grid>
            </Grid>

            <CitizenVote isMyCard={isMyCard} vote={vote} revealed={revealed} />
          </CardContent>

          <CardActionArea>
            <CardActions>
              {!isMyCard ? (
                <DeleteTwoToneIcon
                  fontSize="x-small"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleDeleteUser(citizen)}
                />
              ) : (
                <DeleteTwoToneIcon
                  fontSize="x-small"
                  sx={{ cursor: "none", opacity: 0}}
                  
                />
              )}
            </CardActions>
          </CardActionArea>
        </div>
      </span>
    </Card>
  );
};

export const CitizenCardMobile = ({
  handleDeleteUser,
  cardAnimationInitiated,
  citizen,
  getBackgroundColor,
  isMyCard,
  classes,
  revealed,
  cardAnimating,
  theme,
}) => {
  const { vote, hasVoted, username, userColor, doubleVote } = citizen;
  return (
    <Card
      className={cardAnimating ? classes.cardReveal : null}
      key={citizen.id}
      sx={{
        padding: "10px",
        minWidth: "100px",
        border: isMyCard
          ? `1px solid ${theme.palette.primary.dark}`
          : `1px solid ${theme.palette.grey[800]}`,
        backgroundColor: getBackgroundColor(),
        cursor: "pointer",
        transition: "background .5s ease-in-out",
        "&:hover": {
          backgroundColor: alpha(theme.palette.grey[800], 1),
        },
      }}
    >
      <span
        className={
          cardAnimationInitiated ? classes.contentHide : classes.contentShow
        }
      >
        <div>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            xs={12}
            direction="row"
          >
            <Grid item xs={8}>
              <Typography
                variant="body"
                fontWeight="bold"
                color={userColor ?? theme.palette.grey[100]}
              >
                {username}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <CitizenVote
                isMyCard={isMyCard}
                vote={vote}
                revealed={revealed}
              />
            </Grid>
            <Grid item xs={2}>
              {
                !isMyCard && (
                  <DeleteTwoToneIcon
                    fontSize="x-small"
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleDeleteUser(citizen)}
                  />
                )
              }
            </Grid>
          </Grid>
        </div>
      </span>
    </Card>
  );
};

export const CitizenVote = ({ isMyCard, revealed, vote }) => {
  const getValue = () => {
    if (revealed || isMyCard) {
      return vote ?? "-";
    }
    return "?";
  };

  return (
    <Typography variant="h3" sx={{ fontWeight: "bold" }}>
      {getValue()}
    </Typography>
  );
};
