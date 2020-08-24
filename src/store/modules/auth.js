import axios from "../../axios";
import axioAuth from "../../axios.auth";

const state = {
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  error: null,
  loading: false,
  updateProfileLoading: false,
};
const mutations = {
  LOGIN_START(state) {
    state.loading = true;
  },
  LOGIN_SUCCESS(state, user) {
    state.user = user;
    state.token = user.token;
    state.loading = false;
    state.error = null;
  },
  LOGIN_FAIL(state, error) {
    state.loading = false;
    state.error = error;
  },
  REGISTER_SUCCESS(state, user) {
    state.user = user;
    state.token = user.token;
    state.loading = false;
    state.error = null;
  },
  LOGOUT(state) {
    state.user = null;
    state.token = null;
  },
  MARK_ARTICLE_FAVORITE_SUCCESS(state, article) {
    let userFavorites = [];
    if (!state.user.favorites) {
      userFavorites = [article];
    } else {
      let articleIdx = state.user.favorites.findIndex(
        ({ slug }) => slug === article.slug
      );
      if (articleIdx >= 0) {
        userFavorites = state.user.favorites.filter(
          ({ slug }) => slug !== article.slug
        );
      } else {
        userFavorites = [...state.user.favorites];
        userFavorites.push(article);
      }
    }
    state.user = { ...state.user, ...{ favorites: userFavorites } };
  },
  UPDATE_USER_START(state) {
    state.updateProfileLoading = true;
  },
  UPDATE_USER_SUCCESS(state, userData) {
    let user = JSON.parse(JSON.stringify(state.user));
    for (let key in userData) {
      user[key] = userData[key];
    }
    state.user = user;
    state.updateProfileLoading = false;
  },
  UPDATE_USER_FAIL(state, error) {
    state.updateProfileLoading = false;
    state.error = error;
  },
};
const actions = {
  login({ commit }, { email = "", password = "" } = {}) {
    return new Promise((resolve, reject) => {
      commit("LOGIN_START"); // start loading here
      // prepare authentication data
      const authData = { user: { email, password } };
      // make post request
      axios
        .post("users/login", authData)
        .then(({ data }) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.user.token);

          commit("LOGIN_SUCCESS", data.user); // mutate user state
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data.errors);

          commit("LOGIN_FAIL", error.response.data.errors); // mutate error state
          reject(error.response.data.errors);
        });
    });
  },
  logout({ commit }) {
    return new Promise((resolve) => {
      localStorage.removeItem("user", null);
      localStorage.removeItem("token", null);

      commit("LOGOUT");
      resolve(true);
    });
  },
  registerUser({ commit }, { username = "", email = "", password = "" } = {}) {
    return new Promise((resolve, reject) => {
      commit("LOGIN_START"); // start loading here
      // prepare authentication data
      const authData = { user: { username, email, password } };
      // make post request
      axios
        .post("users", authData)
        .then(({ data }) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.user.token);

          commit("REGISTER_SUCCESS", data.user); // mutate user data
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data.errors);

          commit("LOGIN_FAIL", error.response.data.errors); // mutate error state
          reject(error.response.data.errors);
        });
    });
  },
  updateProfile({ commit }, { bio, image }) {
    return new Promise((resolve, reject) => {
      commit("LOGIN_START"); // start loading here

      let profile = { user: {} };
      if (bio) {
        profile.user.bio = bio;
      }
      if (image) {
        profile.user.image = image;
      }
      axioAuth
        .put(`user`, profile)
        .then(({ data }) => {
          commit("UPDATE_USER_SUCCESS", data.user);
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          commit("UPDATE_USER_FAIL", error);
          reject(error);
        });
    });
  },
  fetchUserData({ commit }, author) {
    axioAuth
      .get(`user`)
      .then(({ data }) => {
        let userData = data.user;

        axios.get(`articles?author=${author}`).then(({ data }) => {
          userData["articlesCount"] = data.articlesCount;
          commit("UPDATE_USER_SUCCESS", userData);
        });
      })
      .catch(console.log);
  },
};
const getters = {
  user: (state) => state.user,
  author: (state) => (state.user && state.user.username) || "",
  token: (state) => state.token,
  isAuthenticated: (state) => !!state.token,
  loading: (state) => state.loading,
  error: (state) => state.error,
  updateProfileLoading: (state) => state.updateProfileLoading,
};

export default { state, mutations, actions, getters };
