import { uglify } from "rollup-plugin-uglify";



let config = {
  input: 'src/index.js',
  output: {
    file: '',
    name: "ylkMonitor",
    format: 'iife'
  },
  plugins: [],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
}

if(process.env.NODE_ENV=='prod'){
  config.output.file='build/ylkMonitor.js'
  config.plugins.push(uglify());
}else if(process.env.NODE_ENV=='dev'){
  config.output.file='dev/ylkMonitor-dev.js'
}

export default config;