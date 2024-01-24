// webpack.config.js
module.exports = {
    entry: './src/components/home/Home.js', // Замените на путь к вашему файлу с кодом
    output: {
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  };
  