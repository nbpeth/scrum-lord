import styled from "@emotion/styled";
import { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadFountainPreset } from "tsparticles-preset-fountain";

export function Fountain(props) {
  const customInit = useCallback(async (engine) => {
    await loadFountainPreset(engine);
  });

  const options = {
    preset: "fountain",
  };

  return <StyledParticles options={options} init={customInit} />;
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
`;
