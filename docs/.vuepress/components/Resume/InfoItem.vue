<template>
  <div class="item">
    <h4 class="type">{{type}}：</h4>
    <span class="info">{{info}}</span>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    info: {
      type: String,
      required: true
    }
  }
};
</script>
<style scoped lang="scss">
.item {
  width: 50%;
  display: flex;
  text-align: center;
  align-items: center;
  letter-spacing: 1px;
  .type {
    margin: 4px 0;
  }
}
</style>