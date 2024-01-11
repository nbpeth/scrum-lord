import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";

const useStyles = makeStyles({
  cardReveal: {
    animation: "$reveal-card 2s ease-in-out",
  },
  "@keyframes reveal-card": {
    "0%": { transform: "perspective(200px) rotateY(0deg)" },
    "100%": { transform: "perspective(200px) rotateY(180deg)" },
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
}) => {
  const classes = useStyles();

  const isMyCard = iAmCitizen && citizen.userId === iAmCitizen.userId;
  const theme = useTheme();
  const { revealed } = currentCommunity;
  const { vote, hasVoted, username, userColor } = citizen;

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
        backgroundColor: hasVoted
          ? alpha(theme.palette.primary.dark, 0.8)
          : "none",

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
                  variant="body2"
                  color={userColor ?? theme.palette.grey[100]}
                >
                  {username}
                </Typography>
              </Grid>
            </Grid>

            <CitizenVote isMyCard={isMyCard} vote={vote} revealed={revealed} />
          </CardContent>

          <CardActions>
            <DeleteTwoToneIcon
              fontSize="x-small"
              sx={{ cursor: "pointer" }}
              onClick={() => handleDeleteUser(citizen)}
            />
          </CardActions>
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
