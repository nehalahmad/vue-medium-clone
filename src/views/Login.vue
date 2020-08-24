<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <h1 class="text-center">Welcome Back!</h1>

        <v-alert
          v-if="error"
          type="error"
          dismissible
          text
          transition="scale-transition"
        >
          {{ error | formatError }}
        </v-alert>
        <v-card>
          <v-container>
            <v-form
              @submit.prevent="onSubmit"
              v-model="valid"
              lazy-validation
              ref="form"
              class="text-center"
            >
              <v-text-field
                label="Email"
                prepend-icon="mdi-email"
                type="text"
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
                color="success"
                >Login</v-btn
              >
            </v-form>
            <h3 class="text-center">
              Don't have an account?
              <router-link to="/register">Register</router-link>
            </h3></v-container
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  filters: {
    formatError(data) {
      let errorMsg = "";
      for (let field in data) {
        errorMsg = field;

        if (Array.isArray(data[field])) {
          for (let msg of data[field]) {
            errorMsg += " " + msg;
          }
        }
      }
      return errorMsg;
    },
  },
  data: () => ({
    email: "",
    emailRules: [
      // check if email input
      (email) => !!email || "Email is required",
      (email) => /.@+./.test(email) || "Email must be valid",
    ],
    password: "",
    pwdRules: [
      // check if password blank
      (password) => !!password || "Password is required",
      (password) =>
        password.length >= 8 || "Password must be at least 8 characters",
    ],
    loader: null,
    valid: true,
  }),
  computed: {
    ...mapGetters(["loading", "error"]),
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    },
  },
  methods: {
    ...mapActions(["login"]),
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loader = this.loading;

        this.login({ email: this.email, password: this.password }).then(() =>
          this.$router.push("/")
        );
      }
    },
  },
};
</script>
