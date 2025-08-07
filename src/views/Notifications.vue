<template>
  <div class="container py-5">
    <div class="row justify-content-left">
      <div class="col-lg-7 col-md-9">
      
        <div v-if="notifications.length === 0" class="alert alert-info text-center">
          No notifications found.
        </div>
        <transition-group name="fade" tag="div">
          <div v-for="(notification, index) in paginatedNotifications" :key="`notification-${index}`"
            class="card mb-1 shadow-sm border-0 notification-card">
            <div class="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between">
              <div class="d-flex align-items-center">
                <!-- Optional: remove temporarily to debug -->
                <feather-icon icon="BellIcon" size="28" class="text-success mr-3" />
                <div>
                  <h6 class="mb-1 font-weight-bold">{{ notification.subject }}</h6>
                  <p class="mb-0 text-">{{ notification.msg }}</p>
                </div>
              </div>
              <span class="text-muted small font-italic mt-2 mt-md-0">  {{ formatDate(notification.created_at) }}</span>
            </div>
          </div>
        </transition-group>
        <nav v-if="totalPages > 1" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1">Previous</button>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  components: {},
  data() {
    return {
      notifications: [],
      currentPage: 1,
      pageSize: 6,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.notifications.length / this.pageSize)
    },
    paginatedNotifications() {
      const start = (this.currentPage - 1) * this.pageSize
      const sliced = this.notifications.slice(start, start + this.pageSize)
      console.log('Paginated data:', sliced)
      return sliced
    },
  },
  mounted() {
    this.getNotifications()
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
        this.notifications = res.data

        console.log('Notifications fetched:', res.data)
      }).catch(error => {
        console.log(error)
      })
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short', // Use 'long' for full month name
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
  },
}
</script>

<style scoped>
<style scoped>.notification-card {
  transition: box-shadow 0.2s;
}

.notification-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(.4, 0, .2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
