import styled from "@emotion/styled";
import { useCallback } from "react";
import { loadStarsPreset } from "tsparticles-preset-stars";
import { Particles } from "react-tsparticles";

export function Stars(props) {
  const customInit = useCallback(async (engine) => {
    await loadStarsPreset(engine);
  });
  // https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_Particles_IParticlesOptions.IParticlesOptions.html#move
  const options = {
    // events: {
    //   onClick: {
    //     enable: true,
    //     mode: 'push', // This will push new particles on click
    //   },
    //   onHover: {
    //     enable: true,
    //     mode: 'repulse', // This will repulse particles on hover
    //   },
    // },
    // interactivity: {
    //   detectOn: 'canvas',
    //   detect_on: 'win',
    //   events: {
    //     onClick: {
    //       enable: true,
    //       mode: 'push', // This will push new particles on click
    //     },
    //     // onHover: {
    //     //   enable: true,
    //     //   mode: 'repulse', // This will repulse particles on hover
    //     // },
    //   },
    //   modes: {
    //     push: {
    //       quantity: 400, // This will push 4 new particles on click
    //     },
    //     // repulse: {
    //     //   distance: 200, // This will repulse particles within a distance of 200
    //     // },
    //   },
    // },
    preset: "stars",
    particles: {
      color: {
        value: "#BBFFFF",
      },
      number: { value: 50, density: { enable: true, value_area: 100 } },
      size: {
        value: 3,
      },
 
    },
  };

  return (
    <StyledParticles id="particles-stars" options={options} init={customInit} />
  );
}

const StyledParticles = styled(Particles)`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -3;
`;
