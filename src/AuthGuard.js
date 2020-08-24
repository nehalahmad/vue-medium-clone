import store from "./store";

export default (to, from, next) => {
  if (to.path !== "/login" && !store.getters.isAuthenticated) {
    next({ path: "/login" });
  } else if (to.path === "/login" && store.getters.isAuthenticated) {
    next({ path: "/" });
  } else {
    next();
  }
};
