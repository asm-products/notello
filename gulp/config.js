var source = './react-components/source/**/';

module.exports = {
  less: {
    src: source + '*.less',
    filename: 'styles.css',
    dest: './'
  },
  css: {
    src: './styles.css',
    dest: './dist'
  },
  browserify: {
    // Enable source maps
    debug: false,
    // What extensions besides js should be checked
    extensions: ['.jsx'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: './react-components/source/app/app.jsx',
      dest: './dist',
      outputName: 'bundle.js'
    }]
  }
};
