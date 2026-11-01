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
        'charts': './src/js/charts',
        'custom': './src/js/custom'
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
        // The vendor bundle is large by design (jQuery, Bootstrap, DataTables, ...)
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
        //make webpack ignore moment locale require: https://github.com/moment/moment/issues/2517
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment([\\/]min)?$/
        }),

        //global jquery is provided to any webpack modules
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        //copy patternfly assets for demo app
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/html/*.html', to: '[name][ext]' },
                // img/ is intentionally not copied: the committed img/ folder holds
                // site-specific files that differ from patternfly's.
                { from: 'node_modules/patternfly/dist/fonts/*.*', to: 'fonts/[name][ext]' },
                { from: 'node_modules/patternfly/dist/css/*.*', to: 'css/[name][ext]' }
            ]
        }),

        //creates distribution css file rather than inlining styles
        new MiniCssExtractPlugin({ filename: '[name].css' })
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

            // bundle LESS and CSS auto-generating -vendor-prefixes
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },

            //font/image loaders: inline small files, emit the rest as [name].[ext]
            {
                test: /\.(svg|woff2?|ttf|eot)(\?\S*)?$/,
                type: 'asset',
                parser: { dataUrlCondition: { maxSize: 65000 } },
                generator: { filename: '[name][ext]' }
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
