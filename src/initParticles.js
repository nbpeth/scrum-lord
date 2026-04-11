import { initParticlesEngine } from "@tsparticles/react";
import { loadFireworksPreset } from "@tsparticles/preset-fireworks";
import { loadHyperspacePreset } from "@tsparticles/preset-hyperspace";
import { loadStarsPreset } from "@tsparticles/preset-stars";

export function initAppParticlesEngine() {
  return initParticlesEngine(async (engine) => {
    await loadHyperspacePreset(engine);
    await loadStarsPreset(engine);
    await loadFireworksPreset(engine);
  });
}
