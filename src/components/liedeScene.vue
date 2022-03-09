<template>
  <div id="sceneContainer" ref="sceneContainer">
    <!--   <div class="title" ref="one">
      <div class="label" style="width: 140px; height: 157px">
        <img src="/public/images/label.png" alt="" />
        <p>{{ labelName }}</p>
      </div>
    </div>-->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import Base3D from "../utils/base3D";
import threeUniversal from "../utils/threeUniversal";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";
import * as dat from "dat.gui";
// const clock = new THREE.Clock();
let params; // GUI config
let data = reactive({
  base3D: {},
});
let labelName = "测试标注";
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
let tubeTexture1;
let tubeTexture2;
let water;
let waterGeometry;
let PopUpMesh; // 标注框
let taggingText; // 标注内容
let texture; // 管贴图
let outerPipeMesh; // 管道
let innerPipeMesh; // 管道
let CylinderMesh; // 圆柱
let stripMesh; // 圆柱
let cylinderTexture;
const one = ref(null);
let labels3d = [
  { x: -106, y: 4, z: 211, name: "一期沉沙池" },
  { x: -106, y: 4, z: 148, name: "二期沉沙池" },
  { x: -106, y: 4, z: 178, name: "三期沉沙池" },
  { x: -292, y: 4, z: 94, name: "一期反应池" },
  { x: -367, y: 4, z: 94, name: "一期沉淀池" },
  { x: -197, y: 4, z: 237, name: "一二期消毒池" },
  { x: -430, y: 4, z: -140, name: "三期生化池" },
  { x: -246, y: 4, z: -140, name: "二期反应池" },
];
let tubesArr_ws = [
  /*{
    x: -262.5, // h2
    y: -7,
    z: 18,
    height: 20,
    rotation_z: Math.PI * 0.5,
  },*/
  /* {
    x: -263.5, // h4
    y: -7,
    z: 90,
    height: 20,
    rotation_z: Math.PI * 0.5,
  },*/
  {
    x: -253, // s2
    y: -7,
    z: 78,
    height: 120,
    rotation_z: Math.PI,
  },
  {
    x: -195, // h6
    y: -7,
    z: 140,
    height: 105,
    rotation_z: Math.PI * 0.5,
  },
  /*
{
  x: -144, // s3
  y: -7,
  z: 174,
  height: 63,
  rotation_z: Math.PI,
},
{
  x: -62, // s4
  y: -7,
  z: 257,
  height: 17,
  rotation_z: Math.PI,
},
{
  x: -62, // s5
  y: -7,
  z: 220,
  height: 8,
  rotation_z: Math.PI,
},
{
  x: -134, // h7_l
  y: -7,
  z: 208,
  height: 13,
  rotation_z: Math.PI * 0.5,
},
{
  x: -72, // h7_r
  y: -7,
  z: 213,
  height: 20,
  rotation_z: Math.PI * 0.5,
},*/
];
let tubesArr_cs = [
  {
    x: -411.5, // h1
    y: -7,
    z: 5,
    height: 30,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -427, // s1
    y: -7,
    z: 78.5,
    height: 148,
    rotation_z: 0,
  },
  {
    x: -411.5, // h3
    y: -7,
    z: 93,
    height: 30,
    rotation_z: Math.PI * 0.5,
  },
  {
    x: -295, // h5
    y: -7,
    z: 153,
    height: 265,
    rotation_z: Math.PI * 0.5,
    rotation_y: Math.PI,
  },
  {
    x: -162, // s6
    y: -7,
    z: 161.3,
    height: 18,
  },
  {
    x: -170, //s7
    y: -7,
    // z: 260,
    z: 265,
    height: 13,
  },
];
let waterSurface_A = {}; // 动态水面
let allTubes = {};
let waterArr = [
  {
    width: 70,
    height: 75,
    color: 0x001e0f,
    position: {
      x: 23,
      y: -5,
      z: 205,
    },
  },
  {
    width: 48,
    height: 53,
    color: 0x001e0f,
    position: {
      x: -180,
      y: -5,
      z: 232.5,
    },
  },
  {
    width: 16,
    height: 43,
    color: 0x001e0f,
    position: {
      x: -164,
      y: -5,
      z: 187,
    },
  },
];
onMounted(() => {
  initScene();
  animate();
  // initGui();
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
  loadLiedeModel(); // 污水厂模型
  // loadLabels(); // 标注
  loadTubes();
  // loadWaterSurface();

  // allPipeline();
  // drawCylinder({
  //   item: {
  //     x: -170,
  //     y: -7,
  //     z: 260,
  //     height: 13,
  //     // rotation_y: Math.PI,
  //     rotation_z: Math.PI * 0.5,
  //   },
  //   type: "ws",
  // });
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
  }
}

