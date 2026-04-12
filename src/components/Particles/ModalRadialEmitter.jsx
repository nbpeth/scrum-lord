import { memo, useEffect, useMemo, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Particles } from "@tsparticles/react";
import { initAppParticlesEngine } from "../../initParticles";
import "./particles.css";

export const ModalRadialEmitter = memo(function ModalRadialEmitter({
  embedded = false,
}) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    initAppParticlesEngine()
      .then(() => {
        if (!cancelled) setEngineReady(true);
      })
      .catch((err) => {
        console.error("tsParticles engine init failed (join modal backdrop)", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: {
        color: { value: "transparent" },
      },
      detectRetina: true,
      fpsLimit: 30,
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
      particles: {
        number: { value: 0 },
      },
      emitters: {
        autoPlay: true,
        position: {
          x: 50,
          y: 50,
        },
        size: {
          width: 8,
          height: 8,
          mode: "percent",
        },
        rate: {
          delay: 0.14,
          quantity: 1,
        },
        particles: {
          color: {
            value: "#9922FF",
          },
          shape: { type: "circle" },
          opacity: {
            value: { min: 0.55, max: 1 },
          },
          size: {
            value: { min: 2, max: 7 },
          },
          life: {
            count: 1,
            duration: {
              value: { min: 12, max: 22 },
            },
          },
          move: {
            enable: true,
            speed: { min: 2.5, max: 6.5 },
            direction: "outside",
            random: false,
            straight: true,
            outModes: {
              default: "destroy",
            },
          },
        },
      },
    }),
    []
  );

  if (reduceMotion || !engineReady) {
    return null;
  }

  const rootStyle = embedded
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }
    : {
        position: "fixed",
        inset: 0,
        width: "100%",
        minHeight: "100vh",
        height: "100%",
        zIndex: 1290,
        pointerEvents: "none",
        isolation: "isolate",
      };

  return (
    <div className="modal-radial-emitter-root" style={rootStyle}>
      <Particles
        id="particles-modal-radial-emitter"
        className="modal-radial-emitter-host"
        options={options}
      />
    </div>
  );
});
