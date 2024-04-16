import { createRouter, createWebHashHistory } from "vue-router";

// 引入

import List from "./ProjectList.vue";
import Detil from "./ProjectDetail.vue";

// 路由信息
let routes = [
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
];

// 路由器
const router = createRouter({
  history: createWebHashHistory(), // HTML5模式
  routes,
});

export default router;