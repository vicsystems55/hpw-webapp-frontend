<template>
  <div class="container py-2">
    <div class="card mx-auto" style="max-width: 800px;">
      <div class="card-body">
    
        <!-- Stepper Navigation -->
        <ul class="nav nav-pills mb-4 justify-content-center">
          <li class="nav-item" v-for="(step, idx) in steps" :key="step">
            <a class="nav-link" :class="{ active: currentStep === idx }" href="#" @click.prevent="goToStep(idx)">
              {{ idx + 1 }}. {{ step }}
            </a>
          </li>
        </ul>

        <!-- Step 1: Course Basics -->
        <div v-if="currentStep === 0">
          <div class="form-group">
            <label>Title</label>
            <input v-model="course.title" type="text" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="course.description" class="form-control" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label>Created By</label>
            <input v-model="course.createdBy" type="text" class="form-control">
          </div>
          <div class="form-group">
            <label>Featured Image</label>
            <div class="d-flex align-items-center">
              <div class="image-upload-area mr-3" @click="triggerImageInput" style="cursor:pointer;">
                <div v-if="course.featuredImageUrl">
                  <img :src="course.featuredImageUrl" alt="Featured Preview"
                    style="width: 120px; height: 90px; object-fit: cover; border-radius: 8px; border: 2px solid #007bff; box-shadow: 0 2px 8px #e3e3e3;" />
                </div>
                <div v-else class="d-flex flex-column align-items-center justify-content-center"
                  style="width: 120px; height: 90px; border: 2px dashed #007bff; border-radius: 8px; background: #f8f9fa;">
                  <img src="https://img.icons8.com/ios-filled/50/007bff/picture.png" alt="Upload"
                    style="width: 36px; height: 36px; opacity: 0.7;" />
                  <small class="text-muted">Click to upload</small>
                </div>
              </div>
              <input ref="imageInput" type="file" class="d-none" accept="image/*" @change="onImageChange">
              <div>
                <small class="text-muted">Recommended: 800x600px, JPG/PNG, &lt; 1MB</small>
                <div v-if="imageError" class="text-danger small mt-1">{{ imageError }}</div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label>Level</label>
              <select v-model="course.level" class="form-control">
                <option value="">Select Level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div class="form-group col-md-6">
              <label>Category</label>
              <input v-model="course.category" type="text" class="form-control">
            </div>
          </div>
          <div class="form-group">
            <label>Duration</label>
            <input v-model="course.duration" type="text" class="form-control" placeholder="e.g. 4 weeks">
          </div>
        </div>

        <!-- Step 2: Course Outline -->
        <CourseOutlineStep
          v-if="currentStep === 1"
          :outline="course.outline"
          :quillOptions="quillOptions"
          @add-outline-section="addOutlineSection"
          @remove-outline-section="removeOutlineSection"
        />

        <!-- Step 3: Quiz -->
        <div v-if="currentStep === 2">
          <div class="mb-3">
            <button class="btn btn-outline-primary btn-sm" @click="addQuiz">+ Add Quiz Question</button>
          </div>
          <div v-for="(quiz, idx) in course.quiz" :key="idx" class="card mb-2">
            <div class="card-body">
              <div class="form-group">
                <label>Question</label>
                <input v-model="quiz.question" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Options</label>
                <div v-for="(option, oidx) in quiz.options" :key="oidx" class="input-group mb-1">
                  <input v-model="quiz.options[oidx]" type="text" class="form-control"
                    :placeholder="'Option ' + (oidx + 1)">
                  <div class="input-group-append">
                    <div class="input-group-text">
                      <input type="radio" :name="'correct' + idx" v-model="quiz.correct" :value="oidx">
                    </div>
                    <button class="btn btn-danger btn-sm" @click="removeQuizOption(idx, oidx)">&times;</button>
                  </div>
                </div>
                <button class="btn btn-outline-secondary btn-sm" @click="addQuizOption(idx)">+ Add Option</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stepper Controls -->
        <div class="d-flex justify-content-between mt-4">
          <button class="btn btn-secondary" :disabled="currentStep === 0" @click="prevStep">Previous</button>
          <button class="btn btn-primary" v-if="currentStep < steps.length - 1" @click="nextStep">Next</button>
          <button class="btn btn-success" v-else @click="submitCourse">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// Correct import for Vue 2

import CourseOutlineStep from './CourseOutlineStep.vue'

export default {
  name: 'CreateCourse',
  data() {
    return {
      currentStep: 0,
      steps: ['Course Basics', 'Course Outline', 'Quiz'],
      course: {
        title: '',
        description: '',
        createdBy: '',
        level: '',
        category: '',
        duration: '',
        outline: [],
        quiz: [],
        featuredImage: null,
        featuredImageUrl: '',
        id: null, // Store course id for later use
      },
      imageError: '',
      quillOptions: {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      },
    }
  },
  components: {
    CourseOutlineStep,
  },
  methods: {
    goToStep(idx) {
      this.currentStep = idx
    },
    async nextStep() {
      if (this.currentStep === 0) {
        // Prepare FormData for API
        const formData = new FormData()
        formData.append('title', this.course.title)
        formData.append('short_description', this.course.description)
        formData.append('duration', this.course.duration)
        formData.append('category', this.course.category)
        formData.append('level', this.course.level.toLowerCase())
        formData.append('status', 'active') // Default status, adjust as needed
        if (this.course.featuredImage) {
          formData.append('feature_image', this.course.featuredImage)
        }
        try {
          const res = await this.$axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/courses`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          // Store the created course ID for later steps
          this.course.id = res.data.id
          this.currentStep++
        } catch (err) {
          this.imageError = err.response?.data?.message || 'Failed to create course. Please check your input.'
        }
      } else if (this.currentStep < this.steps.length - 1) {
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep--
    },
    addOutlineSection() {
      this.course.outline.push({ _uid: Date.now() + Math.random(), title: '', body: '' })
    },
    removeOutlineSection(idx) {
      this.course.outline.splice(idx, 1)
    },
    addQuiz() {
      this.course.quiz.push({ question: '', options: ['', ''], correct: 0 })
    },
    addQuizOption(qidx) {
      this.course.quiz[qidx].options.push('')
    },
    removeQuizOption(qidx, oidx) {
      this.course.quiz[qidx].options.splice(oidx, 1)
    },
    triggerImageInput() {
      this.$refs.imageInput.click()
    },
    onImageChange(e) {
      const file = e.target.files[0]
      this.imageError = ''
      if (file) {
        // Validate size (<1MB) and type
        if (!file.type.startsWith('image/')) {
          this.imageError = 'File must be an image.'
          return
        }
        if (file.size > 1024 * 1024) {
          this.imageError = 'Image must be less than 1MB.'
          return
        }
        this.course.featuredImage = file
        const reader = new FileReader()
        reader.onload = e2 => {
          this.course.featuredImageUrl = e2.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.course.featuredImage = null
        this.course.featuredImageUrl = ''
      }
    },
    submitCourse() {
      // Placeholder for submit logic
      alert('Course submitted!')
    },
  },
  created() {
    // Attach axios instance for API calls
    this.$axios = axios
  },
}
</script>