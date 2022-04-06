<!--
@name:
@version:1.0
@description: threeJs scene load model with animation
@author: parabellum
@time: 2022-02-17 11:05:57
-->
<template>
  <div id="sceneContainer" ref="sceneContainer">
    <div class="phaseOf">
      <button class="phaseOf_c" @click.stop="jumpToTarget(0)">一期</button>
      <button class="phaseOf_c" @click.stop="jumpToTarget(1)">二期</button>
      <button class="phaseOf_c" @click.stop="jumpToTarget(2)">三期</button>
      <button class="phaseOf_c" @click.stop="jumpToTarget(3)">四期</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import threeUniversal from "../utils/threeUniversal.js";
import Base3D from "../utils/base3D";
import TWEEN from "@tweenjs/tween.js";

const sceneContainer = ref(null);
let loadedGltf = [];
let animationAction;
let mixer;
const clock = new THREE.Clock();
let data = reactive({
  base3D: {},
});

let cameraLocations = [
  {
    x: -299.9296644186333,
    y: 175.31136861712542,
    z: 257.3866588389222,
  },
  {
    x: -259.43963297633354,
    y: 194.86606425459377,
    z: 21.568699126278887,
  },
  {
    x: -510.1725026842701,
    y: 157.9204396191062,
    z: -7.941532670921576,
  },
  {
    x: 59.611937566801956,
    y: 141.06905979681704,
    z: 108.33866058877214,
  },
]; // 污水厂
let targetLocations = [
  {
    x: -296.29997695526777,
    y: -2.992567232844881,
    z: -40.942248996347054,
  },
  {
    x: -256.22185416958445,
    y: -2.476203241471992e-15,
    z: -202.1324332620674,
  },
  {
    x: -450.6937558647732,
    y: -5.4438868046524034e-15,
    z: -6.341002582100552,
  },
  {
    x: 60.10470484298909,
    y: -2.0956385637195345e-15,
    z: 32.16971113117626,
  },
];
onMounted(() => {
  initScene();
  animate();
  loadModel();

  // let count = 0;
  // setInterval(() => {
  //   /*    console.log("camera", getCurrentCamera());
  //   console.log("target", getCurrentCtrlTarget());*/
  //   count += 1;
  //   if (count >= cameraLocations.length) count = 0;
  //   jumpToTarget(count);
  // }, 1000 * 5);
});

function initScene() {
  data.base3D = new Base3D(sceneContainer.value);
  threeUniversal.addFloor(data.base3D.scene);
}

function jumpToTarget(i) {
  data.base3D.tweenAnimation(
    data.base3D.getCurrentCamera(),
    data.base3D.getCurrentCtrlTarget(),
    cameraLocations[i],
    targetLocations[i]
  );
}

function render() {
  let time = clock.getDelta();
  if (mixer) mixer.update(time);
  TWEEN.update(); //动画一帧帧更新配合requestAnimationFrame
}

function animate(time) {
  time *= 0.001;
  // modelChange(time);
  // const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
  render();
}

/**
 * desc: 间补动画
 * oldP 相机原位置  (camera.position)
 * oldT 原control target
 * newP 相机新位置  (control.target)
 * newT 新control target
 */
function tweenAnimation(oldP, oldT, newP, newT) {
  let tween = new TWEEN.Tween({
    x1: oldP.x,
    y1: oldP.y,
    z1: oldP.z,
    x2: oldT.x,
    y2: oldT.y,
    z2: oldT.z,
  });
  tween.to(
    {
      x1: newP.x,
      y1: newP.y,
      z1: newP.z,
      x2: newT.x,
      y2: newT.y,
      z2: newT.z,
    },
    1000 * 1.5
  );
  tween.onUpdate((object) => {
    //在 tween 动画每次更新后执行
    data.base3D.camera.position.x = object.x1;
    data.base3D.camera.position.y = object.y1;
    data.base3D.camera.position.z = object.z1;
    data.base3D.orbitControls.target.x = object.x2;
    data.base3D.orbitControls.target.y = object.y2;
    data.base3D.orbitControls.target.z = object.z2;
    data.base3D.orbitControls.update();
  });
  tween.onComplete(() => {
    //在 tween 动画全部结束后执行
    data.base3D.orbitControls.enabled = true;
  });
  tween.easing(TWEEN.Easing.Cubic.InOut);
  tween.start(); // tween 动画开始前的回调函数
}

/*
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

/!**
 * 部件绕x轴方向旋转
 *!/
function rotationX(parts, time) {
  for (const part of parts) {
    part.rotation.x = time;
  }
}

/!**
 * 部件绕y轴方向旋转
 *!/
function rotationY(parts, time) {
  parts.rotation.y = time;
}
/!**
 * 部件改变位置
 *!/
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
*/

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
    "static/model/liede.gltf",
    // "static/model/jiadu/jiadu2.gltf",
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
    }
    // (xhr) => {
    //   console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    // },
    // (error) => {
    //   console.error(error);
    // }
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

.phaseOf {
  position: fixed;
  top: 100px;
  left: 4px;
  width: 43px;
  height: 130px;
}
.phaseOf .phaseOf_c {
  margin: 4px 0;
}
</style>
