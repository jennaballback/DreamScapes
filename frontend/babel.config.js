module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["module-resolver", {
        alias: {
          "@": "./src",
          "nanoid/non-secure": "./src/shims/nanoid-non-secure",
        },
      }],
    ],
  };
};
