<template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
    <!-- Lottie animation -->
    <lottie-player
      src="https://assets7.lottiefiles.com/packages/lf20_jbrw3hcz.json"
      background="transparent"
      speed="1"
      style="width: 250px; height: 250px;"
      loop
      autoplay
    ></lottie-player>

    <h2 class="mt-4">🎉 Course Created Successfully!</h2>
    <p>Your new course is live and ready to be managed.</p>

    <router-link to="/all-courses">
      <button class="btn btn-primary mt-3 px-4 py-2">
        View Courses
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'CourseSuccess',
}
</script>
