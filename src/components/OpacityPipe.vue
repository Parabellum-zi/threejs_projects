<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import threeUniversal from "../utils/threeUniversal";
import ResourceTracker from "../utils/ResourceTracker";
import Base3D from "../utils/base3D";
let scene = reactive({});
let camera = reactive({});
// let renderer = reactive({});
// let orbitControls = reactive({});
const sceneContainer = ref(null);
let gui;
let material;
// let clock = new THREE.Clock();
const pointsArr = [
  [-80, -20, 0],
  [-70, 20, 0],
  [0, 0, 0],
  [70, 30, 0],
  [20, 40, 0],
];
/*
const pointsArr = [
  [113.33200717035561, 23.123868298337488, 20],
  [113.33193471797097, 23.12389375632453, 20],
  [113.33187953734473, 23.123770177383715, 20],
  [113.33185832872239, 23.123481594596804, 20],
  [113.33169725322034, 23.12263653054203, 20],
  [113.3319550555247, 23.122622333204134, 20],
  [113.33223498079862, 23.12261203308015, 20],
  [113.33252478587465, 23.122587171140765, 20],
  [113.3327903879739, 23.122589532743206, 20],
  [113.33300847557683, 23.12258577162446, 20],
  [113.33322488273681, 23.122574663006855, 20],
  [113.33325226582443, 23.122530909194133, 20],
  [113.3332644228248, 23.122309951803306, 20],
  [113.33325917485871, 23.12204813100512, 20],
  [113.3332602085735, 23.121777588490747, 20],
  [113.33326582366728, 23.12153099095903, 20],
  [113.33326443507165, 23.12145409799167, 20],
  [113.33327543328967, 23.121325676116662, 20],
  [113.33347832991453, 23.12131401426879, 20],
  [113.33376506377276, 23.121288358975708, 20],
  [113.33404731471101, 23.121263662071076, 20],
  [113.33428435196257, 23.12123652778491, 20],
  [113.33444257785685, 23.12108209002754, 20],
  [113.33444245620335, 23.12082534299868, 20],
  [113.33443698584692, 23.12054420347713, 20],
  [113.33443361968887, 23.12031888058382, 20],
  [113.33443122026354, 23.120002662765, 20],
  [113.33442693344298, 23.11972456728798, 20],
  [113.3344232242018, 23.119552454790348, 20],
  [113.33453681602084, 23.119526738111013, 20],
  [113.33475147734951, 23.119489872823163, 20],
  [113.33512287057088, 23.11944253470876, 20],
  [113.33565136182612, 23.11937221691412, 20],
  [113.33648041097598, 23.118473519373225, 20],
  [113.33648800266937, 23.118457139717187, 20],
];
*/

let texture;
const resMgr = new ResourceTracker();
const track = resMgr.track.bind(resMgr);

let data = reactive({
  base3D: {},
});

onMounted(() => {
  initScene();
  iterativeScene();
  animate();
});

function initScene() {
  data.base3D = new Base3D(sceneContainer.value);
  threeUniversal.addFloor(data.base3D.scene);
  // document.addEventListener("mousedown", onDocumentMouseDown);
}

function animate(time) {
  time *= 0.001;
  texture.offset.x = -(time * 1) % 1; // 贴图运动速度
  // const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
}

