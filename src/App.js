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
  imageContainer: {
    
  },
  image: {
    position: "absolute",
    height: "300px",
    width: "300px",
    zIndex: -2,
    animation: "$move-image 60s linear infinite",
    '&:hover': {
      transform: 'scale(2)', // Example: scale the image up on hover
    },
  },

  "@keyframes move-image": {
    "0%": {
      transform: "rotate(0deg)",
      left: "30vw",
      bottom: "-35vh",
    },
    "25%": {
      transform: "rotate(180deg)",
    },
    "50%": {
      transform: "rotate(360deg)",
    },
    "75%": {
      transform: "rotate(540deg)",
    },
    "100%": {
      transform: "rotate(720deg)",
      left: "85vw",
      bottom: "115vh",
    },
  },
});


// todo: connect button: if disconnected should allow the user to reconnect
//       should the app attempt to reconnect automatically?
// todo: identify users that are or are not present
// todo: chat?
// todo: logged in voting member toggle
// todo: add sound to reveal
// todo: max sessions error
// todo: redirect to community after it is created


const App = () => {
  return (
    <div className="App" style={{ height: "calc(100vh)" }}>
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
        <div>
          {communityBackgroundIsAnimated && (
            <div>
              <img
                id="moon-image"
                className={classes.image}
                src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png"
              />
            </div>
          )}
          <Community
            handleCelebrationChange={handleCelebrationChange}
            handleCommunityBackgroundAnimationChange={
              handleCommunityBackgroundAnimationChange
            }
          />
          {communityBackgroundIsAnimated && <Stars />}
          {isCelebrating && <Fireworks />}
        </div>
      ),
    },
  ]);

  return (
    <div style={{ height: "100%" }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
};

export default App;
