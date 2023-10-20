<template>
  <div>

    <div class="container">
      <div class="row">
        <div class="col-md-12">

          <div v-show="userData.role=='perm-sec'" class="mx-auto py-5 text-center">
            <router-link :to="'/create-ad'">
              <buttons class="btn btn-primary btn-lg">
                Create Advertisment
              </buttons>
            </router-link>
          </div>

          <div class="card">
            <div class="card-body table-responsive">

              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Contractor Name</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>De Icon Nig Ltd.</td>
                    <td>Accounting</td>
                    <td>10-09-2023</td>
                    <td><span class="badge badge-primary">pending confirmation</span></td>
                    <td>
                      <b-dropdown
                        id="dropdown-1"
                        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                        text="Action"
                        variant="primary"
                      >
                        <b-dropdown-item>View</b-dropdown-item>
                        <b-dropdown-item>Authorize</b-dropdown-item>
                        <b-dropdown-item>Notify Perm. Sec.</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                  <tr v-for="submission,key in submissions" :key="submission.index">
                    <td>{{ key +1 }}</td>
                    <td>
                      <router-link :to="'/submission/'+submission.id">
                        {{submission.tracking_code}}
                      </router-link>

                    </td>
                    <td>{{submission.office.name}}</td>
                    <td>{{submission.date}}</td>
                    <td>
                      <span class="badge badge-primary">pending</span>
                    </td>

                  </tr>
                </tbody>
              </table>

            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import { BDropdown, BDropdownItem, BCardText } from 'bootstrap-vue'

export default {
  components: {

    BDropdown,
    BDropdownItem,
    // eslint-disable-next-line vue/no-unused-components
    BCardText,
  },

  data() {
    return {
      submissions: [],
      userData: '',

    }
  },

  mounted() {
    this.getSubmissions()
    this.userData = JSON.parse(localStorage.getItem('user_data'));
  },

  methods: {

    getSubmissions() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/visitor-submissions`,
        method: 'get',
      }).then(res => {
        console.log(res)
        this.submissions = res.data
      }).catch(error => {
        console.log(error)
      })
    },

  },

}
</script>

<style></style>
