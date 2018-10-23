/**
 * hubble埋点
 * window.__hbCacheArr { array } 临时存储的hubble数据，在header中定义
 */
import './source'
import sha256 from './sha256'

const hb = {
  _hbInterval: null,
  _category: null,
  _label: null,
  _accountId: null,
  _epaySDKVersion: null,

  _init(key) {
    window.DATracker && window.DATracker.init(key)
  },
  $hb(eventId, hbData) {
    if (!eventId) {
      console.warn('eventId必须有')
      return
    }
    hbData = hb._initData(hbData)
    // category 和 label为必须的
    if (!(hbData.category && hbData.label)) {
      console.warn('category 和 label为必须的')
      return
    }
    hb._report(eventId, hbData)
  },
  _initData(hbData) {
    hbData = hbData || {}
    // 默认要上报的数据
    let defData = {
      category: this._category,
      label: this._label,
      accid: sha256(this._accountId),
      epaySDKVersion: this._epaySDKVersion
    }
    for (let i in defData) {
      if (!hbData[i] && defData[i]) {
        hbData[i] = defData[i]
      }
    }
    // 获取信息
    return hbData
  },
  /**
   * 上报到hubble数据中心
   * @param {*}} eventid
   * @param {*} hbData
   */
  _report(eventId, hbData) {
    if (window.DATracker) {
      window.DATracker.track(eventId, hbData)
      // 仅开发环境打印
      const debug = process.env.NODE_ENV !== 'production'
      if (debug) {
        console.log('上报的数据：', eventId, hbData)
      }
    } else {
      window.__hbCacheArr.push({
        eventId: eventId,
        eventData: hbData,
      })
    }
  },
  /**
   * 定时检测是否有未上报的数据
   */
  _reportInterval() {
    this._clearInterval()
    this._hbInterval = setInterval(() => {
      if (!window.DATracker) {
        return
      }
      let hbc = window.__hbCacheArr
      for (let i = 0; i < hbc.length; i++) {
        this._report(hbc[i]['eventId'], hbc[i]['eventData'])
      }
      window.__hbCacheArr = []
      this._clearInterval()
    }, 1000)
  },
  /**
   * 清除定时器
   */
  _clearInterval() {
    if (this._hbInterval) {
      clearInterval(this._hbInterval)
      this._hbInterval = null
    }
  },
  /**
   * 设置category
   */
  $setCategory(category) {
    hb._category = category
  },
  /**
   * 设置label
   */
  $setLabel(label) {
    hb._label = label
  },
  /**
   * 设置category
   */
  $setAccountId(accountId) {
    hb._accountId = accountId
  },
  /**
   * 设置epaySDKVersion
   */
  $setEpaySDKVersion(epaySDKVersion) {
    hb._epaySDKVersion = epaySDKVersion
  }
}

/**
 * Vue插件
 * @param {*} Vue
 */
hb.install = Vue => {
  const ONLINE = process.env.ONLINE === true
  // 本地: DD-DDDD-DDDDDDDDDDDD
  // 开发/测试/预发: TT-TTTT-TTTTTTTTTTTT
  // 线上: OO-OOOO-OOOOOOOOOOOO
  let appKey = 'DD-DDDD-DDDDDDDDDDDD'
  if (process.env.NODE_ENV === 'production') {
    appKey = ONLINE ? 'OO-OOOO-OOOOOOOOOOOO' : 'TT-TTTT-TTTTTTTTTTTT'
  }
  hb._init(appKey)
  Vue.prototype.hb = hb
  Vue.prototype.$hb = hb.$hb
}

export default hb
