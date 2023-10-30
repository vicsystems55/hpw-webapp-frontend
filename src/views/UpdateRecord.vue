<template>
  <div>

    <div class="container card card-body">
      <div class="row ">
        <div class="col-md-12">

          <div class="col-md-12">
            <div class="form-group mx-auto text-center">
              <img
                v-if="passport_file"
                id="previewImg"
                onclick="document.getElementById('customFile').click()"
                style="height: 200px; width: 200px; object-fit: cover; border-radius: 50%;"
                class="shadow"
                :src="resolveImg(passport_file)"
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
              <input
                id="name"
                v-model="fullname"
                type="text"
                class="form-control "
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
              <label for="gender">Gender</label>
              <select
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

              </select>
            </div>

            <div class="form-group">
              <label for="address">Address</label>
              <input
                id="address"
                v-model="address"
                type="text"
                class="form-control"
                placeholder="Enter Address"
              >
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

            <div class="form-group">
              <label for="">Room Assignment:</label>
              <input
                v-model="room_assignment"
                type="text"
                class="form-control"
                placeholder="Enter Room no."
              >

            </div>

          </div>
        </div>

        <div class="col-md-6">

          <div class="form-group">
            <label for="">Past Records: (PDF, EXCEL DOCS, OR SCANNED IMAGES)</label>
            <input
              type="file"
              class="form-control-file"
              placeholder="Enter Room no."
              @change="previewPastRecords"
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
            <label for="care_level">Care Level</label>
            <select
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

            </select>
          </div>

          <div class="form-group">
            <label for="">Dietary Restrictions</label>
            <input
              v-model="dietary_restrictions"
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
              @click="updateRecord()"
            >
              {{ loadingy ? 'Please wait...' : 'Update Record' }}
            </button>

          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
// import { BFormFile } from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    // BFormFile,
  },

  data() {
    return {
      offices: [],
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
      past: null,

      loadingy: false,

    }
  },
  mounted() {
    this.getRecord()
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

      // eslint-disable-next-line prefer-destructuring
      this.avatar = event.target.files[0]

      console.log(this.passport_file)
    },

    previewPastRecords(event) {
      console.log(event)

      if (event.target.files.length > 0) {
        // const src = URL.createObjectURL(event.target.files[0])
        // const preview = document.getElementById('previewImg')
        // preview.src = src
        // preview.style.display = "block";
        // eslint-disable-next-line prefer-destructuring
        this.past = event.target.files[0]
      }
    },

    resolveImg(img) {
      return `${process.env.VUE_APP_BACKEND_URL}/storage/${img}`
    },
    getRecord() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/residents-management/${this.$route.params.id}`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,

        },
        method: 'get',
      }).then(res => {
        // this.loadingy = false

        this.fullname = res.data.fullname
        this.date_of_birth = res.data.date_of_birth
        this.gender = res.data.gender
        this.address = res.data.address
        this.caregiver_id = res.data.caregiver_id
        this.passport_file = res.data.passport_file
        this.government_details_file = res.data.government_details_file
        this.past_records_file = res.data.past_records_file
        this.national_insurance_number = res.data.national_insurance_number
        this.nhs_number = res.data.nhs_number
        this.emergency_contact_name = res.data.emergency_contact_name
        this.emergency_contact_relationship = res.data.emergency_contact_relationship
        this.emergency_contact_phone = res.data.emergency_contact_phone
        this.medical_history = res.data.medical_history
        this.care_level = res.data.care_level
        this.payment_information = res.data.payment_information
        this.room_assignment = res.data.room_assignment
        this.dietary_restrictions = res.data.dietary_restrictions
        this.special_requests_or_notes = res.data.special_requests_or_notes
        this.admission_date = res.data.admission_date
        this.discharge_date = res.data.discharge_date
        this.allergies = res.data.allergies

        console.log(res)
      }).catch(error => {
        this.loadingy = false

        console.log(error)
      })
    },

    updateRecord() {
      this.loadingy = true

      if (this.avatar || this.past) {
        alert('yes a')

        console.log(this.avatar)

        const formData = new FormData()

        formData.append('name', this.fullname)
        formData.append('date_of_birth', this.date_of_birth)
        formData.append('gender', this.gender)
        formData.append('address', this.address)
        formData.append('caregiver_id', this.caregiver_id)
        formData.append('passport_file', this.avatar)
        formData.append('government_details_file', this.government_details_file)
        formData.append('past_records_file', this.past_records_file)
        formData.append('national_insurance_number', this.national_insurance_number)
        formData.append('nhs_number', this.nhs_number)
        formData.append('emergency_contact_name', this.emergency_contact_name)
        formData.append('emergency_contact_relationship', this.emergency_contact_relationship)
        formData.append('emergency_contact_phone', this.emergency_contact_phone)
        formData.append('medical_history', this.medical_history)
        formData.append('care_level', this.care_level)
        formData.append('payment_information', this.payment_information)
        formData.append('room_assignment', this.room_assignment)
        formData.append('dietary_restrictions', this.dietary_restrictions)
        formData.append('special_requests_or_notes', this.special_requests_or_notes)
        formData.append('admission_date', this.admission_date)
        formData.append('discharge_date', this.discharge_date)
        formData.append('allergies', this.allergies)
        formData.append('update', true)
        formData.append('recordId', this.$route.params.id)

        console.log(formData)

        axios({
          url: `${process.env.VUE_APP_BACKEND_URL}/api/residents-management`,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,

          },
          method: 'post',
          data: formData,
        }).then(res => {
          this.loadingy = false
          console.log(res)

          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Record updated',
              icon: 'EditIcon',
              variant: 'success',
            },
          })

        // this.$router.push('/management')
        }).catch(error => {
          this.loadingy = false

          this.$toast({
            component: ToastificationContent,
            props: {
              title: error.response.data.errors.name.toString(),
              icon: 'EditIcon',
              variant: 'danger',
            },
          })

          this.$toast({
            component: ToastificationContent,
            props: {
              title: error.response.data.errors.passport_file.toString(),
              icon: 'EditIcon',
              variant: 'danger',
            },
          })

          console.log(error)
        })
      } else {
        alert('yes b')

        axios({
          url: `${process.env.VUE_APP_BACKEND_URL}/api/residents-management/${this.$route.params.id}`,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,

          },
          method: 'put',
          params: {
            name: this.fullname,
            date_of_birth: this.date_of_birth,
            gender: this.gender,
            address: this.address,
            caregiver_id: this.caregiver_id,
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
              title: 'Record updated',
              icon: 'EditIcon',
              variant: 'success',
            },
          })

        // this.$router.push('/management')
        }).catch(error => {
          this.loadingy = false

          this.$toast({
            component: ToastificationContent,
            props: {
              title: error.response.data.errors.name.toString(),
              icon: 'EditIcon',
              variant: 'danger',
            },
          })

          this.$toast({
            component: ToastificationContent,
            props: {
              title: error.response.data.errors.passport_file.toString(),
              icon: 'EditIcon',
              variant: 'danger',
            },
          })

          console.log(error)
        })
      }
    },

  },
}
</script>

<style></style>
