---
tags: vue
---
<!-- vue-class-components的使用 -->
## vue-class-components
vue-class-components 是尤大大推出的vue对typescript支持的装饰器(库)，用类的方式编写组件


### 为什么要用vue-property-decorator？它是什么？
1. vue-property-decorator是基于vue-class-components的装饰器，深度依赖了vue-class-component，拓展出了更多操作符：@Prop、@Emit、@Inject、@Model、@Provide、@Watch；
2. 使用这个库，我们可以直接写ts语法

### 安装
```
npm i -S vue-property-decorator
```

### 使用
1. data可以直接使用ts的写法，定义在类属性中
2. 生命周期写法不变，注意定义方法时，方法名一定不要与生命周期重名
3. methods也是直接写在类属性中
4. 计算属性，写法类似于方法，只不过方法名前加个get关键字
```vue
<template>
  <p>{{`hello,${name}`}}</p>
</template>
// 装饰scirpt标签，设为使用ts语言
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
export default class App extends Vue {
  name: String = 'miao';
  list: Array<String> = ['ii', 'ss']

  // hooks
  mounted() {
    this.sayHello();
  }

  // computed
  get MyName():string {
    return `My name is ${this.name}`
  }
 
  // methods
  sayHello():void {
    alert(`Hello ${this.name}`)
  }
  
  
}
// 相当于
export default {
  data() {
    return {
      name: 'miao',
      list: ['ii', 'ss']
    }
  }

  mounted () {
    this.sayHello()
  },
 
  computed: {
    MyName() {
      return `My name is ${this.name}`
    }
  },
 
  methods: {
    sayHello() {
      alert(`Hello ${this.name}`)
    },
  }

}
</script>
```

5. @Prop 接收父级props属性
@Prop() 接收父组件的属性
@PropSync()和@Prop()的区别，在于子组件可以改变props的值，并同步更新emit给父组件

```vue
<script>
@Porp({
  type: Boolean,  // 父组件传递给子组件的类型，这里的Boolean是js的校验
  required: false, // 是否必须传的值
  default: false // 默认值，如果传入的是 Object或数组，则要 default: ()=>({}) 参数为函数或数组的话。默认值从一个工厂函数中返回
      // defatult: () => {
      //     return ['a','b']
      // }
}) isOpen !: boolean
// isOpen是要传递的属性名，！是非null和非undefined的类型断言,这里的boolean是ts的类型校验
</script>

@PropSync()和@Prop()的区别，在于子组件可以改变props的值，并同步更新emit给父组件
// 子组件
<template>
  <div>
    <p>{{count}}</p>
    <button @click="innerCount += 1">increment</button>
  </div>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator"

@Component
export default class PropSyncComponent extends Vue {
  // 注意@PropSync 里的参数不能与定义的实例属性同名, 因为还是那个原理, props 是只读的
  @PropSync('count') private innerCount!: number
}
</script>

// 父组件
<template>
  <!-- 注意父组件里绑定 props 时需要加修饰符 .sync -->
  <PropSyncComponent :count.sync="count" />
</template> 
```

6. @Component 引入组件
```js
// 父组件
<template>
  <my-component count={3}/>
</template>
import { Vue, Component, Prop } from 'vue-property-decorator';
// 导入组件方式不变，注意ts不认识vue文件，所以组件一定要加.vue后缀
import MyComponent from './components/MyComponent.vue'

@Component({
  // 使用Component接收导入的组件
  components: {
    MyComponent
  }
})

// 子组件
import { Vue, Component, Prop } from 'vue-property-decorator';
export default class MyComponent extends Vue {
  // 接收父级props属性
  @Prop(String) count!: String;
}
```

7. Watch监听属性
```js
@Watch('propName', {deep: true, immediate: true})
// 这个方法名起名随意，只是用来标识propName修改时会调用该方法，其它地方并不会使用这个方法名 
propNameWatch(newVal: string, oldValue: string) {
  // 执行propName改变后的逻辑处理
  if(newVal !== oldValue) {
    this.message = "propName属性改变了"
  }
}
```

8. @Emit 触发父组件定义的方法
```js
import { Vue, Component, Emit } from 'vue-property-decorator'
// 子组件
@Component
export default class YourComponent extends Vue {
  count:number = 0

  @Emit()
  addToCount(n: number) {
    this.count += n
  }
  // 类似于以下js写法，如果Emit中不带参数，则默认将子组件中的方法名和参数，当作要触发父组件的方法名和参数，这时方法名会从 驼峰camelCase 会转化为小写-小写 dash-case 的写法, 带参数时则不会转换
  addToCount(n) {
    this.count += n
    this.$emit('add-to-count', n)
  }

  @Emit('reset')
  resetCount() {
    this.count = 0
  }
  // 类似于
  resetCount() {
    this.count = 0
    this.$emit('reset')
  }

  @Emit()
  returnValue() {
    return 10
  }
  // 类似于
  returnValue() {
    this.$emit('return-value', 10)
  }

// 父组件
<your-component @reset='reset' @addToCount='add'/>
// 父组件就会执行reset和add的方法
```

9. @Inject 本质是转换inject和provide，这是vue中元素向深层子孙组件传递数据的方式，与react中的context类似
```vue
<!-- 子孙节点 -->
<template>
  <span>Inject deeper: {{ bar }}</span>
</template> 
<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";

@Component
export default class InjectComponent extends Vue {
  @Inject()
  private bar!: string
  private mounted() {
    console.log(this.bar)
  }
}
</script>

<!-- 祖先节点 -->
<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator"
export default class App extends Vue {
  @Provide()
  private bar = "deeper 修"
}
</script>
```

10. 如果要对dom进行操作，ts是不认识的，所以得加as HTMLDivElement说明
```js
let dom = document.documentElement as HTMLDivElement
// 包括使用$refs获取的对象
let dom: any = this.$refs.section as HTMLDivElement
```

>参考：  
<https://blog.csdn.net/jb_7113/article/details/89928402?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase>  
<https://blog.csdn.net/longzhoufeng/article/details/105132381?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase>     
<https://blog.csdn.net/xiaowoniuqiren/article/details/103322024>    
<https://www.jianshu.com/p/942550376b86>   