<template>

  <div class="c">
    <h4>Supervison Date</h4>

    <p>
        {{ staffSupervisionData.next_supervision_date }}
    </p>

  </div>
</template>
<script>
import axios from 'axios'

export default {

  data() {
    return {
      staffSupervisionData: '',
    }
  },

  mounted() {
    this.getSupervisionData()
  },

  methods: {
    getSupervisionData() {
      axios({
        url: `${process.env.VUE_APP_BACKEND_URL}/api/staff-supervision/${this.$route.params.id}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then(res => {
        console.log(res)
        this.staffSupervisionData = res.data
      }).catch(error => {
        console.log(error)
      })
    },
  },

}
</script>
