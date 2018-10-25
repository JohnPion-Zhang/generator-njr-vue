import 'babel-polyfill' // https://babeljs.io/docs/plugins/preset-env/#usebuiltins
import 'common/scss/index'
import Vue from 'vue'
import './plugins'
import './componentsBase'
import './components'
import router from './router'
import App from './app'
import 'filters'
import 'directives'
<% if (includeVuex) { -%>
import store from './store'
<% } -%>

new Vue({
  el: '#app',
  router,
<% if (includeVuex) { -%>
  store,
<% } -%>
  render: createElement => createElement(App)
})