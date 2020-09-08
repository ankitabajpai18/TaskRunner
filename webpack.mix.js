const mix = require('laravel-mix');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyPlugin = require('copy-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css').options({
        postCss: [
            require('postcss-css-variables')()
        ]
    })
    .copyDirectory('resources/fonts', 'public/fonts');
// mix.browserSync('http://local.remit4x.com/');
mix.webpackConfig({
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: 'resources/images/',
                to: 'images'
            }, ],
        }),
        new ImageminPlugin({
            // disable: process.env.NODE_ENV !== 'production', // Disable during development
            pngquant: {
                quality: '95-100',
            },

            test: /\.(jpe?g|png|gif|svg)$/i,
            plugins: [
                imageminMozjpeg({
                    quality: 80,
                    progressive: true
                }),
                imageminOptipng(),
                imageminGifsicle(),
                imageminSvgo({
                    plugins: [{
                        removeViewBox: false
                    }]
                })
            ]

        })
    ]
});
//mix.copy('resources/images/', 'public/images');
