<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import threeUniversal from "../utils/threeUniversal";
let scene = reactive({});
let camera = reactive({});
let renderer = reactive({});
let orbitControls = reactive({});
const sceneContainer = ref(null);
// let geometry = reactive({});
let gui;
let material;
// let clock = new THREE.Clock();
const pointsArr = [
  [-80, -20, 0],
  [-70, 20, 0],
  [0, 0, 0],
  [70, 30, 0],
  [20, 40, 0],
];
/*
const pointsArr = [
  [113.33200717035561, 23.123868298337488, 20],
  [113.33193471797097, 23.12389375632453, 20],
  [113.33187953734473, 23.123770177383715, 20],
  [113.33185832872239, 23.123481594596804, 20],
  [113.33169725322034, 23.12263653054203, 20],
  [113.3319550555247, 23.122622333204134, 20],
  [113.33223498079862, 23.12261203308015, 20],
  [113.33252478587465, 23.122587171140765, 20],
  [113.3327903879739, 23.122589532743206, 20],
  [113.33300847557683, 23.12258577162446, 20],
  [113.33322488273681, 23.122574663006855, 20],
  [113.33325226582443, 23.122530909194133, 20],
  [113.3332644228248, 23.122309951803306, 20],
  [113.33325917485871, 23.12204813100512, 20],
  [113.3332602085735, 23.121777588490747, 20],
  [113.33326582366728, 23.12153099095903, 20],
  [113.33326443507165, 23.12145409799167, 20],
  [113.33327543328967, 23.121325676116662, 20],
  [113.33347832991453, 23.12131401426879, 20],
  [113.33376506377276, 23.121288358975708, 20],
  [113.33404731471101, 23.121263662071076, 20],
  [113.33428435196257, 23.12123652778491, 20],
  [113.33444257785685, 23.12108209002754, 20],
  [113.33444245620335, 23.12082534299868, 20],
  [113.33443698584692, 23.12054420347713, 20],
  [113.33443361968887, 23.12031888058382, 20],
  [113.33443122026354, 23.120002662765, 20],
  [113.33442693344298, 23.11972456728798, 20],
  [113.3344232242018, 23.119552454790348, 20],
  [113.33453681602084, 23.119526738111013, 20],
  [113.33475147734951, 23.119489872823163, 20],
  [113.33512287057088, 23.11944253470876, 20],
  [113.33565136182612, 23.11937221691412, 20],
  [113.33648041097598, 23.118473519373225, 20],
  [113.33648800266937, 23.118457139717187, 20],
];
*/

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
  // initGui();
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
  // 设置背景色
  renderer.setClearColor(new THREE.Color("#21282a"), 1);
  sceneContainer.value.appendChild(renderer.domElement);
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
  // scene.add(pointLight);
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
  // console.log(texture);
  texture.offset.x = -(time * 1) % 1; // 贴图运动速度
  // texture.offset.x += 0.001;
  // resize();
  // const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function initPipeConf() {
  /* const path = new THREE.Path();
  path.lineTo(0, 0.8);
  path.quadraticCurveTo(0, 1, 0.2, 1);
  path.lineTo(1, 1);
  const points = path.getPoints();
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const line = new THREE.Line(geometry, material);
  scene.add(line);*/

  threeUniversal.addFloor(scene);

  const transparentConf = {
    points: pointsArr,
    color: 0x4488ff,
    radius: 3,
    opacity: 0.1,
  };

  // 管道内流动的液体
  const conf = {
    points: pointsArr,
    texture: "images/allow2.png",
    radius: 1.5,
  };
  // 创建管道
  const { texture: tubeTexture0, mesh: pipe0 } = creatPipe(transparentConf);
  const { texture: tubeTexture1, mesh: pipe1 } = creatPipe(conf);
  scene.add(pipe0);
  scene.add(pipe1);
  // return { tubeTexture1 };

  /* let stripMesh;
  // 管中心平面
  const stripGeo = new THREE.PlaneGeometry(50, 100);
  const stripMat = new THREE.MeshBasicMaterial({
    map: texture,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });
  stripMesh = new THREE.Mesh(stripGeo, stripMat);
  scene.add(stripMesh);*/
  // stripMesh.rotation.z = Math.PI * 0.5;
  // stripMesh.rotation.y = Math.PI * 0.5;
  // stripMesh.rotation.x = Math.PI * 0.5;

  return { tubeTexture0, tubeTexture1 };
  // return { tubeTexture1 };
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
  // ctx.fillStyle = "rgba(76,180,206,0.1)";
  ctx.fillStyle = "rgba(241,11,11,0.2)";
  ctx.fillRect(0, 0, width, height);
  ctx.font = 500 + 'px "sans-serif';
  ctx.fillStyle = "rgba(40,145,255,1)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  return canvas;
}

