<template>
  <div>
    <div>

    <div
      class="container"
    >
      <div class="row">
        <div class="col-md-4">
          <a :href="'/residence-management'">
            <div
              style="height: 120px;"
              class="card border border-primary"
            >
              <div class="card-body">
                <h4>Total Residence</h4>
                <h2>{{ records.length }}</h2>

              </div>
            </div>
          </a>
        </div>

        <div class="col-md-4">
          <a :href="'/staff-records'">
            <div
              style="height: 120px;"
              class="card border border-warning"
            >
              <div class="card-body">
                <h4>Total Staff</h4>
                <h2>{{ total_staff }}</h2>

              </div>
            </div>
          </a>
        </div>
        <div class="col-md-4">
          <a :href="'/policies'">

            <div
              style="height: 120px;"
              class="card border border-success"
            >
              <div class="card-body">
                <h4>Policies</h4>
                <h2>{{ total_policies }}</h2>

              </div>
            </div>
          </a>
        </div>
      </div>

    </div>
  </div>

  <hr>

  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h4 class="py-2">
          Notifications
        </h4>

        <div v-if="notifications">

          <div
            v-for="notification in notifications"
            :key="notification.index"
            class="card mb-2"
          >
            <div class="card-body">
              <div class="d-flex justify-content-start">
                <feather-icon
                  class="text-success"
                  icon="BellIcon"
                  size="27"
                />
                <div class="c px-2">
                  <h6>{{ notification.subject }} </h6>
                  <p>{{ notification.msg }}</p>
                </div>

              </div>

              <hr>
              <span
                style="font-size: 8pt;"
                class="font-italic float-right"
              >{{ notification.created_at }}</span>
            </div>
          </div>
        </div>
        <div
          v-else
          class="card mb-2"
        >
          <div class="card-body">

            <h6>No notifications yet.</h6>
          </div>
        </div>

      </div>
      <div class="col-md-6">
        <h4 class="py-2">
          Reminders
        </h4>

        <div class="card card">
          <h6 class="text-center py-5">No reminders yet.</h6>
        </div>
      </div>
    </div>
  </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  components: {

  },
  data() {
    return {
      notifications: [],
      records: [],
      total_policies: 0,
      total_staff: 0,

    }
  },

  mounted() {
    this.getNotifications()
    this.getRecords()
  },

  methods: {

    dashCardLink(routeName) {
      this.$router.push('/some-route')
    },

    getNotifications() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/notifications`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res)
        this.notifications = res.data

        this.notifications = this.notifications.slice(0, 4)
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
        params:{
          dashboard: true,
        },
        method: 'get',
      }).then(res => {
        console.log(res.data.residentsRecords)
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
