const NodemonPlugin = require('nodemon-webpack-plugin')
const StringReplacePlugin = require("string-replace-webpack-plugin")
const path = require('path')
const config = require('../env/prod')

module.exports = {
  entry: {
    'main': "./src/app.js"
  },
  mode: "production",
  output: {
    filename: `[name]_${config.version}.js`,
    path: path.resolve(__dirname, 'static/js/')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          {
           loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /(\ \-?[\d\.]*vh)/g,
                replacement: (match, p1, offset, string) => ' calc(var(--vh) * var(--sc) *' + p1.replace('vh', ')')
              },
              {
                pattern: /(rh)/g,
                replacement: () => 'vh'
              }
            ]
          })
         }
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new NodemonPlugin({
      script: './server/index.js',
      watch: './server',
      args: ['prod'],
      nodeArgs: ['--expose-gc']
    }),
    new StringReplacePlugin()
  ]
}