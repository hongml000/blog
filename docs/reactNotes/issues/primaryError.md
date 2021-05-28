<!-- 初学错误 -->
## 'React' must be in scope when using JSX react/react-in-jsx-scope
```js
import react, {Component} from 'react';
// react 应该大写，这里小写导致错误；
// >>>
import React, {Component} from 'react';
```


##  Parsing error: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>
```js
class Todolist extends Component {
  render() {
    return (
      <div>
        <input type="text"/>
        <button>提交</button>
      </div>
      <ul>
        <li>学英语</li>
        <li>学医学</li>
      </ul>
    )
  }
}

// 如同vue一样，只允许html中最外层只能有一个容器，可以写个div包含
// 如果不想让其在html中显示，可以使用fregment替代，注意是使用大写开头
import React, { Component, Fragment } from 'react'

class Todolist extends Component {
  render() {
    return (
      <Fragment>
        <div>
          <input type="text"/>
          <button>提交</button>
        </div>
        <ul>
          <li>学英语</li>
          <li>学医学</li>
        </ul>
      </Fragment>
    )
  }
}

```