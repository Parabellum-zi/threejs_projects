import{D as a,E as l,J as c,ak as y,dD as b,dE as g}from"./externalRenderers.e9b2a64d.js";import{U as h,n as f}from"./BuildingComponentSublayer.5768c950.js";var t;const d={type:y,readOnly:!0,json:{origins:{service:{read:{source:"sublayers",reader:p}}},read:!1}};function p(e,o,n){if(e&&Array.isArray(e))return new y(e.map(s=>{const i=m(s);if(i){const u=new i;return u.read(s,n),u}n&&n.messages&&s&&n.messages.push(new b("building-scene-layer:unsupported-sublayer-type","Building scene sublayer of type '"+(s.type||"unknown")+"' are not supported",{definition:s,context:n}))}))}let r=t=class extends f{constructor(e){super(e),this.type="building-group",this.listMode="show",this.sublayers=null}loadAll(){return g(this,e=>t.forEachSublayer(this.sublayers,o=>{o.type!=="building-group"&&e(o)}))}};function m(e){return e.layerType==="group"?r:h}a([l({type:["hide","show","hide-children"],json:{write:!0}})],r.prototype,"listMode",void 0),a([l(d)],r.prototype,"sublayers",void 0),r=t=a([c("esri.layers.buildingSublayers.BuildingGroupSublayer")],r),function(e){function o(n,s){n.forEach(i=>{s(i),i.type==="building-group"&&o(i.sublayers,s)})}e.sublayersProperty=d,e.readSublayers=p,e.forEachSublayer=o}(r||(r={}));const E=r;export{E as d};
//# sourceMappingURL=BuildingGroupSublayer.4383660f.js.map