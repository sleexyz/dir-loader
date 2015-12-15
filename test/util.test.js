var assert = require("assert");
var util = require("../lib/util");

var requirePlaceholder = util.genPlaceholder("require");
var requireReplacer = util.genReplacer("require", function (str) {
  return "require(" + str + ")";
});

var testcases = [
  "./blog",
  "/blog",
  "<",
  "<///",
  ""
];

function requireToPath (str) {
  return str.slice(8, str.length -1);

}

describe("./lib/util", function () {
  for ( var i = 0; i< testcases.length; i++) {
    var testcase = testcases[i];

    it("should escape " + JSON.stringify(testcase), function() {
      var source = JSON.stringify(requirePlaceholder(testcase));
      var output = requireReplacer(source);
      var identity = JSON.parse(requireToPath(output));
      assert(testcase === identity);
    });

  }
});
