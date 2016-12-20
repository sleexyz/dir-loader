dir-loader
========================

[![Build Status](https://travis-ci.org/sleexyz/dir-loader.svg)](https://travis-ci.org/sleexyz/dir-loader)

dir-loader lets you dynamically require a directory in [webpack](http://webpack.github.io).

In other words, dir-loader is a code-generation tool; it obviates the need to hard-code `require`'s for a given directory's modules and subdirectories.


## contents
- [install](#install)
- [use](#use)
- [api](#api)
- [examples](#examples)
- [alternatives](#alternatives)


## install
```
npm install --save-dev dir-loader
```

## use
Suppose you have a webpack project with a semantic directory structure. You want to require your content but still preserve the hierarchical information inherent to the filesystem.
```
.
├── website
│   ├── intro.md
|   |
│   ├── travel
│   │   ├── post1.md
│   │   ├── post2.md
│   │   └── post3.md
|   |
│   ├── food
│   │   └── post1.md
|   |
│   └──ignore-me.js
|
|
|
├── blog.config.js
└── entry.js
```

In a js file, specify the configuration for dir-loader:
```js
// ./blog.config.js

module.exports = {
  path: "./website",
  filter: /\.md$/
}
```

And then just require that configuration with **dir!** in your application code!
```js
// ./entry.js

var blog = require("dir!./blog.config.js");
...
```

This is equivalent to the following javascript:
```js
// (equivalent to ./entry.js)

var blog = {
  "food": {
    "post1.md": {
      "src": require("./website/food/post1.md"),
      "size": 22,
      "mtime": "2015-09-12T19:44:43.000Z"
    }
  },
  "intro.md": {
    "src": require("./website/intro.md"),
    "size": 24,
    "mtime": "2015-09-13T03:50:56.000Z"
  },
  "travel": {
    "post1.md": {
      "src": require("./website/travel/post1.md"),
      "size": 23,
      "mtime": "2015-09-12T19:45:24.000Z"
    },
    "post2.md": {
      "src": require("./website/travel/post2.md"),
      "size": 24,
      "mtime": "2015-09-12T19:45:43.000Z"
    },
    "post3.md": {
      "src": require("./website/travel/post3.md"),
      "size": 23,
      "mtime": "2015-09-12T19:45:51.000Z"
    }
  }
};
...
```






## api
```js
// ./entry.js
var blog = require("dir!./blog.config.js");
...
```

```js
// ./blog.config.js

module.exports = {

  // path :: String
  // Path to directory. Can be absolute or relative path.
  path: "./website",
  
  // filter :: RegExp
  // (optional)
  // Regular expression to test filenames.
  filter: /\.md$/,
  
  // dirFilter :: RegExp
  // (optional)
  // Regular expression to test directory names.
  dirFilter: /^(?!__private__).*/,
  
  // pathTransform :: (String) -> String
  // (optional)
  // Function to transform each generated require statement.
  pathTransform: (_) => "bundle!" + _
  
}
```

## examples
Code [here](https://github.com/sleexyz/dir-loader/tree/master/example).

To run it:
```shell
git clone https://github.com/sleexyz/dir-loader
cd dir-loader
npm install
npm run example
```

## alternatives
dir-loader was created due to insuffciencies with [`require.context`](http://webpack.github.io/docs/context.html#require-context),
webpack's built-in solution for dynamic requires.

`require.context` provides a flat array of matched modules. This is the easiest way to dynamically require modules if your modules are non-hierarchical. But in the case you want to use the hierarchical information implicit in the filesystem structure, `require.context` falls short.

