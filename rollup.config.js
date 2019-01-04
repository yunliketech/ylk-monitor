import { uglify } from "rollup-plugin-uglify";

export default {
    input: 'src/index.js',
    output: {
      file: 'build/ylkMonitor.js',
      name:"ylkMonitor",
      format: 'iife'
    },
    plugins: [
        // uglify()
    ]
  };