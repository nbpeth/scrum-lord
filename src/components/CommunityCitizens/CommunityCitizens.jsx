import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { CitizenCard } from "../../components/CitizenCard/CitizenCard";

import * as React from "react";
import { PointChart } from "../PointChart/PointChart";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const CommunityCitizens = ({
  citizens,
  iAmCitizen,
  handleDeleteUser,
  currentCommunity,
}) => {
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [containerDimensions, setContainerDimensions] = React.useState({
    containerWidth: 0,
    containerHeight: 0,
  });
  const containerRef = React.useRef(null);
  const theme = useTheme();
  const fullsizeScreen = useMediaQuery("(min-width:800px)");
  const pointScheme = currentCommunity?.pointScheme ?? "fibonacci";
  const votes = currentCommunity?.citizens?.map((c) => c.vote);
  const { revealed } = currentCommunity;

  React.useLayoutEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setContainerDimensions({
          containerWidth: containerRef.current.clientWidth,
          containerHeight: containerRef.current.offsetHeight,
        });
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [animationClassPosition, setAnimationClassPosition] = React.useState(0);

  React.useEffect(() => {
    if (!revealed) {
      setAnimationClassPosition(getRandomInt(0, 4));
    }
  }, [revealed]);

  return (
    <Grid
      id="community-citizens-container"
      container
      direction="column"
      xs={12}
      spacing={2}
    >
      <Grid xs={2} item id="point-chart-container">
        {currentCommunity?.revealed && (
          <div ref={containerRef} style={{ height: "100%" }}>
            <PointChart
              votes={votes}
              pointScheme={pointScheme}
              containerWidth={containerWidth}
              containerDimensions={containerDimensions}
            />
          </div>
        )}
      </Grid>

      <Grid
        xs={8}
        id="vote-card-container"
        item
        container
        spacing={1}
        alignContent="flex-start"
        sx={{
          margin: "10px 0px 0px 30px",
        }}
        justifyContent="center"
      >
        {citizens.length ? (
          citizens
            ?.filter((c) => c.votingMember)
            .map((citizen, i) => {
              return (
                <Grid
                  item
                  xs={fullsizeScreen ? 6 : 12}
                  md={fullsizeScreen ? 4 : 12}
                  lg={fullsizeScreen ? 3 : 12}
                  key={citizen.userId}
                  // spacing={1}
                  // sx={{margin: "5px"}}
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
              );
            })
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
