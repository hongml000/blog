const moment = require('moment');
moment.locale('zh-cn') // 默认是中文

module.exports = {
  title: "老喵的学习笔记", // 标题
  description: "爱生活，爱记录", // 描述
  dest: "./dist", // 打包输出位置
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
  themeConfig: {
    // nav是导航栏内容
    nav: require("./nav"),
    // 侧边栏
    sidebar: require("./sidebar"),
    sidebarDepth: 2,  // 侧边栏的层级数
    // 基于git的最后更新时间，将获取每个文件最后一次 git 提交的 UNIX 时间戳(ms)，同时它将以合适的日期格式显示在每一页的底部
    // 显示效果为： 最后更新: 5/25/2021, 4:50:23 PM
    lastUpdated: "最后更新",
    searchMaxSuggestoins: 10,
    serviceWorker: {
      updatePopup: {
        message: "有新的内容.",
        buttonText: "更新",
      },
    },
    editLinks: true,
    editLinkText: "在 GitHub 上编辑此页 ！",
  },
};
