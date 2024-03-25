import MenuIcon from "@mui/icons-material/Menu";
import {
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "react-router-dom";

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
        <Paper sx={{ background: "none" }}>
          <MenuList>
            <MenuItem>
              <a target="_blank" href="https://www.buymeacoffee.com/nbpetha">
                <img src="https://img.buymeacoffee.com/button-api/?text=Buy me pizza&emoji=🍕&slug=nbpetha&button_colour=BD5FFF&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00" />
              </a>
            </MenuItem>
            <MenuItem
              onClick={() => {
                window.open("https://github.com/nbpeth/scrum-lord/releases", "_blank");
              }}
              sx={{ cursor: "pointer" }}
            >
              <ListItemIcon>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText secondary="Change log" />
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

  const theme = useTheme();

  return (
    <Grid item>
      <Grid container alignItems="center" spacing={2}>
        <Grid item sx={{ marginTop: "5px" }}>
          <MenuIcon onClick={handleClick} sx={{ cursor: "pointer" }} />
          <Menu
            id="dashboard-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {children}
          </Menu>
        </Grid>
        <Grid item>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography
              fontFamily="monospace"
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: theme.palette.secondary.dark }}
            >
              Scrum Lord
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};
