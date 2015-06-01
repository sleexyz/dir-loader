import assert from "assert"
import mock from "mock-fs"

module.parent.parent.context = "/";
const fileLoader = require("../lib/file-loader")

const _date = new Date();


describe("./lib/file-loader", function() {
    beforeEach(function() {
        mock ({
            "/\u2764": {
                "\u2764.md": mock.file({
                    content: "beep boop",
                    mtime: _date,
                })
            },
        })

    })
    it("should work for absolute paths", function() {
        let options = {
            path: "/\u2764/\u2764.md",
        }
        const expected = "{\n  \"src\": require(\"/\u2764/\u2764.md\"),\n  \"size\": 9,\n  \"mtime\": " + JSON.stringify(_date) + "\n}"
        assert(fileLoader(options)
            ===
            expected);
    });

    it("should work for relative paths", function() {
        let options = {
            path: "./\u2764/\u2764.md",
        }
        const expected = "{\n  \"src\": require(\"./\u2764/\u2764.md\"),\n  \"size\": 9,\n  \"mtime\": " + JSON.stringify(_date) + "\n}"
        assert(fileLoader(options)
            ===
            expected);
    });

    afterEach(function() {
        mock.restore();
    });

})

