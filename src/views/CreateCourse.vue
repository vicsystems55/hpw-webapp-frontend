
<template>
  <div class="container py-5">
    <div class="card mx-auto" style="max-width: 800px;">
      <div class="card-body">
        <h2 class="mb-4">Create Course</h2>
        <!-- Stepper Navigation -->
        <ul class="nav nav-pills mb-4 justify-content-center">
          <li class="nav-item" v-for="(step, idx) in steps" :key="step">
            <a
              class="nav-link"
              :class="{active: currentStep === idx}"
              href="#"
              @click.prevent="goToStep(idx)"
            >
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
        <div v-if="currentStep === 1">
          <div class="mb-3">
            <button class="btn btn-outline-primary btn-sm" @click="addOutlineSection">+ Add Section</button>
          </div>
          <div id="accordionOutline">
            <div class="card mb-2" v-for="(section, idx) in course.outline" :key="idx">
              <div class="card-header p-2" :id="'heading' + idx">
                <h5 class="mb-0 d-flex align-items-center">
                  <button class="btn btn-link flex-grow-1 text-left" type="button" data-toggle="collapse" :data-target="'#collapse' + idx" aria-expanded="true" :aria-controls="'collapse' + idx">
                    {{ section.title || 'Untitled Section' }}
                  </button>
                  <button class="btn btn-danger btn-sm ml-2" @click="removeOutlineSection(idx)">&times;</button>
                </h5>
              </div>
              <div :id="'collapse' + idx" class="collapse" :class="{show: idx === 0}" :aria-labelledby="'heading' + idx" data-parent="#accordionOutline">
                <div class="card-body">
                  <div class="form-group">
                    <label>Section Title</label>
                    <input v-model="section.title" type="text" class="form-control">
                  </div>
                  <div class="form-group">
                    <label>Section Content</label>
                    <textarea v-model="section.body" class="form-control" rows="3"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  <input v-model="quiz.options[oidx]" type="text" class="form-control" :placeholder="'Option ' + (oidx+1)">
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
      },
    }
  },
  methods: {
    goToStep(idx) {
      this.currentStep = idx
    },
    nextStep() {
      if (this.currentStep < this.steps.length - 1) this.currentStep++
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep--
    },
    addOutlineSection() {
      this.course.outline.push({ title: '', body: '' })
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
    submitCourse() {
      // Placeholder for submit logic
      alert('Course submitted!')
    },
  },
}
</script>
