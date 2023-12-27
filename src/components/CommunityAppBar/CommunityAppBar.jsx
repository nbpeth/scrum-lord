import MenuIcon from "@mui/icons-material/Menu";
import {
    Button,
    IconButton,
    Toolbar,
    Typography,
    styled,
    useTheme
} from "@mui/material";
import { Link } from "react-router-dom";
import logoUrl from "../../scrumlord-logo-1.jpg";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import * as React from "react";

const drawerWidth = 240;

// not yet used, need to refactor
export const Main = () =>
  styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    ...(open && {
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const CommunityAppBar = ({
  currentCommunity,
  handleLeave,
  handleJoin,
  iAmCitizen,
}) => {
  const [open, setOpen] = React.useState(false);

  const theme = useTheme();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>

          <Link to="/" style={{ textDecoration: "none" }}>
            <img src={logoUrl} height="50" width="50" />
          </Link>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            {currentCommunity && currentCommunity.name}
          </Typography>
          {/* {!iAmCitizen ? (
              <Button variant="contained" color="primary" onClick={handleJoin}>
                Join
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleLeave}>
                Leave
              </Button>
            )} */}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* join component */}
          {!iAmCitizen ? (
            <Button variant="outlined" color="success" onClick={handleJoin}>
              Join
            </Button>
          ) : (
            <Button variant="outlined" color="secondary" onClick={handleLeave}>
              Leave
            </Button>
          )}
        </List>
        {/* join component */}

        <Divider />
      </Drawer>
    </>
  );
};