function initPipeConf() {
  const transparentConf = {
    points: pointsArr,
    color: 0x4488ff,
    radius: 3,
    opacity: 0.1,
  };

  // 管道内流动的液体
  const conf = {
    points: pointsArr,
    texture: "images/allow2.png",
    radius: 1.5,
  };
  // 创建管道
  const { texture: tubeTexture0, mesh: pipe0 } = creatPipe(transparentConf);
  const { texture: tubeTexture1, mesh: pipe1 } = creatPipe(conf);
  texture = tubeTexture1;
  data.base3D.scene.add(track(pipe0));
  data.base3D.scene.add(track(pipe1));
  // console.log(scene);
  // return { tubeTexture1 };

  // var radius = data[i]["Diameter"] - 0; // 管子的半径
  /*
  var radius = 3; // 管子的半径
  var shape = new THREE.Shape();
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false);

  var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  var v1 = new THREE.Vector3(0, 0, 0);
  var v2 = new THREE.Vector3(100, 0, 0);

  var path = new THREE.LineCurve3(v1, v2);

  var extrudeSettings = {
    bevelEnabled: false,
    steps: 1,
    extrudePath: path,
  };

  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
*/

  /*  let bb = [
    [-10, 0, 0],
    [0, 10, 0],
    [10, 0, 0],
  ];

  let aa = {
    points: bb,
  };

  const material1 = new THREE.LineBasicMaterial({
    color: 0x0000ff,
  });

  // points.push(new THREE.Vector3(-10, 0, 0));
  // points.push(new THREE.Vector3(0, 10, 0));
  // points.push(new THREE.Vector3(10, 0, 0));
  // console.log(points);
  const geometry = new THREE.BufferGeometry().setFromPoints(aa.points);
  creatPipe(aa);
  const line = new THREE.Line(geometry, material1);
  scene.add(line);*/
  /* var point1 = new THREE.Vector3(4, 8, 9);

  var geometry = new THREE.Geometry();
  //定义线的颜色
  // Parameters是一个定义材质外观的对象，它包含多个属性来定义材质，这些属性是：
  // Color：线条的颜色，用16进制来表示，默认的颜色是白色。
  // linewidth：线条的宽度，默认时候1个单位宽度。 这个参数设置了也没用
  // Linecap：线条两端的外观，默认是圆角端点，当线条较粗的时候才看得出效果，如果线条很细，那么你几乎看不出效果了。
  // Linejoin：两个线条的连接点处的外观，默认是“round”，表示圆角。
  // VertexColors：定义线条材质是否使用顶点颜色，这是一个boolean值。意思是，线条各部分的颜色会根据顶点的颜色来进行插值。
  // Fog：定义材质的颜色是否受全局雾效的影响。
  var material = new THREE.LineBasicMaterial({
    vertexColors: false,
    color: 0xff0000,
  });
  var color1 = new THREE.Color(0xff0000);
  let color2 = new THREE.Color(0xffff00);
  // 创建点，此处创建并放到几何体里面两个点，是一条线段，三个点是一条折现
  var p1 = new THREE.Vector3(-100, 0, 100);
  var p2 = new THREE.Vector3(100, 0, -100);
  var p3 = new THREE.Vector3(100, 0, 100);
  geometry.vertices.push(p1);
  geometry.vertices.push(p2);
  geometry.vertices.push(p3);
  //创建线   THREE.LineSegments 这个方法是创建线段的意思 有些文章里面 写的是THREE.LinePieces  但是在84版以后（我用的84版和107版）都不在支持了
  var line = new THREE.Line(geometry, material, THREE.LineSegments);
  //加入到场景
  scene.add(line);*/

  /*  var p1 = new THREE.Vector3(-85.35, -35.36, 0);
  var p2 = new THREE.Vector3(-50, 0, 0);
  var p3 = new THREE.Vector3(0, 50, 0);
  var p4 = new THREE.Vector3(50, 0, 0);
  var p5 = new THREE.Vector3(85.35, -35.36, 0);
  // 创建线条一：直线
  let line1 = new THREE.LineCurve3(p1, p2);
  // 重建线条2：三维样条曲线
  var curve = new THREE.CatmullRomCurve3([p2, p3, p4]);
  // 创建线条3：直线
  let line2 = new THREE.LineCurve3(p4, p5);
  var CurvePath = new THREE.CurvePath(); // 创建CurvePath对象
  CurvePath.curves.push(line1, curve, line2); // 插入多段线条
  //通过多段曲线路径创建生成管道
  //通过多段曲线路径创建生成管道，CCurvePath：管道路径
  var geometry2 = new THREE.TubeGeometry(CurvePath, 100, 5, 25, false);
  var material = new THREE.MeshLambertMaterial({});
  material.map = textloader.load("../images/netline-on.jpg");
  material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
  material.map.needsUpdate = true;
  var cube = new THREE.Mesh(geometry2, material);
  cube.spead = 0.01;
  cube.position.y = 300;
  aaa.push(cube);
  console.log(cube);
  scene.add(cube);*/

  /* let stripMesh;
  // 管中心平面
  const stripGeo = new THREE.PlaneGeometry(50, 100);
  const stripMat = new THREE.MeshBasicMaterial({
    map: texture,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });
  stripMesh = new THREE.Mesh(stripGeo, stripMat);
  scene.add(stripMesh);*/
  // stripMesh.rotation.z = Math.PI * 0.5;
  // stripMesh.rotation.y = Math.PI * 0.5;
  // stripMesh.rotation.x = Math.PI * 0.5;

  return { tubeTexture0, tubeTexture1 };
  // return { tubeTexture1 };
}

