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

var fs = _bluebird2["default"].promisifyAll(require("fs"));

function flatreaddir(dirname, test) {
    function _readdir(dirname) {
        return fs.readdirAsync(dirname).map(function (filename) {
            var path = _path2["default"].join(dirname, filename);
            return fs.statAsync(path).then(function (stat) {
                if (stat.isDirectory()) {
                    return _readdir(path);
                } else {
                    // if (test.test(path)) return {
                    if (test.test(filename)) {
                        return {
                            path: path,
                            size: stat.size,
                            mtime: stat.mtime
                        };
                    } else {
                        return null;
                    }
                }
            });
        }).reduce(function (a, b) {
            return b !== null ? a.concat(b) : a;
        }, []);
    }
    return _readdir(dirname);
}

function structuredreaddir(dirname) {}

function dir(options) {
    var test = options.test;
    var dirname = options.path; // TODO: fix dirname resolution

    return flatreaddir(dirname, test);
}

module.exports = exports["default"];

// TODO: implement