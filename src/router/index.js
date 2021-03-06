import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/liedeScene",
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
    path: "/rightAngleTube",
    component: () => import("../components/rightAngleTube.vue"),
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
  {
    path: "/textGeometry",
    component: () => import("../components/textGeometry.vue"),
  },
  {
    path: "/curveTrack",
    component: () => import("../components/curveTrack.vue"),
  },
  {
    path: "/controlChange",
    component: () => import("../components/controlChange.vue"),
  },
  {
    path: "/roaming",
    component: () => import("../components/roaming.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
