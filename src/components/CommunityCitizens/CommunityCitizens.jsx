import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { CitizenCard } from "../../components/CitizenCard/CitizenCard";

import * as React from "react";
import { PointChart } from "../PointChart/PointChart";

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

  return (
    <Grid
      id="community-citizens-container"
      container
      direction="row"
      xs={12}
      spacing={0}
      // sx={{ background: "green" }}
    >
      <Grid
        xs={2}
        item
        id="point-chart-container"
        // spacing={1}
        // sx={{ background: "red", }}
      >
        {currentCommunity?.revealed && (
          <div
            ref={containerRef}
            style={{ height: "100%" }}
          >
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
          // background: "blue",
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
