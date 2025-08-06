
<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">All Courses</h2>
      <div class="w-50">
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Search courses..."
        />
      </div>
    </div>
    <div class="row">
      <div
        v-for="course in paginatedCourses"
        :key="course.id"
        class="col-md-4 mb-4"
      >
        <div class="card shadow-sm" style="height: 450px;">
          <div style="padding: 12px 12px 0 12px;">
            <img
              :src="course.image"
              class="card-img-top rounded"
              :alt="course.title"
              style="height: 230px; object-fit: cover; width: 100%; box-shadow: 0 2px 8px rgba(0,0,0,0.03);"
            >
          </div>
          <div class="card-body d-flex flex-column pt-2 pb-2" style="line-height: 1.2;">
            <h5 class="card-title mb-2" style="font-size: 1.1rem; line-height: 1.2;">{{ course.title }}</h5>
            <div class="d-flex align-items-center justify-content-between mb-2" style="gap: 8px;">
              <div class="d-flex align-items-center">
                <img src="/logo.png" alt="App Logo" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; margin-right: 6px;">
                <small class="text-muted">Created by HopePathway</small>
              </div>
              <div class="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-info mr-1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <small>{{ course.duration }}</small>
              </div>
            </div>
            <div class="">
              <div class="progress" style="height: 7px;">
                <div class="progress-bar bg-success" role="progressbar" :style="'width: ' + course.completion + '%'" :aria-valuenow="course.completion" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <small class="text-muted">{{ course.completion }}% completed</small>
            </div>
            <!-- <p class="card-text flex-grow-1 mb-1" style="font-size: 0.97rem; line-height: 1.3;">{{ course.description }}</p> -->
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
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
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
export default {
  name: 'AllCourses',
  data() {
    return {
      search: '',
      currentPage: 1,
      perPage: 6,
      courses: [
        {
          id: 1,
          title: 'Basic Patient Care',
          description: 'Learn essential skills for providing compassionate and effective patient care in healthcare settings.',
          image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80',
          duration: '4 weeks',
          completion: 80,
        },
        {
          id: 2,
          title: 'Medical Records Management',
          description: 'Understand the principles and best practices for managing patient records and health information.',
          image: 'https://images.unsplash.com/photo-1519494080410-f9aa8f0dfb2c?auto=format&fit=crop&w=400&q=80',
          duration: '3 weeks',
          completion: 60,
        },
        {
          id: 3,
          title: 'Infection Control & Prevention',
          description: 'Master the protocols and techniques to prevent and control infections in healthcare environments.',
          image: 'https://images.unsplash.com/photo-1588776814546-ec7e3b2c2b1b?auto=format&fit=crop&w=400&q=80',
          duration: '2 weeks',
          completion: 40,
        },
        {
          id: 4,
          title: 'Human Resource Management in Healthcare',
          description: 'Explore HR strategies, recruitment, and staff development tailored for healthcare organizations.',
          image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
          duration: '5 weeks',
          completion: 90,
        },
        {
          id: 5,
          title: 'Workplace Safety & Compliance',
          description: 'Ensure a safe and compliant workplace for healthcare professionals and patients.',
          image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
          duration: '3 weeks',
          completion: 50,
        },
        {
          id: 6,
          title: 'Effective Communication in Healthcare',
          description: 'Develop strong communication skills for interacting with patients, families, and colleagues.',
          image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
          duration: '2 weeks',
          completion: 30,
        },
        {
          id: 7,
          title: 'Leadership for Healthcare Supervisors',
          description: 'Build leadership and management skills for supervisors in healthcare and HR roles.',
          image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
          duration: '6 weeks',
          completion: 70,
        },
        {
          id: 8,
          title: 'Mental Health Awareness',
          description: 'Recognize and support mental health needs among patients and staff in healthcare settings.',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
          duration: '2 weeks',
          completion: 20,
        },
        {
          id: 9,
          title: 'Conflict Resolution in the Workplace',
          description: 'Learn techniques for resolving conflicts and fostering a positive work environment in healthcare and HR.',
          image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
          duration: '3 weeks',
          completion: 10,
        },
      ],
    }
  },
  computed: {
    filteredCourses() {
      if (!this.search) return this.courses
      const s = this.search.toLowerCase()
      return this.courses.filter(course =>
        course.title.toLowerCase().includes(s) ||
        course.description.toLowerCase().includes(s)
      )
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
  },
}
</script>
