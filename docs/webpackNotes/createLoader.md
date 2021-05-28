<!-- # 如何编写一个loader -->

所谓 loader 只是一个导出为函数的 JavaScript 模块

```js
// src/index.js
console.log('hello hml')


// loaders/replaceLoader.js   将源目录index.js中的 hml 替换成 hongml

// 1. 一个简单的loader实例

// // loader其实就是一个函数，注意这里因为要使用this取其相关内容，所以不能写成箭头函数改为this指向
// // source是指引入的文件源代码
// module.exports = function(source) {
//   // return source.replace('hml','hongml'); //不带任何参数的

//   // 如果这个 loader 配置了 options 对象的话，this.query 就指向这个 option 对象
//   return source.replace('hml', this.query.name) 
// }

// 2. 使用官方推荐的loader-utils来解析options里的参数

// 使用this.query方法有时获取并不是这么方便，所以官方推荐使用loader-utils来取代
// var loaderUtils = require('loader-utils');
// module.exports = function(source) {
//   const options = loaderUtils.getOptions(this)
//   return source.replace('hml', options.name)
// }


// 3. 使用callback来返回多个内容

// 如果需要返回除了源码以外的东西，比如sourcemap，单return就不够用了，需要用上callback函数
// var loaderUtils = require('loader-utils');
// module.exports = function(source) {
//   const options = loaderUtils.getOptions(this)
//   const result = source.replace(hml', options.name)
//   // this.callback(
//   //   err: Error | null,        
//   //   content: string | Buffer,
//   //   sourceMap?: SourceMap,
//   //   meta?: any
//   // );
//   this.callback(null, result)

// 4. 使用callback实现异步调用

var loaderUtils = require('loader-utils');
module.exports = function(source) {
  const options = loaderUtils.getOptions(this)
  // 这种写法会返回一个错误：Final loader (./loaders/replaceLoader.js) didn't return a Buffer or String
  // setTimeout(() => {
  //   const result = source.replace('hml', options.name)
  //   return result;
  // }, 1000);

  // 必须借用this.async方法来使用
  const callback = this.async()   // this.async实际上就是异步回调，返回this.callback
  setTimeout(() => {
    const result = source.replace('hml', options.name)
    callback(null, result)    
  }, 3000);
}


```

```js
// 配置文件

// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'development',  
  entry: {
    'main': './src/index.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        /// // 自己写的Loaders需要写入路径
        // path.resolve(__dirname,'./loaders/replaceLoader.js')

        // 配置带参数的
        {
          
          loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
          options: {
            name: "hongml" 
          }
        }
      ]
    }]
  }, 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
}

// package.json
{
  "name": "make_loader",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "webpack": "^4.41.2",
    "webpack-cli": "^3.3.10"
  }
}

```


# 如何引入多个自定义loader
```js
// worldLoader.js  替换成 hongml 后的源码，将 hongml 替代成 world
module.exports = function(source) {
  return source.replace('hongml', 'world')
}

// webpack.config.js
module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        // 增加一新写入的loader，注意顺序是从右到左，从下到上执行
        path.resolve(__dirname,'./loaders/worldLoader.js'),
        {
          // 配置带参数的
          loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
          options: {
            name: "hongml" 
          }
        }
      ]
    }]
  }
}

// 每次不想写引入loader的路径，想让其自己查找，可以优化成
module.exports = {
  mode: 'development',  
  entry: {
    'main': './src/index.js'
  },
  // 可设置引入Loaders的目录
  resolveLoader: {
    modules: ['node_moduls', 'loaders']
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [    
        // path.resolve(__dirname,'./loaders/worldLoader.js'),
        'worldLoader',
        {
          // 配置带参数的
          // loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
          loader: 'replaceLoader',
          options: {
            name: "hongml" 
          }
        }
      ]
      
    }]
  }
}
```


# 自定义loader的应用

## 实时监控异常处理上报
```js
module.exports = function(source){
  try {
    function() {
      ....
    }
  }catch(e) {
    ....
  }
}
```

## 中英文替代
```js
module.export = function(source) {
  if(全局变更==='中文') {
    // eng可以是某个变量
    source.replace(eng,'换成中文')
  }else if(全局变更==='英文') {
    // 中文内容也可以使用变量替代
    source.replace('中文内容', 'eng-content')
  }
}
```

参考官网：https://www.webpackjs.com/api/loaders/