<template>
  <div class="container">
    <div class="row">
      <div class="col-md-5">

        <div class="card card-body">
          <ul>
            <li>Root

              <ul>
                <li>Documents</li>
              </ul>
            </li>

          </ul>

        </div>

      </div>
      <div class="col-md-7">

        <div class="card card-body">

          <div class="d-flex flex-wrap justify-content-start">
            <div class="fo p-1">
              <img
                width="94"
                height="94"
                src="https://img.icons8.com/3d-fluency/94/folder-invoices--v2.png"
                alt="folder-invoices--v2"
              >
              <br>
              <span class="text-center">Documents</span>
            </div>

            <div class="fo p-1">
              <img
                width="94"
                height="94"
                src="https://img.icons8.com/3d-fluency/94/folder-invoices--v2.png"
                alt="folder-invoices--v2"
              >
              <br>
              <span class="text-center">Documents</span>
            </div>

            <div class="fo p-1">
              <img
                width="94"
                height="94"
                src="https://img.icons8.com/3d-fluency/94/folder-invoices--v2.png"
                alt="folder-invoices--v2"
              >
              <br>
              <span class="text-center">Documents</span>
            </div>

            <div class="fo p-1">
              <img
                width="94"
                height="94"
                src="https://img.icons8.com/3d-fluency/94/folder-invoices--v2.png"
                alt="folder-invoices--v2"
              >
              <br>
              <span class="text-center">Documents</span>
            </div>
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
