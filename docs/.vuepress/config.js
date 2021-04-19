module.exports = {
    title: "Oamha's blog",
    description: '个人技术博客',
    base: '/blog/',
    themeConfig: {
        lastUpdated: '最近更新',
        // logo: '/img/logo.jpg',
        navbar: true, //显示导航栏
        activeHeaderLinks: true, //页面滚动 侧边栏活跃状态改变
        displayAllHeaders: false, //显示所有界面标题链接
        nav: require('./navConfig'),
    },
    markdown: {
        extractHeaders: ['h2', 'h3', 'h4'],
        lineNumbers: true
    }
}