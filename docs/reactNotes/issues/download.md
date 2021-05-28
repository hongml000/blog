<!-- 下载文件的坑 -->
自从有了html5之后，一想到文件下载，我们都会想到`html`的`download`属性，但在使用时，难免还有一些坑要踩:
## html5下载
```js
// 使用html5 download属性下载
download(url, fileName) {
  const a = document.createElement('a');
  a.style.display="none"
  a.href = url;
  a.download = fileName || 'downloadFile.png'
  document.body.appendChild(a)
  a.click();
  if(!(!!window["ActiveXObject"] || "ActiveXObject" in window)) {
    a.remove()
  }else {
    document.body.removeChild(a)
  }
}

// 会发现：
download('./test.png')  // 可以下载图片
download('https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3252521864,872614242&fm=26&gp=0.jpg')   // 只能在浏览器中预览图片
```
### 坑1
html5的download属性只支持同源URL，当使用跨域URL时，download属性会失效，点击链接会变成预览
解决思路：将跨域URL,转换成同源URL,再进行下载
```js
// 直接get跨域url，获取对应的二进制文件
downloadFile(url) {
  return Request({
    url,
    method: "get"
  })
}

// 下载
download(url, fileName) {
  // 直接get跨域url，获取对应的二进制文件
  downloadFile(url).then(res => {
    console.log(res)  // 对应的二进制文件
    // 使用blob将二进制文件转换成同源url
    const blob = new Blob([res])
    const localUrl = window.URL.createObjectURL(blob)

    // 创建a对象，点击下载
    const a = document.createElement('a');
    a.style.display="none"
    a.href = url;
    a.download = fileName || 'downloadFile.png'
    document.body.appendChild(a)
    a.click();
    if(!(!!window["ActiveXObject"] || "ActiveXObject" in window)) {
      a.remove()
    }else {
      document.body.removeChild(a)
    }
  })
}

// 现在点击后，可以下载下来了，一打开图片也没毛病，美滋滋
// 然后进一步换成xlsx或者pdf文件，下载没毛病，但打开下载的文件，发现空白或者文件损坏？！！为什么？？
```
### 坑2：
将二进制文件转换成blob对象时，要指定类型
解决：需要将文件转换成blob对象的二进制文件
```js
// 直接get跨域url，获取对应的blob类型的二进制文件
downloadFile(url) {
  return Request({
    url,
    method: "get"，
    responseType: "blob"
  })
}
```