import { Grid, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { CitizenCard } from "../CitizenCard/CitizenCard";
import { REVEAL_VARIANT_COUNT } from "../CitizenCard/CitizenCard.styles";
import {
  citizensContainerSx,
  emptyRoomSx,
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
        {citizens.length ? (
          votingCitizens.map((citizen, i) => (
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
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h5" sx={emptyRoomSx}>
              No one is here
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
