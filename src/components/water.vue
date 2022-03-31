<template>
  <div id="sceneContainer" ref="sceneContainer">
    <div id="label" ref="label"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Base3D from "../utils/base3D";
import * as THREE from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

let data = reactive({
  base3D: {},
});
let labelGroup = new THREE.Group();
labelGroup.name = "labels";

let sceneContainer = ref(null);
onMounted(() => {
  data.base3D = new Base3D(sceneContainer.value);
  data.base3D.scene.add(labelGroup);
  initContent();
  animate();
  addEventListener("click", onMouseDblclick, false);
  // addEventListener("resize", onWindowResize, false);
});
let label = ref(null); // 预留
let selectObject;

// 初始化模型
function initContent() {
  let cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
  let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x9370db });
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.y = 50;
  cube.name = "cube";
  data.base3D.scene.add(cube);

  let sphereGeometry = new THREE.SphereGeometry(50, 50, 50, 50);
  let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x3cb371 });
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.x = 200;
  sphere.position.y = 50;
  sphere.name = "sphere";
  // sphere.position.z = 200;
  data.base3D.scene.add(sphere);

  let cylinderGeometry = new THREE.CylinderGeometry(50, 50, 100, 100);
  let cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xcd7054 });
  let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.position.x = -200;
  cylinder.position.y = 50;
  cylinder.name = "cylinder";
  // cylinder.position.z = -200;
  data.base3D.scene.add(cylinder);
}

// 鼠标双击触发的方法
function onMouseDblclick(event) {
  // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
  let intersects = getIntersects(event);
  // 获取选中最近的 Mesh 对象
  if (intersects.length !== 0 && intersects[0].object instanceof THREE.Mesh) {
    selectObject = intersects[0].object;
    if (selectObject.name == "sky") return;
    changeMaterial(selectObject);
    popupContent("three.js", selectObject);
    let allChildren = labelGroup.children;
    for (let i = allChildren.length - 1; i >= 0; i--) {
      console.log(allChildren[i].type);
      if (allChildren[i].type === "Mesh") {
        // console.log(allChildren[i]);
        labelGroup.remove(allChildren[i]);
      }
    }
  } else {
    console.log("未选中 Mesh!");
    /*  data.base3D.scene.traverse((obj) => {
      if (obj.type === "Group" && obj.name === "labels") {
        console.log(obj);
        // data.base3D.scene.remove(labelGroup);
      }
    });*/

    /*   let allChildren = data.base3D.scene.children;
    for (let i = allChildren.length - 1; i >= 0; i--) {
      if (allChildren[i] instanceof THREE.Group) {
        data.base3D.scene.remove(allChildren[i]);
      }
    }*/
    /*let allChildren = labelGroup.children;
    for (let i = allChildren.length - 1; i >= 0; i--) {
      console.log(allChildren[i].type);
      if (allChildren[i].type === "Mesh") {
        // console.log(allChildren[i]);
        labelGroup.remove(allChildren[i]);
      }
    }*/
  }
}

// 获取与射线相交的对象数组
function getIntersects(event) {
  event.preventDefault();
  // console.log("event.clientX:" + event.clientX);
  // console.log("event.clientY:" + event.clientY);
  // 声明 raycaster 和 mouse 变量
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
  raycaster.setFromCamera(mouse, data.base3D.camera);
  // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
  return raycaster.intersectObjects(data.base3D.scene.children);
}

// 改变对象材质属性
function changeMaterial(object) {
  object.material = new THREE.MeshLambertMaterial({
    color: 0xffffff * Math.random(),
    transparent: !object.material.transparent,
    opacity: 0.5,
  });
}
// 更新div的位置
function renderDiv(object) {
  // 获取窗口的一半高度和宽度
  let halfWidth = window.innerWidth / 2;
  let halfHeight = window.innerHeight / 2;

  // 逆转相机求出二维坐标
  let vector = object.position.clone().project(data.base3D.camera);
  // console.log(vector);
  /*  // 修改 div 的位置
  label.value.css({
    left: vector.x * halfWidth + halfWidth,
    top: -vector.y * halfHeight + halfHeight - object.position.y,
  });
  // 显示模型信息
  label.value.text("name:" + object.name);*/
}
function animate() {
  if (selectObject !== undefined && selectObject !== null) {
    renderDiv(selectObject);
  }
  requestAnimationFrame(animate);
}

function popupContent(text, selectObject) {
  let { x, y, z } = selectObject.position.clone();
  let loader = new FontLoader();
  loader.load("/fonts/STSong_Regular.json", (font) => {
    // 材质
    let fontMaterial = new THREE.MeshLambertMaterial({
      color: 0x912cee,
      side: THREE.DoubleSide,
    });
    /*
  let planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x545454,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });

  let planeGeometry = new THREE.PlaneGeometry(60, 30);
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y += 40;
  data.base3D.scene.add(plane);*/
    // 生成二维字体模型
    let shapes = font.generateShapes(text, 10, 1);
    let fontGeometry = new THREE.ShapeGeometry(shapes);
    // 绑定盒子模型
    fontGeometry.computeBoundingBox();
    let fonts = new THREE.Mesh(fontGeometry, fontMaterial);
    fonts.position.set(x, y + 60, z);
    labelGroup.add(fonts);
    // console.log(labelGroup);
  });
}
</script>

<style scoped>
#label {
  position: absolute;
  padding: 10px;
  background: rgba(255, 255, 255, 0.6);
  line-height: 1;
  border-radius: 5px;
}
</style>
