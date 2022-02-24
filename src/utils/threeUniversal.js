import Stats from "three/examples/jsm/libs/stats.module";
import * as THREE from "three";
let threeUniversal = {
  stats: {}, // FPS
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
  addFloor: function (scene) {
    // 地板
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
};

export default threeUniversal;
