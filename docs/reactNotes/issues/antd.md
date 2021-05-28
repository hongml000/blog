<!-- antd坑 -->
## Form表单相关
### Form.Item自定义组件时，未双向绑定
当使用的Item不是antd默认的组件时，将不会自动进行双向绑定，需手动执行双向绑定
```jsx
import {Form} from 'antd'
class Test from Component {
  formRef = React.createRef();
  // 需要自动触发表单值变化
  onChange(value) {
    // 可以改其中一个值，也可以改多个，它会自动合并
    this.formRef.current.setFieldsValue({tt: vlaue})
  }
  render() {
    return (
      <Form>
        <Form.Item name="tt">
          <MyComponent onChange={onChange}>
        <Form.Item>
      </Form>
    )
  }
}
```

### 自定义校验规则
```jsx
validate = (_,value) {
  if(value !== "xxx"){
    return Promise.reject("xxxx")
  }else{
    return Promise.reject()
  }
}
render() {
    return (
      <Form>
        <Form.Item 
          name="tt" 
          rules={[
            {required: true, message: "请输入tt"},
            {max: 30, message: "最大30个字"},
            {pattern: /^\d{2}$/, message:"2位数字"}
            {validate: this.validate}
            // 如果自定义校验方法，要传额外的值
            // {{validate: (_, value) => this.validate(_, value, "想要传的值")}}
          ]}
        >
          <Input />
        <Form.Item>
      </Form>
    )
}
```
### form初始化数据
坑： antd的form不怎么支持双向绑定，起码要以特定的数据格式才能进行双向绑定。详情使用react-redux进行异步获取数据，表单从redux中获取值，但因没有监听什么时候能回传值，所以表单没有及时更新
解决：不使用redux获取数据，因为每次进来的值，要求是实时更新的，所以不要将其放在dispatch中获取，而是使用生命周期，在挂载完成后，获取数据，并在回调中设置表单的初始值
使用的知识：react的生命周期，父组件得等到子组件先挂载完成，才会挂载父组件
```jsx
// father
constucotr(super) {
  this.state = {
    setData: "" // 设置子组件表单的回调
  }
}
// 子组件将设置表单值的回调方法赋予父组件
updateSetData = (setFieldsValue) => {
  this.setState({
    setData: setFieldsValue
  })
}

componentDidMount() {
  const id = this.props.match.params
  // 如果路径存在Id值（说明是详情页），就去获取数据
  if(id) {
    getData().then(res => {
      saveDataToRedux(res.data)
      // 如果存在回调方法，说明之前未有缓存数据，就更新子组件表单的值作为初始值
      this.state.setData && this.state.setData(res.data);
    })
  }
}
render() {
  return <Son updateSetData={this.updateSetData}/>
}


// son
componentDidMount() {
  // 如果发现redux中已经存在对应数据，就直接设置表单值
  if(redux.data) {
    this.formRef.current.setFieldsValue(redux.data)
    // 如果没有的话，就将设置表单值的回调方法传给父组件，让其在获取值时，对表单进行初始化
  }else {
    this.props.updateSetData(this.formRef.current.setFieldsValue)
  }
}
```

最终解决：
  直接在父组件中获取子组件的dom，直接操作子组件的方法，不需要子组件将方法传入父组件
```jsx
// father
componentDidMount() {
  fetchDate().then(res => {
    // 设置子组件form的初始值
    this.child.formRef.current.setFieldsValues(res.data)
  })
}
<father>
  <son
    // child可以自己任意命名
    onRef={ref => {this.child = ref}}
  ></son>
</father>

// son
formRef = React.createRef()
<Form
  ref={this.formRef}> 
</Form>
```
### DatePicker中的初始值设置
 DatePicker中的初始值设置必须是Moment对象
```js
import React, {Component} from 'react'
import {Form,DatePicker,Button,Input} from 'antd'
// 需要引入moment，将后台转的字符串转换成Moment对象
import moment from 'moment'
class TestForm extends Component {
  formRef = React.createRef();
  onFinish(values) {
    console.log("values:", values)
  }
  componentDidMount() {
    console.log("aa:", this.formRef.current)
    // 表格初始值设置
    this.formRef.current.setFieldsValue({DatePicker: moment("2020-09-13"), kk:"haha", cc: "bbb"})
  }
  render() {
    return <Form ref={this.formRef} onFinish={this.onFinish}>
      // name值不可少，否则最后打印出的values值无法识别这个dom，就没有对应的值
      <Form.Item label="DatePicker" name="DatePicker">
        <DatePicker />
      </Form.Item>
      <Form.Item label="input" name="kk" >
        <Input />
      </Form.Item>
      <Button htmlType="submit">SUBMIT</Button>
    </Form>
  }
}
export default TestForm
```

### rowSelections操作时为全选
要配合使用rowKey使用才可以实现单选
```jsx
<Table
  // 设置每一行的key值， 一般为主键
  rowKey={record => record.id}
  rowSelections={
    selectedRowKeys, // 控制选中项的keys列表
    type: "checkbox",
    onChange: (selectedRowKeys, selectedRows) => {
      console.log("已选中的selectedRowKeys:", selectedRowKeys)
      console.log("已选中的整行数据selectedRowKeys:", selectedRowKeys)

    }
  }
/>
```

## Input文本框自动填充内容时，有彩色背影色
此问题仅在chrome浏览器上存在，且不仅为
解决：设置文本内阴影，且让其足够大，仅适用于纯色背影色可用
```css
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
}
```

