<template>
  <div class="container-fluid py-2">
    <div class="card mx-auto" style="max-width: auto;">
      <div class="card-body">

        <!-- Stepper Navigation -->
        <ul class="nav nav-pills mb-4 justify-content-center">
          <li v-for="(step, idx) in steps" :key="step" class="nav-item">
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
            <textarea v-model="course.description" class="form-control" rows="3" required />
          </div>
          <div class="form-group">
            <label>Created By</label>
            <input v-model="course.createdBy" type="text" class="form-control">
          </div>
          <div class="form-row">
            <!-- Featured Image -->
            <div class="form-group col-md-6">
              <label>Featured Image</label>
              <div class="d-flex align-items-center">
                <div class="image-upload-area mr-3" style="cursor:pointer;" @click="triggerImageInput">
                  <div v-if="course.featuredImageUrl">
                    <img :src="course.featuredImageUrl" alt="Featured Preview"
                      style="width: 250px; object-fit: cover; border-radius: 8px; border: 2px solid #007bff; box-shadow: 0 2px 8px #e3e3e3;">
                  </div>
                  <div v-else class="d-flex flex-column align-items-center justify-content-center"
                    style="width: 120px; height: 90px; border: 2px dashed #007bff; border-radius: 8px; background: #f8f9fa;">
                    <img src="https://img.icons8.com/ios-filled/50/007bff/picture.png" alt="Upload"
                      style="width: 36px; height: 36px; opacity: 0.7;">
                    <small class="text-muted">Click to upload</small>
                  </div>
                </div>
                <input ref="imageInput" type="file" class="d-none" accept="image/*" @change="onImageChange">
              </div>
              <small class="text-muted">Recommended: 800x600px, JPG/PNG, &lt; 1MB</small>
              <div v-if="imageError" class="text-danger small mt-1">
                {{ imageError }}
              </div>
            </div>

            <div class="col-md-6">
              <!-- Level -->
              <div class="form-group col-md-">
                <label>Level</label>
                <select v-model="course.level" class="form-control">
                  <option value="">
                    Select Level
                  </option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <!-- Category -->
              <div class="form-group col-md-">
                <label>Category</label>
                <input v-model="course.category" type="text" class="form-control">
              </div>

              <!-- Duration -->
              <div class="form-group col-md-">
                <label>Duration</label>
                <input v-model="course.duration" type="number" class="form-control" placeholder="e.g. 4 weeks">
              </div>
            </div>

          </div>

        </div>

        <!-- Step 2: Course Outline -->
        <CourseOutlineStep v-if="currentStep === 1" :course-id="course.id" :outline="course.outline"
          :quill-options="quillOptions" @add-outline-section="addOutlineSection"
          @remove-outline-section="removeOutlineSection" />

        <!-- Step 3: Quiz -->
        <div v-if="currentStep === 2">
          <div class="mb-3">
            <button class="btn btn-outline-primary btn-sm" @click="addQuiz">
              + Add Quiz Question
            </button>
          </div>
          <div v-for="(quizQ, idx) in quiz" :key="idx" class="card mb-2">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span>Question {{ idx + 1 }}</span>

              <div>
                <button class="btn btn-sm btn-success" @click="updateQuiz(quizQ, idx)">
                  Submit / Update Question
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteQuiz(quiz, idx)">
                  Delete
                </button>

              </div>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label>Question</label>
                <textarea v-model="quizQ.question" class="form-control" rows="3" placeholder="Enter your question" />
              </div>
              <div class="form-group">
                <label>Options</label>
                <div v-for="(option, oidx) in quizQ.options" :key="oidx" class="input-group mb-1">
                  <input v-model="quizQ.options[oidx]" type="text" class="form-control"
                    :placeholder="'Option ' + (oidx + 1)">
                  <div class="input-group-append">
                    <div class="input-group-text">
                      <input v-model="quizQ.correct" type="radio" :name="'correct' + idx" :value="quizQ.options[oidx]">
                    </div>
                    <button class="btn btn-danger btn-sm" @click="removeQuizOption(idx, oidx)">
                      &times;
                    </button>
                  </div>
                </div>
                <button class="btn btn-outline-secondary btn-sm" @click="addQuizOption(idx)">
                  + Add Option
                </button>
              </div>
            </div>

            <hr class="my-4">
          </div>

        </div>

        <!-- Stepper Controls -->
        <div class="d-flex justify-content-between mt-4">
          <button class="btn btn-secondary" :disabled="currentStep === 0" @click="prevStep">
            Previous
          </button>
          <button v-if="currentStep < steps.length - 1" class="btn btn-primary" @click="nextStep">
            Next
          </button>
          <button v-else class="btn btn-success" @click="submitCourse">
            Submit
          </button>
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
  components: {
    CourseOutlineStep,
  },
  data() {
    return {
      currentStep: 0,
      steps: ['Course Basics', 'Course Outline', 'Quiz'],
      quiz: [],
      course: {
        title: '',
        description: '',
        createdBy: '',
        level: '',
        category: '',
        duration: '',
        outline: [],

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
  mounted() {
    this.getCurrentCourse()
    this.getCurrentCourseQuizzQuestions()
  },
  created() {
    // Attach axios instance for API calls
    this.$axios = axios
  },
  methods: {
    goToStep(idx) {
      this.currentStep = idx
    },
    // async nextStep() {
    //   if (this.currentStep === 0) {
    //     // Prepare FormData for API
    //     const formData = new FormData()
    //     formData.append('title', this.course.title)
    //     formData.append('short_description', this.course.description)
    //     formData.append('duration', this.course.duration)
    //     formData.append('category', this.course.category)
    //     formData.append('level', this.course.level.toLowerCase())
    //     formData.append('status', 'active') // Default status, adjust as needed
    //     if (this.course.featuredImage) {
    //       formData.append('feature_image', this.course.featuredImage)
    //     }
    //     try {
    //       const res = await this.$axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/courses`, formData, {
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //           Authorization: `Bearer ${localStorage.getItem('token')}`,
    //         },
    //       })
    //       // Store the created course ID for later steps
    //       this.course.id = res.data.id
    //       localStorage.setItem('currentCourseId', this.course.id)

    //       this.currentStep++
    //     } catch (err) {
    //       this.imageError = err.response?.data?.message || 'Failed to create course. Please check your input.'
    //     }
    //   } else if (this.currentStep < this.steps.length - 1) {
    //     this.currentStep++
    //   }
    // },

    async nextStep() {
      if (this.currentStep === 0) {
        const formData = new FormData()

        // Always send required fields
        formData.append('title', this.course.title)
        formData.append('short_description', this.course.description)
        formData.append('duration', this.course.duration)
        formData.append('category', this.course.category)
        formData.append('level', this.course.level.toLowerCase())
        formData.append('status', 'active')

        // Only send if user picked a new image
        if (this.course.featuredImage instanceof File) {
          formData.append('feature_image', this.course.featuredImage)
        }

        try {
          let res
          const token = localStorage.getItem('token')

          if (localStorage.currentCourseId) {
            // 🔄 Update existing course
            res = await this.$axios.post(
              `${process.env.VUE_APP_BACKEND_URL}/api/courses/${localStorage.currentCourseId}?_method=PUT`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            this.course.id = res.data.id // keep course in sync
          } else {
            // 🆕 Create new course
            res = await this.$axios.post(
              `${process.env.VUE_APP_BACKEND_URL}/api/courses`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            this.course.id = res.data.id
            localStorage.setItem('currentCourseId', this.course.id)
          }

          this.currentStep++
        } catch (err) {
          this.imageError = err.response?.data?.message
            || 'Failed to save course. Please check your input.'
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
      this.quiz.push({ question: '', options: ['', ''], correct: 0 })
    },

    async deleteQuiz(quiz, idx) {
      if (!quiz.id) {
        // If not saved yet, just remove from frontend
        this.course.quiz.splice(idx, 1)
        return
      }

      if (!confirm('Are you sure you want to delete this question?')) return

      try {
        const token = localStorage.getItem('token')
        const courseId = localStorage.getItem('currentCourseId')

        await this.$axios.delete(
          `${process.env.VUE_APP_BACKEND_URL}/api/quiz-questions/${quiz.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { course_id: courseId }, // send course_id in DELETE body
          },
        )

        this.course.quiz.splice(idx, 1)
        this.$toast.success(`Question ${idx + 1} deleted successfully!`)
      } catch (err) {
        console.error('Failed to delete quiz:', err.response?.data || err.message)
        this.$toast.error('Failed to delete quiz question.')
      }
    },
    addQuizOption(qidx) {
      this.quiz[qidx].options.push('')
    },
    removeQuizOption(qidx, oidx) {
      this.quiz[qidx].options.splice(oidx, 1)
    },

    async updateQuiz(quiz, idx) {
      if (this.quiz.correct) {
        this.$toast.danger('Question answer not chosen.')
      }
      try {
        const token = localStorage.getItem('token')
        const courseId = localStorage.getItem('currentCourseId')

        const payload = {
          course_id: courseId,
          question: quiz.question,
          options: quiz.options,
          correct: quiz.correct, // index of the correct option
        }

        let res
        if (quiz.id) {
          // Update existing quiz question
          res = await this.$axios.put(
            `${process.env.VUE_APP_BACKEND_URL}/api/quizzes/${quiz.id}`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          console.log(res.data)
        } else {
          // Create new quiz question

          res = await this.$axios.post(
            `${process.env.VUE_APP_BACKEND_URL}/api/quizzes`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          console.log(res.data)
          // Assign new id to quiz so next time we update
          this.$set(this.course.quiz, idx, { ...quiz, id: res.data.id })
        }

        this.$toast.success(`Question ${idx + 1} saved successfully!`)
      } catch (err) {
        console.error('Failed to save quiz:', err.response?.data || err.message)
        this.$toast.error('Failed to save quiz question.')
      }
    },

    async getCurrentCourseQuizzQuestions() {
      if (!localStorage.currentCourseId) return

      try {
        const courseId = localStorage.currentCourseId
        const token = localStorage.getItem('token')
        const res = await this.$axios.get(
          `${process.env.VUE_APP_BACKEND_URL}/api/courses/${courseId}/quizzes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        console.log(res)

        // Assuming quizzes come as `res.data.quizzes`
        // Parse options JSON string into arrays
        this.quiz = (res.data.quizzes || []).map(q => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        }))
      } catch (error) {
        console.error('Failed to fetch course quizzes:', error.response?.data || error.message)
        this.$toast.error('Failed to load course quizzes.')
      }
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
      // Remove unfinished course tracking
      localStorage.removeItem('currentCourseId')

      // Navigate to success page
      this.$router.push({ name: 'CourseSuccess' })
    },
    getCurrentCourse() {
      if (localStorage.currentCourseId) {
        this.$axios.get(`${process.env.VUE_APP_BACKEND_URL}/api/courses/${localStorage.currentCourseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(res => {
            const { data } = res
            this.course = {
              id: data.id,
              title: data.title,
              description: data.short_description || '',
              createdBy: data.created_by,
              level: data.level,
              category: data.category,
              duration: data.duration,
              outline: data.outlines || [],
              quiz: data.quiz ? data.quiz : [],
              featuredImage: data.feature_image || null,
              featuredImageUrl: data.feature_image
                ? `${process.env.VUE_APP_BACKEND_URL}/${data.feature_image}`
                : '',
            }
          })
          .catch(err => {
            console.error('Failed to fetch course:', err)
          })
      }
    },

  },
}
</script>
