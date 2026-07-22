import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Grid, Tooltip, Typography } from "@mui/material";
import {
  deleteLurkerIconSx,
  lurkerBoxSx,
  lurkerNameSx,
} from "./LurkerBox.styles";

export const LurkerBox = ({ lurkers, handleDeleteUser }) => {
  return (
    <Grid
      id="lurker-box"
      container
      direction="column"
      sx={lurkerBoxSx}
      alignContent="flex-start"
      alignItems="flex-start"
    >
      <Grid item>
        <Tooltip
          title={`Non-voting members: ${lurkers.length} present`}
          arrow
          placement="top-end"
        >
          {lurkers.length > 0 ? (
            <Visibility color="warning" />
          ) : (
            <VisibilityOff color="info" />
          )}
        </Tooltip>
      </Grid>
      <Grid id="lurker-box-list" container item direction="column">
        {lurkers.map((lurker) => (
          <Grid container id="lurker-box-list-item" key={lurker.userId}>
            <Grid item>
              <DeleteTwoToneIcon
                fontSize="small"
                sx={deleteLurkerIconSx}
                onClick={() => handleDeleteUser(lurker)}
              />
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" fontSize="small" sx={lurkerNameSx}>
                {lurker.username}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};
