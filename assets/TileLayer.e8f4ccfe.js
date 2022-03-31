var b=Object.defineProperty,T=Object.defineProperties;var w=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var v=(e,r,t)=>r in e?b(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,n=(e,r)=>{for(var t in r||(r={}))O.call(r,t)&&v(e,t,r[t]);if(f)for(var t of f(r))$.call(r,t)&&v(e,t,r[t]);return e},h=(e,r)=>T(e,w(r));import{i as R,d as j,e as C,w as U,p as W,l as A,f as D,n as I,g as L,o as P,m as _,q as N,k as g,O as k,C as y,t as B,v as u,z as M,A as J,B as G,N as q,D as a,E as o,F as x,G as E,H as K,I as V,J as F,K as z}from"./externalRenderers.e9b2a64d.js";import{s as H}from"./ArcGISCachedService.fa9643d7.js";import{f as X,y as Q,K as Y}from"./SublayersOwner.a1e4d946.js";import"./TilemapCache.f41a8639.js";import"./floorFilterUtils.1acb5b5d.js";import"./sublayerUtils.5227ee88.js";const m=["Canvas/World_Dark_Gray_Base","Canvas/World_Dark_Gray_Reference","Canvas/World_Light_Gray_Base","Canvas/World_Light_Gray_Reference","Elevation/World_Hillshade","Elevation/World_Hillshade_Dark","Ocean/World_Ocean_Base","Ocean/World_Ocean_Reference","Ocean_Basemap","Reference/World_Boundaries_and_Places","Reference/World_Boundaries_and_Places_Alternate","Reference/World_Transportation","World_Imagery","World_Street_Map","World_Topo_Map"];let s=class extends R(X(j(C(U(H(Q(W(A(D(I(L(P(z))))))))))))){constructor(...e){super(...e),this.listMode="show",this.isReference=null,this.operationalLayerType="ArcGISTiledMapServiceLayer",this.resampling=!0,this.sourceJSON=null,this.spatialReference=null,this.path=null,this.sublayers=null,this.type="tile",this.url=null}normalizeCtorArgs(e,r){return typeof e=="string"?n({url:e},r):e}load(e){const r=_(e)?e.signal:null;return this.addResolvingPromise(this.loadFromPortal({supportedTypes:["Map Service"]},e).catch(N).then(()=>this._fetchService(r))),Promise.resolve(this)}get attributionDataUrl(){var e;const r=(e=this.parsedUrl)==null?void 0:e.path.toLowerCase();return r&&this._getDefaultAttribution(this._getMapName(r))}readSpatialReference(e,r){return(e=e||r.tileInfo&&r.tileInfo.spatialReference)&&g.fromJSON(e)}writeSublayers(e,r,t,i){if(!this.loaded||!e)return;const c=e.slice().reverse().flatten(({sublayers:p})=>p&&p.toArray().reverse()).toArray(),l=[],d=n({writeSublayerStructure:!1},i);c.forEach(p=>{const S=p.write({},d);l.push(S)}),l.some(p=>Object.keys(p).length>1)&&(r.layers=l)}get tileServers(){return this._getDefaultTileServers(this.parsedUrl.path)}castTileServers(e){return Array.isArray(e)?e.map(r=>k(r).path):null}fetchTile(e,r,t,i={}){const{signal:c}=i,l=this.getTileUrl(e,r,t),d={responseType:"image",signal:c,query:n({},this.refreshParameters)};return y(l,d).then(p=>p.data)}getTileUrl(e,r,t){const i=!this.tilemapCache&&this.supportsBlankTile,c=B(h(n(h(n({},this.parsedUrl.query),{blankTile:!i&&null}),this.customParameters),{token:this.apiKey})),l=this.tileServers;return`${l&&l.length?l[r%l.length]:this.parsedUrl.path}/tile/${e}/${r}/${t}${c?"?"+c:""}`}_fetchService(e){return new Promise((r,t)=>{if(this.sourceJSON){if(this.sourceJSON.bandCount!=null&&this.sourceJSON.pixelSizeX!=null)throw new u("tile-layer:unsupported-url","use ImageryTileLayer to open a tiled image service");return void r({data:this.sourceJSON})}if(!this.parsedUrl)throw new u("tile-layer:undefined-url","layer's url is not defined");const i=M(this.parsedUrl.path);if(_(i)&&i.serverType==="ImageServer")throw new u("tile-layer:unsupported-url","use ImageryTileLayer to open a tiled image service");y(this.parsedUrl.path,{query:h(n(n({f:"json"},this.parsedUrl.query),this.customParameters),{token:this.apiKey}),responseType:"json",signal:e}).then(r,t)}).then(r=>{if(r.ssl&&(this.url=this.url.replace(/^http:/i,"https:")),this.sourceJSON=r.data,this.read(r.data,{origin:"service",url:this.parsedUrl}),this.version===10.1&&!J(this.url))return this._fetchServerVersion(this.url,e).then(t=>{this.read({currentVersion:t})}).catch(()=>{})})}_fetchServerVersion(e,r){if(!G(e))return Promise.reject();const t=e.replace(/(.*\/rest)\/.*/i,"$1")+"/info";return y(t,{query:h(n({f:"json"},this.customParameters),{token:this.apiKey}),responseType:"json",signal:r}).then(i=>{if(i.data&&i.data.currentVersion)return i.data.currentVersion;throw new u("tile-layer:version-not-available")})}_getMapName(e){const r=e.match(/^(?:https?:)?\/\/(server\.arcgisonline\.com|services\.arcgisonline\.com|ibasemaps-api\.arcgis\.com)\/arcgis\/rest\/services\/([^\/]+(\/[^\/]+)*)\/mapserver/i);return r&&r[2]}_getDefaultAttribution(e){if(!e)return;let r;e=e.toLowerCase();for(let t=0,i=m.length;t<i;t++)if(r=m[t],r.toLowerCase().indexOf(e)>-1)return q("//static.arcgis.com/attribution/"+r)}_getDefaultTileServers(e){const r=e.search(/^(?:https?:)?\/\/server\.arcgisonline\.com/i)!==-1,t=e.search(/^(?:https?:)?\/\/services\.arcgisonline\.com/i)!==-1;return r||t?[e,e.replace(r?/server\.arcgisonline/i:/services\.arcgisonline/i,r?"services.arcgisonline":"server.arcgisonline")]:[]}get hasOverriddenFetchTile(){return!this.fetchTile.__isDefault__}};a([o({readOnly:!0})],s.prototype,"attributionDataUrl",null),a([o({type:["show","hide","hide-children"]})],s.prototype,"listMode",void 0),a([o({type:Boolean,json:{read:!1,write:{enabled:!0,overridePolicy:()=>({enabled:!1})}}})],s.prototype,"isReference",void 0),a([o({readOnly:!0,type:["ArcGISTiledMapServiceLayer"]})],s.prototype,"operationalLayerType",void 0),a([o({type:Boolean})],s.prototype,"resampling",void 0),a([o()],s.prototype,"sourceJSON",void 0),a([o({type:g})],s.prototype,"spatialReference",void 0),a([x("spatialReference",["spatialReference","tileInfo"])],s.prototype,"readSpatialReference",null),a([o({type:String,json:{origins:{"web-scene":{read:!0,write:!0}},read:!1}})],s.prototype,"path",void 0),a([o({readOnly:!0})],s.prototype,"sublayers",void 0),a([E("sublayers",{layers:{type:[Y]}})],s.prototype,"writeSublayers",null),a([o({json:{read:!1,write:!1}})],s.prototype,"popupEnabled",void 0),a([o()],s.prototype,"tileServers",null),a([K("tileServers")],s.prototype,"castTileServers",null),a([o({readOnly:!0,json:{read:!1}})],s.prototype,"type",void 0),a([o(V)],s.prototype,"url",void 0),s=a([F("esri.layers.TileLayer")],s),s.prototype.fetchTile.__isDefault__=!0;const oe=s;export{oe as default};
//# sourceMappingURL=TileLayer.e8f4ccfe.js.map