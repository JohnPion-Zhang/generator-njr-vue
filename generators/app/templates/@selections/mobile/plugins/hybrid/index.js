import axios from 'axios'
/**
 * 调用APP的接口
 */
let Hybrid = {}

Hybrid.install = Vue => {
  const NEJB = () => {
    let apiCaches = []
    //监听事件
    document.addEventListener(
      'NEJBReady',
      () => {
        // 执行api缓存队列里的api方法
        let api
        while ((api = apiCaches.pop())) {
          window.NEJB.invoke(api.cmdName, api.callback, api.params)
        }
      },
      false
    )

    return {
      invoke: function(cmdName, params, callback) {
        // params不可为null，对桥接层逻辑进行容错
        params = params || {}
        // 本地开发数据模拟
        if (
          process.env.NODE_ENV !== 'production' &&
          !/epay163/gi.test(navigator.userAgent) ||
          // 开发环境要让hybrid模拟数据生效，还需要配置模拟器的UA，对应APP的真实UA，然后加上前缀`DeviceMock`即可
          // 如
          // 安卓 UA:
          // DeviceMock Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MMB29V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.91 Mobile Safari/537.36 epay163App/4.8.0 hybrid/5
          // 苹果 UA:
          // DeviceMock Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 epay163App/4.8.0 hybrid/8.0
          /DeviceMock/.test(navigator.userAgent)
        ) {
          console.log(`%c调用了hybrid接口: ${cmdName}`, 'color: green')
          axios.post(
            `/hybrid/${cmdName}`,
            params
          ).then(res => {
            // 0000 - 成功
            // 1000 - 未知的命令
            // 1001 - 验签失败
            // 1002 - 参数错误
            // 1003 - 请求超时
            // 1004 - 版本过低
            // 1005 - 客户端不支持，请升级客户端
            // 2001 - 请求失败
            // 2002 - 用户取消
            // 3xxx-9xxx - 具体业务用
            const result = res.data
            if (result.retCode === '0000') {
              callback && callback(res.data)
            } else {
              console.error('hybrid mock error')
            }
          })
        } else if (window.NEJB && window.NEJB.invoke) {
          window.NEJB.invoke(cmdName, callback, params)
        } else if (/epay163/gi.test(navigator.userAgent)) {
          apiCaches.push({
            cmdName: cmdName,
            params: params,
            callback: callback,
          })
        }
      },
    }
  }

  const NEJBInstance = NEJB()
  Vue.prototype.$hybrid = function(cmd, params, callback) {
    NEJBInstance.invoke(cmd, params, callback && callback.bind(this))
  }
}

export default Hybrid
