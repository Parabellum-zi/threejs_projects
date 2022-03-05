<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import Base3D from "../utils/base3D";
import threeUniversal from "../utils/threeUniversal";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";
import * as dat from "dat.gui";
// const clock = new THREE.Clock();
let gui;
let data = reactive({
  base3D: {},
});
let sceneContainer = ref(null);
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
onMounted(() => {
  initGui();
  initScene();
  animate();
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
    console.log(data.base3D.renderer.info); //查看memery字段即可
  } catch (e) {
    console.error(e);
  }
});

function initScene() {
  data.base3D = new Base3D(sceneContainer.value);
  threeUniversal.addFloor(data.base3D.scene);
  document.addEventListener("mousedown", onDocumentMouseDown);
  loadLiedeModel();
  // allPipeline();
  initObject(200, 140, "尘沙池一期");
  // initWater({
  //   width: 70,
  //   height: 75,
  //   color: 0x001e0f,
  //   position: {
  //     x: 23,
  //     y: -5,
  //     z: 205,
  //   },
  // });
  // initWater({
  //   width: 48,
  //   height: 51,
  //   color: 0x001e0f,
  //   position: {
  //     x: -176,
  //     y: -5,
  //     z: 232,
  //   },
  // });
  drawCylinder({
    radius: 1,
    height: 200,
    color: 0x4488ff,
    img: "allow2.png",
    //   position: {
    //     x:,
    //     y:,
    // z:,
    //   },
  });
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

/**
 * 展示点击内容
 */
/*function showObject(obj, event) {
  console.log(obj);
  let key = obj.name;
  let objs = this.cabinetData.filter((item) => {
    return item.code === key;
  });
  // 显示内容，高亮
  if (objs.length > 0) {
    let oldOneMaterial = this.oldChildren.filter(
      (item) => item.name === key
    )[0];
    obj.material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      map: oldOneMaterial.material.map,
    });

    this.texts = objs[0];
    // 处理坐标
    this.dragTop = event.clientY - 50;
    this.dragLeft = event.clientX - 100;
  }
}*/

async function loadLiedeModel() {
  await data.base3D.loadModels("liede1.gltf");
  // await data.base3D.loadModels("tube.gltf");
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
  console.log("111111111", outerPipeMesh);
  console.log("2222222", innerPipeMesh);
  return tubeTexture1;
}

/**
 *  creat pipeline
 *  https://threejs.org/docs/index.html?q=TubeGeometry#api/en/geometries/TubeGeometry
 */
function creatPipe(conf) {
  const path = createPath(conf.points);
  // console.log("..........", path);
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

// function render() {
//   proton.update();
//   Proton.Debug.renderInfo(proton, 3);
// }

function animate(time) {
  time *= 0.003;
  tubeTexture1.offset.x = -(time * 1) % 1;
  tubeTexture2.offset.x = -(time * 1) % 1;
  cylinderTexture.offset.x = -(time * 1) % 1;
  //  水面
  water.position.x = gui.waterx;
  water.position.y = gui.watery;
  water.position.z = gui.waterz;
  // waterGeometry.parameters.width = gui.waterWidth;
  // waterGeometry.parameters.height = gui.waterHeight;
  // 标注
  PopUpMesh.position.x = gui.popUpx;
  PopUpMesh.position.y = gui.popUpy;
  PopUpMesh.position.z = gui.popUpz;
  taggingText.position.x = gui.popUpx;
  taggingText.position.y = gui.popUpy;
  taggingText.position.z = gui.popUpz;
  // 圆柱
  CylinderMesh.position.x = gui.cylinderMeshx;
  CylinderMesh.position.y = gui.cylinderMeshy;
  CylinderMesh.position.z = gui.cylinderMeshz;
  stripMesh.position.x = gui.cylinderMeshx;
  stripMesh.position.y = gui.cylinderMeshy;
  stripMesh.position.z = gui.cylinderMeshz;
  CylinderMesh.rotation.z = gui.cylinder_z;
  stripMesh.rotation.z = gui.cylinder_z;

  // console.log(waterGeometry);
  requestAnimationFrame(animate);
  water.material.uniforms["time"].value += 1.0 / 60.0;

  // render();
}

//构建物体
function initObject(c_width, c_hight, text) {
  //用canvas生成图片
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = c_width;
  canvas.height = c_hight;
  //制作矩形
  ctx.fillStyle = "rgba(3,38,64,1)";
  // ctx.fillRect(0, 0, 300, 300);
  ctx.fillRect(0, 0, c_width, c_hight * 0.35);
  //设置文字
  ctx.fillStyle = "#02576a";
  // ctx.font = 'normal 8pt "楷体"';
  ctx.font = 32 + 'px "sans-serif';
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  ctx.fillText(text, 20, 35);

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
  let texture = THREE.ImageUtils.loadTexture(url, null, (t) => {});

  let material1 = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    opacity: 1,
    transparent: true,
  });

  taggingText = new THREE.Mesh(geometry1, material1);
  taggingText.position.set(0, 4, 25);
  data.base3D.scene.add(taggingText);
  addPopUpMesh(c_width, c_hight);
}
/**
 * 标注
 */
function addPopUpMesh(c_width, c_hight) {
  let texture;
  const textureLoader = new THREE.TextureLoader();
  let material;
  let geometry = new THREE.PlaneGeometry(c_width * 0.1, c_hight * 0.1);
  texture = textureLoader.load("images/popupBg.png"); // 图片贴图
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  material = new THREE.MeshPhongMaterial({
    map: texture,
    transparent: true,
    depthTest: false, // 深度检测
    side: THREE.DoubleSide,
  });
  PopUpMesh = new THREE.Mesh(geometry, material);
  PopUpMesh.position.set(0, 4, 25);
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
  console.log(water);
  water.rotation.x = -Math.PI / 2;
  water.position.x = position.x;
  water.position.z = position.y;
  water.position.y = position.z;
  data.base3D.scene.add(water);
}

