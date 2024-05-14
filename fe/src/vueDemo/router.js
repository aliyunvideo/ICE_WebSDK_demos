
import { createRouter, createWebHashHistory } from "vue-router";

// 引入

import ProjectList from "./ProjectList.vue";
import TemplateList from "./TemplateList.vue";
import Detil from "./ProjectDetail.vue";
import Home from "./Home.vue";
import Player from "./Player.vue";

// 路由信息
const routes = [
  {
    path: "/",
    name: 'index',
    redirect: to => {
      // 方法接收目标路由作为参数
      // return 重定向的字符串路径/路径对象
      return { path: '/home/projects'  }
    },
  },
  {
    path: "/home",
    name: 'home',
    component: Home,
    children:[
      {
        path:"",
        name:'homeindex',
        component: ProjectList
      },
      {
        path:"projects",
        name:'projects',
        component: ProjectList
      },
      {
        path:"templates",
        name:'templates',
        component: TemplateList
      },
      {
        path:"detail/:projectId",
        name:'detail',
        component: Detil
      }, {
        path:"template/:templateId",
        name:'template',
        component: Detil
      },{
        path: "player/:projectId?",
        name: 'homeplayer',
        component: Player,
      },
    ],
  },{
    path: "/player",
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