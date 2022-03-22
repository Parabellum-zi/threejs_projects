<template>
  <div id="sceneContainer" ref="sceneContainer">
    <!--   <div class="title" ref="one">
      <div class="label" style="width: 140px; height: 157px">
        <img src="/public/images/label.png" alt="" />
        <p>{{ labelName }}</p>
      </div>
    </div>-->
    <button id="del" @click.stop="deleteGroup">删除标注</button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import Base3D from "../utils/base3D";
import threeUniversal from "../utils/threeUniversal";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";
// 模型解析
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
// const clock = new THREE.Clock();
let params; // GUI config
let data = reactive({
  base3D: {},
});
const sceneContainer = ref(null);
let pointsArr = [
  // [-80, -20, 0],
  // [-70, 20, 0],
  // [0, 0, 0],
  // [70, 30, 0],
  // [20, 40, 0],
  [3, 44, 0],
  [3, 47, 0],
];
let pointsArr1 = [
  [3, 50.5, 0],
  [3, 53, 0],
  [17, 53, 0],
  // [0, 0, 4.8],
  // [0, 119.355, 4.8],
];
let water;
let waterGeometry;
let PopUpMesh; // 标注框
let taggingText; // 标注内容
let texture; // 管贴图
let CylinderMesh; // 圆柱
let textureOuter; //管壁
let stripMesh; // 圆柱
let cylinderTexture; // 管箭头
const one = ref(null);
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
// rotation_z: Math.PI * 0.5, 横向 r->l
let tubesArr_ws = [
  {
    x: -262.3, // h2
    y: -7,
    z: 18,
    height: 20,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -263.5, // h4
    y: -7,
    z: 90,
    height: 20,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -253, // s2
    y: -7,
    z: 79.5,
    height: 122,
    rotation_z: Math.PI,
  },
  {
    x: -197.5, // h6
    y: -7,
    z: 140,
    height: 110,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -143.3, // s3
    y: -7,
    z: 174.5,
    height: 68,
    rotation_z: Math.PI,
  },
  {
    x: -54, // s4
    y: -7,
    z: 255,
    height: 19,
    rotation_z: Math.PI,
  },
  {
    x: -61.2, // s5
    y: -9,
    z: 219,
    height: 11,
    rotation_z: Math.PI,
  },
  {
    x: -136.2, // h7_l
    y: -7,
    z: 207.8,
    height: 13,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -73, // h7_r
    y: -9,
    z: 213,
    height: 25,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -54, // s8
    y: -7,
    z: 290,
    height: 19,
    rotation_z: Math.PI,
  },
  {
    x: -18.3, //cc2_4_s4
    y: -7,
    z: -65,
    height: 30,
    rotation_z: Math.PI,
  },
  {
    x: 97, //cc2_4_s5
    y: -7,
    z: -65,
    height: 30,
    rotation_z: Math.PI,
  },
  {
    x: 225, //cc2_4_s6
    y: -7,
    z: -65,
    height: 30,
    rotation_z: Math.PI,
  },
];
let tubesArr_cs = [
  {
    x: -411.5, //cd_1_h1
    y: -7,
    z: 5,
    height: 30,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -427, //cd_1_s1
    y: -7,
    z: 78.5,
    height: 148,
    rotation_z: 0,
  },
  {
    x: -411.5, //cd_1_h3
    y: -7,
    z: 93,
    height: 30,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -295, //cd_1_h5
    y: -7,
    z: 153,
    height: 265,
    rotation_z: Math.PI * 0.5,
    rotation_y: Math.PI,
  },
  {
    x: -162, // xdc_12_s6
    y: -7,
    z: 161.3,
    height: 18,
  },
  {
    x: -185, // xdc_12_s1
    y: -7,
    z: 265,
    height: 13,
  },
  {
    x: -168, // xdc_12_s2
    y: -7,
    // z: 260,
    z: 265,
    height: 13,
  },
  {
    x: -184.3, // xdc_12_s3
    y: -7,
    z: 196.3,
    height: 30,
  },
  {
    x: -477, //xdc_3_s1
    y: -7,
    z: 183,
    height: 34,
  },
  {
    x: -485, //shc_3_s1
    y: -7,
    z: -81,
    height: 64,
  },

  {
    x: -485, //cc2_3_s2
    y: -7,
    z: 58,
    height: 13,
  },
  {
    x: -366, //fyc_2_s1
    y: -7,
    z: -111,
    height: 125,
  },
  {
    x: -357.5, //fyc_2_h1
    y: -7,
    z: -97,
    height: 16,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -357.5, //fyc_2_h2
    y: -7,
    z: -173,
    height: 16,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -357.5, //fyc_2_h2
    y: -7,
    z: -173,
    height: 16,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -402, //fyc_2_h3
    y: -7,
    z: -48,
    height: 73.6,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -439.5, //fyc_2_s2
    y: -7,
    z: 66.5,
    height: 230,
  },
  {
    x: -312.5, //fyc_2_h4
    y: -7,
    z: 182,
    height: 255,
    rotation_z: Math.PI * 0.5,
    rotation_y: Math.PI,
  },
  {
    x: -477, //xdc_3_s2
    y: -7,
    z: 225,
    height: 18,
  },
  {
    x: -350, //xdc_3_h1
    y: -7,
    z: 234.5,
    height: 255,
    rotation_z: Math.PI * 0.5,
    rotation_y: Math.PI,
  },
  {
    x: -159, //xdc_3_h2
    y: -7,
    z: 272,
    height: 125,
    rotation_z: Math.PI * 0.5,
    rotation_y: Math.PI,
  },
  {
    x: -222, //xdc_3_s3
    y: -7,
    z: 253.2,
    height: 38.8,
  },
  {
    x: -76, //cs_4_s1
    y: -7,
    z: -13.5,
    height: 330,
  },
  {
    x: -59, // cs_4_h1
    y: -7,
    z: -179,
    height: 35,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -47, // cs_4_h2
    y: -7,
    z: 151,
    height: 57,
    rotation_z: Math.PI * 0.5,
    rotation_y: Math.PI,
  },
  {
    x: -19.2, //cs_4_s2
    y: -7,
    z: 203,
    height: 105,
  },
  {
    x: -47, // cs_4_h3
    y: -7,
    z: 256,
    height: 57,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -95.5, //cs_4_s4
    y: -7,
    z: 283,
    height: 55,
  },
  {
    x: -57.5, // cs_4_h3
    y: -7,
    z: 256,
    height: 77,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: 0, // zplc_h1
    y: -7,
    z: -179,
    height: 40,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: 57, //zplc_s1
    y: -7,
    z: -152,
    height: 20,
    rotation_z: Math.PI,
  },
  {
    x: 0, //zplc_s2
    y: -7,
    z: -209,
    height: 60,
  },
  {
    x: -18.3, //cc2_4_s1
    y: -7,
    z: -132,
    height: 20,
    rotation_z: Math.PI,
  },
  {
    x: 97, //cc2_4_s2
    y: -7,
    z: -132,
    height: 20,
    rotation_z: Math.PI,
  },
  {
    x: 224.7, //cc2_4_s3
    y: -7,
    z: -132,
    height: 20,
    rotation_z: Math.PI,
  },
  {
    x: 236, // gxcdc_s4
    y: -7,
    z: -230.7,
    height: 20,
    rotation_z: Math.PI,
  },
  {
    x: 118, // zplc_h2
    y: -7,
    z: -240,
    height: 237,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: 39.5, // cc2_4_h1
    y: -7,
    z: -142,
    height: 116,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: 150.8, // gxcdc_h1
    y: -7,
    z: -211,
    height: 90,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: 151, // gxcdc_h2
    y: -7,
    z: -180.3,
    height: 50,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: 199.5, // cc2_4_h2
    y: -7,
    z: -141.3,
    height: 49,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: 115.8, // gxcdc_h3
    y: -7,
    z: -165.5,
    height: 20,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: 106.5, // gxcdc_s1
    y: -7,
    z: -188,
    height: 45,
  },
  {
    x: 126.5, // gxcdc_s2
    y: -7,
    z: -173,
    height: 16,
  },
  {
    x: 175.4, // gxcdc_s3
    y: -7,
    z: -161,
    height: 39,
  },
];
let waterSurface_A = {}; // 动态水面
let allTubes = {};
let waterArr = [
  {
    width: 70, // 污泥大转盘
    height: 75,
    color: 0xe4943a,
    position: {
      x: 23,
      y: -6,
      z: 205,
    },
  },
  {
    width: 48, // 一二期消毒池  down
    height: 53,
    color: 0xacece5,
    position: {
      x: -180,
      y: -5,
      z: 232.5,
    },
  },
  {
    width: 16, //// 一二期消毒池  up
    height: 43,
    color: 0xacece5,
    position: {
      x: -164,
      y: -5,
      z: 187,
    },
  },
  {
    width: 70, // 一期反应池
    height: 169.5,
    color: 0x001e0f,
    position: {
      x: -307,
      y: -2.6,
      z: 54.5,
    },
  },
  {
    width: 70,
    height: 169.5, // 一期沉淀池
    color: 0xb8e2a6,
    position: {
      x: -379,
      y: -2.6,
      z: 54.5,
    },
  },
];
let loadedGltf = [];