## upload坑
### 已上传的文件列表必须有uid，否则会报错
```js
// 将后台传入的[{name: "xxx", url: "xxx"}]变为[{name: "xxx", url:"xxx", uid: "xxx", status: "done"}]
setUid(array) {
  array && array.map(item => {
    item.uid = "xxx"
    // uid必须有，status可有可无，这里主要为了方便后面逻辑处理使用加上
    item.status = "done"
  })
}
```
### 使用defaultFileList设置初始值，不显示文件列表
defaultFileList仅适用于数据获取在前，组件渲染在后，即同步获取数据后渲染组件，因为defaultFileList不支持数据更改，仅接受第一次的值  
如果组件渲染在前，后使用异步获取，再赋值，defaultFileList的值不会显示在视图中，defaultFileList仅适用于已知初始值的固定列表  
```jsx
<Upload {defaultFileList=[{name: "xxx.jpg", url: "xxxx", uid: "xxx"}]}>
```
```js
// 改变状态
onChange(info) {
  const {file, fileList} = info;
  if (file.status !== 'uploading') {
      console.log(file, fileList);
  }
  let list = []
  // 使用file的状态判断没有问题
  if(file.status === "done") {
    // do something
    list = fileList.map(item => {
      if(item.status === "done" && item.response) {
        return {name: item.fetchName, url: item.fetchUrl}
      }else if(item.status === "done" && item.url) {
        return item
      }
    })
    this.props.changeFileList(list)
  }
  if(file.status === "error") {
    message.error("上传错误")
  }
}
```
如果要使用可变更文件列表，要使用fileList受控属性


### 使用fileList文件列表时，onChange只执行一次，且file的status一直处于uploading状态
在使用upload时，发现如果使用受控的fileList文件列表，使用file.status判断时会发现异常
```js
 handleChange = info => {
    let fileList = [...info.fileList];
    // 只接收最后两个文件
    fileList = fileList.slice(-2);

    // 这里如果使用info.file.status作为判断条件，就容易出错
    // 打印日志会发现
    console.log(info) // file只存在uploading状态
    if(info.file.status === "done") {
      // 从后台获取数据
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url;
        }
        return file;
      });
      this.setState({ fileList });
    }
  };

// 修改：
 handleChange = info => {
    let fileList = [...info.fileList];
    // 只接收最后两个文件
    fileList = fileList.slice(-2);

    // 这里如果使用info.file.status作为判断条件，就容易出错
    // 打印日志会发现
    console.log(info) // info.file只存在uploading状态
    // if(info.file.status === "done") {
    // 从后台获取数据
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    this.setState({ fileList });
    // }
  };
```


错误原因：
onChange 中要始终 setState fileList，保证所有状态同步到 Upload 内,即onChange每个状态都要设置fileList的值，否则就会不再执行onChange  
此外，还要注意使用，保证upload能感知变化
```js
this.setState({fileList: [...fileList]})
```
参考：https://github.com/ant-design/ant-design/issues/2423

### 当有默认文件列表时，上传校验的文件数量不对
使用以下代码时， 发现每次增加或删除文件时，会有抖动的现象，且文件数量的校验永远不成功；这是因为每次重新渲染时，都会执行 UNSAFE_componentWillReceiveProps 方法，先获取到props的数据，然后再执行 beforeUpload时，文件数据就永远是默认的原有文件数量，所以文件数量校验永远不成功；然后再执行 onChange 方法，更新文件列表，这过程就会有文件的展示变化，从而造成抖动
```js
constructor(props) {
  super(props);
  this.state= {
    fileList: [],
    fileNum: 0
  }
  // 默认的文件必须有uid，否则不会显示出来
  this.setUid = this.setUid.bind(this)
}
UNSAFE_componentWillReceiveProps(props) {
  // 每次获取默认的文件列表，并添加uid
  const list = props.fileList ? this.setUid(props.fileList) : []
  this.setState({
    fileList: list，
    fileNum: list.length
  })
}
beforeUpload = (file, fileList) => {
  // fileList是当前要上传的数量，fileNum是之前已上传的文件数量
  if(fileList.length + this.state.fileNum > 10) {
    message.error(`只能上传10个文件`);
    return Promise.reject(false)
  }else {
    return true;
  }
}
onChange = info => {
  let fileList = [...info.fileList];
  fileList = fileList.map(file => {
    if(file.reponse) {
      file.url = file.response.data.url;
      file.name = file.reponse.data.name;
    }
    return file;
  })
  this.setState({
    fileNum: fileList.length,
    fileList
  })
}
```

解决方案，加个标识符，标识是否是初次获取的默认文件数量，如果不是，则直接取onChange后的文件数量
```js
constructor(props) {
  super(props);
  this.state= {
    fileList: [],
    fileNum: 0,
    isChangeFileList: false
  }
}
UNSAFE_componentWillReceiveProps(props) {
  // 只有没有操作过附件，才从默认文件列表中获取数据
  if(!isChangeFileList) {
    const list = props.fileList ? this.setUid(props.fileList) : []
    this.setState({
      fileList: list，
      fileNum: list.length
  })
  }
}
onChange = info => {
  let fileList = [...info.fileList];
  fileList = fileList.map(file => {
    if(file.reponse) {
      file.url = file.response.data.url;
      file.name = file.reponse.data.name;
    }
    return file;
  })
  this.setState({
    // 只要改变过，就将标识符设为true，之后数据都以更改过后的文件列表为准
    isChangeFileList: true,
    fileNum: fileList.length,
    fileList
  })
}
```


## antd select placeholder不显示
因为初始值设了别的值，只有value为undefined时，才会显示placeholder，其它的（包括null, ""）不显示

## 设置table空字段为"-"
使用:empty和:after伪类来设置content
```css
.antd-table-cell:empty:after {
  content: "-"
}
```