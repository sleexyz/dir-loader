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

var webpackContext = module.parent.parent.parent.context;

//TODO: convert to array path to Object keys
//Array flatreaddir (dirname, [test])
// function flatreaddir(dirname, test, pathTransform) {
//     function _readdir(dirname) {
//         return fs.readdirSync(dirname).map(function (filename) {
//             let path = Path.join(dirname, filename);
//             let stat = fs.statSync(path);

//             return {filename, path, stat};

//         }).map(function(input) {
//             const {filename, path, stat} = input;
//             if (stat.isDirectory()) {
//                 return _readdir(path);
//             }
//             if (test ? test.test(filename) : true) {
//                 return genFile(filename, path, stat, pathTransform);
//             }
//             return null

//         }).reduce(function (a, b) {
//             return b !== null ? a.concat(b): a;

//         }, []);
//     }
//     return _readdir(dirname);
// }

//Object structuredreaddir(dirname, [test])
function structuredreaddir(dirname, test, pathTransform) {
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
            if (test ? test.test(filename) : true) {
                return genFile(filename, path, stat, pathTransform);
            }
            return null;
        }).reduce(function (a, b) {
            return (0, _objectAssign2["default"])(a, b);
        }, {});
    }
    return _readdir(dirname);
}

function genFile(filename, path, stat, pathTransform) {
    var output = {};
    var src = (0, _loaderUtils.requirePlaceholder)(pathTransform((0, _loaderUtils2.urlToRequest)(_path2["default"].relative(webpackContext, path))));
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

    var dirname = (function () {
        var path = options.path;
        //TODO: is there anyway to make this less usage-dependant?
        return _path2["default"].isAbsolute(path) ? path : _path2["default"].join(webpackContext, path);
    })();
    console.log("PATH: " + JSON.stringify(dirname));

    // Optional options
    var test = options.test || null;
    var pathTransform = options.pathTransform || function (_) {
        return _;
    };

    var _readdir = options.flatten ? flatreaddir : structuredreaddir;

    var output = _readdir(dirname, test, pathTransform);
    output = JSON.stringify(output, undefined, 2);
    output = (0, _loaderUtils.injectRequires)(output);
    return output;
}

module.exports = exports["default"];