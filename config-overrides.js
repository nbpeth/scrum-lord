module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    util: require.resolve("util/"),
    path: require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser")

  };
  return config;
};
