import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import { HyperSpace } from "./components/Particles/Hyperspace";
import { Stars } from "./components/Particles/Stars";
import { Community } from "./pages/Community/Community";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Fireworks } from "./components/Particles/Fireworks";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <div className="App">
      <AppContent />
    </div>
  );
};

const AppContent = () => {
  const [communityBackgroundIsAnimated, setCommunityBackgroundIsAnimated] =
    useState(false);

  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleCommunityBackgroundAnimationChange = (value) => {
    setCommunityBackgroundIsAnimated(value);
  };

  const handleCelebrationChange = (value) => {
    setIsCelebrating(value);
  };

  useEffect(() => {}, [isCelebrating]);

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
        <>
          <Community
            handleCelebrationChange={handleCelebrationChange}
            handleCommunityBackgroundAnimationChange={
              handleCommunityBackgroundAnimationChange
            }
          />
          {communityBackgroundIsAnimated && <Stars />}
          {isCelebrating && <Fireworks />}
        </>
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
