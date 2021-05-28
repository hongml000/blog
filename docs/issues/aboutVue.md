<!-- # vue遇到的坑 -->

## computed 里function不能直接传参
computed里，属性方法是不能直接传参的，否则参数都会以vue对象显示，达不到想要的目的
```html
<!-- 实现的功能: 类是由参数动态加载 -->
<template>
  <div :class="change(a)"></div>
</template>
<script>
  data() {
    return {
      a: 'red',
    }
  },
  computed: {
    // 读参异常，直接写上参数的话，a,b所有参数都会显示为vueComponent对象
    add(a) {
      return a === 'red' ? 'red' : 'yellow'
    }
  }
</script>  
<style>
.red {
  color: red;
}
.yellow {
  color: yellow;
}
</style>

<!-- 解决方法有2种： -->
<!-- 第一种，将方法改写到methods中,可以实现，但这种方法起不到缓存的作用 -->
<script>
  data() {
    return {
      a: 10,
    }
  },
  methods: {
    // 读参异常，直接写上参数的话，所有参数(这里是a参数)都会显示为vueComponent对象
    add(a) {
      return a === 'red' ? 'red' : 'yellow'
    }
  }
</script>  

<!-- 第二种，computed里使用闭包，既可以实现传参，又可实现computed缓存作用 -->
<script>
  data() {
    return {
      a: 10,
    }
  },
  computed: {
    // 读参异常，直接写上参数的话，a,b所有参数都会显示为vueComponent对象
    add() {
      return function(a) {
        return a === 'red' ? 'red' : 'yellow'
      }
    }
  }
</script>  

```


## vue规范
props传参时，要写类型和默认值
```js
props: ['content']

// >>>
props: {
  content: {
    type: String,
    default: ''
  }
}

```

## 处理下载文件接口返回的错误信息
前端在发送请求下载文件时，会将responseType设为blob，如果是成功时，后台会返回一个二进制文件，直接下载，这没问题。
但是，如果后台此时发生错误了，返回的状态码是200，错误信息是一个json，那么这个请求就会有异常，
```js
export function request(params) {
  return new Promise((resolve, reject) => {
    
    baseRequest(params).then(async res => {
      const status = res.status;
      const data = response.data;
      if(res.status === 200) {
        // 如果返回信息是成功
        if(data.success) {
          resolve(data)
          // 如果不是
        }else{
          // 如果返回的data是blob对象
          if(data instanceof Blob) {
            // 如果是excel二进制文件,二进制文件没有其它的json信息，一般使用type来判断
            if(data.type === "application/msexcel" || data.type === "application/vnd.ms-excel") {
              resolve(data);
              return; // 不再执行以下分支
            }else {
              let endFlag = false;
              // 将blob对象转化成json对象
              function blobToJson() {
                return new Promise(fucntion(resolve, reject) {
                  var reader = new FileReader();
                  reader.readAsText(data, "utf-8");
                  // 读取成功时回调, 这里是异步的
                  reader.onload = function() {
                    resolve(JSON.parse(reader.result)) // 如果是ts文件，需要写 reader.result as string
                  }
                })
              }
              async function toJson() {
                const res = await blobToJson(); // 等待blob对象转化成json的结果
                $message.error(res.errMsg);
                reject(res);
                endFlag = true; // 将结束程序，不再跑以下分支
              }
              await toJson(); // 这里的await代表要等待toJson()的执行完，才会返回async res
              if(endFlag) {
                return; // 结束
              }
            }
            // 如果不是blob对象，则按正常错误信息的json处理即可
          }else {
            $message.error(data.errMsg);
            reject(response)
          }
        }
      }
    }).catch(err => {
      $message.error("网络错误");
      reject(error);
    })
  })
}

```