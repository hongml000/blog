<!-- redux调试工具 -->
## 安装
下载：从chrome官网下载插件
坑：如果不从官网下载，很有可能会碰到下载的插件与chrome不兼容问题，导致报错: typeError:can't read the property of 'state'

## 使用
官网：https://github.com/zalmoxisus/redux-devtools-extension#usage
F12，找到redux，点开，如果提示:

No store found. Make sure to follow the instructions.
点击instructions:

```
const store = createStore(
   reducer, /* preloadedState, */
   // 增加以下这个参数
+  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );
```

打开后，可以点击State，查看state的值变化