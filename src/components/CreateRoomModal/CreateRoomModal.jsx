import { WarningAmber } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { generate } from "random-words";
import { useState } from "react";

export const CreateRoomModal = ({ open, handleClose }) => {
  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [newCommunity, setNewCommunity] = useState({
    name: generate({
      exactly: 3,
      minLength: 5,
      join: "-",
      camelCase: true,
    }),
  });

  const getCommunityName = () => {
    if (!newCommunity.name) {
      return {
        ...newCommunity,
        name: generate({
          exactly: 3,
          minLength: 5,
          join: "-",
          camelCase: true,
        }),
      };
    }
    return newCommunity;
  };

  const close = (c) => {
    setNewCommunity({
      name: generate({
        exactly: 3,
        minLength: 5,
        join: "-",
        camelCase: true,
      }),
    });
    handleClose(c);
  };

  const [isPrivate, setIsPrivate] = useState(true);

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          close();
        }
      }}
    >
      <Box sx={style}>
        <Grid
          container
          justifyContent="center"
          direction="column"
          spacing={2}
          xs={12}
        >
          <Grid item>
            <Typography variant="body2">
              Create a new community! No name provided will result in an
              auto-generated name.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              value={newCommunity?.name}
              onChange={(e) =>
                setNewCommunity({ ...newCommunity, name: e.target.value })
              }
              label="Community Name"
              id="name"
            />
          </Grid>
          <Grid item container alignItems="center" spacing={1}>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPrivate}
                    onChange={(e) => {
                      setIsPrivate(e.target.checked);
                    }}
                  />
                }
                label="Private"
              />
            </Grid>
            <Grid item>
              {!isPrivate && (
                <Tooltip title="Public communities are visible to all users on the dashboard">
                  <WarningAmber color="warning" />
                </Tooltip>
              )}
            </Grid>
          </Grid>

          <Grid container item xs={12} justifyContent="space-between">
            <Grid item>
              <Button
                onClick={() => close({ ...getCommunityName(), isPrivate })}
              >
                Create
              </Button>
            </Grid>
            <Grid item>
              <Button color="error" onClick={() => close()}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
