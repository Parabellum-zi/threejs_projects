<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { onMounted, reactive, ref, onBeforeMount } from "vue";
// import * as dat from "dat.gui";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import threeMethods from "../utils/index.js";
import esriConfig from "@arcgis/core/config.js";
esriConfig.assetsPath = "./assets";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import Basemap from "@arcgis/core/Basemap";
import TileLayer from "@arcgis/core/layers/TileLayer";
import * as externalRenderers from "@arcgis/core/views/3d/externalRenderers"; //外部渲染器
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import CoordTrans from "../utils/coordTrans";

const sceneContainer = ref(null);
let scene = reactive({});
let camera = reactive({});
let renderer = reactive({});
// let orbitControls = reactive({});
/*const pointsArr = [
  [116.46, 39.92, 100],
  [104.06, 30.67, 100],
  [121.48, 31.22, 100],
  [91.11, 29.97, 100],
  [102.73, 25.04, 100],
  [113.23, 23.16, 100],
  [113, 28.21, 100],
];*/

// 以广州附近的点为示例
const pointsArr = [
  [113.23, 23.16, 20],
  [113.21, 23.17, 20],
  [113.22, 23.18, 20],
  [113.23, 23.19, 20],
  [113.23, 23.2, 20],
  [113.23, 23.21, 20],
];

// let pointsArr = reactive([]);

// 广州2000
const gzPointsArr = [
  [44213.1035000002, 227755.40550000034],
  [44182.180499999784, 227759.49349999987],
  [44152.449500000104, 227763.06450000033],
  [44123.19049999956, 227767.5775000006],
  [44093.29050000012, 227771.4564999994],
  [44063.58249999955, 227775.63150000013],
  [44033.69649999961, 227779.72149999999],
  [44004.5083999997, 227783.76239999942],
  [43994.73000000045, 227784.9759999998],
  [43996.32100000046, 227807.4810000006],
];

/*const gz = [
  [44213.1035000002, 227755.40550000034],
  [44182.180499999784, 227759.49349999987],
  [44152.449500000104, 227763.06450000033],
  [44123.19049999956, 227767.5775000006],
  [44093.29050000012, 227771.4564999994],
  [44063.58249999955, 227775.63150000013],
  [44033.69649999961, 227779.72149999999],
  [44004.5083999997, 227783.76239999942],
  [43994.73000000045, 227784.9759999998],
  [43996.32100000046, 227807.4810000006],
  [43996.74799999967, 227826.48900000006],
  [43997.150999999605, 227857.31799999997],
  [43997.42200000025, 227892.32200000063],
  [43997.77099999972, 227917.33000000007],
  [43998.33899999969, 227948.39800000004],
  [43998.3339999998, 227976.8629999999],
  [43982.43800000008, 227993.72499999963],
  [43958.01999999955, 227996.55000000075],
  [43929.23199999984, 227998.9969999995],
  [43899.987999999896, 228001.5390000008],
  [43879.294999999925, 228002.61500000022],
  [43878.17899999954, 228016.82200000063],
  [43878.32400000002, 228025.33699999936],
  [43877.762000000104, 228052.6339999996],
  [43877.6679999996, 228082.58699999936],
  [43878.21399999969, 228111.58100000024],
  [43876.98300000001, 228136.03199999966],
  [43874.191999999806, 228140.84699999914],
  [43852.12200000044, 228141.84300000034],
  [43829.88100000005, 228142.01999999955],
  [43802.794999999925, 228141.46199999936],
  [43773.242999999784, 228143.88499999978],
  [43744.69900000002, 228144.70099999942],
  [43718.411999999546, 228145.9690000005],
  [43734.86899999995, 228239.7229999993],
  [43737.042000000365, 228271.6989999991],
  [43742.67300000042, 228285.44600000046],
  [43754.14400000032, 228309.6860000007],
  [43764.37700000033, 228334.3239999991],
  [43777.43800000008, 228329.65399999917],
  [43764.37700000033, 228334.3239999991],
];*/

