(this.webpackJsonpworldgen=this.webpackJsonpworldgen||[]).push([[5],{92:function(e,a,t){"use strict";t.r(a),t.d(a,"Biome",(function(){return W}));var n=t(1),r=t(2),l=t(3),c=t(0),o=t.n(c),i=[[],["minecraft:lake_water","minecraft:lake_lava"],[],["minecraft:monster_room"],[],[],["minecraft:ore_dirt","minecraft:ore_gravel","minecraft:ore_granite","minecraft:ore_diorite","minecraft:ore_andesite","minecraft:ore_coal","minecraft:ore_iron","minecraft:ore_gold","minecraft:ore_redstone","minecraft:ore_diamond","minecraft:ore_lapis","minecraft:disk_sand","minecraft:disk_clay","minecraft:disk_gravel"],[],["minecraft:patch_tall_grass_2","minecraft:plain_vegetation","minecraft:flower_plain_decorated","minecraft:patch_grass_plain","minecraft:brown_mushroom_normal","minecraft:red_mushroom_normal","minecraft:patch_sugar_cane","minecraft:patch_pumpkin","minecraft:spring_water","minecraft:spring_lava"],["minecraft:freeze_top_layer"]],u=["minecraft:village_plains","minecraft:pillager_outpost","minecraft:mineshaft","minecraft:stronghold","minecraft:ruined_portal"],m={ambient:[{type:"minecraft:bat",weight:10,minCount:8,maxCount:8}],creature:[{type:"minecraft:sheep",weight:12,minCount:4,maxCount:4},{type:"minecraft:pig",weight:10,minCount:4,maxCount:4},{type:"minecraft:chicken",weight:10,minCount:4,maxCount:4},{type:"minecraft:cow",weight:8,minCount:4,maxCount:4},{type:"minecraft:horse",weight:5,minCount:2,maxCount:6},{type:"minecraft:donkey",weight:1,minCount:1,maxCount:3}],misc:[],monster:[{type:"minecraft:spider",weight:100,minCount:4,maxCount:4},{type:"minecraft:zombie",weight:95,minCount:4,maxCount:4},{type:"minecraft:zombie_villager",weight:5,minCount:1,maxCount:1},{type:"minecraft:skeleton",weight:100,minCount:4,maxCount:4},{type:"minecraft:creeper",weight:100,minCount:4,maxCount:4},{type:"minecraft:slime",weight:100,minCount:4,maxCount:4},{type:"minecraft:enderman",weight:10,minCount:1,maxCount:4},{type:"minecraft:witch",weight:5,minCount:1,maxCount:1}],water_ambient:[],water_creature:[]},s={effects:{mood_sound:{sound:"minecraft:ambient.cave",tick_delay:6e3,block_search_extent:8,offset:2},sky_color:7907327,fog_color:12638463,water_color:4159204,water_fog_color:329011},carvers:{air:["minecraft:cave","minecraft:canyon"]},starts:u,features:i,spawners:m,category:"plains",precipitation:"rain",surface_builder:"minecraft:grass",scale:.05,downfall:.4,depth:.12,temperature:.8,player_spawn_friendly:!0,spawn_costs:{}},f=["ambient_entity_effect","angry_villager","ash","barrier","block","bubble","bubble_column_up","bubble_pop","campfire_cosy_smoke","campfire_signal_smoke","cloud","composter","crimson_spore","crit","current_down","damage_indicator","dolphin","dragon_breath","dripping_honey","dripping_lava","dripping_obsidian_tear","dripping_water","dust","effect","elder_guardian","enchant","enchanted_hit","end_rod","entity_effect","explosion","explosion_emitter","falling_dust","falling_honey","falling_lava","falling_nectar","falling_obsidian_tear","falling_water","firework","fishing","flame","flash","happy_villager","heart","instant_effect","item","item_slime","item_snowball","landing_honey","landing_lava","landing_obsidian_tear","large_smoke","lava","mycelium","nautilus","note","poof","portal","rain","reverse_portal","smoke","sneeze","soul","soul_fire_flame","spit","splash","squid_ink","sweep_attack","totem_of_undying","underwater","warped_spore","white_ash","witch"].map((function(e){return{value:"minecraft:"+e,label:e}})),b={options:{type:"minecraft:crimson_spore"},probability:.015},p=t(33),d=t(13),g=t(7),_=t(5),h=t(6),v=o.a.memo((function(e){var a=e.effects,t=e.onChange,i=Object(c.useState)(a),u=Object(r.a)(i,2),m=u[0],s=u[1],f=Object(c.useState)(a.particle),d=Object(r.a)(f,2),h=d[0],v=d[1],j=Object(c.useContext)(g.a).vanilla.sounds,E=Object(c.useCallback)((function(e){t(Object(n.a)(Object(n.a)({},a),e))}),[a,t]),y=Object(c.useCallback)((function(e){t(Object(n.a)(Object(n.a)({},a),e)),s(Object(n.a)(Object(n.a)({},m),e))}),[m,a,t]),w=Object(c.useCallback)((function(e){t(null===e?function(e){e.ambient_sound;return Object(p.a)(e,["ambient_sound"])}(a):Object(n.a)(Object(n.a)({},a),{},{ambient_sound:e.value}))}),[a,t]),k=Object(c.useCallback)((function(e){null===e?t(function(e){e.mood_sound;return Object(p.a)(e,["mood_sound"])}(a)):"undefined"===typeof a.mood_sound?t(Object(n.a)(Object(n.a)({},a),{},{mood_sound:Object(n.a)({tick_delay:6e3,block_search_extent:8,offset:2},e)})):t(Object(n.a)(Object(n.a)({},a),{},{mood_sound:Object(n.a)(Object(n.a)({},a.mood_sound),e)}))}),[a,t]),x=Object(c.useCallback)((function(e){t(Object(n.a)(Object(n.a)({},a),{},{particle:e})),v(e)}),[a,t]),N=Object(c.useCallback)((function(e){e.target.checked?t(Object(n.a)(Object(n.a)({},a),{},{foliage_color:m.foliage_color||10387789,grass_color:m.grass_color||9470285})):t(function(e){e.foliage_color,e.grass_color;return Object(p.a)(e,["foliage_color","grass_color"])}(a))}),[m,a,t]),S=Object(c.useCallback)((function(e){e.target.checked?t(Object(n.a)(Object(n.a)({},a),{},{particle:h||b})):t(function(e){e.particle;return Object(p.a)(e,["particle"])}(a))}),[t,a,h]),F=a.hasOwnProperty("foliage_color")||a.hasOwnProperty("grass_color"),M=a.hasOwnProperty("particle");return o.a.createElement(o.a.Fragment,null,o.a.createElement("fieldset",null,o.a.createElement("legend",null,"Biome effects"),o.a.createElement("div",{className:"form-group form-row"},o.a.createElement(l.a,{id:"sky_color",value:a.sky_color,upChange:E},"Sky color"),o.a.createElement(l.a,{id:"fog_color",value:a.fog_color,upChange:E},"Fog color"),o.a.createElement(l.a,{id:"water_color",value:a.water_color,upChange:E},"Water color"),o.a.createElement(l.a,{id:"water_fog_color",value:a.water_fog_color,upChange:E},"Water fog color"),F&&o.a.createElement(o.a.Fragment,null,o.a.createElement(l.a,{id:"foliage_color",value:a.foliage_color||10387789,upChange:y},"Foliage color"),o.a.createElement(l.a,{id:"grass_color",value:a.grass_color||9470285,upChange:y},"Grass color")),o.a.createElement(l.b,{id:"block-toggle",checked:F,onChange:N},"Optionals"),o.a.createElement(l.b,{id:"particle",checked:M,onChange:S},"Particle")),M&&o.a.createElement(O,{particle:a.particle,onChange:x})),o.a.createElement("fieldset",null,o.a.createElement("legend",null,"Optionals sounds"),o.a.createElement("div",{className:"form-group form-row"},"Ambient :",o.a.createElement("div",{style:{flexGrow:.95,flexShrink:1}},o.a.createElement(_.a,{options:j,value:j.find((function(e){return a.ambient_sound===e.value})),onChange:w,isClearable:!0}))),o.a.createElement(C,{options:j,sound:a.mood_sound,onChange:k})))})),C=o.a.memo((function(e){var a=e.onChange,t=e.options,n=e.sound,r=Object(c.useCallback)((function(e){a(null===e?null:{sound:e.value})}),[a]);return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"form-group form-row"},"Mood :",o.a.createElement("div",{style:{flexGrow:.95,flexShrink:1}},o.a.createElement(_.a,{options:t,value:t.find((function(e){return(n||{}).sound===e.value})),onChange:r,isClearable:!0}))),"object"===typeof n&&o.a.createElement("div",{className:"form-row",style:{marginTop:"0.5rem"}},o.a.createElement(l.c,{id:"tick_delay",value:n.tick_delay,upChange:a,className:"mls"},"Tick delay"),o.a.createElement(l.c,{id:"block_search_extent",value:n.block_search_extent,upChange:a,className:"mls"},"Block search extent"),o.a.createElement(l.c,{id:"offset",value:n.offset,upChange:a,step:.1,className:"mls"},"Offset")))})),O=o.a.memo((function(e){var a=e.onChange,t=e.particle;t=Object(h.e)(t||b,t,a);var r=Object(c.useCallback)((function(e){a(Object(n.a)(Object(n.a)({},t),{},{options:{type:e.value}}))}),[t,a]),i=Object(c.useCallback)((function(e){a(Object(n.a)(Object(n.a)({},t),{},{options:Object(n.a)(Object(n.a)({},t.options),e)}))}),[t,a]),u=Object(c.useCallback)((function(e){a(Object(n.a)(Object(n.a)({},t),{},{options:Object(n.a)(Object(n.a)({},t.options),e)}))}),[t,a]),m=Object(c.useCallback)((function(e){a(Object(n.a)(Object(n.a)({},t),{},{options:Object(n.a)(Object(n.a)({},t.options),{},{scale:e})}))}),[t,a]),s=Object(c.useCallback)((function(e){a(Object(n.a)(Object(n.a)({},t),{},{probability:e}))}),[t,a]),p=t.options;return o.a.createElement("div",{className:"form-group form-row"},o.a.createElement("div",{style:{flexGrow:.95,flexShrink:1}},o.a.createElement(_.a,{options:f,value:f.find((function(e){return p.type===e.value})),onChange:r})),("minecraft:block"===p.type||"minecraft:falling_dust"===p.type)&&o.a.createElement("div",{style:{flexGrow:1}},o.a.createElement(d.a,{block:p,onChange:i})),"minecraft:dust"===p.type&&o.a.createElement(o.a.Fragment,null,o.a.createElement(j,{r:p.r,g:p.g,b:p.b,onChange:u}),o.a.createElement(l.c,{id:"scale",value:p.scale,onChange:m,defaultValue:"1",step:"0.1",className:"mls"},"Scale")),o.a.createElement(l.c,{id:"probability",value:t.probability,onChange:s,step:"0.005",className:"mlm"},"Probability"))})),j=o.a.memo((function(e){var a=e.r,t=e.g,n=e.b,r=e.onChange,i=Object(c.useCallback)((function(e){r({r:(e>>16&255)/255,g:(e>>8&255)/255,b:(255&e)/255})}),[r]),u=void 0;return"number"===typeof a&&"number"===typeof t&&"number"===typeof n&&(u=(a=255*a&255)<<16|(t=255*t&255)<<8|(n=255*n&255)),o.a.createElement(l.a,{value:u,defaultValue:230512,onChange:i,className:"mls"},"Color")})),E=t(8),y=t(4),w=t(11),k=o.a.memo((function(e){var a=e.onChange,t=e.data,r=Object(h.e)(t||m,t,a),l=Object(c.useContext)(g.a).vanilla.entities,i=Object(c.useCallback)((function(e,t){a(Object(n.a)(Object(n.a)({},r),{},Object(E.a)({},e,t)))}),[r,a]);return o.a.createElement("div",null,o.a.createElement(x,{group:"ambient",data:r.ambient,onChange:i,entities:l},"Ambient"),o.a.createElement(x,{group:"creature",data:r.creature,onChange:i,entities:l},"Creature"),o.a.createElement(x,{group:"misc",data:r.misc,onChange:i,entities:l},"Miscellaneous"),o.a.createElement(x,{group:"monster",data:r.monster,onChange:i,entities:l},"Monster"),o.a.createElement(x,{group:"water_ambient",data:r.water_ambient,onChange:i,entities:l},"Water ambient"),o.a.createElement(x,{group:"water_creature",data:r.water_creature,onChange:i,entities:l},"Water creature"))})),x=o.a.memo((function(e){var a=e.children,t=e.entities,n=e.data,l=void 0===n?[]:n,i=e.group,u=e.onChange,m=Object(w.b)(),s=Object(r.a)(m,2),f=s[0],b=s[1],p=f?"Less...":"More...",d=Object(h.c)((function(e){return u(i,e)}),l,(function(e){return{type:(t.filter((function(a){return!e.some((function(e){return e.type===a.value}))}))[0]||{value:"minecraft:cow"}).value,minCount:1,maxCount:1,weight:1}}),!0),g=Object(r.a)(d,4),_=g[0],v=g[1],C=g[2],O=g[3],j=Object(c.useCallback)((function(e){v(e),f||b()}),[v,b,f]);return f?o.a.createElement("div",null,o.a.createElement("div",{className:"toggle-label"},a,o.a.createElement("div",{className:"btn-group"},t.length>_.length&&o.a.createElement(y.a,{onClick:j},"Add"),_.length>0&&o.a.createElement(y.a,{cat:"secondary",onClick:b},p))),_.map((function(e,a){var n=t.filter((function(a){return e.type===a.value||!_.some((function(e){return e.type===a.value}))}));return o.a.createElement(N,{data:e,key:e.type,onChange:C,onDelete:O,index:a,options:n})}))):o.a.createElement("div",{className:"toggle-label"},a,o.a.createElement("div",{className:"btn-group"},_.length>0&&o.a.createElement(y.a,{cat:"secondary",onClick:b},p),_.length<1&&o.a.createElement(y.a,{onClick:j},"Add")))})),N=o.a.memo((function(e){var a=e.data,t=e.index,r=e.options,i=e.onChange,u=e.onDelete,m=Object(c.useCallback)((function(e){i(Object(n.a)(Object(n.a)({},a),{},{type:e.value}),a)}),[a,i]),s=Object(c.useCallback)((function(e){i(Object(n.a)(Object(n.a)({},a),e),a)}),[a,i]),f=function(e){var t=Object.keys(e)[0],r=e[t];("minCount"===t&&r<=a.maxCount||"maxCount"===t&&r>=a.minCount)&&i(Object(n.a)(Object(n.a)({},a),{},Object(E.a)({},t,r)),a)},b=Object(c.useCallback)((function(e){u(e,t)}),[t,u]),p=Object(c.useMemo)((function(){return r.find((function(e){return e.value===a.type}))}),[a.type,r]);return o.a.createElement("div",null,o.a.createElement("div",{className:"form-group"},o.a.createElement("label",null,"Mob type")," : ",o.a.createElement(_.a,{options:r,value:p,onChange:m})),o.a.createElement("div",{className:"form-group form-row"},o.a.createElement(l.c,{id:"weight",value:a.weight,upChange:s},"Weight"),o.a.createElement(l.c,{id:"minCount",value:a.minCount,max:a.maxCount,upChange:f},"Min count"),o.a.createElement(l.c,{id:"maxCount",value:a.maxCount,min:a.minCount,upChange:f},"Max count"),o.a.createElement("div",{className:"form-inline"},o.a.createElement(y.a,{cat:"danger",onClick:b},"Delete"))),o.a.createElement("hr",null))})),S=o.a.memo((function(e){var a=e.onChange,t=e.starts;t=Object(h.e)(t||u,t,a);var n=Object(c.useCallback)((function(e){a(null===e?[]:e.map((function(e){return e.value})))}),[a]),r=Object(c.useMemo)((function(){return["pillager_outpost","mineshaft","mineshaft_mesa","mansion","jungle_pyramid","desert_pyramid","igloo","shipwreck","shipwreck_beached","swamp_hut","stronghold","monument","ocean_ruin_cold","ocean_ruin_warm","fortress","nether_fossil","end_city","buried_treasure","bastion_remnant","village_plains","village_desert","village_savanna","village_snovy","village_taiga","ruined_portal","ruined_portal_desert","ruined_portal_jungle","ruined_portal_swamp","ruined_portal_mountain","ruined_portal_ocean","ruined_portal_nether"].map((function(e){return{value:"minecraft:"+e,label:"minecraft:"+e}}))}),[]);return o.a.createElement("div",{className:"form-group"},o.a.createElement("label",{htmlFor:"starts"},"Structures"),o.a.createElement(_.a,{isMulti:!0,id:"starts",options:r,onChange:n,value:r.filter((function(e){return t.includes(e.value)}))}))})),F=t(48),M=t(9),D=o.a.memo((function(e){var a=e.onChange,t=e.features,n=Object(c.useCallback)((function(e,n){a(t.map((function(a,t){return e===t?n:a})))}),[t,a]);return Object(h.e)(t||i,t,a),o.a.createElement("div",{className:"form-group"},o.a.createElement("label",null,"Features"),o.a.createElement("p",{className:"help"},o.a.createElement("small",{className:"text-muted"},"Each generation feature is associated with a priority. The higher the priority, the later the feature will be applied.")),o.a.createElement("ol",null,t.map((function(e,a){return o.a.createElement("li",{key:a},o.a.createElement(P,{value:e,onChange:n,priority:a}))}))))})),P=o.a.memo((function(e){var a=e.onChange,t=e.priority,n=e.value,r=Object(M.b)("features"),l=Object(c.useCallback)((function(e){a(t,null===e?[]:e.map((function(e){return e.value})))}),[a,t]);return o.a.createElement(_.a,{isMulti:!0,options:r,onChange:l,defaultValue:r.filter((function(e){return n.includes(e.value)}))})})),T=t(19),G=t(16),B=t(17);function W(e){var a=e.data,t=void 0===a?s:a,i=e.onSave,u=Object(c.useState)(t),m=Object(r.a)(u,2),f=m[0],b=m[1],p=Object(c.useCallback)((function(e){b((function(a){return Object(n.a)(Object(n.a)({},a),{},{carvers:e})}))}),[]),d=Object(c.useCallback)((function(e){b((function(a){return Object(n.a)(Object(n.a)({},a),{},{starts:e})}))}),[]),g=Object(c.useCallback)((function(e){b((function(a){return Object(n.a)(Object(n.a)({},a),{},{effects:e})}))}),[]),_=Object(c.useCallback)((function(e){b((function(a){return Object(n.a)(Object(n.a)({},a),{},{features:e})}))}),[]),h=Object(c.useCallback)((function(e){b((function(a){return Object(n.a)(Object(n.a)({},a),{},{spawners:e})}))}),[]),C=Object(c.useCallback)((function(e){b((function(a){return Object(n.a)(Object(n.a)({},a),{},{surface_builder:e.value})}))}),[]),O=Object(c.useCallback)((function(e){b((function(a){return Object(n.a)(Object(n.a)({},a),{},{precipitation:e.value})}))}),[]),j=Object(c.useCallback)((function(e){b((function(a){return Object(n.a)(Object(n.a)({},a),{},{category:e.value})}))}),[]),E=Object(c.useCallback)((function(e){b((function(a){return Object(n.a)(Object(n.a)({},a),e)}))}),[]),w=Object(c.useCallback)((function(e){var a=e.target.checked;b((function(e){return Object(n.a)(Object(n.a)({},e),{},{player_spawn_friendly:a})}))}),[]),x=Object(c.useCallback)((function(e){e.preventDefault();var a=Object.fromEntries(new FormData(e.target));i(Object(n.a)(Object(n.a)({},f),a))}),[i,f]);return o.a.createElement("form",{onSubmit:x},o.a.createElement(B.a,{example:"arctic",type:"biomes",value:f.key,expectBreakage:"undefined"!==typeof t.key,onSelectLoad:b},"biome",o.a.createElement(G.a,{data:f})),o.a.createElement(v,{effects:f.effects,onChange:g}),o.a.createElement("fieldset",null,o.a.createElement(z,{category:f.category,onChange:j}),o.a.createElement(A,{value:f.precipitation,onChange:O})),o.a.createElement("fieldset",null,o.a.createElement("legend",null,"Generation"),o.a.createElement(V,{value:f.surface_builder,onChange:C}),o.a.createElement(S,{starts:f.starts,onChange:d}),o.a.createElement(D,{features:f.features,onChange:_})),o.a.createElement(F.a,{carvers:f.carvers,onChange:p}),o.a.createElement("fieldset",null,o.a.createElement("legend",null,"Creatures"),o.a.createElement(k,{data:f.spawners,onChange:h})),o.a.createElement("fieldset",null,o.a.createElement("legend",null,"Settings"),o.a.createElement("div",{className:"form-group form-row"},o.a.createElement(l.b,{id:"player_spawn_friendly",checked:"boolean"!==typeof f.player_spawn_friendly||f.player_spawn_friendly,onChange:w},"Player spawn friendly"),o.a.createElement(l.c,{id:"creature_spawn_probability",value:f.creature_spawn_probability,defaultValue:.1,step:.1,required:!1,upChange:E},"Creature spawn probability")),o.a.createElement("div",{className:"form-group form-row"},o.a.createElement(l.c,{id:"scale",value:f.scale||.05,min:T.b,step:.05,upChange:E},"Scale"),o.a.createElement(l.c,{id:"downfall",value:f.downfall||.4,min:T.b,step:.1,upChange:E},"Downfall"),o.a.createElement(l.c,{id:"depth",value:f.depth||.12,min:T.b,step:.01,upChange:E},"Depth"),o.a.createElement(l.c,{id:"temperature",value:f.temperature||.8,min:T.b,step:.1,upChange:E},"Temperature"),o.a.createElement("p",{className:"mts"},o.a.createElement("small",{className:"text-muted"},"The ",o.a.createElement("em",null,"scale")," parameter defines terrain amplitude, ",o.a.createElement("em",null,"downfall")," controls grass and foliage color, ",o.a.createElement("em",null,"depth")," is the difference from sea level, ",o.a.createElement("em",null,"temperature")," controls some gameplay features like whether snow golems take damage. The default values are those of the plains biome.")))),o.a.createElement(y.a,{type:"submit"},"Save"))}var z=o.a.memo((function(e){var a=e.category,t=void 0===a?"plains":a,n=e.onChange,r=[{value:"beach",label:"Beach"},{value:"desert",label:"Desert"},{value:"extreme_hills",label:"Extreme hills"},{value:"forest",label:"Forest"},{value:"icy",label:"Icy"},{value:"jungle",label:"Jungle"},{value:"mesa",label:"Mesa"},{value:"nether",label:"Nether"},{value:"none",label:"None"},{value:"ocean",label:"Ocean"},{value:"plains",label:"Plains"},{value:"river",label:"River"},{value:"savanna",label:"Savanna"},{value:"swamp",label:"Swamp"},{value:"taiga",label:"Taiga"},{value:"the_end",label:"The end"}];return o.a.createElement("div",{className:"form-group"},o.a.createElement("label",{htmlFor:"category"},"Category"),o.a.createElement(_.a,{options:r,value:r.find((function(e){return e.value===t})),onChange:n}))})),A=o.a.memo((function(e){var a=e.onChange,t=e.value,n=void 0===t?"rain":t,r=[{value:"none",label:"None"},{value:"rain",label:"Rain"},{value:"snow",label:"Snow"}];return o.a.createElement("div",{className:"form-group"},o.a.createElement("label",{htmlFor:"precipitation"},"Precipitation"),o.a.createElement(_.a,{options:r,value:r.find((function(e){return e.value===n})),onChange:a}))})),V=o.a.memo((function(e){var a=e.onChange,t=e.value,n=void 0===t?"minecraft:grass":t,r=Object(M.b)("surfaces");return o.a.createElement("div",{className:"form-group"},o.a.createElement("label",{htmlFor:"surface_builder"},"Surface builder"),o.a.createElement(_.a,{options:r,value:r.find((function(e){return e.value===n})),onChange:a}))}));a.default=W}}]);
//# sourceMappingURL=5.d627f5c4.chunk.js.map