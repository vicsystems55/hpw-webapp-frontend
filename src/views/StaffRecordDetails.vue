<template>
  <div>

    <div class="containe">
      <div class="card card-body">
        <div class="">

          <div class="d-flex justify-content-end">
            <div class="update p-1">
              <a
                :href="'/staff-details-update/'+record.id"
                class="btn btn-primary btn-sm"
              >
                Update
              </a>
            </div>
            <div class="activate p-1">
              <button
                class="btn btn-secondary btn-sm"
                @click="deactivateRecord()"
              >
                Deactivate
              </button>
            </div>
            <div class="update p-1">
              <button
                class="btn btn-danger btn-sm"
                @click="deleteRecord()"
              >
                Delete
              </button>
            </div>
          </div>

          <div class="row ">
            <div class="col-md-12">

              <div class="col-md-12">
                <div class="form-group mx-auto text-center">
                  <img
                    v-if="avatar"
                    id="previewImg"
                    onclick="document.getElementById('customFile').click()"
                    style="height: 200px; width: 200px; object-fit: cover; border-radius: 50%;"
                    class="shadow"
                    :src="resolveImg(record.passport_file)"
                  >

                  <img
                    v-else
                    id="previewImg"
                    onclick="document.getElementById('customFile').click()"
                    style="height: 200px; width: 200px; object-fit: cover; border-radius: 50%;"
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
            <div class=" col-md-6 ">
              <div class=" ">

                <div class="form-group">
                  <label for="name">Full name</label>
                  <!-- <input
                  id="name"
                  v-model="fullname"
                  type="text"
                  class="form-control "
                  placeholder="Enter your name"
                > -->
                  <h6>{{ record.fullname }}</h6>
                </div>

                <div class="form-group">
                  <label for="">Date of birth:</label>

                  <h6>{{ record.date_of_birth }}</h6>
                  <!-- <input
                      v-model="date_of_birth"
                      type="date"
                      class="form-control"
                      placeholder="Enter date"
                    > -->
                </div>

                <div class="form-group">
                  <label for="gender">Gender</label>
                  <h6>{{ record.gender }}</h6>
                  <!-- <select
                      id="gender"
                      v-model="gender"
                      class="form-control"
                    >
                      <option :value="'male'">
                        Male
                      </option>
                      <option :vvalue="'female'">
                        Female
                      </option>
                      <option :vvalue="'not-say'">
                        Rather Not Say
                      </option>

                    </select> -->
                </div>

                <div class="form-group">
                  <label for="address">Address</label>

                  <h6>{{ record.address }}</h6>
                  <!-- <input
                      id="address"
                      v-model="address"
                      type="text"
                      class="form-control"
                      placeholder="Enter Address"
                    > -->
                </div>

              </div>
            </div>

            <div class="col-md-6">

              <h6>Qualifications</h6>

              <div
                v-for="qualification in record.qualifications"
                :key="qualification.index"
                class="qual"
              >

                <div class="form-group">
                  <label for="">{{ qualification.qualification_title }}</label> <br>
                  <a
                    :href="resolveImg(qualification.file_path)"
                    class="btn btn-primary btn-sm"
                  >View doc</a>
                  <!-- <input
                        type="file"
                        class="form-control-file"
                        placeholder="Enter Room no."
                        @change="previewPastRecords"
                      > -->

                </div>
              </div>

              <div class="form-group d-none">

                <button
                  class="btn btn-primary btn-lg btn-block"
                  @click="createSubmission()"
                >
                  {{ loadingy ? 'Please wait...' : 'Submit' }}
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>

      <div class="card card-body table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Schedule Date (30 Days Intv.)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="schedule,index in record.supervision_schedule" :key="schedule.index"
            :class="schedule.staff_reminder==true?'bg-success text-white':'bg-white text-dark'"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ schedule.next_supervision_date }}</td>
              <td>{{ schedule.status }}</td>
              <td v-if="schedule.staff_reminder==false">
                <a :href="'/staff-supervision/'+schedule.id" class="btn btn-primary btn-sm " >view</a>
              </td>
              <td v-else>
                <button class="btn btn-secondary btn-sm " disabled>done</button>
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
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {

    AppCollapse,
    AppCollapseItem,
  },
  data() {
    return {
      record: '',
      userData: '',
      file: '',
      fullname: '',
      date_of_birth: '',
      gender: '',
      address: '',
      caregiver_id: '',
      passport_file: '',
      government_details_file: '',
      past_records_file: '',
      national_insurance_number: '',
      nhs_number: '',
      emergency_contact_name: '',
      emergency_contact_relationship: '',
      emergency_contact_phone: '',
      medical_history: '',
      care_level: '',
      payment_information: '',
      room_assignment: '',
      dietary_restrictions: '',
      special_requests_or_notes: '',
      admission_date: '',
      discharge_date: '',
      allergies: '',
      avatar: null,

      loadingy: false,

    }
  },
  mounted() {
    this.userData = JSON.parse(localStorage.getItem('user_data'))

    this.getSubmissionStatus()
  },

  methods: {

    deactivateRecord() {
      const confirmation = confirm('Are you sure?')

      if (confirmation) {
        alert('deleted')
      } else {
        alert('cancelled')
      }
    },

    deleteRecord() {
      // eslint-disable-next-line no-restricted-globals
      const confirmation = confirm('Are you sure?')

      if (confirmation) {
        axios({
          url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-records/${this.$route.params.id}`,
          method: 'delete',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then(res => {
          console.log(res)
        }).catch(error => {
          console.log(error)
        })
        this.$router.push('/staff-records')

        alert('deleted')
      } else {
        alert('cancelled')
      }
    },

    resolveImg(img) {
      return `${process.env.VUE_APP_BACKEND_URL}/storage/${img}`
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

    previewPastRecords(event) {
      console.log(event)

      if (event.target.files.length > 0) {
        // const src = URL.createObjectURL(event.target.files[0])
        // const preview = document.getElementById('previewImg')
        // preview.src = src
        // preview.style.display = "block";
        this.past_records_file = event.target.files[0]
      }
    },

    getSubmissionStatus() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-records/${this.$route.params.id}`,
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

  },
}
</script>

  <style>
  .scroll-card::-webkit-scrollbar {
    width: 16px;
  }

  .scroll-card::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 100px;
  }

  .scroll-card::-webkit-scrollbar-thumb {
    background-color: #d4aa70;
    border-radius: 100px;
  }
  </style>
