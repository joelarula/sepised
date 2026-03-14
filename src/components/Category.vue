<template>
  <v-container>
    <v-row >
      <v-col cols="12" class="cat-title">{{ getTitle }}</v-col>
    </v-row>
    <v-row class="frontpage">
      <v-col
        v-for="n in filteredNodes" 
        :key="n.id"
        class="d-flex child-flex catalogcolumn"
        cols="12"
        sm="6"
        md="4"
    >
  <div class="imageheader">
      <router-link :to="getNodeLink(n)" class="imageLink">
        {{getNodeName(n)}}
      </router-link>
  </div>
  <div class="imgcontainer">
      <router-link :to="getNodeLink(n)" >
      <v-img
        :src="getImage(n)"
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
  name: 'Category',
  props:{
    api: String,
    lang: Object,
    categories: Array,
    nodes: Array
  },
  computed:{
    selectedCategory(){
      let rc = this.$route.params.category
      let cat = this.categories.filter(c=> c.title === rc)
      return cat.length > 0 ? cat[0]: {id:""}
    },
    filteredNodes (){
      let nd = this.nodes
      let cid = this.selectedCategory.id;
      return nd.filter(n => n.category === cid);
    },
    getTitle(){
      return this.selectedCategory[this.lang.value] != undefined ? this.selectedCategory[this.lang.value] : this.selectedCategory.title
    }
  },
  methods:{
    getImage(node) {
      if (!node.imagename) return '';
      return node.imagename;
    },
    getNodeLink(node){
      return `/${this.lang.value}/${this.selectedCategory.title}/${node.title}`
    },
    getNodeName(node){
      return node[this.lang.value] != undefined ? node[this.lang.value] : node.title
    }
  }
}
</script>

<style scoped>
.cat-title {
    text-align: center;
    text-decoration: none;
    font-family: goudy, georgia, verdana, helvetica, sans-serif;
    font-size: 28px;
    color: #FDDE7C;
    cursor: pointer;
}

.imageheader{
  text-align: center;
}

.catalogcolumn{
 flex-direction: column;
}

:deep(.imageLink) {
    text-decoration: none;
    font-family: goudy, georgia, verdana, helvetica, sans-serif;
    font-size: 22px;
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
