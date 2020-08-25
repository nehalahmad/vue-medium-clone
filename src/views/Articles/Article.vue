<template>
  <v-container>
    <app-spinner v-if="feedLoading"></app-spinner>
    <v-card v-if="!feedLoading && article && article.title">
      <v-card-title>
        <h1>{{ article.title }}</h1>
        <v-btn large icon v-if="article.author" @click="toggleFavorite">
          <v-icon
            :style="{ color: article.favorited ? 'red' : 'gray' }"
            class="mr-1"
            >mdi-heart</v-icon
          >
        </v-btn>
        <h3 class="ml-3 font-weight-thin">
          {{ article.favoritesCount }} LIKES
        </h3>
        <v-spacer></v-spacer>
        <v-icon color="info" large @click="$router.go(-1)"
          >mdi-arrow-left</v-icon
        >
      </v-card-title>

      <v-card-text>
        <span v-for="(tag, index) in article.tagList" :key="index"
          ><v-chip class="mb-3" color="accent" text-color="white"
            >{{ tag }}
          </v-chip></span
        >
      </v-card-text>
      <v-card-subtitle>
        <h3>{{ article.description }}</h3>
        <h4 class="mt-2">{{ article.body }}</h4>
      </v-card-subtitle>

      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="font-weight-thin font-italic">
          ~ {{ article.createdAt | timeAgo }}
        </div>
      </v-card-actions>
    </v-card>

    <div class="mt-3" v-if="isAuthenticated">
      <div class="mb-3">
        <v-form
          ref="commentForm"
          lazy-validation
          v-model="valid"
          class="text-center"
          @submit.prevent="handleAddComment"
        >
          <v-text-field
            clearable
            label="Add Comment"
            v-model="commentBody"
            :rules="commentRules"
            required
            :append-outer-icon="commentBody && 'mdi-send'"
            @click:append-outer="handleAddComment"
            prepend-icon="mdi-email"
          ></v-text-field>
        </v-form>
      </div>
    </div>
    <v-card v-if="comments && comments.length">
      <v-list subheader two-line>
        <v-subheader>Comments ({{ comments.length }})</v-subheader>
        <v-divider></v-divider>
        <template v-for="(comment, index) in comments">
          <div :key="comment.id">
            <v-list-item>
              <v-list-item-avatar>
                <img
                  :src="comment.author.image"
                  :alt="comment.author.username"
                />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="comment.body"></v-list-item-title>
                <v-list-item-subtitle>
                  {{ comment.author.username }}
                  <span class="grey--text lighten-1 hidden-xs-only">{{
                    comment.createdAt | timeAgo
                  }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon class="hidden-xs-only">
                <v-btn
                  icon
                  @click="onDeleteComment(comment.id)"
                  :disabled="comment.author.username !== author"
                >
                  <v-icon
                    :color="
                      comment.author.username === author ? 'green' : 'grey'
                    "
                    >mdi-delete</v-icon
                  >
                </v-btn>
              </v-list-item-icon>
            </v-list-item>
            <v-divider v-if="index + 1 < comments.length"></v-divider>
          </div>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Spinner from "../../components/Spinner";

export default {
  props: { slug: { type: String, required: true } },
  components: { appSpinner: Spinner },
  data: () => ({
    commentBody: "",
    commentRules: [
      (commentBody) => !!commentBody || "Comment is required",
      (commentBody) =>
        (commentBody && commentBody.length <= 100) ||
        "Comment must be less 100 characters",
    ],
    valid: true,
  }),
  created() {
    this.fetchArticle(this.slug);
  },
  beforeDestroy() {
    this.resetArticleState();
  },
  computed: {
    ...mapGetters([
      "article",
      "comments",
      "feedLoading",
      "isAuthenticated",
      "author",
    ]),
  },
  methods: {
    ...mapActions([
      "fetchArticle",
      "toggleMarkFavorite",
      "addComment",
      "deleteComment",
      "resetArticleState",
    ]),
    toggleFavorite() {
      this.toggleMarkFavorite(this.article);
    },
    handleAddComment() {
      if (this.$refs.commentForm.validate()) {
        this.addComment({
          slug: this.slug,
          commentBody: this.commentBody,
        }).then(() => {
          this.$refs.commentForm.reset();
        });
      }
    },
    onDeleteComment(id) {
      if (window.confirm("Are you sure want to delete?")) {
        this.deleteComment({ slug: this.slug, id });
      }
    },
  },
};
</script>
