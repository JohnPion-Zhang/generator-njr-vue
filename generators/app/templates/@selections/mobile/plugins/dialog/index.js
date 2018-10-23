import Vue from 'vue'
import Main from './main.vue'
let DialogConstructor = Vue.extend(Main)

const Dialog = options => {
  // 如果是直接字符串，那直接赋值给message就好了
  // 实例化
  const message = typeof options !== 'object' ? options : options.message
  const cancel = options.cancel || ''
  const ok = options.ok || '知道了'
  const handleCancel = options.handleCancel || null
  const handleOk = options.handleOk || null
  const instance = new DialogConstructor({
    data: {
      message,
      cancel,
      ok,
      handleCancel,
      handleOk
    }
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
}

Vue.prototype.$dialog = Dialog

export default Dialog