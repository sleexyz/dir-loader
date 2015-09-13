var blog = require("../index.js!./blog.config.js");

console.log(blog);
document.body.innerHTML = "<pre>"  + JSON.stringify(blog, null, 4) + "</pre>";
