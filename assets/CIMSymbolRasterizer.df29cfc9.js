var ae=Object.defineProperty,re=Object.defineProperties;var ie=Object.getOwnPropertyDescriptors;var V=Object.getOwnPropertySymbols;var ne=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var W=(a,e,t)=>e in a?ae(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t,j=(a,e)=>{for(var t in e||(e={}))ne.call(e,t)&&W(a,t,e[t]);if(V)for(var t of V(e))se.call(e,t)&&W(a,t,e[t]);return a},J=(a,e)=>re(a,ie(e));import{fO as oe,ae as ce,C as le,hc as I,nv as me,a_ as fe,lo as he,fJ as N,hO as ye}from"./externalRenderers.e9b2a64d.js";import{r as q,m as ue,I as ge,q as pe}from"./cimAnalyzer.bab8adc8.js";import{M as de,j as B,W as Me,O as A,t as K,o as Ce,s as Ie,a as Pe,n as ke,e as M,r as Q}from"./CIMSymbolHelper.dc230466.js";import"./BidiEngine.8aecf25d.js";import"./number.dfbabd3f.js";function Z(a,e,t,i){if(a.type!=="CIMTextSymbol"){if(t&&a.effects)for(const r of a.effects)be(r,e);if(a.symbolLayers)for(const r of a.symbolLayers)switch(r.type){case"CIMPictureMarker":case"CIMVectorMarker":$(r,e,i);break;case"CIMPictureStroke":case"CIMSolidStroke":i!=null&&i.preserveOutlineWidth||(r.width*=e);break;case"CIMPictureFill":r.height*=e,r.offsetX*=e,r.offsetY*=e;break;case"CIMHatchFill":Z(r.lineSymbol,e,!0,J(j({},i),{preserveOutlineWidth:!1})),r.offsetX*=e,r.offsetY*=e,r.separation*=e}}else a.height*=e}function $(a,e,t){if(a.markerPlacement&&ze(a.markerPlacement,e),a.offsetX*=e,a.offsetY*=e,a.anchorPoint&&a.anchorPointUnits==="Absolute"&&(a.anchorPoint={x:a.anchorPoint.x*e,y:a.anchorPoint.y*e}),a.size*=e,a.type==="CIMVectorMarker"&&a.markerGraphics)for(const i of a.markerGraphics)a.scaleSymbolsProportionally||Z(i.symbol,e,!0,t)}function ze(a,e){switch(de(a)&&(a.offset*=e),a.type){case"CIMMarkerPlacementAlongLineRandomSize":case"CIMMarkerPlacementAlongLineSameSize":if(a.customEndingOffset*=e,a.offsetAlongLine*=e,a.placementTemplate&&a.placementTemplate.length){const t=a.placementTemplate.map(i=>i*e);a.placementTemplate=t}break;case"CIMMarkerPlacementAlongLineVariableSize":if(a.maxRandomOffset*=e,a.placementTemplate&&a.placementTemplate.length){const t=a.placementTemplate.map(i=>i*e);a.placementTemplate=t}break;case"CIMMarkerPlacementOnLine":a.startPointOffset*=e;break;case"CIMMarkerPlacementAtExtremities":a.offsetAlongLine*=e;break;case"CIMMarkerPlacementAtMeasuredUnits":case"CIMMarkerPlacementOnVertices":break;case"CIMMarkerPlacementAtRatioPositions":a.beginPosition*=e,a.endPosition*=e;break;case"CIMMarkerPlacementPolygonCenter":a.offsetX*=e,a.offsetY*=e;break;case"CIMMarkerPlacementInsidePolygon":a.offsetX*=e,a.offsetY*=e,a.stepX*=e,a.stepY*=e}}function be(a,e){switch(a.type){case"CIMGeometricEffectArrow":case"CIMGeometricEffectDonut":a.width*=e;break;case"CIMGeometricEffectBuffer":a.size*=e;break;case"CIMGeometricEffectCut":a.beginCut*=e,a.endCut*=e,a.middleCut*=e;break;case"CIMGeometricEffectDashes":if(a.customEndingOffset*=e,a.offsetAlongLine*=e,a.dashTemplate&&a.dashTemplate.length){const t=a.dashTemplate.map(i=>i*e);a.dashTemplate=t}break;case"CIMGeometricEffectExtension":case"CIMGeometricEffectJog":case"CIMGeometricEffectRadial":a.length*=e;break;case"CIMGeometricEffectMove":a.offsetX*=e,a.offsetY*=e;break;case"CIMGeometricEffectOffset":case"CIMGeometricEffectOffsetTangent":a.offset*=e;break;case"CIMGeometricEffectRegularPolygon":a.radius*=e;break;case"CIMGeometricEffectTaperedPolygon":a.fromWidth*=e,a.length*=e,a.toWidth*=e;break;case"CIMGeometricEffectWave":a.amplitude*=e,a.period*=e}}const xe=512;class we{constructor(e){this._resourceManager=e}dispose(){this._rasterizationCanvas=null}rasterizeJSONResource(e,t,i){if(this._rasterizationCanvas||(this._rasterizationCanvas=document.createElement("canvas")),e.type==="simple-fill"||e.type==="esriSFS"){const[f,o,h]=B.rasterizeSimpleFill(this._rasterizationCanvas,e.style,t);return{size:[o,h],image:new Uint32Array(f.buffer),sdf:!1,simplePattern:!0,anchorX:0,anchorY:0}}if(e.type==="simple-line"||e.type==="esriSLS"||e.type==="line"&&e.dashTemplate){let f,o;if(e.type==="simple-line"||e.type==="esriSLS")switch(f=Me(e.style,e.cap),e.cap){case"butt":o="Butt";break;case"square":o="Square";break;default:o="Round"}else f=e.dashTemplate,o=e.cim.capStyle;const[h,u,g]=B.rasterizeSimpleLine(f,o);return{size:[u,g],image:new Uint32Array(h.buffer),sdf:!0,simplePattern:!0,anchorX:0,anchorY:0}}let r,n,c;if(e.type==="simple-marker"||e.type==="esriSMS"||e.type==="line-marker"?(r=A.fromSimpleMarker(e),c=q(r)):e.cim&&e.cim.type==="CIMHatchFill"?(r=A.fromCIMHatchFill(e.cim),n=new K(r.frame.xmin,-r.frame.ymax,r.frame.xmax-r.frame.xmin,r.frame.ymax-r.frame.ymin)):e.cim.markerPlacement&&e.cim.markerPlacement.type==="CIMMarkerPlacementInsidePolygon"?(r=A.fromCIMInsidePolygon(e.cim),n=new K(r.frame.xmin,-r.frame.ymax,r.frame.xmax-r.frame.xmin,r.frame.ymax-r.frame.ymin)):(r=e.cim,c=q(r)),c&&!i){const[f,o,h]=ue(c);return f?{size:[o,h],image:new Uint32Array(f.buffer),sdf:!0,simplePattern:!0,anchorX:0,anchorY:0}:null}const[s,l,m,y,p]=A.rasterize(this._rasterizationCanvas,r,n,this._resourceManager,!i);return s?{size:[l,m],image:new Uint32Array(s.buffer),sdf:!1,simplePattern:!1,anchorX:y,anchorY:p}:null}rasterizeImageResource(e,t,i,r){this._rasterizationCanvas||(this._rasterizationCanvas=document.createElement("canvas")),this._rasterizationCanvas.width=e,this._rasterizationCanvas.height=t;const n=this._rasterizationCanvas.getContext("2d");i instanceof ImageData?n.putImageData(i,0,0):(i.setAttribute("width",`${e}px`),i.setAttribute("height",`${t}px`),n.drawImage(i,0,0,e,t));const c=n.getImageData(0,0,e,t),s=new Uint8Array(c.data);if(r){for(const o of r)if(o&&o.oldColor&&o.oldColor.length===4&&o.newColor&&o.newColor.length===4){const[h,u,g,C]=o.oldColor,[P,z,k,b]=o.newColor;if(h===P&&u===z&&g===k&&C===b)continue;for(let d=0;d<s.length;d+=4)h===s[d]&&u===s[d+1]&&g===s[d+2]&&C===s[d+3]&&(s[d]=P,s[d+1]=z,s[d+2]=k,s[d+3]=b)}}let l;for(let o=0;o<s.length;o+=4)l=s[o+3]/255,s[o]=s[o]*l,s[o+1]=s[o+1]*l,s[o+2]=s[o+2]*l;let m=s,y=e,p=t;const f=xe;if(y>=f||p>=f){const o=y/p;o>1?(y=f,p=Math.round(f/o)):(p=f,y=Math.round(f*o)),m=new Uint8Array(4*y*p);const h=new Uint8ClampedArray(m.buffer);Ce(s,e,t,h,y,p,!1)}return{size:[y,p],image:new Uint32Array(m.buffer),sdf:!1,simplePattern:!1,anchorX:0,anchorY:0}}}var T;(function(a){a.Legend="legend",a.Preview="preview"})(T||(T={}));const D=(a,e,t)=>{if(a&&a.targetSize){let i;if(t){const r=Math.max(t.frame.xmax-t.frame.xmin,t.frame.ymax-t.frame.ymin);i=a.targetSize/I(r)}else i=a.targetSize/e.referenceSize;return i}return a&&a.scaleFactor?a.scaleFactor:1},ee={fill:{legend:{frame:{xmax:15,xmin:0,ymax:15,ymin:0},geometry:{rings:[[[0,15],[15,7.5],[15,0],[0,0],[0,15]]]},canvasPaths:{rings:[[[0,15],[0,0],[15,7.5],[15,15],[0,15]]]}},preview:{frame:{xmax:100,xmin:0,ymax:100,ymin:0},geometry:{rings:[[[0,100],[100,100],[100,0],[0,0],[0,100]]]},canvasPaths:{rings:[[[0,100],[0,0],[100,0],[100,100],[0,100]]]}}},stroke:{legend:{frame:{xmax:24,xmin:0,ymax:2,ymin:-2},geometry:{paths:[[[0,0],[12,0],[24,0]]]},canvasPaths:{paths:[[[0,2],[12,2],[24,2]]]}},preview:{frame:{xmax:100,xmin:0,ymax:2,ymin:-2},geometry:{paths:[[[0,0],[50,0],[100,0]]]},canvasPaths:{paths:[[[0,2],[50,2],[100,2]]]}}}};class Ye{constructor(e,t){this._spatialReference=e,this._avoidSDF=t,this._resourceCache=new Map,this._pictureMarkerCache=new Map,this._textRasterizer=new Ie,this._cimResourceManager=new Pe,this._rasterizer=new we(this._cimResourceManager)}async rasterizeCIMSymbolAsync(e,t,i,r,n,c,s,l){r=r||(t?t.centroid!=null?"esriGeometryPolygon":oe(t.geometry):null)||_e(e);const m=await this.analyzeCIMSymbol(e,t?Se(t.attributes):null,i,r,l);return this.rasterizeCIMSymbol(m,t,r,n,c,s)}async analyzeCIMSymbol(e,t,i,r,n){const c=[],s=t?{geometryType:r,spatialReference:this._spatialReference,fields:t}:null;let l;await ge(e.data,s,this._cimResourceManager,c,this._avoidSDF),ce(n);for(const m of c)m.cim.type!=="CIMPictureMarker"&&m.cim.type!=="CIMPictureFill"&&m.cim.type!=="CIMPictureStroke"||(l||(l=[]),l.push(this.fetchPictureMarkerResource(m,n))),i&&m.type==="text"&&typeof m.text=="string"&&m.text.indexOf("[")>-1&&(m.text=ke(i,m.text,m.cim.textCase));return l&&await Promise.all(l),c}async fetchPictureMarkerResource(e,t){const i=e.materialHash;if(!this._pictureMarkerCache.get(i)){const r=(await le(e.cim.url,{responseType:"image",signal:t&&t.signal})).data;this._pictureMarkerCache.set(i,r)}}rasterizeCIMSymbol(e,t,i,r,n,c){const s=[];for(const l of e){r&&typeof r.scaleFactor=="function"&&(r.scaleFactor=r.scaleFactor(t,n,c));const m=this._getRasterizedResource(l,t,i,r,n,c);if(!m)continue;let y=0,p=m.anchorX||0,f=m.anchorY||0,o=!1,h=0,u=0;if(i==="esriGeometryPoint"){const g=D(r,l,null);if(h=M(l.offsetX,t,n,c)*g||0,u=M(l.offsetY,t,n,c)*g||0,l.type==="marker")y=M(l.rotation,t,n,c)||0,o=!!l.rotateClockwise&&l.rotateClockwise;else if(l.type==="text"){if(y=M(l.angle,t,n,c)||0,l.horizontalAlignment!==void 0)switch(l.horizontalAlignment){case"left":p=-.5;break;case"right":p=.5;break;default:p=0}if(l.verticalAlignment!==void 0)switch(l.verticalAlignment){case"top":f=.5;break;case"bottom":f=-.5;break;case"baseline":f=-.25;break;default:f=0}}}m!=null&&s.push({angle:y,rotateClockWise:o,anchorX:p,anchorY:f,offsetX:h,offsetY:u,rasterizedResource:m})}return this.getSymbolImage(s)}getSymbolImage(e){const t=document.createElement("canvas"),i=t.getContext("2d");let r=0,n=0,c=0,s=0;const l=[];for(let f=0;f<e.length;f++){const o=e[f],h=o.rasterizedResource;if(!h)continue;const u=h.size,g=o.offsetX,C=o.offsetY,P=o.anchorX,z=o.anchorY,k=o.rotateClockWise||!1;let b=o.angle,d=I(g)-u[0]*(.5+P),x=I(C)-u[1]*(.5+z),_=d+u[0],v=x+u[1];if(b){k&&(b=-b);const w=Math.sin(b*Math.PI/180),S=Math.cos(b*Math.PI/180),Y=d*S-x*w,G=d*w+x*S,E=d*S-v*w,O=d*w+v*S,F=_*S-v*w,L=_*w+v*S,U=_*S-x*w,H=_*w+x*S;d=Math.min(Y,E,F,U),x=Math.min(G,O,L,H),_=Math.max(Y,E,F,U),v=Math.max(G,O,L,H)}r=d<r?d:r,n=x<n?x:n,c=_>c?_:c,s=v>s?v:s;const X=i.createImageData(h.size[0],h.size[1]);X.data.set(new Uint8ClampedArray(h.image.buffer));const te={offsetX:g,offsetY:C,rotateClockwise:k,angle:b,rasterizedImage:X,anchorX:P,anchorY:z};l.push(te)}t.width=c-r,t.height=s-n;const m=-r,y=s;for(let f=0;f<l.length;f++){const o=l[f],h=this._imageDataToCanvas(o.rasterizedImage),u=o.rasterizedImage.width,g=o.rasterizedImage.height,C=m-u*(.5+o.anchorX),P=y-g*(.5-o.anchorY);if(o.angle){const z=(360-o.angle)*Math.PI/180;i.save(),i.translate(I(o.offsetX),-I(o.offsetY)),i.translate(m,y),i.rotate(z),i.translate(-m,-y),i.drawImage(h,C,P),i.restore()}else i.drawImage(h,C+I(o.offsetX),P-I(o.offsetY))}const p=new me({x:m/t.width-.5,y:y/t.height-.5});return{imageData:t.width!==0&&t.height!==0?i.getImageData(0,0,t.width,t.height):i.createImageData(1,1),anchorPosition:p}}_imageDataToCanvas(e){this._imageDataCanvas||(this._imageDataCanvas=document.createElement("canvas"));const t=this._imageDataCanvas,i=t.getContext("2d");return t.width=e.width,t.height=e.height,i.putImageData(e,0,0),t}_imageTo32Array(e,t,i,r){this._imageDataCanvas||(this._imageDataCanvas=document.createElement("canvas"));const n=this._imageDataCanvas,c=n.getContext("2d");if(n.width=t,n.height=i,c.drawImage(e,0,0,t,i),r){c.save();const s=new fe(r);c.fillStyle=s.toHex(),c.globalCompositeOperation="multiply",c.fillRect(0,0,t,i),c.globalCompositeOperation="destination-atop",c.drawImage(e,0,0,t,i),c.restore()}return new Uint32Array(c.getImageData(0,0,t,i).data.buffer)}_getRasterizedResource(e,t,i,r,n,c){let s,l,m,y,p=null,f=null;if(i==="esriGeometryPolyline"||i==="esriGeometryPolygon"){const h=r&&r.style?r.style:T.Legend,u=i==="esriGeometryPolyline"?ee.stroke[h]:ee.fill[h];if(e.type==="line"){if(e.cim.type!=="CIMSolidStroke"){if(e.cim.type==="CIMPictureStroke"){const g=M(e.width,t,n,c),C=M(e.color,t,n,c),{image:P,width:z,height:k}=this._getPictureResource(e,g,C);return this._rasterizePictureResource(e,P,z,k,u,g)}return null}({analyzedCIM:s,hash:m}=R(e,t,n,c)),l=this._embedCIMLayerInVectorMarker(s,u)}else if(e.type==="marker"){if(e.cim.type==="CIMPictureMarker"||e.cim.type!=="CIMVectorMarker")return null;e.cim.offsetX=M(e.offsetX,t,n,c),e.cim.offsetY=M(e.offsetY,t,n,c),e.cim.rotation=M(e.rotation,t,n,c),e.cim.markerPlacement=e.markerPlacement,{analyzedCIM:s}=R(e,t,n,c),m=he(JSON.stringify(s)).toString(),l=this._embedCIMLayerInVectorMarker(s,u),p=M(e.size,t,n,c),f=e.path}else{if(e.type==="text")return null;if(e.type==="fill"){if(e.cim.type==="CIMHatchFill"||e.cim.type==="CIMVectorMarker"||e.cim.type==="CIMPictureMarker"||e.cim.type==="CIMPictureFill"){const g=e.cim.size||e.cim.height;let C,P,z;if(e.cim.type==="CIMPictureMarker"||e.cim.type==="CIMPictureFill")({image:C,width:P,height:z}=this._getPictureResource(e,g,M(e.color,t,n,c)));else{({analyzedCIM:s,hash:m}=R(e,t,n,c));const k=this._rasterizer.rasterizeJSONResource({cim:s,type:e.type,url:e.url,mosaicHash:m,size:g,path:f},1,this._avoidSDF);C=k.image,P=k.size[0],z=k.size[1]}return this._rasterizePictureResource(e,C,P,z,u,null)}if(e.cim.type!=="CIMSolidFill")return null;({analyzedCIM:s,hash:m}=R(e,t,n,c)),l=this._embedCIMLayerInVectorMarker(s,u)}}}else{if(e.type==="text")return y=this._rasterizeTextResource(e,t,r,n,c),y;({analyzedCIM:s,hash:m}=R(e,t,n,c));const h=D(r,e,null);if(e.cim.type==="CIMPictureMarker"){const u=M(e.size,t,n,c)*h,{image:g,width:C,height:P}=this._getPictureResource(e,u,M(e.color,t,n,c));return y={image:g,size:[C,P],sdf:!1,simplePattern:!1,anchorX:e.anchorPoint?e.anchorPoint.x:0,anchorY:e.anchorPoint?e.anchorPoint.y:0},y}$(s,h,{preserveOutlineWidth:!1}),l=s}m+=i,r&&(m+=JSON.stringify(r));const o=this._resourceCache;return o.has(m)?o.get(m):(y=this._rasterizer.rasterizeJSONResource({cim:l,type:e.type,url:e.url,mosaicHash:m,size:p,path:f},window.devicePixelRatio||1,this._avoidSDF),o.set(m,y),y)}_rasterizeTextResource(e,t,i,r,n){const c=D(i,e,null),s=M(e.text,t,r,n);if(!s||s.length===0)return null;const l=M(e.fontName,t,r,n),m=M(e.style,t,r,n),y=M(e.weight,t,r,n),p=M(e.decoration,t,r,n),f=M(e.size,t,r,n)*c,o=M(e.horizontalAlignment,t,r,n),h=M(e.verticalAlignment,t,r,n),u=Q(M(e.color,t,r,n)),g=Q(M(e.outlineColor,t,r,n)),C={color:u,size:f,horizontalAlignment:o,verticalAlignment:h,font:{family:l,style:m,weight:y,decoration:p},halo:{size:M(e.outlineSize,t,r,n)||0,color:g,style:m},pixelRatio:1,premultiplyColors:!this._avoidSDF};return this._textRasterizer.rasterizeText(s,C)}_rasterizePictureResource(e,t,i,r,n,c){const s=document.createElement("canvas"),l=s.getContext("2d");s.height=I(Math.max(n.frame.ymax-n.frame.ymin,c)),s.width=I(n.frame.xmax-n.frame.xmin);const m=l.createImageData(i,r);m.data.set(new Uint8ClampedArray(t.buffer));const y=this._imageDataToCanvas(m),p=l.createPattern(y,"repeat"),f=Math.cos((-e.cim.rotation||0)*Math.PI/180),o=Math.sin((-e.cim.rotation||0)*Math.PI/180);p.setTransform({m11:f,m12:o,m21:-o,m22:f,m41:I(e.cim.offsetX)||0,m42:I(e.cim.offsetY)||0});const h=n.canvasPaths;let u,g,C;N(h)?(u=h.rings,l.fillStyle=p,g=l.fill,C=["evenodd"]):ye(h)&&(u=h.paths,l.strokeStyle=p,l.lineWidth=c,g=l.stroke,u[0][0][1]=s.height/2,u[0][1][1]=s.height/2),l.beginPath();for(const k of u){const b=k?k.length:0;if(b>1){let d=k[0];l.moveTo(I(d[0]),I(d[1]));for(let x=1;x<b;++x)d=k[x],l.lineTo(I(d[0]),I(d[1]));l.closePath()}}g.apply(l,C);const P=l.getImageData(0,0,s.width,s.height),z=new Uint8Array(P.data);return{size:[s.width,s.height],image:new Uint32Array(z.buffer),sdf:!1,simplePattern:!1,anchorX:0,anchorY:0}}_getPictureResource(e,t,i){const r=this._pictureMarkerCache.get(e.materialHash);if(!r)return null;const n=r.height/r.width,c=t?n>1?I(t):I(t)/n:r.width,s=t?n>1?I(t)*n:I(t):r.height;return{image:this._imageTo32Array(r,c,s,i),width:c,height:s}}_embedCIMLayerInVectorMarker(e,t){const i=N(t.geometry)?"CIMPolygonSymbol":"CIMLineSymbol",r=t.frame;return{type:"CIMVectorMarker",frame:r,size:r.ymax-r.ymin,markerGraphics:[{type:"CIMMarkerGraphic",geometry:t.geometry,symbol:{type:i,symbolLayers:[e]}}]}}}function Se(a){return(a?Object.keys(a):[]).map(e=>({name:e,alias:e,type:typeof a[e]=="string"?"esriFieldTypeString":"esriFieldTypeDouble"}))}function _e(a){if(!(a&&a.data&&a.data.symbol))return null;switch(a.data.symbol.type){case"CIMPointSymbol":case"CIMTextSymbol":return"esriGeometryPoint";case"CIMLineSymbol":return"esriGeometryPolyline";case"CIMPolygonSymbol":return"esriGeometryPolygon";default:return null}}function R(a,e,t,i){let r,n;return typeof a.materialHash=="function"?(r=(0,a.materialHash)(e,t,i),n=pe(a.cim,a.materialOverrides)):(r=a.materialHash,n=a.cim),{analyzedCIM:n,hash:r}}export{Ye as CIMSymbolRasterizer,T as GeometryStyle};
//# sourceMappingURL=CIMSymbolRasterizer.df29cfc9.js.map