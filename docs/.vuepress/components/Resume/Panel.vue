<template>
  <div class="panel">
    <div class="content">
      <div class="header d-flex ai-center jc-between">
        <h2>个人简历</h2>
        <span class="target">求职意向：安卓开发工程师</span>
      </div>
      <div class="avatar">
        <img
          :src="$withBase('/img/avatar.jpg')"
          alt="头像"
          width
          height="140px"
        />
      </div>
      <Divider :banner-name="'个人信息'" />
      <div class="base-info d-flex ai-center wrap">
        <InfoItem :type="'姓名'" :info="'薛东'"></InfoItem>
        <InfoItem :type="'联系方式'" :info="'15738155286'"></InfoItem>
        <InfoItem :type="'学历'" :info="'本科'"></InfoItem>
        <InfoItem :type="'邮箱'" :info="'1123988589@qq.com'"></InfoItem>
        <InfoItem :type="'工作年限'" :info="'一年'"></InfoItem>
        <InfoItem :type="'现居住地'" :info="'广东省深圳市宝安区'"></InfoItem>
        <InfoItem :type="'出生年月'" :info="'1997年6月'"></InfoItem>
        <InfoItem
          :type="'个人博客'"
          :info="'http://me.oamha.cn/blog'"
        ></InfoItem>
      </div>
      <Divider :banner-name="'专业技能'" />
      <div class="skill">
        <ul>
          <li>
            对Java虚拟机有一定研究，熟悉Java中的垃圾回收机制和类加载原理；
          </li>
          <li>
            对Java并发机制有一定研究，熟悉Java中锁的实现原理和线程池工作原理；
          </li>
          <li>熟悉常用的数据结构和算法；</li>
          <li>熟悉Android系统的事件分发机制；</li>
          <li>熟悉Android系统中消息传递机制；</li>
          <li>熟悉Android系统中View的绘制流程；</li>
          <li>对Retrofit、OkHttp网络请求框架的源码有一定研究；</li>
          <li>
            熟悉Android Jetpack工具包中LiveData, ViewModel, DataBinding,
            Navigation, Room等组件的使用；
          </li>
          <li>了解开源框架Glide、RXJava、ButterKnife的实现原理；</li>
          <li>了解NDK开发的基本流程，有一定的C++基础；</li>
        </ul>
      </div>
      <Divider :banner-name="'工作经验'" />
      <div class="work-experience">
        <dl>
          <dt>2020/06 ~ 2021/04</dt>
          <dd>于深圳市子舟科技控股有限公司担任Android开发工程师</dd>
          <dd>负责开发"车趣美"智能车载语音助手客户端</dd>
        </dl>
<!--         <dl>
          <dt>2019/01 ~ 2019/11</dt>
          <dd>于深圳市腾讯科技有限公司担任Android开发工程师</dd>
          <dd>负责开发手机QQ客户端</dd>
        </dl> -->
      </div>
      <Divider :banner-name="'项目经历'" />
      <div class="experience">
        <dl>
          <dt>1、车趣美智能车载语音助手</dt>
          <dd>
            "车趣美"智能车载语音助手是一款类似于智能音箱的车载应用。它运行在定制化的Android6.0平台上，依托于第三方的语音和音频资源服务，实现了声控点歌、手动切歌、后台音乐智能推荐等功能;
            <br/>
            <br/>
            <br/>
            <br/>
            <div class="difficulty-title">主要工作:</div>
            <ul class="difficulty">
              <li>对接第三方语音识别服务，实现语音交互；</li>
              <li>解决产品电量消耗过大运行过热的问题；</li>
              <li>
                实现车载播放器播放状态机的控制，优化播放出错后的异常处理及重试机制；
              </li>
              <li>
                实现不同车机界面和"车趣美"界面播放状态保持一致(不同车机Android版本不同，蓝牙版本不同，要解决车机和产品的兼容性问题)；
              </li>
            </ul>
          </dd>
        </dl>
        <dl>
          <dt>2、鱼骨音乐</dt>
          <dd>
            这是一款音视频娱乐的客户端，移动端基于Android的Jetpack工具包进行构建，采用MVVM的开发模式，实现了音视频播放、朋友圈、收藏，点赞，多任务下载，用户认证登录等功能。
            <div class="difficulty-title">主要工作:</div>
            <ul class="difficulty">
              <li>
                自定义歌词展示View，实现歌词解析，歌词滚动，用户拖动等功能;
              </li>
              <li>音乐播放过程中启动前台服务，显示定制化的通知栏，提高应用的存活几率；</li>
              <li>
                使用WebView进行混合开发，在原生APP中嵌入H5播放器，实现视频播放;
              </li>
              <li>
                使用FastDFS搭建了小型的存储集群，提供云存储服务，提供音视频的下载服务;
              </li>
              <!-- <li><a href="/blog/practice/audio-video-app-based-fastdfs/">点我去看看</a></li> -->
            </ul>
          </dd>
        </dl>
      </div>
      <Divider :banner-name="'其它'" />
      <div class="prize">
        <ul>
          <li>英语六级</li>
        </ul>
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
    InfoItem,
  },
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
  .work-experience,
  .experience {
    width: 84%;
    margin: 0 auto;
    .difficulty-title {
      margin-top: 4px;
      font-weight: 600;
      margin-left: -15px;
    }
    .difficulty {
      margin-top: 4px;
    }
  }
  .experience {
    padding-bottom: 30px;
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