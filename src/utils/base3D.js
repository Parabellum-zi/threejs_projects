import * as THREE from "three";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 第一人称
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
// 模型解析
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import ResourceTracker from "./ResourceTracker";
import Stats from "three/examples/jsm/libs/stats.module";

let stats;
let resMgr = new ResourceTracker();
const track = resMgr.track.bind(resMgr);

class Base3D {
  constructor(selector) {
    // this.container = document.querySelector(selector);
    this.container = selector;
    this.scene = {};
    this.camera = {};
    this.renderer = {};
    this.orbitControls = {};
    this.model = {};
    this.init();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initLight();
    this.animation();
    this.initStats();
    this.resize();
  }
  initScene() {
    this.scene = new THREE.Scene();
    // this.setEvnMap("solitude_night");
    // this.setEvnMap("drackenstein");
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 100, 0);
  }
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); //antialias 抗锯齿
    // 设置屏幕像素
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 渲染的尺寸大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // 消除canvas的外边框
    this.renderer.domElement.style.outline = "none";
    this.renderer.setClearColor(new THREE.Color("#21282a"), 1);
    // 色调映射
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // 电影级别的色调映射
    // this.renderer.toneMappingExposure = 1; // 曝光程度
    // 追加
    this.container.appendChild(this.renderer.domElement);
  }
  initControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.enableDamping = true; // 惯性
    this.orbitControls.dampingFactor = 0.15; // 动态阻尼系数
    this.orbitControls.enableZoom = true; // 缩放
    this.orbitControls.enablePan = true; // 右键拖拽
    // orbitControls.maxAzimuthAngle = Math.PI / 6; // 水平旋转范围
    // orbitControls.minAzimuthAngle = -Math.PI / 6;
    // orbitControls.maxPolarAngle = Math.PI / 6; // 垂直旋转范围
    // orbitControls.minPolarAngle = -Math.PI / 6;

    const axesHelper = new THREE.AxesHelper(50);
    this.scene.add(axesHelper);
  }
  initLight() {
    const ambientLight = new THREE.AmbientLight(0x909090); // 自然光，每个几何体的每个面都有光
    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    this.scene.add(ambientLight);
    this.scene.add(pointLight);
  }
  /**
   * 第一人称视角控制
   */
  initFirstPersonControls() {
    this.orbitControls = new FirstPersonControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.lookSpeed = 0.1; //鼠标移动查看的速度
    this.orbitControls.movementSpeed = 10; //相机移动速度
    this.orbitControls.noFly = true;
    this.orbitControls.constrainVertical = true; //约束垂直
    this.orbitControls.verticalMin = 1.0;
    this.orbitControls.verticalMax = 2.0;
    this.orbitControls.lon = -100; //进入初始视角x轴的角度
    this.orbitControls.lat = 0; //初始视角进入后y轴的角度
  }
  setEvnMap(hdr) {
    new RGBELoader().setPath("images/hdr/").load(hdr + ".hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = texture;

      this.scene.environment = texture; // 环境纹理
    });
  }
  render() {
    this.renderer.clear();
    stats.update();
    this.renderer.render(this.scene, this.camera);
  }
  //初始化性能插件
  initStats() {
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
  }
  animation() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }
  resize() {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = sizes.width / sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(sizes.width, sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }
  loadModels(model) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        "static/model/" + model,
        (gltf) => {
          // this.model = gltf.scene.children[0];
          // console.log(gltf);
          this.model = track(gltf.scene);
          this.scene.add(this.model);
          resolve("model loaded");
        },
        undefined,
        reject
      );
    }).then((res) => {
      console.log(res);
    });
  }
}
export default Base3D;
