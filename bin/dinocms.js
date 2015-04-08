#!/usr/bin/env node
//parses dinocms.toml in current working directory
//outputs appropriate js files in dinocms_content/

var fs = require("fs");
var path = require("path");
var toml = require("toml");
var async = require("async");
var assert = require("assert");

var cwd = process.cwd();
var output_dir = "dinocms_content";
var full_output_dir = path.join(cwd, output_dir);
//read config
var config;
try {
    config = toml.parse(fs.readFileSync(path.join(cwd, "dinocms.toml"), "utf8"));
} catch(err) {
    console.log('Could not read dinocms.toml!');
    console.log(err);
    process.exit(1);
}
//make sure directory exists
try {
 assert(fs.lstatSync(full_output_dir).isDirectory());
} catch(err) {
    try {
        fs.mkdirSync(full_output_dir);
    } catch(err) {
        console.err('Could not make ' + output_dir + ' directory!');
        process.exit(1);

}}

//explore directory
async.each(Object.keys(config), function (key, callback) {
    var item = config[key];
    if (!item.type) throw("Type not specified for " + key);
    if (item.type == "directory"){
        var folderpath = path.normalize(item.path);
        fs.readdir(folderpath, function (err, files) {
            if (err) callback(err);

            //initialize filter
            var filter = function() {return true};
            if (item.filter) {
                var regex;
                if (Array.isArray(item.filter)){
                    if (item.filter.length === 2) {
                        regex = new RegExp(item.filter[0], item.filter[1]);
                    }else if (item.filter.length === 1){
                        regex = new RegExp(item.filter[0], item.filter[1]);
                    }else {
                        assert(false, "length of filter as an array must be <= 2");
                    }
                }else {
                    assert(typeof(item.filter) === "string", "filter must be either string or array!");
                    regex = new RegExp(item.filter);
                }
                filter = function(curr) {
                    return regex.test(curr);
                };
            }
            files = files.filter(filter);
            //initialize paths
            var paths = files.map(function(curr) {
                return path.join(folderpath, curr);
            });
            //initialize objects
            var arr = files.map(function(curr, index) {
                var p = path.join(folderpath, curr);
                var lstat = fs.lstatSync( p);
                var obj = {
                    name: curr,
                    src: "///" + index + "///",
                    path: p,
                    size: lstat.size,
                    mtime: lstat.mtime
                };
                return obj;
            });

            // Write
            var filepath = path.join(full_output_dir, key+".js");

            console.log(filepath);
            console.log("    ----> " + folderpath);

            var output = JSON.stringify(arr, null, 2);
            //replace with require statements
            
            var regexp = /\"\/\/\/(\d+)\/\/\/\"/gm;
            output = output.replace(regexp, function(match, p1) {
                return "require('" + paths[parseInt(p1)] + "')";
            });

            output = "module.exports = " + output;
            fs.writeFile(
                filepath,
                output,
                function(err) {
                    if (err) callback(err);
                    callback();
                }
            );
        });
    }else {
        callback("Error! \"" + item.type + "\" is an unrecognized type for \"" + key + "\"");
    }
}, function (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Success!");
});
