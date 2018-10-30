import Vue from 'vue'
<% if (!isPc) { -%>
import './responsive'
import './fastclick'
import './vue-lazyload'
import './toast'
import './dialog'
import device from './device'
<% } -%>
if (process.env.NODE_ENV !== 'production') {
  import('./mock-switch')
}
import ajax from './ajax'
<% if (includeElementUI) { -%>
import elementUI from './element-ui'
<% } -%>
<% if (includeHubble) { -%>
import hubble from './hubble'
<% } -%>
<% if (includeHybrid) { -%>
import hybrid from './hybrid'
<% } -%>
<% if (includeWechat) { -%>
import wechat from './wechat'
<% } -%>

// vue use插件
Vue.use(ajax)
<% if (!isPc) { -%>
Vue.use(device)
<% } -%>
<% if (includeElementUI) { -%>
Vue.use(elementUI)
<% } -%>
<% if (includeHubble) { -%>
Vue.use(hubble)
<% } -%>
<% if (includeHybrid) { -%>
Vue.use(hybrid)
<% } -%>
<% if (includeWechat) { -%>
Vue.use(wechat)
<% } -%>