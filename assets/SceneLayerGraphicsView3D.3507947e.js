var W=Object.defineProperty;var M=Object.getOwnPropertySymbols;var Z=Object.prototype.hasOwnProperty,J=Object.prototype.propertyIsEnumerable;var $=(e,t,r)=>t in e?W(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,P=(e,t)=>{for(var r in t||(t={}))Z.call(t,r)&&$(e,r,t[r]);if(M)for(var r of M(t))J.call(t,r)&&$(e,r,t[r]);return e};import{eg as X,M as Y,cC as ee,aN as te,cU as G,hk as re,bQ as ie,b4 as f,b5 as se,gt as ae,m as d,gu as oe,U as V,hl as ne,ci as R,dW as de,bZ as le,hm as he,b_ as ue,h as j,ef as U,c8 as ce,gj as pe,fa as ge,S as L,D as n,E as l,dA as me,dC as ye,J as fe,bC as be,cf as _e}from"./externalRenderers.e9b2a64d.js";import{s as ve,f as Ee,K as xe}from"./I3SAttributeOverrides.01b57fd6.js";import{v as Ce,p as Ie}from"./Graphics3DFeatureLikeLayerView.83b247dd.js";import{o as De,c as we,s as Se,i as Ae,a as Fe}from"./SceneLayerView.ab5637ba.js";import{S as Oe,X as Ne,i as Te,c as je}from"./I3SUtil.2407c624.js";import{p as Ge}from"./DefinitionExpressionSceneLayerView.064deaf4.js";import{c as Ve}from"./PopupSceneLayerView.efff3797.js";import"./I3SBinaryReader.aa8fb2d6.js";import"./Graphics3DScaleVisibility.7e26574f.js";import"./optimizedFeatureQueryEngineAdapter.a6522ddb.js";import"./centroid.53b8e72b.js";import"./PooledRBush.ac4c3d7b.js";import"./quickselect.32614045.js";import"./Graphics3DObjectStates.eeb6b24b.js";import"./QueryEngine.50048692.js";import"./WhereClause.380e1eaf.js";import"./json.2d0d6862.js";import"./QueryEngineCapabilities.83e56447.js";import"./utils.c680b0de.js";import"./ClassBreaksDefinition.669c5a5e.js";import"./floorFilterUtils.1acb5b5d.js";import"./Graphics3DFrustumVisibility.7ef53e9f.js";import"./attributeUtils.a1b96ab7.js";import"./popupUtils.b610e8fc.js";class H extends X{constructor(t){super("SceneLayerWorker","dracoDecompressPointCloudData",t,{hasInitialize:!0})}getTransferList(t){return[t.geometryBuffer]}}const O=Y.getLogger("esri.views.3d.layers.SceneLayerGraphicsView3D"),q=Fe();let a=class extends Ge(Ve(ee(De))){constructor(){super(...arguments),this.type="scene-layer-graphics-3d",this._nodesAddedToStage=new Map,this.drapeSourceType=1,this._queryEngine=null,this._memCache=null,this._interactiveEditingSessions=new Map,this.loadedGraphics=new ve,this.holeFilling="always",this.progressiveLoadFactor=1,this.supportsHeightUnitConversion=!0,this._coordinatesOutsideExtentErrors=0,this._maxCoordinatesOutsideExtentErrors=20}initialize(){var e,t;const r=this.layer;this.addResolvingPromise(r.indexInfo),this._attributeOverrides=new Ee(this.layer,(e=this.view.resourceController)==null?void 0:e.memoryController),Oe(r,this.view.spatialReference,this.view.viewingMode),this.fieldsHelper=new we({layerView:this}),this.updatingHandles.add(r,"rangeInfos",i=>this._rangeInfosChanged(i),2),this.updatingHandles.add(r,"renderer",(i,s)=>this._rendererChange(i,s)),this.updatingHandles.add(this,"parsedDefinitionExpression",()=>this._filterChange()),this.updatingHandles.add(this,"view.floors",()=>this.graphics3d.filterVisibility.filterChanged()),this.handles.add(te(G,"I3S_TREE_SHOW_TILES",i=>{if(i&&!this._treeDebugger){const s=this._controller.crsIndex;import("./I3STreeDebugger.7d34dd88.js").then(({I3STreeDebugger:o})=>{!this._treeDebugger&&G.I3S_TREE_SHOW_TILES&&(this._treeDebugger=new o({lv:this,view:this.view,nodeSR:s}))})}else i||!this._treeDebugger||G.I3S_TREE_SHOW_TILES||(this._treeDebugger.destroy(),this._treeDebugger=null)})),this._set("graphics3d",new Ce({owner:this,layer:r,preferredUpdatePolicy:0,scaleVisibilityEnabled:!0,filterVisibilityEnabled:!0,timeExtentVisibilityEnabled:!1,frustumVisibilityEnabled:!1,elevationAlignmentEnabled:!0,elevationFeatureExpressionEnabled:!1,suspendResumeExtentMode:"data",dataExtent:r.fullExtent,updateClippingExtent:i=>this._updateClippingExtent(i)})),(t=this.graphics3d.elevationAlignment)==null||t.events.on("invalidate-elevation",i=>this._invalidateElevation(i)),this.supportsHeightUnitConversion&&(this._verticalScale=re("point",r.spatialReference,this.view.spatialReference)),this.addResolvingPromise(this.graphics3d.setup()),this._memCache=this.view.resourceController.memoryController.newCache(r.uid),this._controller=new xe({layerView:this,scaleVisibilityEnabled:!1}),Ne(this.layer.geometryDefinitions)&&(this._worker=new H(i=>this.view.resourceController.schedule(i))),this.handles.add(this.layer.on("apply-edits",i=>this.updatingHandles.addPromise(i.result))),this.handles.add(this.layer.on("edits",i=>this._handleEdits(i))),this.when(()=>{this._queryEngine=new Ie({layerView:this,priority:ie.FEATURE_QUERY_ENGINE}),this.updatingHandles.add(this,"maximumNumberOfFeatures",i=>this._controller.featureTarget=i,2),this.updatingHandles.add(this,"suspended",i=>{i&&this._removeAllNodeData()})})}destroy(){this._treeDebugger=f(this._treeDebugger),this._attributeOverrides=f(this._attributeOverrides),this._set("graphics3d",f(this.graphics3d)),this._controller=f(this._controller),this._queryEngine=f(this._queryEngine),this._worker=f(this._worker),this._memCache=f(this._memCache),this._nodesAddedToStage.clear(),this.fieldsHelper=f(this.fieldsHelper)}get requiredFields(){var e,t;return(e=(t=this.fieldsHelper)==null?void 0:t.requiredFields)!=null?e:[]}get maximumNumberOfFeatures(){const e=this.graphics3d&&this.graphics3d.graphicsCore&&this.graphics3d.graphicsCore.displayFeatureLimit;return e?e.maximumNumberOfFeatures:0}set maximumNumberOfFeatures(e){e!=null?(this._override("maximumNumberOfFeatures",e),this._controller.fixedFeatureTarget=!0):(this._clearOverride("maximumNumberOfFeatures"),this._controller.fixedFeatureTarget=!1)}get maximumNumberOfFeaturesExceeded(){return!this.suspended&&!!this._controller&&!this._controller.leavesReached}get hasM(){return!1}get hasZ(){return!0}notifyGraphicGeometryChanged(e){this.graphics3d.graphicsCore.notifyGraphicGeometryChanged(e)}notifyGraphicVisibilityChanged(e){this.graphics3d.graphicsCore.notifyGraphicVisibilityChanged(e)}async whenGraphicAttributes(e,t){return Te(this.layer,e,this._getObjectIdField(),t,()=>[...this._nodesAddedToStage.values()])}getGraphicFromGraphicUid(e){if(!this.loadedGraphics)return null;const t=se(this.loadedGraphics.find(i=>i.uid===e),this.layer),r=this._getObjectIdField();return t&&t.attributes&&t.attributes[r]?(t.layer=this.layer,t.sourceLayer=this.layer,t):null}whenGraphicBounds(e,t){return this.graphics3d.graphicsCore.whenGraphicBounds(e,t)}computeAttachmentOrigin(e,t){return this.graphics3d.graphicsCore.computeAttachmentOrigin(e,t)}canResume(){return super.canResume()&&(!this._controller||this._controller.rootNodeVisible)}isUpdating(){var e,t,r;return!!((e=this._controller)!=null&&e.updating||(t=this.graphics3d)!=null&&t.updating||(r=this.fieldsHelper)!=null&&r.updating)}getRenderingInfo(e,t,r){const i=ae(e,{renderer:t,arcade:r});if(d(i)&&i.color){const s=i.color;s[0]=s[0]/255,s[1]=s[1]/255,s[2]=s[2]/255}return i}async getRenderingInfoAsync(e,t,r,i){return oe(e,P({renderer:t,arcade:r},i))}get symbolUpdateType(){return this.graphics3d.graphicsCore.symbolUpdateType}highlight(e){return this.graphics3d.highlight(e,this.layer.objectIdField)}get updatePolicy(){return this.graphics3d.graphicsCore.effectiveUpdatePolicy}createInteractiveEditSession(e){return Se(this.attributeEditingContext,e)}async extractBinaryPointData(e,t){const r={geometryBuffer:e.geometryBuffer};return V(this._worker)&&(this._worker=new H(i=>this.view.resourceController.schedule(i))),this._worker.invoke(r,t).then(i=>{if(d(i))return{positionData:i.positions,featureIds:i.featureIds};throw new Error("Failed to decompress Draco point data")})}checkExtent(e,t){e&&!ne(e,t)&&(this._coordinatesOutsideExtentErrors<this._maxCoordinatesOutsideExtentErrors&&O.error("Service Error: Coordinates outside of layer extent"),this._coordinatesOutsideExtentErrors+1===this._maxCoordinatesOutsideExtentErrors&&O.error("Maximum number of errors reached. Further errors are ignored."),this._coordinatesOutsideExtentErrors++)}async addNode(e,t,r){if(!k(t)&&!Q(t))return Promise.reject();if(this._nodesAddedToStage.has(e.index))return void O.error("I3S node "+e.id+" already added");const i=d(this.layer.fullExtent)?Re(this.layer.fullExtent.clone(),.5):null,s=this._controller.crsVertex,o=[],h={graphics:null,featureIds:null,attributeInfo:t.attributeDataInfo,node:e};if(k(t)?await this._addNodeBinaryPointData(e,h,t,i,o,r):Q(t)&&this._addNodeLegacyPointData(e,h,t,i,o),await this._attributeOverrides.apply(h.featureIds,t.attributeDataInfo,r),e.numFeatures=h.graphics.length,this._updateNodeMemory(e),B(h),o.length>0&&(this.computeObb(e,o,s),this._controller.updateVisibility(e.index)),!this._controller.isGeometryVisible(e))return this._cacheNodeData(h),Promise.resolve();if(d(this._verticalScale))for(const p of h.graphics)this._verticalScale(p.geometry);return this._nodesAddedToStage.set(e.index,h),this.loadedGraphics.addMany(h.graphics),this._filterNode(h),this._treeDebugger&&this._treeDebugger.update(),Promise.resolve()}computeObb(e,t,r){const i=this._controller.crsIndex,s=i.isGeographic?this.view.renderSpatialReference:i;R(t,r,0,t,s,0,t.length/3);const o={data:t,size:3};e.serviceObb=de(o),i.isGeographic&&le(e.serviceObb.center,s,e.serviceObb.center,i)}isNodeLoaded(e){return this._nodesAddedToStage.has(e)}isNodeReloading(){return!1}updateNodeState(){}async _addNodeBinaryPointData(e,t,r,i,s,o){const h=await this.extractBinaryPointData(r,o);if(h==null)return Promise.reject();const p=this._getObjectIdField(),_=this._controller.crsVertex,w=this.view.spatialReference,S=this.graphics3d.graphicsCore,{positionData:g,featureIds:I}=h,v=3,A=g.length/v,m=new Array;for(let E=0;E<A;E++){const N=d(e.serviceObb)?e.serviceObb.center:[0,0,0],x=E*v,u=he(g[x+0],g[x+1],g[x+2]);ue(u,u,N),e.serviceObb||s.push(u[0],u[1],u[2]),d(i)&&this.checkExtent(i,u);const C=I[E],T={};C!=null&&(T[p]=C);const F=C==null?j.generateUID():C;R(u,_,0,b,w,0,1);const y=U(b[0],b[1],b[2],w),D=this.loadedGraphics.get(F);if(d(D))D.level<e.level&&(c.property="geometry",c.graphic=D,c.oldValue=ce(D.geometry),c.newValue=y,D.geometry=y,S.graphicUpdateHandler(c)),m.push(D);else{const K=j.generateUID();m.push({objectId:F,uid:K,geometry:y,attributes:T,visible:!0,level:e.level})}}t.graphics=m,t.featureIds=I}_addNodeLegacyPointData(e,t,r,i,s){const o=this._getObjectIdField(),h=this._controller.crsVertex,p=this.view.spatialReference,_=[0,0,0],w=new Array,S=new Array;for(const g of r.pointData){const I=g.featureDataPosition,v=I.length,A=g.geometries&&g.geometries[0]||Me[v],m=g.featureIds[0];if(A.params.type!=="points")continue;d(i)&&this.checkExtent(i,I);const E={};m!=null&&(E[o]=m);const N=m==null?j.generateUID():m;let x;A.type==="Embedded"&&(x=A.params.vertexAttributes.position);for(let u=0;u<x.length;u+=v){for(let y=0;y<v;y++)_[y]=I[y]+x[u+y];const C=v===3;e.serviceObb||s.push(_[0],_[1],C?_[2]:0),R(_,h,0,b,p,0,1);const T=U(b[0],b[1],C?b[2]:void 0,p),F=this.loadedGraphics.get(N);d(F)?S.push(F):S.push({objectId:N,uid:j.generateUID(),geometry:T,attributes:E,visible:!0})}w.push(m)}t.graphics=S,t.featureIds=w}_updateNodeMemory(e){e.memory=4096+(d(e.numFeatures)?e.numFeatures*this.graphics3d.graphicsCore.usedMemoryPerGraphic:0)}_cacheNodeData(e){const t=e.graphics.reduce((r,i)=>pe(i)+r,512+8*e.featureIds.length+1024);this._memCache.put(this._getMemCacheKey(e.node),e,t)}_getMemCacheKey(e){return`${e.index}`}_removeAllNodeData(){this._nodesAddedToStage.forEach(e=>{if(e){const t=e.node;this._updateNodeMemory(t),this._cacheNodeData(e)}}),this._nodesAddedToStage.clear(),this._treeDebugger&&this._treeDebugger.update(),this.loadedGraphics.clear()}removeNode(e){const t=this._removeNodeStageData(e);t&&(this._updateNodeMemory(t.node),this._cacheNodeData(t))}_removeNodeStageData(e){const t=this._nodesAddedToStage.get(e);return t?(this.loadedGraphics.removeMany(t.graphics),this._nodesAddedToStage.delete(e),this._treeDebugger&&this._treeDebugger.update(),t):null}async loadCachedNodeData(e){return this._memCache.pop(this._getMemCacheKey(e))}async addCachedNodeData(e,t,r,i){if(!this._nodesAddedToStage.has(e.index))return this.loadedGraphics.addMany(t.graphics),this._nodesAddedToStage.set(e.index,t),this._updateNodeMemory(e),await this.updateAttributes(e.index,r,i),this._filterNode(t),this._treeDebugger&&this._treeDebugger.update(),Promise.resolve();O.error("I3S node "+e.id+" already added")}getLoadedNodeIds(){const e=[];return this._nodesAddedToStage.forEach(t=>e.push(t.node.id)),e.sort()}getVisibleNodes(){const e=new Array;return this._nodesAddedToStage.forEach(t=>e.push(t.node)),e}getLoadedNodeIndices(e){this._nodesAddedToStage.forEach((t,r)=>e.push(r))}getLoadedAttributes(e){const t=this._nodesAddedToStage.get(e);if(t&&d(t.attributeInfo))return t.attributeInfo.loadedAttributes}getAttributeData(e){const t=this._nodesAddedToStage.get(e);if(t&&d(t.attributeInfo))return t.attributeInfo.attributeData}setAttributeData(e,t){const r=this._nodesAddedToStage.get(e);r&&!V(r.attributeInfo)&&(r.attributeInfo.attributeData=t,this._attributeValuesChanged(r))}async updateAttributes(e,t,r){const i=this._nodesAddedToStage.get(e);i&&(await this._attributeOverrides.apply(i.featureIds,t,r),i.attributeInfo=t,this._attributeValuesChanged(i))}_attributeValuesChanged(e){if(B(e),this._filterNode(e),this.graphics3d.graphicsCore.labelsEnabled){const t=e.graphics.map(r=>r.uid);this.graphics3d.graphicsCore.updateLabelingInfo(t)}}_updateClippingExtent(e){return this._controller&&this._controller.updateClippingArea(e),!1}_getObjectIdField(){return this.layer.objectIdField||"OBJECTID"}async _rendererChange(e,t){const{layer:{fieldsIndex:r}}=this,i=new Set;let s,o;e?(await e.collectRequiredFields(i,r),s=Array.from(i).sort()):s=[],i.clear(),t?(await t.collectRequiredFields(i,r),o=Array.from(i).sort()):o=[],s.length===o.length&&s.every((h,p)=>s[p]===o[p])||this._reloadAllNodes()}_rangeInfosChanged(e){e!=null&&e.length>0&&O.warn("Unsupported property: rangeInfos are currently only serialized to and from web scenes but do not affect rendering.")}_filterChange(){this._nodesAddedToStage.forEach(e=>this._filterNode(e))}_reloadAllNodes(){this._removeAllNodeData(),this._controller&&this._controller.restartNodeLoading()}_filterNode(e){const t=this.parsedDefinitionExpression;for(const r of e.graphics){const i=r.visible;r.visible=!t||this._evaluateClause(t,r),i!==r.visible&&(c.graphic=r,c.property="visible",c.oldValue=i,c.newValue=r.visible,this.graphics3d.graphicsCore.graphicUpdateHandler(c))}}_invalidateElevation(e){const t=this._controller.crsIndex;ge(e.extent,e.spatialReference,z,t),this._controller.updateElevationChanged(z,t)}createQuery(){const e={outFields:["*"],returnGeometry:!0,outSpatialReference:this.view.spatialReference};return d(this.filter)?this.filter.createQuery(e):new L(e)}queryFeatures(e,t){return this._queryEngine.executeQuery(this._ensureQuery(e),t==null?void 0:t.signal)}queryObjectIds(e,t){return this._queryEngine.executeQueryForIds(this._ensureQuery(e),t==null?void 0:t.signal)}queryFeatureCount(e,t){return this._queryEngine.executeQueryForCount(this._ensureQuery(e),t==null?void 0:t.signal)}queryExtent(e,t){return this._queryEngine.executeQueryForExtent(this._ensureQuery(e),t==null?void 0:t.signal)}_ensureQuery(e){return this._addDefinitionExpressionToQuery(V(e)?this.createQuery():L.from(e))}getUsedMemory(){const e=this.graphics3d&&this.graphics3d.graphicsCore;return e?e.usedMemory:0}getUnloadedMemory(){const e=this.graphics3d&&this.graphics3d.graphicsCore;return .8*((this._controller?this._controller.unloadedMemoryEstimate:0)+(e?e.unprocessedMemoryEstimate:0))}ignoresMemoryFactor(){return this._controller&&this._controller.fixedFeatureTarget}_handleEdits(e){Ae(this.attributeEditingContext,e)}get attributeEditingContext(){const e=this._getObjectIdField();return{sessions:this._interactiveEditingSessions,fieldsIndex:this.layer.fieldsIndex,objectIdField:e,forEachNode:t=>this._nodesAddedToStage.forEach(r=>t(r.node,r.featureIds)),attributeStorageInfo:this.i3slayer.attributeStorageInfo,attributeOverrides:this._attributeOverrides,getAttributeData:t=>this.getAttributeData(t),setAttributeData:(t,r,i)=>{this.setAttributeData(t,r);const s=this._nodesAddedToStage.get(t);if(d(i)){const o=this.loadedGraphics.get(i.attributes[e]);d(o)&&this.graphics3d.graphicsCore.recreateGraphics([o])}else d(s)&&this.graphics3d.graphicsCore.recreateGraphics(s.graphics)},clearMemCache:()=>{}}}get performanceInfo(){const e={displayedNumberOfFeatures:this.loadedGraphics.length,maximumNumberOfFeatures:this.maximumNumberOfFeatures,totalNumberOfFeatures:-1,nodes:this._nodesAddedToStage.size,core:this.graphics3d.graphicsCore.performanceInfo};return this._controller&&this._controller.updateStats(e),e}get test(){return{controller:this._controller,numNodes:this._nodesAddedToStage.size,numFeatures:this.loadedGraphics.length}}};n([l()],a.prototype,"graphics3d",void 0),n([l({type:me})],a.prototype,"filter",void 0),n([l()],a.prototype,"loadedGraphics",void 0),n([l({aliasOf:"layer"})],a.prototype,"i3slayer",void 0),n([l()],a.prototype,"_controller",void 0),n([l()],a.prototype,"updating",void 0),n([l()],a.prototype,"suspended",void 0),n([l()],a.prototype,"holeFilling",void 0),n([l(ye)],a.prototype,"updatingProgress",void 0),n([l({aliasOf:"_controller.updatingProgress"})],a.prototype,"updatingProgressValue",void 0),n([l(q.requiredFields)],a.prototype,"requiredFields",null),n([l(q.availableFields)],a.prototype,"availableFields",void 0),n([l()],a.prototype,"fieldsHelper",void 0),n([l({type:Number})],a.prototype,"maximumNumberOfFeatures",null),n([l({readOnly:!0})],a.prototype,"maximumNumberOfFeaturesExceeded",null),n([l({readOnly:!0,aliasOf:"view.qualitySettings.sceneService.point.lodFactor"})],a.prototype,"lodFactor",void 0),n([l({readOnly:!0})],a.prototype,"hasM",null),n([l({readOnly:!0})],a.prototype,"hasZ",null),a=n([fe("esri.views.3d.layers.SceneLayerGraphicsView3D")],a);const lt=a;function Q(e){return"pointData"in e}function k(e){return"geometryBuffer"in e&&e.geometryBuffer!==null}function B(e){const t=e.attributeInfo;for(let r=0;r<e.graphics.length;r++){const i=e.graphics[r];if(i.attributes||(i.attributes={}),d(t)&&d(t.loadedAttributes))for(const{name:s}of t.loadedAttributes)t.attributeData[s]&&(i.attributes[s]=je(t.attributeData[s],r))}}function Re(e,t){return e.xmin-=t,e.ymin-=t,e.xmax+=t,e.ymax+=t,e.hasZ&&(e.zmin-=t,e.zmax+=t),e.hasM&&(e.mmin-=t,e.mmax+=t),e}const Me={2:{type:"Embedded",params:{type:"points",vertexAttributes:{position:[0,0]}}},3:{type:"Embedded",params:{type:"points",vertexAttributes:{position:[0,0,0]}}}},b=be(),c={graphic:null,property:null,oldValue:null,newValue:null},z=_e();export{lt as default};
//# sourceMappingURL=SceneLayerGraphicsView3D.3507947e.js.map
