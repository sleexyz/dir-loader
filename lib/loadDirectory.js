"use strict";

var Path = require("path");
var ObjectAssign = require("object-assign");

var requirePlaceholder = require("./util").requirePlaceholder;
var injectRequires = require("./util").injectRequires;
var fs = require("fs");

var urlToRequest = require("loader-utils").urlToRequest;





//Object structuredreaddir(dirname, filter, pathTransform, isAbsolute)
//
//dirname is absolute path
//
//filter is regex or null
//
//pathTransform is a function applied before requirePlaceholder
//
//isAbsolute is if dirname was originally absolute
function structuredreaddir(dirname, filter, pathTransform, isAbsolute, genFile) {
  function _readdir(dirname) {
    return fs.readdirSync(dirname).map(function (filename) {
      var path = Path.join(dirname, filename);
      var stat = fs.statSync(path);
      return {path: path, filename: filename, stat: stat};

    }).map(function(obj) {
      var path = obj.path,
          filename = obj.filename,
          stat =  obj.stat;

      if (stat.isDirectory() ) {
        var contents = _readdir(path);

        var output = {};
        output[filename] = contents;
        return output;

      }
      if (filter ? filter.test(filename) : true) {
        return genFile(filename, path, stat, pathTransform, isAbsolute);
      }
      return null;

    }).reduce(function (a, b) {
      return ObjectAssign(a, b);

    }, {});
  }
  return _readdir(dirname);
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

  function genFile (filename, path, stat, pathTransform, isAbsolute) {
    var output = {};
    var src = requirePlaceholder(
      pathTransform(
        isAbsolute
          ? path
          : urlToRequest(
            Path.relative(webpackContext, path)
          )));
    output[filename] = {
      src: src,
      size: stat.size,
      mtime:  stat.mtime
    };
    return output;
  }

  var abspath = options.path;
  var isAbsolute = Path.isAbsolute(abspath);
  if (!isAbsolute)
    abspath = Path.join(webpackContext, abspath);

  // Optional options
  var filter = options.filter || null;
  var pathTransform = options.pathTransform || (function(_) {return _;});

  var output = structuredreaddir(abspath, filter, pathTransform, isAbsolute, genFile);
  output = JSON.stringify(output, undefined, 2);
  output = injectRequires(output);
  return output;
};
