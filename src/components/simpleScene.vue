<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import Base3D from "../utils/base3D";
import threeUniversal from "../utils/threeUniversal";
import { reactive, ref, onMounted } from "vue";
import * as THREE from "three";
let data = reactive({
  base3D: {},
});
const sceneContainer = ref(null);
onMounted(() => {
  initScene();
});
let labels3d = [
  { x: -106, y: 4, z: 211, name: "一期沉沙池" },
  { x: -106, y: 4, z: 148, name: "二期沉沙池" },
  { x: -106, y: 4, z: 178, name: "三期沉沙池" },
  { x: -292, y: 4, z: 58, name: "一期反应池" },
  { x: -367, y: 4, z: 58, name: "一期沉淀池" },
  { x: -167, y: 4, z: 58, name: "一期沉淀池" },
  { x: -197, y: 4, z: 237, name: "一二期消毒池" },
  { x: -430, y: 4, z: -140, name: "三期生化池" },
  { x: -246, y: 4, z: -140, name: "二期反应池" },
  { x: -478, y: 4, z: 60, name: "三期二沉池" },
  { x: -474, y: 4, z: 205, name: "三期消毒池" },
  { x: -48, y: 4, z: 245, name: "一二三期提升泵房" },
  { x: 25, y: 4, z: 174, name: "污泥大转盘" },
  { x: -48, y: 4, z: 100, name: "四期提升泵房" },
  { x: 49, y: 4, z: 100, name: "四期沉沙池" },
  { x: 106, y: 4, z: 0, name: "四期生化池" },
  { x: 106, y: 4, z: -100, name: "四期二沉池" },
  { x: 234, y: 4, z: -150, name: "高效沉淀池" },
  { x: 60, y: 4, z: -167, name: "转盘滤池" },
  { x: -30, y: 4, z: -170, name: "紫外消毒池" },
];
let spriteGroup = new THREE.Group();
spriteGroup.name = "labels_2d";
function initScene() {
  data.base3D = new Base3D(sceneContainer.value);
  threeUniversal.addFloor(data.base3D.scene);
  loadLabels();
}

function loadLabels() {
  labels3d.map((item) => spriteImg(item));
}

function spriteImg(labels_D) {
  let { x, y, z } = labels_D;
  let texture = new THREE.ImageUtils.loadTexture("images/label.png");
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  let material = new THREE.SpriteMaterial({
    map: texture,
    useScreenCoordinates: false,
    // alignment: THREE.SpriteAlignment.center,
    transparent: true,
  });
  let sprite = new THREE.Sprite(material);
  sprite.scale.set(10, 10, 10);
  sprite.position.set(x, y, z);
  spriteGroup.add(sprite);
  spriteText(labels_D);
}
function spriteText(labels_D) {
  let { x, y, z, name } = labels_D;
  let c_width = 200,
    c_hight = 140;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = c_width;
  canvas.height = c_hight;
  //制作矩形
  ctx.fillStyle = "rgba(98,75,14,1)";
  ctx.fillRect(0, 0, c_width, c_hight * 0.22);
  ctx.fillStyle = "#FFDD77";
  ctx.font = 24 + 'px "sans-serif';
  ctx.textAlign = "center"; // 设置水平对齐方式
  ctx.textBaseline = "middle"; // 设置垂直对齐方式
  ctx.fillText(name, c_width / 2, (c_hight * 0.23) / 2); // canvas  水平垂直居中
  let texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  let material = new THREE.SpriteMaterial({
    map: texture,
    useScreenCoordinates: false,
    // alignment: THREE.SpriteAlignment.center,
    transparent: true,
  });
  let sprite = new THREE.Sprite(material);
  sprite.scale.set(10, 10, 10);
  sprite.position.set(x, y, z);
  spriteGroup.add(sprite);
  data.base3D.scene.add(spriteGroup);
}
</script>

<style scoped></style>
