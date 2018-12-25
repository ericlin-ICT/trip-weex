<template>
  <list>
    <cell class="vxc-header vxc-flex-row">
      <div class="vxc-nav vxc-active" 
        ref='vxc-wrapper' />

      <div v-for="(item, i) of data" 
        :key="i" 
        @click="onTabbarClick(i)"
        :style="{width: scope + 'px'}" 
        class="vxc-nav vxc-flex-center" >
        <text :class="['vxc-text', i === index && 'vxc-text-active']">
            {{item.label}}
        </text>
      </div>

    </cell>
  </list>
</template>

<script>
const animation = weex.requireModule("animation");

export default {
  data: () => {
    return {
      index: 0,
      scope: ""
    };
  },
  props: {
    data: {
      type: Array
    }
  },
  created() {
    this.scope = 750 / this.data.length;
  },
  methods: {
    /** 动画
     * @param {Element} dom dom节点
     * @param {Object} styles 样式 
     */
    special(dom, styles) {
      animation.transition(dom, {
        styles,
        duration: 300, //ms
        timingFunction: "ease",
        delay: 100 //ms
      });
    },
    /** 单击tab
     * @param {number} index 数组索引
     */
    onTabbarClick(index) {
      this.index = index;
      const wrapperEl = this.$refs["vxc-wrapper"];
      this.special(wrapperEl, {
        transform: `translate(${this.scope * index}px,0)`
      });
      /* const mainEl = this.$refs["vxc-main"];
      this.special(mainEl, {
        transform: `translate(${-750 * index}px,0)`
      }); */
    }
  }
};
</script>

<style scoped>
.vxc-flex-center {
  display: flex;
  justify-content: center;
  /* align-items: center; */
}

.vxc-flex-row {
  display: flex;
  flex-direction: row;
}

.vxc-header {
  width: 750px;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: #e6e8ea;
  border-bottom-style: solid;
  position: relative;
}
.vxc-nav {
  height: 80px;
  padding-top: 16px;
}
.vxc-text {
  white-space: inherit;
  font-size: 28px;
  text-align: right;
  position: absolute;
  right: 93px;
  color: #687280;
}
.vxc-text-active {
  color: black;
}
.vxc-active {
  background-color: #3399ff;
  height: 6px;
  width: 56px;
  position: absolute;
  bottom: 0;
  left: 98px;
}
.vxc-container {
  width: 750px;
}
</style>