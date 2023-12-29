import { Grid, Typography, useTheme } from "@mui/material";
import { CitizenCard } from "../../components/CitizenCard/CitizenCard";

import * as React from "react";

export const CommunityCitizens = ({
  citizens,
  iAmCitizen,
  handleDeleteUser,
  currentCommunity,
}) => {
  const theme = useTheme();
  return (
    <Grid container direction="column">
      <Grid container item spacing={3} xs={12} justifyContent="center">
        {citizens.length ? (
          citizens.map((citizen) => {
            return (
              <Grid item xs={2} key={citizen.userId}>
                <CitizenCard
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
            <Typography color={theme.palette.grey[700]} variant="h5" sx={{ fontStyle: "italic" }}>
              No one is here
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid container item></Grid>
    </Grid>
  );
};
