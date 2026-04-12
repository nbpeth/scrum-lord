import { initParticlesEngine } from "@tsparticles/react";
import { loadParticlesLinksInteraction } from "@tsparticles/interaction-particles-links";
import { loadExternalPushInteraction } from "@tsparticles/interaction-external-push";
import { loadExternalRepulseInteraction } from "@tsparticles/interaction-external-repulse";
import { loadEmojiShape } from "@tsparticles/shape-emoji";
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
      await loadExternalPushInteraction(engine);
      await loadExternalRepulseInteraction(engine);
      
      try {
        await loadEmojiShape(engine);
      } catch (e) {
        console.warn(
          "tsParticles emoji shape failed to load; install @tsparticles/shape-emoji",
          e
        );
      }
    });
  }
  return engineInitPromise;
}