//初始化dat.GUI简化试验流程
function initGui() {
  //声明一个保存需求修改的相关数据的对象
  gui = {
    offsetX: 0,
    offsetY: 0,
    repeatX: 1,
    repeatY: 1,
    rotation: 0,
    centerX: 0.5,
    centerY: 0.5,
    RepeatWrapping: true,
  };
  let datGui = new dat.GUI();
  //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
  datGui.add(gui, "offsetX", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "offsetY", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "repeatX", 0.25, 2.0).onChange(updateUV);
  datGui.add(gui, "repeatY", 0.25, 2.0).onChange(updateUV);
  datGui.add(gui, "rotation", -2.0, 2.0).onChange(updateUV);
  datGui.add(gui, "centerX", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "centerY", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "RepeatWrapping").onChange(function (e) {
    if (e) {
      material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping; //设置为可循环
    } else {
      material.map.wrapS = material.map.wrapT = THREE.ClampToEdgeWrapping; //设置会默认的最后一像素伸展
    }

    material.map.needsUpdate = true;
  });
}

//更新纹理贴图的方法
function updateUV() {
  // 一种方法，直接全写在一个方法内
  //texture.matrix.setUvTransform( API.offsetX, API.offsetY, API.repeatX, API.repeatY, API.rotation, API.centerX, API.centerY );

  // 另一种方法，分开写
  material.map.matrix
    .identity() //矩阵重置
    .translate(-gui.centerX, -gui.centerY) //设置中心点
    .rotate(gui.rotation) // 旋转
    .scale(gui.repeatX, gui.repeatY) //缩放
    .translate(gui.centerX, gui.centerY) //设置中心点
    .translate(gui.offsetX, gui.offsetY); //偏移
}

/**
 *  创建管线
 *  https://threejs.org/docs/index.html?q=TubeGeometry#api/en/geometries/TubeGeometry
 */
function creatPipe(conf) {
  const path = createPath(conf.points);
  const geometry = new THREE.TubeGeometry(path, 100, conf.radius, 15, false);

  const textureLoader = new THREE.TextureLoader();
  let material;

  if (conf.texture !== undefined) {
    texture = textureLoader.load(conf.texture); // 图片贴图
    // texture = new THREE.CanvasTexture(getTextCanvas("➯ ➮ ➯")); // 文本贴图
    // 设置阵列模式为 RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    // 等价texture.repeat= new THREE.Vector2(3,1)
    texture.repeat.set(10, 1);
    // texture.rotation = Math.PI;
    // 图片贴图
    // 模拟管线运动动画，将两个素材图按比例合并，然后生成贴图texture
    material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
      depthTest: false, // 深度检测
    });

    //尝试使用文本贴图
    /*    material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
      color: conf.color,
    });*/
  } else {
    material = new THREE.MeshPhongMaterial({
      // map: texture,
      color: conf.color,
      transparent: true,
      opacity: conf.opacity,
      depthWrite: false, // 为true内部流动的液体会被遮挡无法显示
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
