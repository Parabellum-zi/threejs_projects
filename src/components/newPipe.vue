<template>
  <div ref="sceneContainer" id="sceneContainer"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// export default {
// name: "Particle"
// }
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
let geometry = reactive({});
let gui = new dat.GUI();
let clock = new THREE.Clock();
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
  // camera.position.set(-100, 60, 0); // 设置相机位置
  camera.position.z = 3;
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
}

function initObject() {
  geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
  const material = new THREE.PointsMaterial({
    size: 0.005,
  });
  // const loader = new THREE.TextureLoader(); // 自定义粒子
  // const cross = loader.load("/logo.png");
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    // map: cross,
    transparent: true,
  });
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCnt = 5000;
  const posArray = new Float32Array(particlesCnt * 3);
  for (let i = 0; i < particlesCnt * 3; i++) {
    // posArray[i] = (Math.random() - 0.5) * 5;
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5);
  }
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  const sphere = new THREE.Points(geometry, material);
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);

  scene.add(sphere, particlesMesh);
  gui.add(sphere.rotation, "x"); // 调整旋转属性
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
  texture.offset.x = (time * 1) % 1; // 贴图运动速度
  // texture.offset.x -= 0.06;
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
  let curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-80, -40, 0),
    new THREE.Vector3(-70, 40, 0),
    new THREE.Vector3(70, 40, 0),
    new THREE.Vector3(80, -40, 0),
  ]);

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);

  let tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.9, 50, false);
  let textureLoader = new THREE.TextureLoader();
  texture = textureLoader.load("images/southeast.jpg");
  // 设置阵列模式为 RepeatWrapping
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
  //等价texture.repeat= new THREE.Vector2(20,1)
  texture.repeat.x = 20;
  let tubeMaterial = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
  });

  // 设置数组材质对象作为网格模型材质参数
  let CylinderMesh = new THREE.Mesh(tubeGeometry, tubeMaterial); //网格模型对象Mesh
  scene.add(CylinderMesh); //网格模型添加到场景中
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
