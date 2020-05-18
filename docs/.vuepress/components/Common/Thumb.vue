<template>
  <div class="d-flex jc-between gallery" ref="box">
    <img
      class="image"
      v-for="(item,index) in imageUrls"
      :src="prefix + '/' + item"
      :width="computedWidth"
      :height="height"
      @click="show(index)"
    />
    <component
      v-if="picturePreviewer"
      :is="picturePreviewer"
      ref="previewer"
      :list="imageList"
      :options="options"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      picturePreviewer: null,
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".image")[index];
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }
    };
  },
  props: {
    urls: {
      type: [String, Array],
      default: () => []
    },
    width: {
      type: [Number, String],
      default: "100%"
    },
    height: {
      type: [String, Number],
      default: "auto"
    },
    prefix: {
      type: String
    },
    direction: {
      type: String,
      default: "column"
    },
    gutter: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    import("vue-picture-preview").then(module => {
      this.picturePreviewer = module.default;
    });
  },
  computed: {
    containerWidth() {
      return null;
    },
    imageUrls() {
      if (typeof this.urls === "string") {
        return [this.urls];
      }
      return this.urls;
    },
    computedWidth() {
      if (Object.prototype.toString.call(this.urls) === "[object Array]") {
        return (
          Math.floor(((1 - this.gutter / 800) / this.urls.length) * 100) + "%"
        );
      }
      return this.width;
    },
    imageList() {
      return this.imageUrls.map(item => ({
        src: `http://localhost:8080/blog${this.prefix}/${item}`,
        msrc: ''
      }));
    }
  },
  methods: {
    show(index) {
      // 显示特定index的图片，使用ref
      this.$refs.previewer.show(index);
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../styles/norimalize.scss";
.gallery {
  .image {
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    padding: 4px;
    background-color: #f1f1f1;
    display: block;
    margin: 0 auto;
  }
}
</style>