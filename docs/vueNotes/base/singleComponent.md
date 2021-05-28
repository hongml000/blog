---
tags: vue
---


<!-- # 单文件组件 -->
xxx.vue 的文件就是一个单文件组件，实际上就是一个组件

## 单文件结构
单文件结构分为三部分：
1. `<template>` 模板部分
2. `<script> `放置数据逻辑部分
3. `<style> `放置组件样式

```html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <!-- router-view是用来显示对应路由下的模板 -->
    <router-view/>
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