<template>
  <div class="container py-5">

    <div class="text-center py-2">
      <button
        class="btn btn-primary"
        @click="printDiv()"
      >
        Print
      </button>
    </div>

    <div id="card" class="card ">
      <div class="card-body px-3">
      <div class="text-center">
        <img
          style="max-height: 50px;"
          src="https://www.hopepathway.uk/wp-content/uploads/2021/04/cropped-Blood-Donation-Logo-4.png"
          alt=""
        >
      </div>

     
        <h6 class="text-center">Staff Supervision</h6>
        <div class="col-md-12">

          <div class="col-md-12">
            <div class="form-group mx-auto text-center">
              <img
                v-if="avatar"
                id="previewImg"
                onclick="document.getElementById('customFile').click()"
                style="height: 100px; width: 100px; object-fit: cover; border-radius: 50%;"
                class="shadow"
                :src="resolveImg(record.passport_file)"
              >

              <img
                v-else
                id="previewImg"
                onclick="document.getElementById('customFile').click()"
                style="height: 100px; width: 100px; object-fit: cover; border-radius: 50%;"
                class="shadow"
                :src="resolveImg(record.passport_file)"
              >

            </div>
            <div class="text-center d-none">
              <input
                id="customFile"
                ref="file"
                type="file"
                @change="previewFile4"
              >

            </div>

            <div class="form-group text-center d-none">
              <button
                class="btn btn-primary btn-sm"
                @click="uploadAvatar()"
              >
                Upload
              </button>
            </div>
          </div>

        </div>

        <h4 class="text-center py-2">{{ staffSupervisionData.staff.fullname }}</h4>

      
      
        <div class="row">
          <div
            v-for="supervisionQuestion,index in supervisionQuestions"
            :key="supervisionQuestion.index"
            class="form-group col-md-6 border border-secondary"
          >
            <h6
              :for="'ans'+supervisionQuestion.id"
              class="font-weight-bold"
            >{{ index + 1 }}. {{ supervisionQuestion.question }}</h6>
            <!-- <textarea
            :id="'ans'+supervisionQuestion.id"

            cols="30"
            rows="1"
            class="form-control"
            placeholder="Enter response"
            @input="updateFormData('ans'+[supervisionQuestion.id], $event.target.value)"
          > -->
            <h6 class="text-success">
              Ans: {{ supervisionAnswers.length>0?resolveAnswers(supervisionQuestion.question):'' }}
            </h6>
            <!-- </textarea> -->

            <input
              :id="'ansx'+supervisionQuestion.id"
              v-model="staff_supervision_schedule_id"

              type="hidden"
            >
          </div>
        </div>

        <div class="row">
          <div class="col-6">
            <div class="form py-2">
              <h6>_______________________________</h6>
              <h6>Staff Sign / Date</h6>
            </div>
          </div>
          <div class="col-6">
            <div class="form py-2">
              <h6>_______________________________</h6>
              <h6>Management Sign / Date</h6>
            </div>
          </div>
        </div>

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
      record: '',
      avatar: null,
      passport_file: '',

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

    printDiv() {
      const printContents = document.getElementById('card').innerHTML
      const originalContents = document.body.innerHTML

      document.body.innerHTML = printContents

      window.print()

      document.body.innerHTML = originalContents
    },

    previewFile4(event) {
      console.log(event)

      if (event.target.files.length > 0) {
        const src = URL.createObjectURL(event.target.files[0])
        const preview = document.getElementById('previewImg')
        preview.src = src
        // preview.style.display = "block";
      }

      this.passport_file = event.target.files[0]

      console.log(this.passport_file)
    },

    getSubmissionStatus(staffId) {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-records/${staffId}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res)
        this.record = res.data
      }).catch(error => {
        console.log(error)
      })
    },

    resolveAnswers(supervisionQuestionId) {
      const foundObject = this.supervisionAnswers.find(item => item.questions.question == supervisionQuestionId)

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

        this.getSubmissionStatus(this.staffSupervisionData.staff_record_id)

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
