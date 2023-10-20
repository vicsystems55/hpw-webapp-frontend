<template>
  <!-- Error page-->
  <div class="container py-2">
    <b-link class="brand-logo d-flex justify-content-center">
        <img class="text-center" style="max-height: 50px;" src="@/assets/images/logo/logo.png" alt=""> <br>

        <h5 class="brand-text text-primary ml-1 mb-5">
          Federal Ministry of  <br> <span class="">Finance, Budget and National Planning</span> 
        </h5>
    </b-link>

    <div class="misc-inne p-2 p-sm-3">
      <div class="w-100 text-cente">
        <h3 class="mb-1 text-center">
         Contractor Application Form
        </h3>
       

        <div style="max-width: 400px;" class="col-md- mx-auto">
            <div class="form-group">
                <label for="">Contractor Name:</label>
                <input type="text" class="form-control " placeholder="Enter Contractor Name:">
            </div>
            <div class="form-group">
                <label for="">Contractor Address:</label>
                <input type="text" class="form-control " placeholder="Enter Contractor Address:">
            </div>
            <div class="form-group">
                <label for="">RC Number:</label>
                <input type="text" class="form-control " placeholder="Enter Contractor RC Number:">
            </div>
            <div class="form-group">
                <label for="">Phone:</label>
                <input type="text" class="form-control " placeholder="Enter Contractor Phone:">
            </div>
            <div class="form-group">
                <label for="">Email:</label>
                <input type="text" class="form-control " placeholder="Enter Contractor Email:">
            </div>
            <div class="form-group">
                <label for="">Brief:</label>
                <textarea name="" id="" cols="30" rows="10" placeholder="Enter brief of submission" class="form-control"></textarea>
            </div>

            <b-button
            variant="primary"
            class="mb-2 mt-2 btn-sm-block btn-block"
            :to="{path:'/'}"
            >
            Submit
            </b-button>

        </div>



 

        <!-- image -->
        <!-- <b-img
          fluid
          :src="imgUrl"
          alt="Error page"
        /> -->
      </div>
    </div>
  </div>
<!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import { BLink, BButton, BImg } from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'

export default {
  components: {
    VuexyLogo,
    BLink,
    BButton,
    BImg,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/error.svg'),
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/error-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
