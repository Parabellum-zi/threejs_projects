/**
 * @Description: init threejs scene etc and common methods
 * @author parabellum
 * @date 2022/3/16
 */
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
import { Sky } from "three/examples/jsm/objects/Sky";

let stats;
let resMgr = new ResourceTracker();
const track = resMgr.track.bind(resMgr);

const sun = new THREE.Vector3();
const sky = new Sky();

class Base3D {
  constructor(selector) {
    // this.container = document.querySelector(selector);
    this.container = selector;
    this.scene = {};
    this.camera = {};
    this.renderer = {};
    this.orbitControls = {};
    this.firstControls = {};
    this.model = {};
    this.init();
  }
  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initFirstPersonControls();
    this.initLight();
    this.animation();
    this.initStats();
    this.resize();
    this.updateSun();
  }
  initScene() {
    this.scene = new THREE.Scene();
    // this.setEvnMap("solitude_night");
    // this.setEvnMap("city");
    this.scene.fog = new THREE.Fog(0xffffff, 20, 10000); //远处添加边境线效果

    this.initSkybox();
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 200, 400);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); //antialias 抗锯齿

    // 设置屏幕像素
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 渲染的尺寸大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // 消除canvas的外边框
    this.renderer.domElement.style.outline = "none";
    this.renderer.setClearAlpha(0.3);
    // 场景背景色
    // this.renderer.setClearColor(new THREE.Color("#21282a"), 1);
    // this.renderer.setClearColor(new THREE.Color("#acefe0"), 1);
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
    this.orbitControls.listenToKeyEvents(window); // 将关键事件侦听器添加到给定的 DOM 元素
    this.orbitControls.enableDamping = true; // 惯性
    this.orbitControls.dampingFactor = 0.25; // 动态阻尼系数
    this.orbitControls.enableZoom = true; // 缩放
    this.orbitControls.enablePan = true; // 右键拖拽
    this.orbitControls.minDistance = -50;
    this.orbitControls.maxDistance = 800;
    this.orbitControls.screenSpacePanning = false;
    // this.orbitControls.maxAzimuthAngle = Math.PI / 6; // 水平旋转范围
    // this.orbitControls.minAzimuthAngle = -Math.PI / 6;
    this.orbitControls.maxPolarAngle = Math.PI / 2; // 垂直旋转范围
    // this.orbitControls.minPolarAngle = -Math.PI / 6;
    const axesHelper = new THREE.AxesHelper(200);
    this.scene.add(axesHelper);
  }
  initLight() {
    const ambientLight = new THREE.AmbientLight(0x909090); // 自然光，每个几何体的每个面都有光
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    // this.scene.add(new THREE.PointLightHelper(pointLight, 1))  /添加灯光辅助容器（便于查看灯光位置）

    this.scene.add(ambientLight);
    this.scene.add(pointLight);
  }
  initSkybox() {
    sky.scale.setScalar(10000);
    sky.name = "sky";
    this.scene.add(sky);
    const skyUniforms = sky.material.uniforms;
    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;
  }
  updateSun() {
    const parameters = {
      elevation: 18, // 日光高度
      azimuth: -50, // 角度方位
    };
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    sky.material.uniforms["sunPosition"].value.copy(sun);
    this.scene.environment = pmremGenerator.fromScene(sky).texture;
  }
  /**
   * 第一人称视角控制
   */
  initFirstPersonControls() {
    this.firstControls = new FirstPersonControls(
      this.camera,
      this.renderer.domElement
    );
    this.firstControls.lookSpeed = 100; //鼠标移动查看的速度
    this.firstControls.movementSpeed = 1000; //相机移动速度
    this.firstControls.noFly = true;
    this.firstControls.constrainVertical = true; //约束垂直
    this.firstControls.verticalMin = 1.0;
    this.firstControls.verticalMax = 2.0;
    // this.firstControls.lon = -100; //进入初始视角x轴的角度
    // this.firstControls.lat = 0; //初始视角进入后y轴的角度
    this.firstControls.enabled = false; // 默认不启用
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
    this.orbitControls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

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
        this.scene.add(track(gltf.scene));
        resolve(gltf);
      }),
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
          console.error("An error happened", error);
        };
    });
  }
  /**
   * 留住每个模型的 原材质
   */
  dealMeshMaterial(arrs) {
    let result = [];
    for (let i = 0; i < arrs.length; i++) {
      result.push({
        name: arrs[i].name,
        material: arrs[i].material,
      });
    }
    return result;
  }
  /**
   * 销毁
   * @param seconds
   * @returns {Promise<unknown>}
   */
  dispose(seconds = 0) {
    return new Promise((resolve) =>
      setTimeout(() => {
        resMgr.dispose();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.content = null;
        this.renderer.renderLists.dispose();
        let gl = this.renderer.domElement.getContext("webgl");
        gl && gl.getExtension("WEBGL_lose_context").loseContext();
        console.log(this.renderer.info);
        resolve("dispose");
      }, seconds * 1000)
    );
  }
  /**
   * 获取当前的控件target
   */
  getCurrentCtrlTarget() {
    return this.orbitControls.target;
  }
  /**
   * 获取当前的相机位置
   */
  getCurrentCamera() {
    return this.camera.position;
  }
}
export default Base3D;
