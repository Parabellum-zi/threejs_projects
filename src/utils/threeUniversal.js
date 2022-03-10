import * as THREE from "three";
import Proton from "three.proton.js";
let threeUniversal = {
  stats: {}, // FPS (plugin)
  texture: {},
  /**
   * 参考自 https://threejs.org/manual/#en/load-gltf
   * get model nodes tree
   * @param obj
   * @param lines
   * @param isLast
   * @param prefix
   * @returns {*[]}
   */
  dumpObject: function (obj, lines = [], isLast = true, prefix = "") {
    const localPrefix = isLast ? "└─" : "├─";
    lines.push(
      `${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${
        obj.type
      }]`
    );
    const newPrefix = prefix + (isLast ? "  " : "│ ");
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      this.dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  },
  /**
   * floor helper
   * @param scene
   */
  addFloor: function (scene) {
    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1100, 700),
      new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2; // 置于水平方向
    mesh.receiveShadow = true;
    scene.add(mesh);

    //添加地板割线
    let grid = new THREE.GridHelper(1100, 70, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);
  },
  /**
   * Access to click on the location of the 3d coordinate
   * @param event
   * @param data3D
   */
  getDocumentMouseDownCoord: function (event, data3D) {
    event.preventDefault();
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, data3D.camera);
    return raycaster.intersectObjects(data3D.scene.children, true);
  },
  /**
   *  creat pipeline
   *  https://threejs.org/docs/index.html?q=TubeGeometry#api/en/geometries/TubeGeometry
   */
  creatPipe: function (conf) {
    const path = this.createPath(conf.points);
    // console.log("..........", path);
    const geometry = new THREE.TubeGeometry(path, 100, conf.radius, 8, false);
    const textureLoader = new THREE.TextureLoader();
    let material;
    if (conf.texture !== undefined) {
      this.texture = textureLoader.load(conf.texture); // 图片贴图
      // texture = new THREE.CanvasTexture(getTextCanvas("➯ ➮ ➯")); // 文本贴图
      // 设置阵列模式为 RepeatWrapping
      this.texture.wrapS = THREE.RepeatWrapping;
      this.texture.wrapT = THREE.RepeatWrapping;
      // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
      // 等价texture.repeat= new THREE.Vector2(3,1)
      this.texture.repeat.set(5, 1);
      // texture.rotation = Math.PI;
      // 图片贴图
      // 模拟管线运动动画，将两个素材图按比例合并，然后生成贴图texture
      material = new THREE.MeshPhongMaterial({
        map: this.texture,
        transparent: true,
        depthTest: false, // 深度检测
      });

      //尝试使用文本贴图
      /*    material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
      color: conf.color,
    });*/
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

    return { texture: this.texture, mesh };
  },
  createPath: function (pointsArr) {
    pointsArr = pointsArr.map((point) => new THREE.Vector3(...point));
    // 利用CatmullRomCurve3 创建路径，不过是平滑的三维样条曲线
    return new THREE.CatmullRomCurve3(pointsArr);
  },
  /**
   * 粒子 喷泉
   * 调用
   *  import Proton from "three.proton.js";
   *  function addProton() {
    proton = new Proton();
    proton.addEmitter(this.createEmitter());
    proton.addRender(new Proton.SpriteRender(scene));
  },
   * @returns {Sprite}
   */
  createSprite: function () {
    let map = new THREE.TextureLoader().load("images/dot.png");
    let material = new THREE.SpriteMaterial({
      map: map,
      color: 0xff0000,
      blending: THREE.AdditiveBlending,
      fog: true,
    });
    return new THREE.Sprite(material);
  },
  createEmitter: function () {
    let emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(
      new Proton.Span(10, 15),
      new Proton.Span(0.05, 0.1)
    );
    emitter.addInitialize(new Proton.Body(this.createSprite()));
    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Life(1, 3));
    emitter.addInitialize(new Proton.Position(new Proton.SphereZone(20)));
    emitter.addInitialize(
      new Proton.V(new Proton.Span(500, 800), new Proton.Vector3D(0, 1, 0), 30)
    );
    emitter.addBehaviour(new Proton.RandomDrift(10, 10, 10, 0.05));
    //emitter.addBehaviour(new Proton.Alpha(1, 0.1));
    emitter.addBehaviour(new Proton.Scale(new Proton.Span(0.2, 3.5), 0));
    emitter.addBehaviour(new Proton.G(6));
    emitter.addBehaviour(
      new Proton.Color(
        "#25c7e5",
        ["#cdecec", "#ffff11"],
        Infinity,
        Proton.easeOutSine
      )
    );
    emitter.p.x = 0;
    emitter.p.y = -150;
    emitter.emit();
    return emitter;
  },
  /**
   * 创建天空盒
   */
  createSkybox: function (scene) {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath("images/skybox/");
    scene.background = cubeTextureLoader.load([
      "posx.jpg",
      "negx.jpg",
      "posy.jpg",
      "negy.jpg",
      "posz.jpg",
      "negz.jpg",
    ]);
  },
};

export default threeUniversal;
