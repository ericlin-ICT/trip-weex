<template>
  <div class="body">
    
    <div>
      <Tab :data='tabData'/>
    </div>
    <div class="header flex-row-center">
      <div class="main">
        <div class="flex-row city-select">
          <div class="city-box">
            <text @click="showListCity(true)" ref="starCityEl" class="city">{{saveLocal.out}}</text>
          </div>
          <image @click="onExchange" class="exchange" :src='imgs.exchange' />
          <div class="city-box">
            <text @click="showListCity(false)" ref="endCityEl" class="city right-city">{{saveLocal.arrive}}</text>
          </div>
        </div>

        <div @click="onSelectDate" class="flex-center-both box-list">
          <div class="flex">
            <text class="box-left">{{saveLocal.titleDate[0]}}</text>
            <text class="box-right">{{saveLocal.titleDate[1]}}</text>
          </div>
          <image class="next" :src='imgs.next' />
        </div>

        <div class="flex-row box-check">
          <wxc-checkbox :has-bottom-border='false'></wxc-checkbox>
          <div class="flex-center-both">
            <div class="flex">
              <text class="box-left">携带儿童</text>
              <text class='box-right'>2-12岁</text>
            </div>
          </div>
          

          <wxc-checkbox :has-bottom-border='false'></wxc-checkbox>
          <div class="flex-center-both">
            <div class="flex">
              <text class="box-left">携带婴儿</text>
              <text class='box-right'>14天-2岁</text>
            </div>
          </div>
        </div>

        <text @click="onSubmit" class="btn">搜索</text>
      </div>
    </div>

    <div class="flex-center-both footer">
      <div class="flex-row">
        <image class="ticket" :src='imgs.ticket' />
        <text class="full">特价机票</text>
      </div>
      <div>
        <div class="flex-row">
          <text class="md">杭州-北京 单程</text>
          <text class="md orange"> ¥240 </text>
          <text class="md">起  </text>
          <image class="next" :src='imgs.next' />
        </div>
      </div>
    </div>
    
    <wxc-city ref="wxcCity"
              :animationType="animationType"
              :currentLocation="'杭州'"
              :cityStyleType="cityStyleType"
              @wxcCityItemSelected="citySelect" />

    <wxc-page-calendar :date-range="dateRange"
                       :animationType="animationType"
                       :selected-date="saveLocal.selectedDate"
                       :selected-note="selectedNote"
                       :is-range="isRange"
                       :minibar-cfg="minibarCfg"
                       :desc-list="descList"
                       @wxcPageCalendarDateSelected="wxcPageCalendarDateSelected"
                       ref="wxcPageCalendar"></wxc-page-calendar>
  </div>
</template>

<script>
import { WxcPageCalendar, WxcCheckbox, WxcCity } from "weex-ui";
import { imgs } from "../../utils/icons.js";
import {
  setItem,
  toast,
  jump,
  removeItem,
  getItem,
  format,
  special,
  setTitle
} from "../../utils";
import Tab from "../../components/tabbar/tabbar.vue";

