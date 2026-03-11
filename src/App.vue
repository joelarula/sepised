<template>
  <v-app id="app">
    <v-app-bar 
      flat 
      color="transparent" 
      class="robust-border-bottom"
      density="comfortable"
      absolute
    >
      <v-container class="d-flex align-center pa-0 fill-height" fluid style="position: relative;">
        <div v-if="!isContactPage" class="smithy-brand desktop-center-title">
          <router-link :to="`/${lang.value}`" class="nav-brand-goudy">{{title}}</router-link>
        </div>

        <v-spacer></v-spacer>

        <div class="hidden-sm-and-down d-flex align-center pr-4">
          <v-btn
            :to="`/${lang.value}`"
            variant="text"
            class="minimal-button mx-1"
            :active="isActive('')"
          >
            {{ navItems[0].title }}
          </v-btn>

          <!-- Portfolio with Categories Submenu -->
          <v-menu open-on-hover transition="slide-y-transition">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="minimal-button mx-1"
                :to="`/${lang.value}/portfolio`"
                :active="isActive('/portfolio')"
                append-icon="md:expand_more"
              >
                {{ navItems[1].title }}
              </v-btn>
            </template>
            <v-list class="bg-steel robust-border border-amber">
              <v-list-item
                v-for="cat in categories"
                :key="cat.id"
                :to="`/${lang.value}/portfolio?category=${cat.id}`"
                class="minimal-button"
                active-class="active-nav-item"
              >
                <v-list-item-title class="text-uppercase text-caption">{{ cat[lang.value] || cat.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            :to="`/${lang.value}/contact`"
            variant="text"
            class="minimal-button mx-1"
            :active="isActive('/contact')"
          >
            {{ navItems[2].title }}
          </v-btn>

          <!-- Language Switcher refined and moved right -->
          <v-menu location="start">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="text" size="small" icon class="ml-4">
                <v-icon size="small" color="amber">md:language</v-icon>
              </v-btn>
            </template>
            <v-list class="bg-steel robust-border">
              <v-list-item
                v-for="l in langs"
                :key="l.value"
                @click="switchLang(l)"
                min-width="120"
              >
                <v-list-item-title class="text-caption d-flex align-center">
                  <img :src="l.image" class="mr-2" style="width: 16px">
                  {{ l.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- Mobile Menu Toggle -->
        <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary color="charcoal">
      <v-list>
        <v-list-item v-for="item in navItems" :key="item.path" :to="`/${lang.value}${item.path}`">
          <v-list-item-title class="minimal-button">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view :lang="lang" :api="api" :nodes="nodes" :categories="categories" :t="t"></router-view>
    </v-main>

    <v-footer color="transparent" class="pa-12"></v-footer>
  </v-app>
</template>

<script>
import et from './i18n/et.json'
import en from './i18n/en.json'
import ru from './i18n/ru.json'

export default {
  name: 'App',
  data: () => ({
    title: "Jaani Sepikoda",
    drawer: false,
    api: "https://www.dev.sepised.com",
    lang: { value: "et", text: "Eesti" },
    translations: { et, en, ru },
    langs: [
      { value: "et", text: "Eesti", image: new URL('@/assets/ee.png', import.meta.url).href },
      { value: "en", text: "English", image: new URL('@/assets/en.png', import.meta.url).href },
      { value: "ru", text: "Rусский", image: new URL('@/assets/ru.png', import.meta.url).href }
    ],
    categories: [],
    nodes: [],
    options: { mode: 'cors', headers: { 'Access-Control-Allow-Origin': '*' } }
  }),
  computed: {
    isContactPage() {
      return this.$route.path.endsWith('/contact')
    },
    t() {
      return this.translations[this.lang.value]
    },
    navItems() {
      return [
        { title: this.t.nav.home, path: '' },
        { title: this.t.nav.portfolio, path: '/portfolio' },
        { title: this.t.nav.contact, path: '/contact' }
      ]
    }
  },
  watch: {
    '$route.params': function (to) {
      if (to.lang && to.lang !== this.lang.value) {
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
    isActive(path) {
      const fullPath = this.$route.path;
      if (path === '') return fullPath === `/${this.lang.value}` || fullPath === `/${this.lang.value}/`;
      return fullPath.startsWith(`/${this.lang.value}${path}`);
    },
    switchLang(l) {
      this.lang = l;
      const newPath = this.$route.path.replace(/^\/(et|en|ru)/, `/${l.value}`) || `/${l.value}`;
      this.$router.push(newPath);
    },
    processData(data) {
      const rawCategories = data.included.filter(d => d.type == "taxonomy_term--tags").map(d => ({
        id: d.id,
        title: d.attributes.name,
        et: d.attributes.name,
        ru: d.attributes.field_name_ru,
        en: d.attributes.field_term_en
      }));
      
      rawCategories.forEach(cat => {
        if (!this.categories.some(c => c.id === cat.id)) this.categories.push(cat);
      });

      const filemap = {};
      data.included.filter(d => d.type == "file--file").forEach(d => {
        filemap[d.id] = d;
      });

      data.data.forEach(n => {
        const nmap = {
          id: n.id,
          category: n.relationships.field_tag.data.id,
          photo: n.relationships.field_photo.data.id,
          ru: n.attributes.field_name_ru,
          en: n.attributes.field_name_en,
          title: n.attributes.title,
          et: n.attributes.title,
          promote: n.attributes.promote,
          imagename: filemap[n.relationships.field_photo.data.id]?.attributes.filename,
          details: n.relationships.field_detail.data.map(d => filemap[d.id]?.attributes.filename)
        };
        if (!this.nodes.some(existing => existing.id === nmap.id)) this.nodes.push(nmap);
      });

      if (data.links?.next) {
        fetch(data.links.next.href, this.options)
          .then(res => res.json())
          .then(next => this.processData(next));
      }
    }
  }
};
</script>

<style scoped>
#app {
  background: transparent !important;
}

.nav-brand-goudy {
  font-family: 'arkhip', sans-serif;
  font-size: 42px;
  color: #FDDE7C;
  text-decoration: none;
  line-height: 1;
  font-weight: normal;
  letter-spacing: 2px;
}

.robust-border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.border-amber {
  border: 1px solid var(--color-ember) !important;
}

.bg-steel {
  background-color: var(--color-steel) !important;
}

.active-nav-item {
  color: var(--color-ember) !important;
  border: 1px solid var(--color-ember) !important;
}

@media (min-width: 960px) {
  .desktop-center-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
}

.smithy-brand {
  transition: padding var(--transition-speed);
}

@media (min-width: 960px) {
  .smithy-brand {
    padding-top: 20px;
  }
}

.opacity-60 {
  opacity: 0.6;
}
</style>
