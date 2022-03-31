import{du as O,m as h,D as d,E as _,J as R,dG as C,j9 as P,U as c,bS as E,ja as M,hH as j,bY as f,g_ as b,g$ as v,jb as G,iC as g,e$ as w,jc as x,jd as D,je as $,jf as H,bC as m}from"./externalRenderers.e9b2a64d.js";const V=y=>{let e=class extends O(y){constructor(){super(...arguments),this.parent=null}get updating(){return!1}get visible(){const s=!h(this.parent)||this.parent.visible&&!this.parent.suspended;return this.analysis.visible&&s}};return d([_({readOnly:!0})],e.prototype,"type",void 0),d([_({constructOnly:!0})],e.prototype,"analysis",void 0),d([_({constructOnly:!0})],e.prototype,"parent",void 0),d([_({constructOnly:!0})],e.prototype,"view",void 0),d([_({readOnly:!0})],e.prototype,"updating",null),d([_({readOnly:!0})],e.prototype,"visible",null),e=d([R("esri.views.3d.analysis.AnalysisView3D")],e),e};class F{constructor(e){this._attached=!1,this._resourcesCreated=!1,this._visible=!0,this.view=e,this.view.watch("ready",s=>{this._resourcesCreated&&(s?this._createResources():this._destroyResources())})}applyProps(e){let s=!1;for(const t in e)t in this?t==="attached"?s=e[t]:this[t]=e[t]:console.error("Cannot set unknown property",t);this.attached=s}destroy(){this.attached=!1}get attached(){return this._attached}set attached(e){e!==this._attached&&this.view._stage&&(this._attached=e,this._attached&&!this._resourcesCreated?this._createResources():!this._attached&&this._resourcesCreated&&this._destroyResources())}get visible(){return this._visible}set visible(e){e!==this._visible&&(this._visible=e,this.attached&&this.updateVisibility(e))}_createResources(){this.createResources(),this._resourcesCreated=!0,this.visible||this.updateVisibility(!1)}_destroyResources(){this.destroyResources(),this._resourcesCreated=!1}}class W extends F{constructor(e){super(e.view),this._resources=null,this._transform=C()}get object(){return h(this._resources)?this._resources.object:null}get transform(){return this._transform}set transform(e){P(this._transform,e),h(this._resources)&&(this._resources.object.transformation=this._transform)}recreate(){this.attached&&this.createResources()}recreateGeometry(){if(c(this._resources))return;const e=this._resources.object,s=this.view._stage;s.removeMany(e.geometries),e.removeAllGeometries(),this.createGeometries(e),this.visible||e.setVisible(this.visible),s.addMany(e.geometries)}createResources(){this.destroyResources();const e=this.view._stage;if(!e)return;const s=new E({isPickable:!1,updatePolicy:1});e.add(s);const t=new M({castShadow:!1});t.transformation=this._transform,this.createExternalResources(),this.createGeometries(t),e.addMany(t.geometries),this.forEachExternalMaterial(r=>e.add(r)),e.add(t),s.add(t),this.visible||t.setVisible(!1),this._resources={layer:s,object:t}}destroyResources(){const e=this.view._stage;!c(this._resources)&&e&&(e.remove(this._resources.object),e.remove(this._resources.layer),this.forEachExternalMaterial(s=>{e.remove(s),s.dispose()}),e.removeMany(this._resources.object.geometries),this._resources.object.dispose(),this.destroyExternalResources(),this._resources=null)}updateVisibility(e){c(this._resources)||this._resources.object.setVisible(e)}}class A extends W{constructor(e){super(e),this._renderOccluded=4,this._width=1,this._color=j(1,0,1,1),this._innerWidth=1,this._innerColor=null,this._stipplePattern=null,this._stippleOffColor=null,this._stipplePreferContinuous=!0,this._writeDepthEnabled=!0,this._falloff=0,this._polygonOffset=!1,this.applyProps(e)}setGeometryFromRenderSpacePoint(e){const s=1e3,t=[];t.push([[e[0]-s,e[1]+0,e[2]+0],[e[0]+s,e[1]+0,e[2]+0]]),t.push([[e[0]-0,e[1]-s,e[2]+0],[e[0]+0,e[1]+s,e[2]+0]]),t.push([[e[0]-0,e[1]+0,e[2]-s],[e[0]+0,e[1]+0,e[2]+s]]),this.geometry=t}setGeometryFromExtent(e){const s=this.view.spatialReference,t=m(),r=m(),o=100,i=[];f(t,e[0],e[1],o),this.view.renderCoordsHelper.toRenderCoords(t,s,r),i.push([r[0],r[1],r[2]]),f(t,e[2],e[1],o),this.view.renderCoordsHelper.toRenderCoords(t,s,r),i.push([r[0],r[1],r[2]]),f(t,e[2],e[3],o),this.view.renderCoordsHelper.toRenderCoords(t,s,r),i.push([r[0],r[1],r[2]]),f(t,e[0],e[3],o),this.view.renderCoordsHelper.toRenderCoords(t,s,r),i.push([r[0],r[1],r[2]]),f(t,e[0],e[1],o),this.view.renderCoordsHelper.toRenderCoords(t,s,r),i.push([r[0],r[1],r[2]]),f(t,e[0],e[1],o),this.view.renderCoordsHelper.toRenderCoords(t,s,r),i.push([r[0],r[1],r[2]]),this.geometry=[i]}setGeometryFromFrustum(e){const s=[];e.lines.forEach(t=>{s.push([t.origin[0],t.origin[1],t.origin[2]]),s.push([t.endpoint[0],t.endpoint[1],t.endpoint[2]])}),this.geometry=[s]}setGeometryFromBoundedPlane(e){const s=[],t=e.origin,r=e.basis1,o=e.basis2,i=.5,n=m(),a=m(),p=m(),u=m();n[0]=t[0]-r[0]*i-o[0]*i,n[1]=t[1]-r[1]*i-o[1]*i,n[2]=t[2]-r[2]*i-o[2]*i,a[0]=t[0]-r[0]*i+o[0]*i,a[1]=t[1]-r[1]*i+o[1]*i,a[2]=t[2]-r[2]*i+o[2]*i,p[0]=t[0]+r[0]*i+o[0]*i,p[1]=t[1]+r[1]*i+o[1]*i,p[2]=t[2]+r[2]*i+o[2]*i,u[0]=t[0]+r[0]*i-o[0]*i,u[1]=t[1]+r[1]*i-o[1]*i,u[2]=t[2]+r[2]*i-o[2]*i,s.push([n[0],n[1],n[2]]),s.push([a[0],a[1],a[2]]),s.push([p[0],p[1],p[2]]),s.push([u[0],u[1],u[2]]),s.push([n[0],n[1],n[2]]),this.geometry=[s]}setGeometryFromSegment(e){const s=e.endRenderSpace;b(l),v(l,l,s),this.transform=l;const{points:t}=e.createRenderGeometry(s,this.view.renderCoordsHelper);this.geometry=[t]}setGeometryFromSegments(e,s=G){b(l),v(l,l,s),this.transform=l,this.geometry=e.map(t=>t.createRenderGeometry(s,this.view.renderCoordsHelper).points)}get renderOccluded(){return this._renderOccluded}set renderOccluded(e){e!==this._renderOccluded&&(this._renderOccluded=e,this._updateMaterial())}get geometry(){return this._geometry}set geometry(e){this._geometry=e,this.recreateGeometry()}get width(){return this._width}set width(e){e!==this._width&&(this._width=e,this._updateMaterial())}get color(){return this._color}set color(e){g(e,this._color)||(w(this._color,e),this._updateMaterial())}get innerWidth(){return this._innerWidth}set innerWidth(e){e!==this._innerWidth&&(this._innerWidth=e,this._updateMaterial())}get innerColor(){return this._innerColor}set innerColor(e){h(e)?!c(this._innerColor)&&g(e,this._innerColor)||(this._innerColor=w(x(),e),this._updateMaterial()):h(this._innerColor)&&(this._innerColor=null,this._updateMaterial())}get stipplePattern(){return this._stipplePattern}set stipplePattern(e){const s=h(e)!==h(this._stipplePattern);this._stipplePattern=e,s?this.recreate():this._updateMaterial()}get stippleOffColor(){return this._stippleOffColor}set stippleOffColor(e){(c(e)||c(this._stippleOffColor)||!g(e,this._stippleOffColor))&&(this._stippleOffColor=h(e)?D(e):null,this._updateMaterial())}get stipplePreferContinuous(){return this._stipplePreferContinuous}set stipplePreferContinuous(e){this._stipplePreferContinuous!==e&&(this._stipplePreferContinuous=e,this._updateMaterial())}get writeDepthEnabled(){return this._writeDepthEnabled}set writeDepthEnabled(e){this._writeDepthEnabled!==e&&(this._writeDepthEnabled=e,this._updateMaterial())}get falloff(){return this._falloff}set falloff(e){e!==this._falloff&&(this._falloff=e,this._updateMaterial())}get polygonOffset(){return this._polygonOffset}set polygonOffset(e){e!==this._polygonOffset&&(this._polygonOffset=e,this._updateMaterial())}createExternalResources(){this._material=new $(this.materialParameters)}destroyExternalResources(){this._material=null}createGeometries(e){const s=this._createLineGeometries();if(s.length!==0)for(let t=0;t<s.length;++t){const r=H(s[t]);e.addGeometry(r,this._material)}}forEachExternalMaterial(e){e(this._material)}get materialParameters(){return{width:this._width,color:this._color,stippleOffColor:this._stippleOffColor,stipplePattern:this._stipplePattern,stipplePreferContinuous:this._stipplePreferContinuous,isClosed:!1,falloff:this._falloff,innerColor:this._innerColor,innerWidth:this._innerWidth,polygonOffset:this._polygonOffset,renderOccluded:this._renderOccluded,writeDepth:this._writeDepthEnabled}}_updateMaterial(){this.attached&&this._material.setParameters(this.materialParameters)}_createLineGeometries(){const e=this.geometry;if(c(e)||e.length===0)return[];const s=[];return e.forEach(t=>{const r=t.length,o=new Float64Array(3*r);t.forEach((n,a)=>{o[3*a+0]=n[0],o[3*a+1]=n[1],o[3*a+2]=n[2]});const i={overlayInfo:null,attributeData:{position:o},removeDuplicateStartEnd:0};s.push(i)}),s}}const l=C();export{W as c,A as m,V as p,F as t};
//# sourceMappingURL=LineVisualElement.09142ed4.js.map