/**
 * 创建文本贴图
 * @param text
 * @returns {HTMLCanvasElement}
 */
function getTextCanvas(text) {
  let width = 512,
    height = 256;
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  // ctx.fillStyle = "rgba(76,180,206,0.1)";
  ctx.fillStyle = "rgba(241,11,11,0.2)";
  ctx.fillRect(0, 0, width, height);
  ctx.font = 500 + 'px "sans-serif';
  ctx.fillStyle = "rgba(40,145,255,1)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  return canvas;
}

//初始化dat.GUI简化试验流程
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
      material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping; //设置为可循环
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
}

/**
 *  创建管线
 *  https://threejs.org/docs/index.html?q=TubeGeometry#api/en/geometries/TubeGeometry
 */
function creatPipe(conf) {
  const path = createPath(conf.points);
  const geometry = track(
    new THREE.TubeGeometry(path, 100, conf.radius, 15, false)
  );

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
    texture.repeat.set(10, 1);
    // texture.rotation = Math.PI;
    // 图片贴图
    // 模拟管线运动动画，将两个素材图按比例合并，然后生成贴图texture
    material = track(
      new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        depthTest: false, // 深度检测
      })
    );

    //尝试使用文本贴图
    /*    material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
      color: conf.color,
    });*/
  } else {
    material = track(
      new THREE.MeshPhongMaterial({
        // map: texture,
        color: conf.color,
        transparent: true,
        opacity: conf.opacity,
        depthWrite: false, // 为true内部流动的液体会被遮挡无法显示
      })
    );
  }
  const mesh = track(new THREE.Mesh(geometry, material));
  // mesh.rotation.z = Math.PI * 0.5; // 箭头方向
  mesh.rotation.x = Math.PI * 0.5; //修改箭头在管壁的位置

  return { texture, mesh };
}

function createPath(pointsArr) {
  pointsArr = pointsArr.map((point) => new THREE.Vector3(...point));
  // 利用CatmullRomCurve3 创建路径，不过是平滑的三维样条曲线
  return new THREE.CatmullRomCurve3(pointsArr);
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  let vector = new THREE.Vector3(); //三维坐标对象
  vector.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5
  );
  vector.unproject(camera);
  let rayCaster = new THREE.Raycaster(
    camera.position,
    vector.sub(camera.position).normalize()
  );
  let intersects = rayCaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    let selected = intersects[0]; //取第一个物体
    console.log("x坐标:" + selected.point.x);
    console.log("y坐标:" + selected.point.y);
    console.log("z坐标:" + selected.point.z);
  }
}

function waitSeconds(seconds = 0) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

let count = 0;
async function iterativeScene() {
  for (;;) {
    count++;
    initPipeConf();
    await waitSeconds(2);
    resMgr.dispose();
    await waitSeconds(1);
    // console.log(count);
    // console.log(data.base3D.renderer.info.memory);
  }
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
