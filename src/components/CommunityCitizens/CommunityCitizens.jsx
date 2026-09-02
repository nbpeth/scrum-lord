import { GroupAdd, HowToVote } from "@mui/icons-material";
import { Box, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { CitizenCard } from "../CitizenCard/CitizenCard";
import { REVEAL_VARIANT_COUNT } from "../CitizenCard/CitizenCard.styles";
import {
  citizensContainerSx,
  emptyRoomCardSx,
  emptyRoomHintSx,
  emptyRoomIconSx,
  emptyRoomIconWrapSx,
  emptyRoomSx,
  emptyRoomTitleSx,
  voteCardContainerSx,
} from "./CommunityCitizens.styles";

const randomRevealVariant = () =>
  Math.floor(Math.random() * REVEAL_VARIANT_COUNT);

export const CommunityCitizens = ({
  citizens,
  iAmCitizen,
  handleDeleteUser,
  currentCommunity,
}) => {
  const fullsizeScreen = useMediaQuery("(min-width:800px)");
  const { revealed } = currentCommunity;

  const [animationClassPosition, setAnimationClassPosition] = useState(0);
  useEffect(() => {
    if (!revealed) {
      setAnimationClassPosition(randomRevealVariant());
    }
  }, [revealed]);

  const votingCitizens = citizens.filter((c) => c.votingMember);

  return (
    <Grid
      id="community-citizens-container"
      container
      direction="column"
      spacing={2}
      sx={citizensContainerSx}
    >
      {votingCitizens.length ? (
        <Grid
          id="vote-card-container"
          item
          container
          spacing={1}
          alignContent="flex-start"
          alignItems="flex-start"
          justifyContent="center"
          sx={voteCardContainerSx}
        >
          {votingCitizens.map((citizen, i) => (
            <Grid
              item
              xs={fullsizeScreen ? 6 : 12}
              md={fullsizeScreen ? 4 : 12}
              lg={fullsizeScreen ? 3 : 12}
              key={citizen.userId}
            >
              <CitizenCard
                animationClassPosition={animationClassPosition}
                fullsizeScreen={fullsizeScreen}
                position={i}
                currentCommunity={currentCommunity}
                handleDeleteUser={handleDeleteUser}
                iAmCitizen={iAmCitizen}
                citizen={citizen}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyRoom watchersPresent={citizens.length > 0} />
      )}
    </Grid>
  );
};

const EmptyRoom = ({ watchersPresent }) => {
  const Icon = watchersPresent ? HowToVote : GroupAdd;

  return (
    <Grid item id="empty-room" sx={emptyRoomSx}>
      <Stack spacing={1.5} alignItems="center" sx={emptyRoomCardSx}>
        <Box sx={emptyRoomIconWrapSx}>
          <Icon sx={emptyRoomIconSx} />
        </Box>
        <Typography variant="h6" sx={emptyRoomTitleSx}>
          {watchersPresent ? "Nobody is holding a card" : "No one is here"}
        </Typography>
        <Typography variant="body2" sx={emptyRoomHintSx}>
          {watchersPresent
            ? "The room is watched over, but no one has joined as a Voter yet."
            : "Copy the room link from the menu and bring your friends"}
        </Typography>
      </Stack>
    </Grid>
  );
};
