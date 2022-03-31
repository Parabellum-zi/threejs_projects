<!--
@name:
@version:1.0
@description: https://discourse.threejs.org/t/profiledcontourgeometry/2330
@author: parabellum
@time: 2022-03-25 11:32:56
-->
<template>
  <div id="sceneContainer" ref="sceneContainer"></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Base3D from "../utils/base3D";
import threeUniversal from "../utils/threeUniversal";
import * as THREE from "three";
let data = reactive({
  base3d: {},
});

let sceneContainer = ref(null);

let profileShape = new THREE.Shape();
profileShape.absarc(0, 0, 5, 0, Math.PI * 2);

// 管线数组,每两个表示一个点
let tubeContour = [-40, 50, 0, 50, 50, 50, 50, 0];

var profileShape1 = new THREE.Shape();
// profileShape1.moveTo(0, 0);
// profileShape1.lineTo(0, 1);
profileShape1.absarc(1, 1, 0.5, Math.PI, Math.PI * 0.5);
// profileShape1.lineTo(1, 0);

var contour1 = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(1, 1),
  new THREE.Vector2(2, 1),
  new THREE.Vector2(2, 0),
  new THREE.Vector2(1, -1),
];

let contour = [
  new THREE.Vector2(-40, 50),
  new THREE.Vector2(0, 50),
  new THREE.Vector2(50, 50),
  new THREE.Vector2(50, 0),
  /*  new THREE.Vector3(-40, 50, 100),
  new THREE.Vector3(0, 50, 200),
  new THREE.Vector3(50, 50, 20),
  new THREE.Vector3(50, 0, 70),*/
];

onMounted(() => {
  data.base3d = new Base3D(sceneContainer.value);
  threeUniversal.addFloor(data.base3d.scene);
  handleContour();
});

/**
 *处理管线顶点
 */
function handleContour() {
  /* for (let i = 0; i < tubeContour.length; i += 2)
    contour.push(
      new THREE.Vector2(
        tubeContour.slice(i, i + 2)[0],
        tubeContour.slice(i, i + 2)[1]
      )
    );*/
  init();
}

function init() {
  let geometry1 = ProfiledContourGeometry(profileShape, contour, false, true);
  geometry1.rotateX(-Math.PI * 0.5);

  let fullProfile1 = new THREE.Mesh(
    geometry1,
    new THREE.MeshBasicMaterial({
      color: "aqua",
      opacity: 0.4,
      //   wireframe: true
      depthWrite: false,
      depthTest: false,
      transparent: true,
      side: THREE.DoubleSide,
    })
  );
  fullProfile1.position.set(-7, 1, -5);
  data.base3d.scene.add(fullProfile1);

  /*  let geometry2 = ProfiledContourGeometry(profileShape, contour, false, true);
  let fullProfile2 = new THREE.Mesh(
    geometry2,
    new THREE.MeshBasicMaterial({
      color: "yellow",
      wireframe: true, // 线框模式
    })
  );
  fullProfile2.position.set(90, 1, -5);
  // fullProfile2.position.set(-7, 1, -5);
  data.base3d.scene.add(fullProfile2);*/

  var geometry2 = ProfiledContourGeometry(profileShape1, contour1, false, true);
  // geometry2.rotateX(-Math.PI * 0.5);
  var fullProfile2 = new THREE.Mesh(
    geometry2,
    new THREE.MeshLambertMaterial({
      color: "red",
      wireframe: false,
    })
  );
  // data.base3d.scene.add(fullProfile2);
}

/**
 * 异形的Geometry
 * @param profileShape
 * @param contour
 * @param contourClosed
 * @param openEnded
 * @returns {BufferGeometry}
 * @constructor
 */
