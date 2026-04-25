<template>
  <v-app id="app">
    <v-app-bar 
      flat 
      color="transparent" 
      density="comfortable"
      absolute
    >
      <v-container class="d-flex align-center pa-0 fill-height" fluid style="position: relative;">
        <div v-if="!isContactPage" class="smithy-brand desktop-center-title">
          <router-link :to="`/${lang.value}`" class="nav-brand-goudy">{{title}}</router-link>
        </div>

        <v-spacer></v-spacer>

        <div class="header-desktop-menu d-flex align-center pr-4">
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
                :to="`/${lang.value}/portfolio`"
                class="minimal-button"
                active-class="active-nav-item"
              >
                <v-list-item-title class="text-uppercase text-caption">{{ t.portfolio.all }}</v-list-item-title>
              </v-list-item>
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
        <v-app-bar-nav-icon color="amber" class="header-mobile-toggle" @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary color="charcoal" location="right">
      <v-list>
        <v-list-item v-for="item in navItems" :key="item.path" :to="`/${lang.value}${item.path}`">
          <v-list-item-title class="minimal-button">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view 
        :lang="lang" 
        :t="t" 
        :categories="categories" 
        :nodes="nodes" 
        :api="api"
        :loading="loading"
        :home-page="homePage"
      ></router-view>
    </v-main>

    <v-footer
      v-if="!isContactPage"
      class="contact-footer d-flex align-center justify-center"
      style="background: rgba(44,44,46,0.45); border-top: 1px solid rgba(255,255,255,0.05); min-height: 64px; backdrop-filter: blur(8px);"
      height="auto"
    >
      <div class="d-flex flex-column flex-sm-row align-center justify-center w-100 text-center">
        <span class="mr-4 text-caption" style="color:#FDDE7C;">
          <v-icon :color="'#FDDE7C'" size="small" class="mr-1">md:mail</v-icon>
          <a href="mailto:jaan59021@gmail.com" class="footer-link" style="color:#FDDE7C;text-decoration:underline;">jaan59021@gmail.com</a>
        </span>
        <span class="mx-4 text-caption" style="color:#FDDE7C;">
          <v-icon :color="'#FDDE7C'" size="small" class="mr-1">md:call</v-icon>
          <a href="tel:55629571" class="footer-link" style="color:#FDDE7C;text-decoration:underline;">55629571</a>
        </span>
        <span class="ml-4 text-caption" style="color:#FDDE7C;">
          <v-icon :color="'#FDDE7C'" size="small" class="mr-1">md:location_on</v-icon>
          {{ t.contact.locationValue }}
        </span>
      </div>
    </v-footer>
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
    api: "https://tagatuba.sepised.com/graphql",
    lang: { value: "et", text: "Eesti" },
    translations: { et, en, ru },
    langs: [
      { text: "Eesti", value: "et", image: new URL('@/assets/ee.png', import.meta.url).href },
      { text: "English", value: "en", image: new URL('@/assets/en.png', import.meta.url).href },
      { text: "Rусский", value: "ru", image: new URL('@/assets/ru.png', import.meta.url).href }
    ],
    categories: [],
    nodes: [],
    homePage: null,
    loading: true,
    hasNextPage: false,
    endCursor: null
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
    this.fetchData();
    this.fetchHomePage();
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
    fetchHomePage() {
      const query = `
        query GetHomePage {
          page(id: "esileht", idType: URI) {
            title
            content
          }
        }
      `;

      fetch(this.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      .then(res => res.json())
      .then(resData => {
        if (resData.data?.page) {
          this.homePage = resData.data.page;
        }
      })
      .catch(err => console.error('Home page fetch error:', err));
    },
    fetchData(cursor = null) {
      const query = `
        query GetPortfolioMedia($first: Int!, $after: String) {
          mediaItems(first: $first, after: $after) {
            nodes {
              databaseId
              title
              slug
              sourceUrl
              mediumUrl: sourceUrl(size: MEDIUM_LARGE)
              largeUrl: sourceUrl(size: LARGE)
              hdUrl: sourceUrl(size: _1536X1536)
              mediaFiles {
                category {
                  nodes {
                    databaseId
                    name
                    slug
                  }
                }
                price
                titleEn
                titleRu
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      fetch(this.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: { first: 100, after: cursor }
        })
      })
      .then(res => res.json())
      .then(resData => {
        if (resData.data && resData.data.mediaItems) {
          this.processData(resData.data.mediaItems);
          // Auto-fetch next page until all data is loaded
          if (this.hasNextPage) {
            this.fetchData(this.endCursor);
          } else {
            this.loading = false;
          }
        }
      })
      .catch(err => {
        console.error("GraphQL Fetch Error:", err);
        this.loading = false;
      });
    },
    processData(mediaItems) {
      // Collect unique categories from all category nodes on each item
      mediaItems.nodes.forEach(node => {
        if (node.mediaFiles?.category?.nodes?.length > 0) {
          node.mediaFiles.category.nodes.forEach(cat => {
            const catId = cat.slug || cat.databaseId || cat.name;
            if (!this.categories.some(c => c.id === catId)) {
              this.categories.push({
                id: catId,
                title: cat.name,
                et: cat.name,
                ru: cat.name,
                en: cat.name
              });
            }
          });
        }
      });

      // Map nodes — categories is now an array
      mediaItems.nodes.forEach(node => {
        const categories = (node.mediaFiles?.category?.nodes || []).map(
          cat => cat.slug || cat.databaseId || cat.name
        );

        const nmap = {
          id: node.databaseId || node.title,
          slug: node.slug || node.title,
          categories,
          imagename: node.mediumUrl || node.sourceUrl,
          largeimage: node.hdUrl || node.largeUrl || node.sourceUrl,
          originalimage: node.sourceUrl,
          title: node.title,
          et: node.title,
          en: node.mediaFiles?.titleEn || node.title,
          ru: node.mediaFiles?.titleRu || node.title,
          promote: false, 
          details: [] 
        };
        
        if (!this.nodes.some(existing => existing.id === nmap.id)) {
          this.nodes.push(nmap);
        }
      });

      // Handle Pagination
      this.hasNextPage = mediaItems.pageInfo?.hasNextPage || false;
      this.endCursor = mediaItems.pageInfo?.endCursor || null;
    },

  }
};
</script>

<style scoped>
#app {
  background: transparent !important;
}

.header-desktop-menu {
  display: flex !important;
}
.header-mobile-toggle {
  display: none !important;
}

@media (max-width: 1440px) {
  .header-desktop-menu {
    display: none !important;
  }
  .header-mobile-toggle {
    display: flex !important;
  }
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

@media (max-width: 1440px) {
  .nav-brand-goudy {
    font-size: 32px;
  }
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