/*//初始化dat.GUI简化试验流程
function initGui() {
  //声明一个保存需求修改的相关数据的对象
  gui = {
    offsetX: 0,
    offsetY: 0,
    repeatX: 1,
    repeatY: 1,
    rotation: 0,
    centerX: 0.5,
    centerY: 0.5,
    RepeatWrapping: true,
  };
  let datGui = new dat.GUI();
  //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
  datGui.add(gui, "offsetX", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "offsetY", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "repeatX", 0.25, 2.0).onChange(updateUV);
  datGui.add(gui, "repeatY", 0.25, 2.0).onChange(updateUV);
  datGui.add(gui, "rotation", -2.0, 2.0).onChange(updateUV);
  datGui.add(gui, "centerX", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "centerY", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "RepeatWrapping").onChange(function (e) {
    if (e) {
      water.map.wrapS = material.map.wrapT = THREE.RepeatWrapping; //设置为可循环
    } else {
      material.map.wrapS = material.map.wrapT = THREE.ClampToEdgeWrapping; //设置会默认的最后一像素伸展
    }

    material.map.needsUpdate = true;
  });
}

//更新纹理贴图的方法
function updateUV() {
  // 一种方法，直接全写在一个方法内
  //texture.matrix.setUvTransform( API.offsetX, API.offsetY, API.repeatX, API.repeatY, API.rotation, API.centerX, API.centerY );

  // 另一种方法，分开写
  material.map.matrix
    .identity() //矩阵重置
    .translate(-gui.centerX, -gui.centerY) //设置中心点
    .rotate(gui.rotation) // 旋转
    .scale(gui.repeatX, gui.repeatY) //缩放
    .translate(gui.centerX, gui.centerY) //设置中心点
    .translate(gui.offsetX, gui.offsetY); //偏移
}*/

function initGui() {
  let datGui = new dat.GUI();
  gui = {
    waterx: -182,
    watery: -5,
    waterz: 232,
    // waterWidth: 0,
    // waterHeight: 0,
    //
    popUpx: 0,
    popUpy: 0,
    popUpz: 0,
    //
    pipeMeshx: 0,
    pipeMeshy: 0,
    pipeMeshz: 0,

    cylinderMeshx: 0,
    cylinderMeshy: 0,
    cylinderMeshz: 0,
    cylinder_z: 0.5 * Math.PI,
  };

  // (对象，属性，最小值，最大值）
  datGui.add(gui, "waterx", -500, 250);
  datGui.add(gui, "watery", -10, 10);
  datGui.add(gui, "waterz", -200, 300);

  datGui.add(gui, "popUpx", -500, 250);
  datGui.add(gui, "popUpy", -10, 10);
  datGui.add(gui, "popUpz", -500, 250);

  datGui.add(gui, "pipeMeshx", -500, 300);
  datGui.add(gui, "pipeMeshy", -10, 10);
  datGui.add(gui, "pipeMeshz", -500, 300);

  datGui.add(gui, "cylinderMeshx", -500, 300);
  datGui.add(gui, "cylinderMeshy", -10, 10);
  datGui.add(gui, "cylinderMeshz", -500, 300);
  datGui.add(gui, "cylinder_z", 0.5 * Math.PI, Math.PI);

  // datGui.add(gui, "waterWidth", 0, 300).onChange(generateGeometry);
  // datGui.add(gui, "waterHeight", 0, 300).onChange(generateGeometry);
}

function drawCylinder(pipeConf) {
  let { radius, height, color, img } = pipeConf;
  // 创建 箭头的 canvas
  /*  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = 64;
  ctx.canvas.height = 64;
  ctx.fillStyle = "rgba(105,181,201,0.1)";
  // ctx.fillRect(100, 0, 64, 64);
  ctx.fillRect(0, 0, 0, 0); //管透明度
  ctx.translate(32, 32);
  ctx.rotate(Math.PI * 0.5);
  ctx.fillStyle = "rgb(0,255,255)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "48px sans-serif";
  ctx.fillText("➡︎", 0, 0);

  texture = new THREE.CanvasTexture(ctx.canvas);*/
  cylinderTexture = new THREE.TextureLoader().load("images/" + img);

  cylinderTexture.wrapS = THREE.RepeatWrapping;
  cylinderTexture.wrapT = THREE.RepeatWrapping;
  cylinderTexture.repeat.x = 20; // x方向的箭头密度
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
    opacity: 0.35,
    depthWrite: false, // 为true内部流动的液体会被遮挡无法显示
  });
  CylinderMesh = new THREE.Mesh(geometry, material);

  CylinderMesh.rotation.x = Math.PI * 0.5;
  data.base3D.scene.add(CylinderMesh);
  console.log(CylinderMesh);

  // CylinderMesh.rotation.z = Math.PI * 0.5; // 箭头方向

  // CylinderMesh.rotation.x = Math.PI * 0.6; //修改箭头在管壁的位置

  // 管中心平面
  const stripGeo = new THREE.PlaneBufferGeometry(radiusTop * 1.7, height);
  const stripMat = new THREE.MeshBasicMaterial({
    map: cylinderTexture,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });
  stripMesh = new THREE.Mesh(stripGeo, stripMat);
  data.base3D.scene.add(stripMesh);
  // stripMesh.rotation.z = Math.PI * 0.5;
  // stripMesh.rotation.y = Math.PI * 0.5;
  stripMesh.rotation.x = Math.PI * 0.5;
}
</script>

<style scoped>
#sceneContainer {
  width: 100%;
  height: 100%;
}
</style>
