// 导航栏配置
module.exports = [
    { text: '主页', link: '/' },
    { text: '日常问题', link: '/problem/' },
    { text: '技术学习', link: '/technology/' },
    { text: '理论基础', link: '/theory/' },
    { text: '项目实战', link: '/practice/' },
    { text: '日常总结', link: '/conclusion/' },
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
    },
    {
        text: '语言',
        ariaLabel: '语言',
        items: [
            { text: '中文', link: '/language/chinese/' },
            { text: '英文', link: '/language/english/' }
        ]
    }
]