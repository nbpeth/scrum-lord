const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const startServer = () => {
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
      res.redirect(["https://", req.get("Host"), req.url].join(""));
    }

    next();
  });

  const staticPath = path.join(__dirname, "..", "build");

  app.use(express.static(staticPath));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get("*", (_, res) => {
    res.sendFile(staticPath);
  });
};

startServer();

module.exports = app;
