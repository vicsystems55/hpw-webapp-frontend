<template>
  <vue-echarts
    ref="line"
    :option="option"
    theme="theme-color"
    autoresize
    style="width: 100%; height: 100%;"
  />
</template>

<script>


import VueECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
use([PieChart, TooltipComponent, LegendComponent])

export default {
  components: {
    'vue-echarts': VueECharts,
  },
  props: {
    series: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      option: this.buildOption(this.series),
    }
  },
  watch: {
    series: {
      handler(newVal) {
        this.option = this.buildOption(newVal)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    buildOption(series) {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          left: 10,
          bottom: '0',
        },
        series: series,
      }
    },
  },
}
</script>
