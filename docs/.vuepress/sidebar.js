// /docs/.vuepress/sidebar.js
// module.exports = {
//   '/issuesRemark/':[
//     '',
//     'ele组件注意的问题',
//     'vue遇到的坑', 
//   ],
//   // 注意，匹配规则越短的要放在最下面，不然被首先被找到s
//   '/': [''],
// }

module.exports = [
  // 每个对象代表一个目录
  {
    title: '问题记录',
    path: '/issuesRemark/',
    collapsable: false,
    // 这里代表这个目录下的文件，要写绝对路径
    children: [
      '/issuesRemark/ele组件注意的问题',
      '/issuesRemark/vue遇到的坑'
    ]
  }
]