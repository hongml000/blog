<!-- # 项目搭建 -->
## 安装node.js
官网：https://nodejs.org/en/  
一般有LTS（长时间维护）版本和Current版本，开发时可以选择lts的
检查：  
node -v  
npm -v  
如果都显示有版本，说明安装成功

## 安装vue cli
vue cli是vue的脚手架，能帮助快速搭建一个vue项目
```
npm install -g @vue/cli  //-g为安装到全局,参考官网：https://cli.vuejs.org/zh/guide/installation.html
```
检查:  
vue -V

## vue创建项目

### 新建项目
npm create projectName
一般按默认安装: default(babel, eslint)

### 运行项目
进入项目文件夹，能正常启动，即创建成功
```
cd projectName
npm run serve
```

### router 创建路由

#### 安装
```
npm i --save-exact vue-router
```

#### 创建视图文件（组件）
```html
<!-- src/views/Home.vue -->
<template>
  <div>hello, it is Home page.</div>
</template>
<!-- src/views/About.vue -->
<template>
  <div>hello, it is about page.</div>
</template>
```

### 创建路由文件，关联视图
```js
// src/router.js

import Router from 'vue-router'
import Vue from 'vue'
// 第一种写法
// import Home from './views/Home'
Vue.use(Router)

// 定义路由
const routes = [
  {
    path: '/',
    name: 'home',
    // 第一种写法，一次性导入
    // component: Home,
    // 第二种写法，按需导入，即使用到才会导入
    component: () => import('./views/Home')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/About')
  }
]

// 导出路由对象
export default new Router({ routes })
```

#### 在main.js入口文件导入路由文件，并挂载到vue实例对象中
```js
// main.js

import Vue from 'vue'
import App from './App.vue'
// 导入路由文件
import router from './router'

Vue.config.productionTip = false

// 将路由挂载到vue对象里
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
```

#### 在模板入口App.vue文件，写上router-view，显示对应的路由内容
```html
<!-- App.vue -->

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
```

到了这一步，在url访问ip:port/#/就可以看到:  
hello, it is home page  
ip:port/#/about:  
hello, it is about page  


### 缓存

#### localStorage和sessionStorage
参考： 
对于中小型项目，可以使用 localStorag 和 sessionStorage 方法对数据进行缓存，用于页面间传值，这里为了方便对要保存的信息做进一步的处理，会封装一个方法文件： src/utils/store.js

一般localStorage和sessionStorage都自带有四个方法：
* setItem(name, value)  设置一个键值对，保存至缓存中
* getItem(name)         获取对应的键的值
* removeItem(name)      删除某个键值对
* clear()               清空完所有的键值对

#### 两者的区别
localStorage是永久保存在缓存，除非用户自己清除内容
sessionStorage只保存一个会话时间的缓存，用户关闭页面或浏览器时自动清空所有缓存

#### 两者的查看方式 
```html
<!-- 修改Home.vue文件，点击按钮时，会设置localStorage缓存 -->
<template>
  <div>hello, it is Home page.
    <button @click="login">login</button>
  </div>
  
</template>

<script>
export default {
  methods: {
    login() {
      localStorage.setItem('password', 'mypassword!')
    }
  }
}
</script>
```
查看：  
打开浏览器---右键检查---Application---Storage下，对应有localStorage和sessionStorage两个，可以查看对应网站下的缓存    
这里例子是在 http://localhost:8080下的，就有了password键值对了  

#### 缓存数据的加密
在以上的方式设置时，我们可以看到密码这种敏感性的信息，都会以明文的方法显示，这显示是很不安全的，所以一般我们会对其做进一步的加密操作
```js
// 这里以aes加密算法为例，参考：https://www.liaoxuefeng.com/wiki/1022910821149312/1023025778520640

// 加密算法
// data为要加密和解密的内容，key是加盐部分，加密和解密的key必须相同，才可以解密
function aesEncrypt(data, key="mysecretKey") {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

// 解密算法
function aesDecrypt(encrypted, key="mysecretKey") {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}



// 新建src/uitls/store.js文件，对localStorage的数据进一步封装，使其具有加密功能
export const setStorage = (name, value) => {
  if(!name) return 
  // 对内容进行加密后，再赋给localStorage，这样就以加密方式来存储敏感信息了
  localStorage.setItem(name, aesEncrypt(value))
}

export const getStorage = (name) => {
  if(!name) return 
  // 获取加密后的内容
  let value = localStorage.getItem(name)
  // 返回解密后的内容
  return aesDecrypt(value)
}

// localStorage.removeItem(name)和localStorage.clear()方法，用法是一样的，没有必要去做进一步封装了
```


## vuex
在缓存变量数据较多，或是工程较大，需要在多人间管理和维护时，这时有一个共同处理全局变量，这显然是必然的。而vuex就是解决这个问题

