<template>
  <div class=" bg-light vh-100 overflow-auto">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center  py-2">
      <h2>Welcome, John Doe 👋</h2>
     
    </div>

<!-- Stats Cards -->
<div class="row">
  <div class="col-md-4" v-for="(stat, key) in stats" :key="key">
    <div class="card shadow-sm d-flex flex-row align-items-center p-3">
      <!-- Image -->
      <div class="me-3">
        <img :src="stat.image" alt="icon" width="50" height="50" />
      </div>

      <!-- Text -->
      <div class="px-2">
        <h4 class="text-muted text-capitalize">{{ key }}</h4>
        <h3 class="mb-0">{{ stat.value }}</h3>
      </div>
    </div>
  </div>
</div>


    <!-- Performance & Activities -->
    <div class="row">
      <!-- Performance -->
      <div class="col-md-6 ">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Performance Overview</h5>
            <div class="text-center text-muted py-5">
              📈 Chart Placeholder
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="col-md-6 ">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Recent Activities</h5>
            <ul class="list-group list-group-flush">
              <li
                v-for="(act, index) in activities"
                :key="index"
                class="list-group-item"
              >
                {{ act.text }}
                <small class="text-muted">({{ act.time }})</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StaffDashboard",
  data() {
    return {
         stats: {
        residents: { 
          value: 128, 
          image: "https://img.icons8.com/?size=100&id=97612&format=png&color=000000" 
        },
        "tasks pending": { 
          value: 12, 
          image: "https://img.icons8.com/?size=100&id=9w0CNdCWMuaG&format=png&color=000000" 
        },
        trainings: { 
          value: 4, 
          image: "https://img.icons8.com/?size=100&id=DSj9lwk4x4z4&format=png&color=000000" 
        },
      },
      activities: [
        { text: "Completed training: 'First Aid'", time: "2h ago" },
        { text: "Updated Resident Record #453", time: "5h ago" },
        { text: "New notification from Admin", time: "1d ago" },
      ],
    };
  },
};
</script>
