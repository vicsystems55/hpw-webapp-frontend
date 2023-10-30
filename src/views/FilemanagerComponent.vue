<template>
  <div class="container">
    <div class="row match-height">
      <div class="col-md-6">
        <h6>Storage Overview</h6>
        <hr>

        <apex-donut-chart />
      </div>
      <div class="col-md-6">
        <h6>Quick Links</h6>
        <hr>
        <div class="row">
            <div class="col-md-6">
            <statistic-card-vertical
            class=""
              color="primary"
              icon="HeartIcon"
              statistic="26.8"
              statistic-title="Images"
            />
            </div>
            <div class="col-md-6">
            <statistic-card-vertical
            class=""
              color="primary"
              icon="HeartIcon"
              statistic="26.8"
              statistic-title="Videos"
            />
            </div>
            <div class="col-md-6">
               <statistic-card-vertical
               class=""
              color="primary"
              icon="HeartIcon"
              statistic="26.8"
              statistic-title="Documents"
            />
            </div>
            <div class="col-md-6">
            <statistic-card-vertical
            class=""
              color="primary"
              icon="HeartIcon"
              statistic="26.8"
              statistic-title="Others"
            />
            </div>


        </div>

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
