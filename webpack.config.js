const path              = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const out               = new Object();
      out.base          = '.dist';
      out.template      = '__template_name__';
      out.template_dir  = out.base + '/local/templates/__template_name__';
      out.js            = out.template_dir + '/js';
      out.css           = out.template_dir + '/css';


module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve( __dirname, out.js ),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css')
  ]
};