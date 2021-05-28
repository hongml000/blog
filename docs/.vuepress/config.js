const nav = require("./nav");
const sidebar = require("./sidebar");
const moment = require('moment');
moment.locale('zh-cn') // 默认是中文

module.exports = {
  base: '/blog/',
  title: "老喵的学习笔记", // 标题  
  description: "爱生活，爱记录", // 描述
  dest: "./docs/.vuepress/dist", // 打包输出位置
  port: "7777", // 启动服务的端口号
  head: [
    // 改下标题图标，默认资源路径是 docs/.vuepress/public/
    ["link", { rel: "icon", href: "/cat1.jpeg" }],
    // SEO
    ["meta", {name: 'author', content: '老喵'}],
    ["meta", {name: 'keyword', content: 'vuepress 老喵的学习笔记'}]

  ],
  markdown: {
    lineNumbers: true, // markdown中是否显示行号
  },
  plugins: [
    // 配置@vuepress/last-updated插件，自定义日期格式
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          return moment(timestamp).format('YYYY/MM/DD HH:MM:SS')
        }
      }
    ]
  ],
  theme: 'reco',
  // 主题配置
  themeConfig: {
    // type: 'blog',
    // blogConfig: {
    //   category: {
    //     location: 2, // 在导航栏菜单中所占的位置，默认2
    //     text: '分类' // 默认 “分类”
    //   },
    //   tag: {
    //     location: 3, // 在导航栏菜单中所占的位置，默认3
    //     text: '标签' // 默认 “标签”
    //   },
    //   // socialLinks: [
    //   //   { icon: 'reco-github', link: 'https://github.com/To2rk' },
    //   // ]
    // },

    // nav是导航栏内容
    nav: nav,
    // 侧边栏
    sidebar: sidebar,
    // sidebar: 'auto',
    // displayAllHeaders: true,
    sidebarDepth: 1,  // 侧边栏的层级数
    // 基于git的最后更新时间，将获取每个文件最后一次 git 提交的 UNIX 时间戳(ms)，同时它将以合适的日期格式显示在每一页的底部
    // 显示效果为： 最后更新: 5/25/2021, 4:50:23 PM
    lastUpdated: "最后更新",
    logo: '/cat1.jpeg',
    // authorAvatar: '/cat1.jpeg',
    author: '老喵',
    searchMaxSuggestoins: 10,
    serviceWorker: {
      updatePopup: {
        message: "有新的内容.",
        buttonText: "更新",
      },
    },
    editLinks: true,
    editLinkText: "在 GitHub 上编辑此页 ！",
    friendLink: [
      {
        title: '午后南杂',
        desc: 'Enjoy when you can, and endure when you must.',
        email: '1156743527@qq.com',
        link: 'https://www.recoluan.com'
      },
      {
        title: 'Torrk\'s Blog',
        desc: '记录，成为更好的自己。',
        logo: 'https://conimi.com/files/images/i.jpg',
        link: 'https://conimi.com'
      },
    ],
  },
};
