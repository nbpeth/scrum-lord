const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const STATIC_PATH = path.join(__dirname, "..", "build");

const createApp = () => {
  const app = express();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    if (
      ["production", "test"].includes(process.env.ENV) &&
      req.headers["x-forwarded-proto"] !== "https"
    ) {
      return res.redirect(["https://", req.get("Host"), req.url].join(""));
    }

    next();
  });

  app.use(express.static(STATIC_PATH));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get("*", (_, res) => {
    res.sendFile(path.join(STATIC_PATH, "index.html"));
  });

  return app;
};

module.exports = createApp();
module.exports.createApp = createApp;
