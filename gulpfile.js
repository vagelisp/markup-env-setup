const gulp = require("gulp"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  purgecss = require("gulp-purgecss"),
  browserSync = require("browser-sync").create(),
  sourcemaps = require("gulp-sourcemaps"),
  terser = require("gulp-terser"),
  imagemin = require("gulp-imagemin");

function css() {
  return gulp
    .src("./src/assets/css/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      rename(function (path) {
        path.extname = ".min.css";
      })
    )
    .pipe(
      purgecss({
        content: ["public/**/*.html"],
      })
    )
    .pipe(gulp.dest("./public/assets/css/"))
    .pipe(browserSync.stream());
}

function html() {
  return gulp.src("./src/**/*.html").pipe(gulp.dest("./public/"));
}

function javascript() {
  return gulp
    .src(["./src/assets/js/*.js", "!src/assets/js/*.min.js"])
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(
      rename(function (path) {
        path.extname = ".min.js";
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./public/assets/js/"));
}

function copy_scripts() {
  return gulp
    .src("./src/assets/js/*.min.js")
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./public/assets/js/"));
}

function images() {
  return gulp
    .src("./src/assets/images/**/*")
    .pipe(gulp.dest("./public/assets/images/"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest("./public/assets/images/"));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./public",
    },
  });
}

gulp.watch("./src/assets/css/**/*.scss", css).on("change", browserSync.reload);
gulp.watch("./src/*.html", html).on("change", browserSync.reload);

exports.default = gulp.parallel(
  html,
  css,
  javascript,
  copy_scripts,
  images,
  serve
);
