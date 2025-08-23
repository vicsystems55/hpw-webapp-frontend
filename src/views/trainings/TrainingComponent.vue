<template>
  <div>
    <div class="card table-responsive">
      <div class="card-body">

        <b-button :id="'modalBtn'" v-ripple.400="'rgba(113, 102, 240, 0.15)'" v-b-modal.modal-no-footer
          v-b-modal.modal-1 class="d-none" variant="outline-primary">
          Basic Modal
        </b-button>

        <b-modal id="modal-1" :footer-class="'d-none'" :title="'Update Training for : ' + selectedName">
          <b-card-text>

            <div class="form-group">
              <select id="" v-model="selStatus" class="form-control">
                <option :value="'0'">
                  Not Trained
                </option>
                <option :value="'1'">
                  Familiar
                </option>
                <option :value="'2'">
                  Trained
                </option>
                <option :value="'3'">
                  Expert
                </option>

              </select>
            </div>
            <div class="form-group">
              <button class="btn btn-primary btn-" @click="postUpdate()">
                Update
              </button>
            </div>
          </b-card-text>
        </b-modal>

  <div class="container mt-3">

  <!-- Training Programmes -->
  <div class="row">
    <div 
      class="col-md-3 col-sm-6 mb-3" 
      v-for="(trainingProgramme, index) in trainingProgrammes" 
      :key="trainingProgramme.id"
    >
      <div class="card h-100 border-primary">
        <div class="card-body p-2">
          <h6 class="card-title mb-0">
            {{ index + 1 }}. {{ trainingProgramme.name }}
          </h6>
        </div>
      </div>
    </div>
  </div>

  <!-- Legend -->
  <div class="mt-4">
    <h5 class="mb-3">Legend</h5>
    <div class="row">
      <div class="col-md-3 col-sm-6 d-flex align-items-center mb-2">
        <span class="d-inline-block me-2" style="width: 40px; height: 20px; background-color: white; border: 1px solid #ccc;"></span>
        <span>0. Not Trained</span>
      </div>
      <div class="col-md-3 col-sm-6 d-flex align-items-center mb-2">
        <span class="d-inline-block me-2" style="width: 40px; height: 20px; background-color: yellow;"></span>
        <span>1. Familiar</span>
      </div>
      <div class="col-md-3 col-sm-6 d-flex align-items-center mb-2">
        <span class="d-inline-block me-2" style="width: 40px; height: 20px; background-color: green;"></span>
        <span>2. Trained</span>
      </div>
      <div class="col-md-3 col-sm-6 d-flex align-items-center mb-2">
        <span class="d-inline-block me-2" style="width: 40px; height: 20px; background-color: blue;"></span>
        <span>3. Expert</span>
      </div>
    </div>
  </div>

</div>


        <table class="table">
          <thead>
            <tr>
              <td />
              <th v-for="trainingProgramme, index in trainingProgrammes" :key="trainingProgramme.id">
                {{ index + 1 }}

              </th>
            </tr>

          </thead>
          <tbody>
            <tr v-for="staffRecord in staffRecords" :key="staffRecord.id">
              <td>{{ staffRecord.fullname }}
                <br>
                <button class="btn btn-primary btn-sm" @click="generate(staffRecord.id)">
                  refresh
                </button>
              </td>

              <td v-for="training in staffRecord.staff_trainings" :key="training.id" class="border"
                :style="'background-color: ' + returnColor(training.grade)">

                {{ training.grade }}

                <feather-icon class="text-success" icon="EditIcon" size="10"
                  @click="updateStatus(training.id, staffRecord.fullname)" />

              </td>

            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import {
  BModal, BButton, BCardText,
} from 'bootstrap-vue'

export default {
  components: {

    BButton,
    BModal,
    BCardText,
  },
  data() {
    return {
      trainingProgrammes: [],
      staffRecords: [],
      staffTrainings: [],
      selectedName: '',
      selectedTrainingId: '',
      selStatus: '',
      userData: '',
    }
  },
  mounted() {
    // this.getTrainings()
    this.getStaffRecords()
    // this.getStaffTrainings()
     this.userData = JSON.parse(localStorage.getItem('user_data'))
  },
  methods: {

    returnColor(grade) {

      if (grade == 1) {

        return 'yellow';

      }


      if (grade == 2) {

        return 'green';

      }
      if (grade == 3) {

        return 'blue';

      }

      if (grade == 0) {

        return 'white';

      }
    },

    postUpdate() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-trainings/${this.selectedTrainingId}`,
        method: 'put',
        data: {
          grade: this.selStatus,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res.data)
        this.getStaffRecords()
      }).catch(error => {
        console.log(error)
      })
    },

    updateStatus(selectedTrainingId, selectedName) {
      document.getElementById('modalBtn').click()

      this.selectedName = selectedName
      this.selectedTrainingId = selectedTrainingId
    },
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
        // console.log(res)
        this.staffRecords = res.data

        // Check role
        if (this.userData.role === 'staff') {
          this.staffRecords = res.data.filter(
            record => record.email === this.userData.email,
          )
        }
        console.log(this.staffRecords)
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

      // alert(staffRecordId)

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
