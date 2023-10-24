<template>
  <div>

    <div class="container">
      <div class="row">
        <div class="col-md-12">

          <div v-show="userData.role=='admin'" class="mx-auto py-5 text-center">
            <router-link :to="'/create-record'">
              <buttons class="btn btn-primary btn-lg">
               Add New Record
              </buttons>
            </router-link>
          </div>

          <div class="card">
            <div class="card-body table-responsive">

              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Residents Name</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="d-none">
                    <td>1</td>
                    <td>John Doe</td>
                    <td>Teen</td>
                    <td>10-09-2023</td>
                    <td><span class="badge badge-primary">active</span></td>
                    <td>
                      <button class="btn btn-sm btn-primary">view more</button>
                      <!-- <b-dropdown
                        id="dropdown-1"
                        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                        text="Action"
                        variant="primary"
                      >
                        <b-dropdown-item>View</b-dropdown-item>
                        <b-dropdown-item>Authorize</b-dropdown-item>
                        <b-dropdown-item>Notify Perm. Sec.</b-dropdown-item>
                      </b-dropdown> -->
                    </td>
                  </tr>
                  <tr v-for="record,key in records" :key="record.index">
                    <td>{{ key +1 }}</td>
                
                    <td>{{record.fullname}}</td>
                    <td>{{record.date}}</td>
                    <td>{{record.admission_date}}</td>

                    <td>
                      <span class="badge badge-primary">{{record.status}}</span>
                    </td>
                    <td>
                      <a :href="'/record/'+record.id" class="btn btn-sm btn-primary">view more</a>
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
  name: 'residents-management',
  components: {

    BDropdown,
    BDropdownItem,
    // eslint-disable-next-line vue/no-unused-components
    BCardText,
  },

  data() {
    return {
      records: [],
      userData: '',

    }
  },

  mounted() {
    this.getRecords()
    this.userData = JSON.parse(localStorage.getItem('user_data'));
  },

  methods: {

    getRecords() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/residents-management`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'get',
      }).then(res => {
        console.log(res)
        this.records = res.data
      }).catch(error => {
        console.log(error)
      })
    },

  },

}
</script>

<style></style>
