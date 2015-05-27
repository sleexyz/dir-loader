import Path from "path"
import Promise from "bluebird"
const fs = Promise.promisifyAll(require("fs"));


function readdir(dirname) {
    return fs.readdirAsync(dirname).map(function (filename) {
        var path = Path.join(dirname, filename);
        return fs.statAsync(path).then(function(stat) {
            return stat.isDirectory() ? readDir(path): path;
        });
    }).reduce(function (a, b) {
        return a.concat(b);
    }, []);
}

export const dir = function(options) {
    const filter = options.filter;
    let dirname = options.path;

    return readdir(dirname);
}


export const file = function(options) {
    return "TODO: implement-loader"
}
