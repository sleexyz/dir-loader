var assert = require("assert");
var mock = require("mock-fs");
var loadDirectory = require("../lib/loadDirectory");


var mockContext = "/";

var _date = new Date();




describe("./lib/loadDirectory", function() {
  beforeEach(function() {
    mock ({
      "/\u2764\u2764": {
        "\u2764": {
          "\u2764.md": mock.file({
            content: "beep boop",
            mtime: _date
          }),
          "\u2764.png": mock.file({
            content: "beep boop",
            mtime: _date
          })
        },
        "\u2764.md": mock.file({
          content: "beep boop",
          mtime: _date
        })
      }
    });
  });
  it("should work for absolute paths", function() {
    var options = {
      path: "/\u2764\u2764/"
    };

    var expected = "{\n  \"❤\": {\n    \"❤.md\": {\n      \"src\": require(\"/❤❤/❤/❤.md\"),\n      \"size\": 9,\n      \"mtime\": " + JSON.stringify(_date) + "\n    },\n    \"❤.png\": {\n      \"src\": require(\"/❤❤/❤/❤.png\"),\n      \"size\": 9,\n      \"mtime\": " + JSON.stringify(_date) + "\n    }\n  },\n  \"❤.md\": {\n    \"src\": require(\"/❤❤/❤.md\"),\n    \"size\": 9,\n    \"mtime\": "+ JSON.stringify(_date) + "\n  }\n}";


    assert(loadDirectory(options, mockContext)
           ===
           expected);
  });

  it("should work for relative paths", function() {
    var options = {
      path: "./\u2764\u2764/"
    };
    var expected = "{\n  \"❤\": {\n    \"❤.md\": {\n      \"src\": require(\"./❤❤/❤/❤.md\"),\n      \"size\": 9,\n      \"mtime\": " + JSON.stringify(_date) + "\n    },\n    \"❤.png\": {\n      \"src\": require(\"./❤❤/❤/❤.png\"),\n      \"size\": 9,\n      \"mtime\": " + JSON.stringify(_date) + "\n    }\n  },\n  \"❤.md\": {\n    \"src\": require(\"./❤❤/❤.md\"),\n    \"size\": 9,\n    \"mtime\": "+ JSON.stringify(_date) + "\n  }\n}";
    assert(loadDirectory(options, mockContext)
           ===
           expected);
  });
  it("should filter files properly", function() {
    var options = {
      path: "./\u2764\u2764/",
      filter: /\.md$/
    };
    var expected = "{\n  \"❤\": {\n    \"❤.md\": {\n      \"src\": require(\"./❤❤/❤/❤.md\"),\n      \"size\": 9,\n      \"mtime\": " + JSON.stringify(_date) + "\n    }\n  },\n  \"❤.md\": {\n    \"src\": require(\"./❤❤/❤.md\"),\n    \"size\": 9,\n    \"mtime\": "+ JSON.stringify(_date) + "\n  }\n}";
    assert(loadDirectory(options, mockContext)
           ===
           expected);
  });
  it("should filter directories properly", function() {
    var options = {
      path: "./\u2764\u2764/",
      filter: /\.md$/,
      dirFilter: /.{2}/
    };
    var expected = "{\n  \"❤.md\": {\n    \"src\": require(\"./❤❤/❤.md\"),\n    \"size\": 9,\n    \"mtime\": " + JSON.stringify(_date) + "\n  }\n}";

    assert(loadDirectory(options, mockContext)
           ===
           expected);
  });
  it("should transform path properly", function() {
    var options = {
      path: "./\u2764\u2764/",
      pathTransform: function(_) { return "bundle!" + _;}
    };
    var expected = "{\n  \"❤\": {\n    \"❤.md\": {\n      \"src\": require(\"bundle!./❤❤/❤/❤.md\"),\n      \"size\": 9,\n      \"mtime\": " + JSON.stringify(_date) + "\n    },\n    \"❤.png\": {\n      \"src\": require(\"bundle!./❤❤/❤/❤.png\"),\n      \"size\": 9,\n      \"mtime\": " + JSON.stringify(_date) + "\n    }\n  },\n  \"❤.md\": {\n    \"src\": require(\"bundle!./❤❤/❤.md\"),\n    \"size\": 9,\n    \"mtime\": "+ JSON.stringify(_date) + "\n  }\n}";
    assert(loadDirectory(options, mockContext)
           ===
           expected);
  });

  afterEach(function() {
    mock.restore();
  });

})

