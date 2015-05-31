import assert from "assert"
import {requirePlaceholder, injectRequires} from "../lib/loader-utils"


const testcases = [
    "./blog",
    "/blog",
    "<",
    "<///",
    ""
]

function requireToPath (str) {
    return str.slice(8, str.length -1);

}

describe("./lib/loader-utils", function () {
    testcases.forEach(function(testcase) {

        it("should escape " + JSON.stringify(testcase), function() {
            let source = JSON.stringify(requirePlaceholder(testcase));
            let output = injectRequires(source);
            let identity = JSON.parse(requireToPath(output));
            assert(testcase === identity);

        })
    })


});
