var loadDirectory= require("./loadDirectory");

module.exports = function(options, loaderThis) {
  var code = "module.exports = " + loadDirectory(options, loaderThis) + ";";
  return code;
};
