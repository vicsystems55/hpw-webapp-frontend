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
import { BarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
use([BarChart, TooltipComponent, LegendComponent, GridComponent])

export default {
  components: {
    'vue-echarts': VueECharts,
  },
  props: {
    optionData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      option: this.buildOption(this.optionData),
    }
  },
  watch: {
    optionData: {
      handler(newVal) {
        this.option = this.buildOption(newVal)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    buildOption(optionData) {
      if (!optionData) return {}
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          left: 0,
        },
        grid: optionData.grid,
        xAxis: optionData.xAxis,
        yAxis: optionData.yAxis,
        series: optionData.series,
      }
    },
  },
}
</script>
