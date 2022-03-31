import{D as a,E as r,J as l,aS as u,aX as d,gA as c,bQ as p,aN as o,dH as h}from"./externalRenderers.e9b2a64d.js";const w=1.2;let n=class extends u{constructor(){super(...arguments),this.suspended=!1,this.extent=null,this.extentIntersectionDirty=!0,this._isVisibleBelowSurface=!1,this.handles=new d,this.layerView=null,this.updating=!0}setup(e){this.layerView=e,this.extentIntersection=new c({renderCoordsHelper:e.view.renderCoordsHelper});const t=e.view,i=t.basemapTerrain,s=t.resourceController.scheduler;this.handles.add([t.on("resize",()=>this.viewChange()),t.state.watch("camera",()=>this.viewChange(),!0),s.registerTask(p.FRUSTUM_VISIBILITY,this),i.on("elevation-bounds-change",()=>this.elevationBoundsChange())]),t.viewingMode==="local"?this.isVisibleBelowSurface=!0:this.handles.add([o(i,["opacity","wireframe"],()=>this.updateIsVisibleBelowSurface()),o(t,"map.ground.navigationConstraint.type",()=>this.updateIsVisibleBelowSurface())])}destroy(){this.layerView=null,this.extent=null,this.extentIntersection=null,this.handles&&(this.handles.destroy(),this.handles=null)}_setDirty(){this.updating||this._set("updating",!0)}setExtent(e){this.extent=e,this.extentIntersectionDirty=!0,this._setDirty()}viewChange(){this._setDirty()}elevationBoundsChange(){this._setDirty(),this.extentIntersectionDirty=!0}set isVisibleBelowSurface(e){this._isVisibleBelowSurface=e,this._setDirty(),this.extentIntersectionDirty=!0}updateIsVisibleBelowSurface(){const e=this.layerView.view,t=e.basemapTerrain,i=e.viewingMode==="local",s=e.map.ground&&e.map.ground.navigationConstraint&&e.map.ground.navigationConstraint.type==="none";this.isVisibleBelowSurface=i||!t.opaque||s}updateExtentIntersection(){if(!this.extentIntersectionDirty)return;this.extentIntersectionDirty=!1;const e=this.layerView.view;let t;if(this._isVisibleBelowSurface)t=-.3*h(e.spatialReference).radius;else{const{min:i,max:s}=e.basemapTerrain.elevationBounds;t=i-Math.max(1,(s-i)*(w-1))}this.extentIntersection.update(this.extent,e.spatialReference,t)}get running(){return this.updating}runTask(){if(this._set("updating",!1),!this.extent)return void this._set("suspended",!1);this.updateExtentIntersection();const e=this.layerView.view.frustum,t=h(this.layerView.view.spatialReference).radius;this._set("suspended",!this.extentIntersection.isVisibleInFrustum(e,t))}};a([r({readOnly:!0})],n.prototype,"suspended",void 0),a([r({readOnly:!0})],n.prototype,"updating",void 0),n=a([l("esri.views.3d.layers.graphics.Graphics3DFrustumVisibility")],n);const g=n;export{g as c};
//# sourceMappingURL=Graphics3DFrustumVisibility.7ef53e9f.js.map
