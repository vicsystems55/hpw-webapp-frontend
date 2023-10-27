<template>
  <div>

    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h4>Total Registrations</h4>
              <h5>{{ records.length}}</h5>

            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h4>Total Missing</h4>
              <h5>0</h5>

            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h4 class="py-2">Notifications</h4>

          <div v-if="notifications">

            <div v-for="notification in notifications" :key="notification.index" class="card mb-2">
            <div class="card-body">
              <div class="d-flex justify-content-start">
                <feather-icon class="text-success"
              icon="BellIcon"
              size="27"
            />
            <div class="c px-2">
              <h4>{{notification.subject}} </h4>
              <h6>{{notification.msg}}</h6>
            </div>

              </div>


              <hr>
              <span class="font-italic float-right">{{ notification.created_at }}</span>
            </div>
          </div>
          </div>
          <div v-else class="card mb-2">
            <div class="card-body">
         
              <h6>No notifications yet.</h6>
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
      records: []
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
        headers:{
          'Authorization': 'Bearer '+localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res)
        this.notifications = res.data
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
        method: 'get',
      }).then(res => {
        console.log(res)
        this.records = res.data
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>

<style></style>
