<template>
  <v-app id="app">
    <v-main>
      <v-app-bar prominent flat color="transparent">     
        <v-spacer></v-spacer>  
           <v-toolbar-title>
            <router-link to="/" class="page-title">{{title}}</router-link>
           </v-toolbar-title>
          <v-spacer></v-spacer>
      </v-app-bar>
      <v-container>
      <router-view :lang="lang" :api="api" :nodes="nodes" :categories="categories"></router-view>          
      <footer>
        <div id="contact">
            <div v-if="lang.value === 'et'">Info ja tellimine   mobiil: {{mobile}}   email: {{email}}</div>
            <div v-if="lang.value === 'en'">Info and ordering   mobile: {{mobile}}   email: {{email}}</div>
            <div v-if="lang.value === 'ru'">Информация и заказ  мобильный: {{mobile}} письмо: {{email}}</div>
            <div id="langs">
             <v-select       
              :items="langs"
              v-model="lang"
              prepend-icon="language"
              return-object>
               <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <img class="flag" :src="item.raw.image" style="width: 24px; margin-right: 8px;">
                    </template>
                  </v-list-item>
               </template>
              </v-select>
            </div>
        </div>
    </footer>
     </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    title: "Jaani Sepikoda",
    email: "jaan59021@gmail.com",
    mobile: "55629571",
    api: "https://www.dev.sepised.com",
    lang: { value: "et", text: "eesti" },
    langs: [
      { value: "et", text: "Eesti", image: new URL('@/assets/ee.png', import.meta.url).href },
      { value: "en", text: "English", image: new URL('@/assets/en.png', import.meta.url).href },
      { value: "ru", text: "Rусский", image: new URL('@/assets/ru.png', import.meta.url).href }
    ],
    categories: [],
    nodes: [],
    options: { mode: 'cors', headers: { 'Access-Control-Allow-Origin': '*' } }
  }),
  watch: {
    '$route.params': function (to) {
      if (to.lang != undefined) {
        const found = this.langs.find(l => l.value === to.lang)
        if (found) this.lang = found
      }
    }
  },
  created() {
    fetch(`${this.api}/jsonapi/node/sepis?include=field_photo,field_tag,field_detail`, this.options)
      .then(response => response.json())
      .then((data) => {
        this.processData(data)
      });
  },
  methods: {
    processData(data) {
      data.included.filter(d => d.type == "taxonomy_term--tags").map(d => {
        var map = {}
        map.nodes = []
        map.id = d.id
        map.title = d.attributes.name
        map.et = d.attributes.name
        map.ru = d.attributes.field_name_ru
        map.en = d.attributes.field_term_en
        if (this.categories.filter(c => c.id == map.id).length == 0) {
          this.categories.push(map)
        }
        return map;
      })

      let filemap = {}
      data.included.filter(d => d.type == "file--file").map(d => {
        filemap[d.id] = d;
      })

      data.data.map(n => {
        var nmap = {}
        nmap.id = n.id
        nmap.category = n.relationships.field_tag.data.id
        nmap.photo = n.relationships.field_photo.data.id
        nmap.ru = n.attributes.field_name_ru
        nmap.en = n.attributes.field_name_en
        nmap.title = n.attributes.title
        nmap.et = n.attributes.title
        nmap.promote = n.attributes.promote
        nmap.imagename = filemap[nmap.photo].attributes.filename

        nmap.details = n.relationships.field_detail.data.map(d => {
          return filemap[d.id].attributes.filename
        })
        this.nodes.push(nmap)
        return nmap;
      });

      if (data.links != undefined && data.links.next != undefined) {
        fetch(data.links.next.href, this.options)
          .then(response => response.json())
          .then((next) => {
            this.processData(next)
          });
      }
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'goudy';
  src: url('@/assets/goudy.ttf') format('truetype');
}

@font-face {
  font-family: 'arkhip';
  src: url('@/assets/Arkhip_font.ttf') format('truetype');
}

#app {
  background-color: #000;
  color: #fff;
  position: relative;
  background-image: url('@/assets/base/css/tuli2.jpg');
  background-position: center bottom;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  padding-bottom: 8px;
  text-align: center;
  font-size: 18px;
  color: #FDDE7C;
  background: rgba(10, 10, 10, 0.7);
  z-index: 100;
}

.page-title,
.page-title:hover {
  text-align: center;
  text-decoration: none;
  font-family: goudy, georgia, verdana, helvetica, sans-serif;
  font-size: 50px;
  color: #FDDE7C;
}

#contact {
  width: 100%;
  max-width: 800px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
}

#langs {
  position: absolute;
  right: 10px;
  width: 150px;
  top: -10px;
}

:deep(.v-input__details) {
  display: none;
}
</style>
