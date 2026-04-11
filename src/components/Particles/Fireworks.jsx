import styled from "@emotion/styled";
import { Particles } from "@tsparticles/react";

export function Fireworks(props) {
  const options = {
    preset: "fireworks",
  };

  return <StyledParticles id="particles-fireworks" options={options} />;
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -2;
`;
