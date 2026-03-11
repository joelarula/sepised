<template>
  <v-container>
    <v-row class="mb-10 align-center">
      <v-col cols="12" md="6">
        <h1 class="smithy-title text-h3">{{ t.portfolio.title }}</h1>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          :placeholder="t.portfolio.searchPlaceholder"
          prepend-inner-icon="md:search"
          variant="underlined"
          hide-details
          color="amber"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12">
        <v-chip-group v-model="selectedCategory" selected-class="active-chip">
          <v-chip
            key="all"
            :value="null"
            variant="outlined"
            class="minimal-button"
            rounded="0"
            @click="selectedCategory = null"
          >
            {{ t.portfolio.all }}
          </v-chip>
          <v-chip
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
            variant="outlined"
            class="minimal-button"
            rounded="0"
            @click="selectedCategory = cat.id"
          >
            {{ getCatName(cat) }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="node in filteredNodes"
        :key="node.id"
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
            :to="`/${lang.value}/portfolio/${getCatTitle(node)}/${node.title}`"
          >
            <v-img
              :src="getPreview(node)"
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
                  class="d-flex transition-fast-in-fast-out bg-amber-darken-4 v-card--reveal text-h6 text-white text-center pa-2 smithy-title"
                  style="height: 100%; opacity: 0.9;"
                >
                  {{ getNodeName(node) }}
                </div>
              </v-fade-transition>
            </v-img>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Portfolio',
  props: {
    api: String,
    lang: Object,
    nodes: Array,
    categories: Array,
    t: Object
  },
  data: () => ({
    search: '',
    selectedCategory: null
  }),
  mounted() {
    this.handleQueryParam()
  },
  watch: {
    '$route.query': 'handleQueryParam'
  },
  computed: {
    filteredNodes() {
      let filtered = this.nodes
      
      if (this.selectedCategory) {
        filtered = filtered.filter(n => n.category === this.selectedCategory)
      }
      
      if (this.search) {
        const query = this.search.toLowerCase()
        filtered = filtered.filter(n => 
          n.title.toLowerCase().includes(query) || 
          (n.en && n.en.toLowerCase().includes(query)) ||
          (n.ru && n.ru.toLowerCase().includes(query))
        )
      }
      
      return filtered
    }
  },
  methods: {
    getCatName(cat) {
      return cat[this.lang.value] || cat.title
    },
    getCatTitle(node) {
      const cat = this.categories.find(c => c.id === node.category)
      return cat ? cat.title : 'general'
    },
    getNodeName(node) {
      return node[this.lang.value] || node.title
    },
    getPreview(node) {
      return `${this.api}/sites/default/files/styles/medium/public/sepised/${node.imagename}`
    },
    handleQueryParam() {
      if (this.$route.query.category) {
        this.selectedCategory = this.$route.query.category
      } else {
        this.selectedCategory = null
      }
    }
  }
}
</script>

<style scoped>
.bg-steel {
  background-color: var(--color-steel) !important;
}

.active-chip {
  color: var(--color-ember) !important;
  border-color: var(--color-ember) !important;
  background-color: rgba(255, 109, 0, 0.1) !important;
  box-shadow: 0 0 10px var(--color-ember-glow) !important;
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  position: absolute;
  width: 100%;
}
</style>
