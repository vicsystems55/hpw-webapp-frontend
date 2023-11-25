<template>
  <div>

    <div class="container">

      <div
            v-show="userData.role=='admin'"
            class="mx-auto py-5 text-center"
          >
            <router-link :to="'/create-staff-record'">
              <buttons class="btn btn-primary btn-lg">
                Add New Staff
              </buttons>
            </router-link>
          </div>
      <div class="row">
        <div class="col-md-12 d-none">

          <div
            v-show="userData.role=='admin'"
            class="mx-auto py-5 text-center"
          >
            <router-link :to="'/create-staff-record'">
              <buttons class="btn btn-primary btn-lg">
                Add New Staff
              </buttons>
            </router-link>
          </div>

          <div class="card">
            <div class="card-body table-responsive">

              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Staff Name</th>
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

                    <td>{{ record.fullname }}</td>
                    <td>{{ record.date }}</td>
                    <td>{{ record.created_at }}</td>

                    <td>
                      <span class="badge badge-primary">{{ record.id }}</span>
                    </td>
                    <td>
                      <a
                        :href="'/staff-details/'+record.id"
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

      <div>
        <vue-good-table
          :columns="columns"
          :rows="records"
          max-height="500px"
          :fixed-header="true"
          @on-row-click="onRowClick"
        />
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
      columns: [
        {
          label: 'Name',
          field: 'fullname',
        },
        {
          label: 'Email',
          field: 'email',
          type: 'email',
        },
        {
          label: 'Created On',
          field: 'created_at',
          // type: 'date',
          // dateInputFormat: 'yyyy-MM-dd',
          // dateOutputFormat: 'MMM do yy',
        },
        {
          label: 'Status',
          field: 'status',
        },
      ],
      rows: [
        {
          id: 1, name: 'John', age: 20, createdAt: '', score: 0.03343,
        },
        {
          id: 2, name: 'Jane', age: 24, createdAt: '2011-10-31', score: 0.03343,
        },
        {
          id: 3, name: 'Susan', age: 16, createdAt: '2011-10-30', score: 0.03343,
        },
        {
          id: 4, name: 'Chris', age: 55, createdAt: '2011-10-11', score: 0.03343,
        },
        {
          id: 5, name: 'Dan', age: 40, createdAt: '2011-10-21', score: 0.03343,
        },
        {
          id: 6, name: 'John', age: 20, createdAt: '2011-10-31', score: 0.03343,
        },
      ],

    }
  },

  mounted() {
    this.getRecords()
    this.userData = JSON.parse(localStorage.getItem('user_data'))
  },

  methods: {

    onRowClick(params) {
      return this.$router.push(`/staff-details/${params.row.id}`)

    // params.row - row object
    // params.pageIndex - index of this row on the current page.
    // params.selected - if selection is enabled this argument
    // indicates selected or not
    // params.event - click event
    },

    getRecords() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-records`,
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
