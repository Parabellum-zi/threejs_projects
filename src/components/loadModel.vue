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
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import threeUniversal from "../utils/threeUniversal.js";
import Base3D from "../utils/base3D";

const sceneContainer = ref(null);
let loadedGltf = [];
let animationAction;
let mixer;
const clock = new THREE.Clock();
let data = reactive({
  base3D: {},
});
onMounted(() => {
  initScene();
  animate();
  loadModel();
});

function initScene() {
  data.base3D = new Base3D(sceneContainer.value);
}

function render() {
  let time = clock.getDelta();
  if (mixer) {
    mixer.update(time);
  }
}

function animate(time) {
  time *= 0.001;
  modelChange(time);
  render();
  // const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
}

function modelChange(time) {
  if (loadedGltf.length === 0) return;
  loadedGltf.map((item) => {
    switch (item.name) {
      case "rotation001":
        rotationY(item, time * 0.1);
        break;
      case "rotation002":
        rotationY(item, time);
        break;
      case "rotation003":
        rotationY(item, -time * 0.2);
        break;
      case "rotation004":
        rotationY(item, time * 0.4);
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
 * 部件绕y轴方向旋转
 */
function rotationY(parts, time) {
  parts.rotation.y = time;
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
  // const loader = new ColladaLoader();
  loader.load(
    // "static/model/CVT.gltf",
    // "static/model/plant.gltf",
    // "static/model/stormtrooper.dae",
    // "static/model/animation.gltf",
    // "static/model/dz.gltf",
    // "static/model/pool.gltf",
    // "static/model/liede.gltf",
    "static/model/jiadu/jiadu2.gltf",
    (gltf) => {
      // console.log(gltf);
      // gltf.scene.scale.x = 0.2;
      // gltf.scene.scale.y = 0.2;
      // gltf.scene.scale.z = 0.2;
      gltf.scene.scale.x = 50;
      gltf.scene.scale.y = 50;
      gltf.scene.scale.z = 50;
      // gltf.scene.scale.x = 0.01;
      // gltf.scene.scale.y = 0.01;
      // gltf.scene.scale.z = 0.01;
      data.base3D.scene.add(gltf.scene); //gltf.scene 添加了所有场景

      //添加骨骼辅助
      let meshHelper = new THREE.SkeletonHelper(gltf.scene);
      data.base3D.scene.add(meshHelper);

      // console.log(threeUniversal.dumpObject(gltf.scene).join("\n")); // print node tree
      // loadedGltf.push(gltf.scene.getObjectByName("Mesh206"));
      // loadedGltf.push(gltf.scene.getObjectByName("Mesh207"));
      // loadedGltf.push(gltf.scene.getObjectByName("Mesh208"));
      // loadedGltf.push(gltf.scene.getObjectByName("Mesh120"));

      loadedGltf.push(gltf.scene.getObjectByName("rotation001"));
      loadedGltf.push(gltf.scene.getObjectByName("rotation002"));
      loadedGltf.push(gltf.scene.getObjectByName("rotation003"));
      loadedGltf.push(gltf.scene.getObjectByName("rotation004"));

      // 调用动画
      //AnimationMixer是场景中特定对象的动画播放器。当场景中的多个对象独立动画时，可以为每个对象使用一个AnimationMixer
      // let mixer = new THREE.AnimationMixer(camera); // 相当于设置好关键帧播放器
      // mixer = new THREE.AnimationMixer(gltf.scene); // 相当于设置好关键帧播放器

      // animationAction = mixer.clipAction(gltf.animations[0]);
      // 设置动画播放时长(秒，重复次数)
      // animationAction.setDuration(1).setLoop(THREE.LoopRepeat);
      // animationAction.play();

      // gltf.scene.rotation.z += Math.PI;
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error(error);
    }
  );
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
