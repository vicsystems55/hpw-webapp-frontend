
<template>
  <div class="container ">
    <!-- Stat Cards -->
    <div class="row ">
      <div class="col-md-4 ">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Enrolled</h5>
            <h2 class="text-primary">{{ stats.enrolled }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4 ">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Completed</h5>
            <h2 class="text-success">{{ stats.completed }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4 ">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">In Progress</h5>
            <h2 class="text-warning">{{ stats.inProgress }}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-7 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Course Completion Rate</h5>
            <AppEchartBar :optionData="barOption" style="height: 250px; width: 100%" />
          </div>
        </div>
      </div>
      <div class="col-md-5 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Category Distribution</h5>
            <AppEchartDoughnut :series="pieSeries" style="height: 250px; width: 100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppEchartBar from '@/@core/components/charts/echart/AppEchartBar.vue'
import AppEchartDoughnut from '@/@core/components/charts/echart/AppEchartDoughnut.vue'

export default {
  name: 'CourseAnalytics',
  components: {
    AppEchartBar,
    AppEchartDoughnut,
  },
  data() {
    return {
      stats: {
        enrolled: 120,
        completed: 75,
        inProgress: 45,
      },
      completionData: [
        { course: 'Basic Patient Care', completed: 80 },
        { course: 'Medical Records', completed: 60 },
        { course: 'Infection Control', completed: 40 },
        { course: 'HR Management', completed: 90 },
        { course: 'Workplace Safety', completed: 50 },
      ],
      categoryData: [
        { category: 'Healthcare', count: 3 },
        { category: 'HR', count: 1 },
        { category: 'Safety', count: 1 },
      ],
    }
  },
  computed: {
    barOption() {
      return {
        grid: { left: 40, right: 20, bottom: 40, top: 30 },
        xAxis: {
          type: 'category',
          data: this.completionData.map(c => c.course),
          axisLabel: { rotate: 20 },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
        },
        series: [
          {
            name: 'Completion %',
            type: 'bar',
            data: this.completionData.map(c => c.completed),
            itemStyle: { color: '#007bff' },
            barWidth: '40%',
          },
        ],
      }
    },
    pieSeries() {
      return [
        {
          name: 'Categories',
          type: 'pie',
          radius: ['50%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c} ({d}%)',
          },
          labelLine: { show: true },
          data: this.categoryData.map((c, i) => ({
            value: c.count,
            name: c.category,
            itemStyle: { color: ['#28a745', '#ffc107', '#17a2b8'][i] },
          })),
        },
      ]
    },
  },
}
</script>
