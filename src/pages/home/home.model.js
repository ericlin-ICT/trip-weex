import {
    imgs
} from '../../utils/icons'
import {
    toast,
    uuid
} from "../../utils";

export const mock = {
    data: [],
    company: [{
            name: '首航JD5675 | 322（其他）',
            icon: imgs.jd
        },
        {
            name: '国航CA1740 | 空落321（中）',
            icon: imgs.ca
        },
        {
            name: '长龙GJ8888 | 空客320(中）',
            icon: imgs.gj
        },
        {
            name: '山航SC1185 | 波音738（中）',
            icon: imgs.sc
        },
        {
            name: '上航FM9158 | 波音73E（中）',
            icon: imgs.fm
        }
    ],
    time: 0,
    /** 获取列表数据
     * @param {string} starCity 开始地点
     * @param {string} endCity 结束地点
     * @return {Array}
     */
    getList: function (starCity, endCity) {
        const scope = Array(10).fill(0)
        const arr = []
        scope.forEach(() => {
            const {
                time
            } = this;
            const random = Math.ceil(Math.random() * 5);
            const random1 = Math.ceil(Math.random() * 5);
            const random2 = Math.ceil(Math.random() * 10);
            arr.push({
                star: [`${time + 2 < 10 ? '0' : ''}${time + 2}:${random}0`, `${starCity}国际T1`],
                end: [`${time + 4 < 10 ? '0' : ''}${time + 4}:${random1}5`, `${endCity}国际T3`],
                ...this.company[random - 1],
                price: `${random2 + 1}${random1 - 1}0`,
                id: uuid()
            })
            this.time += 1;
        })
        return arr
    },
    /** 初始化20条数据
     * @param {string} starCity 开始地点
     * @param {string} endCity 结束地点
     * @param {Boolean} isInit 是否重新计算
     * @param {number} isSort 0价格排序 1时间排序
     * @return {Array}
     */
    init: function (starCity, endCity, isInit, isSort) {
        if (isInit) {
            this.data = [];
            this.time = 0;
            this.data = [...this.getList(starCity, endCity), ...this.getList(starCity, endCity)]
        }
        if (isSort === 0) {
            this.data.sort((a, b) => a.price - b.price);
        } else {
            const jumpTime = time => {
                return Number(time.replace(":", ""));
            };
            this.data.sort(
                (a, b) => jumpTime(a.star[0]) - jumpTime(b.star[0])
            );
        }
        return this.data
    },
    dataReverse: function () {
        return this.data.reverse()
    }
}

export const footerData = [{
    icon: imgs.price,
    name: '价格排序',
}, {
    icon: imgs.time,
    name: '时间早到晚',
}, {
    icon: imgs.filter,
    name: '筛选',
}]