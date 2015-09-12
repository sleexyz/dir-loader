var assert = require("assert");

// String placeholderRequire(String)
// 
// Creates a placeholder to be 
// replaced by a require call
exports.requirePlaceholder = function(requirePath) {
  assert(typeof requirePath === "string");

  // <, doesn't come up in an URI
  // /// doesn't come up in directory names

  return "<///" + encodeURI(JSON.stringify(requirePath)) + "///>";
};


// String injectRequires(String)
//
// Transforms placeholders in a text to require's
exports.injectRequires = function(input) {
  return input.replace(
      /\"<\/\/\/(.*)\/\/\/>\"/gm,
    function (match, p1) {
      return "require(" + decodeURI(p1) + ")";
    }
  );
};




//TODO:
//- implement require.ensures