let texture;
let CylinderMesh;
let stripMesh;
const colors = ["#ffff00", "#00ffe2", "#9800ff", "#ff6767"];
let color = colors[Math.floor(Math.random() * colors.length)];
/*onBeforeMount(() => {
  changeGZ2web();
});*/

onMounted(() => {
  initArcMap();
});

/**
 * 初始化ArcGIS 相关
 */
function initArcMap() {
  const basemap = new Basemap({
    baseLayers: [
      new TileLayer({
        url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
        // url: "http://10.194.69.43/server/rest/services/GDBasemap/MapServer",
        title: "Basemap",
      }),
    ],
  });
  const map = new Map({ basemap });

  let view = new SceneView({
    container: sceneContainer.value,
    map: map,
    camera: {
      position: [113.23, 23.16, 2630.6413883436],
      tilt: 1,
    },
  });
  view.ui.remove(["attribution", "zoom"]);
  view.ui.empty("top-left");
  window.view = view;

  map.ground.opacity = 1;
  // 开启地下导航模式 可选属性值 {none: 地下} / {stay-above:地上}
  // map.ground.navigationConstraint = { type: "none" };
  registerRenderer();
}

/**
 *
 * @Description: 以下方法参照了
 * https://developers.arcgis.com/javascript/latest/api-reference/esri-views-3d-externalRenderers.html
 * https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-support-webMercatorUtils.html
 * https://blog.csdn.net/qq_37155408/article/details/115693043?spm=1001.2014.3001.5502
 * http://www.yanhuangxueyuan.com/Three.js_course/texture.html#2
 * https://www.cnblogs.com/xuejianxiyang/p/9719715.html
 * https://threejs.org/docs/index.html#manual/en/introduction/Drawing-lines
 * @author parabellum
 * @date 2022/1/5
 * @type {{setup: myExternalRenderer.setup, render: myExternalRenderer.render}}
 */
let myExternalRenderer = {
  // scene: null, // three.js 中的场景
  // camera: null, // three.js 相机
  // renderer: null, // three.js 渲染器
  /**
   * Setup function, called once by the ArcGIS JS API.
   注册对象时被调用,只调用一次,用于初始化three.js创建的对象
   */
  setup: function (context) {
    renderer = new THREE.WebGLRenderer({
      context: context.gl, // 可用于将渲染器附加到已有的渲染环境(RenderingContext)中
      premultipliedAlpha: false, // renderer是否假设颜色有 premultiplied alpha. 默认为true
    });
    renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
    renderer.setViewport(0, 0, window.view.width, window.view.height); // 视口大小设置

    // 防止Three.js清除ArcGIS JS API提供的缓冲区。
    renderer.autoClearDepth = false; // 定义renderer是否清除深度缓存
    renderer.autoClearStencil = false; // 定义renderer是否清除模板缓存
    renderer.autoClearColor = false; // 定义renderer是否清除颜色缓存

    /*   // 此段暂时预留   此段替换为了render方法中 context.bindRenderTarget();
    // ArcGIS JS API渲染自定义离屏缓冲区，而不是默认的帧缓冲区。
    // 我们必须将这段代码注入到three.js运行时中，以便绑定这些缓冲区而不是默认的缓冲区。
    const originalSetRenderTarget = this.renderer.setRenderTarget.bind(
      this.renderer
    );
    this.renderer.setRenderTarget = function (target) {
      originalSetRenderTarget(target);
      if (target == null) {
        // 绑定外部渲染器应该渲染到的颜色和深度缓冲区
        context.bindRenderTarget();
      }
    };*/

    scene = new THREE.Scene(); // 场景
    camera = new THREE.PerspectiveCamera(); // 相机

    // 上帝说比需要有光， 不然你的管就黑了
    const ambientLight = new THREE.AmbientLight(0x909090); // 自然光，每个几何体的每个面都有光
    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(ambientLight);
    scene.add(pointLight);
    // 添加坐标轴辅助工具
    const axesHelper = new THREE.AxesHelper(10000000);
    scene.add(axesHelper);
    // 更新view的resolution, 在场景中渲染管线等需要此句之后
    scene.userData.viewResolution = window.view.resolution;
    //  基础配置结束

    // initPipeConf();
    createCircle(pointsArr[0]);
  },
  render: function (context) {
    // 更新相机参数
    const cam = context.camera;
    camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
    camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
    camera.lookAt(
      new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2])
    );
    // 投影矩阵可以直接复制
    camera.projectionMatrix.fromArray(cam.projectionMatrix);

    animate();
    resize();
    // 更新view的resolution
    // scene.userData.viewResolution = this.view.resolution;
    // 绘制场景
    renderer.state.reset();
    context.bindRenderTarget();
    renderer.render(scene, camera);
    // 请求重绘视图。
    externalRenderers.requestRender(window.view);
    // cleanup
    context.resetWebGLState();
  },
};

