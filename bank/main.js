const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 443;

const keyFile = "private.pem";
const certFile = "cert.crt";

const options = {
  key: fs.readFileSync(path.join(__dirname, "secrets", keyFile)),
  cert: fs.readFileSync(path.join(__dirname, "secrets", certFile)),
};

app.use(express.static(path.join(__dirname, "public")));

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log("Listening on port " + port);
});
