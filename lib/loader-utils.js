"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.requirePlaceholder = requirePlaceholder;
exports.injectRequires = injectRequires;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

// String placeholderRequire()
//
// Creates a placeholder to be

function requirePlaceholder(requirePath) {
    return "@PLACEHOLDER///" + requirePath + "///";
}

// String injectRequires(String)
//
// Transforms placeholders in a text to require's

function injectRequires(input) {
    return input.replace(/\"@PLACEHOLDER\/\/\/(.*)\/\/\/\"/gm, function (match, p1) {
        return "require('" + p1 + "')";
    });
}

//TODO:
//- implement require.ensures