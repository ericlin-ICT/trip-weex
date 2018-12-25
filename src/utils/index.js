const navigator = weex.requireModule('navigator')
const modal = weex.requireModule('modal')
const stream = weex.requireModule('stream');
const storage = weex.requireModule('storage')
const animation = weex.requireModule("animation")
const navigationBar = weex.requireModule("navigationBar");

export default function (name) {
  return name
}

export function getQuerys(url) {
  const splitedUrl = (url || '').split('?')
  if (splitedUrl.length < 2) {
    return {}
  }
  let qs = splitedUrl[1]
  qs = qs.split('#')[0]
  if (qs.length === 0) {
    return {}
  }

  const paramPairs = qs.split('&')
  const params = {}
  paramPairs.forEach((e) => {
    if (!e || e.length === 0) {
      return
    }
    const pair = e.split('=')
    if (pair.length < 2) {
      return
    }
    const key = pair[0]
    const value = pair.slice(1, pair.length).join('=')
    if (value.length === 0) {
      return
    }
    params[decodeURIComponent(key)] = decodeURIComponent(value)
  })
  return params
}

export function getQuery(key, url) {
  const reg = new RegExp(`[?|&]${key}=([^&]+)`)
  const match = url.match(reg)
  return match && match[1]
}

export function createLink(page, params = {}) {
  const args = []
  Object.keys(params).forEach((key) => {
    args.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  })

  if (weex.config.bundleUrl) {
    const splitedUrl = (weex.config.bundleUrl).split('?')
    const hostUrl = splitedUrl[0]
    const wx_tpl = getQuery('_wx_tpl', weex.config.bundleUrl)
    const tplPathList = (wx_tpl || hostUrl).split('/')
    tplPathList[tplPathList.length - 2] = page

    if (wx_tpl) {
      args.unshift(`_wx_tpl=${tplPathList.join('/')}`) // eslint-disable-line
      return `${hostUrl}?${args.join('&')}`
    } else {
      return `${tplPathList.join('/')}?${args.join('&')}`
    }

  }

  return undefined;
}

// 是否是web端
export const isWeb = WXEnvironment.platform === 'Web';

export function fetch(method, url, body) {
  return new Promise((resolve, reject) => {
    stream.fetch({
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      url,
      type: 'json',
    }, function (ret) {
      if (!ret.ok) {
        toast(ret.message)
        reject(ret)
      } else {
        resolve(ret)
      }
    });
  })
}

/**
 * 弹出框
 * @param {string} message 弹出框信息
 */
export function toast(message) {
  modal.toast({
    message,
    duration: 1
  })
}

/** 页面跳转
 * @param {String} pageName 页面名
 * @param {String} value 页面跳转url拼接参数
 */
export function jump(pageName, value) {
  const url = createLink(pageName, value)
  navigator.push({
    url,
    animated: 'true'
  })
}

/** 封装动画
 * @param {Element} dom dom节点
 * @param {Object} styles 样式
 */
export function special(dom, styles) {
  animation.transition(dom, {
    styles,
    duration: 200, //ms
    timingFunction: "ease",
    delay: 100 //ms
  });
}

/**
 * 保存到本地数据库
 * @param {*} name 键
 * @param {string} value 值
 */
export function setItem(name, value) {
  storage.setItem(name, typeof value === 'object' ? JSON.stringify(value) : value, event => {
    console.log('set success')
  })
}

/**
 * 读取本地数据库
 * @param {String} name 键
 */
export async function getItem(name) {
  const pms = () => {
    return new Promise((resolve, reject) => {
      storage.getItem(name, event => {
        resolve(event)
      })
    })
  }
  const data = await pms();
  return data.data;
}

/**
 * 删除本地数据库
 * @param {String} name 键
 */
export function removeItem(name) {
  storage.removeItem(name, event => {
    console.log('delete value:', event.data)
  })
}

/**
 * 读取本地所有数据库
 */
export function getAll() {
  storage.getAllKeys(event => {
    // modal.toast({ message: event.result })
    if (event.result === 'success') {
      modal.toast({
        message: 'props: ' + event.data.join(', ')
      })
    }
  })
}

/** 转化日期
 * @param {yyyy-MM-dd | yyyy-MM-dd hh:mm:ss} 转化的日期格式
 * @param {string} date 日期
 * @return {string}
 */
export function format(fmt, date = new Date()) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/** 设置uuid */
export function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

/** 设置跳转标题
 * @param {String} title 标题
 */
export function setTitle(title) {
  if (navigationBar) {
    navigationBar.setTitle({ title }, e => { }, e => { });
  }
}