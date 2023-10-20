<template>
  <div>

    <div class="container">
      <div class="row">
        <div class="col-md-12">

          <div class="card col-md-6 mx-auto">
            <div class="card-body ">

              <div class="form-group">
                <label for="">Full name</label>
                <input
                  v-model="name"
                  type="text"
                  class="form-control"
                  placeholder="Enter your name"
                >
              </div>

              <div class="form-group">
                <label for="">Email</label>
                <input
                  v-model="email"
                  type="text"
                  class="form-control"
                  placeholder="Enter email"
                >
              </div>
              <div class="form-group">
                <label for="">Select Department:</label>
                <select
                  id=""
                  v-model="office_id"
                  class="form-control"
                >
                  <option
                    v-for="office in offices"
                    :key="office.index"
                    :value="office.id"
                  >
                    {{ office.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="">Title</label>
                <input
                  v-model="title"
                  type="text"
                  class="form-control"
                  placeholder="Enter title or subject"
                >
              </div>

              <div class="form-group">
                <label for="">From Address</label>
                <input
                  v-model="from_address"
                  type="text"
                  class="form-control"
                  placeholder="Enter senders address"
                >
              </div>

              <div class="form-group">
                <label for="">Select Submission format</label>
                <select
                  id=""
                  v-model="submission_format"
                  name=""
                  class="form-control"
                >
                  <option :value="'Check'">
                    Cheque
                  </option>
                  <option :value="'Letter'">
                    Letter
                  </option>
                  <option :value="'Document'">
                    Document
                  </option>
                  <option :value="'Proposal'">
                    Proposal
                  </option>
                  <option :value="'File'">
                    File
                  </option>

                </select>
              </div>

              <div class="form-group">
                <label for="">Date</label>
                <input
                  v-model="submission_date"
                  type="date"
                  class="form-control"
                >
              </div>

              <div class="form-group">
                <label for="">Phone</label>
                <input
                  v-model="phone"
                  type="text"
                  class="form-control"
                  placeholder="Enter Phone"
                >
              </div>

              <div class="form-group">
                <label for="">Upload file:</label>

                <b-form-file
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                  no-drop
                />

              </div>

              <!-- <div class="form-group">
                <label for="">Remarks</label>
                <textarea
                  id=""
                  name=""
                  cols="30"
                  rows="5"
                  class="form-control"
                  placeholder="Any remarks or comments."
                />
              </div> -->

              <div class="form-group">

                <button
                  class="btn btn-primary btn-lg btn-block"
                  @click="createSubmission()"
                >
                  {{ loadingy?'Please wait...':'Submit' }}
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
import { BFormFile } from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BFormFile,
  },

  data() {
    return {
      offices: [],


      name: '',
      email: '',
      office_id: '',
      from_address: '',
      title: '',
      submission_format: '',
      submission_date: '',
      phone: '',

      loadingy: false,

    }
  },
  mounted() {
    this.getOffices()
  },
  methods: {
    getOffices() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/offices`,
        method: 'get',
      }).then(res => {
        console.log(res)
        this.offices = res.data
      }).catch(error => {
        console.log(error)
      })
    },

    createSubmission() {
      this.loadingy = true
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/visitor-submissions`,
        method: 'post',
        data: {
          name: this.name,
          email: this.email,
          office_id: this.office_id,
          title: this.title,
          submission_format: this.submission_format,
          submission_date: this.submission_date,
          phone: this.phone,
          from_address: this.from_address,
        },
      }).then(res => {
        this.loadingy = false
        console.log(res)

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Submission sent',
            icon: 'EditIcon',
            variant: 'success',
          },
        })

        this.$router.push('/submission-success')
      }).catch(error => {
        this.loadingy = false

        console.log(error)
      })
    },


  },
}
</script>

<style></style>
