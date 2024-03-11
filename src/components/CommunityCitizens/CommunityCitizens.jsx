import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { CitizenCard } from "../../components/CitizenCard/CitizenCard";

import * as React from "react";

export const CommunityCitizens = ({
  citizens,
  iAmCitizen,
  handleDeleteUser,
  currentCommunity,
}) => {
  const theme = useTheme();
  const fullsizeScreen = useMediaQuery("(min-width:800px)");

  return (
    <Grid
      container
      direction="column"
      xs={12}
      spacing={3}
      sx={{ padding: "15px" }}
    >
      <Grid container item spacing={1} xs={12} justifyContent="center">
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
