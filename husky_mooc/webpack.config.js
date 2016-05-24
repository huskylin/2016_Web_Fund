module.exports = {
	entry: {
		loginForm: './static/js/src/loginForm.js'
	},
  output: {
		path: './static/js/dist/',
		filename: '[name].js'
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
    extensions: ['', '.js', '.json']
  }
};
