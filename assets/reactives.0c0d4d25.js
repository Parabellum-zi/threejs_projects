import{onMounted as x,openBlock as g,createElementBlock as M}from"vue";import{j as R,s as C,h as j,a as G,c as L,k as P,b as S}from"./externalRenderers.e9b2a64d.js";import{W,S as T,P as k,aD as A,V as l,m as B,n as c,T as D,R as d,M as V,c as m,o as E}from"./three.module.3b505d30.js";import{_ as I}from"./index.f0707c98.js";import"./vendor.c70270c6.js";const U={id:"mapContainer",class:"viewDiv"},q={setup(z){x(()=>{h()});function h(){const s=[[115.80895340787583,30.92933111293343],[115.81947621477968,30.936026430486265],[115.85073577332635,30.952730603143078],[115.86830705038578,30.964969701156637],[115.87796494895557,30.970050440481813],[115.88263291871093,30.97587476869184],[115.88153549018487,30.97619308639916],[115.88860467181571,30.985581605596618],[115.89039457558401,30.99614115304192],[115.89037581420371,30.99986573852132],[115.88982453627196,31.003621647335926],[115.88822886767906,30.999078415194415],[115.88681216877917,30.997464365151867],[115.88286139825868,30.99686255666582],[115.87841763117079,30.999826971071514],[115.86308179931808,30.99584156461405],[115.85510630972263,30.993171784031908],[115.86174910808289,30.993473404196706],[115.86231959908358,30.99068362090549]];var i=new R({basemap:"satellite"}),t=new C({container:"mapContainer",map:i,camera:{position:[115.9210717080402,30.896913111159947,13154.641086300715],fov:55,heading:318.70623732061983,tilt:42.34234113203692}});t.graphics.add(new j({geometry:{type:"polyline",paths:s},symbol:{type:"simple-line",color:[226,119,40],width:2}})),i.ground.opacity=.1,G(t,{view:t,renderer:null,camera:null,scene:null,height:100,offest:0,map:null,setup:function(a){this.renderer=new W({context:a.gl,premultipliedAlpha:!1}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setViewport(0,0,t.width,t.height),this.renderer.autoClearDepth=!1,this.renderer.autoClearStencil=!1,this.renderer.autoClearColor=!1,this.scene=new T,this.camera=new k;var e=new A(16777215,1);e.position.set(0,100,0),this.scene.add(e);let n=[];s.forEach(p=>{var r=[0,0,0];L(this.view,[p[0],p[1],20],0,P.WGS84,r,0,1),n.push(new l(r[0],r[1],r[2]))});let o=new B(n,!1),u=new c(o,20,5,8,!1);var f=new D;this.map=f.load("images/allow2.png"),this.map.wrapS=d,this.map.wrapT=d,this.map.repeat.set(70,1),this.map.offset.y=.65;let w=new V({color:8759721,side:200,map:this.map,transparent:!0,depthWrite:!1}),v=new m(u,w);this.scene.add(v);let _=new c(o,20,10,8,!1),y=new E({color:10062079,transparent:!0,opacity:.5}),b=new m(_,y);this.scene.add(b)},render:function(a){const e=a.camera;this.camera.position.set(e.eye[0],e.eye[1],e.eye[2]),this.camera.up.set(e.up[0],e.up[1],e.up[2]),this.camera.lookAt(new l(e.center[0],e.center[1],e.center[2])),this.camera.projectionMatrix.fromArray(e.projectionMatrix),this.map.offset.x+=-.009,this.map.needsUpdate=!0,this.renderer.state.reset(),a.bindRenderTarget(),this.renderer.render(this.scene,this.camera),S(t),a.resetWebGLState()}})}return(s,i)=>(g(),M("div",U))}};var Q=I(q,[["__scopeId","data-v-4f5f8171"]]);export{Q as default};
//# sourceMappingURL=reactives.0c0d4d25.js.map
