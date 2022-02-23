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
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import Graphic from "@arcgis/core/Graphic";

import * as externalRenderers from "@arcgis/core/views/3d/externalRenderers"; //外部渲染器
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import CoordTrans from "../utils/coordTrans";
const sceneContainer = ref(null);
// let scene = reactive({});
// let camera = reactive({});
// let renderer = reactive({});
// let orbitControls = reactive({});

let pointsArr = reactive([]);

let texture;
const colors = ["#ffff00", "#00ffe2", "#9800ff", "#ff6767"];
let color = colors[Math.floor(Math.random() * colors.length)];
let stripMesh;
onBeforeMount(() => {
  getYsdData();
});
onMounted(() => {
  // initArcMap();
});
/**
 * 初始化ArcGIS 相关
 */
function initArcMap() {
  const basemap = new Basemap({
    baseLayers: [
      new TileLayer({
        url: "http://10.194.150.155:8010/ServiceAccess/MapService-T/2017年卫星影像地图_广州2000坐标系_/19f3612a2b44e98baae1f40713a085b6",
        title: "Basemap",
        // visible: false,
      }),
    ],
  });
  const map = new Map({ basemap });
  let view = new SceneView({
    container: sceneContainer.value,
    map: map,
    zoom: 9.8,
  });
  view.when((view) => {
    let center = view.extent.center;
    center.x = 43698.65155595513;
    center.y = 228054.33760938543;
    view.goTo({
      center,
      tilt: 0,
      zoom: 16,
    });
  });
  view.ui.remove(["attribution", "zoom"]);
  view.ui.empty("top-left");
  window.view = view;
  map.ground.opacity = 0.3;
  // 开启地下导航模式 可选属性值 {none: 地下} / {stay-above:地上}
  map.ground.navigationConstraint = { type: "none" };
  // 图层
  let sceneLayer = new SceneLayer({
    id: "sceneLayer",
    // url: 'https://gis.swj.gz.gov.cn/server/rest/services/Hosted/PQWSG20220113/SceneServer', // 域名
    // url: "http://10.194.171.119/server/rest/services/Hosted/DWDPWSJCS20220122/SceneServer", // ip
    url: "http://10.194.171.3/server/rest/services/eslpk/XFWWSGX20211215/SceneServer",
  });
  map.add(sceneLayer);

  registerRenderer();
}

