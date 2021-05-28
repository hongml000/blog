---
tags: vue
---
<!-- # mixins 的使用 -->
## mixins 的使用

mixins 主要用于组件的复用（针对逻辑部分），对比方法复用的的好处在于，它保留有自己的生命周期，以下是使用的例子

```js
// src/utils/mymixins.js
export const myMixins = {
  data() {
    return {
      text: "mymixins's content"
    };
  },
  created() {
    console.log("myMixins's created");
  },
  methods: {
    test() {
      console.log("hello, myMixins!");
    }
  },
  mounted() {
    console.log("mymixins's mounted!");
  }
};
```

```html
<!-- src/views/UseMixins.vue -->
<template>
  <div>my mixins</div>
</template>

<script>
  import { myMixins } from "@/utils/mymixins";
  export default {
    name: "",
    components: {},
    mixins: [myMixins],
    data() {
      return {};
    },
    computed: {},
    created() {
      // 这时，混入的组件的内容这时就当作是当前vue实例对象的方法和属性
      this.test();
      console.log(this.text);
    },
    methods: {}
  };
</script>
```

```
>>>
myMixins's created
hello, myMixins!
mymixins's content
mymixins's mounted!
useMixins's mounted
```

- 从输出可以看出，混入的生命周期是穿插在使用的组件中的，并早于组件中的生命周期，而组件的生命周期优先于混入的（如果有同名属性，会覆盖混入的内容）
