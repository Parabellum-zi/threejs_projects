<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Base3D from "../utils/base3D";
import threeUniversal from "../utils/threeUniversal.js";
import * as THREE from "three";

let data = reactive({
  base3D: {},
});
let sceneContainer = ref(null);

onMounted(() => {
  data.base3D = new Base3D(sceneContainer.value);
  // threeUniversal.addFloor(data.base3D.scene);
  initContent();
});

/* 场景内容 */
function initContent() {
  // let geometry = new THREE.Geometry(); /* 简单基础几何 */
  let lineMaterial = new THREE.LineBasicMaterial({
    color: 0x808080,
  }); /* 基础线材质 */

  let planeGeometry = new THREE.PlaneGeometry(
    length,
    10
  ); /* 平面 width：200,、height：10 */
  let planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xd9d9d9,
    side: THREE.DoubleSide,
  }); /* 平面材质 */

  // geometry.vertices.push(
  //   new THREE.Vector3(-length / 2, 0, 0)
  // ); /* 顶点(-100, 0, 0) */
  // geometry.vertices.push(
  //   new THREE.Vector3(length / 2, 0, 0)
  // ); /* 顶点( 100, 0, 0) */

  /* 循环创建线段 */
  /* for (let i = 0; i <= length / 10; i++) {
    /!* 横向线段 *!/
    let lineX = new THREE.Line(geometry, lineMaterial);
    lineX.position.z = i * 10 - length / 2;
    data.base3D.scene.add(lineX);

    /!* 纵向线段 *!/
    let lineY = new THREE.Line(geometry, lineMaterial);
    lineY.rotation.y = 0.5 * Math.PI;
    lineY.position.x = i * 10 - length / 2;
    data.base3D.scene.add(lineY);
  }*/

  /* 创建包围平面 */
  let planeX_left = new THREE.Mesh(planeGeometry, planeMaterial);
  planeX_left.rotation.y = 0.5 * Math.PI;
  planeX_left.position.x = -length / 2;

  let planeX_right = planeX_left.clone();
  planeX_right.position.x = length / 2;

  let planeY_top = new THREE.Mesh(planeGeometry, planeMaterial);
  planeY_top.position.z = -length / 2;

  let planeY_bottom = planeY_top.clone();
  planeY_bottom.position.z = length / 2;

  data.base3D.scene.add(planeY_bottom);
  data.base3D.scene.add(planeY_top);
  data.base3D.scene.add(planeX_left);
  data.base3D.scene.add(planeX_right);

  /* 四个包围面的位置 y轴向上5 */
  data.base3D.scene.traverse(function (object) {
    if (object.isMesh) {
      if (object.geometry.type === "PlaneGeometry") {
        object.position.y = 5;
      }
    }
  });
}
</script>

<style scoped></style>
