import{c$ as u,d0 as g,d1 as l,d2 as h,d3 as v,d4 as m,d5 as p,d6 as f,d7 as b,D as i,d8 as s,d9 as y,da as $,db as T,dc as x,dd as P,de as E,df as F,dg as C,dh as _,di as w,dj as D,dk as O,dl as S,dm as j,dn as A,dp as H,dq as z,dr as G,ds as I,dt as U}from"./externalRenderers.e9b2a64d.js";function V(r){const e=new u;return e.include(g,{linearDepth:!1}),e.vertex.uniforms.add("proj","mat4").add("view","mat4"),e.attributes.add("position","vec3"),e.attributes.add("uv0","vec2"),e.varyings.add("vpos","vec3"),r.multipassTerrainEnabled&&e.varyings.add("depth","float"),e.vertex.uniforms.add("textureCoordinateScaleFactor","vec2"),e.vertex.code.add(l`
    void main(void) {
      vpos = position;
      ${r.multipassTerrainEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
      vTexCoord = uv0 * textureCoordinateScaleFactor;
      gl_Position = transformPosition(proj, view, vpos);
    }
  `),e.include(h,r),r.multipassTerrainEnabled&&(e.fragment.include(v),e.include(m,r)),e.fragment.uniforms.add("tex","sampler2D"),e.fragment.uniforms.add("opacity","float"),e.varyings.add("vTexCoord","vec2"),r.output===7?e.fragment.code.add(l`
    void main() {
      discardBySlice(vpos);
      ${r.multipassTerrainEnabled?"terrainDepthTest(gl_FragCoord, depth);":""}

      float alpha = texture2D(tex, vTexCoord).a * opacity;
      if (alpha  < ${l.float(p)}) {
        discard;
      }

      gl_FragColor = vec4(alpha);
    }
    `):(e.fragment.include(f),e.fragment.code.add(l`
    void main() {
      discardBySlice(vpos);
      ${r.multipassTerrainEnabled?"terrainDepthTest(gl_FragCoord, depth);":""}
      gl_FragColor = texture2D(tex, vTexCoord) * opacity;

      if (gl_FragColor.a < ${l.float(p)}) {
        discard;
      }

      gl_FragColor = highlightSlice(gl_FragColor, vpos);
      ${r.OITEnabled?"gl_FragColor = premultiplyAlpha(gl_FragColor);":""}
    }
    `)),e}const W=Object.freeze({__proto__:null,build:V});class d extends T{initializeProgram(e){const a=d.shader.get(),t=this.configuration,n=a.build({output:t.output,slicePlaneEnabled:t.slicePlaneEnabled,sliceHighlightDisabled:!1,sliceEnabledForVertexPrograms:!1,OITEnabled:t.transparencyPassType===0,multipassTerrainEnabled:t.multipassTerrainEnabled,cullAboveGround:t.cullAboveGround});return new x(e.rctx,n,P)}bindPass(e,a){E(this.program,a.camera.projectionMatrix),this.program.setUniform1f("opacity",e.opacity),a.multipassTerrainEnabled&&(this.program.setUniform2fv("cameraNearFar",a.camera.nearFar),this.program.setUniform2fv("inverseViewport",a.inverseViewport),F(this.program,a))}bindDraw(e){C(this.program,e),_(this.program,this.configuration,e),this.program.rebindTextures()}setPipelineState(e,a){const t=this.configuration,n=e===3,c=e===2;return w({blending:t.output!==0&&t.output!==7||!t.transparent?null:n?B:D(e),culling:O(t.cullFace),depthTest:{func:S(e)},depthWrite:n?t.writeDepth&&j:A(e),colorWrite:H,stencilWrite:t.sceneHasOcludees?z:null,stencilTest:t.sceneHasOcludees?a?G:I:null,polygonOffset:n||c?null:U(t.enableOffset)})}initializePipeline(){return this._occludeePipelineState=this.setPipelineState(this.configuration.transparencyPassType,!0),this.setPipelineState(this.configuration.transparencyPassType,!1)}getPipelineState(e,a){return a?this._occludeePipelineState:super.getPipelineState(e,a)}}d.shader=new y(W,()=>import("./ImageMaterial.glsl.c8ee1a78.js"));const B=b(1,771);class o extends ${constructor(){super(...arguments),this.output=0,this.cullFace=0,this.slicePlaneEnabled=!1,this.transparent=!1,this.enableOffset=!0,this.writeDepth=!0,this.sceneHasOcludees=!1,this.transparencyPassType=3,this.multipassTerrainEnabled=!1,this.cullAboveGround=!1}}i([s({count:8})],o.prototype,"output",void 0),i([s({count:3})],o.prototype,"cullFace",void 0),i([s()],o.prototype,"slicePlaneEnabled",void 0),i([s()],o.prototype,"transparent",void 0),i([s()],o.prototype,"enableOffset",void 0),i([s()],o.prototype,"writeDepth",void 0),i([s()],o.prototype,"sceneHasOcludees",void 0),i([s({count:4})],o.prototype,"transparencyPassType",void 0),i([s()],o.prototype,"multipassTerrainEnabled",void 0),i([s()],o.prototype,"cullAboveGround",void 0);export{d as E,o as O,V as s};
//# sourceMappingURL=ImageMaterialTechnique.ca20af60.js.map
