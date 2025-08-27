import { CanvasRenderer } from 'echarts/renderers'
import * as echarts from 'echarts/core'
import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import VueGoodTablePlugin from 'vue-good-table'
import ImageResize from 'quill-image-resize-module-react'
import Quill from 'quill'
import router from './router'
import store from './store'
import App from './App.vue'
import 'vue-good-table/dist/vue-good-table.css'
import './global-components'
import '@/libs/portal-vue'
import '@/libs/toastification'


Quill.register('modules/imageResize', ImageResize)

Vue.use(VueGoodTablePlugin)
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
echarts.use([CanvasRenderer])
Vue.use(VueCompositionAPI)
require('@core/scss/core.scss')
require('@/assets/scss/style.scss')
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
