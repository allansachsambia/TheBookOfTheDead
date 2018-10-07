var path = require("path");
var express = require("express");
var fs = require("fs");
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "./dist")));
app.listen(port, function(err) {
  err ? console.error(err) : console.info("Listening on port: " + port);
});
