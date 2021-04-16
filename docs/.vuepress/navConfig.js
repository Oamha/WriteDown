// 导航栏配置
module.exports = [
    { text: '主页', link: '/' },
    { text: '文章总结', link: '/overview/' },
/*     { text: '理论基础', link: '/theory/' },
    { text: '技术专题', link: '/technology/' },
    { text: '问题列表', link: '/problem/' },
    { text: '实践', link: '/practice/' }, */
    {
        text: "常用文档",
        items: [
            { text: '安卓官网', link: 'https://developer.android.google.cn/jetpack', target: '_blank' },
            { text: 'flutter', link: 'https://flutter.dev/docs/get-started/editor?tab=vscode', target: '_blank' },
            { text: 'VueJS', link: 'https://cn.vuejs.org/', target: '_blank' }
        ]
    },
    {
        text: '常用工具',
        items: [
            { text: 'JSON解析', link: 'https://www.json.cn/', target: '_blank' },
            { text: '图片颜色识别', link: 'https://www.sojson.com/web/img.html', target: '_blank' }
        ]
    },
    {
        text: '常用资源',
        items: [
            { text: '图片素材', link: 'https://pixabay.com/', target: '_blank' },
            { text: '字体图标', link: 'https://www.iconfont.cn/', target: '_blank' },
        ]
    }
]