module.exports = {
    title: "Oamha's blog",
    description: '个人技术博客',
    themeConfig: {
        lastUpdated: 'Last Updated',
        logo: '/img/logo.jpg',
        navbar: true, //显示导航栏
        activeHeaderLinks: true, //页面滚动 侧边栏活跃状态改变
        displayAllHeaders: false, //显示所有界面标题链接
        nav: require('./navConfig'),
    }
}