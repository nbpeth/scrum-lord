import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { Grid, Tooltip, Typography, useTheme } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const LurkerBox = ({ lurkers, handleDeleteUser }) => {
  const theme = useTheme();

  return (
    <div>
      <Grid
        id="lurker-box"
        container
        direction="column"
        sx={{ paddingLeft: "15px" }}
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
        <div>
          <Grid id="lurker-box-list" container item direction="column">
            {lurkers.map((lurker) => (
              <Grid container id="lurker-box-list-item" key={lurker.userId}>
                <Grid item>
                  <DeleteTwoToneIcon
                    fontSize="small"
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleDeleteUser(lurker)}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    sx={{ whiteSpace: "nowrap" }}
                    variant="subtitle2"
                    fontSize="small"
                    color={theme.palette.grey[500]}
                  >
                    {lurker.username}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </div>
      </Grid>
    </div>
  );
};
