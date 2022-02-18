<!--
@name:
@version:1.0
@description: threeJs scene load model with animation
@author: parabellum
@time: 2022-02-17 11:05:57
-->
<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
// import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let scene = reactive({});
let camera = reactive({});
let renderer = reactive({});
let orbitControls = reactive({});
const sceneContainer = ref(null);
let loadedGltf = [];
onMounted(() => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  initPointLight();
  resize();
  animate();
  loadModel();
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
  // camera.position.set(113, 23, 100); // 设置相机位置
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
  // renderer.setClearColor(new THREE.Color("#f6f6f6"), 1);
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

  // let axes = new THREE.AxesHelper(1000);
  // scene.add(axes);
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

    // Update rendererframe
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

function animate(time) {
  time *= 0.001;
  modelChange(time);
  // const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function modelChange(time) {
  if (loadedGltf.length === 0) return;
  loadedGltf.map((item) => {
    // console.log(item);
    switch (item.name) {
      case "Mesh206":
        rotationX(item.children, time);
        break;
      case "Mesh207":
        rotationX(item.children, time);
        break;
      case "Mesh208":
        rotationX(item.children, -time);
        break;
      case "Mesh120":
        changePosition(item, time);
        break;
    }
  });
}

/**
 * 部件绕x轴方向旋转
 */
function rotationX(parts, time) {
  for (const part of parts) {
    part.rotation.x = time;
  }
}
/**
 * 部件改变位置
 */
function changePosition(parts, time) {
  // console.log(parts);
  // parts.position.y += 0.001;
  // if (parts.position.z >= 13) {
  //   parts.position.z -= 0.2;
  // }
  // if (parts.position.z <= -13) {
  //   parts.position.z += 0.2;
  // }
  // console.log(time);
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
    "static/model/CVT.gltf",
    (gltf) => {
      scene.add(gltf.scene);
      console.log(dumpObject(gltf.scene).join("\n"));
      loadedGltf.push(gltf.scene.getObjectByName("Mesh206"));
      loadedGltf.push(gltf.scene.getObjectByName("Mesh207"));
      loadedGltf.push(gltf.scene.getObjectByName("Mesh208"));
      loadedGltf.push(gltf.scene.getObjectByName("Mesh120"));
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error(error);
    }
  );
}

/**
 * 参考自 https://threejs.org/manual/#en/load-gltf
 * 获取模型中的所有节点及子节点
 * @param obj
 * @param lines
 * @param isLast
 * @param prefix
 * @returns {*[]}
 */
function dumpObject(obj, lines = [], isLast = true, prefix = "") {
  const localPrefix = isLast ? "└─" : "├─";
  lines.push(
    `${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${
      obj.type
    }]`
  );
  const newPrefix = prefix + (isLast ? "  " : "│ ");
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
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
