<template>


  <div>
    <div v-if="staffRole">
      <StaffDashboard />
    </div>
    <div v-else class="container-fluid py-1">
      <h2 class="mb-1">Dashboard Overview</h2>
      <!-- Stat Cards Row -->
      <div class="row ">
        <div class="col-md-4 m">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <img src="https://img.icons8.com/?size=100&id=97612&format=png&color=000000" alt="Total Residence Icon"
                style="width: 40px; height: 40px; margin-bottom: 8px;" />
              <h5 class="card-title mb-1">Total Residence</h5>
              <h2 class="card-text font-weight-bold">{{ records.length }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4 ">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <img src="https://img.icons8.com/?size=100&id=H9pCZtiXHXuz&format=png&color=000000" alt="Total Staff Icon"
                style="width: 40px; height: 40px; margin-bottom: 8px;" />
              <h5 class="card-title mb-1">Total Staff</h5>
              <h2 class="card-text font-weight-bold">{{ total_staff }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4 ">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <img src="https://img.icons8.com/?size=100&id=GCWQkWqtBCgB&format=png&color=000000" alt="Policies Icon"
                style="width: 40px; height: 40px; margin-bottom: 8px;" />
              <h5 class="card-title mb-1">Policies</h5>
              <h2 class="card-text font-weight-bold">{{ total_policies }}</h2>
            </div>
          </div>
        </div>
      </div>
      <!-- Graphs Row -->
      <div class="row ">
        <div class="col-md-7 ">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Overview</h5>
              <AppEchartBar :optionData="barOption" style="height: 220px; width: 100%" />
            </div>
          </div>
        </div>
        <div class="col-md-5 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Resident Status</h5>
              <AppEchartDoughnut :series="donutSeries" style="height: 220px; width: 100%" />
            </div>
          </div>
        </div>
      </div>
      <!-- Notifications & Reminders -->
      <div class="row">
        <div class="col-md-6">
          <h4 class="py-2">Notifications</h4>
          <div v-if="notifications && notifications.length">
            <div v-for="notification in notifications" :key="notification.index" class="card mb-2">
              <div class="card-body">
                <div class="d-flex justify-content-start">
                  <feather-icon class="text-success" icon="BellIcon" size="27" />
                  <div class="c px-2">
                    <h6>{{ notification.subject }} </h6>
                    <p>{{ notification.msg }}</p>
                  </div>
                </div>
                <span style="font-size: 8pt;" class="font-italic float-right">{{ notification.created_at }}</span>
              </div>
            </div>
          </div>
          <div v-else class="card mb-2">
            <div class="card-body">
              <h6>No notifications yet.</h6>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <h4 class="py-2">Reminders</h4>
          <div class="card card text-center">
            <div class="card-body py-5">
              <img src="https://img.icons8.com/?size=100&id=bSQU0ahnukbD&format=png&color=000000"
                alt="No reminders icon" class="mb-3" style="width: 50px; height: 50px;">
              <h6>No reminders yet.</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import AppEchartBar from '@/@core/components/charts/echart/AppEchartBar.vue'
import AppEchartDoughnut from '@/@core/components/charts/echart/AppEchartDoughnut.vue'
import StaffDashboard from './StaffDashboard.vue'

export default {
  components: {
    AppEchartBar,
    AppEchartDoughnut,
    StaffDashboard,
    'feather-icon': () => import('../@core/components/feather-icon/FeatherIcon.vue'),
  },
  data() {
    return {
      staffRole: false,
      notifications: [],
      records: [],
      total_policies: 0,
      total_staff: 0,
    }
  },
  computed: {
    barOption() {
      return {
        grid: { left: 40, right: 20, bottom: 40, top: 30 },
        xAxis: {
          type: 'category',
          data: ['Residence', 'Staff', 'Policies'],
        },
        yAxis: {
          type: 'value',
          min: 0,
        },
        series: [
          {
            name: 'Count',
            type: 'bar',
            data: [this.records.length, this.total_staff, this.total_policies],
            itemStyle: { color: '#007bff' },
            barWidth: '40%',
          },
        ],
      }
    },
    donutSeries() {
      // Example: show Active/Inactive/Other status for residents
      const statusCounts = { Active: 0, Inactive: 0, Other: 0 }
      this.records.forEach(r => {
        if (r.status === 'Active') statusCounts.Active++
        else if (r.status === 'Inactive') statusCounts.Inactive++
        else statusCounts.Other++
      })
      return [
        {
          name: 'Resident Status',
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
            { value: statusCounts.Active, name: 'Active', itemStyle: { color: '#28a745' } },
            { value: statusCounts.Inactive, name: 'Inactive', itemStyle: { color: '#dc3545' } },
            { value: statusCounts.Other, name: 'Other', itemStyle: { color: '#ffc107' } },
          ],
        },
      ]
    },
  },
  mounted() {
    this.checkRole()
    this.getNotifications()
    this.getRecords()
  },
  methods: {

    checkRole() {
      const role = localStorage.getItem('user_role');
      this.staffRole = role === 'staff';
    },
    getNotifications() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/notifications`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        this.notifications = res.data.slice(0, 4)
      }).catch(error => {
        console.log(error)
      })
    },
    getRecords() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/residents-management`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          dashboard: true,
        },
        method: 'get',
      }).then(res => {
        this.records = res.data.residentsRecords
        this.total_policies = res.data.total_policies
        this.total_staff = res.data.total_staff
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>

<style></style>
