const ua = navigator.userAgent
const verIOS = ua.toLowerCase().match(/cpu iphone os (.*?) like mac os/)
const verAndroid = ua.toLowerCase().match(/android\s([0-9.]*)/)
const device = {
  IOS: /(iPhone|iPad|iPod|iOS)/gi.test(ua),
  IOSVersion: verIOS && verIOS[1].replace(/_/g,'.') || -1,
  Android: /android|adr/gi.test(ua),
  AndroidVersion: verAndroid && verAndroid[1] || -1,
  Mobile: /(iPhone|iPad|iPod|iOS|Android|adr|Windows Phone|SymbianOS)/gi.test(ua),
  Weibo: /(weibo)/gi.test(ua),
  Wechat: /MicroMessenger/i.test(ua),
  QQ: /qq\//gi.test(ua),
  Qzone: /qzone\//gi.test(ua),
  Alipay: /alipayclient|alipay/i.test(ua.toLowerCase()),
  Twitter: /Twitter/gi.test(ua),
  Facebook: /fbav/gi.test(ua),
  // epay
  Epay: /epay163/gi.test(ua),
  EpayApp: /epay163App/gi.test(ua),
  EpaySDK: /epay163SDK/gi.test(ua),
  // Android UA:
  // Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MMB29V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36 epay163App/4.8.0 hybrid/5
  // IOS UA:
  // Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 epay163App/4.8.0 hybrid/8.0
  AppVersion: /epay163App/i.test(ua) ? ua.split(' ').slice(-2)[0].split('/')[1] : 'The pages are not in the epay app'
}

// Vue 插件
device.install = Vue => {
  Vue.prototype.$device = device
}

export default device