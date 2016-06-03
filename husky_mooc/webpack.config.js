module.exports = {
  entry: {
    loginForm: './static/js/src/loginForm.js',
    registerForm: './static/js/src/registerForm.js',
    postForm: './static/js/src/postForm.js'
  },
  output: {
    path: './static/js/dist',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
}
