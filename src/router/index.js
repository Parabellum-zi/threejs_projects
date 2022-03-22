import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/pipeline",
  },
  {
    path: "/pipeline",
    component: () => import("../components/Pipeline.vue"),
  },
  {
    path: "/particle",
    component: () => import("../components/Particle.vue"),
  },
  {
    path: "/opacityPipe",
    component: () => import("../components/OpacityPipe.vue"),
  },
  {
    path: "/arcThree",
    component: () => import("../components/reactives.vue"),
  },
  {
    path: "/newArcgis",
    component: () => import("../components/newArcgis.vue"),
  },
  {
    path: "/gzPipe",
    component: () => import("../components/gzPipe.vue"),
  },
  {
    path: "/reactives",
    component: () => import("../components/reactives.vue"),
  },
  {
    path: "/loadModel",
    component: () => import("../components/loadModel.vue"),
  },
  {
    path: "/waterLoop",
    component: () => import("../components/waterPool.vue"),
  },
  {
    path: "/liedeScene",
    component: () => import("../components/liedeScene.vue"),
  },
  {
    path: "/water",
    component: () => import("../components/water.vue"),
  },
  {
    path: "/simpleScene",
    component: () => import("../components/simpleScene.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
