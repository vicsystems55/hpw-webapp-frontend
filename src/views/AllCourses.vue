<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">All Courses</h2>
      <div class="d-flex w-50" style="gap: 10px;">
        <!-- Search box -->
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Search courses..."
        />

        <!-- Category filter -->
        <select v-model="selectedCategory" class="form-control">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <div class="row">
      <div v-for="course in paginatedCourses" :key="course.id" class="col-md-4 mb-4">
        <div class="card shadow-sm" style="height: 450px;">
          <div style="padding: 12px 12px 0 12px;">
            <img
              :src="imageUrl(course.feature_image)"
              class="card-img-top rounded"
              :alt="course.title"
              style="height: 230px; object-fit: cover; width: 100%; box-shadow: 0 2px 8px rgba(0,0,0,0.03);"
            >
          </div>
          <div class="card-body d-flex flex-column pt-2 pb-2" style="line-height: 1.2;">
            <h5 class="card-title mb-2" style="font-size: 1.1rem; line-height: 1.2;">{{ course.title }}</h5>
            <div class="d-flex align-items-center justify-content-between mb-2" style="gap: 8px;">
              <div class="d-flex align-items-center">
                <img src="/logo.png" alt="App Logo"
                  style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; margin-right: 6px;">
                <small class="text-muted">Created by HopePathway</small>
              </div>
              <div class="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" class="text-info mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <small>{{ course.duration }}</small>
              </div>
            </div>
            <div class="">
              <div class="progress" style="height: 7px;">
                <div class="progress-bar bg-success" role="progressbar" :style="'width: ' + course.completion + '%'"
                  :aria-valuenow="course.completion" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <small class="text-muted">{{ course.completion }}% completed</small>
            </div>
            <button class="btn btn-primary mt-2" @click="goToCourseDetails(course.id)">View Details</button>
          </div>
        </div>
      </div>
      <div v-if="paginatedCourses.length === 0" class="col-12 text-center py-5">
        <h5>No courses found.</h5>
      </div>
    </div>

    <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage" :disabled="currentPage === 1">Previous</button>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AllCourses',
  data() {
    return {
      search: '',
      selectedCategory: '', // <-- NEW
      currentPage: 1,
      perPage: 6,
      courses: [],
      loading: false,
      error: null,
    }
  },
  computed: {
    categories() {
      // unique categories list
      const cats = this.courses.map(c => c.category).filter(Boolean)
      return [...new Set(cats)]
    },
    filteredCourses() {
      let filtered = this.courses

      // search filter
      if (this.search) {
        const s = this.search.toLowerCase()
        filtered = filtered.filter(course =>
          course.title.toLowerCase().includes(s) ||
          (course.short_description || '').toLowerCase().includes(s)
        )
      }

      // category filter
      if (this.selectedCategory) {
        filtered = filtered.filter(course => course.category === this.selectedCategory)
      }

      return filtered
    },
    totalPages() {
      return Math.ceil(this.filteredCourses.length / this.perPage)
    },
    paginatedCourses() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredCourses.slice(start, start + this.perPage)
    },
  },
  methods: {
    imageUrl(path) {
      return `${process.env.VUE_APP_BACKEND_URL}/${path}`
    },
    async fetchCourses() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(
          `${process.env.VUE_APP_BACKEND_URL}/api/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        this.courses = res.data || []
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load courses.'
      } finally {
        this.loading = false
      }
    },
    goToPage(page) {
      this.currentPage = page
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    goToCourseDetails(id) {
      this.$router.push({ name: 'course-details', params: { id } })
    },
  },
  watch: {
    search() {
      this.currentPage = 1
    },
    selectedCategory() {
      this.currentPage = 1 // reset pagination when category changes
    }
  },
  mounted() {
    this.fetchCourses()
  },
}
</script>
