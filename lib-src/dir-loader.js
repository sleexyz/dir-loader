import Path from "path"
import Promise from "bluebird"
import ObjectAssign from "object-assign"
import {requirePlaceholder, injectRequires} from "./loader-utils"

const fs = Promise.promisifyAll(require("fs"));


//Promise-to-Array flatreaddir (dirname, [test])
function flatreaddir(dirname, test, pathTransform) {
    function _readdir(dirname) {
        return fs.readdirAsync(dirname).map(function (filename) {
            var path = Path.join(dirname, filename);
            return fs.statAsync(path).then(function(stat) {
                if (stat.isDirectory() ) {
                    return _readdir(path);
                } else {
                    if (test ? test.test(filename) : true) {
                        return genFile(filename, path, stat, pathTransform);
                    }
                    return null
                }     
            });
        }).reduce(function (a, b) {
            return b !== null ? a.concat(b): a;
        }, []);
    }
    return _readdir(dirname);
}

//Promise-to-Object structuredreaddir(dirname, [test])
function structuredreaddir(dirname, test, pathTransform) {
    function _readdir(dirname) {
        return fs.readdirAsync(dirname).map(function (filename) {
            var path = Path.join(dirname, filename);
            return fs.statAsync(path).then(function(stat) {
                if (stat.isDirectory() ) {
                    return _readdir(path).then(function(contents) {
                        let output = {};
                        output[filename] = contents
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
            return ObjectAssign(a, b)
        }, {});
    }
    return _readdir(dirname);
}

function genFile (filename, path, stat, pathTransform) {
    let output = {};
    output[filename] = {
        src: requirePlaceholder(pathTransform(path)),
        size: stat.size,
        mtime:  stat.mtime
    }
    return output;
}

//String dir(options)
export default function dir(options) {
    const required = ["path"]
    for (let i = 0; i < required.length; i++) {
        let k = required[i];
        if (!options[k]) throw new Error("The option " + k + " is required for dir-loader")
    }

    const dirname = (function() {
        let path = options.path;
        return Path.isAbsolute(path)
            ? path
            : Path.relative(process.cwd(), path);
    })();

    // Optional options
    const test = options.test || null;
    const pathTransform = options.pathTransform || ((_) => _);

    let _readdir= options.flatten ? flatreaddir : structuredreaddir;

    return _readdir(dirname, test, pathTransform).then((_) => JSON.stringify(_, undefined, 2))
        .then(injectRequires);
}
