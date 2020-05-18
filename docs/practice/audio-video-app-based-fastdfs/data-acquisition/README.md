## 1 数据抓取
::: tip
数据抓取这一块用的是Node.js(其实任何一种具有文件读写，网络请求能力的后端语言都能实现爬虫)。抓取对象主要是视频、音乐、歌词、歌手、专辑以及歌单等信息。在实现过程中，通过给手机设置代理，分析了梨视频APP的请求连接，拿到了视频接口；又分析了咪咕音乐的歌曲请求链接，拿到了歌曲文件下载接口(这一块要注意咪咕音乐下载歌曲要先登录，登录之后复制请求头中cookie信息，再去请求接口便可拿到数据，否则会响应权限不足。
:::
## 2 爬虫的形式
|类型|形式|
|:-:|:---|
|1|返回一个网页，解析其DOM元素(往往用于获取一个数据标识，如歌曲id)|
|2|返回JSON格式，解析其内容(适用于数据内容较多的情形)|
|3|直接返回数据流，如下载歌曲文件(将歌曲文件写入硬盘)|
## 2 技术选型
|功能        |所选技术        |
|:---------:|:--------------:|
|编程语言    |Node.js         |
|网页解析    |cheerio         |
|异步网络请求|request-promise |
|CSV文件读写 |csv-writer      |
## 3 歌曲的接口
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200518134646.jpg'"/>
这是个Post请求，有三个参数，只要动态替换第一个copyrightId参数即可。第一个参数在咪咕下载页面选择音乐品质的复选框上就能看到，只需解析一下网页即可。

## 4 这里给出一个递归下载音乐文件的例子：
``` js
const rp = require('request-promise')
const sleep = require('thread-sleep')
const csv = require('csv-writer')
const fs = require('fs')
const request = require('request')

//待下载的copyrightId集合(前期已经解析网页获取)
let songIds = [
    '6005973LNMK', '63273401497', '63273401575', '63273401958', '6005973LNMG', '6005973LNMA', '6005973LNM8', '6005973LNM7', '6005973LNMB', '6005973LNMH'
]

//请求头 （Cookie要用账号登录之后复制过来)
const requestHeaders = {
    "Referer": "http://music.migu.cn/v3/music/order/download/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
    "Cookie": "migu_cookie_id=05024df4-59af-444e-92ee-8549235a9d6c-n41583126852749; migu_cn_cookie_id=9a1461db-79db-4041-950b-fbe42e5e503c; Hm_lvt_ec5a5474d9d871cb3d82b846d861979d=1583300310; migu_music_status=true; migu_music_uid=15675304802130423737947; migu_music_avatar=%252F%252Fcdnmusic.migu.cn%252Fv3%252Fstatic%252Fimg%252Fcommon%252Fheader%252Fdefault-avatar.png; migu_music_nickname=%E8%80%90%E5%BF%83%E7%9A%84%E9%93%83%E7%8E%AF; migu_music_level=0; migu_music_credit_level=1; migu_music_platinum=1; migu_music_msisdn=15738155286; migu_music_email=; migu_music_passid=323926277699188786; migu_music_sid=s%3A2PyxkLc3HrbRHjJkoQg6xWZdIJjbm8RO.Djnn2K4zRPwDh7RmBZWlsLQT1WACmaj4Hga%2FoZ8Q2QA; WT_FPC=id=2d898c08c3e997aa69e1583126855806:lv=1583415511286:ss=1583415511286; WT_FPC=id=2d898c08c3e997aa69e1583126855806:lv=1583415511793:ss=1583415496168"
}

//请求参数
const getFormData = (copyrightId) => {
    return {
        copyrightId: copyrightId,
        payType: '01',
        type: 1
    }
}

//构建请求
const getRequestOptions = (copyrightId) => {
    return {
        method: 'POST',
        json: true,
        uri: `http://music.migu.cn/v3/api/order/download`,
        headers: requestHeaders,
        form: getFormData(copyrightId)
    }
}

async function recursiveDownload(index) {
    sleep(1200)
    //越界返回
    if (index < 0 || index >= songIds.length) return;
    const result = await rp(getRequestOptions(songIds[index]))
    if (!result || !result.downUrl) {
        //如果请求没有相应下载链接，继续下一个
        recursiveDownload(index + 1)
        return;
    }
    console.log(`开始下载 ${result.downUrl} ...`)
    const writer = fs.createWriteStream(`E://csv/song-resource/${songIds[index]}.mp3`)
    writer.on('finish', () => {
        //写入完成继续下载下一个
        recursiveDownload(index + 1)
    })
    //将文件流写入文件
    request(result.downUrl).pipe(writer)
}

```
::: warning
这里仅供学习使用，请勿商用，爬取过程中请限制速度，勿影响人家正常服务。
:::

## 5 确立的数据库模型 
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'schema.png'"/>
## 6 爬取的数据
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="['QQ截图20200518152618.jpg', 'QQ截图20200518152723.jpg']"/>
有学习、测试需求的同学可以联系QQ:<font color="blue">1123988589</font>，无偿提供。

## 7 总结
爬取数据其实很简单，关键是整理数据，考虑数据的关联，以及如何将无结构的数据整理成结构化数据，从而最终录入数据库。经历了很多次尝试，我也总结了一点经验：
+ 从独立性较强的数据开始爬取，如歌单和歌曲有关系，歌曲和专辑有关系，专辑和歌手又有关系，所以这里最好从歌手开始爬取，因为歌手独立性较高，关联较少。
+ 抓住关联界面。要从网站中找一些关联性较强的界面，比如：一个界面中有一个列表，包含了歌手、专辑、歌曲信息，那么根据这个列表就可以建立这三者的关系。
+ 爬取数据之前一定要先建立好数据模型，最好能构建出数据库的关联模式，分析出数据的关联关系。



