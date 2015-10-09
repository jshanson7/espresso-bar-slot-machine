module.exports = {
  host: 'localhost',
  port: 3000,
  env: process.env.NODE_ENV || 'development',
  entry: './src/index',
  inputDir: 'src',
  outputDir: 'dist',
  outputFile: 'bundle'
};