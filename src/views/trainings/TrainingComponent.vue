<template>
  <div>
    <div class="card table-responsive">
      <div class="card-body">

      <div class="d-flex justify-content-start flex-wrap">
        <div style="min-width: 200px;"  v-for="trainingProgramme,index in trainingProgrammes" :key="trainingProgramme.id" class="border m-1">
          <h6>{{ index + 1 }}. {{ trainingProgramme.name }}</h6>
        </div>

      </div>

        <table class="table">
          <tr>
            <td></td>
            <th v-for="trainingProgramme,index in trainingProgrammes" :key="trainingProgramme.id">
              {{ index+1 }}

            </th>
          </tr>
          <tr v-for="staffRecord in staffRecords" :key="staffRecord.id">
            <td>{{ staffRecord.fullname }}
            <br>
            <button @click="generate(staffRecord.id)" class="btn btn-primary btn-sm">refresh</button>
            </td>
         
            <td v-for="training in staffRecord.staff_trainings" :key="training.id" class="border">

              {{ training.grade }}
              
            </td>
           
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
    // this.getTrainings()
    this.getStaffRecords()
    // this.getStaffTrainings()
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
        this.getStaffTrainings()
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
        this.getTrainings()
      }).catch(error => {
        console.log(error)
      })
    },

    getStaffTrainings() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-trainings`,
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

    generate(staffRecordId) {

      alert(staffRecordId)

      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/generate-staff-trainings`,
        method: 'post',
        data: {
          staff_record_id: staffRecordId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res)
   
        this.getStaffRecords()
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>
<!-- <style scoped>
th {
  writing-mode: vertical-lr; /* vertical writing mode, from bottom to top */
  text-orientation: upright; /* keeps the text upright */
  transform: rotate(180deg);
   /* additional rotation for browser compatibility */
  white-space: nowrap; /* prevents text from wrapping */
}
</style> -->
