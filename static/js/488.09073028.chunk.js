"use strict";(self.webpackChunkcrisis_connections_client=self.webpackChunkcrisis_connections_client||[]).push([[488],{2488:(e,n,t)=>{t.r(n),t.d(n,{CLSThresholds:()=>I,FCPThresholds:()=>S,FIDThresholds:()=>N,INPThresholds:()=>G,LCPThresholds:()=>X,TTFBThresholds:()=>$,getCLS:()=>F,getFCP:()=>P,getFID:()=>R,getINP:()=>W,getLCP:()=>Z,getTTFB:()=>ne,onCLS:()=>F,onFCP:()=>P,onFID:()=>R,onINP:()=>W,onLCP:()=>Z,onTTFB:()=>ne});var i,r,o,a,c,u=-1,s=function(e){addEventListener("pageshow",(function(n){n.persisted&&(u=n.timeStamp,e(n))}),!0)},f=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},d=function(){var e=f();return e&&e.activationStart||0},l=function(e,n){var t=f(),i="navigate";return u>=0?i="back-forward-cache":t&&(document.prerendering||d()>0?i="prerender":document.wasDiscarded?i="restore":t.type&&(i=t.type.replace(/_/g,"-"))),{name:e,value:void 0===n?-1:n,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:i}},p=function(e,n,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var i=new PerformanceObserver((function(e){Promise.resolve().then((function(){n(e.getEntries())}))}));return i.observe(Object.assign({type:e,buffered:!0},t||{})),i}}catch(e){}},v=function(e,n,t,i){var r,o;return function(a){n.value>=0&&(a||i)&&((o=n.value-(r||0))||void 0===r)&&(r=n.value,n.delta=o,n.rating=function(e,n){return e>n[1]?"poor":e>n[0]?"needs-improvement":"good"}(n.value,t),e(n))}},m=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}))},h=function(e){var n=function(n){"pagehide"!==n.type&&"hidden"!==document.visibilityState||e(n)};addEventListener("visibilitychange",n,!0),addEventListener("pagehide",n,!0)},g=function(e){var n=!1;return function(t){n||(e(t),n=!0)}},T=-1,y=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},C=function(e){"hidden"===document.visibilityState&&T>-1&&(T="visibilitychange"===e.type?e.timeStamp:0,L())},E=function(){addEventListener("visibilitychange",C,!0),addEventListener("prerenderingchange",C,!0)},L=function(){removeEventListener("visibilitychange",C,!0),removeEventListener("prerenderingchange",C,!0)},w=function(){return T<0&&(T=y(),E(),s((function(){setTimeout((function(){T=y(),E()}),0)}))),{get firstHiddenTime(){return T}}},b=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e()},S=[1800,3e3],P=function(e,n){n=n||{},b((function(){var t,i=w(),r=l("FCP"),o=p("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(o.disconnect(),e.startTime<i.firstHiddenTime&&(r.value=Math.max(e.startTime-d(),0),r.entries.push(e),t(!0)))}))}));o&&(t=v(e,r,S,n.reportAllChanges),s((function(i){r=l("FCP"),t=v(e,r,S,n.reportAllChanges),m((function(){r.value=performance.now()-i.timeStamp,t(!0)}))})))}))},I=[.1,.25],F=function(e,n){n=n||{},P(g((function(){var t,i=l("CLS",0),r=0,o=[],a=function(e){e.forEach((function(e){if(!e.hadRecentInput){var n=o[0],t=o[o.length-1];r&&e.startTime-t.startTime<1e3&&e.startTime-n.startTime<5e3?(r+=e.value,o.push(e)):(r=e.value,o=[e])}})),r>i.value&&(i.value=r,i.entries=o,t())},c=p("layout-shift",a);c&&(t=v(e,i,I,n.reportAllChanges),h((function(){a(c.takeRecords()),t(!0)})),s((function(){r=0,i=l("CLS",0),t=v(e,i,I,n.reportAllChanges),m((function(){return t()}))})),setTimeout(t,0))})))},A={passive:!0,capture:!0},k=new Date,D=function(e,n){i||(i=n,r=e,o=new Date,x(removeEventListener),M())},M=function(){if(r>=0&&r<o-k){var e={entryType:"first-input",name:i.type,target:i.target,cancelable:i.cancelable,startTime:i.timeStamp,processingStart:i.timeStamp+r};a.forEach((function(n){n(e)})),a=[]}},B=function(e){if(e.cancelable){var n=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,n){var t=function(){D(e,n),r()},i=function(){r()},r=function(){removeEventListener("pointerup",t,A),removeEventListener("pointercancel",i,A)};addEventListener("pointerup",t,A),addEventListener("pointercancel",i,A)}(n,e):D(n,e)}},x=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(n){return e(n,B,A)}))},N=[100,300],R=function(e,n){n=n||{},b((function(){var t,o=w(),c=l("FID"),u=function(e){e.startTime<o.firstHiddenTime&&(c.value=e.processingStart-e.startTime,c.entries.push(e),t(!0))},f=function(e){e.forEach(u)},d=p("first-input",f);t=v(e,c,N,n.reportAllChanges),d&&h(g((function(){f(d.takeRecords()),d.disconnect()}))),d&&s((function(){var o;c=l("FID"),t=v(e,c,N,n.reportAllChanges),a=[],r=-1,i=null,x(addEventListener),o=u,a.push(o),M()}))}))},_=0,H=1/0,O=0,q=function(e){e.forEach((function(e){e.interactionId&&(H=Math.min(H,e.interactionId),O=Math.max(O,e.interactionId),_=O?(O-H)/7+1:0)}))},j=function(){return c?_:performance.interactionCount||0},z=function(){"interactionCount"in performance||c||(c=p("event",q,{type:"event",buffered:!0,durationThreshold:0}))},G=[200,500],J=0,K=function(){return j()-J},Q=[],U={},V=function(e){var n=Q[Q.length-1],t=U[e.interactionId];if(t||Q.length<10||e.duration>n.latency){if(t)t.entries.push(e),t.latency=Math.max(t.latency,e.duration);else{var i={id:e.interactionId,latency:e.duration,entries:[e]};U[i.id]=i,Q.push(i)}Q.sort((function(e,n){return n.latency-e.latency})),Q.splice(10).forEach((function(e){delete U[e.id]}))}},W=function(e,n){n=n||{},b((function(){var t;z();var i,r=l("INP"),o=function(e){e.forEach((function(e){e.interactionId&&V(e),"first-input"===e.entryType&&!Q.some((function(n){return n.entries.some((function(n){return e.duration===n.duration&&e.startTime===n.startTime}))}))&&V(e)}));var n,t=(n=Math.min(Q.length-1,Math.floor(K()/50)),Q[n]);t&&t.latency!==r.value&&(r.value=t.latency,r.entries=t.entries,i())},a=p("event",o,{durationThreshold:null!==(t=n.durationThreshold)&&void 0!==t?t:40});i=v(e,r,G,n.reportAllChanges),a&&("PerformanceEventTiming"in window&&"interactionId"in PerformanceEventTiming.prototype&&a.observe({type:"first-input",buffered:!0}),h((function(){o(a.takeRecords()),r.value<0&&K()>0&&(r.value=0,r.entries=[]),i(!0)})),s((function(){Q=[],J=j(),r=l("INP"),i=v(e,r,G,n.reportAllChanges)})))}))},X=[2500,4e3],Y={},Z=function(e,n){n=n||{},b((function(){var t,i=w(),r=l("LCP"),o=function(e){var n=e[e.length-1];n&&n.startTime<i.firstHiddenTime&&(r.value=Math.max(n.startTime-d(),0),r.entries=[n],t())},a=p("largest-contentful-paint",o);if(a){t=v(e,r,X,n.reportAllChanges);var c=g((function(){Y[r.id]||(o(a.takeRecords()),a.disconnect(),Y[r.id]=!0,t(!0))}));["keydown","click"].forEach((function(e){addEventListener(e,(function(){return setTimeout(c,0)}),!0)})),h(c),s((function(i){r=l("LCP"),t=v(e,r,X,n.reportAllChanges),m((function(){r.value=performance.now()-i.timeStamp,Y[r.id]=!0,t(!0)}))}))}}))},$=[800,1800],ee=function e(n){document.prerendering?b((function(){return e(n)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),!0):setTimeout(n,0)},ne=function(e,n){n=n||{};var t=l("TTFB"),i=v(e,t,$,n.reportAllChanges);ee((function(){var r=f();if(r){var o=r.responseStart;if(o<=0||o>performance.now())return;t.value=Math.max(o-d(),0),t.entries=[r],i(!0),s((function(){t=l("TTFB",0),(i=v(e,t,$,n.reportAllChanges))(!0)}))}}))}}}]);
//# sourceMappingURL=488.09073028.chunk.js.map