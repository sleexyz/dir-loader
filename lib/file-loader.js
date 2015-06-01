"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = fileLoader;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _loaderUtils = require("./loader-utils");

var _loaderUtils2 = require("loader-utils");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

//TODO: is there anyway to make this less usage-dependant?
var webpackContext = module.parent.parent.parent.context;

//Object loadFile(path, pathTransform, isRelative)
//
//path is absolute path
//
//pathTransform is a function applied before requirePlaceholder
//
//isAbsolute is whether the orignal path was absolute
function loadFile(path, pathTransform, isAbsolute) {
    var stat = _fs2["default"].statSync(path);
    if (stat.isDirectory()) {
        throw new Error("File is a directory!");
    }
    return genFile(path, stat, pathTransform, isAbsolute);
}

function genFile(path, stat, pathTransform, isAbsolute) {
    var src = (0, _loaderUtils.requirePlaceholder)(pathTransform(isAbsolute ? path : (0, _loaderUtils2.urlToRequest)(_path2["default"].relative(webpackContext, path))));

    return {
        src: src,
        size: stat.size,
        mtime: stat.mtime
    };
}

function fileLoader(options) {
    var required = ["path"];
    for (var i = 0; i < required.length; i++) {
        var k = required[i];
        if (!options[k]) throw new Error("The options " + k + " is required for file-loader");
    }

    var abspath = options.path;
    var isAbsolute = _path2["default"].isAbsolute(abspath);
    if (!isAbsolute) abspath = _path2["default"].join(webpackContext, abspath);

    var pathTransform = options.pathTransform || function (_) {
        return _;
    };
    var output = loadFile(abspath, pathTransform, isAbsolute);
    output = JSON.stringify(output, undefined, 2);
    output = (0, _loaderUtils.injectRequires)(output);

    return output;
}

module.exports = exports["default"];