import{e as r}from"./centroid.53b8e72b.js";import{bm as o,bn as b}from"./externalRenderers.e9b2a64d.js";const s={getObjectId:t=>t.objectId,getAttributes:t=>t.attributes,getAttribute:(t,e)=>t.attributes[e],cloneWithGeometry:(t,e)=>new b(e,t.attributes,null,t.objectId),getGeometry:t=>t.geometry,getCentroid:(t,e)=>(t.centroid||(t.centroid=r(new o,t.geometry,e.hasZ,e.hasM)),t.centroid)};export{s as o};
//# sourceMappingURL=optimizedFeatureQueryEngineAdapter.a6522ddb.js.map
