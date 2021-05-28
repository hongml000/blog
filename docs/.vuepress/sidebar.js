const reactSidebar = require('./sidebars/reactSidebar.js')
const vueSidebar = require('./sidebars/vueSidebar.js')
const webpackSidebar = require('./sidebars/webpackSidebar.js')

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
  '/vueNotes/': vueSidebar,
  '/reactNotes/': reactSidebar,
  '/webpackSidebar/': webpackSidebar
}