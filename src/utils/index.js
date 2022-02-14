/**
 * @Description:
 * @author parabellum
 * @date 2022/1/6
 */
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { reactive } from "vue";

let scene, bloomScene, camera, renderer;
let orbitControls = reactive({});
let threeMethods = {
  initThree: function (selector) {
    // 设置两个场景 scene 和 bloomScene，bloomScene 用来渲染需要加入辉光然后抗锯齿的场景，而 scene 不作任何处理，例如精灵文字，如果被抗锯齿处理会变模糊，所以不能做任何处理
    scene = new THREE.Scene();
    bloomScene = new THREE.Scene();

    // 设置背景图，三种类型：
    // 1. 普通背景图
    bloomScene.background = new THREE.Color("rgb(0, 0, 0)");
    // bloomScene.background = new THREE.TextureLoader().load('img/back.jpg');

    // 2. 天空盒
    // scene.background = new THREE.CubeTextureLoader()
    //             .setPath('images/')
    //             .load( [
    //                 'posx.jpg', 'negx.jpg', 'posy.jpg',
    //                 'negy.jpg', 'posz.jpg', 'negz.jpg'
    //             ] );

    // 3. 球型全景(背景)图，通过建立球体，并放大100倍实现，其中x放大倍数为负数
    // var geometry = new THREE.SphereGeometry(5, 32, 32);
    // var material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("img/back.jfif") });
    // var sphere = new THREE.Mesh(geometry, material);
    // scene.add(sphere);
    // geometry.scale(- 100, 100, 100);

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 90);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // alpha：背景透明，antialias：抗锯齿
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 兼容高清屏幕
    renderer.setPixelRatio(window.devicePixelRatio);
    // 消除canvas的外边框
    renderer.domElement.style.outline = "none";
    renderer.autoClear = false; // 要使用高级效果组合器MaskPass，必须设置为false
    // document.querySelector(selector).appendChild(renderer.domElement);
    selector.appendChild(renderer.domElement);

    // 设置背景色
    renderer.setClearColor(new THREE.Color("#21282a"), 1);
    // renderer.shadowMap.enabled = true; // 同意产生阴影，必须要有这个前提
    /**
     * 产生阴影4步：
     *  1. render 的 .shadowMap.enabled 设为 true，表示同意渲染器能产生阴影
     *  2. light 的 castShadow 设为 true，表示光源能产生阴影
     *  3. mesh 的 castShadow 设为 true，表示该物体能产生阴影
     *  4. 平面（物体） 的 receiveShadow 设为 true，表示该物体（一般是平面）能接受阴影
     */
    threeMethods.windowResize();
    // window.addEventListener("resize", threeMethods.windowResize, false);
    return { scene, bloomScene, camera, renderer };
  },
  windowResize: function () {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    window.addEventListener(
      "resize",
      () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      },
      false
    );
  },
  initLight: function () {
    const ambientLight = new THREE.AmbientLight(0x909090); // 自然光，每个几何体的每个面都有光
    const pointLight = new THREE.PointLight(0xffffd0, 1); // 点光源
    //pointLight.position.set(0, 50, 0);
    // pointLight.castShadow = true; // 使光源能产生阴影
    bloomScene.add(ambientLight);
    bloomScene.add(pointLight);

    const ambientLight2 = new THREE.AmbientLight(0x909090);
    const pointLight2 = new THREE.PointLight(0xffffd0, 1); // 点光源
    scene.add(ambientLight2);
    scene.add(pointLight);

    return [ambientLight, pointLight];
  },
  initControls: function () {
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true; // 惯性
    orbitControls.dampingFactor = 0.25; // 动态阻尼系数
    orbitControls.enableZoom = true; // 缩放
    orbitControls.enablePan = true; // 右键拖拽
    return orbitControls;
  },
  createTube: function (conf) {
    const path = threeMethods.createPath(conf.points);
    const geometry = new THREE.TubeGeometry(path, 100, conf.radius);
    const textureLoader = new THREE.TextureLoader();
    let material, texture;
    if (conf.texture !== undefined) {
      texture = textureLoader.load(conf.texture);
      // 设置阵列模式为 RepeatWrapping
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
      // 等价texture.repeat= new THREE.Vector2(3,1)
      texture.repeat.x = 3;

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
  },
  createPath: function (pointsArr) {
    pointsArr = pointsArr.map((point) => new THREE.Vector3(...point));
    // 利用CatmullRomCurve3 创建三维路径，不过是平滑的三维样条曲线
    return new THREE.CatmullRomCurve3(pointsArr);
  },
};
export default threeMethods;
