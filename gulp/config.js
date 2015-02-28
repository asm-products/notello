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
  },
  publish: {
    src: [
      {
        path: './dist/bundle.js',
        key: 'bundle.js'
      },
      {
        path: './dist/styles.css',
        key: 'styles.css'
      },
      {
        path: './dist/styles.css.map',
        key: 'styles.css.map'
      }
    ],
    bucket: 'notello.com',
    region: 'us-west-2'
  },
  ship: {
    filesToMove: [
      './index.php'
      // './icons/**/*.*',
      // './src/page_action/**/*.*',
      // './manifest.json'
    ],
    base: './'
  }
};
