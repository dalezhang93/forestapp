import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import './directives'

Vue.use(ElementUI)
Vue.config.productionTip = false

if (typeof XE !== 'undefined') {
  // 如果XE存在，说明EarthSDK已载入
  // eslint-disable-next-line no-console
  /* eslint-disable*/
  function startup() {
    new Vue({
      render: h => h(App),
    }).$mount('#app')
  }

  // 1 XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
  XE.ready().then(startup);
} else if (typeof Cesium !== 'undefined') {
  // 如果XE不存在，存在Cesium，则此时用纯Cesium进行开发
  new Vue({
    render: h => h(App),
  }).$mount('#app')
}