export default {
  components: {
    WxcPageCalendar,
    WxcCheckbox,
    WxcCity,
    Tab
  },
  data() {
    return {
      config: {},
      tabData: [
        {
          label: "单程"
        },
        {
          label: "往返"
        },
        {
          label: "多程"
        }
      ],
      imgs,
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
      descList: [
        { date: "2018-06-11", value: "￥200" },
        { date: "2018-06-13", value: "￥200" },
        { date: "2018-06-15", value: "￥200" },
        { date: "2018-06-16", value: "￥200" },
        { date: "2018-06-17", value: "￥222" },
        { date: "2018-06-18", value: "￥341" },
        { date: "2018-06-19", value: "￥230" },
        { date: "2018-06-30", value: "￥2000" }
      ],

      currentCity: "",
      cityStyleType: "list",
      saveLocal: {
        // 出发
        out: "杭州",
        // 到达
        arrive: "上海",
        selectedDate: [],
        titleDate: []
      },
      // 是否点击出发还是到达
      isOut: true
    };
  },
  created() {
    setTitle("购买机票");
    const date = format("yyyy-MM-dd");
    const arr = date.split("-");
    this.wxcPageCalendarDateSelected({ date: [date] });
    this.dateRange = [date, `${Number(arr[0]) + 1}-${arr[1]}-${arr[2]}`];
    // removeItem('data')
    getItem("data").then(res => {
      if (res && res !== "undefined") {
        const { saveLocal } = JSON.parse(res);
        this.saveLocal.out = saveLocal.out;
        this.saveLocal.arrive = saveLocal.arrive;
      } else {
        this.saveLocal.out = "杭州";
        this.saveLocal.arrive = "上海";
      }
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

    /** 切换城市 */
    onExchange() {
      // endCityEl
      const scope = 235;
      special(this.$refs.starCityEl, {
        transform: `translate(${scope}px, 0)`,
        opacity: 0,
      });
      special(this.$refs.endCityEl, {
        transform: `translate(-${scope}px, 0)`,
        opacity: 0,
      });
      setTimeout(() => {
        const { out, arrive } = this.saveLocal;
        this.saveLocal.arrive = out;
        this.saveLocal.out = arrive;
        special(this.$refs.starCityEl, {
          transform: `translate(0, 0)`,
          opacity: 1,
        });
        special(this.$refs.endCityEl, {
          transform: `translate(0, 0)`,
          opacity: 1,
        });
      }, 200);
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
      setItem("data", { saveLocal: this.saveLocal });
    },
    /** 点击页面跳转 */
    onSubmit() {
      setItem("data", { saveLocal: this.saveLocal });
      jump("home");
    },
    /** 点击显示城市列表
     * @param {Boolean} bl 判断点击是出发还是到达 城市
     */
    showListCity(bl) {
      this.isOut = bl;
      this.cityStyleType = "list";
      this.$refs["wxcCity"].show();
    },
    /** 选中的城市
     * @param {Object} e 选中的数据
     */
    citySelect(e) {
      const { name } = e.item;
      this.isOut ? (this.saveLocal.out = name) : (this.saveLocal.arrive = name);
      setItem("data", { saveLocal: this.saveLocal });
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../styles/public.scss";
@mixin box {
  width: 750px;
  height: 200px;
}
.body {
  background-color: $b-3;
}

.md {
  font-size: $md-size;
  color: $b-2;
}

.orange {
  color: $b-4;
}

.header {
  background-color: white;
}

.full {
  font-size: $full-size;
}

.footer {
  padding: 36px 44px 36px 32px;
  background-color: white;
  margin-top: 20px;
}

.main {
  width: 686px;
}

.next {
  height: 35px;
  width: 17.6px;
}

.ticket {
  width: 38px;
  height: 26px;
  margin-right: 25px;
}

.btn {
  background-color: $b-5;
  color: white;
  height: 80px;
  line-height: 80px;
  width: 686px;
  text-align: center;
  border-radius: 4px;
  font-size: $full-size;
  margin: 50px 0 40px 0;
}

.btn:active {
  opacity: 0.9;
}

.exchange {
  height: $big-size;
  width: $big-size;
  margin: 0 20px;
}

.box-list {
  width: 686px;
  @include borderBottom(1px, $b-1);
  padding: 39px 0 19px 0;
}

.box-check {
  @include borderBottom(1px, $b-1);
  padding-top: 20px;
}

.city {
  font-size: $medium-size;
  width: 304px;
  padding: 39px 0 19px 0;
}

.city-box {
  @include borderBottom(1px, $b-1);
}

.box-right {
  color: $b-2;
  font-size: $small-size;
}

.box-left {
  font-size: $medium-size;
}

.right-city {
  text-align: right;
  margin-right: 10px;
}

.img {
  @include box;
}
.slider {
  flex-direction: row;
  @include box;
}
.slider-pages {
  flex-direction: row;
  @include box;
}
.indicator {
  width: 750px;
  height: 30px;
  position: absolute;
  bottom: 1px;
  left: 1px;
  item-color: black;
  item-selected-color: gray;
  item-size: 20px;
}
</style>


