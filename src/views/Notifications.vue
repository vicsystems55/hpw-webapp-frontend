<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-6">

          

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
