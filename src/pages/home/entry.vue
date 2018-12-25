<template>
  <scroller>
    <div class="flex-row header">
        <div @click="init" class="flex-row box">
          <image class="before" :src='imgs.before' />
          <div class="content white">
            <text class="md-header white">前一天</text>
            <text class="price-header white">¥250</text>
          </div>
        </div>

        <div @click="onSelectDate" class="flex-center-both main-header">
          <div>
            <text class="md-header">{{saveLocal.selectedDate && saveLocal.selectedDate[0]}}  {{saveLocal.titleDate && saveLocal.titleDate[1]}}</text>
            <text class="price-header">¥290</text>
          </div>
            <image class="calendar" :src='imgs.calendar' />
        </div>

        <div @click="init" class="flex-row box">
          <div class="content">
            <text class="md-header white">后一天</text>
            <text class="price-header white">¥350</text>
          </div>
          <image class="after" :src='imgs.before' />
        </div>
      </div>
    <list @loadmore="onloadmore" loadmoreoffset='450'>
      <refresh class="refresh" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'">
          <loading-indicator class="indicator"></loading-indicator>
      </refresh>
      
      <cell @click="onListJump(item)" class="flex-both-start home-main" v-for="item of listData" :key="item.id">
        <div>
          <div class="flex-row">
            <div>
              <text class="medium">{{item.star[0]}}</text>
              <text class="gray small city">{{item.star[1]}}</text>
            </div>
            <image class="arrive" :src='imgs.arrive' />
            <div>
              <text class="medium">{{item.end[0]}}</text>
              <text class="gray small city">{{item.end[1]}}</text>
            </div>
          </div>
          <div class="flex-row">
            <image class="icon" :src='item.icon' />
            <text class="gray small">{{item.name}}</text>
          </div>
        </div>

        <div class="flex-row">
          <text class="small blue">¥</text>
          <text class="medium blue">{{item.price}}</text>
        </div>
      </cell>

      <cell class="flex-row-center" v-if="listData.length < 11">
        <image class="loading" :src='imgs.loading' />
      </cell>
    </list>
    <div class="flex-row footer">
      <div @click="onSort(i)" v-for="(item, i) of footerData" :style="{width: 750/footerData.length + 'px'}" class="flex-center" :key="'footer-' + i">
        <image class="footer-img" :src='item.icon' />
        <text class="footer-name">{{item.name}}</text>
      </div>
    </div>


    <wxc-page-calendar :date-range="dateRange"
                       :animationType="animationType"
                       :selected-date="saveLocal.selectedDate"
                       :selected-note="selectedNote"
                       :is-range="isRange"
                       :minibar-cfg="minibarCfg"
                       :desc-list="descList"
                       @wxcPageCalendarDateSelected="wxcPageCalendarDateSelected"
                       ref="wxcPageCalendar"></wxc-page-calendar>
  </scroller>
    
</template>

<script>
import { getItem, jump, format, setTitle, toast } from "../../utils";
import { imgs } from "../../utils/icons.js";
import { mock, footerData } from "./home.model";
import { WxcPageCalendar } from "weex-ui";