/**
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
  view: window.view,
  scene: null, // three.js 中的场景
  camera: null, // three.js 相机
  renderer: null, // three.js 渲染器
  /**
   * Setup function, called once by the ArcGIS JS API.
   注册对象时被调用,只调用一次,用于初始化three.js创建的对象
   */
  setup: function (context) {
    this.renderer = new THREE.WebGLRenderer({
      context: context.gl, // 可用于将渲染器附加到已有的渲染环境(RenderingContext)中
      premultipliedAlpha: false, // renderer是否假设颜色有 premultiplied alpha. 默认为true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
    this.renderer.setViewport(0, 0, window.view.width, window.view.height); // 视口大小设置
    // 防止Three.js清除ArcGIS JS API提供的缓冲区。
    this.renderer.autoClearDepth = false; // 定义renderer是否清除深度缓存
    this.renderer.autoClearStencil = false; // 定义renderer是否清除模板缓存
    this.renderer.autoClearColor = false; // 定义renderer是否清除颜色缓存
    this.renderer.shadowMap.enabled = false;

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
    this.scene = new THREE.Scene(); // 场景
    this.camera = new THREE.PerspectiveCamera(); // 相机
    // 上帝说比需要有光， 不然你的管就黑了
    const ambientLight = new THREE.AmbientLight(0xffffff); // 自然光，每个几何体的每个面都有光
    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    pointLight.castShadow = false;

    this.scene.add(ambientLight);
    this.scene.add(pointLight);
    // 添加坐标轴辅助工具
    // const axesHelper = new THREE.AxesHelper(1000000);
    // this.scene.add(axesHelper);
    // 更新view的resolution, 在场景中渲染管线等需要此句之后
    this.scene.userData.viewResolution = window.view.resolution;
    //  基础配置结束
    initPipeConf();
    // addGraphic(window.view);
  },
  render: function (context) {
    // 更新相机参数
    const cam = context.camera;
    this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
    this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
    this.camera.lookAt(
      new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2])
    );
    // 投影矩阵可以直接复制
    this.camera.projectionMatrix.fromArray(cam.projectionMatrix);
    // animate start
    texture.offset.x += -0.005; // 贴图运动速度
    texture.needsUpdate = true;
    // requestAnimationFrame(animate);
    this.renderer.render(this.scene, this.camera);
    // resize start
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      // Update camera
      this.camera.aspect = sizes.width / sizes.height;
      this.camera.updateProjectionMatrix();
      // Update renderer
      this.renderer.setSize(sizes.width, sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    // 更新view的resolution
    // scene.userData.viewResolution = this.view.resolution;
    // 绘制场景
    this.renderer.state.reset();
    context.bindRenderTarget();
    this.renderer.render(this.scene, this.camera);
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
  // let pointXY = webMercatorUtils.lngLatToXY(longitude, latitude);
  // 将广州2000坐标转换为xy值
  /*  let { X, Y } = CoordTrans.GaussTransform.G2000BLtoGZ2000XYZ(
    latitude,
    longitude
  );
  let positions = {
    x: X - 1220,
    y: Y - 340,
  };*/
  // 先转换高度为0的点
  externalRenderers.renderCoordinateTransformAt(
    window.view,
    // [pointXY[0], pointXY[1], height], // 坐标在地面上的点[x值, y值, 高度值]
    // [positions.x, positions.y, height], // 坐标在地面上的点[x值, y值, 高度值]
    [longitude, latitude, height], // 坐标在地面上的点[x值, y值, 高度值]
    window.view.spatialReference,
    transformation
  );
  return [transformation[12], transformation[13], transformation[14]];
}
/**
 * 管线初始配置 （直径，颜色，透明度等）
 */
function initPipeConf() {
  const transparentConf = {
    points: pointsArr,
    color: 0x4488ff,
    radius: 3,
    opacity: 0.6,
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
  // scene.add(pipe0);
  myExternalRenderer.scene.add(pipe0);
  myExternalRenderer.scene.add(pipe1);
  return { tubeTexture0, tubeTexture1 };

  /* // 尝试构建管中心平面
  const stripGeo = new THREE.PlaneBufferGeometry(1.7, 10);
  const stripMat = new THREE.MeshBasicMaterial({
    map: texture,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  });
  stripMesh = new THREE.Mesh(stripGeo, stripMat);
  myExternalRenderer.scene.add(stripMesh);
  stripMesh.rotation.z = Math.PI * 0.5;
  // stripMesh.rotation.y = Math.PI * 0.5;
  stripMesh.rotation.x = Math.PI * 0.5;*/
  // return { tubeTexture1 };
}
function addGraphic(view) {
  view.graphics.add(
    new Graphic({
      geometry: {
        type: "polyline",
        paths: pointsArr,
        spatialReference: view.spatialReference,
      },
      symbol: {
        type: "simple-line",
        color: [255, 90, 141],
        width: 10,
        cap: "round",
        join: "round",
      },
    })
  );
}

/**
 *  创建管线
 */
function creatPipe(conf) {
  const path = createPath(conf.points);
  const geometry = new THREE.TubeGeometry(path, 3000, conf.radius, 5, false);
  // console.log(geometry);
  // geometry.segments = 1;
  const textureLoader = new THREE.TextureLoader();
  let material;
  if (conf.texture !== undefined) {
    texture = textureLoader.load(conf.texture);
    // texture = new THREE.TextureLoader().load(conf.texture, () => {
    texture.needsUpdate = true;

    // texture = new THREE.CanvasTexture(getTextCanvas("➯ ➮ ➯")); // 文本贴图
    // 设置阵列模式为 RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    // 等价texture.repeat= new THREE.Vector2(3,1)
    texture.repeat.set(50, 2);
    texture.offset.y = 0.5;
    texture.rotation = Math.PI; // 旋转贴图方向
    // 模拟管线运动动画，将两个素材图按比例合并，然后生成贴图texture
    material = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.01, // 解决了贴图的透明部分显示为黑色
      side: THREE.DoubleSide, // 双面渲染，不留阴影。
    });
    // });
    //尝试使用文本贴图
    /* material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      // opacity: 0.1,
      color: conf.color,
    });*/
  } else {
    material = new THREE.MeshPhongMaterial({
      color: conf.color,
      transparent: true,
      opacity: conf.opacity,
    });
    material.depthWrite = false;
  }
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.rotation.x = Math.PI * 0.5; //修改箭头在管壁的位置
  mesh.receiveShadow = false;
  mesh.castShadow = false;
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
/*function animate(time) {
  time *= 0.0009;
  // texture.offset.x = -(time * 1) % 1; // 贴图运动速度
  // texture.needsUpdate = true;
  // // const elapsedTime = clock.getElapsedTime();
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
}*/
/**
 * 使用圆标记了管线的起始点
 * @param Point
 */
function createCircle(Point) {
  let endPoint = pointTransform(...Point);
  let radius = scene.userData.viewResolution * 0.001;
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
  // ctx.fillStyle = "rgb(105,181,201)";
  // ctx.fillStyle = "rgba(76,180,206,0.1)";
  ctx.fillStyle = "rgba(212,35,35,0.1)";
  ctx.fillRect(0, 0, width, height); //管透明度
  ctx.font = 50 + 'px "sans-serif';
  ctx.fillStyle = "rgb(16,239,121)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  return canvas;
}

function getYsdData() {
  let arr = [];
  fetch("static/json/wsgsy0216.json")
    .then((res) => res.json())
    .then((data) => {
      data.features = data.features.sort(
        (a, b) => b.attributes.sx - a.attributes.sx
      );
      data.features.map((item) => {
        arr.push([item.geometry.x, item.geometry.y, -1.5]);
      });
      pointsArr = arr;
    })
    .then(() => {
      initArcMap();
    })
    .catch((e) => {
      console.log(e.message);
    });
  return arr;
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
