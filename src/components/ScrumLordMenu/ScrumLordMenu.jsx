import MenuIcon from "@mui/icons-material/Menu";
import { Grid, Menu, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  appTitleSx,
  homeLinkStyle,
  menuIconSx,
  menuIconWrapperSx,
} from "./ScrumLordMenu.styles";

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
            <Typography
              fontFamily="monospace"
              variant="h6"
              component="div"
              sx={appTitleSx}
            >
              Scrum Lord
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};
