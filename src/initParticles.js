import { initParticlesEngine } from "@tsparticles/react";
import { loadParticlesLinksInteraction } from "@tsparticles/interaction-particles-links";
import { loadFireworksPreset } from "@tsparticles/preset-fireworks";
import { loadHyperspacePreset } from "@tsparticles/preset-hyperspace";
import { loadStarsPreset } from "@tsparticles/preset-stars";

let engineInitPromise = null;

/** Single shared init for App + modal particles (await before mounting `<Particles />`). */
export function initAppParticlesEngine() {
  if (!engineInitPromise) {
    engineInitPromise = initParticlesEngine(async (engine) => {
      await loadHyperspacePreset(engine);
      await loadStarsPreset(engine);
      await loadFireworksPreset(engine);
      await loadParticlesLinksInteraction(engine);
    });
  }
  return engineInitPromise;
}
