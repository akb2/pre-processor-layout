// Webpack v4
const path                      = require('path');
const glob                      = require('glob');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin   = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin            = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin         = require('html-webpack-plugin');
const CopyWebpackPlugin         = require('copy-webpack-plugin');
const getLogger                 = require('webpack-log');
const log                       = getLogger({ name: 'file' });
const webpack                   = require('webpack');

const config                    = require('./config');

// Проверка настроек
config.output_css_name          = typeof config.output_css_name === 'string'? config.output_css_name: '';
config.output_css_name          = config.output_css_name.length > 0? config.output_css_name: 'styles';
config.output_js_name           = typeof config.output_js_name === 'string'? config.output_js_name: '';
config.output_js_name           = config.output_js_name.length > 0? config.output_js_name: 'scripts';





// Проверка настроек
module.exports = ( env, option ) => {
    const production    = option.mode === 'production'? true: false;
    let pluginsOptions  = [];



    // Поиск страниц PUG
    {
        const pages = glob.sync( __dirname + '\\src\\pages\\**\\*.pug' );
        pages.forEach( function ( file) {
            let base    = path.relative( __dirname + '\\src\\pages', file );
                base    = base.replace( /\.pug$/, '' );

            pluginsOptions.push(
                new HtmlWebpackPlugin({
                    filename: config.output_pages + '/' + base + '.html',
                    template: './src/pages/' + base + '.pug',
                    inject: true
                })
            );
        });
    }

    // Поиск страниц PHP, шапки и подвала PHP
    {
        let phpFiles    = [];
        const pages     = glob.sync( __dirname + '\\src\\pages\\**\\*.php' );
        pages.forEach( function ( file) {
            let base    = path.relative( __dirname + '\\src\\pages', file );
                base    = base.replace( /\.php$/, '' );

            phpFiles.push({
                from: './src/pages/' + base + '.php',
                to: './' + config.output_pages + '/' + base + '.php'
            });
        });

        // Прочие файлы шаблона
        const files     = glob.sync( __dirname + '\\src\\templates\\files\\**\\*.php' );
        files.forEach( function ( file) {
            let base    = path.relative( __dirname + '\\src\\templates\\files', file );
                base    = base.replace( /\.php$/, '' );

            phpFiles.push({
                from: './src/templates/files/' + base + '.php',
                to: './' + config.output_template + '/' + base + '.php'
            });
        });


        if ( phpFiles.length > 0 ) {
            pluginsOptions.push( new CopyWebpackPlugin ({
                patterns: phpFiles
            }));
        }
    }

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
                }, {
                    test: /\.(css|scss|sass)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                    ]
                }, {
                    test: /\.pug$/,
                    loaders: [
                        'html-loader',
                        'pug-html-loader?pretty=true'
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin ({
                filename: config.output_css + '/' + config.output_css_name + '.css'
            }),
            ...pluginsOptions,
        ],
        optimization: {
            minimizer: []
        },
        devServer: {
            index: 'index.html',
            overlay: true,
            stats: 'errors-only',
            compress: true,
            clientLogLevel: 'error',
            open: true,
            port: config.live_port,
            hotOnly: true
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