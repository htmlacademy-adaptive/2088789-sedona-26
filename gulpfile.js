import autoprefixer from "autoprefixer";
import bemlinter from "gulp-html-bemlinter";
import browser from "browser-sync";
import gulp from "gulp";
import lintspaces from "gulp-lintspaces";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import posthtml from "gulp-posthtml";
import sass from "gulp-dart-sass";
import stylelint from "gulp-stylelint";

const editorConfig = { editorconfig: ".editorconfig" };

// Markup

export const markup = () => {
  return gulp
    .src("source/**/*.html")
    .pipe(lintspaces(editorConfig))
    .pipe(lintspaces.reporter())
    .pipe(bemlinter())
    .pipe(posthtml());
};

// Styles

export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(lintspaces(editorConfig))
    .pipe(lintspaces.reporter())
    .pipe(
      stylelint({
        reporters: [{ formatter: "string", console: true }],
      })
    )
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("source/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "source",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

const reload = (done) => {
  browser.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html", gulp.series(markup, reload));
};

export default gulp.series(gulp.parallel(markup, styles), server, watcher);
