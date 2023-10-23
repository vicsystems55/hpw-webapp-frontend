<template>
  <div>

    <div class="container card card-body">
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
                :src="avatar"
              >

              <img
                v-else
                id="previewImg"
                onclick="document.getElementById('customFile').click()"
                style="height: 200px; width: 200px; object-fit: cover; border-radius: 50%;"
                class="shadow"
                :src="'https://www.lifewire.com/thmb/8MhWKwi4GEGiYRT6P56TBvyrkYA=/1326x1326/smart/filters:no_upscale()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg'"
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

            <div class="form-group text-center">
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
              <label for="">Full name</label>
              <input
                v-model="fullname"
                type="text"
                class="form-control"
                placeholder="Enter your name"
              >
            </div>

            <div class="form-group">
              <label for="">Date of birth:</label>
              <input
                v-model="date_of_birth"
                type="date"
                class="form-control"
                placeholder="Enter date"
              >
            </div>

            <div class="form-group">
              <label for="">Gender</label>
              <select
                id=""
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

              </select>
            </div>

            <div class="form-group">
              <label for="">Upload photo</label>
              <b-form-file
                v-model="passport_file"
                placeholder="Upload photo"
                drop-placeholder="Drop file here..."
                no-drop
              />
            </div>

            <div class="form-group">
              <label for="">National Insurance Number:</label>
              <input
                v-model="national_insurance_number"
                type="text"
                class="form-control"
                placeholder="Enter NIN"
              >
            </div>

            <div class="form-group">
              <label for="">NHS Number:</label>
              <input
                v-model="nhs_number"
                type="text"
                class="form-control"
                placeholder="Enter NHS"
              >
            </div>

            <div class="form-group">
              <label for="">Emergency Contact Address</label>
              <input
                v-model="emergency_contact_name"
                type="text"
                class="form-control"
                placeholder="Enter senders address"
              >
            </div>

            <div class="form-group">
              <label for="">Emergency Contact Relationship</label>
              <input
                v-model="emergency_contact_relationship"
                type="text"
                class="form-control"
                placeholder="Enter relationship"
              >
            </div>

            <div class="form-group">
              <label for="">Emergency Contact Phone</label>
              <input
                v-model="emergency_contact_phone"
                type="text"
                class="form-control"
                placeholder="Enter phone"
              >
            </div>

          </div>
        </div>

        <div class="col-md-6">

          <div class="form-group">
            <label for="">Room Assignment:</label>
            <input
              v-model="room_assignment"
              type="text"
              class="form-control"
              placeholder="Enter Room no."
            >

          </div>

          <div class="form-group">
            <label for="">Medical History</label>
            <textarea
              v-model="medical_history"
              cols="10"
              rows="5"
              type="text"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="">Care Level</label>
            <select
              id=""
              v-model="care_level"
              class="form-control"
            >
              <option value="">
                Intensive
              </option>
              <option value="">
                Basic
              </option>
              <option value="">
                Emergency
              </option>

            </select>
          </div>

          <div class="form-group">
            <label for="">Dietary Restrictions</label>
            <input
              v-model="room_assignment"
              type="text"
              class="form-control"
              placeholder="Dietary specialties"
            >
          </div>

          <div class="form-group">
            <label for="">Special Request or notes</label>
            <input
              v-model="special_requests_or_notes"
              type="text"
              class="form-control"
              placeholder="Enter Special request"
            >
          </div>

          <div class="form-group">
            <label for="">Admission Date:</label>
            <input
              v-model="admission_date"
              type="date"
              class="form-control"
              placeholder="Enter Special request"
            >
          </div>

          <div class="form-group">
            <label for="">discharge Date:</label>
            <input
              v-model="discharge_date"
              type="date"
              class="form-control"
              placeholder="Enter Special request"
            >
          </div>

          <div class="form-group">
            <label for="">Allergies:</label>
            <input
              v-model="allergies"
              type="text"
              class="form-control"
              placeholder="separated by commas"
            >
          </div>

          <div class="form-group">

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
</template>

<script>
import axios from 'axios'
import { BFormFile } from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BFormFile,
  },

  data() {
    return {
      offices: [],

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

      loadingy: false,

    }
  },
  mounted() {
    // this.getOffices()
  },
  methods: {

    previewFile4(event) {
      console.log(event)

      if (event.target.files.length > 0) {
        const src = URL.createObjectURL(event.target.files[0])
        const preview = document.getElementById('previewImg')
        preview.src = src
        // preview.style.display = "block";
      }

      this.file = this.$refs.file.files[0]
    },

    createSubmission() {
      this.loadingy = true
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/residents-management`,
        method: 'post',
        data: {
          fullname: this.fullname,
          date_of_birth: this.date_of_birth,
          gender: this.gender,
          address: this.address,
          caregiver_id: this.caregiver_id,
          passport_file: this.passport_file,
          government_details_file: this.government_details_file,
          past_records_file: this.past_records_file,
          national_insurance_number: this.national_insurance_number,
          nhs_number: this.nhs_number,
          emergency_contact_name: this.emergency_contact_name,
          emergency_contact_relationship: this.emergency_contact_relationship,
          emergency_contact_phone: this.emergency_contact_phone,
          medical_history: this.medical_history,
          care_level: this.care_level,
          payment_information: this.payment_information,
          room_assignment: this.room_assignment,
          dietary_restrictions: this.dietary_restrictions,
          special_requests_or_notes: this.special_requests_or_notes,
          admission_date: this.admission_date,
          discharge_date: this.discharge_date,
          allergies: this.allergies,
        },
      }).then(res => {
        this.loadingy = false
        console.log(res)

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Record created',
            icon: 'EditIcon',
            variant: 'success',
          },
        })

        this.$router.push('/management')
      }).catch(error => {
        this.loadingy = false

        console.log(error)
      })
    },

  },
}
</script>

<style></style>
