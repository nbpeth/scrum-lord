import styled from "@emotion/styled";
import { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadFirePreset } from "tsparticles-preset-fire";

export function Fire(props) {
  const customInit = useCallback(async (engine) => {
    await loadFirePreset(engine);
  });

  const options = {
    preset: "fire",
  };

  return <StyledParticles options={options} init={customInit} />;
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
`;
