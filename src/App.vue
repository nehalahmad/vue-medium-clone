<template>
  <v-app>
    <app-header></app-header>
    <v-main>
      <v-container>
        <transition name="fade">
          <router-view></router-view>
        </transition>
        <v-snackbar v-model="snackbar" color="success" :timeout="5000" left>
          <v-icon class="mr-1">mdi-check-circle</v-icon>
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";

export default {
  components: {
    appHeader: Header,
    appFooter: Footer,
  },
  data: () => ({
    snackbar: false,
    text: "",
  }),
  computed: {
    ...mapGetters(["user"]),
  },
  watch: {
    user(newVal, oldVal) {
      if (!oldVal) {
        this.snackbar = true;
        this.text = "You're now logged in!";
      }
      if (!newVal) {
        this.snackbar = true;
        this.text = "You're now logged out!";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition-property: all;
  transition-duration: 0.25s;
}
.fade-enter-active {
  transition-delay: 0.25s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateY(-25px);
}
</style>
