import Path from "path"
import {requirePlaceholder, injectRequires} from "./loader-utils"
import {urlToRequest} from "loader-utils"
import fs from "fs"


//TODO: is there anyway to make this less usage-dependant?
const webpackContext = module.parent.parent.parent.context;


//Object loadFile(path, pathTransform, isRelative)
//
//path is absolute path
//
//pathTransform is a function applied before requirePlaceholder
//
//isAbsolute is whether the orignal path was absolute
function loadFile(path, pathTransform, isAbsolute) {
    let stat = fs.statSync(path);
    if (stat.isDirectory() ) {
        throw new Error("File is a directory!");
    }
    return genFile(path, stat, pathTransform, isAbsolute)
}

function genFile (path, stat, pathTransform, isAbsolute) {
    let src = requirePlaceholder(
        pathTransform(
            isAbsolute
                ? path
                : urlToRequest(
                    Path.relative(webpackContext, path)
    )));

    return {
        src,
        size: stat.size,
        mtime:  stat.mtime
    }
}

export default function fileLoader(options) {
    const required = ["path"];
    for (let i = 0; i < required.length; i++) {
        let k = required[i];
        if (!options[k]) throw new Error("The options " + k + " is required for file-loader")
    }

    let abspath = options.path;
    let isAbsolute = Path.isAbsolute(abspath);
    if (!isAbsolute)
        abspath = Path.join(webpackContext, abspath)

    const pathTransform = options.pathTransform || ((_) => _);
    let output = loadFile(abspath, pathTransform, isAbsolute);
    output = JSON.stringify(output, undefined, 2);
    output = injectRequires(output);


    return output;
}
