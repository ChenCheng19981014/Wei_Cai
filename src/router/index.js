import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/index"),
  },
  {
    path: "/weichai1",
    name: "weichai1",
    component: () => import("@/views/compoents/page1"),
  },
  ,
  {
    path: "/weichai2",
    name: "weichai2",
    component: () => import("@/views/compoents/page2"),
  },
  ,
  {
    path: "/weichai3",
    name: "weichai3",
    component: () => import("@/views/compoents/page3"),
  },
  ,
  {
    path: "/weichai4",
    name: "weichai4",
    component: () => import("@/views/compoents/page4"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
