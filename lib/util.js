var assert = require("assert");


// genPlaceholder :: (type :: String) -> (str :: String) -> replacerment :: String
exports.genPlaceholder = function(type) {
  assert(typeof type === "string");
  return function(str) {
    assert(typeof str === "string");

    // <, doesn't come up in an URI
    // /// doesn't come up in directory names

    return "<///@" + type + "@"
      + encodeURI(JSON.stringify(str))
      + "@" + type + "@///>";
  };
}


// genReplacer :: (type :: String, replacerFunc :: (placeholder :: String) -> replacerment :: String) -> (input :: String) -> replacerdInput :: String
exports.genReplacer = function(type, replacerFunc) {
  assert(typeof type === "string");
  // assert replacerr is function

  return function(input){
    assert(typeof input === "string");
    var regexp = new RegExp(
        "\"<\/\/\/@" + type + "@"
        + "(.*)"
        + "@" + type + "@\/\/\/>\"",
        "gm"
        );
    return input.replace(
        regexp,
        function (match, p1) {
          return replacerFunc(decodeURI(p1));
        }
        );
  };
};
