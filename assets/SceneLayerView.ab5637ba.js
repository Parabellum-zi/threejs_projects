import{al as D,m as _,U as C,dx as U,dy as L,D as o,E as d,J as S,M as O,hh as R,hi as k,aS as z,bw as v,hj as J,g9 as Q,gb as B,cD as G}from"./externalRenderers.e9b2a64d.js";import{n as q}from"./attributeUtils.a1b96ab7.js";const H={setAttribute(){},rollback(){},commit(){}};function re(t,r){const e=r.attributes[t.objectIdField],n=t.sessions.get(e);if(n)return n;const s=D(r.attributes),i=new Set;if(e==null)return H;const l=t.attributeOverrides.createInteractiveEditSession(e),c=new Map,g=(u,m)=>{const p=c.get(u);if(p==null){const f=m.indexOf(e);return c.set(u,f),f}return p};let a=0;const y={setAttribute(u,m){if(a!==0)return;const p=t.fieldsIndex.get(u);if(C(p))return;const f=t.attributeStorageInfo.findIndex(b=>b.name===p.name);if(f<0)return;l.set(f,m);const w=t.attributeStorageInfo[f];let x=!1;i.add(u),t.forEachNode((b,A)=>{const $=g(b,A);if($===-1)return;const I=t.getAttributeData(b.index);if(I){const N=I[w.name];N&&(N[$]=m,t.setAttributeData(b.index,I,r),x=!0)}}),x&&t.clearMemCache()},rollback(){if(a===0){for(const u of i)this.setAttribute(u,s[u]);l.rollback(),a=1,t.sessions.delete(e)}},commit(){a===0&&(l.commit(),a=2,t.sessions.delete(e))}};return t.sessions.set(e,y),y}function ne(t,r){const e=K(t,r);if(e.size===0)return;const n=new Map;for(let i=0;i<t.attributeStorageInfo.length;i++)n.set(t.attributeStorageInfo[i].name,i);let s=!1;e.forEach((i,l)=>{const c=t.getAttributeData(l);let g=!1;i.forEach((a,y)=>{const u=_(c)?c[y]:null,m=n.get(y);for(const{featureIndex:p,value:f,featureId:w}of a)u&&(u[p]=f,g=!0,s=!0),t.attributeOverrides.updateValue(w,m,f)}),g&&t.setAttributeData(l,c,null)}),s&&t.clearMemCache()}function K(t,r){const e=r.edits.updateFeatures;if(!e||e.length===0)return new j;const n=W(r),s=new j,i=new Map;for(let a=0;a<t.attributeStorageInfo.length;a++)i.set(t.attributeStorageInfo[a].name,a);const l=t.fieldsIndex,c=t.objectIdField,g=e.filter(a=>{const y=q(l,a.attributes,c);return n.has(y)});return t.forEachNode((a,y)=>{const u=new Set(y);for(const m of g){const p=q(l,m.attributes,c);if(!u.has(p))continue;const f=y.indexOf(p);for(const w in m.attributes){const x=t.fieldsIndex.normalizeFieldName(w),b=P(s,a.index,x),A=m.attributes[w];b.push({featureIndex:f,featureId:p,value:A})}}}),s}function P(t,r,e){const n=T(t,r),s=n.get(e);if(s)return s;const i=new Array;return n.set(e,i),i}function T(t,r){const e=t.get(r);if(e)return e;const n=new X;return t.set(r,n),n}function W(t){const r=new Set;if(!t.updatedFeatures)return r;for(const e of t.updatedFeatures)e.objectId!=null&&e.error==null&&r.add(e.objectId);return r}const X=Map,j=Map;function se(){return{requiredFields:{type:[String],readOnly:!0},availableFields:{type:[String],readOnly:!0,get:function(){const{layer:t,layer:{fieldsIndex:r},requiredFields:e}=this;return t.outFields?U(r,[...L(r,t.outFields),...e]):U(r,e)}}}}const M=t=>{let r=class extends t{constructor(){super(...arguments),this._numUpdating=0,this.asyncUpdateState=new Map}get updating(){return this._numUpdating>0}autoUpdateAsync(e,n){return Y(s=>this.updateAsync(e,s),n)}async updateAsync(e,n){if(!this.startAsyncUpdate(e)){try{const s=await n();this._set(e,s)}catch{O.getLogger(this.declaredClass).warn(`Async update of "${e}" failed. Async update functions should not throw exceptions.`)}this.endAsyncUpdate(e)&&this.updateAsync(e,n)}}startAsyncUpdate(e){var n;const s=(n=this.asyncUpdateState.get(e))!=null?n:0;return 1&s?(this.asyncUpdateState.set(e,2|s),!0):(++this._numUpdating,this.asyncUpdateState.set(e,1|s),!1)}endAsyncUpdate(e){var n;--this._numUpdating;const s=-2&((n=this.asyncUpdateState.get(e))!=null?n:0);return 2&s?(this.asyncUpdateState.set(e,-3&s),!0):(this.asyncUpdateState.set(e,s),!1)}};return o([d({readOnly:!0})],r.prototype,"updating",null),o([d()],r.prototype,"_numUpdating",void 0),r=o([S("esri.core.AsyncUpdate")],r),r};function Y(t,r){const e=()=>{i&&!l&&t(n)},n=()=>{if(!i||l)return r();i.clear(),l=!0;const c=R(i,r);return l=!1,c},s=()=>{i&&(i.destroy(),i=null)};let i=new k(e),l=!1;return t(n),{remove:s}}let V=class extends M(z){};V=o([S("esri.core.AsyncUpdate")],V);const Z=O.getLogger("esri.views.3d.layers.support.SceneLayerViewRequiredFields");let h=class extends M(J){constructor(t){super(t)}get requiredFields(){const{layerView:{layer:{fieldsIndex:t},definitionExpressionFields:r},rendererFields:e,labelingFields:n,viewFilterFields:s}=this;return U(t,[...v(r,[]),...v(e,[]),...v(n,[]),...v(s,[])])}initialize(){const t=this.layerView.layer;this.layer=t,this.handles.add([this.autoUpdateAsync("rendererFields",()=>{const{fieldsIndex:r,renderer:e}=this.layer;return e?E(n=>e.collectRequiredFields(n,r)):null}),this.autoUpdateAsync("labelingFields",()=>{const{layer:r}=this;return r.labelsVisible?E(e=>Q(e,r)):null}),this.autoUpdateAsync("viewFilterFields",()=>{const{layer:r,filter:e}=this.layerView;return E(n=>B(n,r,e))})])}};async function E(t){const r=new Set;try{return await t(r),Array.from(r).sort()}catch(e){return Z.error(e),null}}o([d()],h.prototype,"layerView",void 0),o([d()],h.prototype,"layer",void 0),o([d()],h.prototype,"requiredFields",null),o([d()],h.prototype,"rendererFields",void 0),o([d()],h.prototype,"labelingFields",void 0),o([d()],h.prototype,"viewFilterFields",void 0),h=o([S("esri.views.3d.layers.support.SceneLayerViewRequiredFields")],h);class F extends G{constructor(){super(...arguments),this.layer=null,this.filter=null}get availableFields(){return[]}get maximumNumberOfFeatures(){return 0}set maximumNumberOfFeatures(r){throw new Error("Not implemented")}get maximumNumberOfFeaturesExceeded(){return!1}highlight(r){throw new Error("Not implemented")}queryFeatures(r,e){throw new Error("Not implemented")}queryObjectIds(r,e){throw new Error("Not implemented")}queryFeatureCount(r,e){throw new Error("Not implemented")}createQuery(){throw new Error("Not implemented")}queryExtent(r,e){throw new Error("Not implemented")}}o([d()],F.prototype,"layer",void 0),o([d()],F.prototype,"availableFields",null),o([d()],F.prototype,"maximumNumberOfFeatures",null),o([d({readOnly:!0})],F.prototype,"maximumNumberOfFeaturesExceeded",null),o([d()],F.prototype,"filter",void 0);export{se as a,h as c,ne as i,F as o,re as s};
//# sourceMappingURL=SceneLayerView.ab5637ba.js.map