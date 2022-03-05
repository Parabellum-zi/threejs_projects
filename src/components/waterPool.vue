<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Base3D from "../utils/base3D";
let data = reactive({
  base3d: {},
});
let sceneContainer = ref(null);
onMounted(() => {
  data.base3d = new Base3D(sceneContainer.value);
  init();
});

function init() {
  data.base3d.loadModels("CVT.gltf");
  // console.log(das);
  // console.log(data.base3d.model);
}
</script>

<style scoped></style>
