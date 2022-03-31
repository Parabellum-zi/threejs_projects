import{cC as p,cD as u,gF as g,e1 as v,m as h,cl as f,cF as c,cG as y,h as _,U as m,D as r,E as o,dC as x,J as T}from"./externalRenderers.e9b2a64d.js";import{$ as b}from"./I3SMeshView3D.fa1a32f2.js";import"./I3SAttributeOverrides.01b57fd6.js";import"./I3SUtil.2407c624.js";import"./I3SBinaryReader.aa8fb2d6.js";import"./SceneModification.1e20943b.js";import"./persistable.7ed992b0.js";import"./multiOriginJSONSupportUtils.f4e66410.js";import"./Graphics3DScaleVisibility.7e26574f.js";import"./optimizedFeatureQueryEngineAdapter.a6522ddb.js";import"./centroid.53b8e72b.js";import"./PooledRBush.ac4c3d7b.js";import"./quickselect.32614045.js";import"./SceneLayerWorker.5c0bb868.js";import"./attributeUtils.a1b96ab7.js";const S=.2;let i=class extends b(p(u)){constructor(){super(...arguments),this.type="integrated-mesh-3d",this.lodFactor=1,this._elevationContext="im",this._isIntegratedMesh=!0,this._supportsLabeling=!1,this.drapeTargetType=1,this._overlayTexOffset=g(-1,-1,-1,-1),this._overlayTexScale=v(),this._overlayColor=null,this._overlayHighlight=null,this._overlayNormal=null}get progressiveLoadFactor(){return this.lodFactor>=1?S:1}setDrapingTextures(e){this._clearDrapingTexture(0),this._clearDrapingTexture(1);for(const t of e){const s=t.index,a=t.extent,l=t.needsColorWithoutRasterImage?t.getValidTarget(1):t.hasDrapedFeatureSource?t.getValidTarget(0):null;if(h(l)&&f(a)>0){this._overlayTexOffset[2*s]=-a[0]/c(a),this._overlayTexOffset[2*s+1]=-a[1]/y(a),this._overlayTexScale[2*s]=1/c(a),this._overlayTexScale[2*s+1]=1/y(a);const n=t.getValidTarget(2),d=t.getValidTarget(3);this._overlayColor=l.getTexture(),this._overlayHighlight=n?n.getTexture():null,this._overlayNormal=d?d.getTexture():null}}this._forAllNodes(t=>h(t)&&this._collection.updateMaterial(t.objectHandle,s=>this._updateMaterialOverlay(s)))}_clearDrapingTexture(e){this._overlayTexOffset[2*e]=-1,this._overlayTexOffset[2*e+1]=-1,this._overlayTexScale[2*e]=0,this._overlayTexScale[2*e+1]=0,this._overlayColor=null,this._overlayHighlight=null,this._overlayNormal=null}_updateMaterialOverlay(e){e.overlayColor=this._overlayColor,e.overlayHighlight=this._overlayHighlight,e.overlayNormal=this._overlayNormal,e.overlayTexOffset=this._overlayTexOffset,e.overlayTexScale=this._overlayTexScale}initialize(){this.updatingHandles.add(this.layer,"modifications",()=>this._loadModifications(),2)}_createLayerGraphic(){const e=new _;return e.layer=this.layer,e.sourceLayer=this.layer,e}canResume(){return super.canResume()&&(!this._controller||this._controller.rootNodeVisible)}_loadModifications(){if(this.handles.remove("modifications"),m(this.layer.modifications))return void(this._modifications=[]);const e=this.layer.modifications;this.handles.add(this.updatingHandles.addOnCollectionChange(e,()=>this._modifications=e.toArray(),2),"modifications")}};r([o()],i.prototype,"layer",void 0),r([o({aliasOf:"layer"})],i.prototype,"i3slayer",void 0),r([o()],i.prototype,"suspended",void 0),r([o(x)],i.prototype,"updatingProgress",void 0),r([o({readOnly:!0,aliasOf:"_controller.updatingProgress"})],i.prototype,"updatingProgressValue",void 0),r([o({readOnly:!0,aliasOf:"view.qualitySettings.sceneService.integratedMesh.lodFactor"})],i.prototype,"lodFactor",void 0),r([o({readOnly:!0})],i.prototype,"progressiveLoadFactor",null),i=r([T("esri.views.3d.layers.SceneLayerView3D")],i);const U=i;export{U as default};
//# sourceMappingURL=IntegratedMeshLayerView3D.611812fe.js.map