let labelGroup = new THREE.Group();
labelGroup.name = "labels";
let spriteGroup = new THREE.Group();
spriteGroup.name = "labels_2d";
onMounted(() => {
  initScene();
  animate();
  initGui();
});
onBeforeUnmount(() => {
  try {
    data.base3D.scene.clear();
    data.base3D.renderer.dispose();
    data.base3D.renderer.forceContextLoss();
    data.base3D.renderer.content = null;
    // cancelAnimationFrame(animationID); // 去除animationFrame
    let gl = data.base3D.renderer.domElement.getContext("webgl");
    gl && gl.getExtension("WEBGL_lose_context").loseContext();
    // console.log(data.base3D.renderer.info); //查看memery字段即可
  } catch (e) {
    console.error(e);
  }
});

function initScene() {
  data.base3D = new Base3D(sceneContainer.value);
  threeUniversal.addFloor(data.base3D.scene);
  document.addEventListener("mousedown", onDocumentMouseDown);
  loadLiedeModel("liede.gltf"); // 污水厂模型

  // allPipeline();
}
function onDocumentMouseDown(event) {
  let intersects = threeUniversal.getDocumentMouseDownCoord(event, data.base3D);
  // 获取选中最近的 Mesh 对象
  if (intersects.length !== 0 && intersects[0].object instanceof THREE.Mesh) {
    let selectObject = intersects[0].object;
    // console.log(intersects, selectObject);
    // console.log(selectObject.geometry.boundingBox.max);
    // console.log(selectObject.geometry.boundingBox.min);
    // showObject(selectObject, event);
    console.log(selectObject);
  }
}

