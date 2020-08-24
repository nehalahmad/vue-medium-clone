<template>
  <app-article-tiles
    :tiles="articles"
    :loading="articleLoading"
    @fetchMoreData="fetchMoreData"
    :showMoreEnabled="showMoreEnabled"
  ></app-article-tiles>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ArticleTiles from "../../components/ArticleTiles";

let limit = 12;
let offset = 0;

export default {
  components: {
    appArticleTiles: ArticleTiles,
  },
  created() {
    this.fetchArticles({ author: this.author, limit, offset });
  },
  beforeDestroy() {
    this.resetArticleState();
  },
  computed: {
    ...mapGetters(["articles", "articlesCount", "articleLoading", "author"]),
    showMoreEnabled() {
      return this.articles.length < this.articlesCount;
    },
  },
  methods: {
    ...mapActions(["fetchArticles", "resetArticleState"]),
    fetchMoreData() {
      offset += limit;
      this.fetchArticles({ limit, offset });
    },
  },
};
</script>
