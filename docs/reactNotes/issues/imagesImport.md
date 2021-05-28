<!-- 导入图片的坑 -->
## react 项目中引入图片的几种方式
1. 以js变量形式导入
```js
import Img from '@/assets/images/1.png'
<img src={Img} alt='' />
```

2. 在img src中以require方式导入
```js
<img src={require("./images/1.png")} alt="">
```

### 坑
1. 在css中以background方式导入
```js
<img className="img" />
```
```css
.img {
  /* 有没有引号都无所谓 */
  background: url('~@/assets/images/logo.png')
}
```

发现图片能解析到base64图片，但就是不显示

```html
<img />
  .background: url(data:image/png;xxxxxx)  
```

原因：图片太大，而没有设置图片展示大小，需要增加background-size：100% 100%
```css
.img {
  /* 有没有引号都无所谓 */
  background: url('~@/assets/images/logo.png');
  background-size：100% 100%
}
```

2. 直接在img src中写绝对路径也无法解析
```js
<img src="./images/1.png" alt="">
```
解析为：
```html
<img src="./images/1.png" alt="">
```