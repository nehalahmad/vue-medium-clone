import axios from "../../axios.auth";

const state = {
  articles: [],
  articlesCount: 0,
  loading: false,
  error: null,
  article: {},
  comments: [],
};
const mutations = {
  FETCH_ARTICLES_START(state) {
    state.loading = true;
  },
  FETCH_ARTICLES_SUCCESS(state, payload) {
    state.loading = false;
    state.articles = [...state.articles, ...payload.articles];
    state.articlesCount = payload.articlesCount;
  },
  FETCH_ARTICLES_FAIL(state, error) {
    state.loading = false;
    state.error = error;
  },
  FETCH_ARTICLE_SUCCESS(state, article) {
    state.article = { ...state.article, ...article };
  },
  DELETE_ARTICLE_SUCCESS(state, articleSlug) {
    state.articles = state.articles.filter(({ slug }) => slug !== articleSlug);
  },
  FETCH_ARTICLE_COMMENTS_SUCCESS(state, comments) {
    state.loading = false;
    state.comments = comments;
  },
  ADD_ARTICLE_SUCCESS(state, article) {
    state.article = article;
  },
  UPDATE_ARTICLE_SUCCESS(state, article) {
    const idx = state.articles.findIndex(({ slug }) => slug === article.slug);
    const articles = [
      ...state.articles.slice(0, idx),
      article,
      ...state.articles.slice(idx + 1),
    ];
    state.articles = articles;
    state.loading = false;
  },
  ADD_COMMENT_SUCCESS(state, comment) {
    state.comments.push(comment);
  },
  DELETE_COMMENT_SUCCES(state, commentId) {
    state.comments = state.comments.filter(({ id }) => id !== commentId);
  },
  RESET_STATE(state) {
    state.articles = [];
    state.articlesCount = 0;
    state.article = {};
    state.comments = [];
  },
};
const actions = {
  fetchArticles({ commit }, { author, limit, offset } = {}) {
    return new Promise((resolve, reject) => {
      commit("FETCH_ARTICLES_START");

      let url = `articles?author=${author}${limit ? `&limit=${limit}` : ""}${
        offset ? `&offset=${offset}` : ""
      }`;
      axios
        .get(url)
        .then(({ data }) => {
          commit("FETCH_ARTICLES_SUCCESS", data);
          resolve(true);
        })
        .catch((error) => {
          commit("FETCH_ARTICLES_FAIL", error);
          reject(error);
        });
    });
  },
  addArticle({ commit }, { title, description, body, tagList, slug }) {
    return new Promise((resolve, reject) => {
      commit("FETCH_ARTICLES_START");

      const articleData = { article: { title, description, body, tagList } };

      let response = null;
      if (slug) {
        response = axios.put(`articles/${slug}`, articleData);
      } else {
        response = axios.post("articles", articleData);
      }
      response
        .then(({ data }) => {
          commit("ADD_ARTICLE_SUCCESS", data.article);
          resolve(data.article.slug);
        })
        .catch((error) => {
          commit("FETCH_ARTICLES_FAIL", error);
          reject(error);
        });
    });
  },
  updateArticle({ commit }, { title, description, body, tagList, slug }) {
    return new Promise((resolve, reject) => {
      commit("FETCH_ARTICLES_START");

      const articleData = { article: { title, description, body, tagList } };

      axios
        .put(`articles/${slug}`, articleData)
        .then(({ data }) => {
          commit("UPDATE_ARTICLE_SUCCESS", data.article);
          resolve(true);
        })
        .catch((error) => {
          commit("FETCH_ARTICLES_FAIL", error);
          reject(error);
        });
    });
  },
  toggleMarkFavorite({ commit }, article) {
    return new Promise((resolve, reject) => {
      let response = null;
      if (article.favorited) {
        response = axios.delete(`articles/${article.slug}/favorite`);
      } else {
        response = axios.post(`articles/${article.slug}/favorite`);
      }
      response
        .then(({ data }) => {
          commit("FETCH_ARTICLE_SUCCESS", data.article);
          commit("MARK_ARTICLE_FAVORITE_SUCCESS", data.article);
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  addComment({ commit }, { slug, commentBody }) {
    return new Promise((resolve, reject) => {
      const commentData = {
        comment: {
          body: commentBody,
        },
      };
      axios
        .post(`articles/${slug}/comments`, commentData)
        .then(({ data }) => {
          commit("ADD_COMMENT_SUCCESS", data.comment);
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  fetchArticle: async ({ commit }, slug) => {
    commit("FETCH_ARTICLES_START");

    try {
      const response = await axios.get(`articles/${slug}`);
      commit("FETCH_ARTICLE_SUCCESS", response.data.article);

      axios
        .get(`articles/${slug}/comments`)
        .then(({ data }) =>
          commit("FETCH_ARTICLE_COMMENTS_SUCCESS", data.comments)
        );
    } catch (error) {
      commit("FETCH_ARTICLES_FAIL", error);
    }
  },
  deleteComment({ commit }, { slug, id }) {
    axios
      .delete(`articles/${slug}/comments/${id}`)
      .then(() => commit("DELETE_COMMENT_SUCCES", id));
  },
  resetArticleState({ commit }) {
    commit("RESET_STATE");
  },
  deleteArticle({ commit }, slug) {
    axios
      .delete(`articles/${slug}`)
      .then(() => commit("DELETE_ARTICLE_SUCCESS", slug))
      .catch(console.log);
  },
};
const getters = {
  article: (state) => state.article,
  comments: (state) => state.comments,
  articles: (state) => state.articles,
  articlesCount: (state) => state.articlesCount,
  articleError: (state) => state.error,
  articleLoading: (state) => state.loading,
};

export default { state, mutations, actions, getters };
