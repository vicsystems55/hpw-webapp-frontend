<template>
  <div class="container">

    <!-- Stat Cards -->
    <div class="row">
      <div class="col-md-4">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Courses Taken</h5>
            <h2 class="text-primary">{{ stats.taken }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Courses Pending</h5>
            <h2 class="text-warning">{{ stats.pending }}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
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
 <div class="col-md-8">
  <div class="card h-100 shadow-sm border-0">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="card-title mb-0">Overall Completion</h5>
        <i class="fas fa-chart-line text-success" style="font-size: 1.5rem;"></i>
      </div>

      <!-- Animated Progress -->
      <div class="progress mb-4" style="height: 28px; border-radius: 20px; overflow: hidden;">
        <div
          class="progress-bar bg-success progress-bar-striped progress-bar-animated"
          role="progressbar"
          :style="'width: ' + stats.successRate + '%'"
          :aria-valuenow="stats.successRate"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {{ stats.successRate }}%
        </div>
      </div>

      <!-- Stats Row -->
      <div class="row text-center">
        <div class="col">
          <h6 class="text-muted">Completed</h6>
          <h4 class="text-success">{{ stats.completed }}</h4>
        </div>
        <div class="col">
          <h6 class="text-muted">Pending</h6>
          <h4 class="text-warning">{{ stats.pending }}</h4>
        </div>
        <div class="col">
          <h6 class="text-muted">Average Grade</h6>
          <h4 class="text-primary">{{ stats.averageGrade }}%</h4>
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
    <div class="card">
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
                <th>Certificate</th>
                <th>Completed On</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(course, idx) in recentCourses" :key="course.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ course.course.title }}</td>
                <td>
                  <span :class="['badge', course.completion_status === 'completed' ? 'badge-success' : 'badge-warning']">
                    {{ course.completion_status }}
                  </span>
                </td>
                <td>{{ course.total_score }}/{{ course.expected_score }}</td>
                <td>
                  <span
                    :class="['badge',
                      course.certificate_status === 'issued'
                        ? 'badge-success'
                        : 'badge-secondary']">
                    {{ course.certificate_status }}
                  </span>
                </td>
                <td>{{ formatDate(course.created_at) }}</td>
              </tr>
              <tr v-if="recentCourses.length === 0">
                <td colspan="6" class="text-center">No performances found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import AppEchartDoughnut from '@/@core/components/charts/echart/AppEchartDoughnut.vue'

export default {
  name: 'MyPerformance',
  components: {
    AppEchartDoughnut,
  },
  data() {
    return {
      backendUrl: process.env.VUE_APP_BACKEND_URL,
      stats: {
        taken: 7,
        completed: 5,
        pending: 2,
        successRate: 86,
        averageGrade: 82,
      },
      recentCourses: [],
    }
  },
  computed: {
    donutSeries() {
      const completed = this.recentCourses.filter(c => c.completion_status === 'completed').length
      const pending = this.recentCourses.filter(c => c.completion_status !== 'completed').length
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
  methods: {
    async fetchPerformances() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${this.backendUrl}/api/my-performances`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.recentCourses = response.data.data || []

        // console.log('Fetched performances:', this.recentCourses)

        // Calculate stats
        this.stats.taken = this.recentCourses.length
        this.stats.pending = this.recentCourses.filter(c => c.completion_status !== 'completed').length
        const completed = this.recentCourses.filter(c => c.completion_status === 'completed').length
        this.stats.successRate = this.stats.taken > 0 ? Math.round((completed / this.stats.taken) * 100) : 0
      } catch (error) {
        console.error('Error fetching performances:', error)
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString()
    },
  },
  mounted() {
    this.fetchPerformances()
  },
}
</script>
