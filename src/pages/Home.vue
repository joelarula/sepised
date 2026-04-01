<template>
  <v-container fluid class="pa-0 hero-container">
    <div class="hero-overlay d-flex align-center justify-center text-center">
      <div class="hero-content px-4">
        <h1 class="smithy-title text-h1 mb-6 pulse-ember">{{ homePage?.title || t.home.welcome }}</h1>
        <div
          v-if="homePage?.content"
          class="home-content text-h6 font-weight-light mb-10"
          v-html="homePage.content"
        ></div>
        <p v-else class="text-h5 mb-10 font-weight-light">{{ t.home.subtitle }}</p>
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
    t: Object,
    homePage: Object
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

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.smithy-title {
  color: #FDDE7C;
  text-shadow: 0 0 20px rgba(253, 222, 124, 0.4);
}

.home-content {
  color: var(--color-silver);
  line-height: 1.8;
}

.home-content :deep(p) {
  margin-bottom: 1rem;
}

.home-content :deep(strong) {
  color: #ff6d00;
}
</style>
