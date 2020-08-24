<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-toolbar flat color="accent">
        <v-app-bar-nav-icon @click="drawer = false"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer;"
          ><h1 class="title pl-3">Medium</h1></router-link
        ></v-toolbar
      >
      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="(item, i) in sideNavItems"
          :key="i"
          :to="item.link"
          link
          ripple
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isAuthenticated" @click="logoutUser">
          <v-list-item-action
            ><v-icon>mdi-exit-to-app</v-icon></v-list-item-action
          >
          <v-list-item-content
            ><v-list-item-title>Signout</v-list-item-title></v-list-item-content
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="deep-purple" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title
        ><router-link to="/" tag="span" style="cursor: pointer;"
          >Medium</router-link
        ></v-toolbar-title
      >

      <v-spacer></v-spacer>
      <v-btn
        class="hidden-xs-only"
        text
        v-for="item in hrNavItems"
        :key="item.title"
        :to="item.link"
        ><v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon
        >{{ item.title }}
      </v-btn>

      <v-btn text @click="navigateToProfilePage" v-if="isAuthenticated">
        <v-badge color="red" :content="item" :value="item">
          <v-icon class="hidden-sm-only">mdi-account-circle</v-icon>
          Profile
        </v-badge>
      </v-btn>

      <v-btn v-if="isAuthenticated" text @click="logoutUser">
        <v-icon class="hidden-sm-only" left>mdi-exit-to-app</v-icon>
        Signout
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    drawer: false,
    group: false,
    item: 0,
  }),
  watch: {
    user(newVal, oldVal) {
      if (
        (!oldVal && newVal && newVal.favorites) ||
        (newVal &&
          oldVal &&
          newVal.favorites &&
          oldVal.favorites &&
          newVal.favorites.length !== oldVal.favorites.length)
      ) {
        this.item = 1;
      }
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "user"]),
    hrNavItems() {
      let hrNavItems = [
        { icon: "mdi-lock", title: "Login", link: "/login" },
        { icon: "mdi-account", title: "Register", link: "/register" },
      ];
      if (this.isAuthenticated) {
        hrNavItems = [
          {
            icon: "mdi-chat",
            title: "Articles",
            link: "/articles",
          },
        ];
      }
      return hrNavItems;
    },
    sideNavItems() {
      let sideNavItems = [
        { icon: "mdi-lock", title: "Login", link: "/login" },
        { icon: "mdi-account", title: "Register", link: "/register" },
      ];
      if (this.isAuthenticated) {
        sideNavItems = [
          {
            icon: "mdi-chat",
            title: "Articles",
            link: "/articles",
          },
          {
            icon: "mdi-star",
            title: "Create Article",
            link: "/articles/add",
          },
          {
            icon: "mdi-account-box",
            title: "Profile",
            link: "/profile",
          },
        ];
      }
      return sideNavItems;
    },
  },
  methods: {
    ...mapActions(["logout"]),
    logoutUser() {
      this.logout().then(() => {
        if (this.$route.path !== "/") {
          this.$router.go("/");
        }
      });
    },
    navigateToProfilePage() {
      setTimeout(() => (this.item = 0), 1000);
      this.$router.push("/profile");
    },
  },
};
</script>

<style scoped>
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, 0, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
