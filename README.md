# dinocms, for webpack
> DIrectories! NO CMS!

Generate webpack code that explicity links filesystem content to your app as a static dependencies.
Abstract content from your code.

## install
```
npm install -g dinocms
```

## use
```
touch dinocms.toml
```

```toml
# This is an example dinocms.toml

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

// ./dinocms_content/blog.js

module.exports = [
  {
    "name" : "entry1.md",
    "src" :  require("/Users/sean/Google Drive/website/entries/entry1.md"),
    "size": 4096
    "mtime": '2009-06-29T11:11:40Z'
  },
...
];

// ./dinocms_content/images.js

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








### infrequently asked questions:

#### why use this? webpack has [dynamic requires!](https://github.com/webpack/webpack/tree/master/examples/require.context#examplejs)
Webpack's dynamic requiring necessitates static compilation of all possibly-required modules. Because Webpack is simply a bundler for static websites, everything must be loaded at compile time. If you don't explicitly know the paths of assets within your directory, you cannot `require` them with just webpack.

Dinocms allows you to `require` directory contents without explicitly knowing the contents -- by generating code that knows the contents. 


#### why not just make this some kind of webpack loader/plugin?
Webpack's not gonna solve all your problems. Seperation of concerns: use dinocms to link your content, and use webpack to bundle it up.

### todo:
- add debug mode
- write testssss
- add help message
