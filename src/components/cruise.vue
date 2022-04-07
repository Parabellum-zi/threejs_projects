<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import * as THREE from "three";
import threeUniversal from "../utils/threeUniversal.js";
import Base3D from "../utils/base3D";
const sceneContainer = ref(null);
let data = reactive({
  base3D: {},
});
let pointsList = []; // 顶点数组
let window_mouse = false; // 事件标识
onMounted(() => {
  initScene();
});

function initScene() {
  data.base3D = new Base3D(sceneContainer.value);
  threeUniversal.addFloor(data.base3D.scene);
  document.addEventListener("mousedown", onMouseDown, false);
  document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("keydown", onKeyDown, false);
}

/**
 * 获取camera射线与平面的交点
 *
 */
function getIntersects(event) {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // 这里我们只检测模型的选中情况
  raycaster.setFromCamera(mouse, data.base3D.camera);
  const intersects = raycaster.intersectObjects(
    data.base3D.scene.children,
    true
  );
  if (intersects.length < 0) return;
  let selected = intersects[0]; //取第一个物体
  let { x, y, z } = selected.point;
  return new THREE.Vector3(x, y + 5, z);
}

function onMouseDown(event) {
  let intersects = getIntersects(event);
  // 鼠标左键创建点和线段
  if (event.button === 0) mouseLeft(intersects);
  if (event.button === 2) mouseRight(intersects);
}

function mouseLeft(intersects) {
  if (!window_mouse) {
    document.addEventListener("mousemove", onMouseMove, false);
    // 避免事件的重复添加
    window_mouse = true;
  }
  let { x, y, z } = intersects;
  let vertices = [];
  // 判断交点是否在 x(,) ，z(, )平面范围内
  if (Math.abs(intersects.x) < 1000 / 2 && Math.abs(intersects.z) < 1000 / 2) {
    pointsList.push(intersects); // 线段点集
    /*创建点*/
    vertices.push(x, y, z);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3) // （vertices为普通一维数组）
    );
    let sprite = new THREE.TextureLoader().load("/images/disc.png");
    let material = new THREE.PointsMaterial({
      size: 5, // 设置点大小
      sizeAttenuation: true,
      map: sprite,
      alphaTest: 0.5,
      transparent: true,
    });
    material.color.setHSL(1.0, 0.5, 0.7); // 设置点颜色
    const endpoint = new THREE.Points(geometry, material);
    data.base3D.scene.add(endpoint);
    /* 创建线段 */
    let lineGeometry = new THREE.BufferGeometry().setFromPoints(pointsList);
    let lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 2,
    });
    // 线段分段
    if (pointsList.length >= 2) {
      let line = new THREE.Line(lineGeometry, lineMaterial);
      line.castShadow = true;
      pointsList.shift();
      data.base3D.scene.add(line);
    }

    /*   /!* 一条连续的线段的开始端的球体几何 *!/
    if (first_sphere) {
      /!* 创建球体 *!/
      let sphereGeometry = new THREE.SphereGeometry(5, 20, 20);
      let sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0xb23aee,
      });

      let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(intersects.x, intersects.y + 5, intersects.z);
      scene.add(sphere);

      first_sphere = false;
    }

    scene.add(points);*/
  }
}

function mouseRight() {
  removeListener();
  deleteLast(); // 恢复监听事件
}

function onMouseMove(event) {
  let intersects = getIntersects(event);
  if (Math.abs(intersects.x) < 1000 / 2 && Math.abs(intersects.z) < 1000 / 2) {
    /* 鼠标左键未点击时线段的移动状态 */
    if (data.base3D.scene.getObjectByName("line_move"))
      data.base3D.scene.remove(data.base3D.scene.getObjectByName("line_move"));
    /* 创建线段 */
    if (pointsList.length === 0) return;
    let lineGeometry = new THREE.BufferGeometry().setFromPoints([
      pointsList[0],
      intersects,
    ]);
    let lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    let line = new THREE.Line(lineGeometry, lineMaterial);
    line.name = "line_move";
    data.base3D.scene.add(line);
  }
}

function onKeyDown(event) {
  if (event.keyCode === 27) {
    //ESC键
    removeListener();
    let scene = data.base3D.scene;
    /* 按步骤移除点和线段 */
    if (scene.children.Line || scene.children.Points) {
      scene.children.pop();
      /* 若最后一项不是线段或者点就不移除 */
      if (!scene.children.Mesh) scene.children.pop();
    }
    deleteLast();
  }
  if (event.keyCode === 32) {
    // space键
  }
}

/**
 * 清除监听事件
 */
function removeListener() {
  /* 绘制结束，移除鼠标点击和移动事件 */
  document.removeEventListener("mousemove", onMouseMove, false);
  document.removeEventListener("mousedown", onMouseDown, false);
  /*避免事件的重复添加 */
  window_mouse = false;
  /* 鼠标左键未点击时线段的移动状态 */
  if (data.base3D.scene.getObjectByName("line_move")) {
    data.base3D.scene.remove(data.base3D.scene.getObjectByName("line_move"));
    /* 删除数组中的元素，否则的话再次重绘会链接之前的点接着重绘 */
    pointsList.shift();
    /* 结束绘制之后，再次绘制仍然需要添加一个球体 */
    // first_sphere = true;
  }
}

/* 当场景中只有一个球和一个点的时候执行删除操作 */
function deleteLast() {
  let i = 0;
  data.base3D.scene.traverse((object) => {
    if (object.isPoints) i++;
  });
  if (i < 2) {
    /* 删除点和球 */
    for (let i = 0; i < data.base3D.scene.children.length; i++) {
      let object = data.base3D.scene.children[i];
      if (
        object.type === "Points" ||
        object.geometry instanceof THREE.SphereGeometry
      ) {
        data.base3D.scene.remove(object);
        /* i-- 作用：用来控制scene.children.length不断减小而 i 却不断变大的问题，否则会导致无法完全删除元素 */
        i--;
      }
    }
    /* 移除完线段、点、球结束后 再次添加点击事件 */
    window.addEventListener("mousedown", onMouseDown, false);
    /* 动画结束之后， 在添加键盘事件 */
    window.addEventListener("keydown", onKeyDown, false);
  }
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
