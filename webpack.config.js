// Webpack v4
const path                  = require('path');
const dirs                  = require('./dirs.json');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

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
                use: {
                    loader: "babel-loader"
                }
            }, 
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [ 
        new MiniCssExtractPlugin({
            filename: dirs.css + '/styles.css'
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