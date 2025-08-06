

<template>
  <div class="container py-5">
    <div class="mb-4 d-flex align-items-center">
      <img :src="course.image" alt="Course Image" class="rounded mr-4" style="width: 90px; height: 90px; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <div>
        <h2 class="mb-1">{{ course.title }}</h2>
        <div class="d-flex align-items-center">
          <div class="mr-3">
            <strong>Duration:</strong> {{ course.duration }}
          </div>
          <div>
            <strong>Course ID:</strong> {{ courseId }}
          </div>
        </div>
      </div>
      <div class="ml-auto">
        <svg width="90" height="90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" stroke="#e9ecef" stroke-width="12" fill="none" />
          <circle
            cx="60" cy="60" r="50"
            :stroke="progressColor"
            stroke-width="12"
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
            stroke-linecap="round"
            transform="rotate(-90 60 60)"
          />
          <text x="60" y="68" text-anchor="middle" font-size="28" fill="#28a745" font-weight="bold">{{ course.completion }}%</text>
        </svg>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <div class="card mb-3">
          <div class="card-body">
            <h4 class="card-title mb-3">{{ activeOutline.title }}</h4>
            <div v-html="activeOutline.body"></div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-header bg-light font-weight-bold">Course Outline</div>
          <ul class="list-group list-group-flush">
            <li
              v-for="(item, idx) in course.outline"
              :key="item.title"
              class="list-group-item list-group-item-action"
              :class="{active: idx === activeOutlineIndex}"
              style="cursor:pointer;"
              @click="activeOutlineIndex = idx"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseDetails',
  props: [{
    id: {
      type: [String, Number],
      required: false
    }
  }],
  data() {
    return {
      activeOutlineIndex: 0,
      courses: [
        {
          id: 1,
          title: 'Basic Patient Care',
          image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80',
          duration: '4 weeks',
          completion: 80,
          outline: [
            { title: 'Introduction', body: '<p>Welcome to Basic Patient Care. This section introduces the course objectives and structure.</p>' },
            { title: 'Patient Hygiene', body: '<p>Learn about maintaining patient hygiene and comfort.</p>' },
            { title: 'Vital Signs Monitoring', body: '<p>How to monitor and record patient vital signs accurately.</p>' },
            { title: 'Compassionate Communication', body: '<p>Effective communication with patients and families.</p>' },
          ]
        },
        {
          id: 2,
          title: 'Medical Records Management',
          image: 'https://images.unsplash.com/photo-1519494080410-f9aa8f0dfb2c?auto=format&fit=crop&w=400&q=80',
          duration: '3 weeks',
          completion: 60,
          outline: [
            { title: 'Overview', body: '<p>Introduction to medical records and their importance.</p>' },
            { title: 'Data Entry', body: '<p>Best practices for accurate data entry.</p>' },
            { title: 'Confidentiality', body: '<p>Maintaining patient confidentiality and data security.</p>' },
          ]
        },
        // ...add more courses as needed...
      ]
    }
  },
  computed: {
    courseId() {
      return this.id || this.$route.params.id
    },
    course() {
      // Find course by id (string/number)
      return this.courses.find(c => String(c.id) === String(this.courseId)) || {
        title: 'Course Not Found',
        image: '',
        duration: '',
        completion: 0,
        outline: [{ title: 'No Outline', body: '<p>No content available.</p>' }]
      }
    },
    activeOutline() {
      return this.course.outline[this.activeOutlineIndex] || { title: '', body: '' }
    },
    circumference() {
      return 2 * Math.PI * 50
    },
    progressOffset() {
      return this.circumference * (1 - (this.course.completion || 0) / 100)
    },
    progressColor() {
      return this.course.completion >= 80 ? '#28a745' : (this.course.completion >= 50 ? '#ffc107' : '#dc3545')
    }
  }
}
</script>
