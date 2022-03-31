var k=Object.defineProperty,w=Object.defineProperties;var C=Object.getOwnPropertyDescriptors;var $=Object.getOwnPropertySymbols;var J=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var R=(r,e,s)=>e in r?k(r,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[e]=s,m=(r,e)=>{for(var s in e||(e={}))J.call(e,s)&&R(r,s,e[s]);if($)for(var s of $(e))x.call(e,s)&&R(r,s,e[s]);return r},g=(r,e)=>w(r,C(e));import{D as t,E as o,c0 as b,F as p,cA as O,aY as q,h as A,J as P,L as T,eL as E,k as I,m as L,lp as M,ft as D,C as G,lq as K}from"./externalRenderers.e9b2a64d.js";import{c as Q,a as V,u as c,d as Y,b as Z,p as z,o as H}from"./networkService.1b8cbace.js";import"./GPMessage.4a6a8123.js";function U(r){return r.features.map(e=>{const s=I.fromJSON(r.spatialReference),n=A.fromJSON(e);return L(n.geometry)&&(n.geometry.spatialReference=s),n})}function d(r){return E.fromJSON(r).features.map(e=>e.geometry)}let i=class extends T{constructor(r){super(r),this.directions=null,this.facilities=null,this.incidents=null,this.messages=null,this.pointBarriers=null,this.polylineBarriers=null,this.polygonBarriers=null,this.routes=null}readFacilities(r){return d(r)}readIncidents(r){return d(r)}readPointBarriers(r,e){return d(e.barriers)}readPolylineBarriers(r){return d(r)}readPolygonBarriers(r){return d(r)}readRoutes(r){return U(r)}};t([o({type:[Q]})],i.prototype,"directions",void 0),t([o({type:[b]})],i.prototype,"facilities",void 0),t([p("facilities")],i.prototype,"readFacilities",null),t([o({type:[b]})],i.prototype,"incidents",void 0),t([p("incidents")],i.prototype,"readIncidents",null),t([o({type:[V]})],i.prototype,"messages",void 0),t([o({type:[b]})],i.prototype,"pointBarriers",void 0),t([p("pointBarriers",["barriers"])],i.prototype,"readPointBarriers",null),t([o({type:[O]})],i.prototype,"polylineBarriers",void 0),t([p("polylineBarriers")],i.prototype,"readPolylineBarriers",null),t([o({type:[q]})],i.prototype,"polygonBarriers",void 0),t([p("polygonBarriers")],i.prototype,"readPolygonBarriers",null),t([o({type:[A]})],i.prototype,"routes",void 0),t([p("routes")],i.prototype,"readRoutes",null),i=t([P("esri.rest.support.ClosestFacilitySolveResult")],i);const W=i,X=H({accumulateAttributes:{name:"accumulateAttributeNames"},attributeParameterValues:!0,directionsTimeAttribute:{name:"directionsTimeAttributeName"},impedanceAttribute:{name:"impedanceAttributeName"},facilities:!0,incidents:!0,outSpatialReference:{name:"outSR",getter:r=>r.outSpatialReference.wkid},pointBarriers:{name:"barriers"},polylineBarriers:!0,polygonBarriers:!0,restrictionAttributes:{name:"restrictionAttributeNames"},returnPointBarriers:{name:"returnBarriers"},returnRoutes:{name:"returnCFRoutes"},travelMode:!0});async function _(r,e,s){const n=[],u=[],l={},y={},h=M(r),{path:v}=h;e.incidents&&e.incidents.features&&c(e.incidents.features,u,"incidents.features",l),e.facilities&&e.facilities.features&&c(e.facilities.features,u,"facilities.features",l),e.pointBarriers&&e.pointBarriers.features&&c(e.pointBarriers.features,u,"pointBarriers.features",l),e.polylineBarriers&&e.polylineBarriers.features&&c(e.polylineBarriers.features,u,"polylineBarriers.features",l),e.polygonBarriers&&e.polygonBarriers.features&&c(e.polygonBarriers.features,u,"polygonBarriers.features",l);const S=await D(u);for(const a in l){const f=l[a];n.push(a),y[a]=S.slice(f[0],f[1])}if(Y(y,n)){let a=null;try{a=await Z(v,e.apiKey,s)}catch{}a&&!a.hasZ&&z(y,n)}for(const a in y)y[a].forEach((f,F)=>{e.get(a)[F].geometry=f});const N=g(m({},s),{query:g(m(m({},h.query),X.toQueryParams(e)),{f:"json"})}),{data:j}=await G(`${v}/solveClosestFacility`,N);return W.fromJSON(j)}let B=class extends K{constructor(r){super(r),this.url=null}solve(r,e){return _(this.url,r,e)}};t([o()],B.prototype,"url",void 0),B=t([P("esri.tasks.ClosestFacilityTask")],B);const se=B;export{se as default};
//# sourceMappingURL=ClosestFacilityTask.3a4f8506.js.map