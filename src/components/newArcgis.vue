<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
// import * as dat from "dat.gui";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import threeMethods from "../utils/index.js";
import esriConfig from "@arcgis/core/config.js";
esriConfig.assetsPath = "./assets";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
// import Basemap from "@arcgis/core/Basemap";
// import TileLayer from "@arcgis/core/layers/TileLayer";
import * as externalRenderers from "@arcgis/core/views/3d/externalRenderers"; //外部渲染器
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
// import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import ResourceTracker from "../utils/ResourceTracker";
import Stats from "three/examples/jsm/libs/stats.module";
const sceneContainer = ref(null);
// 以广州附近的点为示例
const pointsArr = [
  [115.80895340787583, 30.92933111293343, 20],
  [115.81947621477968, 30.936026430486265, 20],
  [115.85073577332635, 30.952730603143078, 20],
  [115.86830705038578, 30.964969701156637, 20],
  [115.87796494895557, 30.970050440481813, 20],
  [115.88263291871093, 30.97587476869184, 20],
  [115.88153549018487, 30.97619308639916, 20],
  [115.88860467181571, 30.985581605596618, 20],
  [115.89039457558401, 30.99614115304192, 20],
  [115.89037581420371, 30.99986573852132, 20],
  [115.88982453627196, 31.003621647335926, 20],
  [115.88822886767906, 30.999078415194415, 20],
  [115.88681216877917, 30.997464365151867, 20],
  [115.88286139825868, 30.99686255666582, 20],
  [115.87841763117079, 30.999826971071514, 20],
  [115.86308179931808, 30.99584156461405, 20],
  [115.85510630972263, 30.993171784031908, 20],
  [115.86174910808289, 30.993473404196706, 20],
  [115.86231959908358, 30.99068362090549, 20],
];
let texture;
let material;
let mesh;
let geometry;
const colors = ["#ffff00", "#00ffe2", "#9800ff", "#ff6767"];
let color = colors[Math.floor(Math.random() * colors.length)];
const resMgr = new ResourceTracker();
const track = resMgr.track.bind(resMgr);
let sceneAdd = reactive({});
let stats;
onMounted(() => {
  initArcMap();
  initStats();
  iterativeScene();
});

/**
 * 初始化ArcGIS 相关
 */
function initArcMap() {
  /*  const basemap = new Basemap({
    baseLayers: [
      new TileLayer({
        url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
        // url: "http://10.194.69.43/server/rest/services/GDBasemap/MapServer",
        title: "Basemap",
      }),
    ],
  });*/
  // const map = new Map({ basemap });
  const map = new Map({ basemap: "satellite" });

  let view = new SceneView({
    container: sceneContainer.value,
    map: map,
    environment: {
      background: {
        type: "color",
        color: [216, 214, 209, 0.3],
      },
      starsEnabled: false,
      atmosphereEnabled: true,
    },
    camera: {
      // position: [113.23, 23.16, 2630.6413883436],
      position: [115.87107, 30.9969, 1315],
      tilt: 1,
    },
  });
  view.ui.remove(["attribution", "zoom"]);
  view.ui.empty("top-left");
  window.view = view;

  map.ground.opacity = 0.5;
  // 开启地下导航模式 可选属性值 {none: 地下} / {stay-above:地上}
  // map.ground.navigationConstraint = { type: "none" };
}

