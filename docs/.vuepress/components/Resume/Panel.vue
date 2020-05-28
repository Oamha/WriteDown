<template>
  <div class="panel">
    <div class="content">
      <div class="header d-flex ai-center jc-between">
        <h2>个人简历</h2>
        <span class="target">求职意向：安卓开发工程师</span>
      </div>
      <div class="avatar">
        <img :src="$withBase('/img/avatar.jpg')" alt="头像" width height="140px" />
      </div>
      <Divider :banner-name="'个人信息'" />
      <div class="base-info d-flex ai-center wrap">
        <InfoItem :type="'姓名'" :info="'薛东'"></InfoItem>
        <InfoItem :type="'学历'" :info="'本科'"></InfoItem>
        <InfoItem :type="'联系方式'" :info="'15738155286'"></InfoItem>
        <InfoItem :type="'政治面貌'" :info="'团员'"></InfoItem>
        <InfoItem :type="'邮箱'" :info="'1123988589@qq.com'"></InfoItem>
        <InfoItem :type="'毕业年限'" :info="'2020年'"></InfoItem>
        <InfoItem :type="'家庭住址'" :info="'河南省信阳市固始县'"></InfoItem>
      </div>
      <Divider :banner-name="'个人技能'" />
      <div class="skill">
        <ul>
          <li>熟悉Android SDK常用API，熟悉Android Jepack工具包(常用);</li>
          <li>熟悉Android MVVM开发模式以及其组件LiveData, ViewModel, DataBinding, Navigation, Room等的使用(常用);</li>
          <li>使用过OkHttp, Glide, Gson, EventBus等Android框架;</li>
          <li>熟悉MySQL数据库的使用(常用);</li>
          <li>熟悉NodeJS，Express，Sequelize(ORM框架)搭建后台服务(常用);</li>
          <li>能够使用VueJS、VueRouter、VueX进行简单的前端开发(最近使用,您所看页面也是基于Vue搭建);</li>
          <li>能够使用SSM，SpringBoot框架搭建web服务,了解过docker虚拟化容器(大学期间使用过);</li>
        </ul>
      </div>
      <Divider :banner-name="'获奖记录'" />
      <div class="prize">
        <ul>
          <li>河南省大学生计算机程序设计大赛省级奖</li>
          <li>河南省大学生互联网+创新创业大赛省级奖</li>
          <li>英语六级</li>
        </ul>
      </div>
      <Divider :banner-name="'校园表现'" />
      <div class="college">
        <ul>
          <li>四年专业成绩保持专业前五(专业素养方面)</li>
          <li>获取过优秀团员、积极分子等称号(思想道德方面)</li>
        </ul>
      </div>
      <Divider :banner-name="'项目经历'" />
      <div class="experience">
        <dl>
          <dt>1、鱼骨音乐(个人前后端项目)</dt>
          <dd>
            这是一个前后端项目，移动端基于Android的Jetpack工具包进行构建，采用MVVM的开发模式，实现了音视频播放，朋友圈、分享，收藏，点赞，多任务下载，短信登录等功能。管理后台采用Vue全家桶实现，主要功能有基于路由的权限管理，基于WebSSH的服务器远程终端登录，基于jwt的用户认证授权登录，以及各种资源管理等功能;
            <div class="difficulty-title">主要难点:</div>
            <ul class="difficulty">
              <li>自定义歌词展示View，实现歌词解析，歌词滚动，用户拖动等功能;</li>
              <li>音乐播放过程中启动前台服务，显示自定义的通知栏;</li>
              <li>使用WebView进行混合开发，在原生APP中嵌入H5播放器，实现视频播放;</li>
              <li>使用FastDFS搭建了小型的集群，提供云存储服务，满足本系统的音视频下载需求;</li>
              <li>使用抓包工具分析了梨视频、咪咕音乐的接口，利用爬虫爬取音乐、视频等网络数据;</li>
              <li><a href="http://blog.oamha.cn/practice/audio-video-app-based-fastdfs/">点我去看看</a></li>
            </ul>
          </dd>
        </dl>
        <dl>
          <dt>2、贴吧系统(纯Web端项目)</dt>
          <dd>这是个仿技术博客的PC端系统，主要功能有发表技术帖子，评论、用户积分等功能，采用SSM框架加Redis非关系型数据库实现，其中主要利用Redis作首页加速。</dd>
        </dl>
        <dl>
          <dt>3、基于教师公寓的物业管理系统(协作开发项目)</dt>
          <dd>这是一个参赛项目，我主要负责PC端的开发，以及与移动端的对接。该系统主要功能有小区车位的实时查询，小区物业缴费信息查询，报修信息管理与审核等。</dd>
        </dl>
        <span class="tip">下面这两个项目时间比较久了，环境也缺失了，暂时无法展示，实在抱歉</span>
      </div>
    </div>
  </div>
</template>
<script>
import Divider from "./Divider";
import InfoItem from "./InfoItem";
export default {
  components: {
    Divider,
    InfoItem
  }
};
</script>
<style scoped lang="scss">
.panel {
  .content {
    background-color: rgb(231, 231, 231);
    .header {
      width: 50%;
      margin: 0 auto;
      & .target {
        color: #666;
      }
    }
  }
  h2 {
    border-bottom: none;
    color: rgb(86, 86, 86);
  }
  span {
    color: rgb(169, 169, 169);
  }
  .avatar {
    position: relative;
    background-color: rgb(129, 129, 129);
    margin-bottom: 40px;
    width: 100%;
    height: 30px;
    img {
      position: absolute;
      left: 42px;
      top: -90px;
      border: 2px solid #efefef;
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    }
  }
  .base-info,
  .prize,
  .skill,
  .college,
  .experience {
    width: 70%;
    margin: 0 auto;
    .difficulty-title{
      margin-top: 4px;
    }
    .difficulty {
      margin-top: 4px;
    }
  }
  .experience {
    padding-bottom: 30px;
    .tip{
      color: #ff8811;
      font-size: 12px;
      margin-left: 30px;
    }
  }
  min-width: 700px;
  width: 100%;
  border-radius: 4px;
  background-color: #ffffff;
  margin: 0 auto;
  padding: 10px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
}
.wrap {
  flex-wrap: wrap;
}
.jc-between {
  justify-content: space-between;
}
.jc-around {
  justify-content: space-around;
}
.flex-1 {
  flex: 1;
}
.d-flex {
  display: flex;
}
.ai-center {
  align-items: center;
}
.text-center {
  text-align: center;
}
</style>