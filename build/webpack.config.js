// For instructions about this file refer to
// webpack documentation: https://webpack.js.org/configuration/
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    devtool: 'source-map',

    entry: {
        'main': './src/js/main',
        'charts': './src/js/charts'
    },

    output: {
        // The site is served from the repository root, so bundles are emitted there.
        // Never enable `output.clean` here: it would wipe the whole repository.
        path: path.join(__dirname, '../'),
        publicPath: './',
        filename: '[name].bundle.js'
    },

    externals: {
        // require("jquery") is external and available on the global var $
        "jquery": "$"
    },

    performance: {
        // The vendor bundle is large by design (jQuery, Bootstrap, C3 and D3)
        hints: false
    },

    optimization: {
        // Avoid publishing files when compilation failed
        emitOnErrors: false,

        // Keep license comments inline instead of emitting *.LICENSE.txt files,
        // because the output directory is the repository root
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: { comments: /^\**!|@preserve|@license|@cc_on/i }
                }
            })
        ]
    },

    plugins: [
        //global jquery is provided to any webpack modules
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        //copy the page templates to the site root
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/html/*.html', to: '[name][ext]' }
                // img/ is intentionally not copied: the committed img/ folder holds
                // site-specific files.
            ]
        }),

        //creates distribution css file rather than inlining styles
        new MiniCssExtractPlugin({ filename: 'css/[name].css' })
    ],

    module: {
        rules: [
            //js loader
            {
                // Only run `.js` and `.jsx` files through Babel
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },

            // bundle CSS
            {
                test: /\.css$/,
                // css is emitted to css/, assets to the site root folders, so urls need to go up one level
                use: [
                    { loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } },
                    // keep the committed ../img/ urls as written: img/ is not processed by webpack
                    { loader: 'css-loader', options: { url: { filter: function (url) { return !url.startsWith('../img/'); } } } }
                ]
            },

            //font/image loaders: inline small files, emit the rest as [name].[ext]
            {
                test: /\.(svg|woff2?|ttf|eot)(\?\S*)?$/,
                type: 'asset',
                parser: { dataUrlCondition: { maxSize: 65000 } },
                generator: { filename: 'fonts/[name][ext]' }
            },
            {
                test: /\.(png|jpe?g|gif)(\?\S*)?$/,
                type: 'asset',
                parser: { dataUrlCondition: { maxSize: 100000 } },
                generator: { filename: '[name][ext]' }
            }
        ]
    }
};
