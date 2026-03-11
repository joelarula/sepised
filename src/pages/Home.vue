<template>
  <v-container fluid class="pa-0 hero-container">
    <div class="hero-overlay d-flex align-center justify-center text-center">
      <div class="w-100 px-4">
        <h1 class="smithy-title text-h1 mb-6 pulse-ember">{{ t.home.welcome }}</h1>
        <p class="text-h5 mb-10 font-weight-light">{{ t.home.subtitle }}</p>
        <v-btn
          color="amber-darken-4"
          size="x-large"
          variant="outlined"
          class="minimal-button"
          :to="`/${lang.value}/portfolio`"
        >
          {{ t.home.viewPortfolio }}
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  props: {
    lang: Object,
    t: Object
  }
}
</script>

<style scoped>
.hero-container {
  height: calc(100vh - 64px);
  background: transparent;
}

.hero-overlay {
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.smithy-title {
  color: #FDDE7C;
  text-shadow: 0 0 20px rgba(253, 222, 124, 0.4);
}
</style>
