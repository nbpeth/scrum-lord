const fs = require("fs");
const path = require("path");

/**
 * Hoisted @tsparticles/engine can stay on 3.0.x while presets ship 3.9.x under
 * their own node_modules. @tsparticles/react then loads a stale tsParticles
 * singleton (no checkVersion). Prefer the preset tree’s engine when present.
 */
function resolveTsparticlesEngineDir() {
  const nested = path.join(
    __dirname,
    "node_modules/@tsparticles/preset-hyperspace/node_modules/@tsparticles/engine"
  );
  if (fs.existsSync(path.join(nested, "package.json"))) {
    return nested;
  }
  try {
    return path.dirname(require.resolve("@tsparticles/engine/package.json"));
  } catch {
    return path.join(__dirname, "node_modules/@tsparticles/engine");
  }
}

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    util: require.resolve("util/"),
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
  };

  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    "@tsparticles/engine": resolveTsparticlesEngineDir(),
  };

  return config;
};
