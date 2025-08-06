
<template>
  <div class="containe ">
    <div class="">
      <div class="">
        <!-- Stat Cards Row -->
        <div class="row mb-4">
          <div class="col-md-4 mb-3 mb-md-0">
            <div class="card text-center shadow-sm border-0">
              <div class="card-body">
                <div class="mb-2">
                  <feather-icon icon="UsersIcon" size="32" class="text-primary" />
                </div>
                <h5 class="card-title mb-1">No. Certified</h5>
                <h2 class="card-text font-weight-bold">0</h2>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3 mb-md-0">
            <div class="card text-center shadow-sm border-0">
              <div class="card-body">
                <div class="mb-2">
                  <feather-icon icon="UserXIcon" size="32" class="text-danger" />
                </div>
                <h5 class="card-title mb-1">Non-Certified</h5>
                <h2 class="card-text font-weight-bold">0</h2>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card text-center shadow-sm border-0">
              <div class="card-body">
                <div class="mb-2">
                  <feather-icon icon="BookOpenIcon" size="32" class="text-warning" />
                </div>
                <h5 class="card-title mb-1">In Training</h5>
                <h2 class="card-text font-weight-bold">0</h2>
              </div>
            </div>
          </div>
        </div>
        <!-- Main Table Card -->
        <div class="card shadow-sm mt-4">
          <div class="card-header d-flex align-items-center justify-content-between bg-primary text-white">
            <h4 class="mb-0">Staff Records</h4>
            <button
              v-if="userData && userData.role === 'admin'"
              class="btn btn-success btn-lg"
              @click="$router.push({ name: 'create-record' })"
            >
              <i class="fas fa-user-plus mr-2"></i>
              Add New Staff
            </button>
          </div>
          <div class="card-body mt-5">
            <div class="mb-3">
              <input
                v-model="search"
                type="text"
                class="form-control"
                placeholder="Search Staff"
              />
            </div>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Created On</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="6" class="text-center">Loading staff records...</td>
                  </tr>
                  <tr v-for="(item, idx) in formattedRecords" :key="item.id">
                    <td>{{ idx + 1 }}</td>
                    <td>{{ item.fullname }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.formattedDate }}</td>
                    <td>
                      <span class="badge badge-primary">{{ item.status }}</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary" @click="goToDetails(item.id)">
                        View More
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!loading && filteredRecords.length === 0">
                    <td colspan="6" class="text-center">No staff found.</td>
                  </tr>
                </tbody>
              </table>
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
  name: 'StaffRecords',
  components: {
    'feather-icon': () => import('../@core/components/feather-icon/FeatherIcon.vue'),
  },


  data() {
    return {
      records: [],
      userData: null,
      search: '',
      loading: false,
    }
  },

  mounted() {
    this.userData = JSON.parse(localStorage.getItem('user_data'))
    this.getRecords()
  },

  methods: {
    goToDetails(id) {
      this.$router.push(`/staff-details/${id}`)
    },
    getRecords() {
      this.loading = true
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-records`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'get',
      })
        .then(res => {
          this.records = res.data
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  computed: {
    filteredRecords() {
      if (!this.search) return this.records
      const s = this.search.toLowerCase()
      return this.records.filter(item =>
        (item.fullname && item.fullname.toLowerCase().includes(s)) ||
        (item.email && item.email.toLowerCase().includes(s)) ||
        (item.status && item.status.toLowerCase().includes(s))
      )
    },
    formattedRecords() {
      // Use filteredRecords and format the date
      return this.filteredRecords.map(item => {
        let formattedDate = item.created_at
        if (item.created_at) {
          try {
            const date = new Date(item.created_at)
            formattedDate = isNaN(date.getTime()) ? item.created_at :
              new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }).format(date)
          } catch (e) {
            // fallback to original
          }
        }
        return { ...item, formattedDate }
      })
    },
  },

}
</script>

  <style></style>
