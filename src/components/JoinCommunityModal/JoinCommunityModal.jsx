import {
  Box,
  Button,
  Grid,
  MenuItem,
  Modal,
  Select,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { generate } from "random-words";
import { useState } from "react";
import * as uuidv4 from "uuid";

import * as React from "react";
import { Refresh } from "@mui/icons-material";
export const JoinCommunityModal = ({ open, handleClose }) => {
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

  const theme = useTheme();

  const setNewRandomName = () => {
    setNewUser({
      ...newUser,
      username: newRandomUserName(),
    });
  };

  const newRandomUserName = () => {
    return generate({
      exactly: 2,
      minLength: 5,
      join: " ",
      camelCase: true,
    });
  };

  const [newUser, setNewUser] = useState({
    username: newRandomUserName(),
  });

  const [votingMemberChecked, setVotingMemberChecked] = useState(true);

  const getUserName = () => {
    return {
      ...newUser,
      userId: uuidv4.v4(),
      votingMember: votingMemberChecked,
    };
  };

  const onClose = (c, x) => {
    // generate a new random name for next time
    setNewUser({
      username: newRandomUserName(),
    });
    handleClose(c);
  };

  const onColorChange = (color) => {
    setNewUser({ ...newUser, userColor: color });
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
    >
      <Box sx={style}>
        <Grid container justifyContent="left" spacing={2}>
          {votingMemberChecked && (
            <Grid container item xs={12} alignItems="center" spacing={1}>
              <Grid item xs={11}>
                <TextField
                  fullWidth
                  value={newUser?.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  label="User Name"
                  id="username"
                />
              </Grid>
              <Grid item xs={1}>
                <Refresh
                  onClick={() => setNewRandomName()}
                  sx={{ cursor: "pointer" }}
                />
              </Grid>
            </Grid>
          )}
          <Grid container item alignItems="center" xs={12} spacing={2}>
            <Grid item xs={12}>
              <ColorSelector onColorChange={onColorChange} />
            </Grid>
            <Grid item>
              <Switch
                checked={votingMemberChecked}
                onChange={(c) => {
                  setVotingMemberChecked(c.target.checked);
                }}
              />
            </Grid>
            <Grid>
              <Typography variant="body2" color={theme.palette.grey[400]}>
                Voting Member
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} justifyContent="space-between">
            <Grid item>
              <Button
                variant="contained"
                onClick={() => onClose(getUserName())}
                disabled={votingMemberChecked && !newUser?.username}
              >
                Join
              </Button>
            </Grid>
            <Grid item>
              <Button color="error" onClick={() => onClose()}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export const ColorSelector = ({ onColorChange }) => {
  const colors = [
    "#AD28FC",
    "#D160BD",
    "#4F90DA",
    "#DFB48D",
    "#3E07AA",
    "#19314E",
    "#EA0208",
    "#71EB28",
    "#6FE7BD",
    "#F448DB",
    "#D857B6",
    "#133652",
    "#161AC9",
    "#D49B17",
    "#5E5112",
    "#578A60",
    "#640EB3",
    "#2E43CC",
    "#5B7AD0",
    "#2530D5",
    "#D4F9DE",
    "#E6B27C",
    "#D3C2D5",
    "#6FBEAF",
    "#CC5B6A",
  ];

  const [selectedColor, setSelectedColor] = useState(
    colors[Math.floor(Math.random() * colors.length - 1)]
  );

  React.useEffect(() => {
    onColorChange(selectedColor);
  }, []);

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    onColorChange(e.target.value);
  };

  return (
    <div>
      <Select
        fullWidth
        labelId="color-selector-label"
        id="color-selector"
        value={selectedColor}
        label="Color"
        onChange={handleColorChange}
        MenuProps={{ style: { maxHeight: "400px" } }}
      >
        {colors.map((color) => {
          return (
            <MenuItem value={color} id={color}>
              <Grid container alignItems="center">
                <Grid item>
                  <div
                    id={`color-${color}`}
                    style={{ height: "10px", width: "10px", background: color }}
                  />
                </Grid>
                <Grid item>
                  <div style={{ paddingLeft: "10px" }}>
                    <Typography variant="body2">{color}</Typography>
                  </div>
                </Grid>
              </Grid>
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};
