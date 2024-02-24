import MenuIcon from "@mui/icons-material/Menu";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import { useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";

export const DashboardTitleMenu = ({ createRoomClicked }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MenuIcon onClick={handleClick} sx={{ cursor: "pointer" }} />

      <Menu
        id="dashboard-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Paper sx={{ background: "none", width: 150, maxWidth: "100%" }}>
          <MenuList>
            <MenuItem
              onClick={() => {
                window.open("https://github.com/nbpeth/scrum-lord", "_blank");
              }}
              sx={{ cursor: "pointer" }}
            >
              <ListItemIcon>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText secondary="Support" />
            </MenuItem>
          </MenuList>
        </Paper>
      </Menu>
    </>
  );
};

export const ScrumLordMenu = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MenuIcon onClick={handleClick} sx={{ cursor: "pointer" }} />

      <Menu
        id="dashboard-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </>
  );
};
