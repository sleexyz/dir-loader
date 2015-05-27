import Path from "path"
import Promise from "bluebird"
const fs = Promise.promisifyAll(require("fs"));


function flatreaddir(dirname, test) {
    function _readdir(dirname) {
        return fs.readdirAsync(dirname).map(function (filename) {
            var path = Path.join(dirname, filename);
            return fs.statAsync(path).then(function(stat) {
                if (stat.isDirectory() ) {
                    return _readdir(path);
                } else {
                    // if (test.test(path)) return {
                    if (test.test(filename)) {
                        return {
                            path,
                            size: stat.size,
                            mtime:  stat.mtime
                        }
                    }
                    else {return null}
                }     
            });
        }).reduce(function (a, b) {
            return b !== null ? a.concat(b): a;
        }, []);
    }
    return _readdir(dirname);
}

function structuredreaddir(dirname) {
    // TODO: implement
}


export default function dir(options) {
    const test = options.test;
    let dirname = options.path; // TODO: fix dirname resolution

    //TODO: implement require injection
    //TODO: use require.ensure
    
    return flatreaddir(dirname, test);
}
