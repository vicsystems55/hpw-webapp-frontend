<template>
  <div class="container py-4">

    <!-- Action Buttons -->
    <div class="d-flex justify-content-end mb-3 gap-2">
      <a :href="'/staff-details-update/' + record.id" class="btn btn-outline-primary btn-sm">
        <i class="fas fa-edit"></i> Update
      </a>
      <button class="btn btn-outline-secondary btn-sm" @click="deactivateRecord()">
        <i class="fas fa-ban"></i> Deactivate
      </button>
      <button class="btn btn-outline-danger btn-sm" @click="deleteRecord()">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>

    <!-- Staff Card -->
    <div class="card shadow-lg border-0 rounded-3 p-4 mb-4">
      <div class="row">

        <!-- Profile Image -->
        <div class="col-md-4 text-center mb-3">
          <img v-if="avatar || record.passport_file" id="previewImg"
            @click="document.getElementById('customFile').click()" class="profile-img"
            :src="resolveImg(record.passport_file)" />
          <input id="customFile" ref="file" type="file" class="d-none" @change="previewFile4" />
        </div>

        <!-- Details -->
        <div class="col-md-8">
          <h2 style="font-size: 24pt;" class="fw-bol mb-3">{{ record.fullname }}</h2>
          <div class="row g-3">


            <div class="col-md-6">
              <label class="text-muted">Email</label>
              <p class="fw-semibold">{{ record.email }}</p>
            </div>

            <div class="col-md-6">
              <label class="text-muted">Date of Birth</label>
              <p class="fw-semibold">{{ record.date_of_birth }}</p>
            </div>
            <div class="col-md-6">
              <label class="text-muted">Gender</label>
              <p style="color: black; font-size: medium;" class="">{{ record.gender }}</p>
            </div>
            <div class="col-12">
              <label class="text-muted">Address</label>
              <p class="fw-semibold">{{ record.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Qualifications -->
    <div class="card shadow-sm border-0 rounded-3 p-4 mb-4">
      <h5 class="fw-bold mb-3">Qualifications</h5>
      <div v-for="qualification in record.qualifications" :key="qualification.index"
        class="mb-3 p-3 border rounded d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-1">{{ qualification.qualification_title }}</h6>
        </div>
        <a :href="resolveImg(qualification.file_path)" target="_blank" class="btn btn-sm btn-outline-primary">
          View Document
        </a>
      </div>
    </div>


    <!-- Credential Management -->
    <div class="card shadow-sm border-0 rounded-3 p-4 mb-4">
      <h5 class="fw-bold mb-3">Credential Management</h5>
      <div class="row g-3">
        <div class="col-md-6">
          <label>Fullname</label>
          <input v-model="record.fullname" type="text" class="form-control" placeholder="Enter fullname" />
        </div>
        <div class="col-md-6">
          <label>Email</label>
          <input v-model="record.email" type="email" class="form-control" placeholder="Enter email" />
        </div>
        <div class="col-md-6">
          <label>Password</label>
          <input v-model="credential.password" type="password" class="form-control" placeholder="Enter password" />
        </div>
        <div class="col-md-6">
          <label>Confirm Password</label>
          <input v-model="credential.password_confirmation" type="password" class="form-control"
            placeholder="Confirm password" />
        </div>
      </div>
      <div class="mt-3">
        <button class="btn btn-primary" :disabled="creating" @click="createCredentials">
          {{ creating ? 'Creating...' : 'Create Credentials' }}
        </button>
      </div>
    </div>

    <!-- Supervision Schedule -->
    <div class="card shadow-sm border-0 rounded-3 p-4">
      <h5 class="fw-bold mb-3">Supervision Schedule</h5>
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Schedule Date (30 Days Interval)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(schedule, index) in record.supervision_schedule" :key="schedule.index"
            :class="schedule.status === 'completed' ? 'table-success' : ''">
            <td>{{ index + 1 }}</td>
            <td>{{ schedule.next_supervision_date }}</td>
            <td>
              <span :class="[
                'badge',
                schedule.status === 'completed' ? 'bg-success' :
                  schedule.status === 'active' ? 'bg-primary' : 'bg-secondary'
              ]">
                {{ schedule.status }}
              </span>
            </td>
            <td>
              <a :href="'/staff-supervision/' + schedule.id" class="btn btn-sm"
                :class="schedule.status === 'active' ? 'btn-outline-primary' : 'btn-outline-secondary'">
                {{ schedule.status === 'active' ? 'View' : 'Review' }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      record: '',
      userData: '',
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
      loadingy: false,
      credential: {
        fullname: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
    }
  },

  mounted() {
    this.userData = JSON.parse(localStorage.getItem('user_data'))
    this.getSubmissionStatus()
  },

  methods: {
    deactivateRecord() {
      if (confirm('Are you sure you want to deactivate this staff?')) {
        alert('Staff deactivated (demo action).')
      }
    },

    deleteRecord() {
      if (confirm('Are you sure you want to delete this record?')) {
        axios({
          url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-records/${this.$route.params.id}`,
          method: 'delete',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(() => {
            this.$router.push('/staff-records')
            alert('Record deleted successfully')
          })
          .catch(error => {
            console.error(error)
            alert('Something went wrong')
          })
      }
    },

    resolveImg(img) {
      return `${process.env.VUE_APP_BACKEND_URL}/storage/${img}`
    },

    previewFile4(event) {
      if (event.target.files.length > 0) {
        const src = URL.createObjectURL(event.target.files[0])
        const preview = document.getElementById('previewImg')
        preview.src = src
        this.passport_file = event.target.files[0]
      }
    },

    previewPastRecords(event) {
      if (event.target.files.length > 0) {
        this.past_records_file = event.target.files[0]
      }
    },

    getSubmissionStatus() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-records/${this.$route.params.id}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => {
          this.record = res.data
        })
        .catch(error => {
          console.error(error)
        })
    },

    createCredentials() {
      if (!this.record.email || !this.credential.password) {
        alert('Please fill in all fields')
        return
      }
      if (this.credential.password !== this.credential.password_confirmation) {
        alert('Passwords do not match')
        return
      }

      this.creating = true
      axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/create-staff-credentials`, {
        name: this.record.fullname,
        email: this.record.email,
        password: this.credential.password,
        password_confirmation: this.credential.password_confirmation
      })
        .then((res) => {
          console.log("✅ Register API Response:", res) // log full response
          alert('Credentials created successfully')
          this.creating = false
        })
        .catch((err) => {
          console.error("❌ Register API Error:", err.response || err) // log error response if available
          alert('Failed to create credentials')
          this.creating = false
        })
    },
  },
}
</script>


<style scoped>
*{
  color: black;
  font-size: medium;
}
.profile-img {
  height: 200px;
  width: 200px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s;
}

.profile-img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
</style>
