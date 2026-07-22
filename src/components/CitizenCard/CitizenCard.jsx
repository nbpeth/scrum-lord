import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  cardContentVisibilitySx,
  citizenCardSx,
  citizenVoteBackground,
  deleteIconSx,
  desktopCardContentSx,
  voteValueSx,
} from "./CitizenCard.styles";

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

  const backgroundColor = citizenVoteBackground({ theme, hasVoted, doubleVote });

  return (
    <Card
      sx={citizenCardSx({
        isMyCard,
        backgroundColor,
        cardAnimating,
        animationClassPosition,
      })}
    >
      <Box component="span" sx={cardContentVisibilitySx(contentHidden)}>
        {fullsizeScreen ? (
          <>
            <CardContent sx={desktopCardContentSx}>
              <CitizenName username={username} userColor={userColor} />
              <CitizenVote isMyCard={isMyCard} vote={vote} revealed={revealed} />
            </CardContent>
            <CardActionArea>
              <CardActions>
                <DeleteTwoToneIcon
                  fontSize="x-small"
                  sx={deleteIconSx(isMyCard)}
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
                  sx={deleteIconSx(false)}
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
    <Typography variant="h3" sx={voteValueSx}>
      {value}
    </Typography>
  );
};
