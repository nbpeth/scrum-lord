import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem, MenuList, Paper } from "@mui/material";
import { useState } from "react";

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
            <MenuItem onClick={createRoomClicked} sx={{ cursor: "pointer" }}>
              Create Room
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
