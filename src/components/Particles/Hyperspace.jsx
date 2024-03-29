import styled from "@emotion/styled";
import { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadHyperspacePreset } from "tsparticles-preset-hyperspace";

export function HyperSpace(props) {
  const customInit = useCallback(async (engine) => {
    await loadHyperspacePreset(engine);
  });

  const options = {
    preset: "hyperspace",
    particles: {
      color: {
        value: "#BBFFFF",
      },
      size: {
        value: 3
      }
    }
  };

  return <StyledParticles options={options} init={customInit} />;
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
`;
