<template>
<v-container>
   <v-row >
      <v-col cols="12" class="cat-title">
        <router-link :to="getCatalogLink()" class="categoryLink">
          {{ getCategoryTitle }}
        </router-link>
        </v-col>
    </v-row>
    <v-row >
      <v-col cols="12" class="product-title">{{ getTitle }}</v-col>
    </v-row>
    <v-row >
      <v-col cols="12" class="cat-title">
        <div class="imgcontainer">
      <v-img
        :src="getPreview()"
        @click="loadPhoto()"
        aspect-ratio="1"
        max-height="480"  
        max-width="480"   
        class="catalogimg"            
        style="cursor: pointer;"
      >
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="orange"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </div>
    </v-col>
  </v-row>
  <template v-if="hasDetails()">
    <v-row v-for="d in details()" :key="d">
      <v-col cols="12" >
          <v-img
          :src="getDetail(d)"
          @click="loadDetail(d)"
          aspect-ratio="1"
          max-height="180"  
          max-width="180"   
          class="catalogimg"            
          style="cursor: pointer;"
          ></v-img>
      </v-col>
    </v-row>
  </template>
  <v-dialog overlay-opacity="0.7" v-model="overlay">
    <v-card width="90vw" max-width="800" class="ma-auto">
      <v-card-title class="pa-0">
       <v-toolbar density="compact" flat>
          <v-toolbar-title>
           <span class="cat-title"> {{ getTitle }} </span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="md:close" @click="overlay = false"></v-btn>
        </v-toolbar>
        </v-card-title>
      <v-card-text class="text-center pa-4">
        <v-img 
            :src="src"
            aspect-ratio="1"
            contain
          ></v-img>
      </v-card-text>
      </v-card>
  </v-dialog>
</v-container>
</template>

<script>
export default {
  name: 'Product',
  props:{
    api: String,
    lang: Object,
    categories: Array,
    nodes: Array
  },
  data: () => ({
    overlay: false,
    src: ""
  }),
  computed:{
    selectedNode(){
      let rc = this.$route.params.product
      let cat = this.nodes.filter(n=> n.title === rc)
      return cat.length > 0 ? cat[0]: {id:""}
    },
    getTitle(){
      if (!this.selectedNode) return ''
      return this.selectedNode[this.lang.value] != undefined ? this.selectedNode[this.lang.value] : this.selectedNode.title
    },
    getCategoryTitle(){
      if (!this.selectedNode || !this.categories) return ''
      let cat = this.categories.find(c => c.id === this.selectedNode.category);
      if(cat != undefined && this.lang != undefined){
        return cat.title
      }
      return "";
    },
  },
  methods:{
    getPreview(){
      if (!this.selectedNode) return ''
      return `${this.api}/sites/default/files/styles/large/public/sepised/${this.selectedNode.imagename}`
    },
    getCatalogLink(){
      if (!this.selectedNode || !this.categories) return ''
      let cat = this.categories.find(c => c.id === this.selectedNode.category);
      if(cat != undefined && this.lang != undefined){
        return `/${this.lang.value}/${cat.title}`
      }
      return "";
    },
    hasDetails(){
      return this.selectedNode != undefined && this.selectedNode.details != undefined && this.selectedNode.details.length > 0
    },
    details(){
      return this.selectedNode != undefined && this.selectedNode.details != undefined && this.selectedNode.details.length > 0 ? this.selectedNode.details : []
    },
    getDetail(d){
      return `${this.api}/sites/default/files/styles/large/public/sepised/${d}`
    },
    loadDetail(d){
      this.src = `${this.api}/sites/default/files/styles/large/public/sepised/${d}`; 
      this.overlay = true;
    },
    loadPhoto(){
      if (!this.selectedNode) return
      this.src = `${this.api}/sites/default/files/styles/large/public/sepised/${this.selectedNode.imagename}`;
      this.overlay = true;
    }
  }
}
</script>

<style scoped>
.product-title {
    text-align: center;
    text-decoration: none;
    font-family: goudy, georgia, verdana, helvetica, sans-serif;
    font-size: 36px;
    color: #FDDE7C;
}

.cat-title {
    text-align: center;
    text-decoration: none;
    font-family: goudy, georgia, verdana, helvetica, sans-serif;
    font-size: 28px;
    color: #FDDE7C;
}

:deep(.categoryLink) {
    text-decoration: none;
    font-family: goudy, georgia, verdana, helvetica, sans-serif;
    font-size: 26px;
    color: #FDDE7C;
}

.imgcontainer{
  padding: 4px 20px 50px
}

.catalogimg {
  margin: auto;
  border-radius: 8px;
}
</style>
