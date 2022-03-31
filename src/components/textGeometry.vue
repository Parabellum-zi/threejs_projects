<template>
  <div id="sceneContainer" ref="sceneContainer">
    <input
      class="color_pick"
      type="color"
      @change="handleInputChange"
      value="{{ state.backgroundColor }}"
    />
    <button class="pass_button" @click.stop="handleRenderChange">
      标签<span class="highlight">{{ state.renderPass ? "开" : "关" }}</span>

      {{ state.renderPass }}
    </button>
  </div>
</template>
<script setup>
import Base3D from "../utils/base3D";
import threeUniversal from "../utils/threeUniversal";
import { reactive, ref, onMounted } from "vue";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

let state = reactive({
  backgroundColor: "#3cd4cf",
  renderPass: !(window.navigator.userAgent.toLowerCase().indexOf("mobile") > 0),
  // renderPass: true,
});

let data = reactive({
  base3D: {},
});
const sceneContainer = ref(null);

let labels3d = [
  { x: -106, y: 4, z: 211, name: "一期沉沙池" },
  { x: -106, y: 4, z: 148, name: "二期沉沙池" },
];
onMounted(() => {
  initScene();
  isFullScene();
});

function handleInputChange(e) {
  state.backgroundColor = e.target.value;
}

function handleRenderChange() {
  state.renderPass = !state.renderPass;
  console.log(state);
}

/**
 * 双击是否全屏
 */
function isFullScene() {
  window.addEventListener("dblclick", () => {
    const fullscreenElement =
      document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
      if (sceneContainer.value.requestFullscreen) {
        sceneContainer.value.requestFullscreen();
      } else if (sceneContainer.value.webkitRequestFullscreen) {
        sceneContainer.value.webkitRequestFullscreen();
      }
      data.base3D.scene.background = new THREE.Color(state.backgroundColor);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      data.base3D.scene.background = "";
      // composer.render();
    }
  });
}

function initScene() {
  data.base3D = new Base3D(sceneContainer.value);
  threeUniversal.addFloor(data.base3D.scene);
  labels3d.map((item) => createText(item));

  initContent();
}
/**
 * 原生中文无法显示 使用https://gero3.github.io/facetype.js/ 将.tff 格式的文字转为 .json 格式
 */
function createText(options) {
  let { x, y, z, name } = options;
  const loader = new FontLoader();
  loader.load("/fonts/STSong_Regular.json", (font) => {
    let fontGeometry = new TextGeometry(name, {
      size: 8, //字号大小，一般为大写字母的高度
      height: 2, //文字的厚度
      weight: "normal", //值为'normal'或'bold'，表示是否加粗
      font: font, //字体，默认是'helvetiker'，需对应引用的字体文件
      style: "normal", //值为'normal'或'italics'，表示是否斜体
      bevelThickness: 1, //倒角厚度
      bevelSize: 1, //倒角宽度
      curveSegments: 30, //弧线分段数，使得文字的曲线更加光滑
      bevelEnabled: true, //布尔值，是否使用倒角，意为在边缘处斜切
    });
    fontGeometry.computeBoundingBox(); //绑定盒子模型
    // 文字的材质
    /*    let fontMaterial = new THREE.MeshNormalMaterial({
      flatShading: THREE.FlatShading,
      transparent: true,
      opacity: 0.9,
    });*/
    // let fontMaterial = new THREE.MeshBasicMaterial({ color: 0xa5e5e9 });
    let fontMaterial = new THREE.MeshBasicMaterial({ color: 0x54afe8 });
    let fonts = new THREE.Mesh(fontGeometry, fontMaterial);
    // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
    /*    fonts.position.x =
      -(fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x) / 2;*/
    fonts.position.set(x, y, z);
    data.base3D.scene.add(fonts);
  });
}

/**
 * 生成模型 目的是为修改字体样式
 * @param geom
 */
function createMesh(geom) {
  //设置当前的模型矩阵沿xy轴偏移，让图片处于显示中心
  geom.applyMatrix(new THREE.Matrix4().makeTranslation(-250, -100, 0));
  // 创建法向量纹理
  let meshMaterial = new THREE.MeshNormalMaterial({
    flatShading: THREE.FlatShading,
    transparent: true,
    opacity: 0.9,
  });
  //  创建一个线框纹理
  let wireFrameMat = new THREE.MeshBasicMaterial();
  wireFrameMat.wireframe = true;
  // 创建模型
  return THREE.SceneUtils.createMultiMaterialObject(geom, [
    meshMaterial,
    wireFrameMat,
  ]);
}

function initContent() {
  let text = "three.js";
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
    // x = 0,位置
    // fonts.position.x =
    //   -0.5 * (fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x);
    // fonts.position.z += 1;
    fonts.position.set(-20, 40, 0);
    data.base3D.scene.add(fonts);
  });
}
</script>

<style scoped>
.color_pick {
  position: fixed;
  top: 4px;
  right: 4px;
  outline: none;
  border: none;
  -webkit-appearance: none;
  height: 30px;
  width: 64px;
  padding: 0 6px;
  background: rgba(0, 0, 0, 0.4);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
.pass_button {
  position: fixed;
  top: 40px;
  right: 4px;
  height: 30px;
  width: 64px;
  outline: none;
  border: none;
  -webkit-appearance: none;
  background: rgba(0, 0, 0, 0.4);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}
.highlight {
  color: rgba(255, 255, 0, 0.6);
}
</style>
