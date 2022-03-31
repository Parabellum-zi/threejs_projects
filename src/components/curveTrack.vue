<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Base3D from "../utils/base3D";
import threeUniversal from "../utils/threeUniversal.js";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

let data = reactive({
  base3D: {},
});

let rayCaster = new THREE.Raycaster();

let sceneContainer = ref(null);

const ACTION_SELECT = 1,
  ACTION_NONE = 0;
let curveHandles = [];
let curve;
let flow;
let line;
let control;

let orbit; //orbit / trans 控制开关

const mouse = new THREE.Vector2();
let action = ACTION_NONE;

onMounted(() => {
  data.base3D = new Base3D(sceneContainer.value);
  orbit = data.base3D.orbitControls;
  orbit.update();
  orbit.addEventListener("change", render);
  threeUniversal.addFloor(data.base3D.scene);
  initGeometry();
  addText();
  animate();
});

function initGeometry() {
  const initialPoints = [
    { x: 100, y: 0, z: -100 },
    { x: 100, y: 0, z: 100 },
    { x: -100, y: 0, z: 100 },
    { x: -100, y: 0, z: -100 },
  ];

  const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
  const boxMaterial = new THREE.MeshBasicMaterial();

  for (const handlePos of initialPoints) {
    const handle = new THREE.Mesh(boxGeometry, boxMaterial);
    handle.position.copy(handlePos);
    curveHandles.push(handle);
    data.base3D.scene.add(handle);
  }

  curve = new THREE.CatmullRomCurve3(
    curveHandles.map((handle) => handle.position)
  );
  curve.curveType = "centripetal";
  curve.closed = true;

  const points = curve.getPoints(50);
  line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0xff0000 })
  );

  data.base3D.scene.add(line);
}

function addText() {
  const loader = new FontLoader();
  loader.load("/fonts/STSong_Regular.json", (font) => {
    const geometry = new TextGeometry("H", {
      font: font,
      size: 20,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    geometry.rotateX(Math.PI);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
    });
    const objectToCurve = new THREE.Mesh(geometry, material);
    flow = new Flow(objectToCurve);
    flow.updateCurve(0, curve);
    data.base3D.scene.add(flow.object3D);
  });

  control = new TransformControls(
    data.base3D.camera,
    data.base3D.renderer.domElement
  );
  control.addEventListener("change", render);
  control.addEventListener("dragging-changed", (event) => {
    if (!event.value) {
      const points = curve.getPoints(50);
      line.geometry.setFromPoints(points);
      flow.updateCurve(0, curve);
    }
    orbit.enabled = !event.value; // control 开关
  });
}

function animate() {
  requestAnimationFrame(animate);

  // 获取需要移动的点
  if (action === ACTION_SELECT) {
    rayCaster.setFromCamera(mouse, data.base3D.camera);
    action = ACTION_NONE;
    const intersects = rayCaster.intersectObjects(curveHandles, false);
    if (intersects.length) {
      const target = intersects[0].object;
      control.attach(target);
      data.base3D.scene.add(control);
    }
  }

  if (flow) {
    flow.moveAlongCurve(-0.001); // 控制沿曲线运动的方向及时间
  }
  render();
}

function render() {
  data.base3D.renderer.domElement.addEventListener(
    "pointerdown",
    onPointerDown
  );
}
function onPointerDown(event) {
  action = ACTION_SELECT;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
</script>

<style scoped></style>