function loadLabels() {
  // labels3d.map((item) => initLabels(item)); //  3d label
  labels3d.map((item) => spriteImg(item)); // 2d label
}

function loadWaterSurface() {
  waterArr.map((item, i) => (waterSurface_A["w" + i] = initWater(item)));
}

function loadTubes() {
  tubesArr_ws.map(
    (item, i) =>
      (allTubes["ws" + i] = drawCylinder({ item, type: "ws", id: "ws" + i }))
  );
  /*  tubesArr_cs.map(
    (item, i) =>
      (allTubes["ys" + i] = drawCylinder({ item, type: "cs", id: "cs" + i }))
  );*/
}

function loadLiedeModel(model) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "static/model/" + model,
      (gltf) => {
        gltf.scene.scale.x = 50;
        gltf.scene.scale.y = 50;
        gltf.scene.scale.z = 50;
        data.base3D.scene.add(gltf.scene);
        loadedGltf.push(gltf.scene.getObjectByName("rotation001"));
        loadedGltf.push(gltf.scene.getObjectByName("rotation002"));
        loadedGltf.push(gltf.scene.getObjectByName("rotation003"));
        loadedGltf.push(gltf.scene.getObjectByName("rotation004"));
        resolve(gltf);
      }
      // (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
      // () => console.error("An error happened")
    );
  }).then(() => {
    loadLabels(); // 标注
    loadTubes(); // 管线
    loadWaterSurface(); // 水面
  });
}
/**
 * 展示点击内容
 */
