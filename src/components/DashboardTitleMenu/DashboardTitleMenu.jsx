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
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const openInNewTab = (url) => window.open(url, "_blank", "noopener,noreferrer");

export const DashboardTitleMenu = ({ version }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <MenuIcon
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ cursor: "pointer" }}
      />

      <Menu
        id="dashboard-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <Paper sx={{ background: "none" }}>
          <MenuList>
            <MenuItem sx={{ cursor: "default" }}>{version}</MenuItem>
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
  const theme = useTheme();

  return (
    <Grid item>
      <Grid container alignItems="center" spacing={2}>
        <Grid item sx={{ marginTop: "5px" }}>
          <MenuIcon
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{ cursor: "pointer" }}
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
