import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import {
  appContentStyle,
  appStyle,
  dashboardMainSx,
  roomPageSx,
} from "./App.styles";
import { Fireworks } from "./components/Particles/Fireworks";
import { HotDogAlertParticles } from "./components/Particles/HotDogAlert";
import { PlanetaryOrbit } from "./components/Particles/PlanetaryOrbit";
import { Stars } from "./components/Particles/Stars";
import { initAppParticlesEngine } from "./initParticles";
import { Community } from "./pages/Community/Community";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { darkTheme } from "./theme";

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
    <div className="App" style={appStyle}>
      <AppContent version={version} />
    </div>
  );
};

const AppContent = ({ version }) => {
  const [particlesReady, setParticlesReady] = useState(false);
  const [communityBackgroundIsAnimated, setCommunityBackgroundIsAnimated] =
    useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isHotDogAlert, setIsHotDogAlert] = useState(false);

  useEffect(() => {
    initAppParticlesEngine()
      .then(() => setParticlesReady(true))
      .catch((err) => console.error("tsParticles init failed", err));
  }, []);

  const handleGlobalEvent = useCallback((event) => {
    if (event?.type === "hotdogalert") {
      setIsHotDogAlert(Boolean(event.value));
    }
  }, []);

  const roomComponent = (
    <Box sx={roomPageSx}>
      <Community
        version={version}
        handleCelebrationChange={setIsCelebrating}
        handleCommunityBackgroundAnimationChange={
          setCommunityBackgroundIsAnimated
        }
        handleGlobalEvent={handleGlobalEvent}
      />
      {particlesReady && communityBackgroundIsAnimated && <Stars />}
      {particlesReady && isCelebrating && <Fireworks />}
      {isHotDogAlert && <HotDogAlertParticles />}
    </Box>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <PlanetaryOrbit
            orbitalRings={[
              { speed: 0.3, bodies: 2, bodySize: 20 },
              { speed: 0.15, bodySize: 10, bodies: 4 },
              { speed: 0.3, bodySize: 50 },
              { speed: 0.19, bodies: 2, bodySize: 10 },
            ]}
          />
          <Box component="main" sx={dashboardMainSx}>
            <Dashboard version={version} />
          </Box>
        </>
      ),
    },
    {
      path: "/communities/:communityId",
      element: roomComponent,
    },
  ]);

  return (
    <div style={appContentStyle}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
};

export default App;
