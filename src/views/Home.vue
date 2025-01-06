<template>
  <div>
    <div>

      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <a :href="'/residence-management'">
              <div style="height: 100px; padding: 10px;" class="card border border-primary d-flex ">
                <div class="d-flex justify-content-between ">
                  <!-- Add the image/icon -->

                  <div class="">
                    <h1>{{ records.length }}</h1>
                    <h6>Total Residence</h6>
                  </div>
                  <img src="https://img.icons8.com/?size=100&id=97612&format=png&color=000000"
                    alt="Total Residence Icon" style="width: 60px; height: 60px; margin-right: 10px;" />
                </div>
              </div>

            </a>
          </div>

          <div class="col-md-4">
            <a :href="'/staff-records'">
              <div style="height: 100px; padding: 10px;" class="card border border-warning d-flex ">
                <div class="d-flex justify-content-between ">
                  <!-- Add the image/icon -->

                  <div class="">
                    <h1>{{ total_staff }}</h1>
                    <h6>Total Staff</h6>
                  </div>
                  <img src="https://img.icons8.com/?size=100&id=H9pCZtiXHXuz&format=png&color=000000"
                    alt="Total Residence Icon" style="width: 60px; height: 60px; margin-right: 10px;" />
                </div>
              </div>
            </a>
          </div>
          <div class="col-md-4">
            <a :href="'/policies'">

              <div style="height: 100px; padding: 10px;" class="card border border-success d-flex ">
                <div class="d-flex justify-content-between ">
                  <!-- Add the image/icon -->

                  <div class="">
                    <h1 class="font-weight-bold">{{ total_policies }}</h1>
                    <h6>Policies</h6>
                  </div>
                  <img src="https://img.icons8.com/?size=100&id=GCWQkWqtBCgB&format=png&color=000000"
                    alt="Total Residence Icon" style="width: 60px; height: 60px; margin-right: 10px;" />
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

            <div v-for="notification in notifications" :key="notification.index" class="car ">
              <div class="card-body">
                <div class="d-flex justify-content-start">
                  <feather-icon class="text-success" icon="BellIcon" size="27" />
                  <div class="c px-2">
                    <h6>{{ notification.subject }} </h6>
                    <p>{{ notification.msg }}</p>
                  </div>

                </div>

                <span style="font-size: 8pt;" class="font-italic float-right">{{ notification.created_at }}</span>
                <hr>
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
          <h4 class="py-2">
            Reminders
          </h4>

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
        params: {
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
