<template>
  <div ref="sceneContainer" id="sceneContainer"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

// import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

onMounted(() => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  initPointLight();
  // initObject();
  drawCylinder();
  resize();
  animate();
});

let scene = reactive({});
let camera = reactive({});
let renderer = reactive({});
let orbitControls = reactive({});
const sceneContainer = ref(null);
// let geometry = reactive({});
// let gui = new dat.GUI();
// let clock = new THREE.Clock();
let texture;
let CylinderMesh;
let stripMesh;

function initScene() {
  // 创建场景
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
  // camera.position.set(100, 60, 90); // 设置相机位置
  camera.position.z = 7;
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
  renderer.setClearColor(new THREE.Color("#21282a"), 1);
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
  const axesHelper = new THREE.AxesHelper(10000);
  scene.add(axesHelper);
}

function initPointLight() {
  const pointLight = new THREE.PointLight(0xffffff, 0.1);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
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

const animate = function (time) {
  time *= 0.001;
  //  关键  箭头贴图动画
  texture.offset.y = (time * 1) % 1; // 贴图运动速度
  // texture.offset.x += 0.001;
  // 加载时场景旋转
  // const cameraSpeed = time * 0.3;
  // const cameraRadius = 5;
  // camera.position.x = Math.cos(cameraSpeed) * cameraRadius;
  // camera.position.y = 1;
  // camera.position.z = Math.sin(cameraSpeed) * cameraRadius;
  // camera.lookAt(CylinderMesh.position);

  resize();
  // const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

function drawCylinder() {
  // 创建 箭头的 canvas
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = 64;
  ctx.canvas.height = 64;
  ctx.fillStyle = "rgb(105,181,201)";
  ctx.fillRect(0, 0, 64, 64);
  ctx.translate(32, 32);
  ctx.rotate(Math.PI * 0.5);
  ctx.fillStyle = "rgb(0,255,255)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "48px sans-serif";
  ctx.fillText("➡︎", 0, 0);

  texture = new THREE.CanvasTexture(ctx.canvas);
  // texture = new THREE.TextureLoader().load("images/southeast.jpg");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 4;
  texture.repeat.y = 9;

  // 创建管道
  const radiusTop = 1;
  const radiusBottom = 1;
  const height = 10; // 修改管线长度
  const radiusSegments = 20;
  const heightSegments = 200;
  const openEnded = true;
  const geometry = new THREE.CylinderBufferGeometry(
    radiusTop,
    radiusBottom,
    height,
    radiusSegments,
    heightSegments,
    openEnded
  );
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });
  CylinderMesh = new THREE.Mesh(geometry, material);
  scene.add(CylinderMesh);
  CylinderMesh.rotation.z = Math.PI * 0.5;

  const stripGeo = new THREE.PlaneBufferGeometry(radiusTop * 1.7, height);
  const stripMat = new THREE.MeshBasicMaterial({
    map: texture,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });
  stripMesh = new THREE.Mesh(stripGeo, stripMat);
  scene.add(stripMesh);
  stripMesh.rotation.z = Math.PI * 0.5;
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