function showObject(obj, event) {
  console.log(obj);
  // let key = obj.name;
  // let objs = this.cabinetData.filter((item) => {
  //   return item.code === key;
  // });
  // // 显示内容，高亮
  // if (objs.length > 0) {
  //   let oldOneMaterial = this.oldChildren.filter(
  //     (item) => item.name === key
  //   )[0];
  //   obj.material = new THREE.MeshPhongMaterial({
  //     color: 0xff0000,
  //     map: oldOneMaterial.material.map,
  //   });
  //
  //   this.texts = objs[0];
  //   // 屏幕坐标
  //   this.dragTop = event.clientY - 50;
  //   this.dragLeft = event.clientX - 100;
  // }
}

/*function allPipeline() {
  tubeTexture1 = pipeConf(
    {
      points: pointsArr,
      color: 0x4488ff,
    },
    {
      points: pointsArr,
      texture: "images/allow2.png",
    }
  );
  tubeTexture2 = pipeConf(
    {
      points: pointsArr1,
      color: 0x4411ee,
    },
    {
      points: pointsArr1,
      texture: "images/allow2.png",
    }
  );
}
function pipeConf(outerConf, innerConf) {
  outerConf.radius = 1;
  outerConf.opacity = 0.35;
  innerConf.radius = 0.9;
  const { texture: tubeTexture0, mesh: pipe0 } = creatPipe(outerConf);
  const { texture: tubeTexture1, mesh: pipe1 } = creatPipe(innerConf);
  data.base3D.scene.add(pipe0);
  data.base3D.scene.add(pipe1);
  outerPipeMesh = pipe0;
  innerPipeMesh = pipe1;
  return tubeTexture1;
}
function creatPipe(conf) {
  const path = createPath(conf.points);
  const geometry = new THREE.TubeGeometry(path, 100, conf.radius, 8, false);
  const textureLoader = new THREE.TextureLoader();
  let material;
  if (conf.texture !== undefined) {
    texture = textureLoader.load(conf.texture); // 图片贴图
    // texture = new THREE.CanvasTexture(getTextCanvas("➯ ➮ ➯")); // 文本贴图
    // 设置阵列模式为 RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    // 等价texture.repeat= new THREE.Vector2(3,1)
    texture.repeat.set(5, 1);
    // texture.rotation = Math.PI;
    // 图片贴图
    // 模拟管线运动动画，将两个素材图按比例合并，然后生成贴图texture
    material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
      depthTest: false, // 深度检测
    });
  } else {
    material = new THREE.MeshPhongMaterial({
      // map: texture,
      color: conf.color,
      transparent: true,
      opacity: conf.opacity,
      depthWrite: false, // 为true内部流动的液体会被遮挡无法显示
    });
  }
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.rotation.z = Math.PI * 0.5; // 箭头方向
  mesh.rotation.x = Math.PI * 0.5; //修改箭头在管壁的位置

  return { texture, mesh };
}
function createPath(pointsArr) {
  pointsArr = pointsArr.map((point) => new THREE.Vector3(...point));
  // 利用CatmullRomCurve3 创建路径，不过是平滑的三维样条曲线
  return new THREE.CatmullRomCurve3(pointsArr);
}*/

function animate(time) {
  time *= 0.003;
  // 水流
  Object.keys(allTubes).forEach((item) => {
    allTubes[item].textureOuter.offset.x = -(time * 0.2) % 1;
    allTubes[item].cylinderTexture.offset.x = -(time * 1) % 1;
  });
  // 水面
  Object.keys(waterSurface_A).forEach(
    (item) =>
      (waterSurface_A[item].material.uniforms["time"].value += 1.0 / 660.0)
  );
  modelChange(time);
  requestAnimationFrame(animate);
  // render();
}

/**
 * @Description: 污泥转盘动画
 * @author parabellum
 * @date 2022/3/16
 */
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
 * 部件绕y轴方向旋转
 */
function rotationY(parts, time) {
  parts.rotation.y = time;
}

