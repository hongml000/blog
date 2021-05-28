<!-- # 编写一个plugin -->
## 编写一个plugin
```js
// 自定义插件，插件本质上是一个类
// ./plugins/copyright-webpack-plugin.js
class CopyrightWebpackPlugin {
  // 可以在构造函数中接收参数 constructor(args)
  constructor() {
    console.log('插件被使用了')
  }
  apply(compile) {

  }
}
module.exports = CopyrightWebpackPlugin;

// src/index.js
console.log('hello world')

// webpack.config.js
const path = require('path')
const copyrigthWebpackPlugin = require('./plugins/copyright-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    main: "./src/index.js" 
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js"
  },
  plugins: [
    // 可以在实例化时，增加参数 new copyrigthWebpackPlugin(args)
    new copyrigthWebpackPlugin()
  ]
}

// package.json
{
  "name": "make_plugin",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10"
  }
}
```

参考： https://www.webpackjs.com/concepts/plugins/ 