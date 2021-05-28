---
tags: vue
---

<!-- # 状态存储 -->
## sessionStorage
保存一个会话时间的数据，当关掉页面或浏览器时销毁，可以适用于用户登录
```js
// login中处理
const token = 'fxeeojqofj'
sesstionStorage.setItem('token', value)

// 定义IP
const host = {
    test: 'http://10.11.22.107:7075'
}

const service = axios.create({
    baseURL: host.test
})

// 在发送请求前，request拦截器中，在headers中注入token
service.interceptors.request.use(
    config => {
        if(sesstionStorage.getItem('token')) {
            config.headers.token = sessionStorage.getItem('token')
        }
        return config
    },
    error => {
        console.log(error)
        Promise.reject(error)
    }
)


// 退出登录
logout() {
    sessionStorage.clear()
    this.$router.push({ path: '/login'})
}
```

## localStorage
长时间保存数据


## vuex
比较麻烦，适用于数据量大时用，轻量时，建议使用其它方法


## 在页面中自定义变量暂存
1. 如果是原始值，直接用=赋值即可
2. 如果是数组，要使用数组拷贝
```
b = a.map(item => item)
```
3. 如果是对象，使用对象拷贝（无论里面数据多复杂）
```
objA = { ... }
str = JSON.stringify(objA)
objB = JSON.parse(str)
objC = Object.assign({}, objB)
```

## observable
使用vuex难免比较烦杂，vue 2.6版本以后支持observable进行状态管理，适用应用较小时的状态管理
```js
// 创建src/store/store.js文件,定义变量状态，和改变状态的方法
import Vue from 'vue'
export const store = Vue.observable({ count: 0 })
export const mutations = {
  setCount (count) {
    store.count = count
  }
}
```
```html
<template>
  <!-- 然后在需要使用到此状态变量的组件中应用 -->
 <div>
   <!-- 注意，count++不行，因为不能直接个性状态，必须通过mutations里的方法个性，Computed property "count" was assigned to but it has no setter -->
   <button @click="setCount(count+1)">click me!</button>
   <p>{{ count }}</p>
 </div>
</template>

<script>
import { store, mutations } from '@/store/store'
export default {
  name: 'Test',
  computed: {
    // 获取状态变量
    count () {
      return store.count
    }
  },
  methods: {
    // 定义更改变量状态方法
    setCount: mutations.setCount
  }
}

</script>
```