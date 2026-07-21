import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { CitizenCard } from "../CitizenCard/CitizenCard";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const CommunityCitizens = ({
  citizens,
  iAmCitizen,
  handleDeleteUser,
  currentCommunity,
}) => {
  const theme = useTheme();
  const fullsizeScreen = useMediaQuery("(min-width:800px)");
  const { revealed } = currentCommunity;

  const [animationClassPosition, setAnimationClassPosition] = useState(0);
  useEffect(() => {
    if (!revealed) {
      setAnimationClassPosition(getRandomInt(0, 4));
    }
  }, [revealed]);

  const votingCitizens = citizens.filter((c) => c.votingMember);

  return (
    <Grid
      id="community-citizens-container"
      container
      direction="column"
      spacing={2}
      sx={{
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        alignItems: "stretch",
        justifyContent: "flex-start",
      }}
    >
      <Grid
        id="vote-card-container"
        item
        container
        spacing={1}
        alignContent="flex-start"
        alignItems="flex-start"
        justifyContent="center"
        sx={{
          mt: 1.25,
          mx: 0,
          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
        }}
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
            <Typography
              color={theme.palette.grey[700]}
              variant="h5"
              sx={{ fontStyle: "italic" }}
            >
              No one is here
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
