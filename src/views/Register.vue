<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <h1 class="text-center">Get started here</h1>

        <v-alert
          v-if="error"
          type="error"
          dismissible
          text
          transition="scale-transition"
        >
          {{ error }}
        </v-alert>
        <v-card>
          <v-container>
            <v-form
              @submit.prevent="onRegister"
              ref="regForm"
              lazy-validation
              v-model="valid"
              class="text-center"
            >
              <v-text-field
                label="Username"
                prepend-icon="mdi-face"
                type="text"
                v-model="username"
                required
                :rules="usernameRules"
              ></v-text-field>
              <v-text-field
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                v-model="email"
                required
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                label="Password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
                required
                :rules="pwdRules"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                type="submit"
                class="ma-2"
                :loading="loading"
                :disabled="loading || !valid"
                color="info"
                >Register</v-btn
              >
            </v-form>
            <h3 class="text-center">
              Already have an account?
              <router-link to="/login">Login</router-link>
            </h3>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    username: "",
    usernameRules: [
      // check if username is blank
      (v) => !!v || "Username is required",
      (v) => (v && v.length >= 4) || "Username must be less than 4 characters",
    ],
    email: "",
    emailRules: [
      // check if email is blank
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    pwdRules: [
      // check if password blank
      (v) => !!v || "Password is required",
      (v) => v.length >= 8 || "Password must be at least 8 characters",
    ],
    loader: null,
    valid: true,
  }),
  computed: {
    ...mapGetters(["loading", "user", "error"]),
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    },
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    },
  },
  methods: {
    ...mapActions(["registerUser"]),
    onRegister() {
      if (this.$refs.regForm.validate()) {
        this.loader = this.loading;

        this.registerUser({
          username: this.username,
          email: this.email,
          password: this.password,
        }).then(() => this.$route.push("/"));
      }
    },
  },
};
</script>
