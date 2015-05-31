"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.requirePlaceholder = requirePlaceholder;
exports.injectRequires = injectRequires;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

// String placeholderRequire(String)
//
// Creates a placeholder to be
// replaced by a require call

function requirePlaceholder(requirePath) {
    (0, _assert2["default"])(typeof requirePath === "string");

    // <, doesn't come up in an URI
    // /// doesn't come up in directory names

    return "<///" + encodeURI(JSON.stringify(requirePath)) + "///>";
}

// String injectRequires(String)
//
// Transforms placeholders in a text to require's

function injectRequires(input) {
    return input.replace(/\"<\/\/\/(.*)\/\/\/>\"/gm, function (match, p1) {
        return "require(" + decodeURI(p1) + ")";
    });
}

//TODO:
//- implement require.ensures