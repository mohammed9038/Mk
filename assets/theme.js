/*!
 * enquire.min.js
 */
/*!
 * enquire.js v2.1.2 - Awesome Media Queries in JavaScript
 * Copyright (c) 2014 Nick Williams - http://wicky.nillia.ms/enquire.js
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
!function(e,t,n){var i=window.matchMedia;"undefined"!=typeof module&&module.exports?module.exports=n(i):"function"==typeof define&&define.amd?define(function(){return t[e]=n(i)}):t[e]=n(i)}("enquire",this,function(e){"use strict";function t(e,t){var n,i=0,o=e.length;for(i;o>i&&(n=t(e[i],i),n!==!1);i++);}function n(e){return"[object Array]"===Object.prototype.toString.apply(e)}function i(e){return"function"==typeof e}function o(e){this.options=e,!e.deferSetup&&this.setup()}function r(t,n){this.query=t,this.isUnconditional=n,this.handlers=[],this.mql=e(t);var i=this;this.listener=function(e){i.mql=e,i.assess()},this.mql.addListener(this.listener)}function s(){if(!e)throw new Error("matchMedia not present, legacy browsers require a polyfill");this.queries={},this.browserIsIncapable=!e("only all").matches}return o.prototype={setup:function(){this.options.setup&&this.options.setup(),this.initialised=!0},on:function(){!this.initialised&&this.setup(),this.options.match&&this.options.match()},off:function(){this.options.unmatch&&this.options.unmatch()},destroy:function(){this.options.destroy?this.options.destroy():this.off()},equals:function(e){return this.options===e||this.options.match===e}},r.prototype={addHandler:function(e){var t=new o(e);this.handlers.push(t),this.matches()&&t.on()},removeHandler:function(e){var n=this.handlers;t(n,function(t,i){return t.equals(e)?(t.destroy(),!n.splice(i,1)):void 0})},matches:function(){return this.mql.matches||this.isUnconditional},clear:function(){t(this.handlers,function(e){e.destroy()}),this.mql.removeListener(this.listener),this.handlers.length=0},assess:function(){var e=this.matches()?"on":"off";t(this.handlers,function(t){t[e]()})}},s.prototype={register:function(e,o,s){var a=this.queries,l=s&&this.browserIsIncapable;return a[e]||(a[e]=new r(e,l)),i(o)&&(o={match:o}),n(o)||(o=[o]),t(o,function(t){i(t)&&(t={match:t}),a[e].addHandler(t)}),this},unregister:function(e,t){var n=this.queries[e];return n&&(t?n.removeHandler(t):(n.clear(),delete this.queries[e])),this}},new s}),/*!
 * jquery.min.js
 */
/*!
 * jquery.zoom.min.js
 */