// 标注文字部分
function initLabels(labels_D) {
  let { x, y, z, name } = labels_D;
  let c_width = 200,
    c_hight = 140;
  //用canvas生成图片
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = c_width;
  canvas.height = c_hight;
  //制作矩形
  ctx.fillStyle = "rgba(98,75,14,1)";
  // ctx.fillRect(0, 0, 300, 300);
  ctx.fillRect(0, 0, c_width, c_hight * 0.22);
  //设置文字
  ctx.fillStyle = "#FFDD77";
  // ctx.font = 'normal 8pt "楷体"';
  ctx.font = 26 + 'px "sans-serif';
  ctx.textAlign = "center"; // 设置水平对齐方式
  ctx.textBaseline = "middle"; // 设置垂直对齐方式
  ctx.fillText(name, c_width / 2, (c_hight * 0.23) / 2); // canvas  水平垂直居中

  /*let labels = "测试标注";
  //文字换行
  let len = parseInt(labels.length / 10);
  for (let i = 0; i < len + 1; i++) {
    let space = 10;
    if (i === len) space = labels.length - len * 10;
    // console.log("len+" + len, "space+" + space);
    let word = labels.substr(i * 10, space);
    ctx.fillText(word, 20, 30 * (i + 1));
  }*/
  //生成图片
  let url = canvas.toDataURL("image/png");

  //将图片构建到纹理中
  let geometry1 = new THREE.PlaneGeometry(c_width * 0.1, c_hight * 0.1);
  let texture = THREE.ImageUtils.loadTexture(url, null, () => {});

  let material1 = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    opacity: 1,
    transparent: true,
  });

  taggingText = new THREE.Mesh(geometry1, material1);
  taggingText.position.set(x, y, z);
  labelGroup.add(taggingText);
  // data.base3D.scene.add(taggingText);
  addPopUpMesh(c_width, c_hight, x, y, z);
}
/**
 * 标注（3维）
 */
function addPopUpMesh(c_width, c_hight, x, y, z) {
  let texture, material;
  const textureLoader = new THREE.TextureLoader();
  let geometry = new THREE.PlaneGeometry(c_width * 0.1, c_hight * 0.1);
  texture = textureLoader.load("images/label.png"); // 图片贴图
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  material = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
    // depthTest: false, // 深度检测
    // side: THREE.DoubleSide,
  });
  PopUpMesh = new THREE.Mesh(geometry, material);
  PopUpMesh.position.set(x, y, z);
  labelGroup.add(PopUpMesh);
  data.base3D.scene.add(labelGroup);

  /*let allChildren = data.base3D.scene.children;
  for (let i = allChildren.length - 1; i >= 0; i--) {
    if (allChildren[i] instanceof THREE.Group) {
      console.log(allChildren[i]);

      setTimeout(() => {
        console.log("delete group");
        data.base3D.scene.remove(allChildren[i]);
      }, 1000 * 5);
      // scene.remove(allChildren[i]);
    }
  }*/
}

/**
 * 标注 （2维）
 */
