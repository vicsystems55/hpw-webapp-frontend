<template>
  <div class="d-flex flex-column align-items-center justify-content-center text-center" >
    <!-- Lottie Animation -->
    <lottie-player
      src="https://assets9.lottiefiles.com/packages/lf20_jbrw3hcz.json"
      background="transparent"
      speed="1"
      style="width: 300px; height: 300px;"
      autoplay
    />

    <h2 class="mt-4">🎉 Assessment Completed!</h2>
    <p class="text-muted">Great job! You’ve successfully submitted your answers.</p>

    <!-- Button -->
    <router-link to="/my-performance">
      <button class="btn btn-primary btn-lg mt-3">
        View My Performance
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'AssessmentCompleted',
};
</script>


<style scoped>
h2 {
  font-weight: bold;
}
</style>
