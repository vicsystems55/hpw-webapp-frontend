// ECharts renderer registration for vue-echarts v6+
import { CanvasRenderer } from 'echarts/renderers'
import * as echarts from 'echarts/core'

import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import VueGoodTablePlugin from 'vue-good-table'

import router from './router'
import store from './store'
import App from './App.vue'

// import the styles
import 'vue-good-table/dist/vue-good-table.css'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

// BSV Plugin Registration

Vue.use(VueGoodTablePlugin)

Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
echarts.use([CanvasRenderer])

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
