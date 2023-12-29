import styled from "@emotion/styled";
import { useCallback } from "react";
import { loadSeaAnemonePreset } from "tsparticles-preset-sea-anemone";
import { Particles } from "react-tsparticles";

export function SeaAnemone(props) {
  const customInit = useCallback(async (engine) => {
    await loadSeaAnemonePreset(engine);
  });

  const options = {
    
    preset: "seaAnemone",
  };

  return <StyledParticles options={options} init={customInit} />;
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
`;
