#!/usr/bin/env node

import Path from "path"
import assert from "assert"
import Promise from "bluebird"
import yargs from "yargs"
const fs = Promise.promisifyAll(require("fs"));

const argv = yargs
    .usage("Usage: $0 <command> [options]")
    .command('build', 'Build content')
    .command("clean", "Clean up content")
    .command("init", "Go through fscms.toml generation")
    .demand(1)
    .help("h")
    .alias("h", "help")
    .argv;

const build = function() {
    // TODO:
    // - search for fscms.config.js (in project root)
    //  - check how gulp/webpack/npm do it
    const projectRoot = Promise.try(function getProjectRoot () {
        return process.cwd();
    });

    const config = projectRoot.then(function loadConfig(root) {
        const config = require(root + "/fscms.config.js");
        return config;
    }).catch((e) => e.code === "MODULE_NOT_FOUND", function(e) {
        console.log("fscms.config.js not found!");
        process.exit(1);
    }).catch(function(e) {
        throw e;
        process.exit(1);
    });

    config.then(function(config) {
        // convert to k:v [k, v]
        return Object.keys(config.content).map((_) => [_, config.content[_]]);
    }).map(function(obj) { // convert
        const [key, value] = obj;
        const loader = value.loader
        let options = value;
        delete options.loader;
        return loader(options);
    }).then(function(obj) {
        console.log(JSON.stringify(obj, undefined, 2));
    }).catch((e) => e.code === "ENOENT", function(e) {
        console.log(e.cause.path);
        console.log("    was not found!");
    });
    //TODO:
    // - require.ensure for on-demand loading
    //  - base on https://github.com/webpack/webpack/tree/master/examples/code-splitting
    // - think if folder not found should fail gracefully or fail hard
}


const commands = {
    // Deletes all
    clean: function() {
        console.log("TODO: Implement!");
    },
    build,
    init: function() {
        console.log("TODO: Implement!");
    }
}

commands[argv._[0]]();

