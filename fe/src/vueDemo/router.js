import { createRouter, createWebHashHistory } from "vue-router";

// 引入

import List from "./ProjectList.vue";
import Detil from "./ProjectDetail.vue";
import Player from "./Player.vue";

// 路由信息
const routes = [
  {
    path: "/",
    name: 'home',
    component: List,
  },

  {
    path: "/list",
    name: 'list',
    component: List,
  },
  {
    path: "/detail/:projectId",
    name: 'detail',
    component: Detil,
  },
  {
    path: "/player/:projectId?",
    name: 'player',
    component: Player,
  },
];

// 路由器
const router = createRouter({
  history: createWebHashHistory(), // HTML5模式
  routes,
});

export default router;