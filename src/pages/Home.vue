<template>
  <v-container fluid class="pa-0 hero-container">
    <div class="hero-overlay d-flex align-center justify-center text-center">
      <div class="hero-content px-4">
        <h1 class="smithy-title text-h1 mb-6 pulse-ember" style="padding-top: 72px;">{{ homePage?.title || t.home.welcome }}</h1>
        <div
          v-if="homePage?.content"
          class="home-content text-h6 font-weight-light mb-10"
          v-html="homePage.content"
        ></div>
        <p v-else class="text-h5 mb-10 font-weight-light">{{ t.home.subtitle }}</p>



        <!-- Add margin between intro and grid -->
        <div style="margin-bottom: 64px;"></div>

        <!-- Category image grid below intro -->
        <v-row class="mb-8" justify="center" v-if="categories && nodes && categories.length && nodes.length">
          <template v-for="(cat, i) in categories" :key="cat && cat.id ? cat.id : i">
            <v-col
              v-if="randomNodes[cat.id]"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :elevation="isHovering ? 8 : 2"
                  class="robust-border bg-steel overflow-hidden"
                  style="position: relative;"
                  :to="`/${lang.value}/portfolio?category=${cat.id}`"
                >
                  <v-img
                    :src="randomNodes[cat.id].imagename"
                    :alt="cat[lang.value] || cat.title"
                    aspect-ratio="1"
                    cover
                    class="align-end"
                  >
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="amber"></v-progress-circular>
                      </v-row>
                    </template>
                    <v-fade-transition>
                      <div
                        v-if="isHovering"
                        class="d-flex transition-fast-in-fast-out hover-overlay v-card--reveal text-h6 text-white text-center pa-2 smithy-title"
                        style="height: 100%;"
                      >
                        {{ cat[lang.value] || cat.title }}
                      </div>
                    </v-fade-transition>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
          </template>
        </v-row>

        <!-- Portfolio button at the bottom -->
        <v-btn
          color="amber-darken-4"
          size="x-large"
          variant="outlined"
          class="minimal-button mt-4"
          :to="`/${lang.value}/portfolio`"
        >
          {{ t.home.viewPortfolio }}
        </v-btn>
        <div style="margin-bottom: 48px;"></div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { reactive, watch, onMounted } from 'vue';
export default {
  name: 'Home',
  props: {
    lang: Object,
    t: Object,
    homePage: Object,
    categories: Array,
    nodes: Array
  },
  setup(props) {
    const randomNodes = reactive({});

    function pickRandomNode(cat) {
      if (!cat || !cat.id || !Array.isArray(props.nodes)) return null;
      const matches = props.nodes.filter(n => {
        if (!Array.isArray(n.categories)) return false;
        return n.categories.includes(cat.id) || n.categories.includes(String(cat.id)) || n.categories.includes(Number(cat.id));
      });
      if (!matches.length) return null;
      const idx = Math.floor(Math.random() * matches.length);
      return matches[idx];
    }

    function assignRandomNodes() {
      if (!props.categories || !props.nodes) return;
      props.categories.forEach(cat => {
        randomNodes[cat.id] = pickRandomNode(cat);
      });
    }

    watch(() => [props.categories, props.nodes], assignRandomNodes, { immediate: true, deep: true });
    onMounted(assignRandomNodes);

    return { randomNodes };
  }
}
</script>

<style scoped>

.hover-overlay {
  background-color: rgba(75, 68, 83, 0.75) !important;
}

.category-card {
  width: 100%;
  max-width: 320px;
  margin: 0 auto 24px auto;
}
.hero-container {
  background: transparent;
}

.hero-overlay {
  height: 100%;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}


.smithy-title {
  color: #FDDE7C;
  text-shadow: 0 0 20px rgba(253, 222, 124, 0.4);
}

.v-card--reveal {
  align-items: flex-end;
  bottom: 0;
  justify-content: center;
  position: absolute;
  width: 100%;
}

.home-content {
  color: var(--color-silver);
  line-height: 1.8;
}

.alasi-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 320px;
  width: 90%;
  height: auto;
  filter: drop-shadow(0 6px 32px rgba(0,0,0,0.85)) drop-shadow(0 0 24px #ff6d00aa);
  transition: max-width 0.3s;
}

.home-content :deep(p) {
  margin-bottom: 1rem;
}

.home-content :deep(strong) {
  color: #ff6d00;
}
</style>
