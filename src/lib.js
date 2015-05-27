import Path from "path"
import Promise from "bluebird"
const fs = Promise.promisifyAll(require("fs"));

export const dir = require("./dir-loader");
export const file = function(key, options) {
    return JSON.stringify("TODO: implement file-loader");
}
