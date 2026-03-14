<template>
<v-container>
   <v-row class="frontpage">
      <v-col
        v-for="c in filteredCategories" 
        :key="c.id"
        class="d-flex child-flex catalogcolumn"
        cols="12"
        sm="6"
        md="4"
    >
  <div class="imageheader">
      <router-link :to="getCatalogLink(c)" class="categoryLink">
        {{getName(c)}}
      </router-link>
  </div>
  <div class="imgcontainer">
      <router-link :to="getCatalogLink(c)" >
      <v-img
        :src="getPreview(c)"
        aspect-ratio="1"
        max-height="180"  
        max-width="180"   
        class="catalogimg"            
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
      </router-link>
    </div>
    </v-col>
   </v-row>
</v-container>
</template>

<script>
export default {
  name: 'Frontend',
  props:{
    api: String,
    lang: Object,
    nodes: Array,
    categories: Array
  },
  computed:{
    filteredCategories(){
      return this.categories
    }
  },
  methods:{
    getName(category){
      return category[this.lang.value] != undefined ? category[this.lang.value] : category.title
    },
    getPreview(category){
      let nodes = this.nodes.filter(n=> n.category == category.id)
      let node = nodes.find(n=>n.promote)
      if(node == undefined){
        node = nodes[0]
      }    
      if (!node) return ''
      return this.getImage(node)
    },
    getImage(node) {
      if (!node.imagename) return '';
      return node.imagename;
    },
    getCatalogLink(category){
      return `/${this.lang.value}/${category.title}`
    }
  }
}
</script>

<style scoped>
.catalogcolumn{
 flex-direction: column;
}

.imageheader{
  text-align: center;
}

:deep(.categoryLink) {
    text-decoration: none;
    font-family: goudy, georgia, verdana, helvetica, sans-serif;
    font-size: 26px;
    color: #FDDE7C;
}

.frontpage{
  padding-top: 50px
}

.imgcontainer{
  padding: 4px 20px 50px
}

.catalogimg {
  margin: auto;
  border-radius: 4px;
}
</style>
