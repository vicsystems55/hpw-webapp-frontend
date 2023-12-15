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
        <div class="container">
          <div class=" row">
            <div class="col-md-6">

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

              <div class="form-group d-none">
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

              <!-- <div class="form-group">
                <label for="observation">Observation</label>
                <input
                  id="observation"
                  v-model="oberservation"
                  type="text"
                  class="form-control"
                  placeholder="Enter observation"
                >
              </div> -->

              <div class="form-group">
                <label for="supervision">Last Supervision Date</label>
                <input
                  id="supervision"
                  v-model="last_supervision_date"
                  type="date"
                  class="form-control"
                  placeholder="Enter Supervision Date"
                >
              </div>
            </div>
            <div class="col-md-6">

              <div class="form-group">
                <label for="phone">Phone</label>
                <input
                  id="phone"
                  v-model="phone"
                  type="text"
                  class="form-control "
                  placeholder="Enter your phone"
                >
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control "
                  placeholder="Enter staff email"
                >
              </div>
              <div class="form-group">
                <label for="">Note</label>
                <textarea
                  v-model="notes"
                  cols="10"
                  rows="5"
                  type="text"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="dbs_date">Date</label>
                <input
                  id="dbs_date"
                  v-model="dbs_date"
                  type="date"
                  class="form-control "
                  placeholder="Enter DBS Date"
                >
              </div>

              <div class="form-group">
                <label for="dbs">Upload DBS File.</label> <br>
                <input @change="previewDBS" type="file"  class="file-form-control">
              </div>

            </div>
          </div>

        </div>

        <hr>

        <div class="col-md-12">
          <h6 class="text-danger">Upload Staff Qualifications below.</h6>
        </div>

       

        <div class="d-flex justify-content-start flex-wrap">
          <div
            v-for="(field, index) in fields"
            :key="field.index"
          >

            <div class="  border p-1 m-1">
              <div class="bg-primary">
                <span
                  class="float-right btn"
                  @click="removeInput(index)"
                >x</span>
              </div>
              <div class="form-group mt-2">
                <label for="">Training Name:</label>
                <input
                v-model="field.text"
                  type="text"
                  class="form-control"
                  placeholder="Enter Qualification Title"
                >
              </div>

              <div class="form-group">
                <label for="">Upload proof: (PDF, EXCEL DOCS, OR SCANNED IMAGES)</label>
                <input
                  type="file"
                  class="form-control-file"
                  :id="'fileInput_'+[index]"
                  @change="previewQualificationFile(index)"
                >

              </div>
            </div>
          </div>

          <div class=" py-5 text-center btn">
            <h4
              class="text-center border border-secondary"
              @click="addInput"
            >
              + ADD
            </h4>
          </div>

        </div>

      </div>
      <div class="form-group col-md-6 mx-auto">

        <button
          class="btn btn-primary btn-lg btn-block"
          @click="registerStaff()"
        >
          {{ loadingy ? 'Please wait...' : 'Submit' }}
        </button>

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
      file: '',

      dbs_file: '',
      dbs_date: '',
      last_supervision_date: '',

      

      fullname: '',
      date_of_birth: '',
      gender: '',
      address: '',
      email: '',
      notes: '',
      phone: '',
      qualification: '',

      avatar: null,

      fields: [],

      loadingy: false,

    }
  },
  mounted() {
    // this.getOffices()
  },
  methods: {

    onFileChange(index) {
      const fileInput = this.$refs[`fileInput_${index}`]
      if (fileInput.files.length > 0) {
        this.fields[index].file = fileInput.files[0]
      }
    },

    addInput() {
      this.fields.push({ file: null, text: '' })

      console.log(this.fields)
    },
    removeInput(index) {
      this.fields.splice(index, 1)
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

    previewDBS(event) {
      console.log(event)

      // if (event.target.files.length > 0) {
      //   const src = URL.createObjectURL(event.target.files[0])
      //   const preview = document.getElementById('previewImg')
      //   preview.src = src
      //   // preview.style.display = "block";
      // }

      this.dbs_file = event.target.files[0]

      console.log(this.passport_file)
    },

    previewQualificationFile(index) {
      const fileInput = document.getElementById('fileInput_'+[index])
      console.log('File input changed', fileInput.files[0]) // Debugging
      if (fileInput.files.length > 0) {
        this.fields[index].file = fileInput.files[0]
      }
    },

    registerStaff() {
      this.loadingy = true

      if (!this.passport_file) {

      this.loadingy = false

      return  this.$toast({
          component: ToastificationContent,
          props: {
            title: 'No profile picture selected',
            icon: 'EditIcon',
            variant: 'danger',
          },
        })

        
      }

      // console.log(this.fields)

      const formData = new FormData()

      this.fields.forEach((field, index) => {
        formData.append(`file_${index}`, field.file)
        formData.append(`text_${index}`, field.text)
      })

      formData.append('fullname', this.fullname)
      formData.append('date_of_birth', this.date_of_birth)
      formData.append('gender', this.gender)
      formData.append('address', this.address)
      formData.append('email', this.email)
      formData.append('notes', this.notes)
      formData.append('phone', this.phone)
      formData.append('passport_file', this.passport_file)
      formData.append('dbs_file', this.dbs_file)
      formData.append('dbs_date', this.dbs_date)
      formData.append('last_supervision_date', this.last_supervision_date)


    
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-records`,
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
            title: 'Record created',
            icon: 'EditIcon',
            variant: 'success',
          },
        })

        this.$router.push('/staff-records')
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
    },

  },
}
</script>

<style></style>
