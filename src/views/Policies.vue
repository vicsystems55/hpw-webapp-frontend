<template>
  <div>

    <div class="container">
      <div class="row">
        <div class="col-md-12">

          <div

          v-if="userData.role === 'admin'"

            class="mx-auto py-5 text-center"
          >
            <router-link :to="'/create-policies'">
              <buttons class="btn btn-primary btn-lg">
              Create New Policy
              </buttons>
            </router-link>
          </div>

          <div class="card">
            <div class="card-body table-responsive">

              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Policy Name</th>
                    <th>Type</th>
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
                      <button class="btn btn-sm btn-primary">
                        view more
                      </button>
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
                  <tr
                    v-for="record,key in records"
                    :key="record.index"
                  >
                    <td>{{ key +1 }}</td>

                    <td>{{ record.name }}</td>
                    <td>{{ record.type }}</td>
                    <td>{{ formatDate(record.created_at) }}</td>
                    <td>{{ record.status }}</td>

                    <td>
                      <a
                        :href="'/policy/'+record.id"
                        class="btn btn-sm btn-primary"
                      >view more</a>
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
import {
  // BDropdown,
  // BDropdownItem,
  BCardText,
} from 'bootstrap-vue'

export default {
  name: 'StaffRecords',
  components: {

    // BDropdown,
    // BDropdownItem,
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
    this.getPolicies()
    this.userData = JSON.parse(localStorage.getItem('user_data'))
  },

  methods: {

    formatDate(date) {
      const createdAt = new Date(date)

      // Format the date in "day, month year" format
      const options = { day: 'numeric', month: 'long', year: 'numeric' }
      const formattedDate = createdAt.toLocaleString('en-US', options)

      return formattedDate
    },

    getPolicies() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/policies`,
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
