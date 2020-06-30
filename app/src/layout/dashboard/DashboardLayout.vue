<template>
  <div class="wrapper">
     <side-bar>
      <template slot="links">
        <sidebar-link
          to="/dashboard"
          :name="$t('sidebar.dashboard')"
          icon="tim-icons icon-chart-pie-36"
        />
        <sidebar-link
          to="/profile"
          :name="$t('sidebar.userProfile')"
          icon="tim-icons icon-single-02"
        />

      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
import axios from "axios"    
import router from "@/router"  

export default {
  data(){
    return {
      user : ""
    }
  },
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu

  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    getUserData: async function() {    
      try {
        let self = this
        let response = await axios.get("/api/auth/user")
        self.$set(this, "user", response.data.user)
      } catch(err) {
        console.log(err)
        router.push("/")
      }
    },
    testUser : async function() {
      try {
        let self = this
        let response = await axios.get("/api/auth/user?userID=2i8gflay")
        self.$set(this, "user", response.data.user)
      } catch(err) {
        console.log(err)
        router.push("/")
      }
    }  
  },
  mounted() {
    //this.getUserData()
    this.testUser()
  }
};
</script>
