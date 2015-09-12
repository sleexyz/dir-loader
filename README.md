contentpack, for webpack
========================

[![Build Status](https://travis-ci.org/sleep/contentpack.svg)](https://travis-ci.org/sleep/contentpack)

contentpack lets you load a directory dynamically in [webpack](webpack.github.io).

<br><br><br>
## install
```
npm install --save-dev val-loader
npm install --save contentpack
```

## use

```js
// ./entry.js

import blog from "val!./blog.js";

console.log(Object.keys(blog));

// ./hello.md
// ./world.md
```

```js
// ./blog.js

import contentpack from "contentpack";

export default contentpack({
  path: "/home/user/website/blog-files/",
  filter: /\.md$/
});
```

```
./
├── blog.js
└── entry.js


/home/user/website/
└── blog-files
    ├── This_is_ignored.js
    ├── hello.md
    └── world.md
```

## alternatives
webpack's [`require.context`](http://webpack.github.io/docs/context.html#require-context)
