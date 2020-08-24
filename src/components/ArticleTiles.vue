<template>
  <v-container fluid>
    <v-row dense v-if="tiles.length">
      <v-col
        md="3"
        sm="4"
        xs="1"
        v-for="tile in tiles"
        :key="tile.slug"
        class="flex-grow-1"
      >
        <app-tile :tile="tile" @open-edit-dialog="openEditDialog"></app-tile>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="loading" sm="12">
        <app-spinner></app-spinner>
      </v-col>
      <v-col v-if="tiles.length">
        <v-btn
          class="float-right mr-4"
          color="info"
          @click="showMoreData"
          v-if="showMoreEnabled"
          >Show More</v-btn
        >
      </v-col>
    </v-row>

    <v-dialog v-model="editDialog" width="800" persistent scrollable>
      <v-card>
        <v-card-title class="grey lighten-2">Update Article</v-card-title>
        <v-container>
          <v-form
            @submit.prevent="handleUpdateArticle"
            ref="articleForm"
            lazy-validation
            v-model="valid"
            class="text-center"
          >
            <v-text-field
              label="Article Title"
              type="text"
              v-model="title"
              required
              :rules="titleRules"
            ></v-text-field>
            <v-text-field
              label="Article Description"
              type="text"
              v-model="description"
              required
              :rules="descRules"
            ></v-text-field>
            <v-textarea
              label="Article Body"
              v-model="body"
              required
              :rules="bodyRules"
            ></v-textarea>
            <v-text-field
              label="Article Related Tags"
              type="text"
              v-model="tagList"
              required
              :rules="tagListRules"
            ></v-text-field>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                type="submit"
                :loading="articleLoading"
                :disabled="articleLoading || !valid"
                color="info"
                text
                >Submit</v-btn
              >
              <v-btn class="error--text" text @click="editDialog = false"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-form></v-container
        >
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Spinner from "./Spinner";
import Tile from "./ArticleTile";

export default {
  props: {
    tiles: { type: Array, required: true },
    loading: Boolean,
    showMoreEnabled: { type: Boolean, required: true },
  },
  components: { appSpinner: Spinner, appTile: Tile },
  data: () => ({
    editDialog: false,
    title: "",
    titleRules: [
      (title) => !!title || "Title is required",
      (title) => title.length > 5 || "Title must be at least 5 characters long",
    ],
    description: "",
    descRules: [
      (description) => !!description || "Description is required",
      (description) =>
        description.length > 20 ||
        "Description must be at least 20 characters long",
    ],
    body: "",
    bodyRules: [
      (body) => !!body || "Body is required",
      (body) => body.length > 20 || "Body must be at least 20 characters long",
      (body) => body.length <= 500 || "Body must be less than 500 characters",
    ],
    tagList: "",
    tagListRules: [
      (tagList) => !!tagList || "Tag list is required",
      (tagList) =>
        tagList.length > 5 || "Tag list must be at least 5 characters long",
    ],
    valid: true,
    loader: null,
    editingArticleSlug: "",
  }),
  computed: { ...mapGetters(["articleLoading"]) },
  methods: {
    ...mapActions(["updateArticle"]),
    showMoreData() {
      this.$emit("fetchMoreData");
    },
    handleUpdateArticle() {
      if (this.$refs.articleForm.validate()) {
        this.updateArticle({
          title: this.title,
          description: this.description,
          body: this.body,
          tagList: this.tagList.split(" "),
          slug: this.editingArticleSlug,
        }).then(() => {
          this.editDialog = false;
        });
      }
    },
    openEditDialog({ title, description, body, tagList, slug }) {
      this.title = title;
      this.description = description;
      this.body = body;
      this.tagList = tagList.join(" ");
      this.editingArticleSlug = slug;

      this.editDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card__subtitle {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.v-card__text {
  div {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
