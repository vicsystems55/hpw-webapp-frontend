<template>
  <div>

    <div class="container card card-body col-md-6">
      <div class="row ">
        <div class="col-md-12">

          <div class="col-md-12 d-none">
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
            <div class="col-md-12">

              <div class="form-group">
                <label for="name">Policy Name</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-control "
                  placeholder="Enter policy"
                >
              </div>

              <div class="form-group">
                <label for="">Expiration Date:</label>
                <input
                  v-model="exp_date"
                  type="date"
                  class="form-control"
                  placeholder="Enter date"
                >
              </div>

              <div class="form-group">
                <label for="">Select Policy Type:</label>
                <select v-model="policy_type" id="" class="form-control">
                    <option :value="'Children (Ofsted)'">Children (Ofsted)</option>;
                    <option :value="'Adult (CQC)'">Adult (CQC)</option>

                    Adult (CQC)
                </select>
              </div>

              <div class="form-group">
                <label for="">Policy Content</label>
                <textarea
                  v-model="content"
                  cols="10"
                  rows="5"
                  type="text"
                  class="form-control"
                />
              </div>

            </div>

          </div>

        </div>

        <hr>

        <div class="col-md-12">
          <h6 class="text-danger">
            Upload an attachment (Optional)
          </h6>
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
                <label for="">Title of Document:</label>
                <input
                  v-model="field.text"
                  type="text"
                  class="form-control"
                  placeholder="Enter Policy Title here"
                >
              </div>

              <div class="form-group">
                <label for="">Upload proof: (PDF, EXCEL DOCS, OR SCANNED IMAGES)</label>
                <input
                  :id="'fileInput_'+[index]"
                  type="file"
                  class="form-control-file"
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
          @click="createPolicy()"
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

      name: '',
      content: '',
      exp_date: '',
      postData: null,
      policy_type: '',

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

    previewQualificationFile(index) {
      const fileInput = document.getElementById(`fileInput_${[index]}`)
      console.log('File input changed', fileInput.files[0]) // Debugging
      if (fileInput.files.length > 0) {
        this.fields[index].file = fileInput.files[0]
      }
    },

    createPolicy() {
      this.loadingy = true

      // console.log(this.fields)

      const formData = new FormData()

      if (this.fields.length != 0) {
        alert('yes files')

    
        this.fields.forEach((field, index) => {
          formData.append(`file_${index}`, field.file)
          formData.append(`text_${index}`, field.text)
        })

        formData.append('name', this.name)
        formData.append('content', this.content)
        formData.append('exp_date', this.exp_date)
        formData.append('type', this.policy_type)

      } else {
        this.postData = {
          name: this.name,
          content: this.content,
          exp_date: this.exp_date,
          policy_type: this.policy_type
        }
      }

      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/policies`,
        headers: {
          'Content-Type': this.postData == null ? 'multipart/form-data' : 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,

        },
        method: 'post',
        data: this.postData == null ? formData : this.postData,
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

        this.$router.push('/policies')
      }).catch(error => {
        this.loadingy = false

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'An unusual error occured',
            icon: 'EditIcon',
            variant: 'danger',
          },
        })

        // this.$toast({
        //   component: ToastificationContent,
        //   props: {
        //     title: error.response.data.errors.passport_file.toString(),
        //     icon: 'EditIcon',
        //     variant: 'error',
        //   },
        // })

        console.log(error)
      })
    },

  },
}
</script>

<style></style>
