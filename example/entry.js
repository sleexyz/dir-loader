var blog = require("../index.js!./blog.js");

console.log(blog);
document.body.innerHTML = "<pre>"  + JSON.stringify(blog, null, 4) + "</pre>";
