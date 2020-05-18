---
sidebar: 'auto'
---
## 基于FastDFS的视听APP设计与实现
::: tip
这是自己的毕业设计，也算是大学以来一个最完整的项目吧。平时的课设由于时间关系，往往都做了一个模块，很是后悔后来没有继续完善下去(算了，不再回首不堪的往事了)。在本项目中用到了爬虫，云存储(FastDFS集群)，Android开发(主要用了JetPack工具包)，PC端开发(Vue全家桶)等技术, 整体来看综合度还算高(允许我小小傲娇一下:satisfied:)。
:::
## 1 最终效果
### 1.2 PC端管理平台
#### 1.2.1 登录界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517230600.jpg'"/>
#### 1.2.2 主界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517231659.jpg'"/>
#### 1.2.3 服务器管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232243.jpg'"/>
#### 1.2.4 歌手管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232422.jpg'"/>
#### 1.2.5 分类管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232450.jpg'"/>
#### 1.2.6 歌曲管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232509.jpg'"/>
#### 1.2.7 专辑管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232526.jpg'"/>
#### 1.2.8 视频管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232547.jpg'"/>
#### 1.2.9 歌单管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232602.jpg'"/>
#### 1.2.10 角色管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232635.jpg'"/>
#### 1.2.11 权限管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232658.jpg'"/>
#### 1.2.12 管理员管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232716.jpg'"/>
#### 1.2.13 普通用户管理界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517232733.jpg'"/>
#### 1.2.14 个人信息界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'QQ截图20200517234636.jpg'"/>
### 1.3 移动客户端
#### 1.3.1 首页
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085540_com.hncj.music.core.jpg'"/>
#### 1.3.2 专辑页
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="['Screenshot_20200518_085547_com.hncj.music.core.jpg','Screenshot_20200518_124652_com.hncj.music.core.jpg']"/>
#### 1.3.3 榜单页
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085553_com.hncj.music.core.jpg'"/>
#### 1.3.4 歌手页
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085559_com.hncj.music.core.jpg'"/>
#### 1.3.5 分类页
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085605_com.hncj.music.core.jpg'"/>
#### 1.3.6 视频列表
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085625_com.hncj.music.core.jpg'"/>
#### 1.3.7 朋友圈界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="['Screenshot_20200518_085635_com.hncj.music.core.jpg', 'Screenshot_20200518_085758_com.hncj.music.core.jpg']"/>
#### 1.3.8 我的模块界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="['Screenshot_20200518_085815_com.hncj.music.core.jpg', 'Screenshot_20200518_124752_com.hncj.music.core.jpg']"/>
#### 1.3.9 关注界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085827_com.hncj.music.core.jpg'"/>
#### 1.3.10 收藏界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085837_com.hncj.music.core.jpg'"/>
#### 1.3.11 本地音乐界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085848_com.hncj.music.core.jpg'"/>
#### 1.3.12 浏览历史界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085856_com.hncj.music.core.jpg'"/>
#### 1.3.13 音乐播放界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_085930_com.hncj.music.core.jpg'"/>
#### 1.3.14 歌曲列表界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_090151_com.hncj.music.core.jpg'"/>
#### 1.3.15 音乐操作界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_090200_com.hncj.music.core.jpg'"/>
#### 1.3.16 下载列表
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_090228_com.hncj.music.core.jpg'"/>
#### 1.3.17 搜索界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="'Screenshot_20200518_090316_com.hncj.music.core.jpg'"/>
#### 1.3.18 登录界面
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="300" :urls="['Screenshot_20200518_090015_com.hncj.music.core.jpg', 'Screenshot_20200518_090042_com.hncj.music.core.jpg']"/>
## 2 主要所作的工作
### [2.1 数据抓取](./data-acquisition)
### [2.2 分布式文件系统的搭建](./build-fastdfs)
### [2.3 安卓APP的开发](./app-development)
### [2.4 管理平台的搭建](./management-platform)

