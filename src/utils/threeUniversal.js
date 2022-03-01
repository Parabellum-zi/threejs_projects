import Stats from "three/examples/jsm/libs/stats.module";
import * as THREE from "three";
let threeUniversal = {
  stats: {}, // FPS (plugin)
  /**
   * 参考自 https://threejs.org/manual/#en/load-gltf
   * 获取模型中的所有节点及子节点
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
  //初始化性能插件
  initStats: function () {
    threeUniversal.stats = new Stats();
    document.body.appendChild(threeUniversal.stats.dom);
  },
  /**
   * 添加地板
   * @param scene
   */
  addFloor: function (scene) {
    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(500, 500),
      new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2; // 置于水平方向
    mesh.receiveShadow = true;
    scene.add(mesh);

    //添加地板割线
    let grid = new THREE.GridHelper(500, 50, 0x000000, 0x000000);
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
    let vector = new THREE.Vector3(); //三维坐标对象
    vector.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    vector.unproject(data3D.camera);
    let rayCaster = new THREE.Raycaster(
      data3D.camera.position,
      vector.sub(data3D.camera.position).normalize()
    );
    let intersects = rayCaster.intersectObjects(data3D.scene.children);
    if (intersects.length < 0) return;
    let selected = intersects[0]; //取第一个物体
    let { x, y, z } = selected.point;
    console.log("x: ", x, "y： ", y, "z:", z);
    return { x, y, z };
  },
};

export default threeUniversal;
