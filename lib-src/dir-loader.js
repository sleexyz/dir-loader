import Path from "path"
import ObjectAssign from "object-assign"
import {requirePlaceholder, injectRequires} from "./loader-utils"
import fs from "fs"
import {urlToRequest} from "loader-utils"


//TODO: is there anyway to make this less usage-dependant?
const webpackContext = module.parent.parent.parent.context;


//Object structuredreaddir(dirname, filter, pathTransform, isAbsolute)
//
//dirname is absolute path
//
//filter is regex or null
//
//pathTransform is a function applied before requirePlaceholder
//
//isAbsolute is if dirname was originally absolute
function structuredreaddir(dirname, filter, pathTransform, isAbsolute) {
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
            if (filter ? filter.test(filename) : true) {
                return genFile(filename, path, stat, pathTransform, isAbsolute);
            }
            return null;

        }).reduce(function (a, b) {
            return ObjectAssign(a, b)

        }, {});
    }
    return _readdir(dirname);
}

function genFile (filename, path, stat, pathTransform, isAbsolute) {
    let output = {};
    let src = requirePlaceholder(
        pathTransform(
            isAbsolute
                ? path
                : urlToRequest(
                    Path.relative(webpackContext, path)
    )));
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

    let abspath = options.path;
    let isAbsolute = Path.isAbsolute(abspath);
    if (!isAbsolute)
        abspath = Path.join(webpackContext, abspath);

    // Optional options
    const filter = options.filter || null;
    const pathTransform = options.pathTransform || ((_) => _);

    let output = structuredreaddir(abspath, filter, pathTransform, isAbsolute);
    output = JSON.stringify(output, undefined, 2);
    output = injectRequires(output);
    return output;
}
