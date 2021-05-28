<!-- 数据相关 -->
## 表格从redux中获取值，未及时更新
原因：数据结构复杂，深层数据改变时，因对象引入地址未改变，所以监听不到数据的变化

### 数据的引申
#### 对象
对象拷贝时，如果使用扩展运算符（...）或Object.assign({}, data)只会改变最外层的引用地址，所以我们在做数据双向绑定时，常常用到这个方法，只要最外层的引用地址改变了，就能触发重新渲染
```js
let a = {
  x: 1,
  y: {z: 2}
}
let b = Object.assign({}, a)    // 效果同: let b = {...a}
// 当赋值时：
// a -> x
//   -> y -> z

// b -> x1
//   -> y1 -> z

b.x = 2
console.log(a.x)  // 1
console.log(b.x)  // 2
// 值不等，是因为指向的x的地址已经不同

b.y.z = 3;
console.log(a.y.z)  // 3
console.log(b.y.z)  // 3
// 值相等，是因为指向的z的地址相同

b.y = {z: 4}
console.log(a.y)  // {z:3}
console.log(b.y)  // {z:4}
// 会发现，a和b的x值和y值并不相等，是因为b改变了x和y的引用地址，而b.y改变了指向z的地址
// a -> x -> z
//   -> y -> z

// b -> x1
//   -> y1 -> z1

```
#### 数组拷贝
推荐使用map,filter,reducer等方法，因为会生成一个新的数组，而不会改变原数据

### 回归问题
往往我们更改深层数据时：
```obj.tt.cc.ss = {a: "bb"}```
因为数据过于深层，最外层地址未改变，react会认为数据未有改变，所以不会触发重新渲染
```js
// 原来:
obj.tt.cc.ss = {a: "bb"}
update(obj)

// 修改:
newObj = Object.assign({}, obj)
newObj.tt.cc.ss = {a: "bb"}
update(newObj)
```

## 子组件使用state接收props的值，视图并未更新
```jsx
// father
constructor(props) {
  super(props)
  this.state = {
    step: 1;
  }
}
// 父组件点击时，step变为2
change() {
  this.setState({
    step: 2;
  })
}
<Son step={this.state.step} onClick={change}></Son>

// son
constructor(props) {
  super(props)
  this.state = {
    step: props.step || 1;  // 设置默认值
  }
}
render() {
  return (
    // 当点击组件时，this.state.step >>> 2; 但2222并未显示在视图上
    <div>
      {this.state.step} 
      {
        this.state.step === 2 ? <div>2222</div> : ""
      }
    </div>
  )
}
```
当点击组件时，this.state.step >>> 2; 但2222并未显示在视图上，而是显示空；
因为state并不能及时接收到props的更改，并且渲染到视图上

设计state和props要遵循几个原则：
1. react是单向数据流，即props是本身只读，是不可变的，只有父组件能更改，并由父组件传给子组件，子组件只能通过父组件去更改这个值
2. state是组件的私有对象，用于控制这个组件本身可变的状态
3. state不应存储哪些属性：
  * 计算属性，计算属性应放在render()函数中实现，存储在state往往要通过setState手动更新
  * props的重复数据。组件中应该保持props的唯一来源
  * 不要将React组件保存在state中
  * state数据要保存可变的数据，不可变的数据不要保存到state中

这上面的例子就违背了第1个原则，state是用来存储组件本身可变的数据，不可用来保存不可变的props数据，正确用法是直接使用props.step
```jsx
// son
constructor(props) {
  super(props)
  // this.state = {
  //   step: props.step || 1;  // 设置默认值
  // }
}
render() {
  return (
    // 当点击组件时，this.state.step >>> 2; 但2222并未显示在视图上
    <div>
      {this.props.step} 
      {
        this.props.step === 2 ? <div>2222</div> : ""
      }
    </div>
  )
}
```
如果要设初始值，有两种方法：
1. 在渲染函数中，设置一个变量，接收props.step的值，并设置默认值
```jsx
render() {
  const step = this.porps.step || 1;
  return (
    <div>
      {
        step === 2 ? <div>2222</div> : ""
      }
    </div>
  )
}
```
2. 使用PropTypes来校验父组件的值
```jsx
import PropTypes from 'prop-types'
const Son = (props) => {
  return (
    <div>
      {
        props.step === 2 ? <div>2222</div> : ""
      }
    </div>
  )
}
Son.propTypes = {
  step: PropTypes.number
}
Son.defaultProps = {
  step: 1
}
```