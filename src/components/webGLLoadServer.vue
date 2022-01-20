<template>
  <div ref="sceneContainer" id="sceneContainer"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
// three
import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Sky } from "three/examples/jsm/objects/Sky";

// arcgis
import esriConfig from "@arcgis/core/config.js";
esriConfig.assetsPath = "./assets";
import Map from "@arcgis/core/Map";
import QueryTask from "@arcgis/core/tasks/QueryTask";
import Query from "@arcgis/core/rest/support/Query";
import FindTask from "@arcgis/core/tasks/FindTask";
import FindParameters from "@arcgis/core/rest/support/FindParameters";

let scene = reactive({});
let camera = reactive({});
let renderer = reactive({});
let orbitControls = reactive({});
const sceneContainer = ref(null);
let geometry = reactive({});
let gui = new dat.GUI();

onMounted(() => {
  initScene();
  initCamera();
  initRenderer();
  initControls();
  initPointLight();
  resize();
  animate();
  addPipeline();
  // addSky()
  getYSJ();
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
}

function addPipeline() {
  let pipelineUrl = "/server"; // Represents the REST endpoint for a layer of cities.
  let queryTask = new QueryTask({
    url: pipelineUrl,
  });
  let query = new Query();
  query.returnGeometry = true;
  query.outFields = ["*"];
  // query.where = "1=1";
  queryTask.execute(query).then(function (results) {
    console.log(results);
  });
}

function getYSJ() {
  fetch("static/json/ysd11.json")
    .then((res) => res.json())
    .then((data) => {
      data.features = data.features.sort(
        (a, b) => b.attributes.sxbh - a.attributes.sxbh
      );
      data.features.map((item, i) => {
        console.log(item);
        // createPipeMesh(item.geometry.x,item.geometry.y,5,)
      });
    });
}

function createPipeMesh(x1, y1, z1, x2, y2, z2, attributes) {
  // var Color = 0x0000ff;
  let radius = 4;
  let x0 = (x1 + x2) / 2;
  let y0 = (y1 + y2) / 2;
  let z0 = (z1 + z2) / 2;
  let p1 = new THREE.Vector3(x1, y1, z1);
  let p2 = new THREE.Vector3(x2, y2, z2);
  let length = Math.sqrt(
    (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2)
  );
  let material = new THREE.MeshLambertMaterial({ color: "0x0000ff" });
  let geometry = new THREE.CylinderGeometry(radius, radius, length);

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x0, y0, z0);
  mesh.lookAt(p2);
  mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  mesh.attributes = attributes;

  mesh.castShadow = true;
  let obj = new THREE.Object3D();
  obj.position.set(0, 0, 0);
  obj.add(mesh);
  obj.rotation.y = Math.PI;
  obj.rotation.z = Math.PI;

  scene.add(obj);
  // objects.push(mesh)
}

