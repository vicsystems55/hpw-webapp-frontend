<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <img
          style="max-height: 50px;"
          src="@/assets/images/logo/logo.png"
          alt=""
        >
        <h5 class="brand-text text-primary ml-1 mb-5">
          Federal Ministry of  <br> <span class="">Finance, Budget and National Planning</span>
        </h5>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title
            title-tag="h4"
            class="font-weight-bold mb-1"
          >
            <span class="text-success h3">Welcome to: </span> <br> Enterprise Incoming and Outgoing Mails and Documents Management System <br>
            <span class="text-success h6"> Tracking and Follow-Up</span>

          </b-card-title>
          <b-card-text class="mb-2">
            Please sign-in to your account.
          </b-card-text>

          <!-- form -->
          <validation-observer ref="loginValidation">
            <div
              class="auth-login-form mt-2"
              @submit.prevent
            >
              <!-- email -->

              <b-form-group
                label="Fullname"
                label-for="full-name"
              >
                <b-form-input
                  id="full-name"
                  v-model="name"
                  name="fullname"
                  placeholder="Enter your name"
                />
              </b-form-group>
              <b-form-group
                label="Email"
                label-for="login-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="login-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false:null"
                    name="login-email"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ email_error }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">Password</label>
                  <b-link :to="{name:'auth-forgot-password-v2'}">
                    <small>Forgot Password?</small>
                  </b-link>
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- checkbox -->
              <!-- <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="status"
                  name="checkbox-1"
                >
                  Remember Me
                </b-form-checkbox>
              </b-form-group> -->

              <!-- submit buttons -->
              <b-button

                variant="primary"
                block
                @click="validationForm"
              >

                {{ loading?'Please wait...':'Sign Up' }}
              </b-button>
            </div>
          </validation-observer>

          <b-card-text class="text-center mt-2">
            <span>Already have an account? </span>
            <b-link :to="'/login'">
              <span>&nbsp;Sign in</span>
            </b-link>
          </b-card-text>

          <!-- divider -->
          <!-- <div class="divider my-2">
            <div class="divider-text">
              or
            </div>
          </div> -->

          <!-- social buttons -->
          <!-- <div class="auth-footer-btn d-flex justify-content-center">
            <b-button
              variant="facebook"
              href="javascript:void(0)"
            >
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button
              variant="twitter"
              href="javascript:void(0)"
            >
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button
              variant="google"
              href="javascript:void(0)"
            >
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button
              variant="github"
              href="javascript:void(0)"
            >
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div> -->
        </b-col>
      </b-col>
    <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import axios from 'axios'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BRow, BCol, BLink, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BFormCheckbox, BCardText, BCardTitle, BImg, BForm, BButton,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      name: '',
      password: '',
      userEmail: '',
      loading: false,
      email_error: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),
      // validation rulesimport store from '@/store/index'
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    validationForm() {
      this.$refs.loginValidation.validate().then(success => {
        this.loading = true
        // alert(process.env.VUE_APP_BACKEND_URL)
        if (success) {
          axios({
            url: `${process.env.VUE_APP_BACKEND_URL}/api/register`,
            // url: 'http://localhost:8989/api/register',
            method: 'post',
            data: {
              name: this.name,
              password: this.password,
              email: this.userEmail,
            },
          }).then(res => {
            console.log(res)
            localStorage.setItem('user_role', res.data.user_data.role)
            localStorage.setItem('token', res.data.access_token)
            localStorage.setItem('user_data', JSON.stringify(res.data.user_data))
            this.loading = false

            this.$router.push('/')

            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Account created',
                icon: 'EditIcon',
                variant: 'success',
              },
            })

            this.$router.push('/')
          }).catch(error => {
            this.loading = false
            // alert(error.response.data.errors.email[0])
            // eslint-disable-next-line prefer-destructuring
            this.email_error = error.response.data.errors.email[0]
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
