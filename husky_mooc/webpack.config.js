const path = require('path');

module.exports = {
	entry: path.join(__dirname, '/static/js/src/index.js'),
  output: {
		filename: path.join(__dirname, '/static/js/dist/bundle.js')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.coffee']
  }
};
