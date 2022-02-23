import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 模型解析
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class Base3D {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.scene;
    this.camera;
    this.renderer;
    this.orbitControls;
    this.model;
    this.init();
    this.animation();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.resize();
    this.addModels();
  }
  initScene() {
    this.scene = new THREE.Scene();
    // this.setEvnMap("solitude_night");
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(-1.8, 100, 2.7);
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

    const axesHelper = new THREE.AxesHelper(100);
    this.scene.add(axesHelper);
  }
  setEvnMap(hdr) {
    new RGBELoader().setPath("images/hdr/").load(hdr + ".hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = texture;

      this.scene.environment = texture; // 环境纹理
    });
  }
  render() {
    this.renderer.render(this.scene, this.camera);
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
      loader.load("static/model/" + model, (gltf) => {
        // this.model = gltf.scene.children[0];
        console.log(gltf);
        this.model = gltf.scene;
        this.scene.add(this.model);
        resolve("model loaded");
      });
    }).then((res) => {
      console.log(res);
    });
  }
  addModels() {
    this.loadModels("CVT.gltf");
  }
}
export default Base3D;
