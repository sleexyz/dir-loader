//parses dinocms.toml in current working directory
//outputs appropriate json files in dinahcms_modules/

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
            //filter
            if (item.filter) {
                var filter;
                if (Array.isArray(item.filter)){
                    if (item.filter.length === 2) {
                        filter = new RegExp(item.filter[0], item.filter[1]);
                    }else if (item.filter.length === 1){
                        filter = new RegExp(item.filter[0], item.filter[1]);
                    }else {
                        assert(false, "length of filter as an array must be <= 2");
                    }
                }else {
                    assert(typeof(item.filter) === "string", "filter is not a string!");
                    filter = new RegExp(item.filter);
                }
                files = files.filter(function(curr) {
                    return filter.test(curr);
                });
            }
            //append full path names
            files = files.map(function(curr) {
                return path.join(folderpath, curr);
            });
            // Write
            var filepath = path.join(full_output_dir, key+".json");

            console.log(filepath);
            console.log("    ----> " + folderpath);

            fs.writeFile(
                filepath,
                JSON.stringify(files, null, 4),
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
