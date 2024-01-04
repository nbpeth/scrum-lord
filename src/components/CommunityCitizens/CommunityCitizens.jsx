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
            .filter((c) => c.votingMember)
            .map((citizen) => {
              return (
                <Grid item key={citizen.userId}>
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
