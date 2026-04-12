import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { Particles } from "@tsparticles/react";
import { initAppParticlesEngine } from "../../initParticles";

 
export function HotDogAlertParticles() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initAppParticlesEngine()
      .then(() => setReady(true))
      .catch((err) => {
        console.error("HotDogAlert: particle engine init failed", err);
        setReady(true);
      });
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      detectRetina: true,
      fpsLimit: 60,
      pauseOnBlur: true,
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          push: {
            quantity: 4,
            duration: 1,
            factor: 60,
            speed: 1,
            maxSpeed: 40,
            direction: "random"
          },
          repulse: {
            distance: 300,
            duration: 1,
            factor: 60,
            speed: 1,
            maxSpeed: 40,
          },
        },
      },
      particles: {
        number: { value: 40 },
        reduceDuplicates: false,
        shape: {
          type: "emoji",
          options: {
            emoji: {
              value: "🌭",
            },
          },
        },
        opacity: {
          value: { min: 0.55, max: 0.95 },
          animation: {
            enable: true,
            speed: 1.5,
            sync: false,
            destroy: "none",
          },
        },
        size: {
          value: { min: 20, max: 56 },
        },
        rotate: {
          value: { min: 0, max: 360 },
          direction: "random",
          animation: {
            enable: true,
            speed: { min: 12, max: 48 },
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: { min: 2, max: 11 },
          direction: "bottom",
          straight: false,
          random: true,
          outModes: {
            default: "out",
          },
        },
        life: {
          count: 0,
          delay: {
            value: {
              min: 0,
              max: 2.5,
            },
            sync: false,
          },
        },
      },
    }),
    []
  );

  if (!ready) {
    return null;
  }

  return <StyledParticles id="particles-hotdog-alert" options={options} />;
}

const StyledParticles = styled(Particles)`
  position: fixed !important;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;

  & canvas {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
  }
`;