### 安装
npm i vuex --save-exact  

### 在vue中的使用
1. 创建src/store/index.js文件
```js
// src/store.index.js

import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

// 创建一个vuex对象store
const store = new Vuex.Store({
  // state用于存放全局变量的初始定义
  state: {
    count: 0
  },
  // getters用于对全局变量作一些简单计算或处理，相当于vue中的computed属性
  getters: {
    getCount: state => { return state.count+1}
  },
  // mutations，用于修改全局变量的方法，但这是同步的
  mutations: {
    addCount(state, n) {
      state.count += n
    },
    descreaseCount(state, n) {
      state.count -= n
    }
  },
  // actions，用于异步实现mutations方法，官方推荐使用这种方法来修改全局变量，这种方法必须建立在mutations的基础上
  actions: {
    add(context, n) {
      context.commit('addCount', n)
    },
    descrease(context, n) {
      context.commit('descreaseCount', n)
    }
  }
})
// 导出vuex对象store
export default store
```

2. main.js 全局引入store对象
```js
// main.js，全局引入store对象

import Vue from 'vue'
import App from './App.vue'
// 导入路由文件
import router from './router'
// 全局引入store，这样各组件就可以使用了
import store from './store'
Vue.config.productionTip = false

// 将路由挂载到vue对象里
new Vue({
  router,
  // 全局引入store，这样各组件就可以使用了
  store,
  render: h => h(App),
}).$mount('#app')
```

3. 在组件中使用
```html
<!-- src/views/Home.vue -->
<template>
  <div>hello, it is Home page.
    <button @click="login">login</button>
    <p>{{this.$store.state.count}}</p>
    <p>{{this.$store.getters.getCount}}</p>
    <!-- 注意，这里不能直接写this.$store.commit('addCount',1)，否则会有异常，必须另写个方法将其封装起来 -->
    <button @click="plus(1)">+</button>
    <button @click="Subtract()">-</button>
    <button @click="dispatchPlus(1)">actions +</button>
  </div>
  
</template>

<script>
export default {
  methods: {
    login() {
      localStorage.setItem('password', 'mypassword!')
    },
    // 同步调用mutations
    plus(n) {
      this.$store.commit('addCount', n)
    },
    // 同步调用mutations
    Subtract() {
      this.$store.commit('descreaseCount')
    },
    // dispatch异步调用，即使用actions执行mutations的方法
    dispatchPlus(n) {
      this.$store.dispatch('add', n)
    }
  }
}
</script>

```

4. 使用mapState,mapGetters,mapMutations,mapActions简化组件调用vuex
* 在组件中导入这些方法
* 在对应位置写上解构，解构的方法有2种：  
  1）一种是数组形式，这种格式为this.count替代this.$store.state.count
    ...mapState(['count'])  
    
  2）一种是对象格式,这种方式允许变量重命名，this.couunt1替代this.$store.state.count
    ...mapState({
      count1: state => state.count
    })
* 使用简化后的调用即可
```html
<!-- src/views/Home.vue -->
<template>
  <div>hello, it is Home page.
    <button @click="login">login</button>
    <!-- <p>{{this.$store.state.count}}</p> -->
    <!-- <p>{{this.$store.getters.getCount}}</p> -->
    <!-- 使用mapState和mapGetters写法，和上面达到一样的效果 -->
    <p>{{count}}</p>
    <p>{{getCount}}</p>
    <!-- 注意，这里不能直接写this.$store.commit('addCount',1)，否则会有异常，必须另写个方法将其封装起来 -->
    <button @click="plus(1)">+</button>
    <button @click="Subtract()">-</button>
    <button @click="dispatchPlus(1)">actions +</button>
  </div>
  
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    // mapState和mapGetters必须计算属性中，否则无法达到响应效果
    ...mapState({
      count: 'count'
    }),
    ...mapGetters({
      getCount: 'getCount'
    })
  },

  methods: {
    login() {
      localStorage.setItem('password', 'mypassword!')
    },
    // mapMutations和mapActions要写在methods中，调用方法同一般该方法
    ...mapMutations(['addCount','descreaseCount']),
    ...mapActions(['add']),
    //也可以使用对象，给方法重命名
    ...mapActions({
      pl : 'add'
    })
    plus(n) {
      // this.$store.commit('addCount', n)
      this.addCount(1)
    },
    Subtract() {
      // this.$store.commit('descreaseCount')
      this.descreaseCount()
    },
    dispatchPlus(n) {
      // 使用数组解构，这里方法名同actions中的一样
      // this.add(n)
      // 使用对象解构，这里可给方法重命名，也可作过滤处理
      this.pl(n)
    }
  }
}
</script>

```


参考：
vue相关面试：https://www.jianshu.com/p/475919c72264