dir-loader
========================

[![Build Status](https://travis-ci.org/sleep/dir-loader.svg)](https://travis-ci.org/sleep/dir-loader)

dir-loader lets you load a directory dynamically in [webpack](http://webpack.github.io).

This is an alternative to webpack's [`require.context`](http://webpack.github.io/docs/context.html#require-context).

## install
```
npm install --save-dev dir-loader
```

## use
```js
// ./entry.js

var blog = require("dir!./blog.config.js");

console.log(Object.keys(blog));

// ./hello.md
// ./world.md
```

```js
// ./blog.config.js

module.exports = {
  path: "/home/user/website/blog-files/",
  filter: /\.md$/
}
```

```
./
├── blog.config.js
└── entry.js


/home/user/website/
└── blog-files
    ├── This_is_ignored_because_of_the_filter.js
    ├── hello.md
    └── world.md
```
