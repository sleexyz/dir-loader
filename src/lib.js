import Path from "path"
import Promise from "bluebird"
const fs = Promise.promisifyAll(require("fs"));



export const dir = require("./dir-loader");
export const file = function(options) {
    return "TODO: implement file-loader"
}
