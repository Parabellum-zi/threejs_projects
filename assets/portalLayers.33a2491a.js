var h=Object.defineProperty,I=Object.defineProperties;var g=Object.getOwnPropertyDescriptors;var y=Object.getOwnPropertySymbols;var v=Object.prototype.hasOwnProperty,w=Object.prototype.propertyIsEnumerable;var m=(e,r,a)=>r in e?h(e,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[r]=a,l=(e,r)=>{for(var a in r||(r={}))v.call(r,a)&&m(e,a,r[a]);if(y)for(var a of y(r))w.call(r,a)&&m(e,a,r[a]);return e},p=(e,r)=>I(e,g(r));import{aF as f,v as T}from"./externalRenderers.e9b2a64d.js";import{a as M}from"./lazyLayerLoader.f7d1e15c.js";import{m as j,h as u,f as P,n as c}from"./layersLoader.d6fd5259.js";function d(e,r){return!!e.typeKeywords&&e.typeKeywords.indexOf(r)>-1}function b(e){return!e.portalItem||e.portalItem instanceof f||(e=p(l({},e),{portalItem:new f(e.portalItem)})),F(e.portalItem).then(r=>{const a=l({portalItem:e.portalItem},r.properties),n=r.constructor;return Promise.resolve(new n(a))})}function F(e){return e.load().then(L).then(x)}function L(e){switch(e.type){case"Map Service":return C(e);case"Feature Service":return K(e);case"Feature Collection":return $(e);case"Scene Service":return O(e);case"Image Service":return G(e);case"Stream Service":return W();case"Vector Tile Service":return D();case"KML":return A();case"WFS":return B();case"WMTS":return _();case"WMS":return V();case"Feed":return k();default:return Promise.reject(new T("portal:unknown-item-type","Unknown item type '${type}'",{type:e.type}))}}function x(e){return(0,M[e.className])().then(r=>({constructor:r,properties:e.properties}))}function C(e){return R(e).then(r=>r?{className:"TileLayer"}:{className:"MapImageLayer"})}function K(e){return S(e).then(r=>{if(typeof r=="object"){const a={};return r.id!=null&&(a.layerId=r.id),{className:"FeatureLayer",properties:a}}return{className:"GroupLayer"}})}function O(e){return S(e).then(r=>{if(typeof r=="object"){const a={};let n;if(r.id!=null?(a.layerId=r.id,n=`${e.url}/layers/${r.id}`):n=e.url,Array.isArray(e.typeKeywords)&&e.typeKeywords.length>0){const t={IntegratedMesh:"IntegratedMeshLayer","3DObject":"SceneLayer",Point:"SceneLayer",PointCloud:"PointCloudLayer",Building:"BuildingSceneLayer"};for(const s of Object.keys(t))if(e.typeKeywords.indexOf(s)!==-1)return{className:t[s]}}return c(n).then(t=>{let s="SceneLayer";const o={Point:"SceneLayer","3DObject":"SceneLayer",IntegratedMesh:"IntegratedMeshLayer",PointCloud:"PointCloudLayer",Building:"BuildingSceneLayer"};return t&&t.layerType&&o[t.layerType]&&(s=o[t.layerType]),{className:s,properties:a}})}return r===!1?c(e.url).then(a=>(a==null?void 0:a.layerType)==="Voxel"?{className:"VoxelLayer"}:{className:"GroupLayer"}):{className:"GroupLayer"}})}async function $(e){if(await e.load(),d(e,"Map Notes"))return{className:"MapNotesLayer"};if(d(e,"Route Layer"))return{className:"RouteLayer"};const r=await e.fetchData();return u(r)===1?{className:"FeatureLayer"}:{className:"GroupLayer"}}async function G(e){var r,a,n;await e.load();const t=(r=(a=e.typeKeywords)==null?void 0:a.map(N=>N.toLowerCase()))!=null?r:[];if(t.indexOf("elevation 3d layer")>-1)return{className:"ElevationLayer"};if(t.indexOf("tiled imagery")>-1)return{className:"ImageryTileLayer"};const s=await e.fetchData(),o=s==null?void 0:s.layerType;return o==="ArcGISTiledImageServiceLayer"?{className:"ImageryTileLayer"}:o==="ArcGISImageServiceLayer"?{className:"ImageryLayer"}:((n=(await c(e.url)).cacheType)==null?void 0:n.toLowerCase())==="map"?{className:"ImageryTileLayer"}:{className:"ImageryLayer"}}function W(){return{className:"StreamLayer"}}function D(){return{className:"VectorTileLayer"}}function A(){return{className:"KMLLayer"}}function B(){return{className:"WFSLayer"}}function V(){return{className:"WMSLayer"}}function _(){return{className:"WMTSLayer"}}function k(){return{className:"StreamLayer"}}function R(e){return c(e.url).then(r=>r.tileInfo)}function S(e){return!e.url||e.url.match(/\/\d+$/)?Promise.resolve({}):e.load().then(()=>e.fetchData()).then(async r=>e.type==="Feature Service"?i(r=await j(r,e.url)):u(r)>0?i(r):c(e.url).then(i))}function i(e){return u(e)===1&&{id:P(e)}}var H=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",fromItem:b,selectLayerClassPath:L});export{L as i,H as p,d as t};
//# sourceMappingURL=portalLayers.33a2491a.js.map
