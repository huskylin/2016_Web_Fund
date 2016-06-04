module.exports = {
  entry: {
    signinForm: './static/js/src/signinForm.js',
    signupForm: './static/js/src/signupForm.js',
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