/*!
	Zoom 1.7.21
	license: MIT
	http://www.jacklmoore.com/zoom
*/
function(e){var t={url:!1,callback:!1,target:!1,duration:120,on:"mouseover",touch:!0,onZoomIn:!1,onZoomOut:!1,magnify:1};e.zoom=function(t,n,i,o){var r,s,a,l,u,c,d,p=e(t),f=p.css("position"),h=e(n);return t.style.position=/(absolute|fixed)/.test(f)?f:"relative",t.style.overflow="hidden",i.style.width=i.style.height="",e(i).addClass("zoomImg").css({position:"absolute",top:0,left:0,opacity:0,width:i.width*o,height:i.height*o,border:"none",maxWidth:"none",maxHeight:"none"}).appendTo(t),{init:function(){s=p.outerWidth(),r=p.outerHeight(),n===t?(l=s,a=r):(l=h.outerWidth(),a=h.outerHeight()),u=(i.width-s)/l,c=(i.height-r)/a,d=h.offset()},move:function(e){var t=e.pageX-d.left,n=e.pageY-d.top;n=Math.max(Math.min(n,a),0),t=Math.max(Math.min(t,l),0),i.style.left=t*-u+"px",i.style.top=n*-c+"px"}}},e.fn.zoom=function(n){return this.each(function(){var i=e.extend({},t,n||{}),o=i.target&&e(i.target)[0]||this,r=this,s=e(r),a=document.createElement("img"),l=e(a),u="mousemove.zoom",c=!1,d=!1;if(!i.url){var p=r.querySelector("img");if(p&&(i.url=p.getAttribute("data-src")||p.currentSrc||p.src),!i.url)return}s.one("zoom.destroy",function(e,t){s.off(".zoom"),o.style.position=e,o.style.overflow=t,a.onload=null,l.remove()}.bind(this,o.style.position,o.style.overflow)),a.onload=function(){function t(t){p.init(),p.move(t),l.stop().fadeTo(e.support.opacity?i.duration:0,1,!!e.isFunction(i.onZoomIn)&&i.onZoomIn.call(a))}function n(){l.stop().fadeTo(i.duration,0,!!e.isFunction(i.onZoomOut)&&i.onZoomOut.call(a))}var p=e.zoom(o,r,a,i.magnify);"grab"===i.on?s.on("mousedown.zoom",function(i){1===i.which&&(e(document).one("mouseup.zoom",function(){n(),e(document).off(u,p.move)}),t(i),e(document).on(u,p.move),i.preventDefault())}):"click"===i.on?s.on("click.zoom",function(i){return c?void 0:(c=!0,t(i),e(document).on(u,p.move),e(document).one("click.zoom",function(){n(),c=!1,e(document).off(u,p.move)}),!1)}):"toggle"===i.on?s.on("click.zoom",function(e){c?n():t(e),c=!c}):"mouseover"===i.on&&(p.init(),s.on("mouseenter.zoom",t).on("mouseleave.zoom",n).on(u,p.move)),i.touch&&s.on("touchstart.zoom",function(e){e.preventDefault(),d?(d=!1,n()):(d=!0,t(e.originalEvent.touches[0]||e.originalEvent.changedTouches[0]))}).on("touchmove.zoom",function(e){e.preventDefault(),p.move(e.originalEvent.touches[0]||e.originalEvent.changedTouches[0])}).on("touchend.zoom",function(e){e.preventDefault(),d&&(d=!1,n())}),e.isFunction(i.callback)&&i.callback.call(a)},a.setAttribute("role","presentation"),a.alt="",a.src=i.url})},e.fn.zoom.defaults=t}(window.jQuery),function(){function e(e,t){for(var n=-1,i=t.length,o=e.length;++n<i;)e[o+n]=t[n];return e}function t(e,t,n){for(var i=-1,o=e.length;++i<o;){var r=e[i],s=t(r);if(null!=s&&(a===le?s===s:n(s,a)))var a=s,l=r}return l}function n(e,t,n){var i;return n(e,function(e,n,o){return t(e,n,o)?(i=e,!1):void 0}),i}function i(e,t,n,i,o){return o(e,function(e,o,r){n=i?(i=!1,e):t(n,e,o,r)}),n}function o(e,t){return T(t,function(t){return e[t]})}function r(e){return e&&e.Object===Object?e:null}function s(e){return fe[e]}function a(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}function l(e,t){return e="number"==typeof e||pe.test(e)?+e:-1,e>-1&&0==e%1&&(null==t?9007199254740991:t)>e}function u(e){if(Z(e)&&!Re(e)){if(e instanceof c)return e;if(Se.call(e,"__wrapped__")){var t=new c(e.__wrapped__,e.__chain__);return t.__actions__=A(e.__actions__),t}}return new c(e)}function c(e,t){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!t}function d(e,t,n,i){var o;return(o=e===le)||(o=Te[n],o=(e===o||e!==e&&o!==o)&&!Se.call(i,n)),o?t:e}function p(e){return J(e)?De(e):{}}function f(e,t,n){if("function"!=typeof e)throw new TypeError("Expected a function");return setTimeout(function(){e.apply(le,n)},t)}function h(e,t){var n=!0;return Le(e,function(e,i,o){return n=!!t(e,i,o)}),n}function v(e,t){var n=[];return Le(e,function(e,i,o){t(e,i,o)&&n.push(e)}),n}function g(t,n,i,o){o||(o=[]);for(var r=-1,s=t.length;++r<s;){var a=t[r];n>0&&Z(a)&&V(a)&&(i||Re(a)||Y(a))?n>1?g(a,n-1,i,o):e(o,a):i||(o[o.length]=a)}return o}function m(e,t){return e&&qe(e,t,ie)}function y(e,t){return v(t,function(t){return G(e[t])})}function w(e,t,n,i,o){return e===t||(null==e||null==t||!J(e)&&!Z(t)?e!==e&&t!==t:b(e,t,w,n,i,o))}function b(e,t,n,i,o,r){var s=Re(e),l=Re(t),u="[object Array]",c="[object Array]";s||(u=Ee.call(e),"[object Arguments]"==u&&(u="[object Object]")),l||(c=Ee.call(t),"[object Arguments]"==c&&(c="[object Object]"));var d="[object Object]"==u&&!a(e),l="[object Object]"==c&&!a(t);return!(c=u==c)||s||d?2&o||(u=d&&Se.call(e,"__wrapped__"),l=l&&Se.call(t,"__wrapped__"),!u&&!l)?!!c&&(r||(r=[]),(u=M(r,function(t){return t[0]===e}))&&u[1]?u[1]==t:(r.push([e,t]),t=(s?L:_)(e,t,n,i,o,r),r.pop(),t)):n(u?e.value():e,l?t.value():t,i,o,r):q(e,t,u)}function x(e){var t=typeof e;return"function"==t?e:null==e?se:("object"==t?S:E)(e)}function k(e){e=null==e?e:Object(e);var t,n=[];for(t in e)n.push(t);return n}function T(e,t){var n=-1,i=V(e)?Array(e.length):[];return Le(e,function(e,o,r){i[++n]=t(e,o,r)}),i}function S(e){var t=ie(e);return function(n){var i=t.length;if(null==n)return!i;for(n=Object(n);i--;){var o=t[i];if(!(o in n&&w(e[o],n[o],le,3)))return!1}return!0}}function C(e,t){return e=Object(e),W(t,function(t,n){return n in e&&(t[n]=e[n]),t},{})}function E(e){return function(t){return null==t?le:t[e]}}function $(e,t,n){var i=-1,o=e.length;for(0>t&&(t=-t>o?0:o+t),n=n>o?o:n,0>n&&(n+=o),o=t>n?0:n-t>>>0,t>>>=0,n=Array(o);++i<o;)n[i]=e[i+t];return n}function A(e){return $(e,0,e.length)}function j(e,t){var n;return Le(e,function(e,i,o){return n=t(e,i,o),!n}),!!n}function D(t,n){return W(n,function(t,n){return n.func.apply(n.thisArg,e([t],n.args))},t)}function N(e,t,n,i){n||(n={});for(var o=-1,r=t.length;++o<r;){var s=t[o],a=i?i(n[s],e[s],s,n,e):e[s],l=n,u=l[s];Se.call(l,s)&&(u===a||u!==u&&a!==a)&&(a!==le||s in l)||(l[s]=a)}return n}function O(e){return U(function(t,n){var i=-1,o=n.length,r=o>1?n[o-1]:le,r="function"==typeof r?(o--,r):le;for(t=Object(t);++i<o;){var s=n[i];s&&e(t,s,i,r)}return t})}function H(e){return function(){var t=arguments,n=p(e.prototype),t=e.apply(n,t);return J(t)?t:n}}function P(e,t,n){function i(){for(var r=-1,s=arguments.length,a=-1,l=n.length,u=Array(l+s),c=this&&this!==xe&&this instanceof i?o:e;++a<l;)u[a]=n[a];for(;s--;)u[a++]=arguments[++r];return c.apply(t,u)}if("function"!=typeof e)throw new TypeError("Expected a function");var o=H(e);return i}function L(e,t,n,i,o,r){var s=-1,a=1&o,l=e.length,u=t.length;if(l!=u&&!(2&o&&u>l))return!1;for(u=!0;++s<l;){var c=e[s],d=t[s];if(void 0!==le){u=!1;break}if(a){if(!j(t,function(e){return c===e||n(c,e,i,o,r)})){u=!1;break}}else if(c!==d&&!n(c,d,i,o,r)){u=!1;break}}return u}function q(e,t,n){switch(n){case"[object Boolean]":case"[object Date]":return+e==+t;case"[object Error]":return e.name==t.name&&e.message==t.message;case"[object Number]":return e!=+e?t!=+t:e==+t;case"[object RegExp]":case"[object String]":return e==t+""}return!1}function _(e,t,n,i,o,r){var s=2&o,a=ie(e),l=a.length,u=ie(t).length;if(l!=u&&!s)return!1;for(var c=l;c--;){var d=a[c];if(!(s?d in t:Se.call(t,d)))return!1}for(u=!0;++c<l;){var d=a[c],p=e[d],f=t[d];if(void 0!==le||p!==f&&!n(p,f,i,o,r)){u=!1;break}s||(s="constructor"==d)}return u&&!s&&(n=e.constructor,i=t.constructor,n!=i&&"constructor"in e&&"constructor"in t&&!("function"==typeof n&&n instanceof n&&"function"==typeof i&&i instanceof i)&&(u=!1)),u}function z(e){var t=e?e.length:le;if(Q(t)&&(Re(e)||ee(e)||Y(e))){e=String;for(var n=-1,i=Array(t);++n<t;)i[n]=e(n);t=i}else t=null;return t}function I(e){var t=e&&e.constructor,t=G(t)&&t.prototype||Te;return e===t}function F(e){return e?e[0]:le}function M(e,t){return n(e,x(t),Le)}function R(e,t){return Le(e,"function"==typeof t?t:se)}function W(e,t,n){return i(e,x(t),n,3>arguments.length,Le)}function B(e,t){var n;if("function"!=typeof t)throw new TypeError("Expected a function");return e=We(e),function(){return 0<--e&&(n=t.apply(this,arguments)),1>=e&&(t=le),n}}function U(e){var t;if("function"!=typeof e)throw new TypeError("Expected a function");return t=Pe(t===le?e.length-1:We(t),0),function(){for(var n=arguments,i=-1,o=Pe(n.length-t,0),r=Array(o);++i<o;)r[i]=n[t+i];for(o=Array(t+1),i=-1;++i<t;)o[i]=n[i];return o[t]=r,e.apply(this,o)}}function X(e,t){return e>t}function Y(e){return Z(e)&&V(e)&&Se.call(e,"callee")&&(!Ne.call(e,"callee")||"[object Arguments]"==Ee.call(e))}function V(e){return null!=e&&!("function"==typeof e&&G(e))&&Q(_e(e))}function G(e){return e=J(e)?Ee.call(e):"","[object Function]"==e||"[object GeneratorFunction]"==e}function Q(e){return"number"==typeof e&&e>-1&&0==e%1&&9007199254740991>=e}function J(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function Z(e){return!!e&&"object"==typeof e}function K(e){return"number"==typeof e||Z(e)&&"[object Number]"==Ee.call(e)}function ee(e){return"string"==typeof e||!Re(e)&&Z(e)&&"[object String]"==Ee.call(e)}function te(e,t){return t>e}function ne(e){return"string"==typeof e?e:null==e?"":e+""}function ie(e){var t=I(e);if(!t&&!V(e))return He(Object(e));var n,i=z(e),o=!!i,i=i||[],r=i.length;for(n in e)!Se.call(e,n)||o&&("length"==n||l(n,r))||t&&"constructor"==n||i.push(n);return i}function oe(e){for(var t=-1,n=I(e),i=k(e),o=i.length,r=z(e),s=!!r,r=r||[],a=r.length;++t<o;){var u=i[t];s&&("length"==u||l(u,a))||"constructor"==u&&(n||!Se.call(e,u))||r.push(u)}return r}function re(e){return e?o(e,ie(e)):[]}function se(e){return e}function ae(t,n,i){var o=ie(n),r=y(n,o);null!=i||J(n)&&(r.length||!o.length)||(i=n,n=t,t=this,r=y(n,ie(n)));var s=!(J(i)&&"chain"in i)||i.chain,a=G(t);return Le(r,function(i){var o=n[i];t[i]=o,a&&(t.prototype[i]=function(){var n=this.__chain__;if(s||n){var i=t(this.__wrapped__);return(i.__actions__=A(this.__actions__)).push({func:o,args:arguments,thisArg:t}),i.__chain__=n,i}return o.apply(t,e([this.value()],arguments))})}),t}var le,ue=1/0,ce=/[&<>"'`]/g,de=RegExp(ce.source),pe=/^(?:0|[1-9]\d*)$/,fe={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},he={function:!0,object:!0},ve=he[typeof exports]&&exports&&!exports.nodeType?exports:le,ge=he[typeof module]&&module&&!module.nodeType?module:le,me=ge&&ge.exports===ve?ve:le,ye=r(he[typeof self]&&self),we=r(he[typeof window]&&window),be=r(he[typeof this]&&this),xe=r(ve&&ge&&"object"==typeof global&&global)||we!==(be&&be.window)&&we||ye||be||Function("return this")(),ke=Array.prototype,Te=Object.prototype,Se=Te.hasOwnProperty,Ce=0,Ee=Te.toString,$e=xe._,Ae=xe.Reflect,je=Ae?Ae.f:le,De=Object.create,Ne=Te.propertyIsEnumerable,Oe=xe.isFinite,He=Object.keys,Pe=Math.max,Le=function(e,t){return function(n,i){if(null==n)return n;if(!V(n))return e(n,i);for(var o=n.length,r=t?o:-1,s=Object(n);(t?r--:++r<o)&&!1!==i(s[r],r,s););return n}}(m),qe=function(e){return function(t,n,i){var o=-1,r=Object(t);i=i(t);for(var s=i.length;s--;){var a=i[e?s:++o];if(!1===n(r[a],a,r))break}return t}}();je&&!Ne.call({valueOf:1},"valueOf")&&(k=function(e){e=je(e);for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n});var _e=E("length"),ze=U(function(t,n){return Re(t)||(t=null==t?[]:[Object(t)]),g(n,1),e(A(t),re)}),Ie=U(function(e,t,n){return P(e,t,n)}),Fe=U(function(e,t){return f(e,1,t)}),Me=U(function(e,t,n){return f(e,Be(t)||0,n)}),Re=Array.isArray,We=Number,Be=Number,Ue=O(function(e,t){N(t,ie(t),e)}),Xe=O(function(e,t){N(t,oe(t),e)}),Ye=O(function(e,t,n,i){N(t,oe(t),e,i)}),Ve=U(function(e){return e.push(le,d),Ye.apply(le,e)}),Ge=U(function(e,t){return null==e?{}:C(e,g(t,1))}),Qe=x;c.prototype=p(u.prototype),c.prototype.constructor=c,u.assignIn=Xe,u.before=B,u.bind=Ie,u.chain=function(e){return e=u(e),e.__chain__=!0,e},u.compact=function(e){return v(e,Boolean)},u.concat=ze,u.create=function(e,t){var n=p(e);return t?Ue(n,t):n},u.defaults=Ve,u.defer=Fe,u.delay=Me,u.filter=function(e,t){return v(e,x(t))},u.flatten=function(e){return e&&e.length?g(e,1):[]},u.flattenDeep=function(e){return e&&e.length?g(e,ue):[]},u.iteratee=Qe,u.keys=ie,u.map=function(e,t){return T(e,x(t))},u.matches=function(e){return S(Ue({},e))},u.mixin=ae,u.negate=function(e){if("function"!=typeof e)throw new TypeError("Expected a function");return function(){return!e.apply(this,arguments)}},u.once=function(e){return B(2,e)},u.pick=Ge,u.slice=function(e,t,n){var i=e?e.length:0;return n=n===le?i:+n,i?$(e,null==t?0:+t,n):[]},u.sortBy=function(e,t){var n=0;return t=x(t),T(T(e,function(e,i,o){return{c:e,b:n++,a:t(e,i,o)}}).sort(function(e,t){var n;e:{n=e.a;var i=t.a;if(n!==i){var o=null===n,r=n===le,s=n===n,a=null===i,l=i===le,u=i===i;if(n>i&&!a||!s||o&&!l&&u||r&&u){n=1;break e}if(i>n&&!o||!u||a&&!r&&s||l&&s){n=-1;break e}}n=0}return n||e.b-t.b}),E("c"))},u.tap=function(e,t){return t(e),e},u.thru=function(e,t){return t(e)},u.toArray=function(e){return V(e)?e.length?A(e):[]:re(e)},u.values=re,u.extend=Xe,ae(u,u),u.clone=function(e){return J(e)?Re(e)?A(e):N(e,ie(e)):e},u.escape=function(e){return(e=ne(e))&&de.test(e)?e.replace(ce,s):e},u.every=function(e,t,n){return t=n?le:t,h(e,x(t))},u.find=M,u.forEach=R,u.has=function(e,t){return null!=e&&Se.call(e,t)},u.head=F,u.identity=se,u.indexOf=function(e,t,n){var i=e?e.length:0;n="number"==typeof n?0>n?Pe(i+n,0):n:0,n=(n||0)-1;for(var o=t===t;++n<i;){var r=e[n];if(o?r===t:r!==r)return n}return-1},u.isArguments=Y,u.isArray=Re,u.isBoolean=function(e){return!0===e||!1===e||Z(e)&&"[object Boolean]"==Ee.call(e)},u.isDate=function(e){return Z(e)&&"[object Date]"==Ee.call(e)},u.isEmpty=function(e){if(V(e)&&(Re(e)||ee(e)||G(e.splice)||Y(e)))return!e.length;for(var t in e)if(Se.call(e,t))return!1;return!0},u.isEqual=function(e,t){return w(e,t)},u.isFinite=function(e){return"number"==typeof e&&Oe(e)},u.isFunction=G,u.isNaN=function(e){return K(e)&&e!=+e},u.isNull=function(e){return null===e},u.isNumber=K,u.isObject=J,u.isRegExp=function(e){return J(e)&&"[object RegExp]"==Ee.call(e)},u.isString=ee,u.isUndefined=function(e){return e===le},u.last=function(e){var t=e?e.length:0;return t?e[t-1]:le},u.max=function(e){return e&&e.length?t(e,se,X):le},u.min=function(e){return e&&e.length?t(e,se,te):le},u.noConflict=function(){return xe._===this&&(xe._=$e),this},u.noop=function(){},u.reduce=W,u.result=function(e,t,n){return t=null==e?le:e[t],t===le&&(t=n),G(t)?t.call(e):t},u.size=function(e){return null==e?0:(e=V(e)?e:ie(e),e.length)},u.some=function(e,t,n){return t=n?le:t,j(e,x(t))},u.uniqueId=function(e){var t=++Ce;return ne(e)+t},u.each=R,u.first=F,ae(u,function(){var e={};return m(u,function(t,n){Se.call(u.prototype,n)||(e[n]=t)}),e}(),{chain:!1}),u.VERSION="4.5.1",Le("pop join replace reverse split push shift sort splice unshift".split(" "),function(e){var t=(/^(?:replace|split)$/.test(e)?String.prototype:ke)[e],n=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",i=/^(?:pop|join|replace|shift)$/.test(e);u.prototype[e]=function(){var e=arguments;return i&&!this.__chain__?t.apply(this.value(),e):this[n](function(n){return t.apply(n,e)})}}),u.prototype.toJSON=u.prototype.valueOf=u.prototype.value=function(){return D(this.__wrapped__,this.__actions__)},(we||ye||{})._=u,"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return u}):ve&&ge?(me&&((ge.exports=u)._=u),ve._=u):xe._=u}.call(this),/*!
 * modernizr.min.js
 */
/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-csstransforms-flexbox-svg-setclasses !*/
!function(e,t,n){function i(e,t){return typeof e===t}function o(){var e,t,n,o,r,s,a;for(var l in w)if(w.hasOwnProperty(l)){if(e=[],t=w[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=i(t.fn,"function")?t.fn():t.fn,r=0;r<e.length;r++)s=e[r],a=s.split("."),1===a.length?x[a[0]]=o:(!x[a[0]]||x[a[0]]instanceof Boolean||(x[a[0]]=new Boolean(x[a[0]])),x[a[0]][a[1]]=o),y.push((o?"":"no-")+a.join("-"))}}function r(e){var t=k.className,n=x._config.classPrefix||"";if(T&&(t=t.baseVal),x._config.enableJSClass){var i=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(i,"$1"+n+"js$2")}x._config.enableClasses&&(t+=" "+n+e.join(" "+n),T?k.className.baseVal=t:k.className=t)}function s(e,t){return!!~(""+e).indexOf(t)}function a(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):T?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function l(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function u(e,t){return function(){return e.apply(t,arguments)}}function c(e,t,n){var o;for(var r in e)if(e[r]in t)return n===!1?e[r]:(o=t[e[r]],i(o,"function")?u(o,n||t):o);return!1}function d(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function p(){var e=t.body;return e||(e=a(T?"svg":"body"),e.fake=!0),e}function f(e,n,i,o){var r,s,l,u,c="modernizr",d=a("div"),f=p();if(parseInt(i,10))for(;i--;)l=a("div"),l.id=o?o[i]:c+(i+1),d.appendChild(l);return r=a("style"),r.type="text/css",r.id="s"+c,(f.fake?f:d).appendChild(r),f.appendChild(d),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(t.createTextNode(e)),d.id=c,f.fake&&(f.style.background="",f.style.overflow="hidden",u=k.style.overflow,k.style.overflow="hidden",k.appendChild(f)),s=n(d,e),f.fake?(f.parentNode.removeChild(f),k.style.overflow=u,k.offsetHeight):d.parentNode.removeChild(d),!!s}function h(t,i){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(d(t[o]),i))return!0;return!1}if("CSSSupportsRule"in e){for(var r=[];o--;)r.push("("+d(t[o])+":"+i+")");return r=r.join(" or "),f("@supports ("+r+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function v(e,t,o,r){function u(){d&&(delete A.style,delete A.modElem)}if(r=!i(r,"undefined")&&r,!i(o,"undefined")){var c=h(e,o);if(!i(c,"undefined"))return c}for(var d,p,f,v,g,m=["modernizr","tspan","samp"];!A.style&&m.length;)d=!0,A.modElem=a(m.shift()),A.style=A.modElem.style;for(f=e.length,p=0;f>p;p++)if(v=e[p],g=A.style[v],s(v,"-")&&(v=l(v)),A.style[v]!==n){if(r||i(o,"undefined"))return u(),"pfx"!=t||v;try{A.style[v]=o}catch(e){}if(A.style[v]!=g)return u(),"pfx"!=t||v}return u(),!1}function g(e,t,n,o,r){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+C.join(s+" ")+s).split(" ");return i(t,"string")||i(t,"undefined")?v(a,t,o,r):(a=(e+" "+E.join(s+" ")+s).split(" "),c(a,t,n))}function m(e,t,i){return g(e,n,n,t,i)}var y=[],w=[],b={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){w.push({name:e,fn:t,options:n})},addAsyncTest:function(e){w.push({name:null,fn:e})}},x=function(){};x.prototype=b,x=new x,x.addTest("svg",!!t.createElementNS&&!!t.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect);var k=t.documentElement,T="svg"===k.nodeName.toLowerCase(),S="Moz O ms Webkit",C=b._config.usePrefixes?S.split(" "):[];b._cssomPrefixes=C;var E=b._config.usePrefixes?S.toLowerCase().split(" "):[];b._domPrefixes=E;var $={elem:a("modernizr")};x._q.push(function(){delete $.elem});var A={style:$.elem.style};x._q.unshift(function(){delete A.style}),b.testAllProps=g,b.testAllProps=m,x.addTest("flexbox",m("flexBasis","1px",!0)),x.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&m("transform","scale(1)",!0)}),o(),r(y),delete b.addTest,delete b.addAsyncTest;for(var j=0;j<x._q.length;j++)x._q[j]();e.Modernizr=x}(window,document),/*!
 * jquery.ba-throttle-debounce.min.js
 */
/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
function(e,t){var n,i=e.jQuery||e.Cowboy||(e.Cowboy={});i.throttle=n=function(e,n,o,r){function s(){function i(){l=+new Date,o.apply(u,d)}function s(){a=t}var u=this,c=+new Date-l,d=arguments;r&&!a&&i(),a&&clearTimeout(a),r===t&&c>e?i():n!==!0&&(a=setTimeout(r?s:i,r===t?e-c:e))}var a,l=0;return"boolean"!=typeof n&&(r=o,o=n,n=t),i.guid&&(s.guid=o.guid=o.guid||i.guid++),s},i.debounce=function(e,i,o){return o===t?n(e,i,!1):n(e,o,i!==!1)}}(this),/*!
 * slick-slim.min.js
 */
!function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):"undefined"!=typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){"use strict";var t=window.Slick||{};t=function(){function t(t,i){var o,r=this;r.defaults={accessibility:!0,appendArrows:e(t),appendDots:e(t),arrows:!0,asNavFor:null,prevArrow:'<button type="button" data-role="none" class="slick-prev" aria-label="Previous slide" tabindex="0" role="button">Previous slide</button>',nextArrow:'<button type="button" data-role="none" class="slick-next" aria-label="Next slide" tabindex="0" role="button">Next slide</button>',autoplay:!1,autoplaySpeed:3e3,cssEase:"ease",customPaging:function(t,n){return e('<button type="button" data-role="none" role="button" tabindex="0" />').text("Slide "+(n+1))},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,initialSlide:0,lazyLoad:!0,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,waitForAnimate:!0,zIndex:1e3},r.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},e.extend(r,r.initials),r.activeBreakpoint=null,r.animType=null,r.animProp=null,r.breakpoints=[],r.breakpointSettings=[],r.cssTransitions=!1,r.focussed=!1,r.interrupted=!1,r.hidden="hidden",r.paused=!0,r.positionProp=null,r.respondTo=null,r.rowCount=1,r.shouldClick=!0,r.$slider=e(t),r.$slidesCache=null,r.transformType=null,r.transitionType=null,r.visibilityChange="visibilitychange",r.windowWidth=0,r.windowTimer=null,o=e(t).data("slick")||{},r.options=e.extend({},r.defaults,i,o),r.currentSlide=r.options.initialSlide,r.originalSettings=r.options,"undefined"!=typeof document.mozHidden?(r.hidden="mozHidden",r.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(r.hidden="webkitHidden",r.visibilityChange="webkitvisibilitychange"),r.autoPlay=e.proxy(r.autoPlay,r),r.autoPlayClear=e.proxy(r.autoPlayClear,r),r.autoPlayIterator=e.proxy(r.autoPlayIterator,r),r.changeSlide=e.proxy(r.changeSlide,r),r.clickHandler=e.proxy(r.clickHandler,r),r.selectHandler=e.proxy(r.selectHandler,r),r.setPosition=e.proxy(r.setPosition,r),r.swipeHandler=e.proxy(r.swipeHandler,r),r.dragHandler=e.proxy(r.dragHandler,r),r.keyHandler=e.proxy(r.keyHandler,r),r.instanceUid=n++,r.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,r.init(!0)}var n=0;return t}(),t.prototype.activateADA=function(){var e=this;e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),e.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},t.prototype.animateSlide=function(t,n){var i={},o=this;o.options.rtl===!0&&(t=-t),o.transformsEnabled===!1?o.$slideTrack.animate({left:t},o.options.speed,o.options.easing,n):o.cssTransitions===!1?(o.options.rtl===!0&&(o.currentLeft=-o.currentLeft),e({animStart:o.currentLeft}).animate({animStart:t},{duration:o.options.speed,easing:o.options.easing,step:function(e){e=Math.ceil(e),i[o.animType]="translate("+e+"px, 0px)",o.$slideTrack.css(i)},complete:function(){n&&n.call()}})):(o.applyTransition(),t=Math.ceil(t),i[o.animType]="translate3d("+t+"px, 0px, 0px)",o.$slideTrack.css(i),n&&setTimeout(function(){o.disableTransition(),n.call()},o.options.speed))},t.prototype.getNavTarget=function(){var t=this,n=t.options.asNavFor;return n&&null!==n&&(n=e(n).not(t.$slider)),n},t.prototype.asNavFor=function(t){var n=this,i=n.getNavTarget();null!==i&&"object"==typeof i&&i.each(function(){var n=e(this).slick("getSlick");n.unslicked||n.slideHandler(t,!0)})},t.prototype.applyTransition=function(e){var t=this,n={};t.options.fade===!1?n[t.transitionType]=t.transformType+" "+t.options.speed+"ms "+t.options.cssEase:n[t.transitionType]="opacity "+t.options.speed+"ms "+t.options.cssEase,t.options.fade===!1?t.$slideTrack.css(n):t.$slides.eq(e).css(n)},t.prototype.autoPlay=function(){var e=this;e.autoPlayClear(),e.slideCount>e.options.slidesToShow&&(e.autoPlayTimer=setInterval(e.autoPlayIterator,e.options.autoplaySpeed))},t.prototype.autoPlayClear=function(){var e=this;e.autoPlayTimer&&clearInterval(e.autoPlayTimer)},t.prototype.autoPlayIterator=function(){var e=this,t=e.currentSlide+e.options.slidesToScroll;e.paused||e.interrupted||e.focussed||e.slideHandler(t)},t.prototype.buildArrows=function(){var t=this;t.options.arrows===!0&&(t.$prevArrow=e(t.options.prevArrow).addClass("slick-arrow"),t.$nextArrow=e(t.options.nextArrow).addClass("slick-arrow"),t.slideCount>t.options.slidesToShow?(t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.prependTo(t.options.appendArrows),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.appendTo(t.options.appendArrows),t.options.infinite!==!0&&t.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},t.prototype.buildDots=function(){var t,n,i=this;if(i.options.dots===!0&&i.slideCount>i.options.slidesToShow){for(i.$slider.addClass("slick-dotted"),n=e("<ul />").addClass(i.options.dotsClass),t=0;t<=i.getDotCount();t+=1)n.append(e("<li />").append(i.options.customPaging.call(this,i,t)));i.$dots=n.appendTo(i.options.appendDots),i.$dots.find("li").first().addClass("slick-active").attr("aria-hidden","false")}},t.prototype.buildOut=function(){var t=this;t.$slides=t.$slider.children(t.options.slide+":not(.slick-cloned)").addClass("slick-slide"),t.slideCount=t.$slides.length,t.$slides.each(function(t,n){e(n).attr("data-slick-index",t).data("originalStyling",e(n).attr("style")||"")}),t.$slider.addClass("slick-slider"),t.$slideTrack=0===t.slideCount?e('<div class="slick-track"/>').appendTo(t.$slider):t.$slides.wrapAll('<div class="slick-track"/>').parent(),t.$list=t.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(),t.$slideTrack.css("opacity",0),t.options.swipeToSlide===!0&&(t.options.slidesToScroll=1),e("img[data-lazy]",t.$slider).not("[src]").addClass("slick-loading"),t.setupInfinite(),t.buildArrows(),t.buildDots(),t.updateDots(),t.setSlideClasses("number"==typeof t.currentSlide?t.currentSlide:0),t.options.draggable===!0&&t.$list.addClass("draggable")},t.prototype.buildRows=function(){var e,t,n,i,o,r,s,a=this;if(i=document.createDocumentFragment(),r=a.$slider.children(),a.options.rows>1){for(s=a.options.slidesPerRow*a.options.rows,o=Math.ceil(r.length/s),e=0;e<o;e++){var l=document.createElement("div");for(t=0;t<a.options.rows;t++){var u=document.createElement("div");for(n=0;n<a.options.slidesPerRow;n++){var c=e*s+(t*a.options.slidesPerRow+n);r.get(c)&&u.appendChild(r.get(c))}l.appendChild(u)}i.appendChild(l)}a.$slider.empty().append(i),a.$slider.children().children().children().css({width:100/a.options.slidesPerRow+"%",display:"inline-block"})}},t.prototype.changeSlide=function(t,n){var i,o,r,s=this,a=e(t.currentTarget);switch(a.is("a")&&t.preventDefault(),a.is("li")||(a=a.closest("li")),r=s.slideCount%s.options.slidesToScroll!==0,i=r?0:(s.slideCount-s.currentSlide)%s.options.slidesToScroll,t.data.message){case"previous":o=0===i?s.options.slidesToScroll:s.options.slidesToShow-i,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide-o,!1,n);break;case"next":o=0===i?s.options.slidesToScroll:i,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide+o,!1,n);break;case"index":var l=0===t.data.index?0:t.data.index||a.index()*s.options.slidesToScroll;s.slideHandler(s.checkNavigable(l),!1,n),a.children().trigger("focus");break;default:return}},t.prototype.checkNavigable=function(e){var t,n,i=this;if(t=i.getNavigableIndexes(),n=0,e>t[t.length-1])e=t[t.length-1];else for(var o in t){if(e<t[o]){e=n;break}n=t[o]}return e},t.prototype.cleanUpEvents=function(){var t=this;t.options.dots&&null!==t.$dots&&e("li",t.$dots).off("click.slick",t.changeSlide).off("mouseenter.slick",e.proxy(t.interrupt,t,!0)).off("mouseleave.slick",e.proxy(t.interrupt,t,!1)),t.$slider.off("focus.slick blur.slick"),t.options.arrows===!0&&t.slideCount>t.options.slidesToShow&&(t.$prevArrow&&t.$prevArrow.off("click.slick",t.changeSlide),t.$nextArrow&&t.$nextArrow.off("click.slick",t.changeSlide)),t.$list.off("touchstart.slick mousedown.slick",t.swipeHandler),t.$list.off("touchmove.slick mousemove.slick",t.swipeHandler),t.$list.off("touchend.slick mouseup.slick",t.swipeHandler),t.$list.off("touchcancel.slick mouseleave.slick",t.swipeHandler),t.$list.off("click.slick",t.clickHandler),e(document).off(t.visibilityChange,t.visibility),t.cleanUpSlideEvents(),t.options.accessibility===!0&&t.$list.off("keydown.slick",t.keyHandler),t.options.focusOnSelect===!0&&e(t.$slideTrack).children().off("click.slick",t.selectHandler),e(window).off("orientationchange.slick.slick-"+t.instanceUid,t.orientationChange),e(window).off("resize.slick.slick-"+t.instanceUid,t.resize),e("[draggable!=true]",t.$slideTrack).off("dragstart",t.preventDefault),e(window).off("load.slick.slick-"+t.instanceUid,t.setPosition),e(document).off("ready.slick.slick-"+t.instanceUid,t.setPosition)},t.prototype.cleanUpSlideEvents=function(){var t=this;t.$list.off("mouseenter.slick",e.proxy(t.interrupt,t,!0)),t.$list.off("mouseleave.slick",e.proxy(t.interrupt,t,!1))},t.prototype.cleanUpRows=function(){var e,t=this;t.options.rows>1&&(e=t.$slides.children().children(),e.removeAttr("style"),t.$slider.empty().append(e))},t.prototype.clickHandler=function(e){var t=this;t.shouldClick===!1&&(e.stopImmediatePropagation(),e.stopPropagation(),e.preventDefault())},t.prototype.destroy=function(t){var n=this;n.autoPlayClear(),n.touchObject={},n.cleanUpEvents(),e(".slick-cloned",n.$slider).detach(),n.$dots&&n.$dots.remove(),n.$prevArrow&&n.$prevArrow.length&&(n.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),n.htmlExpr.test(n.options.prevArrow)&&n.$prevArrow.remove()),n.$nextArrow&&n.$nextArrow.length&&(n.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),n.htmlExpr.test(n.options.nextArrow)&&n.$nextArrow.remove()),n.$slides&&(n.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){e(this).attr("style",e(this).data("originalStyling"))}),n.$slideTrack.children(this.options.slide).detach(),n.$slideTrack.detach(),n.$list.detach(),n.$slider.append(n.$slides)),n.cleanUpRows(),n.$slider.removeClass("slick-slider"),n.$slider.removeClass("slick-initialized"),n.$slider.removeClass("slick-dotted"),n.unslicked=!0,t||n.$slider.trigger("destroy",[n])},t.prototype.disableTransition=function(e){var t=this,n={};n[t.transitionType]="",t.options.fade===!1?t.$slideTrack.css(n):t.$slides.eq(e).css(n)},t.prototype.fadeSlide=function(e,t){var n=this;n.cssTransitions===!1?(n.$slides.eq(e).css({zIndex:n.options.zIndex}),n.$slides.eq(e).animate({opacity:1},n.options.speed,n.options.easing,t)):(n.applyTransition(e),n.$slides.eq(e).css({opacity:1,zIndex:n.options.zIndex}),t&&setTimeout(function(){n.disableTransition(e),t.call()},n.options.speed))},t.prototype.fadeSlideOut=function(e){var t=this;t.cssTransitions===!1?t.$slides.eq(e).animate({opacity:0,zIndex:t.options.zIndex-2},t.options.speed,t.options.easing):(t.applyTransition(e),t.$slides.eq(e).css({opacity:0,zIndex:t.options.zIndex-2}))},t.prototype.filterSlides=t.prototype.slickFilter=function(e){var t=this;null!==e&&(t.$slidesCache=t.$slides,t.unload(),t.$slideTrack.children(this.options.slide).detach(),t.$slidesCache.filter(e).appendTo(t.$slideTrack),t.reinit())},t.prototype.focusHandler=function(){var t=this;t.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*:not(.slick-arrow)",function(n){n.stopImmediatePropagation();var i=e(this);setTimeout(function(){t.options.pauseOnFocus&&(t.focussed=i.is(":focus"),t.autoPlay())},0)})},t.prototype.getCurrent=t.prototype.slickCurrentSlide=function(){var e=this;return e.currentSlide},t.prototype.getDotCount=function(){for(var e=this,t=0,n=0,i=0;t<e.slideCount;)++i,t=n+e.options.slidesToScroll,n+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return i-1},t.prototype.getLeft=function(e){var t,n,i=this,o=0;return i.slideOffset=0,n=i.$slides.first().outerHeight(!0),i.slideCount>i.options.slidesToShow&&(i.slideOffset=i.slideWidth*i.options.slidesToShow*-1,o=n*i.options.slidesToShow*-1),i.slideCount%i.options.slidesToScroll!==0&&e+i.options.slidesToScroll>i.slideCount&&i.slideCount>i.options.slidesToShow&&(e>i.slideCount?(i.slideOffset=(i.options.slidesToShow-(e-i.slideCount))*i.slideWidth*-1,o=(i.options.slidesToShow-(e-i.slideCount))*n*-1):(i.slideOffset=i.slideCount%i.options.slidesToScroll*i.slideWidth*-1,o=i.slideCount%i.options.slidesToScroll*n*-1)),i.slideCount<=i.options.slidesToShow&&(i.slideOffset=0,o=0),t=e*i.slideWidth*-1+i.slideOffset},t.prototype.getOption=t.prototype.slickGetOption=function(e){var t=this;return t.options[e]},t.prototype.getNavigableIndexes=function(){var e,t=this,n=0,i=0,o=[];for(n=t.options.slidesToScroll*-1,i=t.options.slidesToScroll*-1,e=2*t.slideCount;n<e;)o.push(n),n=i+t.options.slidesToScroll,i+=t.options.slidesToScroll<=t.options.slidesToShow?t.options.slidesToScroll:t.options.slidesToShow;return o},t.prototype.getSlick=function(){return this},t.prototype.getSlideCount=function(){var t,n,i,o=this;return i=0,o.options.swipeToSlide===!0?(o.$slideTrack.find(".slick-slide").each(function(t,r){if(r.offsetLeft-i+e(r).outerWidth()/2>o.swipeLeft*-1)return n=r,!1}),t=Math.abs(e(n).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},t.prototype.goTo=t.prototype.slickGoTo=function(e,t){var n=this;n.changeSlide({data:{message:"index",index:parseInt(e)}},t)},t.prototype.init=function(t){var n=this;e(n.$slider).hasClass("slick-initialized")||(e(n.$slider).addClass("slick-initialized"),n.buildRows(),n.buildOut(),n.setProps(),n.startLoad(),n.loadSlider(),n.initializeEvents(),n.updateDots(),n.focusHandler()),t&&n.$slider.trigger("init",[n]),n.options.accessibility===!0&&n.initADA(),n.options.autoplay&&(n.paused=!1,n.autoPlay())},t.prototype.initADA=function(){var t,n,i,o=this;o.$slides.not(o.$slideTrack.find(".slick-cloned")).each(function(r){e(this).attr("role","option");var s=Math.floor(r/o.options.slidesToShow);o.options.dots===!0&&(n=""+o.instanceUid+s,i=n,t===n&&(n=""+n+r),e(this).attr("id","slickSlide"+n).attr("role","tabpanel").attr("aria-labelledby","slickDot"+i),t=""+o.instanceUid+s)}),null!==o.$dots&&o.$dots.attr("role","tablist").find("li").each(function(t){e(this).attr({role:"tab","aria-selected":"false","aria-controls":"slickSlide"+o.instanceUid+t,id:"slickDot"+o.instanceUid+t})}).first().attr("aria-selected","true"),o.activateADA()},t.prototype.initArrowEvents=function(){var e=this;e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},e.changeSlide),e.$nextArrow.off("click.slick").on("click.slick",{message:"next"},e.changeSlide))},t.prototype.updateADA=function(){var e=this;null!==e.$dots&&(e.$dots.find("li").attr("aria-selected","false"),e.$dots.find(".slick-active").attr("aria-selected","true")),e.activateADA()},t.prototype.initArrowEvents=function(){var e=this;e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},e.changeSlide),e.$nextArrow.off("click.slick").on("click.slick",{message:"next"},e.changeSlide))},t.prototype.initDotEvents=function(){var t=this;t.options.dots===!0&&t.slideCount>t.options.slidesToShow&&e("li",t.$dots).on("click.slick",{message:"index"},t.changeSlide),t.options.dots===!0&&t.options.pauseOnDotsHover===!0&&e("li",t.$dots).on("mouseenter.slick",e.proxy(t.interrupt,t,!0)).on("mouseleave.slick",e.proxy(t.interrupt,t,!1))},t.prototype.initSlideEvents=function(){var t=this;t.options.pauseOnHover&&(t.$list.on("mouseenter.slick",e.proxy(t.interrupt,t,!0)),t.$list.on("mouseleave.slick",e.proxy(t.interrupt,t,!1)))},t.prototype.initializeEvents=function(){var t=this;t.initArrowEvents(),t.initDotEvents(),t.initSlideEvents(),t.$list.on("touchstart.slick mousedown.slick",{action:"start"},t.swipeHandler),t.$list.on("touchmove.slick mousemove.slick",{action:"move"},t.swipeHandler),t.$list.on("touchend.slick mouseup.slick",{action:"end"},t.swipeHandler),t.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},t.swipeHandler),t.$list.on("click.slick",t.clickHandler),e(document).on(t.visibilityChange,e.proxy(t.visibility,t)),t.options.accessibility===!0&&t.$list.on("keydown.slick",t.keyHandler),t.options.focusOnSelect===!0&&e(t.$slideTrack).children().on("click.slick",t.selectHandler),e(window).on("orientationchange.slick.slick-"+t.instanceUid,e.proxy(t.orientationChange,t)),e(window).on("resize.slick.slick-"+t.instanceUid,e.proxy(t.resize,t)),e("[draggable!=true]",t.$slideTrack).on("dragstart",t.preventDefault),e(window).on("load.slick.slick-"+t.instanceUid,t.setPosition),e(document).on("ready.slick.slick-"+t.instanceUid,t.setPosition)},t.prototype.initUI=function(){var e=this;e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow.show(),e.$nextArrow.show()),e.options.dots===!0&&e.slideCount>e.options.slidesToShow&&e.$dots.show()},t.prototype.keyHandler=function(e){var t=this;e.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===e.keyCode&&t.options.accessibility===!0?t.changeSlide({data:{message:t.options.rtl===!0?"next":"previous"}}):39===e.keyCode&&t.options.accessibility===!0&&t.changeSlide({data:{message:t.options.rtl===!0?"previous":"next"}}))},t.prototype.lazyLoad=function(){function t(t){e("img[data-lazy]",t).each(function(){var t=e(this),n=e(this).attr("data-lazy"),i=document.createElement("img");i.onload=function(){t.animate({opacity:0},100,function(){t.attr("src",n).animate({opacity:1},200,function(){t.removeAttr("data-lazy").removeClass("slick-loading")}),s.$slider.trigger("lazyLoaded",[s,t,n])})},i.onerror=function(){t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),s.$slider.trigger("lazyLoadError",[s,t,n])},i.src=n})}var n,i,o,r,s=this;o=s.options.slidesToShow,r=Math.ceil(o+s.options.slidesToShow),s.options.fade===!0&&(o>0&&o--,r<=s.slideCount&&r++),n=s.$slider.find(".slick-slide").slice(o,r),t(n),s.slideCount<=s.options.slidesToShow?(i=s.$slider.find(".slick-slide"),t(i)):s.currentSlide>=s.slideCount-s.options.slidesToShow?(i=s.$slider.find(".slick-cloned").slice(0,s.options.slidesToShow),t(i)):0===s.currentSlide&&(i=s.$slider.find(".slick-cloned").slice(s.options.slidesToShow*-1),t(i))},t.prototype.loadSlider=function(){var e=this;e.setPosition(),e.$slideTrack.css({opacity:1}),e.$slider.removeClass("slick-loading"),e.initUI()},t.prototype.next=t.prototype.slickNext=function(){var e=this;e.changeSlide({data:{message:"next"}})},t.prototype.orientationChange=function(){var e=this;e.setPosition()},t.prototype.pause=t.prototype.slickPause=function(){var e=this;e.autoPlayClear(),e.paused=!0},t.prototype.play=t.prototype.slickPlay=function(){var e=this;e.autoPlay(),e.options.autoplay=!0,e.paused=!1,e.focussed=!1,e.interrupted=!1},t.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),t.options.accessibility===!0&&t.updateADA())},t.prototype.prev=t.prototype.slickPrev=function(){var e=this;e.changeSlide({data:{message:"previous"}})},t.prototype.preventDefault=function(e){e.preventDefault()},t.prototype.refresh=function(t){var n,i,o=this;i=o.slideCount-o.options.slidesToShow,o.slideCount<=o.options.slidesToShow&&(o.currentSlide=0),n=o.currentSlide,o.destroy(!0),e.extend(o,o.initials,{currentSlide:n}),o.init(),t||o.changeSlide({data:{message:"index",index:n}},!1)},t.prototype.reinit=function(){var t=this;t.$slides=t.$slideTrack.children(t.options.slide).addClass("slick-slide"),t.slideCount=t.$slides.length,t.currentSlide>=t.slideCount&&0!==t.currentSlide&&(t.currentSlide=t.currentSlide-t.options.slidesToScroll),t.slideCount<=t.options.slidesToShow&&(t.currentSlide=0),t.setProps(),t.setupInfinite(),t.buildArrows(),t.initArrowEvents(),t.buildDots(),t.updateDots(),t.initDotEvents(),t.cleanUpSlideEvents(),t.initSlideEvents(),t.options.focusOnSelect===!0&&e(t.$slideTrack).children().on("click.slick",t.selectHandler),t.setSlideClasses("number"==typeof t.currentSlide?t.currentSlide:0),t.setPosition(),t.focusHandler(),t.paused=!t.options.autoplay,t.autoPlay(),t.$slider.trigger("reInit",[t])},t.prototype.resize=function(){var t=this;e(window).width()!==t.windowWidth&&(clearTimeout(t.windowDelay),t.windowDelay=window.setTimeout(function(){t.windowWidth=e(window).width(),t.unslicked||t.setPosition()},50))},t.prototype.setCSS=function(e){var t,n,i=this,o={};i.options.rtl===!0&&(e=-e),t="left"==i.positionProp?Math.ceil(e)+"px":"0px",n="top"==i.positionProp?Math.ceil(e)+"px":"0px",o[i.positionProp]=e,i.transformsEnabled===!1?i.$slideTrack.css(o):(o={},i.cssTransitions===!1?(o[i.animType]="translate("+t+", "+n+")",i.$slideTrack.css(o)):(o[i.animType]="translate3d("+t+", "+n+", 0px)",i.$slideTrack.css(o)))},t.prototype.setDimensions=function(){var e=this;e.listWidth=e.$list.width(),e.listHeight=e.$list.height(),e.slideWidth=Math.ceil(e.listWidth/e.options.slidesToShow),e.$slideTrack.width(Math.ceil(e.slideWidth*e.$slideTrack.children(".slick-slide").length));var t=e.$slides.first().outerWidth(!0)-e.$slides.first().width();e.$slideTrack.children(".slick-slide").width(e.slideWidth-t)},t.prototype.setFade=function(){var t,n=this;n.$slides.each(function(i,o){t=n.slideWidth*i*-1,n.options.rtl===!0?e(o).css({position:"relative",right:t,top:0,zIndex:n.options.zIndex-2,opacity:0}):e(o).css({position:"relative",left:t,top:0,zIndex:n.options.zIndex-2,opacity:0})}),n.$slides.eq(n.currentSlide).css({zIndex:n.options.zIndex-1,opacity:1})},t.prototype.setOption=t.prototype.slickSetOption=function(){var t,n,i,o=this,r=!1;"object"===e.type(arguments[0])?(t=arguments[0],r=arguments[1],i="multiple"):"string"===e.type(arguments[0])&&(t=arguments[0],n=arguments[1],r=arguments[2],"undefined"!=typeof arguments[1]&&(i="single")),"single"===i?o.options[t]=n:"multiple"===i&&e.each(t,function(e,t){o.options[e]=t}),r&&(o.unload(),o.reinit())},t.prototype.setPosition=function(){var e=this;e.setDimensions(),e.options.fade===!1?e.setCSS(e.getLeft(e.currentSlide)):e.setFade(),e.$slider.trigger("setPosition",[e])},t.prototype.setProps=function(){var e=this,t=document.body.style;e.positionProp="left",e.$slider.removeClass("slick-vertical"),void 0===t.WebkitTransition&&void 0===t.MozTransition&&void 0===t.msTransition||e.options.useCSS===!0&&(e.cssTransitions=!0),e.options.fade&&("number"==typeof e.options.zIndex?e.options.zIndex<3&&(e.options.zIndex=3):e.options.zIndex=e.defaults.zIndex),void 0!==t.OTransform&&(e.animType="OTransform",e.transformType="-o-transform",e.transitionType="OTransition",void 0===t.perspectiveProperty&&void 0===t.webkitPerspective&&(e.animType=!1)),void 0!==t.MozTransform&&(e.animType="MozTransform",e.transformType="-moz-transform",e.transitionType="MozTransition",void 0===t.perspectiveProperty&&void 0===t.MozPerspective&&(e.animType=!1)),void 0!==t.webkitTransform&&(e.animType="webkitTransform",e.transformType="-webkit-transform",e.transitionType="webkitTransition",void 0===t.perspectiveProperty&&void 0===t.webkitPerspective&&(e.animType=!1)),void 0!==t.msTransform&&(e.animType="msTransform",e.transformType="-ms-transform",e.transitionType="msTransition",void 0===t.msTransform&&(e.animType=!1)),void 0!==t.transform&&e.animType!==!1&&(e.animType="transform",e.transformType="transform",e.transitionType="transition"),e.transformsEnabled=e.options.useTransform&&null!==e.animType&&e.animType!==!1},t.prototype.setSlideClasses=function(e){var t,n,i,o=this;t=o.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),o.$slides.eq(e).addClass("slick-current"),e>=0&&e<=o.slideCount-o.options.slidesToShow?o.$slides.slice(e,e+o.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=o.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(i=o.slideCount%o.options.slidesToShow,n=o.options.slidesToShow+e,o.options.slidesToShow==o.options.slidesToScroll&&o.slideCount-e<o.options.slidesToShow?t.slice(n-(o.options.slidesToShow-i),n+i).addClass("slick-active").attr("aria-hidden","false"):t.slice(n,n+o.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")),o.options.lazyLoad===!0&&o.lazyLoad()},t.prototype.setupInfinite=function(){var t,n,i,o=this;if(o.options.fade===!1&&(n=null,o.slideCount>o.options.slidesToShow)){for(i=o.options.slidesToShow,t=o.slideCount;t>o.slideCount-i;t-=1)n=t-1,e(o.$slides[n]).clone(!0).attr("id","").attr("data-slick-index",n-o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");for(t=0;t<i;t+=1)n=t,e(o.$slides[n]).clone(!0).attr("id","").attr("data-slick-index",n+o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");o.$slideTrack.find(".slick-cloned").find("[id]").each(function(){e(this).attr("id","")})}},t.prototype.interrupt=function(e){var t=this;e||t.autoPlay(),t.interrupted=e},t.prototype.selectHandler=function(t){var n=this,i=e(t.target).is(".slick-slide")?e(t.target):e(t.target).parents(".slick-slide"),o=parseInt(i.attr("data-slick-index"));return o||(o=0),n.slideCount<=n.options.slidesToShow?(n.setSlideClasses(o),void n.asNavFor(o)):void n.slideHandler(o)},t.prototype.slideHandler=function(e,t,n){var i,o,r,s,a,l=null,u=this;if(t=t||!1,(u.animating!==!0||u.options.waitForAnimate!==!0)&&!(u.options.fade===!0&&u.currentSlide===e||u.slideCount<=u.options.slidesToShow))return t===!1&&u.asNavFor(e),i=e,l=u.getLeft(i),s=u.getLeft(u.currentSlide),u.currentLeft=null===u.swipeLeft?s:u.swipeLeft,u.options.autoplay&&clearInterval(u.autoPlayTimer),o=i<0?u.slideCount%u.options.slidesToScroll!==0?u.slideCount-u.slideCount%u.options.slidesToScroll:u.slideCount+i:i>=u.slideCount?u.slideCount%u.options.slidesToScroll!==0?0:i-u.slideCount:i,u.animating=!0,u.$slider.trigger("beforeChange",[u,u.currentSlide,o]),r=u.currentSlide,u.currentSlide=o,u.setSlideClasses(u.currentSlide),u.options.asNavFor&&(a=u.getNavTarget(),a=a.slick("getSlick"),a.slideCount<=a.options.slidesToShow&&a.setSlideClasses(u.currentSlide)),u.updateDots(),u.options.fade===!0?void(n!==!0?(u.fadeSlideOut(r),u.fadeSlide(o,function(){u.postSlide(o)})):u.postSlide(o)):void(n!==!0?u.animateSlide(l,function(){u.postSlide(o)}):u.postSlide(o))},t.prototype.startLoad=function(){var e=this;e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow.hide(),e.$nextArrow.hide()),e.options.dots===!0&&e.slideCount>e.options.slidesToShow&&e.$dots.hide(),e.$slider.addClass("slick-loading")},t.prototype.swipeDirection=function(){var e,t,n,i,o=this;return e=o.touchObject.startX-o.touchObject.curX,t=o.touchObject.startY-o.touchObject.curY,n=Math.atan2(t,e),i=Math.round(180*n/Math.PI),i<0&&(i=360-Math.abs(i)),i<=45&&i>=0?o.options.rtl===!1?"left":"right":i<=360&&i>=315?o.options.rtl===!1?"left":"right":i>=135&&i<=225?o.options.rtl===!1?"right":"left":"vertical"},t.prototype.swipeEnd=function(e){var t,n,i=this;if(i.dragging=!1,i.interrupted=!1,i.shouldClick=!(i.touchObject.swipeLength>10),void 0===i.touchObject.curX)return!1;if(i.touchObject.edgeHit===!0&&i.$slider.trigger("edge",[i,i.swipeDirection()]),i.touchObject.swipeLength>=i.touchObject.minSwipe){switch(n=i.swipeDirection()){case"left":case"down":t=i.options.swipeToSlide?i.checkNavigable(i.currentSlide+i.getSlideCount()):i.currentSlide+i.getSlideCount(),i.currentDirection=0;break;case"right":case"up":t=i.options.swipeToSlide?i.checkNavigable(i.currentSlide-i.getSlideCount()):i.currentSlide-i.getSlideCount(),i.currentDirection=1}"vertical"!=n&&(i.slideHandler(t),i.touchObject={},i.$slider.trigger("swipe",[i,n]))}else i.touchObject.startX!==i.touchObject.curX&&(i.slideHandler(i.currentSlide),i.touchObject={})},t.prototype.swipeHandler=function(e){var t=this;if(!(t.options.swipe===!1||"ontouchend"in document&&t.options.swipe===!1||t.options.draggable===!1&&e.type.indexOf("mouse")!==-1))switch(t.touchObject.fingerCount=e.originalEvent&&void 0!==e.originalEvent.touches?e.originalEvent.touches.length:1,t.touchObject.minSwipe=t.listWidth/t.options.touchThreshold,e.data.action){case"start":t.swipeStart(e);break;case"move":t.swipeMove(e);break;case"end":t.swipeEnd(e)}},t.prototype.swipeMove=function(e){var t,n,i,o,r,s=this;return r=void 0!==e.originalEvent?e.originalEvent.touches:null,!(!s.dragging||r&&1!==r.length)&&(t=s.getLeft(s.currentSlide),s.touchObject.curX=void 0!==r?r[0].pageX:e.clientX,s.touchObject.curY=void 0!==r?r[0].pageY:e.clientY,s.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(s.touchObject.curX-s.touchObject.startX,2))),n=s.swipeDirection(),"vertical"!==n?(void 0!==e.originalEvent&&s.touchObject.swipeLength>4&&e.preventDefault(),o=(s.options.rtl===!1?1:-1)*(s.touchObject.curX>s.touchObject.startX?1:-1),s.options.verticalSwiping===!0&&(o=s.touchObject.curY>s.touchObject.startY?1:-1),i=s.touchObject.swipeLength,s.touchObject.edgeHit=!1,s.swipeLeft=t+i*o,s.options.fade!==!0&&s.options.touchMove!==!1&&(s.animating===!0?(s.swipeLeft=null,!1):void s.setCSS(s.swipeLeft))):void 0)},t.prototype.swipeStart=function(e){var t,n=this;return n.interrupted=!0,1!==n.touchObject.fingerCount||n.slideCount<=n.options.slidesToShow?(n.touchObject={},!1):(void 0!==e.originalEvent&&void 0!==e.originalEvent.touches&&(t=e.originalEvent.touches[0]),n.touchObject.startX=n.touchObject.curX=void 0!==t?t.pageX:e.clientX,n.touchObject.startY=n.touchObject.curY=void 0!==t?t.pageY:e.clientY,void(n.dragging=!0))},t.prototype.unfilterSlides=t.prototype.slickUnfilter=function(){var e=this;null!==e.$slidesCache&&(e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.appendTo(e.$slideTrack),e.reinit())},t.prototype.unload=function(){var t=this;e(".slick-cloned",t.$slider).remove(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove(),t.$nextArrow&&t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove(),t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},t.prototype.unslick=function(e){var t=this;t.$slider.trigger("unslick",[t,e]),t.destroy()},t.prototype.updateDots=function(){var e=this;null!==e.$dots&&(e.$dots.find("li").removeClass("slick-active"),e.$dots.find("li").eq(Math.floor(e.currentSlide/e.options.slidesToScroll)).addClass("slick-active"))},t.prototype.visibility=function(){var e=this;e.options.autoplay&&(document[e.hidden]?e.interrupted=!0:e.interrupted=!1)},e.fn.slick=function(){var e,n,i=this,o=arguments[0],r=Array.prototype.slice.call(arguments,1),s=i.length;for(e=0;e<s;e++)if("object"==typeof o||"undefined"==typeof o?i[e].slick=new t(i[e],o):n=i[e].slick[o].apply(i[e].slick,r),"undefined"!=typeof n)return n;return i}});
if ((theme.variables.variant_template_name === 'cart') && (theme.variables.shipping_calculator == 'Enabled'))	{
/**
 * Module to add a shipping rates calculator to cart page.
 *
 * Copyright (c) 2011-2016 Caroline Schnapp (11heavens.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Modified by David Little, 2016
 */

"object"==typeof Countries&&(Countries.updateProvinceLabel=function(e,t){if("string"==typeof e&&Countries[e]&&Countries[e].provinces){if("object"!=typeof t&&(t=document.getElementById("address_province_label"),null===t))return;t.innerHTML=Countries[e].label;var r=jQuery(t).parent();r.find("select");r.find(".custom-style-select-box-inner").html(Countries[e].provinces[0])}}),"undefined"==typeof Shopify.Cart&&(Shopify.Cart={}),Shopify.Cart.ShippingCalculator=function(){var _config={submitButton:"Calculate shipping",submitButtonDisabled:"Calculating...",templateId:"shipping-calculator-response-template",wrapperId:"wrapper-response",customerIsLoggedIn:!1,moneyFormat:"${{amount}}"},_render=function(e){var t=jQuery("#"+_config.templateId),r=jQuery("#"+_config.wrapperId);if(t.length&&r.length){var templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var n=Handlebars.compile(jQuery.trim(t.text())),a=n(e);if(jQuery(a).appendTo(r),"undefined"!=typeof Currency&&"function"==typeof Currency.convertAll){var i="";jQuery("[name=currencies]").size()?i=jQuery("[name=currencies]").val():jQuery("#currencies span.selected").size()&&(i=jQuery("#currencies span.selected").attr("data-currency")),""!==i&&Currency.convertAll(shopCurrency,i,"#wrapper-response span.money, #estimated-shipping span.money")}}},_enableButtons=function(){jQuery(".get-rates").removeAttr("disabled").removeClass("disabled").val(_config.submitButton)},_disableButtons=function(){jQuery(".get-rates").val(_config.submitButtonDisabled).attr("disabled","disabled").addClass("disabled")},_getCartShippingRatesForDestination=function(e){var t={type:"POST",url:"/cart/prepare_shipping_rates",data:jQuery.param({shipping_address:e}),success:_pollForCartShippingRatesForDestination(e),error:_onError};jQuery.ajax(t)},_pollForCartShippingRatesForDestination=function(e){var t=function(){jQuery.ajax("/cart/async_shipping_rates",{dataType:"json",success:function(r,n,a){200===a.status?_onCartShippingRatesUpdate(r.shipping_rates,e):setTimeout(t,500)},error:_onError})};return t},_fullMessagesFromErrors=function(e){var t=[];return jQuery.each(e,function(e,r){jQuery.each(r,function(r,n){t.push(e+" "+n)})}),t},_onError=function(XMLHttpRequest,textStatus){jQuery("#estimated-shipping").hide(),jQuery("#estimated-shipping em").empty(),_enableButtons();var feedback="",data=eval("("+XMLHttpRequest.responseText+")");feedback=data.message?data.message+"("+data.status+"): "+data.description:"Error : "+_fullMessagesFromErrors(data).join("; ")+".","Error : country is not supported."===feedback&&(feedback="We do not ship to this destination."),_render({rates:[],errorFeedback:feedback,success:!1}),jQuery("#"+_config.wrapperId).show()},_onCartShippingRatesUpdate=function(e,t){_enableButtons();var r="";if(t.zip&&(r+=t.zip+", "),t.province&&(r+=t.province+", "),r+=t.country,e.length){"0.00"==e[0].price?jQuery("#estimated-shipping em").html("FREE"):jQuery("#estimated-shipping em").html(_formatRate(e[0].price));for(var n=0;n<e.length;n++)e[n].price=_formatRate(e[n].price)}_render({rates:e,address:r,success:!0}),jQuery("#"+_config.wrapperId+", #estimated-shipping").fadeIn()},_formatRate=function(e){function t(e,t){return"undefined"==typeof e?t:e}function r(e,r,n,a){if(r=t(r,2),n=t(n,","),a=t(a,"."),isNaN(e)||null==e)return 0;e=(e/100).toFixed(r);var i=e.split("."),o=i[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+n),s=i[1]?a+i[1]:"";return o+s}if("function"==typeof Shopify.formatMoney)return Shopify.formatMoney(e,_config.moneyFormat);"string"==typeof e&&(e=e.replace(".",""));var n="",a=/\{\{\s*(\w+)\s*\}\}/,i=_config.moneyFormat;switch(i.match(a)[1]){case"amount":n=r(e,2);break;case"amount_no_decimals":n=r(e,0);break;case"amount_with_comma_separator":n=r(e,2,".",",");break;case"amount_no_decimals_with_comma_separator":n=r(e,0,".",",")}return i.replace(a,n)};return _init=function(){new Shopify.CountryProvinceSelector("address_country","address_province",{hideElement:"address_province_container"});var e=jQuery("#address_country"),t=jQuery("#address_province_label").get(0);"undefined"!=typeof Countries&&(Countries.updateProvinceLabel(e.val(),t),e.change(function(){Countries.updateProvinceLabel(e.val(),t)})),jQuery(".get-rates").click(function(){_disableButtons(),jQuery("#"+_config.wrapperId).empty().hide();var e={};e.zip=jQuery("#address_zip").val()||"",e.country=jQuery("#address_country").val()||"",e.province=jQuery("#address_province").val()||"",_getCartShippingRatesForDestination(e)}),_config.customerIsLoggedIn&&jQuery(".get-rates:eq(0)").trigger("click")},{show:function(e){e=e||{},jQuery.extend(_config,e),jQuery(function(){_init()})},getConfig:function(){return _config},formatRate:function(e){return _formatRate(e)}}}();
}

