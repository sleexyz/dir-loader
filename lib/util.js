var assert = require("assert");

function placeholder(type) {
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


function replace(type, replacer) {
  assert(typeof type === "string");
  // assert replacer is function

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
        return replacer(decodeURI(p1));
      }
    );
  };
}

// String placeholderRequire(String)
// 
// Creates a placeholder to be 
// replaced by a require call
exports.requirePlaceholder = placeholder("require");


// String injectRequires(String)
//
// Transforms placeholders in a text to require's
exports.injectRequires = replace("require", function (str) {
  return "require(" + str + ")";
});


exports.symbolPlaceholder = placeholder("symbol");
exports.injectSymbols = replace("symbol", function(str) {
  return "[Symbol.for(" + str +  ")]";
});



//TODO:
//- implement require.ensures
