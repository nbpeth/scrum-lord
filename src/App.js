import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import React, { useEffect, useMemo, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import { HyperSpace } from "./components/Particles/Hyperspace";
import { Stars } from "./components/Particles/Stars";
import { Community } from "./pages/Community/Community";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Fireworks } from "./components/Particles/Fireworks";
import { makeStyles } from "@mui/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const useStyles = makeStyles({
  animatedBackground: {
    // position: "fixed",
    zIndex: -100,
    background:
      "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png) no-repeat",
    backgroundSize: "200px 200px",
    animation: "$move-background-angle 60s linear infinite",
  },
  "@keyframes move-background-angle": {
    "0%": {
      backgroundPosition: "0 0",
    },
    "100%": {
      backgroundPosition: "100% 100%",
    },
  },
});


// todo: logged in voting member toggle
// todo: fix moon / fireworks css explosion
// todo: keep client from disconnecting
// todo: full postgres URL
// todo: dev/prod socket URL
// todo: same vote synergy animation / sound
// todo: add sound to reveal

const App = () => {
  return (
    <div className="App">
      <AppContent />
    </div>
  );
};

const AppContent = () => {
  const classes = useStyles();

  const [communityBackgroundIsAnimated, setCommunityBackgroundIsAnimated] =
    useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleCommunityBackgroundAnimationChange = (value) => {
    setCommunityBackgroundIsAnimated(value);
  };

  const handleCelebrationChange = (value) => {
    setIsCelebrating(value);
  };

  useMemo(() => {}, [isCelebrating]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <HyperSpace />
          <Dashboard />
        </>
      ),
    },
    {
      path: "/communities/:communityId",
      element: (
        // <div>
        <div className={communityBackgroundIsAnimated && classes.animatedBackground}>
          <Community
            handleCelebrationChange={handleCelebrationChange}
            handleCommunityBackgroundAnimationChange={
              handleCommunityBackgroundAnimationChange
            }
          />
          {communityBackgroundIsAnimated && <Stars />}
          {false && <Fireworks />}
        </div>
      ),
    },
  ]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};


export default App;
