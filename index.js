var dirLoader = require("./lib/dir-loader");

module.exports = function(options) {
  var code = "module.exports = " + dirLoader(options) + ";";
  return code;
};