function loadLabels() {
  labels3d.map((item) => initLabels(item));
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

async function loadLiedeModel() {
  await data.base3D.loadModels("liede2.gltf");
}

function allPipeline() {
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
}

function animate(time) {
  time *= 0.003;
  // 水流
  Object.keys(allTubes).forEach(
    (item) => (allTubes[item].offset.x = -(time * 1) % 1)
  );
  // 水面
  Object.keys(waterSurface_A).forEach(
    (item) =>
      (waterSurface_A[item].material.uniforms["time"].value += 1.0 / 60.0)
  );
  // tubeTexture1.offset.x = -(time * 1) % 1;
  // tubeTexture2.offset.x = -(time * 1) % 1;
  // cylinderTexture.offset.x = -(time * 1) % 1;
  requestAnimationFrame(animate);
  // render();
}

function render() {
  //获取到窗口的一半高度和一半宽度
  let halfWidth = window.innerWidth / 2;
  let halfHeight = window.innerHeight / 2;
  let vector1 = CylinderMesh.position.clone().project(data.base3D.camera);
  one.value.style.left = vector1.x * halfWidth + halfWidth + "px";
  one.value.style.top = -vector1.y * halfHeight + halfHeight + "px";
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
  data.base3D.scene.add(taggingText);
  addPopUpMesh(c_width, c_hight, x, y, z);
}
/**
 * 标注（3维）
 */
function addPopUpMesh(c_width, c_hight, x, y, z) {
  let texture;
  const textureLoader = new THREE.TextureLoader();
  let material;
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
  data.base3D.scene.add(PopUpMesh);
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

  // todo
  /*requestAnimationFrame(animate);
  water.material.uniforms["time"].value += 1.0 / 60.0;*/

  data.base3D.scene.add(water);
  // if (!water) return (water = water0);
  // water1 = water0;
  return water;
}

function initGui() {
  let datGui = new dat.GUI();
  params = {
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,

    // rotationX: 1.6, // 竖向
    rotationX: 0, // 横向
    rotationY: 0,
    rotationZ: 0,

    positionX: -162,
    positionY: -7,
    positionZ: 153,

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
    .add(params, "scaleY", 0, 10, 0.01)
    .name("沿y轴缩放")
    .onChange(updateMesh);
  meshScale
    .add(params, "scaleZ", 0, 10, 0.01)
    .name("沿z轴缩放")
    .onChange(updateMesh);

  let meshPosition = datGui.addFolder("位置"); // 位置
  meshPosition
    .add(params, "positionX", -400, 400, 0.05)
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

  let meshRotation = datGui.addFolder("旋转"); //旋转
  meshRotation
    .add(params, "rotationX", 0, Math.PI * 2, 0.1)
    .name("沿x轴旋转")
    .onChange(updateMesh);
  meshRotation
    .add(params, "rotationY", 0, Math.PI * 2, 0.1)
    .name("沿y轴旋转")
    .onChange(updateMesh);
  meshRotation
    .add(params, "rotationZ", 0, Math.PI * 2, 0.1)
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
  let color, image, rotation_y, rotation_z;
  let { x, y, z, height } = item;
  item.rotation_z !== undefined
    ? (rotation_z = item.rotation_z)
    : (rotation_z = 0);
  item.rotation_y !== undefined
    ? (rotation_y = item.rotation_y)
    : (rotation_y = 0);
  type === "ws" ? (color = 0x4488ff) : (color = 0x448800);
  type === "cs" ? (image = "allow_rain.png") : (image = "allow2.png");
  cylinderTexture = new THREE.TextureLoader().load("images/" + image);
  cylinderTexture.wrapS = THREE.RepeatWrapping;
  cylinderTexture.wrapT = THREE.RepeatWrapping;
  cylinderTexture.repeat.x = height / 5; // x方向的箭头密度
  cylinderTexture.repeat.y = 1; // y方向的箭头密度
  // texture.repeat.z = -40;
  cylinderTexture.rotation = Math.PI * 0.5;

  // 创建管道
  const radiusTop = radius;
  const radiusBottom = radius;
  const radiusSegments = 30; // 管壁平滑度， 越大越平滑
  const heightSegments = 200;
  const openEnded = true;
  const geometry = new THREE.CylinderBufferGeometry(
    radiusTop,
    radiusBottom,
    height,
    radiusSegments,
    heightSegments,
    openEnded
  );
  const material = new THREE.MeshBasicMaterial({
    // map: texture,
    // side: THREE.DoubleSide,
    // depthWrite: false,
    // depthTest: false,
    // transparent: true,
    // opacity: 0.4,
    color,
    transparent: true,
    opacity: 0.65,
    depthWrite: false, // 为true内部流动的液体会被遮挡无法显示
    // color: "#318414",
    // emissive: "#318414",
    // specular: "#22842c",
    shininess: 10,
    shading: THREE.FlatShading,
  });
  CylinderMesh = new THREE.Mesh(geometry, material);

  CylinderMesh.rotation.x = Math.PI * 0.5;
  // CylinderMesh.rotation.x = Math.PI;
  CylinderMesh.position.set(x, y, z);
  CylinderMesh.rotation.z = rotation_z;
  data.base3D.scene.add(CylinderMesh);

  // CylinderMesh.rotation.z = Math.PI * 0.5; // 箭头方向
  // CylinderMesh.rotation.x = Math.PI * 0.6; //修改箭头在管壁的位置

  // 管中心平面
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
  stripMesh.rotation.z = rotation_z;
  data.base3D.scene.add(stripMesh);
  // stripMesh.rotation.z = Math.PI * 0.5;
  // stripMesh.rotation.y = Math.PI * 0.5;
  // stripMesh.rotation.x = Math.PI * 0.5;
  stripMesh.rotation.x = Math.PI * 0.5;
  stripMesh.rotation.y = rotation_y;
  // stripMesh.rotation.x = Math.PI;
  requestAnimationFrame(animate);

  return cylinderTexture;
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
</style>
