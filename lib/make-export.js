"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (config) {
    var code = Object.keys(config.content).map(function (key) {
        var options = config.content[key];
        var loader = options.loader;

        return [key, loader(options)];
    }).map(function (kv) {
        return "exports['" + kv[0] + "'] = " + kv[1] + ";";
    }).join("\n\n\n");
    console.log(code);
    return code;
};

module.exports = exports["default"];