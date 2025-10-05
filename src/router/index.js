import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/index'

const HomeView = () => import('../views/home/HomeView.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/home/:path*',
    name: 'Home',
    component: HomeView,
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/user/login/UserLoginView.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/error/NotFound.vue')
  },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/test/TestView.vue')
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("cloud_jwt_refresh_token");
  if (store.state.user.is_login) {
    next();
    return;
  }
  if (token === null) {
    next();
    return;
  }
  store.commit("updateRefresh", token);
  store.dispatch("getAccess", {
    success(resp) {
      store.commit("login", {
        refresh: token,
        access: resp.access,
      });
      store.dispatch("getUserInfo")
      store.dispatch("startGetAccessTimer");
      next();
    },
    error() {
      store.dispatch("logout");
      next();
    }
  })
})


export default router
