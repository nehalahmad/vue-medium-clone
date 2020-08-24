<template>
  <v-container>
    <v-card>
      <v-card
        v-if="tile.author.username === author"
        color="accent lighten-5"
        flat
      >
        <v-card-actions class="justify-center" color="accent">
          <v-btn
            color="info"
            icon
            small
            fab
            dark
            @click="$emit('open-edit-dialog', tile)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="error" icon fab small dark @click="handleDelete">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-divider></v-divider>
      <v-card-actions>
        <v-card-title>
          <div>
            <div class="primary--text">
              <router-link
                :to="`/articles/${tile.slug}`"
                tag="span"
                style="cursor:pointer;"
              >
                {{ tile.title }}
              </router-link>
            </div>
            <span class="grey--text">
              <v-icon
                :style="{ color: tile.favorited ? 'red' : 'gray' }"
                class="mr-1"
                >mdi-heart</v-icon
              >{{ tile.favoritesCount }}
            </span>
          </div>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="expand = !expand">
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <v-card v-show="expand" flat>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-img :src="tile.author.image"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  class="primary--text"
                  v-html="tile.author.username"
                ></v-list-item-title>
                <v-list-item-subtitle class="font-weight-thin"
                  >Added {{ tile.createdAt | timeAgo }}</v-list-item-subtitle
                >
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon ripple :to="`/articles/${tile.slug}`">
                  <v-icon color="grey lighten-1">mdi-information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item></v-list
          ></v-card
        >
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: { tile: { type: Object, required: true } },
  data: () => ({
    expand: false,
  }),
  computed: {
    ...mapGetters(["author"]),
  },
  methods: {
    ...mapActions(["deleteArticle"]),
    handleDelete() {
      if (window.confirm("Are you sure want to delete?")) {
        this.deleteArticle(this.tile.slug);
      }
    },
  },
};
</script>
