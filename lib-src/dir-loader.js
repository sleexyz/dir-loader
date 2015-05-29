import Path from "path"
import ObjectAssign from "object-assign"
import {requirePlaceholder, injectRequires} from "./loader-utils"
import fs from "fs"
import {urlToRequest} from "loader-utils"


const webpackContext = module.parent.parent.parent.context;

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
        return fs.readdirSync(dirname).map(function (filename) {
            let path = Path.join(dirname, filename);
            var stat = fs.statSync(path);
            return {path, filename, stat}

        }).map(function(obj) {
            const {path, filename, stat} = obj;
            if (stat.isDirectory() ) {
                let contents = _readdir(path);

                let output = {};
                output[filename] = contents
                return output;

            } 
            if (test ? test.test(filename) : true) {
                return genFile(filename, path, stat, pathTransform);

            }
            return null;

        }).reduce(function (a, b) {
            return ObjectAssign(a, b)

        }, {});
    }
    return _readdir(dirname);
}

function genFile (filename, path, stat, pathTransform) {
    let output = {};
    let src = requirePlaceholder(
        pathTransform(
            urlToRequest(Path.relative(webpackContext, path))
        )
    );
    output[filename] = {
        src,
        size: stat.size,
        mtime:  stat.mtime
    }
    return output;
}

//String dir(options)
export default function dirLoader(options) {
    const required = ["path"]
    for (let i = 0; i < required.length; i++) {
        let k = required[i];
        if (!options[k]) throw new Error("The option " + k + " is required for dir-loader")
    }

    const dirname = (function() {
        let path = options.path;
        //TODO: is there anyway to make this less usage-dependant?
        return Path.isAbsolute(path)
            ? path
            : Path.join(webpackContext, path)
    })();
    console.log("PATH: " + JSON.stringify(dirname));

    // Optional options
    const test = options.test || null;
    const pathTransform = options.pathTransform || ((_) => _);

    let _readdir= options.flatten ? flatreaddir : structuredreaddir;

    let output = _readdir(dirname, test, pathTransform);
    output = JSON.stringify(output, undefined, 2);
    output = injectRequires(output);
    return output;
}