function spriteImg(labels_D) {
  let { x, y, z } = labels_D;
  let texture = new THREE.ImageUtils.loadTexture("images/label.png");
  texture.minFilter = THREE.NearestFilter; // 解决图片的失真问题，最近渲染

  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  let material = new THREE.SpriteMaterial({
    map: texture,
    useScreenCoordinates: false,
    // alignment: THREE.SpriteAlignment.center,
    transparent: true, //透明度
    // side: THREE.DoubleSide, // 双面渲染
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

/**
 * 根据组名称获取组
 */
function getGroups() {
  data.base3D.scene.traverse((obj) => {
    if (obj.type === "Group" && obj.name === "labels") {
      console.log(obj);
    }
  });
}

function deleteGroup() {
  data.base3D.scene.traverse((obj) => {
    if (obj.type === "Group" && obj.name === "labels_2d")
      data.base3D.scene.remove(obj);
  });
  // console.log(data.base3D.scene);
}

// function PlaneGeometry(mesh) {
//   function generateGeometry() {
//     updateGroupGeometry(mesh, new PlaneGeometry(data1.width, data1.height));
//   }
//
//   const folder = gui.addFolder("THREE.PlaneGeometry");
//   folder.add(data1, "width", 1, 30).onChange(generateGeometry);
//   folder.add(data1, "height", 1, 30).onChange(generateGeometry);
//
//   generateGeometry();
// }
//
// function updateGroupGeometry(mesh, geometry) {
//   mesh.children[0].geometry.dispose();
//   mesh.children[1].geometry.dispose();
//
//   mesh.children[1].geometry = geometry;
// }

function initWater(conf) {
  let { width, height, color, position } = conf;
  waterGeometry = new THREE.PlaneGeometry(width, height);

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
    waterColor: color,
    distortionScale: 3.7,
    // fog: data.base3d.scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI / 2;
  water.position.x = position.x;
  water.position.y = position.y;
  water.position.z = position.z;
  data.base3D.scene.add(water);
  return water;
}

function initGui() {
  let datGui = new dat.GUI();
  params = {
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,

    rotationX: 1.6, // 竖向
    rotationZ: 0, // 竖向
    // rotationX: 0, // 横向
    // rotationZ: 1.56, // 横向
    rotationY: 0,

    positionX: 175,
    positionY: -6.3,
    positionZ: -160,

    color: "#ffffff",
    addFunction: () => console.log("// 方法预留"),
  };
  datGui.add(params, "addFunction");
  // (对象，属性，最小值，最大值,步长）.name("别名").onchange(function)
  let meshScale = datGui.addFolder("缩放");
  meshScale
    .add(params, "scaleX", 0, 10, 0.01)
    .name("沿x轴缩放")
    .onChange(updateMesh);
  meshScale
    .add(params, "scaleY", 0, 20, 0.001)
    .name("沿y轴缩放")
    .onChange(updateMesh);
  meshScale
    .add(params, "scaleZ", 0, 10, 0.01)
    .name("沿z轴缩放")
    .onChange(updateMesh);

  let meshPosition = datGui.addFolder("位置"); // 位置
  meshPosition
    .add(params, "positionX", -600, 400, 0.05)
    .name("沿x轴移动")
    .onChange(updateMesh);
  meshPosition
    .add(params, "positionY", -10, 10, 0.1)
    .name("沿y轴移动")
    .onChange(updateMesh);
  meshPosition
    .add(params, "positionZ", -400, 400, 0.05)
    .name("沿z轴移动")
    .onChange(updateMesh);
  meshPosition.open(); // 树状结构默认打开
  let meshRotation = datGui.addFolder("旋转"); //旋转
  meshRotation
    .add(params, "rotationX", 0, Math.PI * 2, 0.001)
    .name("沿x轴旋转")
    .onChange(updateMesh);
  meshRotation
    .add(params, "rotationY", 0, Math.PI * 2, 0.001)
    .name("沿y轴旋转")
    .onChange(updateMesh);
  meshRotation
    .add(params, "rotationZ", 0, Math.PI * 2, 0.001)
    .name("沿z轴旋转")
    .onChange(updateMesh);

  // 水面颜色
  /*  datGui.addColor(params, "color").onChange((value) => {
    water.material.uniforms["color"].value.set(value);
  });*/
}
function updateMesh() {
  // let meshChange = stripMesh; // 将meshChange赋值为需要变换的Mesh对象
  let meshChange = CylinderMesh; // 管线
  // let meshChange = taggingText; // 标注
  // let meshChange = water; // 水面
  //缩放矩阵
  let scaleM = new THREE.Matrix4();
  scaleM.makeScale(params.scaleX, params.scaleY, params.scaleZ);

  //生成旋转矩阵
  let rotaMX = new THREE.Matrix4();
  rotaMX.makeRotationX(params.rotationX);
  let rotaMY = new THREE.Matrix4();
  rotaMY.makeRotationY(params.rotationY);
  let rotaMZ = new THREE.Matrix4();
  rotaMZ.makeRotationZ(params.rotationZ);
  rotaMZ.multiply(rotaMY);
  rotaMZ.multiply(rotaMX);

  //生成位移矩阵
  let translationM = new THREE.Matrix4();
  translationM.makeTranslation(
    params.positionX,
    params.positionY,
    params.positionZ
  );

  //生成需要使用的矩阵
  let matrix = new THREE.Matrix4();
  //将矩阵赋值给模型
  meshChange.matrix = matrix;
  matrix.multiply(translationM);
  matrix.multiply(rotaMZ);
  matrix.multiply(scaleM);
  //使用矩阵更新模型的信息
  meshChange.matrix.decompose(
    meshChange.position,
    meshChange.quaternion,
    meshChange.scale
  );
}

function drawCylinder({ item, type }) {
  let radius = 0.7;
  let outerImg, image, rotation_y, rotation_z;
  let { x, y, z, height } = item;
  item.rotation_z !== undefined
    ? (rotation_z = item.rotation_z)
    : (rotation_z = 0);
  item.rotation_y !== undefined
    ? (rotation_y = item.rotation_y)
    : (rotation_y = 0);
  type === "ws" ? (outerImg = "outerGreen.png") : (outerImg = "outerBlue.png");
  type === "cs" ? (image = "allow2.png") : (image = "allow_rain.png");

  // 创建管道
  const radiusTop = radius;
  const radiusBottom = radius;
  const radiusSegments = 30; // 管壁平滑度， 越大越平滑
  const heightSegments = 200;
  const openEnded = false;
  const geometry = new THREE.CylinderBufferGeometry(
    radiusTop,
    radiusBottom,
    height,
    radiusSegments,
    heightSegments,
    openEnded
  );
  textureOuter = new THREE.TextureLoader().load("images/" + outerImg);
  textureOuter.wrapS = THREE.RepeatWrapping;
  textureOuter.wrapT = THREE.RepeatWrapping;
  textureOuter.repeat.x = height / 4;
  textureOuter.repeat.y = 1;
  // texture.repeat.z = -40;
  textureOuter.rotation = Math.PI * 0.5;

  const material = new THREE.MeshBasicMaterial({
    map: textureOuter,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
    // opacity: 0.4,
    /*   color,
    transparent: true,
    opacity: 0.65,
    depthWrite: false, // 为true内部流动的液体会被遮挡无法显示
    // color: "#318414",
    // emissive: "#318414",
    // specular: "#22842c",
    shininess: 10,
    shading: THREE.FlatShading,*/
  });
  CylinderMesh = new THREE.Mesh(geometry, material);
  CylinderMesh.rotation.x = Math.PI * 0.5;
  CylinderMesh.rotation.y = rotation_y;
  CylinderMesh.rotation.z = rotation_z;
  CylinderMesh.position.set(x, y, z);
  data.base3D.scene.add(CylinderMesh);

  // CylinderMesh.rotation.z = Math.PI * 0.5; // 箭头方向
  // CylinderMesh.rotation.x = Math.PI * 0.6; //修改箭头在管壁的位置

  // 管中心平面
  cylinderTexture = new THREE.TextureLoader().load("images/" + image);
  cylinderTexture.wrapS = THREE.RepeatWrapping;
  cylinderTexture.wrapT = THREE.RepeatWrapping;
  cylinderTexture.repeat.x = height / 5; // x方向的箭头密度
  cylinderTexture.repeat.y = 1; // y方向的箭头密度
  // texture.repeat.z = -40;
  cylinderTexture.rotation = Math.PI * 0.5;
  const stripGeo = new THREE.PlaneBufferGeometry(radiusTop * 1.7, height);
  const stripMat = new THREE.MeshBasicMaterial({
    map: cylinderTexture,
    // opacity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });
  stripMesh = new THREE.Mesh(stripGeo, stripMat);
  stripMesh.position.set(x, y, z);
  stripMesh.rotation.x = Math.PI * 0.5;
  stripMesh.rotation.y = rotation_y;
  stripMesh.rotation.z = rotation_z;
  data.base3D.scene.add(stripMesh);

  requestAnimationFrame(animate);

  return { cylinderTexture, textureOuter };
  // return cylinderTexture;
}
let selectedObject = null;
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function onPointerMove(event) {
  if (selectedObject) {
    selectedObject.material.color.set("#69f");
    selectedObject = null;
  }

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObject(group, true);

  if (intersects.length > 0) {
    const res = intersects.filter(function (res) {
      return res && res.object;
    })[0];

    if (res && res.object) {
      selectedObject = res.object;
      selectedObject.material.color.set("#f00");
    }
  }
}
</script>

<style scoped>
.title {
  position: absolute;
  padding: 2px 10px;
  /*background: rgba(255, 255, 255, 0.5);*/
  line-height: 1;
  border-radius: 5px;
}
.label img {
  /*background: url("public/images/label.png") no-repeat 100%;*/
  width: 100%;
  height: 100%;
}

.label p {
  font-size: 20px;
  color: #ffdd77;
  padding: 10px 29px;
  position: absolute;
  top: 0;
  margin: 0;
}
#sceneContainer {
  width: 100%;
  height: 100%;
}

#del {
  position: absolute;
  top: 50px;
}
</style>
