#!/usr/bin/env node
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _yargs = require("yargs");

var _yargs2 = _interopRequireDefault(_yargs);

var fs = _bluebird2["default"].promisifyAll(require("fs"));

var argv = _yargs2["default"].usage("Usage: $0 <command> [options]").command("build", "Build content").command("clean", "Clean up content").command("init", "Go through fscms.toml generation").demand(1).help("h").alias("h", "help").argv;

var build = function build() {
    // TODO:
    // - search for fscms.config.js (in project root)
    //  - check how gulp/webpack/npm do it
    var projectRoot = _bluebird2["default"]["try"](function getProjectRoot() {
        return process.cwd();
    });

    var config = projectRoot.then(function loadConfig(root) {
        var config = require(root + "/fscms.config.js");
        return config;
    })["catch"](function (e) {
        return e.code === "MODULE_NOT_FOUND";
    }, function (e) {
        console.log("fscms.config.js not found!");
        process.exit(1);
    })["catch"](function (e) {
        throw e;
        process.exit(1);
    });

    config.then(function (config) {
        // convert to k:v [k, v]
        return Object.keys(config.content).map(function (_) {
            return [_, config.content[_]];
        });
    }).map(function (obj) {
        // convert

        var _obj = _slicedToArray(obj, 2);

        var key = _obj[0];
        var value = _obj[1];

        var loader = value.loader;
        var options = value;
        delete options.loader;
        return loader(options);
    }).then(function (obj) {
        console.log(JSON.stringify(obj, undefined, 2));
    })["catch"](function (e) {
        return e.code === "ENOENT";
    }, function (e) {
        console.log(e.cause.path);
        console.log("    was not found!");
    });
    //TODO:
    // - require.ensure for on-demand loading
    //  - base on https://github.com/webpack/webpack/tree/master/examples/code-splitting
    // - think if folder not found should fail gracefully or fail hard
};

var commands = {
    // Deletes all
    clean: function clean() {
        console.log("TODO: Implement!");
    },
    build: build,
    init: function init() {
        console.log("TODO: Implement!");
    }
};

commands[argv._[0]]();