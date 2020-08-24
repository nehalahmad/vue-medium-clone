<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <h1 class="text-center primary--text">Add article</h1>
        <v-form
          @submit.prevent="handleAddArticle"
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
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            class="ma-2"
            :loading="loading"
            :disabled="loading || !valid"
            color="info"
            >Submit</v-btn
          >
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
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
  }),
  computed: { ...mapGetters({ loading: "articleLoading" }) },
  methods: {
    ...mapActions(["addArticle"]),
    handleAddArticle() {
      if (this.$refs.articleForm.validate()) {
        this.addArticle({
          title: this.title,
          description: this.description,
          body: this.body,
          tagList: this.tagList.split(" "),
        }).then((slug) => this.$router.push(`/articles/${slug}`));
      }
    },
  },
};
</script>