window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

window.slate = window.slate || {};

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/* ================ GLOBAL ================ */
theme.LibraryLoader = (function() {
  var types = {
    link: 'link',
    script: 'script'
  };

  var status = {
    requested: 'requested',
    loaded: 'loaded'
  };

  var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';

  var libraries = {
    youtubeSdk: {
      tagId: 'youtube-sdk',
      src: 'https://www.youtube.com/iframe_api',
      type: types.script
    },
    plyrShopifyStyles: {
      tagId: 'plyr-shopify-styles',
      src: cloudCdn + 'shopify-plyr/v1.0/shopify-plyr.css',
      type: types.link
    },
    modelViewerUiStyles: {
      tagId: 'shopify-model-viewer-ui-styles',
      src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
      type: types.link
    }
  };

  function load(libraryName, callback) {
    var library = libraries[libraryName];

    if (!library) return;
    if (library.status === status.requested) return;

    callback = callback || function() {};
    if (library.status === status.loaded) {
      callback();
      return;
    }

    library.status = status.requested;

    var tag;

    switch (library.type) {
      case types.script:
        tag = createScriptTag(library, callback);
        break;
      case types.link:
        tag = createLinkTag(library, callback);
        break;
    }

    tag.id = library.tagId;
    library.element = tag;

    var firstScriptTag = document.getElementsByTagName(library.type)[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function createScriptTag(library, callback) {
    var tag = document.createElement('script');
    tag.src = library.src;
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  function createLinkTag(library, callback) {
    var tag = document.createElement('link');
    tag.href = library.src;
    tag.rel = 'stylesheet';
    tag.type = 'text/css';
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  return {
    load: load
  };
})();

/* ================ MODULES ================ */
window.theme = window.theme || {};

theme.Slideshow = (function() {
  this.$slideshow = null;
  var classes = {
    slideshow: 'slideshow',
    slickActiveMobile: 'slick-active-mobile',
    controlsHover: 'slideshow__controls--hover',
    isPaused: 'is-paused'
  };

  var selectors = {
    section: '.shopify-section',
    wrapper: '#SlideshowWrapper-',
    slides: '.slideshow__slide',
    textWrapperMobile: '.slideshow__text-wrap--mobile',
    textContentMobile: '.slideshow__text-content--mobile',
    controls: '.slideshow__controls',
    pauseButton: '.slideshow__pause',
    dots: '.slick-dots',
    arrows: '.slideshow__arrows',
    arrowsMobile: '.slideshow__arrows--mobile',
    arrowLeft: '.slideshow__arrow-left',
    arrowRight: '.slideshow__arrow-right'
  };

  function slideshow(el, sectionId) {
    var $slideshow = (this.$slideshow = $(el));
    this.adaptHeight = this.$slideshow.data('adapt-height');
    this.$wrapper = this.$slideshow.closest(selectors.wrapper + sectionId);
    this.$section = this.$wrapper.closest(selectors.section);
    this.$controls = this.$wrapper.find(selectors.controls);
    this.$arrows = this.$section.find(selectors.arrows);
    this.$arrowsMobile = this.$section.find(selectors.arrowsMobile);
    this.$pause = this.$controls.find(selectors.pauseButton);
    this.$textWrapperMobile = this.$section.find(selectors.textWrapperMobile);
    this.autorotate = this.$slideshow.data('autorotate');
    var autoplaySpeed = this.$slideshow.data('speed');
    var loadSlideA11yString = this.$slideshow.data('slide-nav-a11y');

    this.settings = {
      accessibility: true,
      arrows: false,
      dots: true,
      fade: true,
      draggable: true,
      touchThreshold: 20,
	  rtl: $('body').hasClass('rtl-layout'),
      autoplay: this.autorotate,
      autoplaySpeed: autoplaySpeed,
      // eslint-disable-next-line shopify/jquery-dollar-sign-reference
      appendDots: this.$arrows,
      customPaging: function(slick, index) {
        return (
          '<a href="' +
          selectors.wrapper +
          sectionId +
          '" aria-label="' +
          loadSlideA11yString.replace('[slide_number]', index + 1) +
          '" data-slide-number="' +
          index +
          '"></a>'
        );
      }
    };

    this.$slideshow.on('beforeChange', beforeChange.bind(this));
    this.$slideshow.on('init', slideshowA11ySetup.bind(this));

    // Add class to style mobile dots & show the correct text content for the
    // first slide on mobile when the slideshow initialises
    this.$slideshow.on(
      'init',
      function() {
        this.$mobileDots
          .find('li:first-of-type')
          .addClass(classes.slickActiveMobile);
        this.showMobileText(0);
      }.bind(this)
    );

    // Stop the autorotate when you scroll past the mobile controls, resume when
    // they are scrolled back into view
    if (this.autorotate) {
      $(document).scroll(
        $.debounce(
          250,
          function() {
            if (
              this.$arrowsMobile.offset().top +
                this.$arrowsMobile.outerHeight() <
              window.pageYOffset
            ) {
              $slideshow.slick('slickPause');
            } else if (!this.$pause.hasClass(classes.isPaused)) {
              $slideshow.slick('slickPlay');
            }
          }.bind(this)
        )
      );
    }

    if (this.adaptHeight) {
      this.setSlideshowHeight();
      $(window).resize($.debounce(50, this.setSlideshowHeight.bind(this)));
    }

    this.$slideshow.slick(this.settings);

    // This can't be called when the slick 'init' event fires due to how slick
    // adds a11y features.
    slideshowPostInitA11ySetup.bind(this)();

    this.$arrows.find(selectors.arrowLeft).on('click', function() {
      $slideshow.slick('slickPrev');
    });
    this.$arrows.find(selectors.arrowRight).on('click', function() {
      $slideshow.slick('slickNext');
    });

    this.$pause.on('click', this.togglePause.bind(this));
  }

  function slideshowA11ySetup(event, obj) {
    var $slider = obj.$slider;
    var $list = obj.$list;
    this.$dots = this.$section.find(selectors.dots);
    this.$mobileDots = this.$dots.eq(1);

    // Remove default Slick aria-live attr until slider is focused
    $list.removeAttr('aria-live');

    this.$wrapper.on('keyup', keyboardNavigation.bind(this));
    this.$controls.on('keyup', keyboardNavigation.bind(this));
    this.$textWrapperMobile.on('keyup', keyboardNavigation.bind(this));

    // When an element in the slider is focused
    // pause slideshow and set aria-live.
    this.$wrapper
      .on(
        'focusin',
        function(evt) {
          if (!this.$wrapper.has(evt.target).length) {
            return;
          }

          $list.attr('aria-live', 'polite');
          if (this.autorotate) {
            $slider.slick('slickPause');
          }
        }.bind(this)
      )
      .on(
        'focusout',
        function(evt) {
          if (!this.$wrapper.has(evt.target).length) {
            return;
          }

          $list.removeAttr('aria-live');
          if (this.autorotate) {
            // Only resume playing if the user hasn't paused using the pause
            // button
            if (!this.$pause.is('.is-paused')) {
              $slider.slick('slickPlay');
            }
          }
        }.bind(this)
      );

    // Add arrow key support when focused
    if (this.$dots) {
      this.$dots
        .find('a')
        .each(function() {
          var $dot = $(this);
          $dot.on('click keyup', function(evt) {
            if (
              evt.type === 'keyup' &&
              evt.which !== slate.utils.keyboardKeys.ENTER
            )
              return;

            evt.preventDefault();

            var slideNumber = $(evt.target).data('slide-number');

            $slider.attr('tabindex', -1).slick('slickGoTo', slideNumber);

            if (evt.type === 'keyup') {
              $slider.focus();
            }
          });
        })
        .eq(0)
        .attr('aria-current', 'true');
    }

    this.$controls
      .on('focusin', highlightControls.bind(this))
      .on('focusout', unhighlightControls.bind(this));
  }

  function slideshowPostInitA11ySetup() {
    var $slides = this.$slideshow.find(selectors.slides);

    $slides.removeAttr('role').removeAttr('aria-labelledby');
    this.$dots
      .removeAttr('role')
      .find('li')
      .removeAttr('role')
      .removeAttr('aria-selected')
      .each(function() {
        var $dot = $(this);
        var ariaControls = $dot.attr('aria-controls');
        $dot
          .removeAttr('aria-controls')
          .find('a')
          .attr('aria-controls', ariaControls);
      });
  }

  function beforeChange(event, slick, currentSlide, nextSlide) {
    var $dotLinks = this.$dots.find('a');
    var $mobileDotLinks = this.$mobileDots.find('li');

    $dotLinks
      .removeAttr('aria-current')
      .eq(nextSlide)
      .attr('aria-current', 'true');

    $mobileDotLinks
      .removeClass(classes.slickActiveMobile)
      .eq(nextSlide)
      .addClass(classes.slickActiveMobile);
    this.showMobileText(nextSlide);
  }

  function keyboardNavigation() {
    if (event.keyCode === slate.utils.keyboardKeys.LEFTARROW) {
      this.$slideshow.slick('slickPrev');
    }
    if (event.keyCode === slate.utils.keyboardKeys.RIGHTARROW) {
      this.$slideshow.slick('slickNext');
    }
  }

  function highlightControls() {
    this.$controls.addClass(classes.controlsHover);
  }

  function unhighlightControls() {
    this.$controls.removeClass(classes.controlsHover);
  }

  slideshow.prototype.togglePause = function() {
    var slideshowSelector = getSlideshowId(this.$pause);
    if (this.$pause.hasClass(classes.isPaused)) {
      this.$pause.removeClass(classes.isPaused).attr('aria-pressed', 'false');
      if (this.autorotate) {
        $(slideshowSelector).slick('slickPlay');
      }
    } else {
      this.$pause.addClass(classes.isPaused).attr('aria-pressed', 'true');
      if (this.autorotate) {
        $(slideshowSelector).slick('slickPause');
      }
    }
  };

  slideshow.prototype.setSlideshowHeight = function() {
    var minAspectRatio = this.$slideshow.data('min-aspect-ratio');
    this.$slideshow.height($(document).width() / minAspectRatio);
  };

  slideshow.prototype.showMobileText = function(slideIndex) {
    var $allTextContent = this.$textWrapperMobile.find(
      selectors.textContentMobile
    );
    var currentTextContentSelector =
      selectors.textContentMobile + '-' + slideIndex;
    var $currentTextContent = this.$textWrapperMobile.find(
      currentTextContentSelector
    );
    if (
      !$currentTextContent.length &&
      this.$slideshow.find(selectors.slides).length === 1
    ) {
      this.$textWrapperMobile.hide();
    } else {
      this.$textWrapperMobile.show();
    }
    $allTextContent.hide();
    $currentTextContent.show();
  };

  function getSlideshowId($el) {
    return '#Slideshow-' + $el.data('id');
  }

  return slideshow;
})();

theme.Video = (function() {
  var autoplayCheckComplete = false;
  var playOnClickChecked = false;
  var playOnClick = false;
  var youtubeLoaded = false;
  var videos = {};
  var videoPlayers = [];
  var videoOptions = {
    ratio: 16 / 9,
    scrollAnimationDuration: 400,
    playerVars: {
      // eslint-disable-next-line camelcase
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 0,
      controls: 0,
      wmode: 'opaque',
      branding: 0,
      autohide: 0,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerChange
    }
  };
  var classes = {
    playing: 'video-is-playing',
    paused: 'video-is-paused',
    loading: 'video-is-loading',
    loaded: 'video-is-loaded',
    backgroundVideoWrapper: 'video-background-wrapper',
    videoWithImage: 'video--image_with_play',
    backgroundVideo: 'video--background',
    userPaused: 'is-paused',
    supportsAutoplay: 'autoplay',
    supportsNoAutoplay: 'no-autoplay',
    wrapperMinHeight: 'video-section-wrapper--min-height'
  };

  var selectors = {
    section: '.video-section',
    videoWrapper: '.video-section-wrapper',
    playVideoBtn: '.video-control__play',
    closeVideoBtn: '.video-control__close-wrapper',
    pauseVideoBtn: '.video__pause',
    pauseVideoStop: '.video__pause-stop',
    pauseVideoResume: '.video__pause-resume',
    fallbackText: '.icon__fallback-text'
  };

  /**
   * Public functions
   */
  function init($video) {
    if (!$video.length) {
      return;
    }

    videos[$video.attr('id')] = {
      id: $video.attr('id'),
      videoId: $video.data('id'),
      type: $video.data('type'),
      status:
        $video.data('type') === 'image_with_play' ? 'closed' : 'background', // closed, open, background
      $video: $video,
      $videoWrapper: $video.closest(selectors.videoWrapper),
      $section: $video.closest(selectors.section),
      controls: $video.data('type') === 'background' ? 0 : 1
    };

    if (!youtubeLoaded) {
      // This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    playOnClickCheck();
  }

  function customPlayVideo(playerId) {
    // Make sure we have carried out the playOnClick check first
    if (!playOnClickChecked && !playOnClick) {
      return;
    }

    if (playerId && typeof videoPlayers[playerId].playVideo === 'function') {
      privatePlayVideo(playerId);
    }
  }

  function pauseVideo(playerId) {
    if (
      videoPlayers[playerId] &&
      typeof videoPlayers[playerId].pauseVideo === 'function'
    ) {
      videoPlayers[playerId].pauseVideo();
    }
  }

  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        createPlayer(key);
      }
    }

    initEvents();
    youtubeLoaded = true;
  }

  function editorLoadVideo(key) {
    if (!youtubeLoaded) {
      return;
    }
    createPlayer(key);

    initEvents();
  }

  /**
   * Private functions
   */

  function privatePlayVideo(id, clicked) {
    var videoData = videos[id];
    var player = videoPlayers[id];
    var $videoWrapper = videoData.$videoWrapper;

    if (playOnClick) {
      // playOnClick means we are probably on mobile (no autoplay).
      // setAsPlaying will show the iframe, requiring another click
      // to play the video.
      setAsPlaying(videoData);
    } else if (clicked || autoplayCheckComplete) {
      // Play if autoplay is available or clicked to play
      $videoWrapper.removeClass(classes.loading);
      setAsPlaying(videoData);
      player.playVideo();
      return;
    } else {
      player.playVideo();
    }
  }

  function setAutoplaySupport(supported) {
    var supportClass = supported
      ? classes.supportsAutoplay
      : classes.supportsNoAutoplay;
    $(document.documentElement)
      .removeClass(classes.supportsAutoplay)
      .removeClass(classes.supportsNoAutoplay)
      .addClass(supportClass);

    if (!supported) {
      playOnClick = true;
    }

    autoplayCheckComplete = true;
  }

  function playOnClickCheck() {
    // Bail early for a few instances:
    // - small screen
    // - device sniff mobile browser

    if (playOnClickChecked) {
      return;
    }

    if (isMobile()) {
      playOnClick = true;
    }

    if (playOnClick) {
      // No need to also do the autoplay check
      setAutoplaySupport(false);
    }

    playOnClickChecked = true;
  }

  // The API will call this function when each video player is ready
  function onPlayerReady(evt) {
    evt.target.setPlaybackQuality('hd1080');
    var videoData = getVideoOptions(evt);
    var videoTitle = evt.target.getVideoData().title;
    playOnClickCheck();

    // Prevent tabbing through YouTube player controls until visible
    $('#' + videoData.id).attr('tabindex', '-1');

    sizeBackgroundVideos();
    setButtonLabels(videoData.$videoWrapper, videoTitle);

    // Customize based on options from the video ID
    if (videoData.type === 'background') {
      evt.target.mute();
      privatePlayVideo(videoData.id);
    }

    videoData.$videoWrapper.addClass(classes.loaded);
  }

  function onPlayerChange(evt) {
    var videoData = getVideoOptions(evt);
    if (
      videoData.status === 'background' &&
      !isMobile() &&
      !autoplayCheckComplete &&
      (evt.data === YT.PlayerState.PLAYING ||
        evt.data === YT.PlayerState.BUFFERING)
    ) {
      setAutoplaySupport(true);
      autoplayCheckComplete = true;
      videoData.$videoWrapper.removeClass(classes.loading);
    }
    switch (evt.data) {
      case YT.PlayerState.ENDED:
        setAsFinished(videoData);
        break;
      case YT.PlayerState.PAUSED:
        // Seeking on a YouTube video also fires a PAUSED state change,
        // checking the state after a delay prevents us pausing the video when
        // the user is seeking instead of pausing
        setTimeout(function() {
          if (evt.target.getPlayerState() === YT.PlayerState.PAUSED) {
            setAsPaused(videoData);
          }
        }, 200);
        break;
    }
  }

  function setAsFinished(videoData) {
    switch (videoData.type) {
      case 'background':
        videoPlayers[videoData.id].seekTo(0);
        break;
      case 'image_with_play':
        closeVideo(videoData.id);
        toggleExpandVideo(videoData.id, false);
        break;
    }
  }

  function setAsPlaying(videoData) {
    var $videoWrapper = videoData.$videoWrapper;
    var $pauseButton = $videoWrapper.find(selectors.pauseVideoBtn);

    $videoWrapper.removeClass(classes.loading);

    if ($pauseButton.hasClass(classes.userPaused)) {
      $pauseButton.removeClass(classes.userPaused);
    }

    // Do not change element visibility if it is a background video
    if (videoData.status === 'background') {
      return;
    }

    $('#' + videoData.id).attr('tabindex', '0');

    if (videoData.type === 'image_with_play') {
      $videoWrapper.removeClass(classes.paused).addClass(classes.playing);
    }

    // Update focus to the close button so we stay within the video wrapper,
    // allowing time for the scroll animation
    setTimeout(function() {
      $videoWrapper.find(selectors.closeVideoBtn).focus();
    }, videoOptions.scrollAnimationDuration);
  }

  function setAsPaused(videoData) {
    var $videoWrapper = videoData.$videoWrapper;

    // YT's events fire after our click event. This status flag ensures
    // we don't interact with a closed or background video.
    if (videoData.type === 'image_with_play') {
      if (videoData.status === 'closed') {
        $videoWrapper.removeClass(classes.paused);
      } else {
        $videoWrapper.addClass(classes.paused);
      }
    }

    $videoWrapper.removeClass(classes.playing);
  }

  function closeVideo(playerId) {
    var videoData = videos[playerId];
    var $videoWrapper = videoData.$videoWrapper;
    var classesToRemove = [classes.paused, classes.playing].join(' ');

    if (isMobile()) {
      $videoWrapper.removeAttr('style');
    }

    $('#' + videoData.id).attr('tabindex', '-1');

    videoData.status = 'closed';

    switch (videoData.type) {
      case 'image_with_play':
        videoPlayers[playerId].stopVideo();
        setAsPaused(videoData); // in case the video is already paused
        break;
      case 'background':
        videoPlayers[playerId].mute();
        setBackgroundVideo(playerId);
        break;
    }

    $videoWrapper.removeClass(classesToRemove);
  }

  function getVideoOptions(evt) {
    var id = evt.target.getIframe().id;
    return videos[id];
  }

  function toggleExpandVideo(playerId, expand) {
    var video = videos[playerId];
    var elementTop = video.$videoWrapper.offset().top;
    var $playButton = video.$videoWrapper.find(selectors.playVideoBtn);
    var offset = 0;
    var newHeight = 0;

    if (isMobile()) {
      video.$videoWrapper.parent().toggleClass('page-width', !expand);
    }

    if (expand) {
      if (isMobile()) {
        newHeight = $(window).width() / videoOptions.ratio;
      } else {
        newHeight = video.$videoWrapper.width() / videoOptions.ratio;
      }
      offset = ($(window).height() - newHeight) / 2;

      video.$videoWrapper
        .removeClass(classes.wrapperMinHeight)
        .animate({ height: newHeight }, 600);

      // Animate doesn't work in mobile editor, so we don't use it
      if (!(isMobile() && Shopify.designMode)) {
        $('html, body').animate(
          {
            scrollTop: elementTop - offset
          },
          videoOptions.scrollAnimationDuration
        );
      }
    } else {
      if (isMobile()) {
        newHeight = video.$videoWrapper.data('mobile-height');
      } else {
        newHeight = video.$videoWrapper.data('desktop-height');
      }

      video.$videoWrapper
        .height(video.$videoWrapper.width() / videoOptions.ratio)
        .animate({ height: newHeight }, 600);
      setTimeout(function() {
        video.$videoWrapper.addClass(classes.wrapperMinHeight);
      }, 600);
      $playButton.focus();
    }
  }

  function togglePause(playerId) {
    var $pauseButton = videos[playerId].$videoWrapper.find(
      selectors.pauseVideoBtn
    );
    var paused = $pauseButton.hasClass(classes.userPaused);
    if (paused) {
      $pauseButton.removeClass(classes.userPaused);
      customPlayVideo(playerId);
    } else {
      $pauseButton.addClass(classes.userPaused);
      pauseVideo(playerId);
    }
    $pauseButton.attr('aria-pressed', !paused);
  }

  function startVideoOnClick(playerId) {
    var video = videos[playerId];

    // add loading class to wrapper
    video.$videoWrapper.addClass(classes.loading);

    // Explicity set the video wrapper height (needed for height transition)
    video.$videoWrapper.attr(
      'style',
      'height: ' + video.$videoWrapper.height() + 'px'
    );

    video.status = 'open';

    switch (video.type) {
      case 'image_with_play':
        privatePlayVideo(playerId, true);
        break;
      case 'background':
        unsetBackgroundVideo(playerId, video);
        videoPlayers[playerId].unMute();
        privatePlayVideo(playerId, true);
        break;
    }

    toggleExpandVideo(playerId, true);

    // esc to close video player
    $(document).on('keydown.videoPlayer', function(evt) {
      var playerId = $(document.activeElement).data('controls');
      if (evt.keyCode !== slate.utils.keyboardKeys.ESCAPE || !playerId) {
        return;
      }

      closeVideo(playerId);
      toggleExpandVideo(playerId, false);
    });
  }

  function sizeBackgroundVideos() {
    $('.' + classes.backgroundVideo).each(function(index, el) {
      sizeBackgroundVideo($(el));
    });
  }

  function sizeBackgroundVideo($videoPlayer) {
    if (!youtubeLoaded) {
      return;
    }

    if (isMobile()) {
      $videoPlayer.removeAttr('style');
    } else {
      var $videoWrapper = $videoPlayer.closest(selectors.videoWrapper);
      var videoWidth = $videoWrapper.width();
      var playerWidth = $videoPlayer.width();
      var desktopHeight = $videoWrapper.data('desktop-height');

      // when screen aspect ratio differs from video, video must center and underlay one dimension
      if (videoWidth / videoOptions.ratio < desktopHeight) {
        playerWidth = Math.ceil(desktopHeight * videoOptions.ratio); // get new player width
        $videoPlayer
          .width(playerWidth)
          .height(desktopHeight)
          .css({
            left: (videoWidth - playerWidth) / 2,
            top: 0
          }); // player width is greater, offset left; reset top
      } else {
        // new video width < window width (gap to right)
        desktopHeight = Math.ceil(videoWidth / videoOptions.ratio); // get new player height
        $videoPlayer
          .width(videoWidth)
          .height(desktopHeight)
          .css({
            left: 0,
            top: (desktopHeight - desktopHeight) / 2
          }); // player height is greater, offset top; reset left
      }

      $videoPlayer.prepareTransition();
      $videoWrapper.addClass(classes.loaded);
    }
  }

  function unsetBackgroundVideo(playerId) {
    // Switch the background video to a chrome-only player once played
    $('#' + playerId)
      .removeClass(classes.backgroundVideo)
      .addClass(classes.videoWithImage);

    setTimeout(function() {
      $('#' + playerId).removeAttr('style');
    }, 600);

    videos[playerId].$videoWrapper
      .removeClass(classes.backgroundVideoWrapper)
      .addClass(classes.playing);

    videos[playerId].status = 'open';
  }

  function setBackgroundVideo(playerId) {
    $('#' + playerId)
      .removeClass(classes.videoWithImage)
      .addClass(classes.backgroundVideo);

    videos[playerId].$videoWrapper.addClass(classes.backgroundVideoWrapper);

    videos[playerId].status = 'background';
    sizeBackgroundVideo($('#' + playerId));
  }

  function isMobile() {
    return $(window).width() < 750 || window.mobileCheck();
  }

  function initEvents() {
    $(document).on('click.videoPlayer', selectors.playVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');

      startVideoOnClick(playerId);
    });

    $(document).on('click.videoPlayer', selectors.closeVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');

      $(evt.currentTarget).blur();
      closeVideo(playerId);
      toggleExpandVideo(playerId, false);
    });

    $(document).on('click.videoPlayer', selectors.pauseVideoBtn, function(evt) {
      var playerId = $(evt.currentTarget).data('controls');
      togglePause(playerId);
    });

    // Listen to resize to keep a background-size:cover-like layout
    $(window).on(
      'resize.videoPlayer',
      $.debounce(200, function() {
        if (!youtubeLoaded) return;
        var key;
        var fullscreen = window.innerHeight === screen.height;

        sizeBackgroundVideos();

        if (isMobile()) {
          for (key in videos) {
            if (videos.hasOwnProperty(key)) {
              if (videos[key].$videoWrapper.hasClass(classes.playing)) {
                if (!fullscreen) {
                  pauseVideo(key);
                  setAsPaused(videos[key]);
                }
              }
              videos[key].$videoWrapper.height(
                $(document).width() / videoOptions.ratio
              );
            }
          }
          setAutoplaySupport(false);
        } else {
          setAutoplaySupport(true);
          for (key in videos) {
            if (
              videos[key].$videoWrapper.find('.' + classes.videoWithImage)
                .length
            ) {
              continue;
            }
            videoPlayers[key].playVideo();
            setAsPlaying(videos[key]);
          }
        }
      })
    );

    $(window).on(
      'scroll.videoPlayer',
      $.debounce(50, function() {
        if (!youtubeLoaded) return;

        for (var key in videos) {
          if (videos.hasOwnProperty(key)) {
            var $videoWrapper = videos[key].$videoWrapper;

            // Close the video if more than 75% of it is scrolled out of view
            if (
              $videoWrapper.hasClass(classes.playing) &&
              ($videoWrapper.offset().top + $videoWrapper.height() * 0.75 <
                $(window).scrollTop() ||
                $videoWrapper.offset().top + $videoWrapper.height() * 0.25 >
                  $(window).scrollTop() + $(window).height())
            ) {
              closeVideo(key);
              toggleExpandVideo(key, false);
            }
          }
        }
      })
    );
  }

  function createPlayer(key) {
    var args = $.extend({}, videoOptions, videos[key]);
    args.playerVars.controls = args.controls;
    videoPlayers[key] = new YT.Player(key, args);
  }

  function removeEvents() {
    $(document).off('.videoPlayer');
    $(window).off('.videoPlayer');
  }

  function setButtonLabels($videoWrapper, title) {
    var $playButtons = $videoWrapper.find(selectors.playVideoBtn);
    var $closeButton = $videoWrapper.find(selectors.closeVideoBtn);
    var $pauseButton = $videoWrapper.find(selectors.pauseVideoBtn);
    var $closeButtonText = $closeButton.find(selectors.fallbackText);
    var $pauseButtonStopText = $pauseButton
      .find(selectors.pauseVideoStop)
      .find(selectors.fallbackText);
    var $pauseButtonResumeText = $pauseButton
      .find(selectors.pauseVideoResume)
      .find(selectors.fallbackText);

    // Insert the video title retrieved from YouTube into the instructional text
    // for each button
    $playButtons.each(function() {
      var $playButton = $(this);
      var $playButtonText = $playButton.find(selectors.fallbackText);

      $playButtonText.text(
        $playButtonText.text().replace('[video_title]', title)
      );
    });
    $closeButtonText.text(
      $closeButtonText.text().replace('[video_title]', title)
    );
    $pauseButtonStopText.text(
      $pauseButtonStopText.text().replace('[video_title]', title)
    );
    $pauseButtonResumeText.text(
      $pauseButtonResumeText.text().replace('[video_title]', title)
    );
  }

  return {
    init: init,
    editorLoadVideo: editorLoadVideo,
    loadVideos: loadVideos,
    playVideo: customPlayVideo,
    pauseVideo: pauseVideo,
    removeEvents: removeEvents
  };
})();

