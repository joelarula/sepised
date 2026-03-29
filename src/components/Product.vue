<template>
  <v-container class="py-10">
    <v-row class="mb-6 align-center">
      <v-col cols="4">
        <v-btn
          variant="text"
          prepend-icon="md:arrow_back"
          class="minimal-button"
          :to="`/${lang.value}/portfolio`"
        >
          {{ t.product.back }}
        </v-btn>
      </v-col>
      <v-col cols="4" class="text-center">
        <div class="text-caption text-uppercase letter-spacing-2 opacity-60">
          {{ getCategoryName }}
        </div>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn-group variant="outlined" density="comfortable" class="robust-border">
          <v-btn 
            icon="md:chevron_left" 
            @click="navigate(-1)" 
            :disabled="!hasPrev"
          ></v-btn>
          <v-btn 
            icon="md:chevron_right" 
            @click="navigate(1)" 
            :disabled="!hasNext"
          ></v-btn>
        </v-btn-group>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="7" class="text-center">
        <!-- Title on Top -->
        <h1 class="smithy-title text-h2 mb-8 brand-color-text font-weight-light">{{ getTitle }}</h1>
        
        <v-hover v-slot="{ isHovering, props }">
          <v-card 
            v-bind="props" 
            flat 
            class="bg-transparent overflow-hidden mb-6" 
            @click="overlay = true"
          >
            <v-img
              :src="getPreview"
              contain
              class="catalogimg transition-swing mx-auto"
              :style="isHovering ? 'transform: scale(1.02); cursor: zoom-in' : ''"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="amber"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-card>
        </v-hover>
        
        <!-- Detail Thumbnails Centered -->
        <v-row v-if="hasDetails" class="mb-8 justify-center">
          <v-col 
            v-for="(d, i) in details" 
            :key="i"
            cols="3"
            sm="2"
          >
            <v-card 
              flat 
              @click="loadDetail(d)"
              class="robust-border bg-steel"
              style="cursor: pointer"
            >
              <v-img :src="getDetailUrl(d)" aspect-ratio="1" cover></v-img>
            </v-card>
          </v-col>
        </v-row>

        <!-- Buttons removed temporarily per user request -->
      </v-col>
    </v-row>

    <!-- Full Screen Lightbox -->
    <v-dialog v-model="overlay" transition="dialog-fade-transition" fullscreen>
      <v-card class="bg-charcoal d-flex flex-column">
        <v-toolbar color="transparent" flat density="comfortable">
          <v-spacer></v-spacer>
          <v-btn icon="md:close" @click="overlay = false" size="large"></v-btn>
        </v-toolbar>
        <v-card-text class="d-flex align-center justify-center pa-0 flex-grow-1 overflow-hidden">
           <v-btn 
            icon="md:chevron_left" 
            position="fixed" 
            style="left: 20px; z-index: 10;" 
            size="x-large"
            variant="text"
            @click="navigate(-1)"
            v-if="hasPrev"
          ></v-btn>
          
          <v-img 
            :src="src || getOriginal" 
            contain 
            max-height="90vh" 
            max-width="95vw"
          ></v-img>

          <v-btn 
            icon="md:chevron_right" 
            position="fixed" 
            style="right: 20px; z-index: 10;" 
            size="x-large"
            variant="text"
            @click="navigate(1)"
            v-if="hasNext"
          ></v-btn>
        </v-card-text>
        <div class="text-center py-4 bg-charcoal smithy-title text-h6 amber-text">
          {{ getTitle }}
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Product',
  props: {
    api: String,
    lang: Object,
    categories: Array,
    nodes: Array,
    t: Object
  },
  data: () => ({
    overlay: false,
    src: ""
  }),
  watch: {
    '$route.params.product'() {
      this.src = ""
    }
  },
  computed: {
    selectedNode() {
      const { product } = this.$route.params
      return this.nodes.find(n => n.slug === product) || null
    },
    routeCategory() {
      return this.$route.params.category || null
    },
    categoryNodes() {
      if (!this.routeCategory) return this.nodes
      return this.nodes.filter(n => n.categories.includes(this.routeCategory))
    },
    currentIndex() {
      if (!this.selectedNode) return -1
      return this.categoryNodes.findIndex(n => n.id === this.selectedNode.id)
    },
    hasPrev() { return this.currentIndex > 0 },
    hasNext() { return this.currentIndex !== -1 && this.currentIndex < this.categoryNodes.length - 1 },
    getTitle() {
      if (!this.selectedNode) return ''
      return this.selectedNode[this.lang.value] || this.selectedNode.title
    },
    getCategoryName() {
      if (!this.routeCategory) return ''
      const cat = this.categories.find(c => c.id === this.routeCategory)
      return cat ? (cat[this.lang.value] || cat.title) : ''
    },
    getPreview() {
      if (!this.selectedNode) return ''
      return this.selectedNode.largeimage || this.selectedNode.imagename
    },
    getOriginal() {
      if (!this.selectedNode || (!this.selectedNode.originalimage && !this.selectedNode.imagename)) return '';
      return this.selectedNode.originalimage || this.selectedNode.imagename;
    },
    hasDetails() {
      return this.selectedNode?.details?.length > 0
    },
    details() {
      return this.selectedNode?.details || []
    }
  },
  methods: {
    getDetailUrl(d) {
      return `${this.api}/sites/default/files/styles/large/public/sepised/${d}`
    },
    loadDetail(d) {
      this.src = this.getDetailUrl(d)
      this.overlay = true
    },
    loadPhoto() {
      this.src = this.getPreview
      this.overlay = true
    },
    navigate(step) {
      const nextIndex = this.currentIndex + step
      if (nextIndex >= 0 && nextIndex < this.categoryNodes.length) {
        const nextNode = this.categoryNodes[nextIndex]
        const catSlug = this.routeCategory || (nextNode.categories.length > 0 ? nextNode.categories[0] : 'general')
        this.src = "" // Reset focus to main image
        this.$router.push(`/${this.lang.value}/portfolio/${catSlug}/${nextNode.slug}`)
      }
    }
  }
}
</script>

<style scoped>
.bg-charcoal { background-color: var(--color-charcoal) !important; }
.bg-steel { background-color: var(--color-steel) !important; }
.letter-spacing-2 { letter-spacing: 0.2rem; }
.opacity-60 { opacity: 0.6; }
.brand-color-text { color: #FDDE7C !important; }
.font-weight-light { font-weight: 300 !important; }

.catalogimg {
  max-height: 70vh;
  width: auto;
  max-width: 100%;
  margin: auto;
  border-radius: var(--border-radius);
  transition: transform 0.5s cubic-bezier(0.2, 1, 0.3, 1);
  image-rendering: -webkit-optimize-contrast; /* Webkit */
  image-rendering: high-quality;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}

.gap-4 { gap: 1rem; }
</style>
