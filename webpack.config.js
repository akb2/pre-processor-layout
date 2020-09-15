// Webpack v4
const path                      = require('path');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin   = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin            = require('uglifyjs-webpack-plugin');

const config                    = require('./config.json');

// Проверка настроек
config.output_css_name          = typeof config.output_css_name === 'string'? config.output_css_name: '';
config.output_css_name          = config.output_css_name.length > 0? config.output_css_name: 'styles';
config.output_js_name           = typeof config.output_js_name === 'string'? config.output_js_name: '';
config.output_js_name           = config.output_js_name.length > 0? config.output_js_name: 'scripts';





// Проверка настроек
module.exports = ( env, option ) => {
    const production                = option.mode === 'production'? true: false;



    // Базовые настройки WebPack
    let webpack_config = {
        entry: { main: './src/app.js' },
        output: {
            path: path.resolve( __dirname, config.output ),
            filename: config.output_js + '/' + config.output_js_name + '.js'
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
            new MiniCssExtractPlugin ({
                filename: config.output_css + '/' + config.output_css_name + '.css'
            })
        ],
        optimization: {
            minimizer: []
        }
    }



    // Минификация JS
    if ( production === true & config.minify_js === true ) {
        webpack_config.optimization.minimizer.push( new UglifyJsPlugin ({
            test: /\.js(\?.*)?$/i,
            extractComments: true
        }));
    }

    // Минификация CSS
    if ( production === true & config.minify_css === true ) {
        webpack_config.plugins.push( new OptimizeCssAssetsPlugin ({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: [
                    'default', {
                        discardComments: { removeAll: true }
                    }
                ]
            },
            canPrint: true
        }));
    }



    return webpack_config;
};