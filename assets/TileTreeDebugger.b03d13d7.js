import{D as r,E as c,J as M,aS as P,aZ as j,h as S,m as d,a_ as L,a$ as O,b0 as A,b1 as $,U as k,b2 as x}from"./externalRenderers.e9b2a64d.js";const E=[[0,179,255],[117,62,128],[0,104,255],[215,189,166],[32,0,193],[98,162,206],[102,112,129],[52,125,0],[142,118,246],[138,83,0],[92,122,255],[122,55,83],[0,142,255],[81,40,179],[0,200,244],[13,24,127],[0,170,147],[19,58,241],[22,44,35]];let a=class extends P{constructor(s){super(s),this.updating=!1,this.enablePolygons=!0,this.enableLabels=!0,this._polygons=new Map,this._labels=new Map,this._enabled=!0}initialize(){this._symbols=E.map(s=>new j({color:[s[0],s[1],s[2],.6],outline:{color:"black",width:1}})),this.update()}destroy(){this._enabled=!1,this.clear()}get enabled(){return this._enabled}set enabled(s){this._enabled!==s&&(this._enabled=s,this.update())}update(){if(!this._enabled)return void this.clear();const s=e=>{if(d(e.label))return e.label;let o=e.lij.toString();return d(e.loadPriority)&&(o+=` (${e.loadPriority})`),o},n=this.getTiles(),h=new Array,g=new Set((this._labels.size,this._labels.keys()));n.forEach((e,o)=>{const t=e.lij.toString();g.delete(t);const z=e.lij[0],p=e.geometry;if(this.enablePolygons&&!this._polygons.has(t)){const i=new S({geometry:p,symbol:this._symbols[z%this._symbols.length]});this._polygons.set(t,i),h.push(i)}if(this.enableLabels){const i=s(e),_=o/(n.length-1),y=x(0,200,_),u=x(20,6,_)/.75,w=d(e.loadPriority)&&e.loadPriority>=n.length,m=new L([y,w?0:y,w?0:y]),v=this.view.type==="3d"?()=>new O({verticalOffset:{screenLength:40/.75},callout:{type:"line",color:"white",border:{color:"black"}},symbolLayers:[new A({text:i,halo:{color:"white",size:1/.75},material:{color:m},size:u})]}):()=>new $({text:i,haloColor:"white",haloSize:1/.75,color:m,size:u});if(this._labels.has(t)){const l=this._labels.get(t),f=v();(k(l.symbol)||JSON.stringify(f)!==JSON.stringify(l.symbol))&&(l.symbol=f)}else{const l=new S({geometry:p.extent.center,symbol:v()});this._labels.set(t,l),h.push(l)}}});const b=new Array;g.forEach(e=>{this._polygons.has(e)&&(b.push(this._polygons.get(e)),this._polygons.delete(e)),this._labels.has(e)&&(b.push(this._labels.get(e)),this._labels.delete(e))}),this.view.graphics.removeMany(b),this.view.graphics.addMany(h)}clear(){this.view.graphics.removeMany(Array.from(this._polygons.values())),this.view.graphics.removeMany(Array.from(this._labels.values())),this._polygons.clear(),this._labels.clear()}};r([c({constructOnly:!0})],a.prototype,"view",void 0),r([c({readOnly:!0})],a.prototype,"updating",void 0),r([c()],a.prototype,"enabled",null),a=r([M("esri.views.support.TileTreeDebugger")],a);export{a as b};
//# sourceMappingURL=TileTreeDebugger.b03d13d7.js.map
