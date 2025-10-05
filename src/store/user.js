import $ from 'jquery'

export default {
  state: {
    refresh: "",
    access: "",
    is_login: false,
    username: "",
    photo: "",
    getAccessTimer: null,
  },
  getters: {
  },
  mutations: {
    updateUserInfo(state, user) {
      state.username = user.name;
      state.photo = user.photo;
    },
    updateRefresh(state, refresh) {
      state.refresh = refresh;
    },
    updateAccess(state, access) {
      state.access = access;

    },
    login(state, data) {
      state.refresh = data.refresh;
      state.access = data.access;
      state.is_login = true;
    },
    logout(state) {
      state.refresh = "";
      state.access = "";
      state.is_login = "";
      state.username = "";
      state.photo = "";
    },
    updateGetAccessTimer(state, timer) {
      state.getAccessTimer = timer;
    },
  },
  actions: {
    login(context, data) {
      $.ajax({
        url: "https://blog.superpea.top/api/token/",
        type: "post",
        data: {
          username: data.username,
          password: data.password,
        },
        success(resp) {
          localStorage.setItem("cloud_jwt_refresh_token", resp.refresh);
          context.commit("login", resp);
          context.dispatch("startGetAccessTimer");
          context.dispatch("getUserInfo");
          data.success(resp);
        },
        error(resp) {
          data.error(resp);
        }
      });
    },
    getUserInfo(context) {
      $.ajax({
        url: "https://blog.superpea.top/cloud/user/getinfo/",
        type: "get",
        headers: {
          "Authorization": "Bearer " + context.state.access,
        },
        success(resp) {

          if (resp.result === "success") {
            context.commit("updateUserInfo", resp);

          }
        }
      })
    },
    startGetAccessTimer(context) {
      context.commit("updateGetAccessTimer", (setInterval(() => {
        context.dispatch("getAccess", {
          success(resp) {
            context.commit("updateAccess", resp.access);
          }
        })
      }, 270000)))
    },
    getAccess(context, data) {
      $.ajax({
        url: "https://blog.superpea.top/api/token/refresh/",
        type: "post",
        data: {
          refresh: context.state.refresh,
        },
        success(resp) {
          data.success(resp);
        },
        error() {
          context.dispatch("logout");
          data.error();
        }
      })
    },
    logout(context) {
      context.commit("logout");
      localStorage.removeItem("cloud_jwt_refresh_token");
      if (context.state.getAccessTimer !== null) {
        clearInterval(context.state.getAccessTimer);
        context.commit("updateGetAccessTimer", null);
      }
    }
  },
  modules: {
  }
}
