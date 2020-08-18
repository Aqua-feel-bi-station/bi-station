<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :right="right"
      fixed
      temporary
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
      class="px-5"
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        icon
        @click.stop="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: '美ステーション',
      drawer: false,
      fixed: false,
      right: true,
      items: [
        {
          icon: 'mdi-newspaper-variant',
          title: '求人情報一覧',
          to: '/Qjin'
        },
        {
          icon: 'mdi-store',
          title: '美容室一覧',
          to: '/salons'
        }
      ]
    }
  }
}
</script>
