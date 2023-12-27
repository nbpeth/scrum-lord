import styled from "@emotion/styled";
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { loadStarsPreset } from "tsparticles-preset-stars";

export function Stars(props) {
  const customInit = useCallback(async (engine) => {
    await loadStarsPreset(engine);
  });

  const options = {
    preset: "stars",
  };

  return <StyledParticles options={options} init={customInit} />;
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
`;
