import Promise from "bluebird"


// String placeholderRequire()
// 
// Creates a placeholder to be
export function requirePlaceholder(requirePath) {
    return "@PLACEHOLDER///" + requirePath + "///";
}

// String injectRequires(String)
//
// Transforms placeholders in a text to require's
export function injectRequires(input) {
    return input.replace(
        /\"@PLACEHOLDER\/\/\/(.*)\/\/\/\"/gm,
        function (match, p1) {
            return "require('" + p1 + "')"
        }
    );
}




//TODO:
//- implement require.ensures