theme.ProductVideo = (function() {
  var videos = {};

  var hosts = {
    html5: 'html5',
    youtube: 'youtube'
  };

  var selectors = {
    productMediaWrapper: '[data-product-single-media-wrapper]'
  };

  var attributes = {
    enableVideoLooping: 'enable-video-looping',
    videoId: 'video-id'
  };

  function init(videoContainer, sectionId) {
    if (!videoContainer.length) {
      return;
    }

    var videoElement = videoContainer.find('iframe, video')[0];
    var mediaId = videoContainer.data('mediaId');

    if (!videoElement) {
      return;
    }

    videos[mediaId] = {
      mediaId: mediaId,
      sectionId: sectionId,
      host: hostFromVideoElement(videoElement),
      container: videoContainer,
      element: videoElement,
      ready: function() {
        createPlayer(this);
      }
    };

    var video = videos[mediaId];

    switch (video.host) {
      case hosts.html5:
        window.Shopify.loadFeatures([
          {
            name: 'video-ui',
            version: '1.0',
            onLoad: setupPlyrVideos
          }
        ]);
        theme.LibraryLoader.load('plyrShopifyStyles');
        break;
      case hosts.youtube:
        theme.LibraryLoader.load('youtubeSdk', setupYouTubeVideos);
        break;
    }
  }

  function setupPlyrVideos(errors) {
    if (errors) {
      fallbackToNativeVideo();
      return;
    }

    loadVideos(hosts.html5);
  }

  function setupYouTubeVideos() {
    if (!window.YT.Player) return;

    loadVideos(hosts.youtube);
  }

  function createPlayer(video) {
    if (video.player) {
      return;
    }

    var productMediaWrapper = video.container.closest(
      selectors.productMediaWrapper
    );
    var enableLooping = productMediaWrapper.data(attributes.enableVideoLooping);

    switch (video.host) {
      case hosts.html5:
        // eslint-disable-next-line no-undef
        video.player = new Shopify.Plyr(video.element, {
          loop: { active: enableLooping }
        });
        break;
      case hosts.youtube:
        var videoId = productMediaWrapper.data(attributes.videoId);

        video.player = new YT.Player(video.element, {
          videoId: videoId,
          events: {
            onStateChange: function(event) {
              if (event.data === 0 && enableLooping) event.target.seekTo(0);
            }
          }
        });
        break;
    }

    productMediaWrapper.on('mediaHidden xrLaunch', function() {
      if (!video.player) return;

      if (video.host === hosts.html5) {
        video.player.pause();
      }

      if (video.host === hosts.youtube && video.player.pauseVideo) {
        video.player.pauseVideo();
      }
    });

    productMediaWrapper.on('mediaVisible', function() {
      if (theme.Helpers.isTouch()) return;
      if (!video.player) return;

      if (video.host === hosts.html5) {
        video.player.play();
      }

      if (video.host === hosts.youtube && video.player.playVideo) {
        video.player.playVideo();
      }
    });
  }

  function hostFromVideoElement(video) {
    if (video.tagName === 'VIDEO') {
      return hosts.html5;
    }

    if (video.tagName === 'IFRAME') {
      if (
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(
          video.src
        )
      ) {
        return hosts.youtube;
      }
    }
    return null;
  }

  function loadVideos(host) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        if (video.host === host) {
          video.ready();
        }
      }
    }
  }

  function fallbackToNativeVideo() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.nativeVideo) continue;

        if (video.host === hosts.html5) {
          video.element.setAttribute('controls', 'controls');
          video.nativeVideo = true;
        }
      }
    }
  }

  function removeSectionVideos(sectionId) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.sectionId === sectionId) {
          if (video.player) video.player.destroy();
          delete videos[key];
        }
      }
    }
  }

  return {
    init: init,
    hosts: hosts,
    loadVideos: loadVideos,
    removeSectionVideos: removeSectionVideos
  };
})();

