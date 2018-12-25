<template>
    <list @loadmore="onloadmore" loadmoreoffset='450'>
        <cell class="flex-center header">
            <div class="flex">
              <text class="full">{{localData && localData.titleDate[0]}}</text>
              <text class="full">{{localData && localData.titleDate[1]}}</text>
            </div>
            <div class="flex header-content">
              <div>
                <text class="full t-right">{{localData && localData.out}}</text>
                <text class="medium t-right time">{{detailData && detailData.star[0]}}</text>
                <text class="small t-right">{{detailData && detailData.star[1]}}</text>
              </div>
              <div class="flex-center wait-box">
                <image class="arrive" :src='imgs.arrive' />
                <text class="small">约2小时20分钟</text>
              </div>
              <div>
                <text class="full">{{localData && localData.arrive}}</text>
                <text class="medium time">{{detailData && detailData.end[0]}}</text>
                <text class="small">{{detailData && detailData.end[1]}}</text>
              </div>
            </div>
            <div class="flex-row">
              <image class="icon" :src='detailData && detailData.icon'/>
              <text class="small gray company">{{detailData && detailData.name}}</text>
            </div>
        </cell>
        
        <cell class="main" v-for="(item, i) of detailList" :key="'list-' + i">
          <div class='flex-both list-top'>
            <div>
              <div class="flex-center">
                <div class="flex-row">
                  <text class="small blue">¥</text>
                  <text class="medium blue">{{item.price}}</text>
                  <text class="title">{{item.title}}</text>
                </div>
              </div>
              <div class="flex">
                <text class="info">{{item.info}}</text>
              </div>
            </div>

            <text @click='onBooking' class="booking full">预定</text>
          </div>
          
          <text class="gray full bottom-text">经济舱{{item.offer}}折</text>
          <text class="gray full bottom-text">退改详情</text>
        </cell>

        <cell class="flex-row-center" v-if="detailList.length < 40">
          <image class="loading" :src='imgs.loading' />
        </cell>
    </list>
</template>

<script>
import { detailList } from "./details.model.js";
import { imgs } from "../../utils/icons.js";
import { toast, getItem, getQuerys, setTitle } from "../../utils";

export default {
  data() {
    return {
      // 头部数据
      detailData: null,
      // 列表数据
      detailList,
      // 读取的本地数据
      localData: null,
      imgs
    };
  },
  async created() {
    setTitle("机票详情");
    this.detailData = JSON.parse(getQuerys(weex.config.bundleUrl).data)
    await getItem("data").then(res => {
      try {
        this.localData = JSON.parse(res).saveLocal;
      } catch (err) {}
    });
  },
  methods: {
    /** 上拉加载 */
    onloadmore() {
      if (this.detailList.length < 40) {
        setTimeout(() => {
          this.detailList = [...this.detailList, ...detailList];
        }, 500);
      }
    },
    /** 单击预定 */
    onBooking() {
      toast("预定成功!");
    }
  }
};
</script>

<style scoped lang='scss'>
@import "../styles/public.scss";

.header {
  padding: 30px 0 38px 0;
  @include borderBottom(12px, $b-3);
}

.header-content {
  margin-bottom: 37px;
}

.weex-root .arrive,
.arrive {
  height: 10.3px;
  width: 105.3px;
  margin-bottom: 22.7px;
}

.blue,
.weex-root .blue {
  margin-left: 7px;
}

.icon {
  height: 24px;
  width: 24px;
}

.main {
  padding: 33px 32px;
  @include borderBottom(12px, $b-3);
}

.list-top {
  @include borderBottom(1px, $b-3);
  padding-bottom: 18px;
}

.time,
.weex-root .time {
  margin-bottom: 8px;
}

.company {
  margin-left: 8px;
}

.t-right {
  text-align: right;
}

.wait-box {
  margin: 0 44px;
}

.info {
  font-size: 20px;
  padding: 9px 10px;
  @include border($b-7);
  border-radius: 20px;
  text-align: center;
  margin-top: 12px;
}

.title {
  font-size: 22px;
  background-image: linear-gradient(to right, $b-5, $b-8);
  color: white;
  padding: 4px 12px;
  border-bottom-right-radius: 25px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  margin-left: 18px;
}

.booking {
  background-color: $b-5;
  color: white;
  height: 56px;
  width: 140px;
  line-height: 56px;
  text-align: center;
  border-radius: 3px;
}

.bottom-text {
  margin-top: 19px;
}
</style>

