import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import defaultImg from './img/loading__base64.svg'

const NosReg = /epay.*?nos/

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1,
  error: defaultImg,
  loading: defaultImg,
  filter: {
    /**
     * 更具屏幕DPR处理远端图片
     * Nos文档：https://www.163yun.com/help/documents/66982522786074624
     */
    optimizeImage (listener, options) {
      // 只有Nos下的图片才处理
      if (NosReg.test(listener.src)) {
        // 处理倍图
        const width = parseFloat(window.getComputedStyle(listener.el.parentNode).width)
        const realWidth = Math.ceil(width * window.devicePixelRatio)
        listener.src += listener.src.indexOf('?imageView') === -1 ? `?imageView&thumbnail=${realWidth}x0&interlace=1` : `&thumbnail=${realWidth}x0&interlace=1`
        // 如果客户端支持webp，则使用webp格式
        if (options.supportWebp) {
          listener.src += '&type=webp'
        }
      }
    }
  }
})
