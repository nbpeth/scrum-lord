import { memo, useMemo } from "react";
import { Particles } from "@tsparticles/react";
import "./particles.css";

export const HyperSpace = memo(function HyperSpace() {
  const options = useMemo(
    () => ({
      preset: "hyperspace",
      particles: {
        color: {
          value: "#BBFFFF",
        },
        size: {
          value: 3,
        },
      },
    }),
    []
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Particles
        id="particles-hyperspace"
        className="hyperspace-canvas-host"
        options={options}
      />
    </div>
  );
});
