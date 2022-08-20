module.exports = {
  plugins: [
    require("pineglade-w3c").getPosthtmlW3c({
      forceOffline: true
    }),
  ],
};
