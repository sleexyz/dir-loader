export default function(config) {
    let code = Object.keys(config).map(function(key) {
        const options = config[key];
        const loader = options.loader;

        return [key, loader(options)];
    }).map((kv) =>
        "exports['" + kv[0] + "'] = " + kv[1] + ";"
    ).join("\n\n\n");
    console.log(code);
    return code;
}
