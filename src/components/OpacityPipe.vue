<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
// import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import threeMethods from "../utils/index.js";

let scene = reactive({});
let camera = reactive({});
let renderer = reactive({});
let orbitControls = reactive({});
const sceneContainer = ref(null);
// let geometry = reactive({});
// let gui = new dat.GUI();
// let clock = new THREE.Clock();
const pointsArr = [
  [-80, -20, 0],
  [-70, 20, 0],
  [0, 0, 0],
  [70, 30, 0],
  [20, 40, 0],
];

// 广州附近经纬度转换后的坐标
/*
let pointsArr = [
  [-2312953.230182137, 5388730.020037582, 2508530.01632127],
  [-2310899.4861760437, 5389134.59590233, 2509553.4640028947],
  [-2311667.3102313625, 5388328.582948268, 2510576.8352391464],
  [-2312434.8528883145, 5387522.302022157, 2511600.1299988576],
  [-2312261.919568433, 5387119.401107366, 2512623.3482508515],
  [-2312088.915813026, 5386716.336091534, 2513646.4899639636],
];
*/

/*const pointsArr = [
  [116.46, 39.92, 200],
  [104.06, 30.67, 200],
  [121.48, 31.22, 200],
  [91.11, 29.97, 200],
  [102.73, 25.04, 200],
  [113.23, 23.16, 200],
  [113, 28.21, 200],
];*/
let texture;

onMounted(() => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  initPointLight();
  resize();
  initPipeConf();
  animate();
});

function initScene() {
  scene = new THREE.Scene();
}

function initCamera() {
  // 设置相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  ); // 视野角度 , 宽高比， 近截面（near）和远截面（far）
  camera.position.set(-80, 30, 100); // 设置相机位置
  // camera.position.set(-3000000, 6000000, 3000000); // 设置相机位置
  // camera.position.z = 3;
  scene.add(camera);
}

function initRenderer() {
  // 设置渲染器
  // renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });    // alpha: true 设置背景透明
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(
    sceneContainer.value.clientWidth,
    sceneContainer.value.clientHeight
  );
  // renderer.setClearColor(0xffffff); // 设置背景色
  // 兼容高清屏幕
  renderer.setPixelRatio(window.devicePixelRatio);
  // 消除canvas的外边框
  renderer.domElement.style.outline = "none";
  sceneContainer.value.appendChild(renderer.domElement);
  // 设置背景色
  renderer.setClearColor(new THREE.Color("#21282a"), 1);
  // renderer.setClearColor(new THREE.Color("#69c1de"), 1);
}

function initControls() {
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true; // 惯性
  orbitControls.dampingFactor = 0.25; // 动态阻尼系数
  orbitControls.enableZoom = true; // 缩放
  orbitControls.enablePan = true; // 右键拖拽
  // orbitControls.maxAzimuthAngle = Math.PI / 6; // 水平旋转范围
  // orbitControls.minAzimuthAngle = -Math.PI / 6;
  // orbitControls.maxPolarAngle = Math.PI / 6; // 垂直旋转范围
  // orbitControls.minPolarAngle = -Math.PI / 6;

  let axes = new THREE.AxesHelper(100);
  scene.add(axes);
}

function initPointLight() {
  const ambientLight = new THREE.AmbientLight(0x909090); // 自然光，每个几何体的每个面都有光
  const pointLight = new THREE.PointLight(0xffffff, 0.6);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(ambientLight);
  scene.add(pointLight);
}

function resize() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

function animate(time) {
  time *= 0.001;
  texture.offset.x = -(time * 1) % 1; // 贴图运动速度
  // texture.offset.x += 0.001;
  // resize();
  // const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function initPipeConf() {
  const transparentConf = {
    points: pointsArr,
    color: 0x4488ff,
    radius: 4,
    opacity: 0.3,
  };

  // 管道内流动的液体
  const conf = {
    points: pointsArr,
    // texture: "images/water_1.jpg",
    texture: "images/allow1.jpg",
    radius: 2,
  };
  // 创建管道
  const { texture: tubeTexture0, mesh: pipe0 } = creatPipe(transparentConf);
  const { texture: tubeTexture1, mesh: pipe1 } = creatPipe(conf);
  scene.add(pipe0);
  scene.add(pipe1);
  return { tubeTexture0, tubeTexture1 };
}

/**
 * 创建文本贴图
 * @param text
 * @returns {HTMLCanvasElement}
 */
function getTextCanvas(text) {
  let width = 512,
    height = 256;
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#C3C3C3";
  ctx.fillRect(0, 0, width, height);
  ctx.font = 50 + 'px "sans-serif';
  ctx.fillStyle = "#2891FF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  return canvas;
}

/**
 *  创建管线
 *  https://threejs.org/docs/index.html?q=TubeGeometry#api/en/geometries/TubeGeometry
 */
function creatPipe(conf) {
  const path = createPath(conf.points);
  const geometry = new THREE.TubeGeometry(path, 100, conf.radius, 20);

  const textureLoader = new THREE.TextureLoader();
  let material;
  if (conf.texture !== undefined) {
    // texture = textureLoader.load(conf.texture);   // 图片贴图
    texture = new THREE.CanvasTexture(getTextCanvas("➯ ➮ ➯")); // 文本贴图
    // 设置阵列模式为 RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    // 等价texture.repeat= new THREE.Vector2(3,1)
    texture.repeat.x = 10;
    // texture.repeat.y = 2; // Y轴方向重复

    // 图片贴图
    // 模拟管线运动动画，将两个素材图按比例合并，然后生成贴图texture
    /*    material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
    });*/

    //尝试使用文本贴图
    material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      // opacity: 0.1,
      color: conf.color,
    });
  } else {
    material = new THREE.MeshPhongMaterial({
      // map: texture,
      color: conf.color,
      transparent: true,
      opacity: conf.opacity,
      depthWrite: false,
    });
  }
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.rotation.z = Math.PI * 0.5; // 箭头方向
  mesh.rotation.x = Math.PI * 0.5; //修改箭头在管壁的位置

  return { texture, mesh };
}

function createPath(pointsArr) {
  pointsArr = pointsArr.map((point) => new THREE.Vector3(...point));
  // 利用CatmullRomCurve3 创建路径，不过是平滑的三维样条曲线
  return new THREE.CatmullRomCurve3(pointsArr);
}
</script>

<style scoped>
#sceneContainer {
  width: 100%;
  height: 100%;
}

#sceneContainer,
canvas {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}
</style>
