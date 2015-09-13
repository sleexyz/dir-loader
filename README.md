dir-loader
========================

[![Build Status](https://travis-ci.org/sleep/dir-loader.svg)](https://travis-ci.org/sleep/dir-loader)

dir-loader lets you load a directory dynamically in [webpack](http://webpack.github.io).

This is a more flexible alternative to webpack's [`require.context`](http://webpack.github.io/docs/context.html#require-context).

## install
```
npm install --save-dev dir-loader
```

## use
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

```js
// ./blog.config.js

module.exports = {
  path: "./website",
  filter: /\.md$/
}
```

```js
// ./entry.js

var blog = require("dir!./blog.config.js");
...
```

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
  dirFilter: /^(?!__).*/,
  
  // pathTransform :: (String) -> String
  // (optional)
  // Function to transform each generated require statement.
  pathTransform: (_) => "bundle!" + _
  
}
```
