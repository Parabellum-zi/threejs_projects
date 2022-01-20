/**
 * @Description:
 * @author parabellum
 * @date 2021/10/6
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

import "@arcgis/core/assets/esri/themes/dark/main.css";

import "./style/index.css";

createApp(App).use(router).mount("#app");
