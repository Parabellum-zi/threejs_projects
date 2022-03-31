var D=Object.defineProperty,N=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var _=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable;var I=(t,e,s)=>e in t?D(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s,K=(t,e)=>{for(var s in e||(e={}))L.call(e,s)&&I(t,s,e[s]);if(_)for(var s of _(e))P.call(e,s)&&I(t,s,e[s]);return t},E=(t,e)=>N(t,G(e));import{D as V,J as q,b3 as z,m as H,l8 as U}from"./externalRenderers.e9b2a64d.js";import{o as J}from"./definitions.9156fef2.js";import{p as W,l as d}from"./tileUtils.206c045d.js";(()=>{if(!("document"in globalThis))return()=>null;const t=document.createElement("canvas"),e=t.getContext("2d"),s=512;return t.height=s,t.width=1,i=>{e.clearRect(0,0,1,t.height);const r=e.createLinearGradient(0,0,0,t.height);for(const{ratio:a,color:n}of i.colorStops)r.addColorStop(Math.max(a,.001),`rgba(${n[0]}, ${n[1]}, ${n[2]}, ${n[3]})`);return e.fillStyle=r,e.fillRect(0,0,1,t.height),e.getImageData(0,0,1,t.height).data}})();function Y(t,e,s,i){const{blurRadius:r,fieldOffset:a,field:n}=e,p=new Float64Array(s*i),y=B(r),h=Math.round(3*r);let c,u=Number.NEGATIVE_INFINITY;const m=Q(n,a),g=new Set;for(const b of t){const f=b.getCursor();for(;f.next();){const M=f.getObjectId();if(g.has(M))continue;g.add(M);const o=f.readLegacyPointGeometry(),x=128;if(o.x<-x||o.x>=s+x||o.y<-x||o.y>i+x)continue;const C=+m(f),k=Math.round(o.x)-h,F=Math.round(o.y)-h,O=Math.max(0,k),R=Math.max(0,F),$=Math.min(i,Math.round(o.y)+h),v=Math.min(s,Math.round(o.x)+h);for(let T=R;T<$;T++){const A=y[T-F];for(let w=O;w<v;w++){const j=y[w-k];c=p[T*s+w]+=A*j*C,c>u&&(u=c)}}}}return{matrix:p.buffer,max:u}}function B(t){const e=Math.round(3*t),s=2*t*t,i=new Float64Array(2*e+1);for(let r=0;r<=i.length;r++)i[r]=Math.exp(-((r-e)**2)/s)/Math.sqrt(2*Math.PI)*(t/2);return i}function Q(t,e){return t!=null?typeof e=="string"?s=>-1*+s.readAttribute(t):s=>+s.readAttribute(t)+e:s=>1}class l{constructor(e,s){this.offset=e,this.extent=s}}function X(t){const e=t.key,s=new Map,i=256,r=J,a=t.tileInfoView.tileInfo.isWrappable;return s.set(d(e,-1,-1,a).id,new l([-r,-r],[r-i,r-i,r,r])),s.set(d(e,0,-1,a).id,new l([0,-r],[0,r-i,r,r])),s.set(d(e,1,-1,a).id,new l([r,-r],[0,r-i,i,r])),s.set(d(e,-1,0,a).id,new l([-r,0],[r-i,0,r,r])),s.set(d(e,1,0,a).id,new l([r,0],[0,0,i,r])),s.set(d(e,-1,1,a).id,new l([-r,r],[r-i,0,r,i])),s.set(d(e,0,1,a).id,new l([0,r],[0,0,r,i])),s.set(d(e,1,1,a).id,new l([r,r],[0,0,i,i])),s}let S=class extends W{constructor(){super(...arguments),this.type="heatmap",this._tileKeyToFeatureSets=new Map}initialize(){this.handles.add([this.tileStore.on("update",this.onTileUpdate.bind(this))])}async update(t,e){const s=e.schema.processors[0];s.type==="heatmap"&&z(this._schema,s)&&(t.mesh=!0,this._schema=s)}onTileUpdate(t){for(const e of t.removed)this._tileKeyToFeatureSets.delete(e.key.id)}onTileClear(t){const e={clear:!0};return this._tileKeyToFeatureSets.delete(t.key.id),this.remoteClient.invoke("tileRenderer.onTileData",{tileKey:t.id,data:e})}async onTileMessage(t,e,s){this._tileKeyToFeatureSets.has(t.key.id)||this._tileKeyToFeatureSets.set(t.key.id,new Map);const i=this._tileKeyToFeatureSets.get(t.key.id);if(H(e.addOrUpdate)&&e.addOrUpdate.hasFeatures&&i.set(e.addOrUpdate.instance,e),e.end){const r=[],a=X(t);this._tileKeyToFeatureSets.forEach((h,c)=>{if(c===t.key.id)h.forEach(u=>U(u.addOrUpdate,m=>r.push(m)));else if(a.has(c)){const u=a.get(c),[m,g]=u.offset;h.forEach(b=>U(b.addOrUpdate,f=>{const M=f.transform(m,g,1,1);r.push(M)}))}});const n=Y(r,this._schema.mesh,512,512),p={tileKey:t.key.id,intensityInfo:n},y=[n.matrix];return this.remoteClient.invoke("tileRenderer.onTileData",p,E(K({},s),{transferList:y}))}}onTileError(t,e,s){return this.remoteClient.invoke("tileRenderer.onTileError",{tileKey:t.id,error:e},s)}};S=V([q("esri.views.2d.layers.features.processors.HeatmapProcessor")],S);const re=S;export{re as default};
//# sourceMappingURL=HeatmapProcessor.92656ed2.js.map