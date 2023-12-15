<template>
  <div>
    <div class="card table-responsive">
      <div class="card-body">

        <b-button
          :id="'modalBtn'"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          v-b-modal.modal-no-footer
          v-b-modal.modal-1

          class="d-none"
          variant="outline-primary"
        >
          Basic Modal
        </b-button>

        <b-modal
          id="modal-1"
          :footer-class="'d-none'"
          :title="'Update Training for : '+selectedName"
        >
          <b-card-text>

            <div class="form-group">
              <select
                id=""
                v-model="selStatus"
                class="form-control"
              >
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
              <button
                class="btn btn-primary btn-"
                @click="postUpdate()"
              >
                Update
              </button>
            </div>
          </b-card-text>
        </b-modal>

        <div class="d-flex justify-content-start flex-wrap">
          <div
            v-for="trainingProgramme,index in trainingProgrammes"
            :key="trainingProgramme.id"
            style="min-width: 200px;"
            class="border m-1"
          >
            <h6>{{ index + 1 }}. {{ trainingProgramme.name }}</h6>
          </div>

        </div>

        <h6>0. Not Trained</h6>
        <h6>1. Familiar</h6>
        <h6>2. Trained</h6>
        <h6>3. Expert</h6>

        <table class="table">
          <tr>
            <td />
            <th
              v-for="trainingProgramme,index in trainingProgrammes"
              :key="trainingProgramme.id"
            >
              {{ index+1 }}

            </th>
          </tr>
          <tr
            v-for="staffRecord in staffRecords"
            :key="staffRecord.id"
          >
            <td>{{ staffRecord.fullname }}
              <br>
              <button
                class="btn btn-primary btn-sm"
                @click="generate(staffRecord.id)"
              >
                refresh
              </button>
            </td>

            <td
              v-for="training in staffRecord.staff_trainings"
              :key="training.id"
              class="border"
            >

              {{ training.grade }}

              <feather-icon
                class="text-success"
                icon="EditIcon"
                size="10"
                @click="updateStatus(training.id, staffRecord.fullname)"
              />

            </td>

          </tr>
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
    }
  },
  mounted() {
    // this.getTrainings()
    this.getStaffRecords()
    // this.getStaffTrainings()
  },
  methods: {

    postUpdate() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-trainings`,
        method: 'put',
        data:{
          grade: this.selStatus
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res.data)
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