/*
let pointlight, transfromcotl;
var centerpoint = new THREE.Vector3(13893245.488948211, 0, 8625544) //偏移中心点
var objects = [];// 选择集合
var guiCtr;
var stats;

var PipeColor=  0x0000ff;
var MaholeColor = 0X00acac;
var SelectColor = 0x00ff00

function addSky() {
  var sky = new Sky();
  sky.scale.setScalar(100000);
  scene.add(sky);


  const uniforms = sky.material.uniforms;
  console.log(uniforms);
  uniforms.turbidity.value = 10;
  uniforms.rayleigh.value = 2;
  uniforms.mieCoefficient.value = 0.005;
  uniforms.mieDirectionalG.value = 0.8;

  var parameters = {
    distance: 200,
    inclination: 0.45,
    azimuth: 0.125
  };

  var theta = Math.PI * (parameters.inclination - 0.5);
  var phi = 2 * Math.PI * (parameters.azimuth - 0.5);



  // pointlight.position.x = parameters.distance * Math.cos(phi);
  // pointlight.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
  // pointlight.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);
  //
  // sky.material.uniforms.sunPosition.value = pointlight.position.copy(pointlight.position);

}





function AddTranCtr() {
  transfromcotl = new THREE.TransformControls(camera, renderer.domElement);
  transfromcotl.visible = false;
  scene.add(transfromcotl);
  renderer.domElement.addEventListener("click", onDocumentMouseDown, false);
}

function onDocumentMouseDown(e) {
  e.preventDefault();
  var mouse = new THREE.Vector2();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  //新建一个三维单位向量 假设z方向就是0.5
  //根据照相机，把这个向量转换到视点坐标系
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);

  //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  //射线和模型求交，选中一系列直线
  var intersects = raycaster.intersectObjects(objects);
  if (transfromcotl.object) {
    if (transfromcotl.object.attributes.hasOwnProperty("FLID")) {
      transfromcotl.object.material.color.setHex(0x0000ff);
    } else if (transfromcotl.object.attributes.hasOwnProperty("FNID")) {
      transfromcotl.object.material.color.setHex(0x00acac);
    }
  }

  if (intersects.length > 0) {
    //  SELECTED = intersects[0].object;
    //选中第一个射线相交的物体
    var intersected = intersects[0].object;
    console.log(intersected.attributes);
    // console.log(intersects[0].object)
    // var mat =  new THREE.MeshLambertMaterial({color:0x00ff00});
    intersected.material.color.setHex(SelectColor);
    transfromcotl.attach(intersected);
  } else {
    transfromcotl.detach(transfromcotl.object);
  }

}

function AddPipe() {

  require(["esri/map",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/tasks/FindTask",
    "esri/tasks/FindParameters"], function (Map, QueryTask, Query,FindTask,FindParameters) {
    var pipeurl = "http://localhost:6080/arcgis/rest/services/QA/MapServer/14";
    var queryTask = new QueryTask(pipeurl);
    var query = new Query();
    query.returnGeometry = true
    query.outFields = ["*"];
    query.where = "1=1";
    queryTask.execute(query, function (res) {
      res.features.map(function (v) {
        createPipeMesh(
          v.geometry.paths[0][0][0] - centerpoint.x, 5, v.geometry.paths[0][0][1] - centerpoint.z,
          v.geometry.paths[0][1][0] - centerpoint.x, 5, v.geometry.paths[0][1][1] - centerpoint.z,
          v.attributes
        )
      })

    })

  })
}

function createPipeMesh(x1, y1, z1, x2, y2, z2,attributes) {
  // var Color = 0x0000ff;
  var radius = 4;
  var x0 = (x1 + x2) / 2;
  var y0 = (y1 + y2) / 2;
  var z0 = (z1 + z2) / 2;
  var p1 = new THREE.Vector3(x1, y1, z1);
  var p2 = new THREE.Vector3(x2, y2, z2);
  var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
  var material = new THREE.MeshLambertMaterial({color: PipeColor});
  var geometry = new THREE.CylinderGeometry(radius, radius, length);


  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x0, y0, z0);
  mesh.lookAt(p2);
  mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  mesh.attributes= attributes;

  mesh.castShadow=true;
  var obj =  new  THREE.Object3D();
  obj.position.set(0,0,0);
  obj.add(mesh);
  obj.rotation.y=Math.PI;
  obj.rotation.z=Math.PI;

  scene.add(obj)
  objects.push(mesh)
}

function  AddMaholeMahole(){
  require(["esri/map", "esri/tasks/QueryTask", "esri/tasks/query","esri/tasks/FindTask",
    "esri/tasks/FindParameters"], function (Map, QueryTask, Query,FindTask,FindParameters) {
    var pipeurl = "http://localhost:6080/arcgis/rest/services/QA/MapServer/3";
    var queryTask = new QueryTask(pipeurl);
    var query = new Query();
    query.returnGeometry = true
    query.outFields = ["*"];
    query.where = "1=1";
    queryTask.execute(query, function (res) {


      res.features.map(function (v) {

        createMaholeMesh(v.geometry.x - centerpoint.x, 5, v.geometry.y - centerpoint.z, v.attributes)

      })


    })

  })
}

function   createMaholeMesh(x,y,z,attributes){
  // var Color = 0x00acac;
  var radius = 10;
  var  length = 15
  var material = new THREE.MeshLambertMaterial({color: MaholeColor});
  var geometry = new THREE.CylinderGeometry(radius, radius, length);
  var mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x,y,z)
  mesh.attributes = attributes;
  mesh.castShadow = true;
  var obj =  new  THREE.Object3D();
  obj.position.set(0,0,0);
  obj.add(mesh);
  obj.rotation.y=Math.PI;
  obj.rotation.z=Math.PI;

  scene.add(obj);
  objects.push(mesh);

}

function AddDatGui(){
  guiCtr  = new function () {
    this.dampingFactor =0.25;
  }
  var gui =  new  dat.GUI()
  gui.add(guiCtr,"dampingFactor",0,1);
}



function AddState() {
  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms
  document.getElementById("Stats-output").appendChild(stats.domElement);
}

InitScene();
AddDatGui();
AddState();
render();
AddTranCtr();
AddSky();
AddPipe();
AddMahole();

*/
</script>

<style scoped></style>
