<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";
import Base3D from "../utils/base3D";
let data = reactive({
  base3d: {},
});
let water;
let sceneContainer = ref(null);
onMounted(() => {
  data.base3d = new Base3D(sceneContainer.value);
  initWater();
  animate();
});

function initWater() {
  const waterGeometry = new THREE.PlaneGeometry(10, 10);

  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "images/waternormals.jpg",
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: data.base3d.scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;
  water.position.x = 10;
  data.base3d.scene.add(water);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const time = performance.now() * 0.001;
  water.material.uniforms["time"].value += 1.0 / 60.0;
}
</script>

<style scoped></style>
