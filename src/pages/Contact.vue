<template>
  <v-container fill-height class="d-flex align-center justify-center contact-page">
    <v-card 
      class="bg-steel business-card pa-12 text-center robust-border"
      max-width="600"
      elevation="24"
    >
      <div class="smithy-brand mb-8 amber-text">
        <h1 class="smithy-title text-h2 mb-2">{{ t.home.welcome }}</h1>
        <div class="text-overline letter-spacing-2 opacity-60">
          {{ t.home.subtitle }}
        </div>
      </div>

      <v-divider class="mb-10 robust-border border-amber"></v-divider>

      <div class="contact-details">
        <div class="mb-8">
          <div class="text-overline amber-text mb-1">{{ t.contact.phone }}</div>
          <a href="tel:55629571" class="text-h4 font-weight-light contact-link">55629571</a>
        </div>

        <div class="mb-8">
          <div class="text-overline amber-text mb-1">{{ t.contact.email }}</div>
          <a href="mailto:jaan59021@gmail.com" class="text-h4 font-weight-light contact-link">jaan59021@gmail.com</a>
        </div>

        <div>
          <div class="text-overline amber-text mb-1">{{ t.contact.location }}</div>
          <div class="text-h5 font-weight-light opacity-80">Viljandimaa, Eesti</div>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Contact',
  props: {
    lang: Object,
    t: Object
  }
}
</script>

<style scoped>
.contact-page {
  min-height: calc(100vh - 128px);
}

.business-card {
  border-radius: 24px !important;
  background-color: rgba(44, 44, 46, 0.9) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 109, 0, 0.3) !important;
}

.contact-link {
  color: var(--color-silver);
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: var(--color-ember);
}

.letter-spacing-2 {
  letter-spacing: 0.2rem !important;
}

.border-amber {
  border-color: rgba(255, 109, 0, 0.5) !important;
}

.opacity-60 {
  opacity: 0.6;
}

.opacity-80 {
  opacity: 0.8;
}

.ember-text {
  color: var(--color-ember);
}
</style>