function initStats() {
  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
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
 * https://threejs.org/docs/index.html?q=geometry#api/en/geometries/TubeGeometry
 * @author parabellum
 * @date 2022/1/5
 * @type {{setup: myExternalRenderer.setup, render: myExternalRenderer.render}}
 */
class MyExternalRenderer {
  constructor(option) {
    this.view = option;
    this.scene = null; // three.js 中的场景
    this.camera = null; // three.js 相机
    this.renderer = null; // three.js 渲染器
  }

  /**
   * Setup function, called once by the ArcGIS JS API.
   注册对象时被调用,只调用一次,用于初始化three.js创建的对象
   */
  setup(context) {
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
    const ambientLight = new THREE.AmbientLight(0x909090); // 自然光，每个几何体的每个面都有光
    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    this.scene.add(ambientLight);
    this.scene.add(pointLight);
    // 添加坐标轴辅助工具
    const axesHelper = new THREE.AxesHelper(5000000);
    this.scene.add(axesHelper);
    // 更新view的resolution, 在场景中渲染管线等需要此句之后
    this.scene.userData.viewResolution = window.view.resolution;
    //  基础配置结束
    initPipeConf(this.scene);
  }
  render(context) {
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
    if (texture) {
      texture.offset.x += -0.005; // 贴图运动速度
      texture.needsUpdate = true;
    }
    stats.update();
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
  }
}

function registerRenderer() {
  // console.log(myExternalRenderer, window.view);
  // 向SceneView实例注册外部渲染器
  console.log(sceneAdd);
  sceneAdd = null;
  sceneAdd = new MyExternalRenderer(window.view);
  externalRenderers.add(window.view, sceneAdd);
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
  // 先转换高度为0的点
  externalRenderers.renderCoordinateTransformAt(
    window.view,
    [pointXY[0], pointXY[1], height], // 坐标在地面上的点[x值, y值, 高度值]
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
    radius: 1.5,
    opacity: 0.1,
  };
  // 管道内流动的液体
  const conf = {
    points: pointsArr,
    // texture: new THREE.CanvasTexture(getTextCanvas("➯ ➮ ➯")), // 文本贴图
    texture: "images/allow2.png",
    radius: 3,
  };
  // 创建管道
  const { texture: tubeTexture0, mesh: pipe0 } = creatPipe(transparentConf);
  const { texture: tubeTexture1, mesh: pipe1 } = creatPipe(conf);

  console.log(sceneAdd);
  sceneAdd.scene.add(track(pipe0));
  sceneAdd.scene.add(track(pipe1));
  // return { tubeTexture0, tubeTexture1 };
  return { tubeTexture1 };
}

/**
 *  创建管线
 */
function creatPipe(conf) {
  const path = createPath(conf.points);
  geometry = track(new THREE.TubeGeometry(path, 100, conf.radius, 20, false));
  const textureLoader = new THREE.TextureLoader();

  if (conf.texture !== undefined) {
    texture = textureLoader.load(conf.texture, () => {
      /*     //点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(
        -2382004.007139146,
        4925447.561184913,
        3278247.9998681694
      ); //点光源位置
      myExternalRenderer.scene.add(point); //点光源添加到场景中*/
    });
    // 文本贴图
    // texture = new THREE.CanvasTexture(getTextCanvas("➯ ➮ ➯"));
    // 设置阵列模式为 RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    // 等价texture.repeat= new THREE.Vector2(3,1)
    texture.repeat.set(300, 1); // x,y 贴图重复
    texture.offset.y = 0.15; //设置管道纹理偏移

    // // 模拟管线运动动画，将两个素材图按比例合并，然后生成贴图texture
    // material = new THREE.MeshPhongMaterial({
    material = track(
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        // opacity: 0.99,
        side: THREE.DoubleSide,
        // alphaTest: 0.01, // 解决了贴图的透明部分显示为黑色
        // depthTest: false, // 深度检测
      })
    );
    /*  //尝试使用文本贴图
    material = new THREE.MeshBasicMaterial({
      /!*map: texture,
      transparent: true,
      // opacity: 0.1,
      color: conf.color,*!/
      color: 0x85a9a9,
      side: 200,
      map: texture,
      transparent: true,
      depthWrite: false,
      opacity: 1,
    });*/
  } else {
    material = track(
      new THREE.MeshPhongMaterial({
        color: conf.color,
        transparent: true,
        opacity: conf.opacity,
      })
    );
    material.depthWrite = false;
  }

  mesh = track(new THREE.Mesh(geometry, material));
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
  time *= 0.001;
  texture.offset.x = (time * 1) % 1; // 贴图运动速度
  texture.needsUpdate = true;

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
}*/

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
  ctx.fillStyle = "#dc3f3f";
  ctx.fillRect(0, 0, width, height);
  ctx.font = 50 + 'px "sans-serif';
  ctx.fillStyle = "#2891FF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  return canvas;
}

/**
 * 使用圆标记了管线的起始点
 * @param Point
 */
function createCircle(Point) {
  let endPoint = pointTransform(...Point);
  let radius = scene.userData.viewResolution;
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

function dispose(seconds = 0) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resMgr.dispose();
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.content = null;
      let gl = this.renderer.domElement.getContext("webgl");
      gl && gl.getExtension("WEBGL_lose_context").loseContext();
      console.log(this.renderer.info);
    }, seconds * 1000)
  );
}

function waitSeconds(seconds = 0) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
let count = 0;
async function iterativeScene() {
  for (;;) {
    count++;
    registerRenderer();

    await waitSeconds(3);

    resMgr.dispose();
    console.log(sceneAdd.renderer.info.memory);
    await waitSeconds(1);
    console.log(count);
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
