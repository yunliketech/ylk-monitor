import { uglify } from "rollup-plugin-uglify";



const config = {
  input: 'src/index.js',
  output: {
    file: 'build/ylkMonitor.js',
    name: "ylkMonitor",
    format: 'iife'
  },
  plugins: [],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
}


if(process.env.NODE_ENV==='prod'){
  config.plugins.push(uglify());
}
console.log(process.env.NODE_ENV,config)
export default config;