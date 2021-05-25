# ele 组件注意的问题

## 属性布尔值的处理

当组件里，出现默认为 boolean 的属性值，写上一般就默认是默认值，不写就默认没有，不用赋值  
如果一定要赋值，必须使用:v-bind 方法传

```html
<!-- 比如el-form里面的“hide-required-asterisk”属性，hide-required-asterisk默认是false，如果不写，就是按默认，不隐藏必填项的星号标识 -->
<el-form ref="form" :model="sizeForm">
  <el-form>
    <!-- 写上就是为true，表示隐藏星号 -->
    <el-form ref="form" :model="sizeForm" hide-required-asterisk>
      <el-form>
        <!-- 如果要动态绑定属性值，必须加上:绑定 -->
        <el-form ref="form" :model="sizeForm" :hide-required-asterisk="true">
          <el-form></el-form></el-form></el-form></el-form></el-form
></el-form>
```

## 时间树 el-timeline

时间树组件只支持 2.6.0 以上的版本

## 标签页

#### el-tabs

el-tab-pane，如果标签名，使用自定义的样式，在 slot 的里面，绑定数据，数据无法做到响应式

```html
<!-- 如果count是在钩子里获取的，无法做到响应性 -->
<el-tab-pane>
  <span slot="label">
    <i class="el-icon-date"></i>
    {{ count }}我的行程
  </span>
  我的行程
</el-tab-pane>

<!-- 暂时解决方案 -->
<!-- 不使用自定义的slot(不用样式...)，直接在el-tab-pane的label中动态绑定 -->
<el-tab-pane :label="count"></el-tab-pane>
```

使用 2.8.0 的版本，切换标签会卡死，不知道现在修复没有

## el-button 在 firefox 无法点击

因为 el-button 中，如果有其它标签或是跳转标签，点击在火狐浏览器中是无效的.

```html
<!-- 这段代码，在火狐浏览器无法点击 -->
<el-button @click="toPage">
  <span class="carousel-link">click me!</span>
</el-button>

<!-- 改进后的 -->
<span @click="toPage" class="carousel-link">
  click me!
</span>

<script>
  methods: {
      toPage() {
          this.$router.push({ name: 'otherpage'})
      }
  }
</script>
```

修改方法：

1. 去掉 el-button 中的其它附加标签，直接使用 el-button
2. 去年 el-button，直接自己使用 css，编辑样式

```css
.carousel-link {
  cursor: pointer;
  color: blue;
}
```

## el-select 宽度没跟 el-input 一致

直接在 el-select 中 style 中直接写样式，跟 el-input 一致即可

```HTML
<el-select v-model="value" placeholder="请选择" style="width:320px;">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled">
    </el-option>
  </el-select>
```

## 表单校验

如果只想做非空校验，只需在自定义中对于非空部分做校验，对于空部分，可以直接 callback()空，这样就不会做任何校验

```HTML
<el-form
  :model="ruleForm"
  status-icon
  :rules="rules"
  ref="ruleForm"
  label-width="100px"
  class="demo-ruleForm"

>
  <el-form-item label="密码" prop="pass">
    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
  </el-form-item>
</el-form>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules: {
          // 如果只想做非空校验，只需要自定义那部分即可，required: true这一行，就不用写了
          age: [
            { required: true, message: '不能为空！', trigger: 'blur'},
            { validator: validateAge, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      validateAge(rule, value, callback) {
        if(value){
          if(value < 0) {
            callback(new Error('不能小于1'))
          }
          // 非空则直接回调，这样会执行required: true的校验
        } else {
          callback()
        }
      }
    }
  }
</script>
```

## 级联的懒加载的使用

```html
<!-- 
  show-all-levels: 回显的多级选中项是否完整显示，默认显示
  props: 级联懒加载
-->
<el-cascader :props="areaProps" show-all-levels></el-cascader>
```

```js
data() {
  return {
    areaProps: {
      lazy: true,
      lazyLoad: this.lazyLoad,
      // 映射关系
      value: 'name',
      label: 'code',
      children: 'subList'
    }
  }
},
methods: {
  lazyLoad(node, resolve) {
    const { level } = node;
    // 各级的请求参数
    let params = {}
    // 第一级时的加载
    if(level == 0) {
      params = {
        // ...
      }
    }else {
      params = {
        // 上一级的code用来请求下一级
        code: node.value
        // ...
      }
    }
    this.$api.getAear(params).then(res => {
      let isCity = node.level == '北京市' || node.level == '天津市' || node.level == '重庆市' || node.level == '上海市'
      res.data = res.data.map(item => {
        // 设置下一级是否为叶子节点
        item.leaf = isCity ? true : node.level >= 2
        return item
      })
      resolve(res.data)
    })
  }
}
```

- 存在问题，叶子节点异常
  级联的层级不一样是 2-3 级，有可能是 5 级，不能由前端定死，要由后端告知

- 后端做法：
  当查询这一级时，通过 subList 返回这一级下的所有地区，但不知道后续的所有子地区

- 针对后端返回前端做修改：

```js
this.$api.getAear(params).then((res) => {
  let isCity =
    node.level == "北京市" ||
    node.level == "天津市" ||
    node.level == "重庆市" ||
    node.level == "上海市";
  res.data = res.data.map((item) => {
    // 设置下一级是否为叶子节点
    item.leaf = isCity ? true : !item.subList.length;
    return item;
  });
  resolve(res.data);
});
```

- 发现仍有问题，因为后端返回了 subList 有数据，所以级联已经默认拼接上了，当点击懒加载时，又请求了一次，此时`resolve`会将请求后的数据与之前 subList 的数据拼接在一起，导致重复出现
  在改了叶子节点逻辑的基础上，将`children`的列表名修改下，不用后台返回的数据，这样就不会有重复的数据了；
  当`resolve`时，组件会自己将`resolve(data)`中的`data`拼接到 sub 列表上

```js
data() {
  return {
    areaProps: {
      lazy: true,
      lazyLoad: this.lazyLoad,
      // 映射关系
      value: 'name',
      label: 'code',
      children: 'sub'  // 用改个名，不能用与后台重名的
    }
  }
}
methods: {
  lazyLoad(node, resolve) {
    const { level } = node;
    // 各级的请求参数
    let params = {}
    // 第一级时的加载
    if(level == 0) {
      params = {
        // ...
      }
    }else {
      params = {
        // 上一级的code用来请求下一级
        code: node.value
        // ...
      }
    }
    this.$api.getAear(params).then(res => {
      // 由于由后台数据决定是不是叶子节点，也就不需要前端根据省市名判断了
      // let isCity = node.level == '北京市' || node.level == '天津市' || node.level == '重庆市' || node.level == '上海市'
      res.data = res.data.map(item => {
        // 设置下一级是否为叶子节点，只需要由后台数据决定
        // isCity ? true :
        item.leaf = !item.subList.length
        return item
      })
      resolve(res.data)
    })
  }
}
```

## el-date-picker 选择弹窗定位异常
