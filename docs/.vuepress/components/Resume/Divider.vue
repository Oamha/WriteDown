<template>
  <div class="divider">
    <div class="banner">{{bannerName}}</div>
    <div class="dash"></div>
  </div>
</template>
<script>
export default {
  props: {
    bannerName: {
      type: String,
      required: true
    }
  }
};
</script>
<style scoped lang="scss">
.divider {
  display: flex;
  align-items: center;
  margin: 15px 0;
  .banner {
    text-align: center;
    width: 120px;
    color: #fff;
    padding: 10px 0;
    background-color: rgb(127, 127, 127);
  }
  .dash {
    height: 0;
    flex: 1;
    border-bottom: 1px dashed rgb(206, 206, 206);
  }
}
</style>