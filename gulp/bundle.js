const gulp = require('gulp');
const config = require('./config');
const path = require('path');
const $ = require('gulp-load-plugins')();
const Builder = require('systemjs-builder');

const bundleConfig = {
    baseURL: config.PATHS.dist.cjs,
    defaultJSExtensions: true,
    packageConfigPaths: [
        path.join('.', 'node_modules', '*', 'package.json'),
        path.join('.', 'node_modules', '@angular', '*', 'package.json')
    ],
    paths: {
        'ngx-adal/*': '*',
        '@angular/*': './node_modules/@angular/*',
        'adal-angular': './node_modules/adal-angular/lib/adal.js',
        '*': './node_modules/*'
    },
    packages: {
        '@angular/core': {
            main: 'bundles/core.umd.js',
            defaultExtension: 'js'
        },
        '@angular/compiler': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/common': {
            main: 'bundles/common.umd.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser': {
            main: 'bundles/platform-browser.umd.js',
            defaultExtension: 'js'
        },

        '@angular/http': {
            main: 'bundles/http.umd.js',
            defaultExtension: 'js'
        },
        rxjs: {
            main: 'Rx.js',
            defaultExtension: 'js'
        }
    }
};

function bundle(moduleName, moduleBundleName, minify, done) {
    const outputConfig = {
        sourceMaps: true,
        minify
    };
    const builder = new Builder(bundleConfig);
    const outputFile =
        path.join(config.PATHS.dist.bundles, `${moduleBundleName}${(minify ? '.min' : '')}.js`);
    const bundlePromise =
        builder.bundle(`${moduleName}`, outputFile, outputConfig);
    return bundlePromise.then(() => {
        done();
    });
}

gulp.task('bundle:cjs', ['scripts:cjs'], (done) => {
    bundle('ngx-adal/core', 'ngx-adal', false, done);
});

gulp.task('bundle:cjs:min', ['scripts:cjs'], (done) => {
    bundle('ngx-adal/core', 'ngx-adal', true, done);
});

gulp.task('bundle', ['bundle:cjs', 'bundle:cjs:min']);
