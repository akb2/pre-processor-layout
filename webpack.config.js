// Webpack v4
const path                      = require('path');
const dirs                      = require('./dirs.json');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin   = require('optimize-css-assets-webpack-plugin');

let config = {
    entry: { main: './src/app.js' },
    output: {
        path: path.resolve( __dirname, dirs.dist ),
        filename: dirs.js + '/scripts.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: dirs.css + '/styles.css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: [
                    'default',
                    {
                        discardComments: {
                            removeAll: true
                        }
                    }
                ]
            },
            canPrint: true
        })
    ]
}


module.exports = (env, options) => {
    let production = options.mode === "production";

    let minificatorJs = new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: true,
            unsafe: true
        }
    });
    if (production) {
        config.plugins.push(minificatorJs);
    }
    config.devtool = production ? false : "eval-sourcemap";


    return config;
};

module.exports = config;