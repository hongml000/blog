---
tags: vue
---
<!-- # 项目目录结构 -->
## README.md
项目说明文件 

## build
放置webpack使用的配置文件 

## config
设置基本配置、开发环境配置、生产环境配置信息等

## package.json
项目依赖包的说明
1. dependencies 项目上线必须安装的包
2. devDependencies 开发过程需要安装的包，编译过后就可以不需要了

## package-lock.json
* 锁定安装的依赖包版本，这样不容易发生因为依赖包版本迭代而导致崩溃的问题，建议安装时使用以下命令,就不会有向上兼容版本的^符号，可以安装固定的版本：  
  npm install packageName --save-exact  
* 一般第一级目录的版本是锁定的，二级及以下的依赖包才有可能会更新


## index.html
默认的首页模板，也是网页的一个入口 

## .gitignore
说明哪些文件不需要上传到git
```
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
```
## .eslintrc.js
定义编写规则，遵循eslint规范  
.eslintignore 定义哪些目录下文件不需要遵循这个规范
## .editorconfig
定义编辑器语法
## .babelrc
babel配置  
## static
放置静态资源，静态图片或JSON数据等
## node_nodules
放置依赖包


# src 项目源代码
## main.js
整个项目的入口文件 
```javascript
import Vue from 'vue'           
import App from './App'         //这是一种省略写法，会从同级目录下，找App.*,一个个帮你找，这里是从同级APP.vue文件中导入APP组件
import router from './router'   //从同级router文件夹中导入router路由,这里默认是导入router/index.js

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,               //ES6特性，当键值名一致时，只写一个即可 router: router,
  components: { App },  // components: {App: App},
  template: '<App/>'    // template: '<App></App>'
})
```
## App.vue
单文件组件，是整个项目的根组件，可更改
```html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <!-- router-view是用来显示对应路由下的模板 -->
    <router-view/>
    <!-- 使用router-link替代a，href替换成to -->
    <router-link to="/list">go to list</router-link>
  </div>
</template>

<script>
export default {
  /* 组件名称 */
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

## router
放置路由文件,所有路由都放置在 index.js   
* 路由根据URL不同，返回给用户不同的内容  
* 在导入模板地方，./是当前目录，../是父级目录，@/指的是src/目录
```javascript
export default new Router({
  routes: [
    {
      path: '/',            //url路由
      name: 'HelloWorld',   //组件名称
      component: HelloWorld //HelloWorld组件，通过import HelloWorld from '@/components/HelloWorld'导入
    }
  ]
})
```

## assets
资源目录,一般用来放置全局样式，和一些表态图片

# api
自定义目录，用于定义接口，目录基本与views一致