theme.ProductModel = (function() {
  var modelJsonSections = {};
  var models = {};
  var xrButtons = {};

  var selectors = {
    mediaGroup: '[data-product-single-media-group]',
    xrButton: '[data-shopify-xr]'
  };

  function init(modelViewerContainers, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false
    };

    modelViewerContainers.each(function(index) {
      var $modelViewerContainer = $(this);
      var mediaId = $modelViewerContainer.data('media-id');
      var $modelViewerElement = $(
        $modelViewerContainer.find('model-viewer')[0]
      );
      var modelId = $modelViewerElement.data('model-id');

      if (index === 0) {
        var $xrButton = $modelViewerContainer
          .closest(selectors.mediaGroup)
          .find(selectors.xrButton);
        xrButtons[sectionId] = {
          $element: $xrButton,
          defaultId: modelId
        };
      }

      models[mediaId] = {
        modelId: modelId,
        sectionId: sectionId,
        $container: $modelViewerContainer,
        $element: $modelViewerElement
      };
    });

    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi
      }
    ]);
    theme.LibraryLoader.load('modelViewerUiStyles');
  }

  function setupShopifyXr(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function() {
        setupShopifyXr();
      });
      return;
    }

    for (var sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        var modelSection = modelJsonSections[sectionId];

        if (modelSection.loaded) continue;
        var $modelJson = $('#ModelJson-' + sectionId);

        window.ShopifyXR.addModels(JSON.parse($modelJson.html()));
        modelSection.loaded = true;
      }
    }
    window.ShopifyXR.setupXRElements();
  }

  function setupModelViewerUi(errors) {
    if (errors) return;

    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.$element);
        }
        setupModelViewerListeners(model);
      }
    }
  }

  function setupModelViewerListeners(model) {
    var xrButton = xrButtons[model.sectionId];

    model.$container.on('mediaVisible', function() {
      xrButton.$element.attr('data-shopify-model3d-id', model.modelId);
      if (theme.Helpers.isTouch()) return;
      model.modelViewerUi.play();
    });

    model.$container
      .on('mediaHidden', function() {
        xrButton.$element.attr('data-shopify-model3d-id', xrButton.defaultId);
        model.modelViewerUi.pause();
      })
      .on('xrLaunch', function() {
        model.modelViewerUi.pause();
      });
  }

  function removeSectionModels(sectionId) {
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (model.sectionId === sectionId) {
          models[key].modelViewerUi.destroy();
          delete models[key];
        }
      }
    }
    delete modelJsonSections[sectionId];
  }

  return {
    init: init,
    removeSectionModels: removeSectionModels
  };
})();

