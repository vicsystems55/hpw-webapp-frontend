<template>

  <div class="card card-body">
    <h4>Supervison Date</h4>

    <p class="font-weight-bold">
      {{ staffSupervisionData.next_supervision_date }}
    </p>
    <h6>Supervision Questions</h6>
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
          >{{ supervisionAnswers.length>0?supervisionAnswers[index].answer:'' }}</textarea>

          <input
            :id="'ansx'+supervisionQuestion.id"
            v-model="staff_supervision_schedule_id"

            type="hidden"
          >
        </div>
        <div class="form-group">
          <button
            class="btn btn-primary"
            type="submit"
          >
            Submit
          </button>
        </div>

      </div>
    </form>

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

    }
  },

  mounted() {
    this.getSupervisionData()
    // this.loadAnswers()
  },

  methods: {

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
        this.formData['ans'+item.supervision_question_id] = item.answer

        console.log(this.formData)
        // this.updateFormData(`ans${item.supervision_question_id}`, item.answer)

        // You can perform any action for each item here
      })

      return this.formData;
    },
  },



}
</script>
