
<template>
  <div class="container py-5">
    <h2 class="mb-4">My Performance</h2>
    <!-- Stat Cards -->
    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Courses Taken</h5>
            <h2 class="text-primary">{{ stats.taken }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Courses Pending</h5>
            <h2 class="text-warning">{{ stats.pending }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Success Rate</h5>
            <h2 class="text-success">{{ stats.successRate }}%</h2>
          </div>
        </div>
      </div>
    </div>
    <!-- Progress Bar & Donut Chart -->
    <div class="row mb-4">
      <div class="col-md-8 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Overall Completion</h5>
            <div class="progress" style="height: 24px;">
              <div class="progress-bar bg-success" role="progressbar" :style="'width: ' + stats.successRate + '%'" :aria-valuenow="stats.successRate" aria-valuemin="0" aria-valuemax="100">
                {{ stats.successRate }}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Course Status</h5>
            <AppEchartDoughnut :series="donutSeries" style="height: 180px; width: 100%" />
          </div>
        </div>
      </div>
    </div>
    <!-- Recent Courses Table -->
    <div class="card mt-4">
      <div class="card-body">
        <h5 class="card-title mb-3">Recent Courses</h5>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="thead-light">
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Status</th>
                <th>Score</th>
                <th>Completed On</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(course, idx) in recentCourses" :key="course.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ course.title }}</td>
                <td>
                  <span :class="['badge', course.status === 'Completed' ? 'badge-success' : 'badge-warning']">{{ course.status }}</span>
                </td>
                <td>{{ course.score ? course.score + '%' : '-' }}</td>
                <td>{{ course.completedOn || '-' }}</td>
              </tr>
              <tr v-if="recentCourses.length === 0">
                <td colspan="5" class="text-center">No courses found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import AppEchartDoughnut from '@/@core/components/charts/echart/AppEchartDoughnut.vue'

export default {
  name: 'MyPerformance',
  components: {
    AppEchartDoughnut,
  },
  data() {
    return {
      stats: {
        taken: 7,
        pending: 2,
        successRate: 86,
      },
      recentCourses: [
        { id: 1, title: 'Basic Patient Care', status: 'Completed', score: 92, completedOn: '2025-07-10' },
        { id: 2, title: 'Medical Records Management', status: 'Completed', score: 85, completedOn: '2025-06-28' },
        { id: 3, title: 'Infection Control', status: 'Pending', score: null, completedOn: null },
        { id: 4, title: 'HR Management', status: 'Completed', score: 80, completedOn: '2025-05-15' },
        { id: 5, title: 'Workplace Safety', status: 'Pending', score: null, completedOn: null },
      ],
    }
  },
  computed: {
    donutSeries() {
      const completed = this.recentCourses.filter(c => c.status === 'Completed').length
      const pending = this.recentCourses.filter(c => c.status === 'Pending').length
      return [
        {
          name: 'Course Status',
          type: 'pie',
          radius: ['50%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c} ({d}%)',
          },
          labelLine: { show: true },
          data: [
            { value: completed, name: 'Completed', itemStyle: { color: '#28a745' } },
            { value: pending, name: 'Pending', itemStyle: { color: '#ffc107' } },
          ],
        },
      ]
    },
  },
}
</script>
