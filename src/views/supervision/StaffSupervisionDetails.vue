<template>

  <div class="card card-body">

    <marquee
      behavior=""
      direction=""
    >

      <h3 class="text-center text-danger">
        This page is currently under development. Please bear with us.
      </h3>
    </marquee>

    <h3 class="text-center text-primary">
      Supervision Questions
    </h3>
    <h4 class="text-center ">
      Supervision Date
    </h4>
    <p class="font-weight-bold text-center text-warning">
      {{ staffSupervisionData.next_supervision_date }}
    </p>

    <div class="container py-2">
      <div class="d-flex justify-content-around">
        <div class="bt">
          <a
            :href="resolveImg('supervision_docs/Supervision_Policy.docx')"
            class="btn btn-warning"
            download
          >
            Supervision Policy
          </a>
        </div>
        <div class="bt">
          <a
            :href="resolveImg('supervision_docs/Staff_Supervision_Record.docx')"
            class="btn btn-primary"
            download
          >
            Staff Supervision Form 1
          </a>
        </div>
        <div class="bt">
          <a
            :href="resolveImg('supervision_docs/Staff_Supervision_Record_Form.docx')"
            class="btn btn-primary"
            download
          >
            Staff Supervision Form 2
          </a>
        </div>
      </div>
    </div>

    <hr>
    <form @submit.prevent="submitAnswers">
      <div class="row">

        <div
          v-for="supervisionQuestion,index in supervisionQuestions"
          :key="supervisionQuestion.index"
          class="form-group col-md-6"
        >
          <label
            :for="'ans'+supervisionQuestion.id"
            class="font-weight-bold"
          >{{ index + 1 }}. {{ supervisionQuestion.question }}</label>
          <textarea
            :id="'ans'+supervisionQuestion.id"

            cols="30"
            rows="1"
            class="form-control"
            placeholder="Enter response"
            @input="updateFormData('ans'+[supervisionQuestion.id], $event.target.value)"
          >{{ supervisionAnswers.length>0?resolveAnswers(supervisionQuestion.id):'' }}</textarea>

          <input
            :id="'ansx'+supervisionQuestion.id"
            v-model="staff_supervision_schedule_id"

            type="hidden"
          >
        </div>

        <div class="container text-center py-3">
          <button
            style="min-width: 220px;"
            class="btn btn-lg btn-primary"
            type="submit"
          >
            Submit
          </button>
        </div>

      </div>
    </form>

    <div class="container py-3">

      <hr>
      <h5 class="text-center py-1">
        Upload Completed Form or Audio Recording
      </h5>

      <div class="form-group text-center">

        <input
          type="file"
          class="file-form-control"
          @change="previewSupervisionDocs"
        >
      </div>

      <div class="form-group text-center">
        <button
          style="min-width: 220px;"
          class="btn btn-lg btn-success text-center"
          type="submit"
          disabled
        >
          Upload
        </button>

      </div>

    </div>

  </div>
</template>
<script>
import axios from 'axios'
import { forEach } from 'postcss-rtl/lib/affected-props'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {

  data() {
    return {
      staffSupervisionData: '',
      supervisionQuestions: [],
      supervisionAnswers: [],
      formData: {},
      staff_supervision_schedule_id: '',
      uploadedFiles: [],

      loadingyy: false,

    }
  },

  mounted() {
    this.getSupervisionData()
    // this.loadAnswers()
  },

  methods: {

    resolveAnswers(supervisionQuestionId) {
      const foundObject = this.supervisionAnswers.find(item => item.supervision_question_id == supervisionQuestionId)

      console.log(foundObject)

      return foundObject.answer
    },

    resolveImg(img) {
      return `${process.env.VUE_APP_BACKEND_URL}/storage/${img}`
    },

    previewSupervisionDocs(event) {
      // Extract the selected files from the input event
      const files = Array.from(event.target.files)

      // Display the selected files in the console
      console.log(files)

      // You can store the files in the component's data if needed
      this.uploadedFiles = files
    },

    uploadSupervisionDocs() {
      this.loadingyy = true

      const formData = new FormData()
      formData.append('uploadedFiles', this.uploadedFiles)
      formData.append('supervisionUpload', true)

      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/supervision-uploads`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,

        },
        method: 'post',
        data: formData,
      }).then(res => {
        this.loadingyy = false
        console.log(res)

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Supervision Form Uploaded',
            icon: 'EditIcon',
            variant: 'success',
          },
        })
      }).catch(error => {
        this.loadingyy = false

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Supervision Form Uploaded',
            icon: 'EditIcon',
            variant: 'success',
          },
        })

        console.log(error)
      })
    },

    updateFormData(field, value) {
      // Manually update the form data for each input field
    //   alert(field)
      this.formData[field] = value
    //   this.formData['staff_supervision_schedule_id'] = this.staff_supervision_schedule_id
    },

    submitAnswers() {
    //   this.formData.push([
    //     'staff_supervision_schedule_id', this.staff_supervision_schedule_id,
    //   ])

      this.formData.staff_supervision_schedule_id = this.staff_supervision_schedule_id

      console.log(this.formData)

      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-supervision`,
        method: 'post',
        data: this.formData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res)

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Supervision Submitted Successfully',
            icon: 'EditIcon',
            variant: 'success',
          },
        })
      }).catch(error => {
        console.log(error)
      })
    },
    getSupervisionData() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-supervision/${this.$route.params.id}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res)
        this.staffSupervisionData = res.data.scheduleData
        this.supervisionQuestions = res.data.supervisionQuestions
        this.supervisionAnswers = res.data.supervisionAnswers
        this.staff_supervision_schedule_id = this.$route.params.id

        // console.log(this.supervisionAnswers)
        this.loadAnswers()
      }).catch(error => {
        console.log(error)
      })
    },

    loadAnswers() {
      this.supervisionAnswers.forEach((item, index) => {
        // console.log(item.answer)
        this.formData[`ans${item.supervision_question_id}`] = item.answer

        // console.log(this.formData)
        // this.updateFormData(`ans${item.supervision_question_id}`, item.answer)

        // You can perform any action for each item here
      })

      return this.formData
    },
  },

}
</script>
