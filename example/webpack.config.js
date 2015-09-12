var path = require("path");
module.exports = {
  entry: path.join(__dirname, "entry.js"),
  output: {
    filename: path.join(__dirname, "bundle.js")
  },
  module: { loaders: [
    { test: /\.md$/, loaders:  ["html", "remarkable"]},
  ]}
};
