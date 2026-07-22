import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  appTitleSx,
  homeLinkStyle,
  menuIconSx,
  menuIconWrapperSx,
  menuPaperSx,
  versionItemSx,
} from "./DashboardTitleMenu.styles";

const openInNewTab = (url) => window.open(url, "_blank", "noopener,noreferrer");

export const DashboardTitleMenu = ({ version }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <MenuIcon
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={menuIconSx}
      />

      <Menu
        id="dashboard-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <Paper sx={menuPaperSx}>
          <MenuList>
            <MenuItem sx={versionItemSx}>{version}</MenuItem>
            <Divider />
            <MenuItem
              onClick={() =>
                openInNewTab("https://github.com/nbpeth/scrum-lord/releases")
              }
            >
              <ListItemIcon>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText secondary="Change log" />
            </MenuItem>
            <MenuItem
              onClick={() =>
                openInNewTab("https://github.com/nbpeth/scrum-lord/issues")
              }
            >
              <ListItemIcon>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText secondary="Issues" />
            </MenuItem>
            <Divider />
            <MenuItem>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.buymeacoffee.com/nbpetha"
              >
                <img
                  alt="Buy me pizza"
                  src="https://img.buymeacoffee.com/button-api/?text=Buy me pizza&emoji=🍕&slug=nbpetha&button_colour=BD5FFF&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"
                />
              </a>
            </MenuItem>
          </MenuList>
        </Paper>
      </Menu>
    </>
  );
};

export const ScrumLordMenu = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Grid item>
      <Grid container alignItems="center" spacing={2}>
        <Grid item sx={menuIconWrapperSx}>
          <MenuIcon
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={menuIconSx}
          />
          <Menu
            id="room-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {children}
          </Menu>
        </Grid>
        <Grid item>
          <Link to="/" style={homeLinkStyle}>
            <Typography fontFamily="monospace" variant="h6" component="div" sx={appTitleSx}>
              Scrum Lord
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};
