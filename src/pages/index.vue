<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app id="jtg-app">
    <v-navigation-drawer app absolute dark v-model="appStore.drawer" color="brown-lighten-5">
      <!--  -->
      <router-link to="/home" exact>
        <!-- <div v-if="false">HEADER</div> -->
        <v-img v-if="true" :src="logo" alt="" width="100%" />
      </router-link>

      <v-list v-model:opened="open">
        <v-list-group v-for="(sm, index) in sideMenus" :key="index">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="sm.menuIcon"
              :title="sm.menuName"
            ></v-list-item>
          </template>

          <v-list-item
            v-for="(sub, i) in sm.subMenu"
            :key="i"
            :title="sub.name"
            :value="sub.name"
            link
            @click="onClickMenu(sub.route, sub.categoryId)"
            dense
          >
            <template v-slot:title>
              <div class="fontSize14">{{ sub.name }}</div>
            </template>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="grey-lighten-4">
      <v-app-bar-nav-icon
        @click="appStore.drawer = !appStore.drawer"
        color="grey"
      ></v-app-bar-nav-icon>

      <v-toolbar-title v-if="appStore.projectName" class="fontPrompt12 text-red">{{
        appStore.projectName
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="appStore.listCount > 0" class="text-none" stacked @click="cartView()">
        <v-badge :content="appStore.listCount" color="red">
          <v-icon>mdi-text-box-outline</v-icon>
        </v-badge>
      </v-btn>
      <v-avatar color="info" class="mr-4">
        <v-icon icon="mdi-account-circle"></v-icon>
      </v-avatar>
      <span class="text-blue-darken-3">{{
        !!appStore.loginUser.full_name ? appStore.loginUser.full_name : ''
      }}</span>
      <v-btn icon="mdi-exit-to-app" size="x-large" color="purple" @click="onClickLogOff()"></v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { useStore } from '../stores/appstore'
import { apiUrl, imageUrl, lsUserId, lsTokenName } from '../constants.js'

export default {
  async mounted() {
    this.assignMenu()
    console.log('Mounted Index.vue')
  },
  data: () => ({
    appStore: useStore(),
    drawer: null,
    selectedMenu: 0,
    open: ['Users'],
    sideMenus: [
      {
        menuName: 'Menu',
        menuIcon: 'mdi-book-open-variant',
        subMenu: [
          { name: 'Project', route: '/ProjectList' },
          { name: 'รูปแบบการติดตั้ง', route: '/CategoryList' },
          { name: 'รายการที่เลือก', route: '/CartView' },
          { name: 'Download', route: '/DownloadGroup' },
          { name: 'ออกจากระบบ', route: '/Logout' }
        ]
      }
    ],
    logo: imageUrl + '/ctg_logo.jpg',    
    category: []
  }),
  methods: {
    assignMenu() {
      if (this.appStore.loginUser.user_level === '8') {
        this.sideMenus.push({
          menuName: 'Setting',
          menuIcon: 'mdi-cog-outline',
          subMenu: [
            { name: 'Alu. Brand', route: '/Brand' },
            { name: 'Alu. Series', route: '/Series' },
            { name: 'Alu. Profile', route: '/AluMaster' },
            { name: 'ยี่ห้ออุปกรณ์', route: '/AccBrand' },
            { name: 'หน่วยนับ', route: '/Unit' },
            { name: 'รายการอุปกรณ์', route: '/AccMaster' },
            { name: 'รายการกระจก', route: '/GlassMaster' },
            { name: 'Category', route: '/Category' },
            { name: 'Pattern', route: '/InstPattern' },
            { name: 'Document Group', route: '/DocGroup' },
            { name: 'Document List', route: '/DocList' },
            { name: 'Logout', route: '/Logout' }
          ]
        })
      }
      if (this.appStore.loginUser.user_level === '9') {
        this.sideMenus.push({
          menuName: 'Setting',
          menuIcon: 'mdi-cog-outline',
          subMenu: [
            { name: 'Alu. Brand', route: '/Brand' },
            { name: 'Alu. Series', route: '/Series' },
            { name: 'Alu. Profile', route: '/AluMaster' },
            { name: 'ยี่ห้ออุปกรณ์', route: '/AccBrand' },
            { name: 'หน่วยนับ', route: '/Unit' },
            { name: 'รายการอุปกรณ์', route: '/AccMaster' },
            { name: 'รายการกระจก', route: '/GlassMaster' },
            { name: 'Category', route: '/Category' },
            { name: 'Pattern', route: '/InstPattern' },
            { name: 'Document Group', route: '/DocGroup' },
            { name: 'Document List', route: '/DocList' },
            { name: 'User', route: '/Users' },
            { name: 'Logout', route: '/Logout' }
          ]
        })
      }
    },
    updateMenu() {
      this.category.forEach((v) => {
        // console.log(v)
        this.sideMenus[0].subMenu.push({
          name: v.categoryName,
          route: '/ShowCase',
          categoryId: v.id
        })
      })
      // this.$router.push({ name: 'ShowCase' })
    },
    clickDrawer() {
      this.$store.state.drawer = !this.$store.state.drawer
      this.appStore.$state.drawer = !this.appStore.$state.drawer
    },
    async onClickLogOff() {
      // // Clear Token
      // await axios.post(apiUrl + '/users/clearToken', {
      //   userId: this.appStore.loginUser.id
      // })
      // // console.log(this.appStore.loginUser)

      localStorage.removeItem(lsUserId)
      localStorage.removeItem(lsTokenName)
      this.appStore.userId = 0
      this.appStore.userToken = ""

      // // save History
      // await axios.post(apiUrl + '/users/insertHistory', {
      //   userId: this.appStore.loginUser.id,
      //   projectId: this.appStore.activeProject,
      //   actionId: 3,
      //   remark: ''
      // })
      this.$router.replace({ path: '/', replace: true })
    },
    onClickMenu(link, id) {
      this.appStore.categoryId = id
      // console.log(this.appStore.categoryId)
      this.$router.push(link)
    },
    async getCategory() {
      try {
        let result = await axios.get(apiUrl + '/category')
        this.category = result.data.data
      } catch (error) {
        console.log(error)
      }
    },
    async updateCount() {
      try {
        let result = await axios.post(apiUrl + '/cart/count', {
          userId: this.appStore.loginUser.id,
          projectId: this.appStore.activeProject
        })
        this.appStore.listCount = result.data.data
      } catch (error) {
        console.log(error)
      }
    },
    cartView() {
      this.$router.push({ path: '/CartView', replace: true })
    }
  }
}
</script>

<style></style>
