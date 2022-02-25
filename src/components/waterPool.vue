<template>
  <div id="sceneContainer"></div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import Base3D from "../utils/base3D";
let data = reactive({
  base3d: {},
});

onMounted(() => {
  data.base3d = new Base3D("#sceneContainer");
  init();
});

function init() {
  data.base3d.addModels("CVT.gltf");
}
</script>

<style scoped></style>