function registerRenderer() {
  // 向SceneView实例注册外部渲染器
  externalRenderers.add(window.view, myExternalRenderer);
}

/**
 * 经纬度坐标点转换为渲染坐标系（three js）中的点坐标
 * @param {number} longitude 经度
 * @param {number} latitude 纬度
 * @param {number} height 高度
 * @return {array} 返回渲染坐标系中(three js)的点坐标[x, y, z]
 */
function pointTransform(longitude, latitude, height) {
  let transformation = new Array(16);
  // 将经纬度坐标转换为xy值
  let pointXY = webMercatorUtils.lngLatToXY(longitude, latitude);
  /*let pointXY = CoordTrans.GaussTransform.GZ2000XYtoG2000BL(
    longitude,
    latitude
  );*/
  // console.log(window.view.spatialReference);
  console.log("pointXY", pointXY);
  // 先转换高度为0的点
  externalRenderers.renderCoordinateTransformAt(
    window.view,
    [pointXY[0], pointXY[1], height], // 坐标在地面上的点[x值, y值, 高度值]
    window.view.spatialReference,
    transformation
  );
  console.log(transformation[12], transformation[13], transformation[14]);
  return [transformation[12], transformation[13], transformation[14]];
}

/**
 * 管线初始配置 （直径，颜色，透明度等）
 */
function initPipeConf() {
  const transparentConf = {
    points: pointsArr,
    color: 0x4488ff,
    radius: 200,
    opacity: 0.3,
  };
  // 管道内流动的液体
  const conf = {
    points: pointsArr,
    texture: "images/southeast.jpg",
    radius: 1,
  };
  // 创建管道
  const { texture: tubeTexture0, mesh: pipe0 } = creatPipe(transparentConf);
  const { texture: tubeTexture1, mesh: pipe1 } = creatPipe(conf);
  scene.add(pipe0);
  scene.add(pipe1);
  return { tubeTexture0, tubeTexture1 };
  // return { tubeTexture1 };
}

/**
 *  创建管线
 */
function creatPipe(conf) {
  const path = createPath(conf.points);
  const geometry = new THREE.TubeGeometry(path, 100, conf.radius);
  const textureLoader = new THREE.TextureLoader();
  let material;
  if (conf.texture !== undefined) {
    texture = textureLoader.load(conf.texture);
    // 设置阵列模式为 RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    // 等价texture.repeat= new THREE.Vector2(3,1)
    texture.repeat.x = 30;

    // 模拟管线运动动画，将两个素材图按比例合并，然后生成贴图texture
    material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
    });
  } else {
    material = new THREE.MeshPhongMaterial({
      color: conf.color,
      transparent: true,
      opacity: conf.opacity,
    });
    material.depthWrite = false;
  }

  const mesh = new THREE.Mesh(geometry, material);
  return { texture, mesh };
}

