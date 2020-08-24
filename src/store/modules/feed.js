import axios from "../../axios";

const state = {
  feeds: [],
  feedsCount: 0,
  loading: false,
  error: null,
};
const mutations = {
  FETCH_FEEDS_START(state) {
    state.loading = true;
  },
  FETCH_FEEDS_SUCCESS(state, payload) {
    state.loading = false;
    state.feeds = [...state.feeds, ...payload.articles];
    state.feedsCount = payload.articlesCount;
  },
  FETCH_FEEDS_FAIL(state, error) {
    state.loading = false;
    state.error = error;
  },
  RESET_STATE(state) {
    state.feeds = [];
    state.feedsCount = 0;
  },
};
const actions = {
  fetchFeeds({ commit }, { limit, offset } = state) {
    return new Promise((resolve, reject) => {
      commit("FETCH_FEEDS_START");

      axios
        .get(`articles?limit=${limit}&offset=${offset}`)
        .then(({ data }) => {
          commit("FETCH_FEEDS_SUCCESS", data);
          resolve(true);
        })
        .catch((error) => {
          commit("FETCH_FEEDS_FAIL", error);
          reject(error);
        });
    });
  },
  resetFeedsState({ commit }) {
    commit("RESET_STATE");
  },
};
const getters = {
  feeds: (state) => state.feeds,
  feedsCount: (state) => state.feedsCount,
  feedError: (state) => state.error,
  feedLoading: (state) => state.loading,
};

export default { state, mutations, actions, getters };
