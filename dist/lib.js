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

var dir = require("./dir-loader");
exports.dir = dir;
var file = function file(options) {
    return "TODO: implement file-loader";
};
exports.file = file;