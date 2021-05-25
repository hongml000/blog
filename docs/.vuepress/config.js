module.exports = {
  title: "老喵的学习笔记", // 标题
  description: "爱生活，爱记录", // 描述
  dest: "./dist", // 打包输出位置
  port: "7777", // 启动服务的端口号
  head: [
    // 改下图标
    ["link", { rel: "icon", href: "/home.jpeg" }],
    // SEO
    ["meta", {name: 'author', content: '老喵'}],
    ["meta", {name: 'keyword', content: 'vuepress 老喵的学习笔记'}]

  ],
  markdown: {
    lineNumbers: true, // markdown中是否显示行号
  },
  themeConfig: {
    // nav是导航栏内容
    nav: require("./nav"),
    // 侧边栏
    sidebar: require("./sidebar"),

    sidebarDepth: 2,  // 侧边栏的层级数
    // 最后更新时间，设置成“Last Updated”将获取每个文件最后一次 git 提交的 UNIX 时间戳(ms)，同时它将以合适的日期格式显示在每一页的底部
    lastUpdated: "Last Updated",
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
