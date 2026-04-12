import { memo, useEffect, useId, useMemo, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Particles } from "@tsparticles/react";
import { initAppParticlesEngine } from "../../initParticles";
import "./particles.css";

function mergeDeep(base, override) {
  if (override === undefined || override === null) {
    return base;
  }
  if (Array.isArray(override)) {
    return override;
  }
  if (typeof override !== "object") {
    return override;
  }
  const out = base && typeof base === "object" && !Array.isArray(base) ? { ...base } : {};
  for (const key of Object.keys(override)) {
    const b = base && typeof base === "object" ? base[key] : undefined;
    const o = override[key];
    if (
      o &&
      typeof o === "object" &&
      !Array.isArray(o) &&
      b &&
      typeof b === "object" &&
      !Array.isArray(b)
    ) {
      out[key] = mergeDeep(b, o);
    } else {
      out[key] = o;
    }
  }
  return out;
}

const defaultStellarOrbitOptions = (orbitSpawnBoxPercent) => ({
  fullScreen: { enable: false },
  background: {
    color: { value: "transparent" },
  },
  detectRetina: true,
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: false },
      onClick: { enable: false },
    },
  },
  particles: {
    number: {
      value: 0,
    },
    color: {
      value: ["#9922FF", "#B366FF", "#7B4DFF", "#C49BFF"],
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: { min: 0.35, max: 0.95 },
    },
    size: {
      value: { min: 6, max: 15 },
    },
    links: {
      enable: true,
      distance: 300,
      color: "#B366FF",
      opacity: 0.35,
      width: 5,
    },
    move: {
      enable: true,
      speed: { min: 0.1, max: 1 },
      direction: "none",
      random: false,
      straight: false,
      outModes: {
        default: "none",
      },
      spin: {
        enable: true,
        position: { x: 50, y: 50 },
        acceleration: 0,
      },
    },
  },
  emitters: {
    autoPlay: true,
    position: { x: 50, y: 50 },
    size: {
      width: orbitSpawnBoxPercent,
      height: orbitSpawnBoxPercent,
      mode: "percent",
    },
    startCount: 9,
    rate: {
      delay: 0.5,
      quantity: 0,
    },
  },
});

/** Orbiting linked dots (tsParticles `move.spin`). */
export const StellarOrbit = memo(function StellarOrbit({
  embedded = false,
  /** Deep-merged into defaults (arrays replace; nested objects merge). */
  optionsOverrides,
  /** Default emitter box size (% of canvas); smaller → tighter orbits. */
  orbitSpawnBoxPercent = 70,
}) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [engineReady, setEngineReady] = useState(false);
  const reactId = useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;
    initAppParticlesEngine()
      .then(() => {
        if (!cancelled) setEngineReady(true);
      })
      .catch((err) => {
        console.error("tsParticles engine init failed (StellarOrbit)", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(() => {
    const base = defaultStellarOrbitOptions(orbitSpawnBoxPercent);
    return optionsOverrides ? mergeDeep(base, optionsOverrides) : base;
  }, [orbitSpawnBoxPercent, optionsOverrides]);

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
    <div className="stellar-orbit-root" style={rootStyle}>
      <Particles
        id={`particles-stellar-orbit-${reactId}`}
        className="stellar-orbit-host"
        options={options}
      />
    </div>
  );
});
