var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("compile", function() {
    return gulp.src("lib-src/*.js")
        .pipe(babel())
        .pipe(gulp.dest("lib"));
})
gulp.task("default", ["compile"]);
