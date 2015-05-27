"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = dir;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _loaderUtils = require("./loader-utils");

var fs = _bluebird2["default"].promisifyAll(require("fs"));

//Promise-to-Array flatreaddir (dirname, [test])
function flatreaddir(dirname, test, pathTransform) {
    function _readdir(dirname) {
        return fs.readdirAsync(dirname).map(function (filename) {
            var path = _path2["default"].join(dirname, filename);
            return fs.statAsync(path).then(function (stat) {
                if (stat.isDirectory()) {
                    return _readdir(path);
                } else {
                    if (test ? test.test(filename) : true) {
                        return genFile(filename, path, stat, pathTransform);
                    }
                    return null;
                }
            });
        }).reduce(function (a, b) {
            return b !== null ? a.concat(b) : a;
        }, []);
    }
    return _readdir(dirname);
}

//Promise-to-Object structuredreaddir(dirname, [test])
function structuredreaddir(dirname, test, pathTransform) {
    function _readdir(dirname) {
        return fs.readdirAsync(dirname).map(function (filename) {
            var path = _path2["default"].join(dirname, filename);
            return fs.statAsync(path).then(function (stat) {
                if (stat.isDirectory()) {
                    return _readdir(path).then(function (contents) {
                        var output = {};
                        output[filename] = contents;
                        return output;
                    });
                } else {
                    if (test ? test.test(filename) : true) {
                        return genFile(filename, path, stat, pathTransform);
                    }
                    return null;
                }
            });
        }).reduce(function (a, b) {
            return (0, _objectAssign2["default"])(a, b);
        }, {});
    }
    return _readdir(dirname);
}

function genFile(filename, path, stat, pathTransform) {
    var output = {};
    output[filename] = {
        src: (0, _loaderUtils.requirePlaceholder)(pathTransform(path)),
        size: stat.size,
        mtime: stat.mtime
    };
    return output;
}

//String dir(options)

function dir(options) {
    var required = ["path"];
    for (var i = 0; i < required.length; i++) {
        var k = required[i];
        if (!options[k]) throw new Error("The option " + k + " is required for dir-loader");
    }

    var dirname = (function () {
        var path = options.path;
        return _path2["default"].isAbsolute(path) ? path : _path2["default"].relative(process.cwd(), path);
    })();

    // Optional options
    var test = options.test || null;
    var pathTransform = options.pathTransform || function (_) {
        return _;
    };

    var _readdir = options.flatten ? flatreaddir : structuredreaddir;

    return _readdir(dirname, test, pathTransform).then(function (_) {
        return JSON.stringify(_, undefined, 2);
    }).then(_loaderUtils.injectRequires);
}

module.exports = exports["default"];