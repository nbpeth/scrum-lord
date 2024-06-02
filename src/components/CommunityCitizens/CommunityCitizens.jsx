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
  const containerRef = React.useRef(null);
  const theme = useTheme();
  const fullsizeScreen = useMediaQuery("(min-width:800px)");
  const pointScheme = currentCommunity?.pointScheme ?? "fibonacci";
  const votes = currentCommunity?.citizens?.map((c) => c.vote);

  React.useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        console.log("resize", containerRef.current.clientWidth);
        setContainerWidth(containerRef.current.clientWidth);
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef.current]);

  return (
    <Grid
      container
      direction="row"
      xs={12}
      spacing={3}
      justifyContent="center"
      sx={{ padding: "15px", height: "100%", position: "relative" }}
    >
      <Grid xs={12} item id="point-chart-container">
        {currentCommunity?.revealed && (
          <div ref={containerRef}>
            <PointChart
              votes={votes}
              pointScheme={pointScheme}
              containerWidth={containerWidth}
            />
          </div>
        )}
      </Grid>

      <Grid
        id="vote-card-container"
        container
        item
        spacing={1}
        // overlap chart
        sx={{
          transform:
            currentCommunity?.revealed &&
            `translateY(-${containerWidth / 2}px)`,
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
                  md={fullsizeScreen ? 3 : 12}
                  lg={fullsizeScreen ? 2 : 12}
                  key={citizen.userId}
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
      <Grid container item></Grid>
    </Grid>
  );
};
