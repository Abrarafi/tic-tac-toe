const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV ?? 'development',
  entry: './src/entrypoint.jsx',
  module:{
    rules:[
      {
        test:/.jsx?$/,
        exclude:/node_modules/,
        use:[
          {
            loader:'babel-loader',
             options: {
              presets: [
                "@babel/preset-env", // Browser compatibility / polyfills
                ["@babel/preset-react", { runtime: "automatic" }], // Turns JSX => JS
              ],
            },
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
};