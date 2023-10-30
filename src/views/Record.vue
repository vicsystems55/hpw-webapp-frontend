<template>
  <div>

    <div class="containe">
      <div class="card card-body">
        <div class="">

          <div class="d-flex justify-content-end">
            <div class="update p-1">
              <a
                :href="'/update-record/'+record.id"
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

                <div class="form-group">
                  <label for="">National Insurance Number:</label>
                  <h6>{{ record.national_insurance_number }}</h6>
                  <!-- <input
                    v-model="national_insurance_number"
                    type="text"
                    class="form-control"
                    placeholder="Enter NIN"
                  > -->
                </div>

                <div class="form-group">
                  <label for="">NHS Number:</label>
                  <h6>{{ record.nhs_number }}</h6>
                  <!-- <input
                    v-model="nhs_number"
                    type="text"
                    class="form-control"
                    placeholder="Enter NHS"
                  > -->
                </div>

                <div class="form-group">
                  <label for="">Emergency Contact Name</label>
                  <h6>{{ record.emergency_contact_name }}</h6>

                  <!-- <input
                    v-model="emergency_contact_name"
                    type="text"
                    class="form-control"
                    placeholder="Enter senders address"
                  > -->
                </div>

                <div class="form-group">
                  <label for="">Emergency Contact Relationship</label>
                  <h6>{{ record.emergency_contact_relationship }}</h6>

                  <!-- <input
                    v-model="emergency_contact_relationship"
                    type="text"
                    class="form-control"
                    placeholder="Enter relationship"
                  > -->
                </div>

                <div class="form-group">
                  <label for="">Emergency Contact Phone</label>
                  <h6>{{ record.emergency_contact_phone }}</h6>

                  <!-- <input
                    v-model="emergency_contact_phone"
                    type="text"
                    class="form-control"
                    placeholder="Enter phone"
                  > -->
                </div>

                <div class="form-group">
                  <label for="">Room Assignment:</label>
                  <h6>{{ record.room_assignment }}</h6>

                  <!-- <input
                    v-model="room_assignment"
                    type="text"
                    class="form-control"
                    placeholder="Enter Room no."
                  > -->

                </div>

              </div>
            </div>

            <div class="col-md-6">

              <div class="form-group">
                <label for="">Past Records: (PDF, EXCEL DOCS, OR SCANNED IMAGES)</label> <br>
                <a
                  :href="resolveImg(record.past_records_file)"
                  class="btn btn-primary btn-sm"
                >View doc</a>
                <!-- <input
                  type="file"
                  class="form-control-file"
                  placeholder="Enter Room no."
                  @change="previewPastRecords"
                > -->

              </div>

              <div class="form-group">
                <label for="">Medical History</label>
                <h6>{{ record.medical_history }}</h6>

                <!-- <textarea
                  v-model="medical_history"
                  cols="10"
                  rows="5"
                  type="text"
                  class="form-control"
                /> -->
              </div>

              <div class="form-group">
                <label for="care_level">Care Level</label>
                <h6>{{ record.care_level }}</h6>

                <!-- <select
                  id="care_level"
                  v-model="care_level"
                  class="form-control"
                >
                  <option :value="'Intensive'">
                    Intensive
                  </option>
                  <option :value="'Basic'">
                    Basic
                  </option>
                  <option :value="'Emergency'">
                    Emergency
                  </option>

                </select> -->
              </div>

              <div class="form-group">
                <label for="">Dietary Restrictions</label>
                <h6>{{ record.dietary_restrictions }}</h6>

                <!-- <input
                  v-model="dietary_restrictions"
                  type="text"
                  class="form-control"
                  placeholder="Dietary specialties"
                > -->
              </div>

              <div class="form-group">
                <label for="">Special Request or notes</label>
                <h6>{{ record.special_requests_or_notes }}</h6>

                <!-- <input
                  v-model="special_requests_or_notes"
                  type="text"
                  class="form-control"
                  placeholder="Enter Special request"
                > -->
              </div>

              <div class="form-group">
                <label for="">Admission Date:</label>
                <h6>{{ record.admission_date }}</h6>

                <!-- <input
                  v-model="admission_date"
                  type="date"
                  class="form-control"
                  placeholder="Enter Special request"
                > -->
              </div>

              <div class="form-group">
                <!-- <label for="">discharge Date:</label>
                <input
                  v-model="discharge_date"
                  type="date"
                  class="form-control"
                  placeholder="Enter Special request"
                > -->
              </div>

              <div class="form-group">
                <label for="">Allergies:</label>
                <h6>{{ record.allergies }}</h6>

                <!-- <input
                  v-model="allergies"
                  type="text"
                  class="form-control"
                  placeholder="separated by commas"
                > -->
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
          url: `${process.env.VUE_APP_BACKEND_URL}/api/residents-management/${this.$route.params.id}`,
          method: 'delete',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then(res => {
          console.log(res)
        }).catch(error => {
          console.log(error)
        })
        this.$router.push('/management')

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
        url: `${process.env.VUE_APP_BACKEND_URL}/api/residents-management/${this.$route.params.id}`,
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
