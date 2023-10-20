<template>
  <div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <dark-Toggler class="d-none d-lg-block" />

      <div class="text-center mx-auto">

        <h4 class="btn btn-primary ">
          {{ userData.name }}
        </h4>

      </div>

    </div>

    <b-navbar-nav class="nav align-items-center ml-auto ">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{userData.name.toUpperCase()}}
            </p>
            <span class="user-status">..</span>
          </div>
          <b-avatar
            size="40"
            variant="light-primary"
            badge
            :src="require('@/assets/images/user.png')"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon
            size="16"
            icon="UserIcon"
            class="mr-50"
          />
          <span>Profile</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon
            size="16"
            icon="MailIcon"
            class="mr-50"
          />
          <span>Messages</span>
        </b-dropdown-item>

        <b-dropdown-divider />

        <b-dropdown-item @click="logOut()" link-class="d-flex align-items-center">
          <feather-icon
            size="16"
            icon="LogOutIcon"
            class="mr-50"
          />
          <span >Logout</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,

    // Navbar Components
    DarkToggler,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      dashboardTitle: '',
      userData: '',
    }
  },

  mounted() {
    this.userData = JSON.parse(localStorage.getItem('user_data'));
    console.log(this.userData)
    if (localStorage.getItem('user_role') === 'visitor') {

      this.dashboardTitle = 'VISITOR'
      
    }else{

      this.dashboardTitle = 'DEPT. : '
    }
  },

  methods: {
    logOut() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Logged out',
          icon: 'EditIcon',
          variant: 'success',
        },
      })

      localStorage.removeItem('user_role')
      localStorage.removeItem('token')
      localStorage.removeItem('user_data')



      this.$router.push('/login')
    },
  },
}
</script>
