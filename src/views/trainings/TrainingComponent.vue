<template>
  <div>
    <div class="card table-responsive">
      <div class="card-body">

        <table class="table">
          <tr>
            <td></td>
            <td v-for="trainingProgramme in trainingProgrammes" :key="trainingProgramme.id">
              {{ trainingProgramme.name }}

            </td>
          </tr>
          <tr v-for="staffRecord in staffRecords" :key="staffRecord.id">
            <td>{{ staffRecord.fullname }}</td>
            <td></td>
          </tr>
        </table>

      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      trainingProgrammes: [],
      staffRecords: [],
      staffTrainings: [],
    }
  },
  mounted() {
    this.getTrainings()
    this.getStaffRecords()
    this.getStaffTrainings()
  },
  methods: {
    getTrainings() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/training-programmes`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res)
        this.trainingProgrammes = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    getStaffRecords() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-records`,
        method: 'get',
        params: {
          trainings: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res)
        this.staffRecords = res.data
      }).catch(error => {
        console.log(error)
      })
    },

    getStaffTrainings() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res)
        this.staffTrainings = res.data
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>
