import{D as i,E as s,J as a,v as l}from"./externalRenderers.e9b2a64d.js";import{x as c}from"./FeatureLayerViewBase3D.43031691.js";import"./EventedSet.704c17ce.js";import"./Graphics3DFeatureLikeLayerView.83b247dd.js";import"./Graphics3DScaleVisibility.7e26574f.js";import"./optimizedFeatureQueryEngineAdapter.a6522ddb.js";import"./centroid.53b8e72b.js";import"./PooledRBush.ac4c3d7b.js";import"./quickselect.32614045.js";import"./Graphics3DObjectStates.eeb6b24b.js";import"./QueryEngine.50048692.js";import"./WhereClause.380e1eaf.js";import"./json.2d0d6862.js";import"./QueryEngineCapabilities.83e56447.js";import"./utils.c680b0de.js";import"./ClassBreaksDefinition.669c5a5e.js";import"./floorFilterUtils.1acb5b5d.js";import"./Graphics3DFrustumVisibility.7ef53e9f.js";import"./attributeUtils.a1b96ab7.js";import"./projectExtentUtils.30ddc74f.js";import"./popupUtils.b610e8fc.js";import"./RefreshableLayerView.c7d5f29e.js";const n=o=>{let e=class extends o{initialize(){const{layer:t,view:p}=this;t.source.supportsSpatialReference(p.spatialReference)||this.addResolvingPromise(Promise.reject(new l("layerview:spatial-reference-incompatible","The spatial references supported by this OGC layer are incompatible with the spatial reference of the view",{layer:t})))}get availableFields(){return this.layer.fieldsIndex.fields.map(t=>t.name)}};return i([s()],e.prototype,"layer",void 0),i([s({readOnly:!0})],e.prototype,"availableFields",null),e=i([a("esri.views.layers.OGCFeatureLayerView")],e),e};let r=class extends n(c){constructor(){super(...arguments),this.type="ogc-feature-3d"}};i([s()],r.prototype,"layer",void 0),r=i([a("esri.views.3d.layers.OGCFeatureLayerView3D")],r);const U=r;export{U as default};
//# sourceMappingURL=OGCFeatureLayerView3D.9802f056.js.map
