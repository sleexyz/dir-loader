export default function(config) {
    let code = Object.keys(config.content).map(function(key) {
        const options = config.content[key];
        const loader = options.loader;

        return [key, loader(options)];
    }).map((kv) =>
        "exports['" + kv[0] + "'] = " + kv[1] + ";"
    ).join("\n\n\n");
    console.log(code);
    return code;
}
