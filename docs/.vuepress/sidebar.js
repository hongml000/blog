// /docs/.vuepress/sidebar.js
// module.exports = {
//   '/issues/':[
//     '',
//     'aboutElementui',
//     'aboutVue', 
//   ],
//   // 注意，匹配规则越短的要放在最下面，不然被首先被找到s
//   '/': [''],
// }

// module.exports = [
//   // 每个对象代表一个目录
//   {
//     title: '问题记录',
//     path: '/issues/',
//     collapsable: false,
//     // 这里代表这个目录下的文件，要写绝对路径，注意不要写中文，不然会报错
//     children: [
//       '/issues/aboutElementui',
//       '/issues/aboutVue'
//     ]
//   },
//   {
//     title: 'vue',
//     path: '/vueNotes/',
//     collapsable: false,
//     children: [
//       '/vueNotes/base/vueMixins',
//       '/vueNotes/base/single-component'
//     ]
//   }
// ]



module.exports = {
  '/issues/': [
      {
          title: '问题记录',
          collapsable: false,
          children: [
              { title: 'ele 组件注意的问题', path: '/issues/aboutElementui' },
              { title: 'vue遇到的坑', path: '/issues/aboutVue' },
              // { title: '生活测试03', path: '/life/life03' },
          ]
      }
  ],
  '/vueNotes/': [
      {
        title: 'vue基础',
        children: [
            { title: '单文件组件', path: '/vueNotes/base/singleComponent' },
            { title: '状态存储', path: '/vueNotes/base/store' },
            { title: '项目搭建', path: '/vueNotes/base/vueProject' },
            { title: '脚手架目录结构', path: '/vueNotes/base/vueStructure' },
            { title: 'mixins的使用', path: '/vueNotes/base/vueMixins' },
            { title: 'vue-class-components使用', path: '/vueNotes/base/vue-property-decorator' }
        ]
      },
      
      {
        title: 'vue实战',
        collapsable: true,
        children: [

        ]
      }
  ],
  '/reactNotes/': [
      {
        title: 'react基础',
        children: [
            { title: '1. 创建项目', path: '/reactNotes/base/1.createProject' },
            { title: '2. jsx语法', path: '/reactNotes/base/2.jsx' },
            { title: '3. 一个简单的todoList', path: '/reactNotes/base/3.todoList' },
            { title: '4. 组件化（父子间传值）', path: '/reactNotes/base/4.components' },
            { title: '5. 优化todolist', path: '/reactNotes/base/5.update-todolist' },
            { title: '6. react小结', path: '/reactNotes/base/6.summary' }
        ]
      },
      {
        title: 'react进阶',
        children: [
            { title: '1. 调试工具react-devtools', path: '/reactNotes/higherUser/1.react-devtools' },
            { title: '2. jsx语法', path: '/reactNotes/higherUser/2.propTypes' },
            { title: '3. state,prop,render之间的关系', path: '/reactNotes/higherUser/3.state-prop-render' },
            { title: '4. 虚拟dom', path: '/reactNotes/higherUser/4.Vnode' },
            { title: '5. ref操作dom', path: '/reactNotes/higherUser/5.ref' },
            { title: '6. react生命周期函数', path: '/reactNotes/higherUser/6.lifeStyles' },
            { title: '7. ajax请求', path: '/reactNotes/higherUser/7.ajax' },
            { title: '8. react实现css动画', path: '/reactNotes/higherUser/8.animation' },
            { title: '9. 使用antd组件', path: '/reactNotes/higherUser/9.antd' },
        ]
      },
      {
        title: 'redux',
        children: [
            { title: '1. redux', path: '/reactNotes/redux/1.redux' },
            { title: '2. UI组件，容器组件，无状态组件', path: '/reactNotes/redux/2.components' },
            { title: '3. redux中间件redux thunk', path: '/reactNotes/redux/3.redux-thunk' },
            { title: '4. 使用react-redux', path: '/reactNotes/redux/4.react-redux' },
            { title: 'redux调试工具', path: '/reactNotes/redux/redux-devtools' }
        ]
      },
      {
        title: '那些年踩过的坑',
        collapsable: true,
        children: [
          { title: 'antd坑', path: '/reactNotes/issues/antd' },
          { title: '初学错误', path: '/reactNotes/issues/primaryError' },
          { title: '图片导入问题', path: '/reactNotes/issues/imagesImport' },
          { title: '数据相关', path: '/reactNotes/issues/data' },
          { title: '文件下载', path: '/reactNotes/issues/download' }
        ]
      }
  ],
}