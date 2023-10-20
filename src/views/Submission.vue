<template>
  <div>

    <div class="containe">
      <div class="">
        <div class="">

          <div class="scroll-card   overflow-auto  p-2">

            <div v-for="submissionStatus, key in submissionStatuses" :key="submissionStatus.index"
              style="min-height: 150px; max-width: 300px;" class="card  m-1 border border-prim ard   bg-succe ">
              <div class="card-body">

                <h6 class="">Title: <span style="font-weight: bold;" class="font-weight-bold"> {{
                  submissionStatus.visitors_submission.title }}</span></h6>
                <h6 class="">From: <span style="font-weight: bold;" class="font-weight-bold"> {{
                  submissionStatus.visitors_submission.from_address }}</span></h6>
                <h6 class="">To: <span style="font-weight: bold;" class="font-weight-bold"> {{
                  submissionStatus.visitors_submission.from_address }}</span></h6>

                <h6 class="">Date: {{ submissionStatus.created_at }}</h6>
                <p>Remark: {{ submissionStatus.remark }}</p>


              </div>

              <app-collapse v-if="userData.role != 'visitor'" accordion>
                <app-collapse-item title="Action">
                  <div class="form-group">
                    <label for="">Remark</label>
                    <textarea v-model="remark" type="text" col="" row="5" class="form-control"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="">Select Department:</label>
                    <select id="" v-model="office_id" class="form-control">
                      <option v-for="office in offices" :key="office.index" :value="office.id">
                        {{ office.name }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <button @click="dispatchSubmission()" class="btn btn-primary">Dispatch</button>
                  </div>
                </app-collapse-item>

              </app-collapse>



            </div>

            <div style="height: 150px; max-width: 300px;" class="card card-body m-1 border border-primary ard ">
              <h6></h6>
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
      submissionStatuses: [],
      offices: [],
      office_id: '',
      remark: '',
      userData: '',


    }
  },
  mounted() {
    this.userData = JSON.parse(localStorage.getItem('user_data'));

    this.getSubmissionStatus()
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
    getSubmissionStatus() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/submission-statuses`,
        method: 'get',
        params: {
          visitors_submission_id: this.$route.params.id,
        },
      }).then(res => {
        console.log(res)
        this.submissionStatuses = res.data
      }).catch(error => {
        console.log(error)
      })
    },

    dispatchSubmission() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/visitor-submissions`,
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        data: {
          visitors_submission_id: this.$route.params.id,
          dispatch: 'true',
          remark: this.remark,
          office_id: this.office_id,
        },
      }).then(res => {
        console.log(res)

        this.getSubmissionStatus()

        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Submission dispatched',
            icon: 'EditIcon',
            variant: 'success',
          },
        })
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
