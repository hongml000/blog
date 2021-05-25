module.exports = [
  // 导航栏，有items代表着子导航
  { 
    text: '问题记录', link: '/issuesRemark/' // 路由会默认访问/issuesRemark/，对应的页面是：/issuesRemark/README.md
  },
  {
    text: '个人博客', // 这种没有写link的，代表是不能点击跳转的
    items: [
      { text: '简书', link: 'https://www.jianshu.com/u/2a4ce1aee4b4'} // 这是跳转外链
    ]
  },
  { 
    text: '关于我', link: '/about/' // 像介绍页，可以直接写在docs目录下，代表直接访问，对应的页面是：/docs/about.md
  }
]
