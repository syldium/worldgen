(this.webpackJsonpworldgen=this.webpackJsonpworldgen||[]).push([[4],{123:function(e,t,n){var a=n(17),r=n(125),i=4294967296,c=Math.pow(2,53),s=65535,o=57068,l=58989;e.exports=function e(t){"use strict";var n,u,b,j,m=a.mark(_),d=a.mark(M),f=a.mark(S);r(this,e);var h=!1,O=function(){var e=11,t=b*l+e,a=u*l+b*o+(e=t>>>16),r=n*l+u*o+5*b+(e=a>>>16);return b=t&=s,65536*(n=r&=s)+(u=a&=s)},g=function(e){return O()>>32-e},p=function(e){return O()>>>32-e},v=function(e){if("number"!==typeof e)throw TypeError()},x=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2147483647;if(v(e),e<0||e>t)throw RangeError()};function y(e){v(e),b=e&s^l,u=e/65536&s^o,n=e/i&s^5}function C(e){if(void 0===e)return g(32);var t,n;if(x(e),(e&-e)===e)return~~(e*(p(31)/2147483648));do{n=(t=p(31))%e}while(t-n+(e-1)<0);return n}function k(){if("function"!==typeof BigInt)throw Error("BigInt unsupported");var e=BigInt(g(32)),t=BigInt(g(32));return e*BigInt(i)+t}function w(){return(134217728*p(26)+p(27))/c}function N(e){if(void 0!==e)return x(e,Number.MAX_SAFE_INTEGER),e}function _(e){var t;return a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:e=N(e),t=void 0===e;case 2:if(!(t||e-- >0)){n.next=7;break}return n.next=5,C();case 5:n.next=2;break;case 7:case"end":return n.stop()}}),m)}function M(e){var t;return a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:e=N(e),t=void 0===e;case 2:if(!(t||e-- >0)){n.next=7;break}return n.next=5,k();case 5:n.next=2;break;case 7:case"end":return n.stop()}}),d)}function S(e){var t;return a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:e=N(e),t=void 0===e;case 2:if(!(t||e-- >0)){n.next=7;break}return n.next=5,w();case 5:n.next=2;break;case 7:case"end":return n.stop()}}),f)}var I={setSeed:y,nextInt:C,nextBoolean:function(){return 0!=p(1)},nextFloat:function(){return p(24)/16777216},nextDouble:w,nextGaussian:function(){if(h)return h=!1,j;var e,t,n;do{n=(e=2*w()-1)*e+(t=2*w()-1)*t}while(n>=1||0===n);var a=Math.sqrt(-2*Math.log(n)/n);return j=t*a,h=!0,e*a},ints:_,doubles:S};for(var A in"function"===typeof BigInt&&Object.assign(I,{nextLong:k,longs:M}),I)I[A]={value:I[A]};Object.defineProperties(this,I),void 0===t&&(t=Math.floor(281474976710656*Math.random())),y(t)}},125:function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},128:function(e,t,n){"use strict";n.r(t),n.d(t,"Dimension",(function(){return ee}));var a=n(2),r=n(3),i=n(1),c=n.n(i),s=n(6),o=n(13),l=n(36),u=n(12),b=n(5),j=n(27),m=n(8);function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function h(e,t,n){return t&&f(e.prototype,t),n&&f(e,n),e}var O=n(28),g=n(123),p=n.n(g),v=function(){function e(t,n){d(this,e),this.firstSampler=new x(t,n),this.secondSampler=new x(t,n),this.amplitude=this.createAmplitude(n.amplitudes)}return h(e,[{key:"createAmplitude",value:function(e){var t=O.a,n=O.b;return e.forEach((function(e,a){0!==e&&(t=Math.min(t,a),n=Math.max(n,a))})),1/6/(.1*(1+1/(n-t+1)))}},{key:"sample",value:function(e,t,n){var a=1.0181268882175227*e,r=1.0181268882175227*t,i=1.0181268882175227*n;return(this.firstSampler.sample(e,t,n)+this.secondSampler.sample(a,r,i))*this.amplitude}}]),e}(),x=function(){function e(t,n){var a=n.firstOctave,r=n.amplitudes;d(this,e),this.amplitudes=r;var i=new y(t),c=r.length,s=-a;(this.octaveSamplers=new Array(c),s>=0&&s<c)&&(0!==r[s]&&(this.octaveSamplers[s]=i));for(var o=s-1;o>=0;--o)o<c&&0!==this.amplitudes[o]?this.octaveSamplers[o]=new y(t):C(t,262);if(s<c-1)for(var l=0x8000000000000000*i.sample(0,0,0,0,0),u=new p.a(l),b=s+1;b<c;++b)b>=0&&0!==this.amplitudes[b]?this.octaveSamplers[b]=new y(u):C(t,262);this.lacunarity=Math.pow(2,-s),this.persistence=Math.pow(2,c-1)/(Math.pow(2,c)-1)}return h(e,[{key:"sample",value:function(e,t,n){var a=this,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,c=arguments.length>5&&void 0!==arguments[5]&&arguments[5],s=0,o=this.lacunarity,l=this.persistence;return this.octaveSamplers.forEach((function(u,b){"object"===typeof u&&(s+=a.amplitudes[b]*u.sample(e*o,c?-u.originY:t*o,n*o,r*o,i*o)*l,o*=2,l/=2)})),s}}]),e}(),y=function(){function e(t){d(this,e),this.originX=256*t.nextDouble(),this.originY=256*t.nextDouble(),this.originZ=256*t.nextDouble(),this.permutations=this.buildPermutationsTable(t)}return h(e,[{key:"buildPermutationsTable",value:function(e){for(var t=new Uint8Array(256),n=0;n<256;++n)t[n]=n;for(var a=0;a<256;++a){var r=e.nextInt(256-a),i=t[a];t[a]=t[a+r],t[a+r]=i}return t}},{key:"sample",value:function(e,t,n,a,r){var i=e+this.originX,c=t+this.originY,s=n+this.originZ,o=Math.floor(i),l=Math.floor(c),u=Math.floor(s),b=i-o,j=c-l,m=s-u,d=Object(O.f)(b),f=Object(O.f)(j),h=Object(O.f)(m),g=0===a?0:Math.floor(Math.min(r,j)/a)*a;return this._sample(o,l,u,b,j-g,m,d,f,h)}},{key:"_sample",value:function(e,t,n,a,r,i,c,s,o){var l=this.getGradient(e)+t,u=this.getGradient(l)+n,b=this.getGradient(l+1)+n,j=this.getGradient(e+1)+t,m=this.getGradient(j)+n,d=this.getGradient(j+1)+n,f=Object(O.c)(this.getGradient(u),a,r,i),h=Object(O.c)(this.getGradient(m),a-1,r,i),g=Object(O.c)(this.getGradient(b),a,r-1,i),p=Object(O.c)(this.getGradient(d),a-1,r-1,i),v=Object(O.c)(this.getGradient(u+1),a,r,i-1),x=Object(O.c)(this.getGradient(m+1),a-1,r,i-1),y=Object(O.c)(this.getGradient(b+1),a,r-1,i-1),C=Object(O.c)(this.getGradient(d+1),a-1,r-1,i-1);return Object(O.d)(c,s,o,f,h,g,p,v,x,y,C)}},{key:"getGradient",value:function(e){return this.permutations[255&e]}}]),e}();function C(e,t){for(var n=0;n<t;n++)e.nextInt()}function k(e){for(var t,n=0;n<e.length;n++)t=Math.imul(31,t)+e.charCodeAt(n)|0;return t}var w=function(){function e(t){d(this,e),this.biomes=t.biomes,this.temperatureNoise=new v(new p.a(t.seed),t.temperature_noise),this.humidityNoise=new v(new p.a(t.seed+1),t.humidity_noise),this.altitudeNoise=new v(new p.a(t.seed+2),t.altitude_noise),this.weirdnessNoise=new v(new p.a(t.seed+3),t.weirdness_noise)}return h(e,[{key:"getBiomeAt",value:function(e,t,n){var a,r=e>>2,i=t>>2,c=n>>2,s=this.temperatureNoise.sample(r,i,c),o=this.humidityNoise.sample(r,i,c),u=this.altitudeNoise.sample(r,i,c),b=this.weirdnessNoise.sample(r,i,c),j=null,m=Number.MAX_SAFE_INTEGER,d=Object(l.a)(this.biomes);try{for(d.s();!(a=d.n()).done;){var f=a.value,h=this.getDistanceToBiome(s,o,u,b,f.parameters);h<m&&(j=f,m=h)}}catch(O){d.e(O)}finally{d.f()}return j}},{key:"createImageData",value:function(t){for(var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:4,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,c=t.width,s=t.height,o=new ArrayBuffer(t.data.length),l=new Uint8ClampedArray(o),u=new Uint32Array(o),b=r+c,j=i+s,m=e.getBiomesColors(this.biomes),d=null,f=r;f<b;f+=1)for(var h=i;h<j;h+=1)if(f%a===0){if(h%a===0){var O=this.getBiomeAt(f<<n,0,h<<n);d=m[O.biome]}u[h*c+f]=255<<24|d}else u[h*c+f]=u[h*c+f-1];t.data.set(l)}},{key:"getDistanceToBiome",value:function(e,t,n,a,r){return Math.pow(e-r.temperature,2)+Math.pow(t-r.humidity,2)+Math.pow(n-r.altitude,2)+Math.pow(a-r.weirdness,2)+Math.pow(0-r.offset,2)}}],[{key:"getBiomesColors",value:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],n={},a=Object(l.a)(t);try{for(a.s();!(e=a.n()).done;){var r=e.value;n[r.biome]=k(r.biome)}}catch(i){a.e(i)}finally{a.f()}return n}}]),e}(),N=n(50),_=n(14),M=n(0),S=c.a.memo((function(e){var t=e.source,n=Object(_.a)(),a=Object(r.a)(n,2),c=a[0],o=a[1],l=Object(i.useState)(4),u=Object(r.a)(l,2),b=u[0],j=u[1],m=Object(i.useRef)(null),d=Object(i.useCallback)((function(){if(!((t.biomes||[]).length<1)){var e=m.current,n=e.getContext("2d",{alpha:!1}),a=n.createImageData(e.width,e.height);new w(t).createImageData(a,b),n.putImageData(a,0,0)}}),[b,t]),f=Object(i.useCallback)((function(e){e.preventDefault(),d()}),[d]),h=Object(i.useCallback)((function(e){j(parseInt(e.target.value))}),[]);return Object(i.useEffect)((function(){c&&d()}),[c,d]),Object(M.jsxs)("fieldset",{children:[Object(M.jsx)("legend",{children:"Preview"}),Object(M.jsxs)("div",{className:"form-row",children:[Object(M.jsx)("div",{style:{display:"flex",alignItems:"center"},children:Object(M.jsx)("canvas",{height:"128",width:"384",ref:m,"moz-opaque":"true"})}),Object(M.jsxs)("div",{children:[Object(M.jsx)("label",{htmlFor:"scale",children:"Scale"})," : ",Object(M.jsx)("input",{type:"range",id:"scale",min:"1",max:"8",value:b,onChange:h})," (",1<<b," block/px)",Object(M.jsx)("br",{}),Object(M.jsx)("label",{htmlFor:"auto-update",children:"Auto update (affects performance)"})," : ",Object(M.jsx)("input",{type:"checkbox",className:"checkbox",checked:c,onChange:o,id:"auto-update"}),Object(M.jsx)("br",{}),(t.biomes||[]).length>0&&!c&&Object(M.jsx)(s.a,{onClick:f,children:"Render"})]})]}),Object(M.jsx)("ul",{className:"form-group form-row",style:{justifyContent:"start"},children:Object.entries(w.getBiomesColors(t.biomes)).map((function(e){var t=Object(r.a)(e,2),n=t[0],a=t[1],i=a>>16&255,c=a>>8&255,s=255&a;return Object(M.jsxs)("li",{style:{display:"inline",marginLeft:"8px",marginRight:"4px"},children:[Object(M.jsx)("div",{style:{backgroundColor:Object(N.b)(s<<16|c<<8|i),width:"32px",height:"16px",display:"inline-block",marginRight:"0.5rem",verticalAlign:"middle"}}),n]},n)}))})]})})),I=c.a.memo((function(e){var t=e.children,n=e.numbers,a=void 0===n?[]:n,r=e.onChange,i=e.step,c=function(e,t){r(a.map((function(n,a){return a===t?e:n})))};return Object(M.jsxs)("div",{className:"form-row",children:[Object(M.jsx)("label",{children:t}),"\xa0:\xa0",a.map((function(e,t){return Object(M.jsx)(b.c,{step:i,value:e,onChange:function(e){return c(e,t)}},t)}))]})})),A=n(7),E=n(10),B=n(9),G=c.a.memo((function(e){var t=e.source,n=void 0===t?{type:"minecraft:fixed"}:t,r=e.onChange,c=Object(i.useMemo)((function(){return[{value:"minecraft:checkerboard",label:"Checkerboard"},{value:"minecraft:fixed",label:"Fixed"},{value:"minecraft:multi_noise",label:"Multi noise"},{value:"minecraft:the_end",label:"The end"},{value:"minecraft:vanilla_layered",label:"Vanilla layered"}]}),[]),s=Object(i.useCallback)((function(e){r(Object(a.a)(Object(a.a)({},n),e))}),[r,n]),o=Object(i.useCallback)((function(e){r(Object(a.a)(Object(a.a)({},n),{},{seed:e}))}),[r,n]),l=Object(i.useCallback)((function(e){r({seed:n.seed,type:e.value})}),[r,n.seed]),u=Object(i.useCallback)((function(e){r(Object(a.a)(Object(a.a)({},n),{},{biome:e}))}),[r,n]),b=Object(i.useMemo)((function(){return c.find((function(e){return e.value===n.type}))}),[c,n.type]);return Object(M.jsxs)("fieldset",{children:[Object(M.jsx)("legend",{children:"Biome source"}),Object(M.jsxs)("div",{className:"form-group",children:[Object(M.jsx)("label",{htmlFor:"biome-source-type",children:"Type"}),Object(M.jsx)(A.a,{inputId:"biome-source-type",options:c,value:b,onChange:l})]}),Object(M.jsx)(Z,{value:n.seed,onChange:o}),Object(M.jsx)("hr",{}),"minecraft:checkerboard"===n.type&&Object(M.jsx)(D,{source:n,onChange:s}),"minecraft:fixed"===n.type&&Object(M.jsx)(F,{biome:n.biome,onChange:u}),"minecraft:multi_noise"===n.type&&Object(M.jsx)(R,{source:n,onChange:s}),"minecraft:vanilla_layered"===n.type&&Object(M.jsx)(T,{source:n,onChange:s})]})})),D=c.a.memo((function(e){var t=e.source,n=e.onChange,r=Object(B.b)("biomes"),c=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{biomes:null===e?[]:e.map((function(e){return e.value}))}))}),[n,t]),s=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{scale:e}))}),[n,t]),o=Object(i.useMemo)((function(){return t.biomes||(r.length>0?[r[0].value]:[])}),[r,t.biomes]);return Object(i.useEffect)((function(){Array.isArray(t.biomes)||n({biomes:o,scale:t.scale||2})}),[o,t.biomes,t.scale,n]),Object(M.jsxs)("div",{className:"form-group",children:[Object(M.jsxs)("div",{className:"form-group",children:[Object(M.jsx)("label",{htmlFor:"biomes",children:"Biomes"}),Object(M.jsx)(A.a,{options:r,isMulti:!0,isClearable:!1,value:r.filter((function(e){return o.includes(e.value)})),onChange:c,id:"biomes"})]}),Object(M.jsx)("div",{className:"form-group",children:Object(M.jsxs)(b.c,{id:"scale",value:t.scale,onChange:s,max:62,required:!1,defaultValue:2,children:["Scale (squares of 2",Object(M.jsx)("sup",{children:"scale"})," chunks)"]})}),o.length<1&&Object(M.jsx)("p",{className:"alert--warning",children:"Warning: a dimension must contain at least one biome!"})]})})),F=c.a.memo((function(e){var t=e.biome,n=void 0===t?"minecraft:plains":t,a=e.inline,r=void 0!==a&&a,c=e.onChange,s=Object(B.b)("biomes"),o=Object(i.useCallback)((function(e){c(e.value)}),[c]);return Object(M.jsxs)("div",{className:r?"form-row flex-grow":"form-group",children:[Object(M.jsxs)("label",{htmlFor:"fixed-biome",children:["Biome",r&&" :","\xa0"]}),Object(M.jsx)("div",{className:r?"flex-grow":void 0,children:Object(M.jsx)(A.a,{options:s,value:s.find((function(e){return e.value===n})),onChange:o})})]})})),R=c.a.memo((function(e){var t=e.source,n=void 0===t?o.e:t,c=e.onChange,b=Object(B.b)("biomes"),d=Object(E.c)((function(e){return c(Object(a.a)(Object(a.a)({},n),{},{biomes:e}))}),n.biomes,{biome:"minecraft:plains",parameters:{altitude:0,weirdness:0,offset:0,temperature:.8,humidity:.4}}),f=Object(r.a)(d,4),h=f[0],O=f[1],g=f[2],p=f[3],v=Object(_.a)(),x=Object(r.a)(v,2),y=x[0],C=x[1],k=Object(i.useCallback)((function(e,t){c(Object(a.a)(Object(a.a)({},n),{},Object(u.a)({},e,t)))}),[n,c]),w=Object(i.useContext)(m.a).vanilla.biomes,N=Object(i.useContext)(m.a).custom.biomes,I=Object(i.useContext)(m.a).namespace;Object(i.useEffect)((function(){var e,t=Object(l.a)(o.f);try{for(t.s();!(e=t.n()).done;){var r=e.value;if("undefined"===typeof n[r])return void c(Object(a.a)(Object(a.a)(Object(a.a)({},o.e),n),{},{biomes:h}))}}catch(i){t.e(i)}finally{t.f()}}),[h,c,n]);var A=[];return h.forEach((function(e,t){A.push(Object(M.jsx)(q,{namespace:I,vanilla:w,custom:N,biomesOptions:b,entry:e,onChange:g,children:Object(M.jsx)(s.a,{cat:"danger",onClick:function(e){return p(e,t)},children:"Delete"})},t))})),Object(M.jsxs)(M.Fragment,{children:[Object(M.jsx)("div",{className:"flex-container",style:{alignItems:"baseline"},children:Object(M.jsxs)("h4",{children:["Biomes list",Object(M.jsx)(s.a,{onClick:O,cat:"primary mls",children:"Add biome"}),Object(M.jsx)(s.a,{onClick:C,cat:"secondary",children:"Advanced"})]})}),y&&Object(M.jsx)("div",{className:"grid-2-small-1 has-gutter mbm",children:o.f.map((function(e){return Object(M.jsx)(L,{noise:n[e]||o.e[e],onChange:function(t){return k(e,t)},children:Object(j.b)(e.replace("_"," "))},e)}))}),A,Object(j.g)(h.map((function(e){return e.parameters})))&&Object(M.jsx)("p",{className:"alert--warning",children:"Warning: every biome must have a unique combination of parameters!"}),Object(M.jsx)(S,{source:n})]})})),T=c.a.memo((function(e){var t=e.source,n=e.onChange,r=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{legacy_biome_init_layer:e.target.checked}))}),[n,t]),c=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{large_biomes:e.target.checked}))}),[n,t]);return Object(M.jsxs)("div",{className:"form-row",children:[Object(M.jsx)(b.b,{checked:t.legacy_biome_init_layer||!1,onChange:r,children:"Legacy biome init layer"}),Object(M.jsx)(b.b,{checked:t.large_biomes||!1,onChange:c,children:"Large biomes"})]})})),L=c.a.memo((function(e){var t=e.children,n=e.noise,r=void 0===n?{firstOctave:-7,amplitudes:[1,1]}:n,c=e.onChange,s=Object(i.useCallback)((function(e){c(Object(a.a)(Object(a.a)({},r),{},{firstOctave:e}))}),[r,c]),o=Object(i.useCallback)((function(e){c(Object(a.a)(Object(a.a)({},r),{},{amplitudes:e}))}),[r,c]);return Object(M.jsxs)("fieldset",{style:{margin:0},children:[Object(M.jsx)("legend",{children:t}),Object(M.jsxs)("div",{className:"form-group form-row",children:[Object(M.jsx)(b.c,{id:"firstOctave",value:r.firstOctave,onChange:s,min:-1e3,children:"First octave"}),Object(M.jsx)(I,{numbers:r.amplitudes,step:.1,onChange:o,children:"Amplitudes"})]})]})})),q=c.a.memo((function(e){var t=e.namespace,n=e.vanilla,r=e.custom,c=e.biomesOptions,s=e.entry,o=e.onChange,l=e.children,u=Object(i.useCallback)((function(e){var a=e.value,i=n.find((function(e){return"minecraft:"+e.name===a}))||r.find((function(e){return t+":"+e.key===a}))||{rainfall:0,temperature:0},c={altitude:s.parameters.altitude||0,weirdness:s.parameters.weirdness||0,offset:s.parameters.offset||0,temperature:i.temperature||.8,humidity:i.rainfall||.4};o({biome:a,parameters:c},s)}),[s,r,t,o,n]),j=Object(i.useCallback)((function(e){o({biome:s.biome,parameters:Object(a.a)(Object(a.a)({},s.parameters),e)},s)}),[s,o]),m=Object(i.useMemo)((function(){return c.find((function(e){return e.value===s.biome}))}),[c,s.biome]);return Object(M.jsxs)("div",{className:"form-group",children:[Object(M.jsx)(A.a,{options:c,value:m,onChange:u}),Object(M.jsxs)("div",{className:"form-group form-row",children:[Object(M.jsx)(b.c,{id:"altitude",value:s.parameters.altitude,upChange:j,step:"0.1",min:"-2",max:"2",children:"Altitude"}),Object(M.jsx)(b.c,{id:"weirdness",value:s.parameters.weirdness,upChange:j,step:"0.1",min:"-2",max:"2",children:"Weirdness"}),Object(M.jsx)(b.c,{id:"offset",value:s.parameters.offset,upChange:j,step:"0.1",max:"1",children:"Offset"}),Object(M.jsx)(b.c,{id:"temperature",value:s.parameters.temperature,upChange:j,step:"0.1",min:"-2",max:"2",children:"Temperature"}),Object(M.jsx)(b.c,{id:"humidity",value:s.parameters.humidity,upChange:j,step:"0.1",min:"-2",max:"2",children:"Humidity"}),l]})]})})),P=n(124),W=n(41),X=n(71),U=c.a.memo((function(e){var t=e.settings,n=e.onChange;t=Object(E.e)(t||{structures:{structures:[]},layers:[{block:"minecraft:bedrock",height:1},{block:"minecraft:sandstone",height:70}],biome:"minecraft:plains"},t,n);var r=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{biome:e}))}),[t,n]),c=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{layers:e}))}),[t,n]),s=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{structures:e}))}),[t,n]),o=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{lakes:e.target.checked}))}),[t,n]);return Object(M.jsxs)("div",{className:"form-group",children:[Object(M.jsxs)("div",{className:"form-group form-row",children:[Object(M.jsx)(F,{biome:t.biome,inline:!0,onChange:r}),Object(M.jsx)(b.b,{className:"mls",checked:t.lakes||!1,onChange:o,children:"Lakes"})]}),Object(M.jsx)(Y,{config:t.layers,onChange:c}),Object(M.jsx)(X.a,{data:t.structures,onChange:s})]})})),Y=c.a.memo((function(e){var t=e.config,n=e.onChange,a=Object(E.c)(n,t,{block:"minecraft:grass_block",height:1}),c=Object(r.a)(a,4),o=c[0],l=c[1],u=c[2],b=c[3],j=Object(i.useCallback)((function(e){return!e.target.parentNode.classList.contains("sortable-item")}),[]),m=Object(i.useCallback)((function(e){var t=e.oldIndex,n=e.newIndex;u({oldIndex:o.length-1-t,newIndex:o.length-1-n})}),[o,u]);return Object(M.jsxs)("fieldset",{children:[Object(M.jsxs)("legend",{children:["Layers ",Object(M.jsx)(s.a,{onClick:l,children:"Add layer"})]}),Object(M.jsx)(z,{layers:o,onChange:u,onRemove:b,onSortEnd:m,shouldCancelStart:j})]})})),z=Object(P.a)(c.a.memo((function(e){var t=e.layers,n=e.onChange,a=e.onRemove,r=0;return Object(M.jsx)("ol",{className:"sortable-container",children:t.map((function(e,i){return r+=e.height+1,Object(M.jsx)(H,{i:i,index:t.length-1-i,layer:e,onChange:n,onRemove:a},r)})).reverse()})}))),H=Object(P.b)(c.a.memo((function(e){var t=e.i,n=e.layer,r=e.onChange,c=e.onRemove,o=Object(i.useCallback)((function(e,t){r(Object(a.a)(Object(a.a)({},t),{},{height:e}),t)}),[r]),l=Object(i.useCallback)((function(e,t){r(Object(a.a)(Object(a.a)({},t),{},{block:e}),t)}),[r]);return Object(M.jsx)("div",{className:"sortable-item",children:Object(M.jsxs)("div",{className:"form-group form-row",children:[Object(M.jsx)("div",{className:"flex-grow",children:Object(M.jsx)(W.b,{block:n.block,onChange:function(e){return l(e.value,n)}})}),Object(M.jsx)(b.c,{id:"height",className:"mls",value:n.height,max:256,onChange:function(e){return o(e,n)},children:"Height"}),Object(M.jsx)(s.a,{cat:"danger mlm",onClick:function(e){return c(e,t)},children:"Remove"})]})})}))),J=n(70);function V(e){var t=e.generator,n=e.onChange,c=Object(i.useState)({type:null}),s=Object(r.a)(c,2),l=s[0],u=s[1],b=Object(i.useCallback)((function(e){e.value===l.type?n(l):"minecraft:noise"===e.value?n(o.b.generator):n({type:e.value}),u(t)}),[t,l,n]),j=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{seed:e}))}),[t,n]),m=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{settings:e}))}),[t,n]),d=Object(i.useCallback)((function(e){n(Object(a.a)(Object(a.a)({},t),{},{biome_source:e}))}),[t,n]);return Object(M.jsxs)("fieldset",{children:[Object(M.jsx)("legend",{style:{fontWeight:"normal",width:"28ch",fontSize:"1.05rem"},children:Object(M.jsx)(A.a,{options:o.a,value:o.a.find((function(e){return t.type===e.value})),onChange:b})}),Object(M.jsxs)("div",{className:"form-group",children:["minecraft:noise"===t.type&&Object(M.jsxs)(M.Fragment,{children:[Object(M.jsx)(Z,{value:t.seed,onChange:j}),Object(M.jsx)(J.a,{settings:t.settings,onChange:m}),Object(M.jsx)(G,{source:t.biome_source,onChange:d})]}),"minecraft:flat"===t.type&&Object(M.jsx)(U,{settings:t.settings,onChange:m})]})]})}var Z=c.a.memo((function(e){var t=e.onChange,n=e.value,a=Object(i.useState)(n||286956243),c=Object(r.a)(a,2),s=c[0],o=c[1],l=Object(i.useCallback)((function(e){var n=e.target.value;o(n),t(isNaN(n)?k(n):parseInt(n))}),[t]);return Object(i.useEffect)((function(){"number"!==typeof n&&t(286956243)}),[t,n]),Object(M.jsx)("div",{className:"form-group",children:Object(M.jsx)(b.b,{type:"text",id:"seed",value:s,onChange:l,children:"Seed"})})})),K=n(68),Q=n(22),$=n(23);function ee(e){var t=e.data,n=void 0===t?o.b:t,c=e.onSave,l=Object(i.useState)(n),u=Object(r.a)(l,2),b=u[0],j=u[1],m=Object(i.useCallback)((function(e){j((function(t){return Object(a.a)(Object(a.a)({},t),{},{type:e})}))}),[]),d=Object(i.useCallback)((function(e){j((function(t){return Object(a.a)(Object(a.a)({},t),{},{generator:e})}))}),[]),f=Object(i.useCallback)((function(e){e.preventDefault(),c(Object(a.a)(Object(a.a)({},b),Object.fromEntries(new FormData(e.target))))}),[c,b]);return Object(M.jsxs)("form",{onSubmit:f,children:[Object(M.jsxs)($.a,{example:"blue_dimension",type:"dimensions",value:n.key,onSelectLoad:function(e){"minecraft:noise"===b.generator.type?(e.generator.seed=b.generator.seed,e.generator.biome_source.seed=b.generator.biome_source.seed):(e.generator.seed=286956243,e.generator.biome_source.seed=286956243),j(e)},children:["dimension",Object(M.jsx)(Q.a,{data:b})]}),Object(M.jsx)(K.a,{type:b.type,onChange:m}),Object(M.jsx)(V,{generator:b.generator,onChange:d}),Object(M.jsx)(s.a,{type:"submit",children:"Save"})]})}t.default=ee}}]);
//# sourceMappingURL=4.63d6071b.chunk.js.map