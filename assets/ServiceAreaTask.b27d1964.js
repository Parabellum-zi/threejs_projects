var x=Object.defineProperty,J=Object.defineProperties;var q=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var S=(r,e,a)=>e in r?x(r,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[e]=a,d=(r,e)=>{for(var a in e||(e={}))F.call(e,a)&&S(r,a,e[a]);if(h)for(var a of h(e))O.call(e,a)&&S(r,a,e[a]);return r},g=(r,e)=>J(r,q(e));import{D as t,E as o,c0 as $,F as p,cA as E,aY as G,h as v,J as b,L as I,lG as M,m as C,fu as D,k as K,c8 as L,lp as Q,ft as T,C as V,lq as Y}from"./externalRenderers.e9b2a64d.js";import{a as Z,u as B,d as z,b as H,p as U,o as W}from"./networkService.1b8cbace.js";import"./GPMessage.4a6a8123.js";function R(r){return r.features.map(e=>{const a=K.fromJSON(r.spatialReference),l=v.fromJSON(e);return L(l.geometry).spatialReference=a,l})}function f(r){return M(r.features.map(e=>(C(e.geometry)&&(e.geometry.spatialReference=r.spatialReference),D(e.geometry))))}let s=class extends I{constructor(r){super(r),this.facilities=null,this.messages=null,this.pointBarriers=null,this.polylineBarriers=null,this.polygonBarriers=null,this.serviceAreaPolylines=null,this.serviceAreaPolygons=null}readFacilities(r){return f(r)}readPointBarriers(r,e){return f(e.barriers)}readPolylineBarriers(r){return f(r)}readPolygonBarriers(r){return f(r)}readIncidents(r,e){return R(e.saPolylines)}readServiceAreaPolygons(r,e){return R(e.saPolygons)}};t([o({type:[$]})],s.prototype,"facilities",void 0),t([p("facilities")],s.prototype,"readFacilities",null),t([o({type:[Z]})],s.prototype,"messages",void 0),t([o({type:[$]})],s.prototype,"pointBarriers",void 0),t([p("pointBarriers",["barriers"])],s.prototype,"readPointBarriers",null),t([o({type:[E]})],s.prototype,"polylineBarriers",void 0),t([p("polylineBarriers")],s.prototype,"readPolylineBarriers",null),t([o({type:[G]})],s.prototype,"polygonBarriers",void 0),t([p("polygonBarriers")],s.prototype,"readPolygonBarriers",null),t([o({type:[v]})],s.prototype,"serviceAreaPolylines",void 0),t([p("serviceAreaPolylines",["saPolylines"])],s.prototype,"readIncidents",null),t([o({type:[v]})],s.prototype,"serviceAreaPolygons",void 0),t([p("serviceAreaPolygons",["saPolygons"])],s.prototype,"readServiceAreaPolygons",null),s=t([b("esri.rest.support.ServiceAreaSolveResult")],s);const X=s,_=W({accumulateAttributes:{name:"accumulateAttributeNames"},attributeParameterValues:!0,defaultBreaks:!0,facilities:!0,outSpatialReference:{name:"outSR",getter:r=>r.outSpatialReference.wkid},pointBarriers:{name:"barriers"},polylineBarriers:!0,polygonBarriers:!0,restrictionAttributes:{name:"restrictionAttributeNames"},returnPointBarriers:{name:"returnBarriers"},travelMode:!0});async function ee(r,e,a){const l=[],u=[],n={},c={},P=Q(r),{path:A}=P;e.facilities&&e.facilities.features&&B(e.facilities.features,u,"facilities.features",n),e.pointBarriers&&e.pointBarriers.features&&B(e.pointBarriers.features,u,"pointBarriers.features",n),e.polylineBarriers&&e.polylineBarriers.features&&B(e.polylineBarriers.features,u,"polylineBarriers.features",n),e.polygonBarriers&&e.polygonBarriers.features&&B(e.polygonBarriers.features,u,"polygonBarriers.features",n);const j=await T(u);for(const i in n){const y=n[i];l.push(i),c[i]=j.slice(y[0],y[1])}if(z(c,l)){let i=null;try{i=await H(A,e.apiKey,a)}catch{}i&&!i.hasZ&&U(c,l)}for(const i in c)c[i].forEach((y,N)=>{e.get(i)[N].geometry=y});const k=g(d({},a),{query:g(d(d({},P.query),_.toQueryParams(e)),{f:"json"})}),{data:w}=await V(`${A}/solveServiceArea`,k);return X.fromJSON(w)}let m=class extends Y{constructor(r){super(r),this.url=null}solve(r,e){return ee(this.url,r,e)}};t([o()],m.prototype,"url",void 0),m=t([b("esri.tasks.ServiceAreaTask")],m);const ie=m;export{ie as default};
//# sourceMappingURL=ServiceAreaTask.b27d1964.js.map
