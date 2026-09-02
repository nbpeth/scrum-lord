import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  Box,
  Card,
  CardContent,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  cardActionsRowSx,
  cardContentSx,
  cardContentVisibilitySx,
  citizenCardSx,
  citizenNameSx,
  citizenVoteBackground,
  deleteIconSx,
  voteValueSx,
} from "./CitizenCard.styles";

export const CitizenCard = ({
  citizen,
  currentCommunity,
  handleDeleteUser,
  iAmCitizen,
  position,
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
    <Tooltip title={username} placement="top" arrow enterTouchDelay={0}>
      <Card
        sx={citizenCardSx({
          isMyCard,
          backgroundColor,
          userColor,
          cardAnimating,
          animationClassPosition,
        })}
      >
        <Box component="span" sx={cardContentVisibilitySx(contentHidden)}>
          <CardContent sx={cardContentSx}>
            <CitizenName username={username} userColor={userColor} />
            <CitizenVote isMyCard={isMyCard} vote={vote} revealed={revealed} />
          </CardContent>
          <Box sx={cardActionsRowSx}>
            <DeleteTwoToneIcon
              aria-label={isMyCard ? undefined : `Remove ${username}`}
              sx={deleteIconSx(isMyCard)}
              onClick={isMyCard ? undefined : () => handleDeleteUser(citizen)}
            />
          </Box>
        </Box>
      </Card>
    </Tooltip>
  );
};

const CitizenName = ({ username, userColor }) => (
  <Typography variant="body2" sx={citizenNameSx(userColor)}>
    {username}
  </Typography>
);

export const CitizenVote = ({ isMyCard, revealed, vote }) => {
  const value = revealed || isMyCard ? vote ?? "-" : "?";

  return (
    <Typography variant="h3" component="div" sx={voteValueSx}>
      {value}
    </Typography>
  );
};
