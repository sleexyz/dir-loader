"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var fs = _bluebird2["default"].promisifyAll(require("fs"));

function readdir(dirname) {
    return fs.readdirAsync(dirname).map(function (filename) {
        var path = _path2["default"].join(dirname, filename);
        return fs.statAsync(path).then(function (stat) {
            return stat.isDirectory() ? readDir(path) : path;
        });
    }).reduce(function (a, b) {
        return a.concat(b);
    }, []);
}

var dir = function dir(options) {
    var filter = options.filter;
    var dirname = options.path;

    return readdir(dirname);
};

exports.dir = dir;
var file = function file(options) {
    return "TODO: implement-loader";
};
exports.file = file;