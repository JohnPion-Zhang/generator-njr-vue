import Vue from 'vue'
import Main from './main.vue'
let ToastConstructor = Vue.extend(Main)

const Toast = message => {
  const options = {
    message: message
  } || {}
  // 如果是直接字符串，那直接赋值给message就好了
  // 实例化
  const instance = new ToastConstructor({
    data: options
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
}

Vue.prototype.$toast = Toast

export default Toast