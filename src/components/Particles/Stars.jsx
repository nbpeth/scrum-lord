import styled from "@emotion/styled";
import { Particles } from "@tsparticles/react";

export function Stars(props) {
  const options = {
    preset: "stars",
    particles: {
      color: {
        value: "#BBFFFF",
      },
      number: { value: 50 },
      size: {
        value: 5,
      },
    },
  };

  return (
    <StyledParticles id="particles-stars" options={options} />
  );
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -3;
`;