function ProfiledContourGeometry(
  profileShape,
  contour,
  contourClosed,
  openEnded
) {
  contourClosed = contourClosed !== undefined ? contourClosed : true;
  openEnded = openEnded !== undefined ? openEnded : false;
  openEnded = contourClosed === true ? false : openEnded;

  let profileGeometry = new THREE.ShapeBufferGeometry(profileShape);
  let flipProfileGeometry = flipShapeGeometry(profileGeometry);
  profileGeometry.rotateX(Math.PI * 0.5);
  let profile = profileGeometry.attributes.position;

  let addEnds = openEnded === false ? 2 : 0;
  let profilePoints = new Float32Array(
    profile.count * (contour.length + addEnds) * 3
  );

  let endProfiles = [];

  for (let i = 0; i < contour.length; i++) {
    let v1 = new THREE.Vector2().subVectors(
      contour[i - 1 < 0 ? contour.length - 1 : i - 1],
      contour[i]
    );
    let v2 = new THREE.Vector2().subVectors(
      contour[i + 1 === contour.length ? 0 : i + 1],
      contour[i]
    );

    /*   let v1 = new THREE.Vector3().subVectors(
      contour[i - 1 < 0 ? contour.length - 1 : i - 1],
      contour[i]
    );
    let v2 = new THREE.Vector3().subVectors(
      contour[i + 1 === contour.length ? 0 : i + 1],
      contour[i]
    );

    let angle = v2.angleTo(v1);
    console.log(angle);*/

    console.log(v2.angle(), v1.angle());
    let angle = v2.angle() - v1.angle();
    let halfAngle = angle * 0.5;

    let hA = halfAngle;
    let tA = v2.angle() + Math.PI * 0.5;
    if (!contourClosed) {
      if (i == 0 || i == contour.length - 1) {
        hA = Math.PI * 0.5;
      }
      if (i == contour.length - 1) {
        tA = v1.angle() - Math.PI * 0.5;
      }
    }

    let shift = Math.tan(hA - Math.PI * 0.5);
    let shiftMatrix = new THREE.Matrix4().set(
      1,
      0,
      0,
      0,
      -shift,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );

    let tempAngle = tA;
    let rotationMatrix = new THREE.Matrix4().set(
      Math.cos(tempAngle),
      -Math.sin(tempAngle),
      0,
      0,
      Math.sin(tempAngle),
      Math.cos(tempAngle),
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );

    let translationMatrix = new THREE.Matrix4().set(
      1,
      0,
      0,
      contour[i].x,
      0,
      1,
      0,
      contour[i].y,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );

    let cloneProfile = profile.clone();
    cloneProfile.applyMatrix4(shiftMatrix);
    cloneProfile.applyMatrix4(rotationMatrix);
    cloneProfile.applyMatrix4(translationMatrix);

    profilePoints.set(cloneProfile.array, cloneProfile.count * i * 3);
    if (openEnded === false && (i === 0 || i === contour.length - 1)) {
      endProfiles.push(cloneProfile);
    }
  }

  endProfiles.forEach((ep, idx) => {
    profilePoints.set(ep.array, ep.count * (contour.length + idx) * 3);
  });

  let fullProfileGeometry = new THREE.BufferGeometry();
  fullProfileGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(profilePoints, 3)
  );
  let index = [];

  let lastCorner =
    contourClosed === false ? contour.length - 1 : contour.length;
  for (let i = 0; i < lastCorner; i++) {
    for (let j = 0; j < profile.count; j++) {
      let currCorner = i;
      let nextCorner = i + 1 === contour.length ? 0 : i + 1;
      let currPoint = j;
      let nextPoint = j + 1 === profile.count ? 0 : j + 1;

      let a = nextPoint + profile.count * currCorner;
      let b = currPoint + profile.count * currCorner;
      let c = currPoint + profile.count * nextCorner;
      let d = nextPoint + profile.count * nextCorner;

      index.push(a, b, d);
      index.push(b, c, d);
    }
  }

  if (openEnded === false) {
    // add indices from profile geometries
    flipProfileGeometry.index.array.forEach((i) => {
      index.push(i + profile.count * contour.length);
    });
    profileGeometry.index.array.forEach((i) => {
      index.push(i + profile.count * (contour.length + 1));
    });
  }

  fullProfileGeometry.setIndex(index);
  fullProfileGeometry.computeVertexNormals();

  return fullProfileGeometry;
}

function flipShapeGeometry(shapeGeometry) {
  let flipGeom = shapeGeometry.clone();
  for (let i = 0; i < flipGeom.attributes.position.count; i++) {
    flipGeom.attributes.position.array[i * 3] *= -1;
  }
  flipGeom.attributes.position.needsUpdate = true;

  let index = flipGeom.index.array;
  for (let i = 0; i < index.length; i += 3) {
    let tmp = index[i + 1];
    let v3 = index[i + 2];
    index[i + 1] = index[i + 2];
    index[i + 2] = tmp;
  }
  flipGeom.computeVertexNormals();
  return flipGeom;
}
</script>

<style scoped></style>
