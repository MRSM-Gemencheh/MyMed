const path = require('path');

module.exports = {
    mode: "development",
    entry: {
      index: './src/index.js',
      profile: './src/profile.js',
      createPengguna: './src/createPengguna.js',
      createRecord: './src/createRecord.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
      },
  };