theme.slideshows = {};

theme.SlideshowSection = (function() {
  function SlideshowSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var slideshow = (this.slideshow = '#Slideshow-' + sectionId);

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow, sectionId);
  }

  return SlideshowSection;
})();

theme.SlideshowSection.prototype = _.assignIn(
  {},
  theme.SlideshowSection.prototype,
  {
    onUnload: function() {
      delete theme.slideshows[this.slideshow];
    },

    onBlockSelect: function(evt) {
      var $slideshow = $(this.slideshow);
      var adaptHeight = $slideshow.data('adapt-height');

      if (adaptHeight) {
        theme.slideshows[this.slideshow].setSlideshowHeight();
      }

      // Ignore the cloned version
      var $slide = $(
        '.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause auto-rotate
      $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
    },

    onBlockDeselect: function() {
      // Resume auto-rotate
      $(this.slideshow).slick('slickPlay');
    }
  }
);

theme.slideshows = {};

$(document).ready(function() {
  var sections = new theme.Sections();
  sections.register('slideshow-section', theme.SlideshowSection);
});

if ((theme.variables.variant_template_name === 'cart') && (theme.variables.shipping_calculator == 'Enabled'))	{
	// Shipping Calculator in CartPage
	Shopify.Cart.ShippingCalculator.show( {
	  submitButton: theme.strings.shippingCalcSubmitButton,
	  submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
	  customerIsLoggedIn: theme.strings.shippingCalcCustomerIsLoggedIn,
	  moneyFormat: theme.strings.shippingCalcMoneyFormat
	} );
}


