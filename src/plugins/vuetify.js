import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    light: true,
    themes: {
      light: {
        primary: "#3b125f",
        secondary: "#8bf5bf",
        accent: "#bf653f",
        warning: "#a37513",
        info: "#396893",
        sucess: "#4caf50",
      },
    },
  },
});

export default vuetify;
