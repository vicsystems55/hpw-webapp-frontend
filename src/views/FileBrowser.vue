<template>
    <div class="container">
    <div class="row">
        <div class="col-md-6">

        </div>
        <div class="col-md-6">
            
        </div>
    </div>
    </div>
</template>

<script>
/* eslint-disable global-require */
import axios from 'axios'
import { BCol } from 'bootstrap-vue'
import StatisticCardVertical from '@core/components/statistics-cards/StatisticCardVertical.vue'
import ApexDonutChart from './charts-and-maps/charts/apex-chart/ApexDonutChart.vue'

export default {
  components: {

    BCol,
    ApexDonutChart,
    StatisticCardVertical,
  },

  data() {
    return {
      status: '',
      name: '',
      password: '',
      userEmail: '',
      loading: false,
      email_error: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),
      // validation rulesimport store from '@/store/index'

    }
  },
  computed: {

  },
  methods: {

  },
}
</script>
