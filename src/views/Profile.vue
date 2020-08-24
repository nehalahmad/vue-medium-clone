<template>
  <v-container class="text-center">
    <v-row justify="center" no-gutters>
      <v-col sm="6" xs="8">
        <v-card class="white--text" color="secondary">
          <v-row>
            <v-col sm="6">
              <v-img
                v-if="user.image"
                :src="user.image"
                alt=""
                height="200"
                contain
              />
              <v-avatar v-else color="red" size="100%">
                <span class="white--text headline">{{ user.username }}</span>
              </v-avatar>
            </v-col>
            <v-col sm="6">
              <v-card-title>
                <div>
                  <div class="headline">
                    {{ user.username }}
                  </div>
                  <div class="headline font-weight-thin">
                    {{ user.bio }}
                  </div>
                  <div>Joined {{ user.createdAt | timeAgo }}</div>
                  <div
                    v-if="user.favorites && user.favorites.length"
                    class="hidden-xs-only font-weight-thin"
                  >
                    {{ user.favorites.length }} Favorites
                  </div>
                  <div
                    v-if="user.articlesCount"
                    class="hidden-xs-only font-weight-thin"
                  >
                    {{ user.articlesCount }} Articles Added
                  </div>
                  <v-btn text color="warning" @click="showEditForm">
                    Edit Profile
                  </v-btn>
                </div>
              </v-card-title>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <template v-if="editing">
      <h2 class="mt-5">
        Edit Profile Section
      </h2>
      <v-container class="text-center">
        <v-row justify="center" no-gutters>
          <v-col sm="6" xs="8">
            <v-card class="mt-5">
              <v-container>
                <v-form
                  @submit.prevent="handleUpdateProfile"
                  ref="profileForm"
                  lazy-validation
                  v-model="valid"
                  class="text-center"
                >
                  <v-text-field
                    label="Profile Bio"
                    type="text"
                    v-model.lazy="bio"
                    required
                    :rules="bioRules"
                  ></v-text-field>
                  <v-text-field
                    label="Profile image"
                    type="text"
                    v-model.lazy="image"
                    required
                    :rules="imageRules"
                  ></v-text-field>
                  <v-img :src="image"></v-img>
                  <v-spacer></v-spacer>
                  <v-btn class="ma-2" @click="editing = false">Cancel</v-btn>
                  <v-btn
                    type="submit"
                    class="ma-2"
                    :loading="updateProfileLoading"
                    :disabled="updateProfileLoading || !valid"
                    color="info"
                    >Submit</v-btn
                  >
                </v-form>
              </v-container>
            </v-card>
          </v-col></v-row
        >
      </v-container>
    </template>

    <h2
      v-if="user.favorites && user.favorites.length"
      class="font-weight-light mt-5"
    >
      Favorited
      <span class="font-weight-regular">{{ user.favorites.length }}</span>
    </h2>
    <h2 v-else class="mt-5">
      You have no favorites currently. Go and add some!
    </h2>

    <v-card class="mt-5" v-if="user.favorites">
      <v-container>
        <v-row>
          <v-col
            xs="12"
            sm="6"
            v-for="favorite in user.favorites"
            :key="favorite.id"
          >
            <v-card
              class="mt-3 ml-1 mr-2"
              hover
              :to="`/articles/${favorite.slug}`"
            >
              <v-card-text>{{ favorite.title }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    editing: false,
    bio: "",
    bioRules: [
      (bio) =>
        (bio && bio.length > 5) || "Bio should be at least 5 characters long",
    ],
    image: "",
    imageRules: [
      (image) =>
        (image && image.includes("http")) || "Please enter image address",
    ],
    valid: false,
    loader: null,
  }),
  computed: {
    ...mapGetters(["user", "author", "updateProfileLoading"]),
  },
  created() {
    this.fetchUserData(this.author);
  },
  methods: {
    ...mapActions(["fetchUserData", "updateProfile"]),
    handleUpdateProfile() {
      if (this.$refs.profileForm.validate()) {
        this.updateProfile({ bio: this.bio, image: this.image }).then(() => {
          this.editing = false;
        });
      }
    },
    showEditForm() {
      this.editing = true;
      this.bio = this.user.bio;
      this.image = this.user.image;
    },
  },
};
</script>