export default {
  components: { WxcPageCalendar },
  data() {
    return {
      animationType: "push",
      isRange: true,
      calendarTitle: "选择日期",
      // 日期选择范围
      dateRange: [],
      selectedNote: ["出发", "到达", "往返"],
      minibarCfg: {
        title: "日期选择",
        "background-color": "white"
      },
      descList: [],
      // 保存本地的数据
      saveLocal: [],
      // 图片资源地址
      imgs,
      // 底部数据
      footerData,
      // 列表数据
      listData: [],
      // 顶部刷新是否显示
      refreshing: false,
      // 保存排序 1时间排序 0价格排序
      saveSortIndex: 1
    };
  },
  async created() {
    setTitle("机票选择");
    const date = format("yyyy-MM-dd");
    const arr = date.split("-");
    this.dateRange = [date, `${Number(arr[0]) + 1}-${arr[1]}-${arr[2]}`];
    await getItem("data").then(res => {
      try {
        this.saveLocal = JSON.parse(res).saveLocal;
      } catch (err) {}
      this.init();
    });
  },
  methods: {
    /** 单击时间选择 */
    onSelectDate() {
      this.isRange = false;
      setTimeout(() => {
        this.$refs["wxcPageCalendar"].show();
      }, 10);
    },
    /** 下拉刷新 */
    onrefresh(event) {
      this.refreshing = true;
      setTimeout(() => {
        this.init();
        this.refreshing = false;
      }, 800);
    },
    /** 选中时间 */
    wxcPageCalendarDateSelected(e) {
      const arr = e.date[0].split("-");
      let week = "星期";
      switch (new Date(e.date).getDay()) {
        case 0:
          week += "日";
          break;
        case 1:
          week += "一";
          break;
        case 2:
          week += "二";
          break;
        case 3:
          week += "三";
          break;
        case 4:
          week += "四";
          break;
        case 5:
          week += "五";
          break;
        case 6:
          week += "六";
          break;
      }
      this.saveLocal.titleDate = [`${arr[1]}月${arr[2]}日`, week];
      this.saveLocal.selectedDate = e.date;
      this.init();
    },
    /** 初始化 */
    init() {
      this.listData = mock
        .init(
          this.saveLocal.out,
          this.saveLocal.arrive,
          true,
          this.saveSortIndex
        )
        .slice(0, 9);
    },
    /** 上拉加载 */
    onloadmore() {
      setTimeout(() => {
        this.listData = mock.data;
      }, 500);
    },
    /** 单击列表页面跳转
     * @param {Object} node 节点属性
     */
    onListJump(node) {
      jump("details", { data: JSON.stringify(node) });
    },
    /** 单击底部排序按钮
     * @param {number} 数组索引
     */
    onSort(index) {
      if (index === 2) return;
      if (this.saveSortIndex === index) {
        mock.dataReverse();
      } else {
        mock.init(
          this.saveLocal.out,
          this.saveLocal.arrive,
          true,
          index,
          this.saveSortIndex === index
        );
      }
      this.listData =
        this.listData.length > 10 ? mock.data : mock.data.slice(0, 9);
      this.saveSortIndex = index;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../styles/public.scss";

.refresh {
  width: 750;
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  align-items: center;
}

.indicator {
  height: 60px;
  width: 60px;
  color: $b-5;
}

.header {
  background-color: $b-5;
  padding: 0 32.4px;
  height: 100px;
  width: 750px;
}

.white {
  color: white;
}

.md-header {
  font-size: 20px;
}
.price-header {
  font-size: $md-size;
}

.weex-root .icon {
  margin-right: 8px;
}

.icon {
  height: 24px;
  width: 24px;
  margin-right: 8px;
}

.weex-root .arrive {
  margin: 0 26.7px 50px 3px;
}

.arrive {
  width: 105.3px;
  height: 10.3px;
  margin: 0 26.7px 50px 3px;
}

.weex-root .city {
  margin: 8px 0 28px 0;
}

.city {
  margin: 8px 0 28px 0;
}

.before,
.after {
  height: 32px;
  width: 17.6px;
}

.content {
  margin: 0 54px 0 24px;
}

.main-header {
  background-color: white;
  height: 64px;
  width: 374px;
  padding: 8px 16px;
}

.calendar {
  height: 24.9px;
  width: 28.4px;
}

.after {
  transform: rotate(180deg);
}

.home-main {
  @include borderBottom(12px, $b-3, top);
  padding: 28px 32px 28px 22px;
}

.blue,
.weex-root .blue {
  margin-left: 7px;
}

.footer {
  height: 100px;
  @include borderBottom(1px, $b-3, top);
}

.footer-name {
  font-size: 22px;
  color: $b-6;
}

.footer-img {
  margin-bottom: 8px;
  height: 48px;
  width: 48px;
}
</style>

