import ajax from 'plugins/ajax'
import loadScript from 'utils/load-script'

class Wechat {
  constructor() {
    this.wx = null
    // 微信环境才初始化
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      this.init()
    }
  }
  /**
   * 微信JS-SDK初始化
   * @returns {Promise} Promise实例
   */
  init() {
    return new Promise((resolve, reject) => {
      // 如果已经初始化过了，则直接return
      if (this.wx) {
        resolve(this.wx)
        return
      }
      // 加载微信sdk和获取签名
      Promise.all([
        initScript(),
        initSignature()
      ]).then(([
        wx,
        signature
      ]) => {
        // 配置
        wx.config({
          debug: process.env.NODE_ENV !== 'production',
          appId: signature.appId,
          timestamp: signature.timestamp,
          nonceStr: signature.nonceStr,
          signature: signature.signature,
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
          ],
        })
        this.wx = wx
        // 成功
        wx.ready(() => {
          resolve(this.wx)
        })
        // 失败
        wx.error(res => {
          reject(res.errMsg)
        })
      }).catch(err => {
        reject(err)
      })
    })
  }
  /**
   * 分享调用
   * @param {Object} options 用户传入的分享参数
   */
  share(options) {
    return new Promise((resolve, reject) => {
      // 默认Link就不用手动配了
      options = {
        link: location.href,
        ...options
      }
      this.init()
        .then(wx => {
          // 分享到朋友圈
          wx.onMenuShareTimeline(options)
          // 分享给朋友
          wx.onMenuShareAppMessage(options)
          // 分享到QQ
          wx.onMenuShareQQ(options)
          // 分享到腾讯微博
          wx.onMenuShareWeibo(options)
          // 分享到QQ空间
          wx.onMenuShareQZone(options)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

/**
 * 加载脚本文件
 * @returns {Promise} Promise实例
 */
function initScript() {
  return new Promise((resolve, reject) => {
    // 获取微信JS-SDK
    loadScript('//res.wx.qq.com/open/js/jweixin-1.2.0.js', {
      async: true,
      defer: true,
    }).then(() => {
      resolve(window.jWeixin)
    }).catch(() => {
      reject('加载微信JSSDK文件失败')
    })
  })
}

/**
 * 获取签名信息
 * @returns {Promise} Promise实例
 */
function initSignature() {
  return new Promise((resolve, reject) => {
    const url = encodeURIComponent(getCurrentURL()) // 后端post有问题，暂时用get
    ajax.post(
      '/app/getWechatSignature.htm',
      { url: url }
    ).then(res => {
      const signature = res
      if (!signature) {
        reject('签名信息无效')
        return
      }
      resolve(signature)
    }).catch(() => {
      reject('获取签名信息失败')
    })
  })
}

/**
 * 获取当前页面URL（去除hash）
 * @returns {string} 页面URL
 */
function getCurrentURL() {
  return location.href.split('#')[0]
}

// Vue插件
Wechat.install = Vue => {
  Vue.prototype.$wx = new Wechat()
}

export default Wechat