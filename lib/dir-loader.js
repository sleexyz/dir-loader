"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = dirLoader;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _loaderUtils = require("./loader-utils");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _loaderUtils2 = require("loader-utils");

//TODO: is there anyway to make this less usage-dependant?
var webpackContext = module.parent.parent.parent.context;

//Object structuredreaddir(dirname, filter, pathTransform, isAbsolute)
//
//dirname is absolute path
//
//filter is regex or null
//
//pathTransform is a function applied before requirePlaceholder
//
//isAbsolute is if dirname was originally absolute
function structuredreaddir(dirname, filter, pathTransform, isAbsolute) {
    function _readdir(dirname) {
        return _fs2["default"].readdirSync(dirname).map(function (filename) {
            var path = _path2["default"].join(dirname, filename);
            var stat = _fs2["default"].statSync(path);
            return { path: path, filename: filename, stat: stat };
        }).map(function (obj) {
            var path = obj.path;
            var filename = obj.filename;
            var stat = obj.stat;

            if (stat.isDirectory()) {
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
            return (0, _objectAssign2["default"])(a, b);
        }, {});
    }
    return _readdir(dirname);
}

function genFile(filename, path, stat, pathTransform, isAbsolute) {
    var output = {};
    var src = (0, _loaderUtils.requirePlaceholder)(pathTransform(isAbsolute ? path : (0, _loaderUtils2.urlToRequest)(_path2["default"].relative(webpackContext, path))));
    output[filename] = {
        src: src,
        size: stat.size,
        mtime: stat.mtime
    };
    return output;
}

//String dir(options)

function dirLoader(options) {
    var required = ["path"];
    for (var i = 0; i < required.length; i++) {
        var k = required[i];
        if (!options[k]) throw new Error("The option " + k + " is required for dir-loader");
    }

    var abspath = options.path;
    var isAbsolute = _path2["default"].isAbsolute(abspath);
    if (!isAbsolute) abspath = _path2["default"].join(webpackContext, abspath);

    // Optional options
    var filter = options.filter || null;
    var pathTransform = options.pathTransform || function (_) {
        return _;
    };

    var output = structuredreaddir(abspath, filter, pathTransform, isAbsolute);
    output = JSON.stringify(output, undefined, 2);
    output = (0, _loaderUtils.injectRequires)(output);
    return output;
}

module.exports = exports["default"];