# fscms, for webpack

Generate webpack code that explicity links filesystem content to your app as a static dependencies.
Abstract content from your code.

## install
```
npm install -g fscms
```

## use
```
touch fscms.toml
```

```toml
# This is an example fscms.toml

[ blog ]
type = "directory"
path = "/Users/sean/Google Drive/website/entries/"
filter = "\\.md$"

# Notice the double-backslash. TOML requires backslashes to be escaped in strings.

[ images ]
type = "directory"
path = "/Users/sean/Google Drive/website/images/"
filter = ["\\.(jpg|jpeg|gif|png)$", "i"]

```
```javascript
// output:

// ./fscms_content/blog.js

module.exports = [
  {
    "name" : "entry1.md",
    "src" :  require("/Users/sean/Google Drive/website/entries/entry1.md"),
    "size": 4096
    "mtime": '2009-06-29T11:11:40Z'
  },
...
];

// ./fscms_content/images.js

module.exports = [
  {
    "name" : "cat.png",
    "src" :  require("/Users/sean/Google Drive/website/images/cat.png"),
    "size": 40960
    "mtime": '2009-06-29T11:11:40Z'
  },
...
];
```

### todo:
- add debug mode
- write testssss
- add help message
- add `fscms clean`
- make recursive file lister
