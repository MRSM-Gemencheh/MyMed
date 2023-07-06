const path = require('path');

module.exports = {
    mode: "development",
    entry: {
      index: './src/index.js'
    //   listingPage: './src/listingPage/senarai.js',
    //   ciptaPage: './src/ciptaPage/cipta.js',
    //   individualProgramPage: './src/individualProgramPage/program.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
      },
  };