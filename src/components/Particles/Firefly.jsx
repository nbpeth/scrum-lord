import styled from "@emotion/styled";
import { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadFireflyPreset } from "tsparticles-preset-firefly";

export function Firefly(props) {
  const customInit = useCallback(async (engine) => {
    await loadFireflyPreset(engine);
  });

  const options = {
    preset: "firefly",
    // https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_Particles_IParticlesOptions.IParticlesOptions.html
    particles: {
      size: {
        value: 10,
      },
      number: {
        value: 1000,
      },
      
    },
  };

  return <StyledParticles options={options} init={customInit} />;
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
`;
