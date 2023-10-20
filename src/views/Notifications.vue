<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-12">

          

          <div v-for="notification in notifications" :key="notification.index" class="card mb-2">
            <div class="card-body">
              <h4>{{notification.subject}} </h4>
              <h6>{{notification.msg}}</h6>
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
    }
  },
  mounted() {
    this.getNotifications()
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
  },
}
</script>

  <style></style>