/**
 * 将经纬度坐标转为 渲染系坐标后生成管线的渲染坐标点
 * @param pointsArr
 * @returns {CatmullRomCurve3}
 */
function createPath(pointsArr) {
  let newArr = [];
  pointsArr.map((e) => newArr.push(pointTransform(...e)));
  let points = newArr.map((point) => new THREE.Vector3(...point));
  // 利用CatmullRomCurve3 创建路径，不过是平滑的三维样条曲线
  return new THREE.CatmullRomCurve3(points);
}

/*function drawCylinder() {
  // 创建 箭头的 canvas
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = 64;
  ctx.canvas.height = 64;
  ctx.fillStyle = "rgb(105,181,201)";
  ctx.fillRect(0, 0, 64, 64);
  ctx.translate(32, 32);
  ctx.rotate(Math.PI * 0.5);
  ctx.fillStyle = "rgb(0,255,255)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "48px sans-serif";
  ctx.fillText("➡︎", 0, 0);

  // texture = new THREE.CanvasTexture(ctx.canvas);
  texture = new THREE.TextureLoader().load("images/southeast.jpg");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 4;
  texture.repeat.y = 9;

  // 创建管道
  const radiusTop = 1;
  const radiusBottom = 1;
  // const height = 20000000; // 修改管线长度
  const height = 20000000; // 修改管线长度
  const radiusSegments = 20;
  const heightSegments = 2;
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
    map: texture,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });
  CylinderMesh = new THREE.Mesh(geometry, material);
  scene.add(CylinderMesh);
  CylinderMesh.rotation.z = Math.PI * 0.5;

  const stripGeo = new THREE.PlaneBufferGeometry(radiusTop * 1.7, height);
  const stripMat = new THREE.MeshBasicMaterial({
    map: texture,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });
  stripMesh = new THREE.Mesh(stripGeo, stripMat);
  scene.add(stripMesh);
  stripMesh.rotation.z = Math.PI * 0.5;
}*/

function animate(time) {
  // time *= 0.0006;
  // texture.offset.x = (time * 1) % 1; // 贴图运动速度
  // texture.offset.x += 0.001;
  // const elapsedTime = clock.getElapsedTime();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function resize() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

/**
 * 使用圆标记了管线的起始点
 * @param Point
 */
function createCircle(Point) {
  let endPoint = pointTransform(...Point);
  let radius = scene.userData.viewResolution * 30;
  // 生成圆环
  const circleGeometry = new THREE.CircleGeometry(radius, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    side: THREE.DoubleSide,
    transparent: true, // 定义此材质是否透明
    opacity: 1,
  });
  const circleMesh = new THREE.Mesh(circleGeometry, ringMaterial);
  // 设置终点圆圈的位置
  circleMesh.position.set(endPoint[0], endPoint[1], endPoint[2]);
  // 计算调整姿态的角度
  let deltaX = Math.atan(endPoint[2] / endPoint[1]);
  let deltaZ = Math.atan(
    endPoint[0] /
      Math.sqrt(endPoint[1] * endPoint[1] + endPoint[2] * endPoint[2])
  );
  // // 如果 y < 0 需要加上180°
  if (endPoint[1] < 0) {
    deltaX += Math.PI;
  } else {
    deltaZ *= -1;
  }
  // 调整圆圈姿态
  circleMesh.rotation.x = deltaX;
  circleMesh.rotation.z = deltaZ;
  circleMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2); // 再沿X轴旋转90°
  // circleMesh.visible = false;
  scene.add(circleMesh);
}

function changeGZ2web() {
  let arr = [];
  gzPointsArr.map((item) => {
    let resCoords = CoordTrans.GaussTransform.GZ2000XYtoG2000BL(
      item[0],
      item[1]
    );
    arr.push([resCoords.L, resCoords.B], 200);
  });
  pointsArr = arr;
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
