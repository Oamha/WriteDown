<template>
  <div class="panel">
    <div class="content">
      <div class="header d-flex ai-center jc-between">
        <h2>个人简历</h2>
        <span>求职意向：移动开发工程师</span>
      </div>
      <div class="avatar">
        <img :src="$withBase('/img/avatar.jpg')" alt="头像" width height="140px" />
      </div>
      <Divider :banner-name="'个人信息'" />
      <div class="base-info d-flex ai-center wrap">
        <InfoItem :type="'姓名'" :info="'薛东'"></InfoItem>
        <InfoItem :type="'学历'" :info="'本科'"></InfoItem>
        <InfoItem :type="'邮箱'" :info="'1123988589@qq.com'"></InfoItem>
        <InfoItem :type="'政治面貌'" :info="'团员'"></InfoItem>
        <InfoItem :type="'家庭住址'" :info="'河南省信阳市固始县'"></InfoItem>
        <InfoItem :type="'联系方式'" :info="'15738155286'"></InfoItem>
      </div>
      <Divider :banner-name="'获奖记录'" />
      <div class="prize">
        <ul>
          <li>河南省大学生计算机程序设计大赛省级奖</li>
          <li>河南省大学生创新创业大赛省级奖</li>
          <li>大学英语六级</li>
        </ul>
      </div>
      <Divider :banner-name="'项目经历'" />
      <div class="experience">
        <dl>
          <dt>1、鱼骨音乐（个人前后端项目）</dt>
          <dd>这是一个前后端项目，主要功能有基于Android平台的音视频播放，简单的设计功能，如发帖，看帖，收藏，点赞等。</dd>
        </dl>
        <dl>
          <dt>1、鱼骨音乐（个人前后端项目）</dt>
          <dd>这是一个前后端项目，主要功能有基于Android平台的音视频播放，简单的设计功能，如发帖，看帖，收藏，点赞等。</dd>
        </dl>
        <dl>
          <dt>1、鱼骨音乐（个人前后端项目）</dt>
          <dd>这是一个前后端项目，主要功能有基于Android平台的音视频播放，简单的设计功能，如发帖，看帖，收藏，点赞等。</dd>
        </dl>
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
      top: -94px;
      border: 2px solid #efefef;
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    }
  }
  .base-info,
  .prize,
  .experience {
    width: 70%;
    margin: 0 auto;
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