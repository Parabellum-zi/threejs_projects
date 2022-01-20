<template>
  <div ref="sceneContainer" id="sceneContainer">
    <canvas id="myCanvas" width="940" height="570"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

onMounted(() => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  animate();
});

let scene = reactive({});
let camera = reactive({});
let renderer = reactive({});
let orbitControls = reactive({});
let sceneContainer = ref(null);
// const Canvas = ref(null)

// let loader = reactive({});

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
  // camera.position.set(-100, 60, 100); // 设置相机位置
  camera.position.z = 3;
  scene.add(camera);
}

function initRenderer() {
  // 设置渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
  // loadModel();
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
}

const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
// const canvas = ref(null);

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
//
// const renderer = new THREE.WebGLRenderer();
// document.body.appendChild(renderer.domElement);

// make a texture with an arrow
// console.log(canvas.value);
// const canvas = document.getElementById("myCanvas");
// console.log(canvas);

// console.log(Canvas.value);
// const ctx = canvas.getContext("2d");
// ctx.canvas.width = 64;
// ctx.canvas.height = 64;

/*
ctx.fillStyle = "rgba(0,0,255,0.5)";
ctx.fillRect(0, 0, 64, 64);

ctx.translate(32, 32);
ctx.rotate(Math.PI * 0.5);
ctx.fillStyle = "rgb(0,255,255)";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = "48px sans-serif";
ctx.fillText("➡︎", 0, 0);

const texture = new THREE.CanvasTexture(ctx.canvas);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.x = 4;
texture.repeat.y = 9;

const radiusTop = 1;
const radiusBottom = 1;
const height = 5;
const radiusSegments = 20;
const heightSegments = 2;
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
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
mesh.rotation.z = Math.PI * 0.5;

function render(time) {
  time *= 0.001;

  resize();

  const cameraSpeed = time * 0.3;
  const cameraRadius = 5;
  camera.position.x = Math.cos(cameraSpeed) * cameraRadius;
  camera.position.y = 1;
  camera.position.z = Math.sin(cameraSpeed) * cameraRadius;
  camera.lookAt(mesh.position);

  texture.offset.y = (time * 3) % 1;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

function resize() {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }*/
// }
</script>

<style scoped>
canvas {
  width: 100vw;
  height: 100vh;
  display: block;
}
</style>
