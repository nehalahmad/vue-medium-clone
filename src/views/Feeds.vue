<template>
  <app-article-tiles
    :tiles="feeds"
    :loading="feedLoading"
    @fetchMoreData="fetchMoreData"
    :showMoreEnabled="showMoreEnabled"
  ></app-article-tiles>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ArticleTiles from "../components/ArticleTiles";

let limit = 12;
let offset = 0;

export default {
  components: {
    appArticleTiles: ArticleTiles,
  },
  created() {
    this.fetchFeeds({ limit, offset });
  },
  beforeDestroy() {
    this.resetFeedsState();
  },
  computed: {
    ...mapGetters(["feeds", "feedsCount", "feedLoading"]),
    showMoreEnabled() {
      return this.feeds.length <= this.feedsCount;
    },
  },
  methods: {
    ...mapActions(["fetchFeeds", "resetFeedsState"]),
    fetchMoreData() {
      offset += limit;
      this.fetchFeeds({ limit, offset });
    },
  },
};
</script>
