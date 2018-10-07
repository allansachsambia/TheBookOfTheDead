var express = require("express");
var path = require("path");
var port = process.env.PORT || 8080;
var app = express();

app.use(express.static(path.join(__dirname, "./dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(port, function(err) {
  err ? console.error(err) : console.info("Listening on port: " + port);
});
