<!-- eslint-disable camelcase -->
<!-- eslint-disable camelcase -->
<template>
  <div>

    <b-card-code title="">

      <!-- modal trigger button -->

      <!-- basic modal -->
      <b-modal
        id="modal-1"
        title="Update Office Details"
        ok-only
        ok-title="Accept"
      >
        <b-card-text>
          <h5>Check First Paragraph</h5>
          Oat cake ice cream candy chocolate cake chocolate cake cotton candy dragée apple pie.
          Brownie carrot cake candy canes bonbon fruitcake topping halvah. Cake sweet roll cake cheesecake cookie chocolate cake liquorice.
        </b-card-text>
      </b-modal>

      <!-- disable animation-->
      <b-modal
        id="modal-no-animation"
        content-class="shadow"
        title="Disabled Animation"
        no-fade
        ok-only
        ok-title="Accept"
      >
        <b-card-text>
          Chocolate bar jelly dragée cupcake chocolate bar I love donut liquorice.
          Powder I love marzipan donut candy canes jelly-o.
          Dragée liquorice apple pie candy biscuit danish lemon drops sugar plum.
        </b-card-text>
        <b-alert
          show
          variant="success"
        >
          <div class="alert-body">
            Well done! You successfully read this important alert message.
          </div>
        </b-alert>
      </b-modal>

      <!-- modal vertical center -->
      <b-modal
        id="modal-center"
        centered
        title="Edit Department"
        ok-only
        footerClass-d-none
      >

        <div class="col-md-12">

          <div class="form-group">
            <label for="">Name of office:</label>
            <input
              v-model="edit_name"
              type="text"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label for="">Abbreviation:</label>
            <input
              v-model="edit_abbrev"
              type="text"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label for="">Description:</label>
            <input
              v-model="edit_desc"
              type="text"
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label for="">Assign:</label>
            <select
              id=""
              v-model="edit_user_id"
              class="form-control"
            >
              <option
                v-for="user in users"
                :key="user.index"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="">Choose Parent Office:</label>
            <select
              id=""
              v-model="edit_parent_id"
              class="form-control"
            >
              <option value="">
                None
              </option>
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
            <button
              class="btn btn-primary btn-block"
              @click="updateOffice()"
            >
              {{ loading?'Please wait...':'Update' }}
            </button>
          </div>

        </div>

      </b-modal>

      <!-- modal backdrop -->
      <b-modal
        id="modal-no-backdrop"
        hide-backdrop
        ok-only
        no-close-on-backdrop
        content-class="shadow"
        title="Disabled Backdrop"
        ok-title="Accept"
      >
        <b-card-text>
          <span>We've added the utility class</span>
          <code>'shadow'</code>
          <span>to the modal content for added effect.</span>
        </b-card-text>
        <b-card-text>
          Candy oat cake topping topping chocolate cake. Icing pudding jelly beans I love chocolate carrot cake wafer
          candy canes. Biscuit croissant fruitcake bonbon soufflé.
        </b-card-text>
      </b-modal>

    </b-card-code>

    <b-card-code title="Administrative Settings">
      <b-tabs>
        <b-tab
          active
          title="Departments"
        >

          <div class="row">
            <div class="col-md-6">

              <div class="card">
                <div class="card-body">
                  <h6>Create Office</h6>

                  <div class="form-group">
                    <label for="">Name of office:</label>
                    <input
                      v-model="name"
                      type="text"
                      class="form-control"
                    >
                  </div>
                  <div class="form-group">
                    <label for="">Name of office:</label>
                    <input
                      v-model="abbrev"
                      type="text"
                      class="form-control"
                    >
                  </div>
                  <div class="form-group">
                    <label for="">Name of office:</label>
                    <input
                      v-model="desc"
                      type="text"
                      class="form-control"
                    >
                  </div>

                  <div class="form-group">
                    <label for="">Assign:</label>
                    <select
                      id=""
                      v-model="user_id"
                      class="form-control"
                    >
                      <option
                        v-for="user in users"
                        :key="user.index"
                        :value="user.id"
                      >
                        {{ user.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="">Choose Parent Office:</label>
                    <select
                      id=""
                      v-model="parent_id"
                      class="form-control"
                    >
                      <option value="">
                        None
                      </option>
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
                    <button
                      class="btn btn-primary btn-block"
                      @click="createOffice()"
                    >
                      {{ loading?'Please wait...':'Submit' }}
                    </button>
                  </div>
                </div>
              </div>

            </div>
            <div class="col-md-12">

              <div class="card">
                <div class="card-body table-responsive">

                  <table class="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>DEPARMENT</th>
                        <th>ABBREV.</th>
                        <th>OFFICER</th>
                        <th>HEAD</th>
                        <th />

                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="office,key in offices"
                        :key="office.index"
                      >
                        <td>{{ key + 1 }}</td>
                        <td>{{ office.name }}</td>

                        <td>{{ office.abbrev }}</td>

                        <td>
                          <span class="badge badge-primary">
                            {{ office.officer?office.officer.name:'not assigned' }}
                          </span>
                        </td>
                        <td>
                          <span class="badge badge-primary">
                            {{ office.parent?office.parent.name:'null' }}
                          </span>
                        </td>

                        <td>
                          <div class="demo-inline-spacing">

                            <b-button
                              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                              v-b-modal.modal-center
                              class="bt-sm btn-success "
                              @click="setEditValues(office.id, office.name, office.abbrev, office.officer?office.officer.name:'', office.parent?office.parent.name:'')"
                            >
                              Edit
                            </b-button>

                          </div>
                        </td>

                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>

            </div>
          </div>

        </b-tab>
        <b-tab

          title="User Accounts"
        >
          <div class="col-md-6">
            <div class="form-group">
              <label for="">Fullname: </label>
              <input
                v-model="regname"
                type="text"
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="em">Email: </label>
              <input
                id="em"
                v-model="email"
                type="text"
                class="form-control"
              >
              <span class="text-danger">{{ email_error }}</span>
            </div>
            <div class="form-group">
              <label for="">Phone: </label>
              <input
                v-model="phone"
                type="text"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="pass">Create Password: </label>
              <input
                id="pass"
                v-model="password"
                type="text"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="">Account type:</label>
              <select
                id=""
                v-model="role"
                name=""
                class="form-control"
              >
                <option :value="'visitor'">
                  Visitor
                </option>
                <option :value="'staff'">
                  Staff
                </option>

              </select>
            </div>

            <div class="form-group mt-3">
              <button
                class="btn btn-primary btn-block"
                @click="createUserAccount()"
              >
                {{ loadingx?'Please wait...':' Create account' }}
              </button>
            </div>

          </div>

        </b-tab>
        <!-- <b-tab
          title="Disabled"

        >

        <div class="form-group">
            <input type="text" class="form-control">
        </div>

        </b-tab> -->

      </b-tabs>

    </b-card-code>

    <div class="container" />

  </div>
</template>

<script>
import axios from 'axios'
import BCardCode from '@core/components/b-card-code'
import Ripple from 'vue-ripple-directive'
import {
  BModal, BButton, VBModal, BAlert, BTabs, BTab, BCardText,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCardCode,
    BTabs,
    BCardText,
    BTab,
    BButton,
    BModal,
    BAlert,

  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      name: '',
      abbrev: '',
      desc: '',
      user_id: '',
      parent_id: '',

      edit_office_id: '',
      edit_name: '',
      edit_abbrev: '',
      edit_desc: '',
      edit_user_id: '',
      edit_parent_id: '',

      loading: false,
      users: [],
      offices: [],

      regname: '',
      email: '',
      password: '',
      role: '',
      phone: '',

      email_error: '',

      loadingx: false,
    }
  },
  mounted() {
    this.getOffices()
    this.getUsers()
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
    getUsers() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/users`,
        method: 'get',
      }).then(res => {
        console.log(res)
        this.users = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    createOffice() {
      this.loading = true
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/offices`,
        method: 'post',
        data: {
          name: this.name,
          abbrev: this.abbrev,
          desc: this.desc,
          user_id: this.user_id,
          parent_id: this.parent_id,
        },
      }).then(res => {
        this.loading = false
        console.log(res)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Office created',
            icon: 'EditIcon',
            variant: 'success',
          },
        })
        this.getOffices()
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },

    createUserAccount() {
      this.loadingx = true
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/users`,
        method: 'post',
        data: {
          name: this.regname,
          email: this.email,
          phone: this.phone,
          password: this.password,
          role: this.role,
        },
      }).then(res => {
        this.loadingx = false
        console.log(res)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'User account created',
            icon: 'EditIcon',
            variant: 'success',
          },
        })
        this.getUsers()
      }).catch(error => {
        this.loadingx = false
        console.log(error)

        // eslint-disable-next-line prefer-destructuring
        this.email_error = error.response.data.errors.email[0]
      })
    },

    updateOffice() {
      this.loading = true
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/offices/${this.edit_office_id}`,
        method: 'put',
        data: {
          name: this.edit_name,
          abbrev: this.edit_abbrev,
          desc: this.edit_desc,
          user_id: this.edit_user_id,
          parent_id: this.edit_parent_id,
        },
      }).then(res => {
        this.loading = false
        console.log(res)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Office updated',
            icon: 'EditIcon',
            variant: 'success',
          },
        })
        this.getOffices()
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },

    // eslint-disable-next-line camelcase
    setEditValues(edit_office_id, edit_name, edit_abbrev, edit_desc, edit_user_id, edit_parent_id) {
      // alert('set')
      // eslint-disable-next-line camelcase
      this.edit_office_id = edit_office_id
      // eslint-disable-next-line camelcase
      this.edit_name = edit_name
      // eslint-disable-next-line camelcase
      this.edit_abbrev = edit_abbrev
      // eslint-disable-next-line camelcase
      this.edit_desc = edit_desc
      // eslint-disable-next-line camelcase
      this.edit_user_id = edit_user_id
      // eslint-disable-next-line camelcase
      this.edit_parent_id = edit_parent_id
    },
  },
}
</script>

<style></style>
