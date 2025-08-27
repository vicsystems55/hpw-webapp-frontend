<template>
  <div
    v-if="course"
    class="container py-5"
  >
    <!-- Course Header -->
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <img
          :src="`${backendUrl}/${course.feature_image}`"
          alt="Course Image"
          class="rounded mr-4"
          style="width: 90px; height: 90px; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"
        >
        <div>
          <h2 class="mb-1">
            {{ course.title }}
          </h2>
          <div class="d-flex align-items-center">
            <div class="mr-3">
              <strong>Duration:</strong> {{ course.duration }} hrs
            </div>
            <div>
              <strong>Level:</strong> {{ course.level }}
            </div>
          </div>
        </div>
      </div>

      <!-- Edit button -->
      <button
        class="btn btn-lg btn-primary"
        @click="editCourse(course.id)"
      >
        ✏️ Edit
      </button>
    </div>

    <!-- Content + Outlines -->
    <div class="row">
      <!-- Active Outline -->
      <div class="col-md-8">
        <div class="card mb-3">
          <div class="card-body">
            <h4 class="card-title mb-3">
              {{ activeOutline.title }}
            </h4>
            <div v-html="activeOutline.body" />
          </div>
        </div>

        <!-- Take Assessment button -->
        <div
          v-if="course.quiz"
          class="text-center mt-3"
        >
          <button
            class="btn btn-success btn-lg"
            @click="startAssessment"
          >
            📘 Take Assessment
          </button>
        </div>
      </div>

      <!-- Outline Navigation -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-header bg-light font-weight-bold">
            Course Outline
          </div>
          <ul class="list-group list-group-flush">
            <li
              v-for="(item, idx) in course.outlines"
              :key="item.id"
              class="list-group-item list-group-item-action"
              :class="{ active: idx === activeOutlineIndex }"
              style="cursor:pointer;"
              @click="activeOutlineIndex = idx"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Quiz Modal -->
    <div
      v-if="showQuizModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div
        class="modal-dialog modal-lg"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              📘 Assessment
            </h5>
            <button
              type="button"
              class="close"
              @click="closeQuiz"
            >
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="d-flex justify-content-between mb-3">
              <span><strong>Time Left:</strong> {{ minutes }}:{{ seconds }}</span>
              <span><strong>Question {{ currentQuestionIndex + 1 }} of {{ course.quiz.questions.length }}</strong></span>
            </div>

            <div v-if="currentQuestion">
              <h5>{{ currentQuestion.question }}</h5>
              <div
                v-for="(opt, idx) in parsedOptions"
                :key="idx"
                class="form-check mt-2"
              >
                <input
                  :id="'opt' + idx"
                  v-model="answers[currentQuestion.id]"
                  class="form-check-input"
                  type="radio"
                  :name="'q' + currentQuestion.id"
                  :value="opt"
                >
                <label
                  class="form-check-label"
                  :for="'opt' + idx"
                >{{ opt }}</label>
              </div>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button
              class="btn btn-secondary"
              :disabled="currentQuestionIndex === 0"
              @click="prevQuestion"
            >
              ⬅ Prev
            </button>
            <button
              v-if="currentQuestionIndex < course.quiz.questions.length - 1"
              class="btn btn-primary"
              @click="nextQuestion"
            >
              Next ➡
            </button>
            <button
              v-else
              class="btn btn-success"
              @click="submitQuiz"
            >
              ✅ Submit
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Loader -->
  <div
    v-else
    class="text-center py-5"
  >
    <div
      class="spinner-border text-primary"
      role="status"
    />
    <p class="mt-3">
      Loading course details...
    </p>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'CourseDetails',
  props: {
    id: {
      type: [String, Number],
      required: false,
    },
  },
  data() {
    return {
      backendUrl: process.env.VUE_APP_BACKEND_URL,
      course: null,
      activeOutlineIndex: 0,
      // Quiz state
      showQuizModal: false,
      timeLeft: 300, // 5 mins in seconds
      timer: null,
      currentQuestionIndex: 0,
      answers: {},
    }
  },
  computed: {
    courseId() {
      return this.id || this.$route.params.id
    },
    activeOutline() {
      if (!this.course || !this.course.outlines.length) {
        return { title: 'No Outline', body: '<p>No content available.</p>' }
      }
      return this.course.outlines[this.activeOutlineIndex]
    },
    currentQuestion() {
      return this.course?.quiz?.questions[this.currentQuestionIndex] || null
    },
    parsedOptions() {
      try {
        return JSON.parse(this.currentQuestion.options)
      } catch {
        return []
      }
    },
    minutes() {
      return Math.floor(this.timeLeft / 60).toString().padStart(2, '0')
    },
    seconds() {
      return (this.timeLeft % 60).toString().padStart(2, '0')
    },
  },
  async created() {
    try {
      const response = await axios.get(
        `${this.backendUrl}/api/courses/${this.courseId}`,
      )
      this.course = response.data
    } catch (error) {
      console.error('Failed to load course:', error)
    }
  },
  methods: {
    editCourse(courseId) {
      localStorage.setItem('currentCourseId', courseId)
      this.$router.push({ name: 'create-course' })
    },
    startAssessment() {
      this.showQuizModal = true
      this.timeLeft = 300
      this.currentQuestionIndex = 0
      this.answers = {}
      this.startTimer()
    },
    startTimer() {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        } else {
          clearInterval(this.timer)
          this.submitQuiz()
        }
      }, 1000)
    },
    closeQuiz() {
      this.showQuizModal = false
      clearInterval(this.timer)
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.course.quiz.questions.length - 1) {
        this.currentQuestionIndex++
      }
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
      }
    },
    async submitQuiz() {
      try {
        const token = localStorage.getItem('token') // 👈 get token from localStorage


        const formattedAnswers = Object.entries(this.answers).map(([quiz_question_id, answer]) => ({
          quiz_question_id: Number(quiz_question_id),
          answer
        }));

        const payload = {
          course_id: this.course.id,
          quiz_id: this.course.quiz.id,
          answers: formattedAnswers,
        };

        console.log(payload)

        const response = await axios.post(
          `${this.backendUrl}/api/quiz-attempts`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 👈 attach token
              'Content-Type': 'application/json',
            },
          },
        )

        console.log('Quiz submitted:', response.data);
        this.$router.push('/assessment-completed');
        // alert(`Quiz submitted! Your total score: ${response.data.total_score}`)
      } catch (error) {
        console.error('Error submitting quiz:', error.response || error);
        alert('Failed to submit quiz. Please try again.');
      }
    },

  },
}
</script>
