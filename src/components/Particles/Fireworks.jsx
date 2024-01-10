import styled from "@emotion/styled";
import { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadFireworksPreset } from "tsparticles-preset-fireworks";

export function Fireworks(props) {
  const customInit = useCallback(async (engine) => {
    await loadFireworksPreset(engine);
  });

  const options = {
    preset: "fireworks",
  };

  return <StyledParticles options={options} init={customInit} />;
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
`;
