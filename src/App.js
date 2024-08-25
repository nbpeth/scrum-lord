import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import React, { useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { makeStyles } from "@mui/styles";
import "./App.css";
import { Fireworks } from "./components/Particles/Fireworks";
import { HyperSpace } from "./components/Particles/Hyperspace";
import { Stars } from "./components/Particles/Stars";
import { Community } from "./pages/Community/Community";
import { Dashboard } from "./pages/Dashboard/Dashboard";

import axios from "axios";

import { useEffect } from "react";
// import { ReactionMachine, Test } from "./components/Test/Test";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const useStyles = makeStyles({
  imageContainer: {},
  image: {
    position: "absolute",
    height: "300px",
    width: "300px",
    zIndex: -2,
    animation: "$move-image 60s linear infinite",
    "&:hover": {
      transform: "scale(2)", // Example: scale the image up on hover
    },
  },

  "@keyframes move-image": {
    "0%": {
      transform: "rotate(0deg)",
      left: "0vw",
      bottom: "-100vh",
    },
    // "25%": {
    //   transform: "rotate(180deg)",
    // },
    // "50%": {
    //   transform: "rotate(360deg)",
    // },
    // "75%": {
    //   transform: "rotate(540deg)",
    // },
    // "100%": {
    //   transform: "rotate(720deg)",
    //   left: "100vw",
    //   bottom: "100vh",
    // },
  },
});

// fix moon overscroll
// private room password
// operational cost / metrics on site
// remove "community" from app and replace with "room" or "space"
// clean up ephemeral rooms
// rate limiting?
/*
  const WebSocket = require('ws');
  const rateLimit = require('ws-rate-limit')('10 per minute');

  const wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    if (rateLimit(ip)) {
      ws.close(1008, 'Rate limit exceeded');
      return;
    }

    // Handle the WebSocket connection...
  });
*/

// todo: identify users that are or are not present
//    ----- ws message? last activity by user?wh
// todo: chat?
// todo: add sound to reveal

const App = () => {
  const [version, setVersion] = useState("");

  useEffect(() => {
    axios
      .get("https://api.github.com/repos/nbpeth/scrum-lord/tags")
      .then((response) => {
        if (response?.data?.length > 0) {
          setVersion(response.data[0].name);
        }
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <div className="App" style={{ height: "calc(100vh)" }}>
      <AppContent version={version} />
    </div>
  );
};

const AppContent = ({ version }) => {
  // const classes = useStyles();

  const [communityBackgroundIsAnimated, setCommunityBackgroundIsAnimated] =
    useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleCommunityBackgroundAnimationChange = (value) => {
    setCommunityBackgroundIsAnimated(value);
  };

  const handleCelebrationChange = (value) => {
    setIsCelebrating(value);
  };

  const roomComponent = (
    <div style={{ position: "relative" }}>
      {/* {communityBackgroundIsAnimated && (
        <div >
          <img
            id="moon-image"
            className={classes.image}
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png"
          />
        </div>
      )} */}
      <Community
        version={version}
        handleCelebrationChange={handleCelebrationChange}
        handleCommunityBackgroundAnimationChange={
          handleCommunityBackgroundAnimationChange
        }
      />
      {communityBackgroundIsAnimated && <Stars />}
      {isCelebrating && <Fireworks />}
    </div>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <HyperSpace />
          <Dashboard version={version} />
        </>
      ),
    },
    {
      path: "/communities/:communityId",
      element: roomComponent,
    },
    // {
    //   path: "/test",
    //   element: <ReactionMachine />,
    // },
    // {
    //   path: "/rooms/:roomId",
    //   element: roomComponent,waaw
    // },
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
