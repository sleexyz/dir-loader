var Path = require("path");
var ObjectAssign = require("object-assign");

var fs = require("fs");
var urlToRequest = require("loader-utils").urlToRequest;

var genPlaceholder = require("./util").genPlaceholder;
var genReplacer = require("./util").genReplacer;





//placeholder/replacer methods

var requirePlaceholder = genPlaceholder("require");
var requireReplacer = genReplacer("require", function (str) {
  return "require(" + str + ")";
});


var symbolPlaceholder = genPlaceholder("symbol");
var symbolReplacer = genReplacer("symbol", function(str) {
  return "[Symbol.for(" + str +  ")]";
});

var __onHMRUpdate__Placeholder = genPlaceholder("__onHMRUpdate__");

var __onHMRUpdate__Replacer = genReplacer("__onHMRUpdate__", function(str) {
  var lines = [
    "(function(cb) {",
    "module.hot.accept(" + str + ", function() {",
    "cb(require(" + str + "));",
    "});})"
  ];
  return lines.join(" ");
});

var __type__placeholder = symbolPlaceholder("__type__");
var __location__placeholder = symbolPlaceholder("__location__");




//Object structuredreaddir(dirname, filter, pathTransform, isAbsolute)
//
//dirname is absolute path
//
//filter is regex or null
//
//pathTransform is a function applied before requirePlaceholder
//
//isAbsolute is if dirname was originally absolute
function structuredreaddir(dirname, filter, dirFilter, pathTransform, isAbsolute, genFile) {
  function _readdir(dirname, location_chain) {

    // one giant recursive map/reduce

    var output = fs.readdirSync(dirname).map(function (filename) {
      var path = Path.join(dirname, filename);
      var stat = fs.statSync(path);
      return {path: path, filename: filename, stat: stat};

    }).map(function(obj) {
      var path = obj.path,
          filename = obj.filename,
          stat =  obj.stat;

      if (stat.isDirectory() ) {                // if node is directory

        if (!dirFilter || dirFilter.test(filename)) {
          var contents = _readdir(path, location_chain.slice(0).concat([filename])); // :: Object
          if (contents === null) return null;

          var output = {};
          output[filename] = contents;
          return output;
        }
      } else {                                  // if node is file

        if (!filter || filter.test(filename)) {
          var file = genFile(path, stat, pathTransform, isAbsolute, filename, location_chain);

          var output = {};
          output[filename] = file;
          return output;
        }
      }

      return null;
    }).reduce(function (a, b) {
      if (b === null) return a;
      return ObjectAssign(a, b);
    }, {});
    // ObjectAssign only copies enumerable properties
    // so we have to manually copy over __type__

    if (Object.keys(output).length === 0) return null;

    output[__type__placeholder] = "directory";
    output[__location__placeholder] = location_chain;
    return output;
  }
  return _readdir(dirname, []);
}



//String dir(options)
module.exports = function (options, webpackContext) {
  //param check
  var required = ["path"];
  for (var i = 0; i < required.length; i++) {
    var k = required[i];
    if (!options[k]) throw new Error("The option " + k + " is required for dir-loader");
  }
  if (!webpackContext || typeof webpackContext !== "string") {
    throw Error("Could not initialize webpack context", webpackContext);
  }

  function genFile(path, stat, pathTransform, isAbsolute, filename, location_chain) {
    var requirePath = pathTransform(
      isAbsolute
        ? path
        : urlToRequest(
          Path.relative(webpackContext, path)
        )
    );
    var src = requirePlaceholder(requirePath);

    var __onHMRUpdate__ = __onHMRUpdate__Placeholder(requirePath);

    var output = {
      src: src,
      size: stat.size,
      mtime:  stat.mtime,
      __onHMRUpdate__: __onHMRUpdate__
    };
    output[__location__placeholder] =  location_chain.slice(0).concat([filename]);
    output[__type__placeholder] =  "file";
    return output;
  }

  var abspath = options.path;
  var isAbsolute = Path.isAbsolute(abspath);
  if (!isAbsolute)
    abspath = Path.join(webpackContext, abspath);

  // Optional options
  var filter = options.filter || null;
  var dirFilter = options.dirFilter || null;
  var pathTransform = options.pathTransform || (function(_) {return _;});

  var output = structuredreaddir(abspath, filter, dirFilter, pathTransform, isAbsolute, genFile);
  output = JSON.stringify(output, undefined, 2);
  output = requireReplacer(output);
  output = symbolReplacer(output);
  output = __onHMRUpdate__Replacer(output);

  return output;
};


//TODO: transition to es6
