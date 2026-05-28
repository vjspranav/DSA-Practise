var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,a)=>(a=n==null?{}:e(i(n)),s(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n)),l=(e=>typeof require<`u`?require:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof require<`u`?require:e)[t]}):e)(function(e){if(typeof require<`u`)return require.apply(this,arguments);throw Error('Calling `require` for "'+e+"\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.")});(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m)if(n(c)!==null)m=!0,S||(S=!0,ne());else{var t=n(l);t!==null&&ae(x,t.startTime-e)}}var S=!1,C=-1,w=5,ee=-1;function te(){return g?!0:!(e.unstable_now()-ee<w)}function T(){if(g=!1,S){var t=e.unstable_now();ee=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(C),C=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&te());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&ae(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?ne():S=!1}}}var ne;if(typeof y==`function`)ne=function(){y(T)};else if(typeof MessageChannel<`u`){var re=new MessageChannel,ie=re.port2;re.port1.onmessage=T,ne=function(){ie.postMessage(null)}}else ne=function(){_(T,0)};function ae(t,n){C=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):w=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(C),C=-1):h=!0,ae(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,ne()))),r},e.unstable_shouldYield=te,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),d=o(((e,t)=>{t.exports=u()})),f=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var S=Array.isArray;function C(){}var w={H:null,A:null,T:null,S:null},ee=Object.prototype.hasOwnProperty;function te(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function T(e,t){return te(e.type,t,e.props)}function ne(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function re(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var ie=/\/+/g;function ae(e,t){return typeof e==`object`&&e&&e.key!=null?re(``+e.key):t.toString(36)}function oe(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(C,C):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function se(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,se(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+ae(e,0):a,S(o)?(i=``,c!=null&&(i=c.replace(ie,`$&/`)+`/`),se(o,r,i,``,function(e){return e})):o!=null&&(ne(o)&&(o=T(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(ie,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(S(e))for(var u=0;u<e.length;u++)a=e[u],s=l+ae(a,u),c+=se(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+ae(a,u++),c+=se(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return se(oe(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function ce(e,t,n){if(e==null)return e;var r=[],i=0;return se(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function le(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var E=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},D={map:ce,forEach:function(e,t,n){ce(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return ce(e,function(){t++}),t},toArray:function(e){return ce(e,function(e){return e})||[]},only:function(e){if(!ne(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=D,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=w,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return w.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!ee.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return te(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)ee.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return te(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=ne,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:le}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=w.T,n={};w.T=n;try{var r=e(),i=w.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(C,E)}catch(e){E(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),w.T=t}},e.unstable_useCacheRefresh=function(){return w.H.useCacheRefresh()},e.use=function(e){return w.H.use(e)},e.useActionState=function(e,t,n){return w.H.useActionState(e,t,n)},e.useCallback=function(e,t){return w.H.useCallback(e,t)},e.useContext=function(e){return w.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return w.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return w.H.useEffect(e,t)},e.useEffectEvent=function(e){return w.H.useEffectEvent(e)},e.useId=function(){return w.H.useId()},e.useImperativeHandle=function(e,t,n){return w.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return w.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return w.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return w.H.useMemo(e,t)},e.useOptimistic=function(e,t){return w.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return w.H.useReducer(e,t,n)},e.useRef=function(e){return w.H.useRef(e)},e.useState=function(e){return w.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return w.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return w.H.useTransition()},e.version=`19.2.6`})),p=o(((e,t)=>{t.exports=f()})),m=o((e=>{var t=p();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`);function o(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var s=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function c(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return o(e,t,null,r)},e.flushSync=function(e){var t=s.T,n=i.p;try{if(s.T=null,i.p=2,e)return e()}finally{s.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`)if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=c(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??i.d.M(e)},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`)if(t){var n=c(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else i.d.m(e)},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return s.H.useFormState(e,t,n)},e.useFormStatus=function(){return s.H.useHostTransitionStatus()},e.version=`19.2.6`})),h=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=m()})),g=o((e=>{var t=d(),n=p(),r=h();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function f(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=f(e),t!==null)return t;e=e.sibling}return null}var m=Object.assign,g=Symbol.for(`react.element`),_=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),S=Symbol.for(`react.consumer`),C=Symbol.for(`react.context`),w=Symbol.for(`react.forward_ref`),ee=Symbol.for(`react.suspense`),te=Symbol.for(`react.suspense_list`),T=Symbol.for(`react.memo`),ne=Symbol.for(`react.lazy`),re=Symbol.for(`react.activity`),ie=Symbol.for(`react.memo_cache_sentinel`),ae=Symbol.iterator;function oe(e){return typeof e!=`object`||!e?null:(e=ae&&e[ae]||e[`@@iterator`],typeof e==`function`?e:null)}var se=Symbol.for(`react.client.reference`);function ce(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===se?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case ee:return`Suspense`;case te:return`SuspenseList`;case re:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case C:return e.displayName||`Context`;case S:return(e._context.displayName||`Context`)+`.Consumer`;case w:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case T:return t=e.displayName||null,t===null?ce(e.type)||`Memo`:t;case ne:t=e._payload,e=e._init;try{return ce(e(t))}catch{}}return null}var le=Array.isArray,E=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,D=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ue={pending:!1,data:null,method:null,action:null},de=[],fe=-1;function pe(e){return{current:e}}function me(e){0>fe||(e.current=de[fe],de[fe]=null,fe--)}function O(e,t){fe++,de[fe]=e.current,e.current=t}var he=pe(null),ge=pe(null),_e=pe(null),ve=pe(null);function ye(e,t){switch(O(_e,t),O(ge,e),O(he,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vd(t),e=Hd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}me(he),O(he,e)}function be(){me(he),me(ge),me(_e)}function xe(e){e.memoizedState!==null&&O(ve,e);var t=he.current,n=Hd(t,e.type);t!==n&&(O(ge,e),O(he,n))}function Se(e){ge.current===e&&(me(he),me(ge)),ve.current===e&&(me(ve),Qf._currentValue=ue)}var Ce,we;function Te(e){if(Ce===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);Ce=t&&t[1]||``,we=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+Ce+e+we}var Ee=!1;function De(e,t){if(!e||Ee)return``;Ee=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Ee=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Te(n):``}function Oe(e,t){switch(e.tag){case 26:case 27:case 5:return Te(e.type);case 16:return Te(`Lazy`);case 13:return e.child!==t&&t!==null?Te(`Suspense Fallback`):Te(`Suspense`);case 19:return Te(`SuspenseList`);case 0:case 15:return De(e.type,!1);case 11:return De(e.type.render,!1);case 1:return De(e.type,!0);case 31:return Te(`Activity`);default:return``}}function ke(e){try{var t=``,n=null;do t+=Oe(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Ae=Object.prototype.hasOwnProperty,je=t.unstable_scheduleCallback,Me=t.unstable_cancelCallback,Ne=t.unstable_shouldYield,Pe=t.unstable_requestPaint,Fe=t.unstable_now,Ie=t.unstable_getCurrentPriorityLevel,Le=t.unstable_ImmediatePriority,Re=t.unstable_UserBlockingPriority,ze=t.unstable_NormalPriority,Be=t.unstable_LowPriority,Ve=t.unstable_IdlePriority,He=t.log,Ue=t.unstable_setDisableYieldValue,We=null,Ge=null;function Ke(e){if(typeof He==`function`&&Ue(e),Ge&&typeof Ge.setStrictMode==`function`)try{Ge.setStrictMode(We,e)}catch{}}var qe=Math.clz32?Math.clz32:Xe,Je=Math.log,Ye=Math.LN2;function Xe(e){return e>>>=0,e===0?32:31-(Je(e)/Ye|0)|0}var Ze=256,Qe=262144,$e=4194304;function et(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function tt(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=et(n))):i=et(o):i=et(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=et(n))):i=et(o)):i=et(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function nt(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function rt(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function it(){var e=$e;return $e<<=1,!($e&62914560)&&($e=4194304),e}function at(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ot(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function st(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-qe(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&ct(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function ct(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-qe(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function lt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-qe(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function ut(e,t){var n=t&-t;return n=n&42?1:dt(n),(n&(e.suspendedLanes|t))===0?n:0}function dt(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ft(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function pt(){var e=D.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function mt(e,t){var n=D.p;try{return D.p=e,t()}finally{D.p=n}}var ht=Math.random().toString(36).slice(2),gt=`__reactFiber$`+ht,_t=`__reactProps$`+ht,vt=`__reactContainer$`+ht,yt=`__reactEvents$`+ht,bt=`__reactListeners$`+ht,xt=`__reactHandles$`+ht,St=`__reactResources$`+ht,Ct=`__reactMarker$`+ht;function wt(e){delete e[gt],delete e[_t],delete e[yt],delete e[bt],delete e[xt]}function Tt(e){var t=e[gt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[vt]||n[gt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[gt])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function Et(e){if(e=e[gt]||e[vt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Dt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function k(e){var t=e[St];return t||=e[St]={hoistableStyles:new Map,hoistableScripts:new Map},t}function Ot(e){e[Ct]=!0}var kt=new Set,At={};function jt(e,t){Mt(e,t),Mt(e+`Capture`,t)}function Mt(e,t){for(At[e]=t,e=0;e<t.length;e++)kt.add(t[e])}var Nt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Pt={},Ft={};function A(e){return Ae.call(Ft,e)?!0:Ae.call(Pt,e)?!1:Nt.test(e)?Ft[e]=!0:(Pt[e]=!0,!1)}function It(e,t,n){if(A(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}function Lt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function Rt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function zt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Bt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Vt(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ht(e){if(!e._valueTracker){var t=Bt(e)?`checked`:`value`;e._valueTracker=Vt(e,t,``+e[t])}}function Ut(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Bt(e)?e.checked?`true`:`false`:e.value),e=r,e===n?!1:(t.setValue(e),!0)}function Wt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var Gt=/[\n"\\]/g;function Kt(e){return e.replace(Gt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function qt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+zt(t)):e.value!==``+zt(t)&&(e.value=``+zt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Yt(e,o,zt(n)):Yt(e,o,zt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+zt(s):e.removeAttribute(`name`)}function Jt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Ht(e);return}n=n==null?``:``+zt(n),t=t==null?n:``+zt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Ht(e)}function Yt(e,t,n){t===`number`&&Wt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Xt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+zt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Zt(e,t,n){if(t!=null&&(t=``+zt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+zt(n)}function Qt(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(le(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=zt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Ht(e)}function $t(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var en=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function tn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||en.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function nn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&tn(e,a,r)}else for(var o in t)t.hasOwnProperty(o)&&tn(e,o,t[o])}function rn(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var an=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),on=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function sn(e){return on.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function cn(){}var ln=null;function un(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var dn=null,fn=null;function pn(e){var t=Et(e);if(t&&(e=t.stateNode)){var n=e[_t]||null;a:switch(e=t.stateNode,t.type){case`input`:if(qt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+Kt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[_t]||null;if(!a)throw Error(i(90));qt(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Ut(r)}break a;case`textarea`:Zt(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Xt(e,!!n.multiple,t,!1)}}}var mn=!1;function hn(e,t,n){if(mn)return e(t,n);mn=!0;try{return e(t)}finally{if(mn=!1,(dn!==null||fn!==null)&&(Su(),dn&&(t=dn,e=fn,fn=dn=null,pn(t),e)))for(t=0;t<e.length;t++)pn(e[t])}}function j(e,t){var n=e.stateNode;if(n===null)return null;var r=n[_t]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=!(e===`button`||e===`input`||e===`select`||e===`textarea`)),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var M=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),gn=!1;if(M)try{var _n={};Object.defineProperty(_n,"passive",{get:function(){gn=!0}}),window.addEventListener(`test`,_n,_n),window.removeEventListener(`test`,_n,_n)}catch{gn=!1}var vn=null,yn=null,bn=null;function xn(){if(bn)return bn;var e,t=yn,n=t.length,r,i=`value`in vn?vn.value:vn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return bn=i.slice(e,1<r?1-r:void 0)}function Sn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Cn(){return!0}function wn(){return!1}function Tn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Cn:wn,this.isPropagationStopped=wn,this}return m(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Cn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Cn)},persist:function(){},isPersistent:Cn}),t}var En={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Dn=Tn(En),On=m({},En,{view:0,detail:0}),kn=Tn(On),An,jn,Mn,Nn=m({},On,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Wn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Mn&&(Mn&&e.type===`mousemove`?(An=e.screenX-Mn.screenX,jn=e.screenY-Mn.screenY):jn=An=0,Mn=e),An)},movementY:function(e){return`movementY`in e?e.movementY:jn}}),Pn=Tn(Nn),Fn=Tn(m({},Nn,{dataTransfer:0})),In=Tn(m({},On,{relatedTarget:0})),Ln=Tn(m({},En,{animationName:0,elapsedTime:0,pseudoElement:0})),Rn=Tn(m({},En,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),zn=Tn(m({},En,{data:0})),Bn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Vn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Hn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Un(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Hn[e])?!!t[e]:!1}function Wn(){return Un}var Gn=Tn(m({},On,{key:function(e){if(e.key){var t=Bn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=Sn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Vn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Wn,charCode:function(e){return e.type===`keypress`?Sn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?Sn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Kn=Tn(m({},Nn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),qn=Tn(m({},On,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Wn})),Jn=Tn(m({},En,{propertyName:0,elapsedTime:0,pseudoElement:0})),Yn=Tn(m({},Nn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Xn=Tn(m({},En,{newState:0,oldState:0})),Zn=[9,13,27,32],Qn=M&&`CompositionEvent`in window,$n=null;M&&`documentMode`in document&&($n=document.documentMode);var er=M&&`TextEvent`in window&&!$n,tr=M&&(!Qn||$n&&8<$n&&11>=$n),nr=` `,rr=!1;function ir(e,t){switch(e){case`keyup`:return Zn.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function ar(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var or=!1;function sr(e,t){switch(e){case`compositionend`:return ar(t);case`keypress`:return t.which===32?(rr=!0,nr):null;case`textInput`:return e=t.data,e===nr&&rr?null:e;default:return null}}function cr(e,t){if(or)return e===`compositionend`||!Qn&&ir(e,t)?(e=xn(),bn=yn=vn=null,or=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return tr&&t.locale!==`ko`?null:t.data;default:return null}}var lr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ur(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!lr[e.type]:t===`textarea`}function dr(e,t,n,r){dn?fn?fn.push(r):fn=[r]:dn=r,t=Ed(t,`onChange`),0<t.length&&(n=new Dn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var fr=null,pr=null;function mr(e){yd(e,0)}function hr(e){if(Ut(Dt(e)))return e}function gr(e,t){if(e===`change`)return t}var _r=!1;if(M){var vr;if(M){var yr=`oninput`in document;if(!yr){var br=document.createElement(`div`);br.setAttribute(`oninput`,`return;`),yr=typeof br.oninput==`function`}vr=yr}else vr=!1;_r=vr&&(!document.documentMode||9<document.documentMode)}function xr(){fr&&(fr.detachEvent(`onpropertychange`,Sr),pr=fr=null)}function Sr(e){if(e.propertyName===`value`&&hr(pr)){var t=[];dr(t,pr,e,un(e)),hn(mr,t)}}function Cr(e,t,n){e===`focusin`?(xr(),fr=t,pr=n,fr.attachEvent(`onpropertychange`,Sr)):e===`focusout`&&xr()}function wr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return hr(pr)}function Tr(e,t){if(e===`click`)return hr(t)}function Er(e,t){if(e===`input`||e===`change`)return hr(t)}function Dr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Or=typeof Object.is==`function`?Object.is:Dr;function kr(e,t){if(Or(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Ae.call(t,i)||!Or(e[i],t[i]))return!1}return!0}function Ar(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function jr(e,t){var n=Ar(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Ar(n)}}function Mr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Mr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Nr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Wt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Wt(e.document)}return t}function Pr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Fr=M&&`documentMode`in document&&11>=document.documentMode,Ir=null,Lr=null,Rr=null,zr=!1;function Br(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;zr||Ir==null||Ir!==Wt(r)||(r=Ir,`selectionStart`in r&&Pr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Rr&&kr(Rr,r)||(Rr=r,r=Ed(Lr,`onSelect`),0<r.length&&(t=new Dn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Ir)))}function Vr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Hr={animationend:Vr(`Animation`,`AnimationEnd`),animationiteration:Vr(`Animation`,`AnimationIteration`),animationstart:Vr(`Animation`,`AnimationStart`),transitionrun:Vr(`Transition`,`TransitionRun`),transitionstart:Vr(`Transition`,`TransitionStart`),transitioncancel:Vr(`Transition`,`TransitionCancel`),transitionend:Vr(`Transition`,`TransitionEnd`)},Ur={},Wr={};M&&(Wr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Hr.animationend.animation,delete Hr.animationiteration.animation,delete Hr.animationstart.animation),`TransitionEvent`in window||delete Hr.transitionend.transition);function N(e){if(Ur[e])return Ur[e];if(!Hr[e])return e;var t=Hr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Wr)return Ur[e]=t[n];return e}var Gr=N(`animationend`),Kr=N(`animationiteration`),qr=N(`animationstart`),P=N(`transitionrun`),Jr=N(`transitionstart`),Yr=N(`transitioncancel`),Xr=N(`transitionend`),Zr=new Map,Qr=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);Qr.push(`scrollEnd`);function $r(e,t){Zr.set(e,t),jt(t,[e])}var ei=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},ti=[],ni=0,ri=0;function ii(){for(var e=ni,t=ri=ni=0;t<e;){var n=ti[t];ti[t++]=null;var r=ti[t];ti[t++]=null;var i=ti[t];ti[t++]=null;var a=ti[t];if(ti[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&ci(n,i,a)}}function ai(e,t,n,r){ti[ni++]=e,ti[ni++]=t,ti[ni++]=n,ti[ni++]=r,ri|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function oi(e,t,n,r){return ai(e,t,n,r),li(e)}function si(e,t){return ai(e,null,null,t),li(e)}function ci(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-qe(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function li(e){if(50<hu)throw hu=0,q=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ui={};function di(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function fi(e,t,n,r){return new di(e,t,n,r)}function pi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function mi(e,t){var n=e.alternate;return n===null?(n=fi(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function hi(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function gi(e,t,n,r,a,o){var s=0;if(r=e,typeof e==`function`)pi(e)&&(s=1);else if(typeof e==`string`)s=Uf(e,n,he.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case re:return e=fi(31,n,t,a),e.elementType=re,e.lanes=o,e;case y:return _i(n.children,a,o,t);case b:s=8,a|=24;break;case x:return e=fi(12,n,t,a|2),e.elementType=x,e.lanes=o,e;case ee:return e=fi(13,n,t,a),e.elementType=ee,e.lanes=o,e;case te:return e=fi(19,n,t,a),e.elementType=te,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case C:s=10;break a;case S:s=9;break a;case w:s=11;break a;case T:s=14;break a;case ne:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=fi(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function _i(e,t,n,r){return e=fi(7,e,r,t),e.lanes=n,e}function vi(e,t,n){return e=fi(6,e,null,t),e.lanes=n,e}function yi(e){var t=fi(18,null,null,0);return t.stateNode=e,t}function bi(e,t,n){return t=fi(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var xi=new WeakMap;function Si(e,t){if(typeof e==`object`&&e){var n=xi.get(e);return n===void 0?(t={value:e,source:t,stack:ke(t)},xi.set(e,t),t):n}return{value:e,source:t,stack:ke(t)}}var Ci=[],wi=0,Ti=null,Ei=0,Di=[],Oi=0,ki=null,Ai=1,ji=``;function Mi(e,t){Ci[wi++]=Ei,Ci[wi++]=Ti,Ti=e,Ei=t}function Ni(e,t,n){Di[Oi++]=Ai,Di[Oi++]=ji,Di[Oi++]=ki,ki=e;var r=Ai;e=ji;var i=32-qe(r)-1;r&=~(1<<i),n+=1;var a=32-qe(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Ai=1<<32-qe(t)+i|n<<i|r,ji=a+e}else Ai=1<<a|n<<i|r,ji=e}function Pi(e){e.return!==null&&(Mi(e,1),Ni(e,1,0))}function Fi(e){for(;e===Ti;)Ti=Ci[--wi],Ci[wi]=null,Ei=Ci[--wi],Ci[wi]=null;for(;e===ki;)ki=Di[--Oi],Di[Oi]=null,ji=Di[--Oi],Di[Oi]=null,Ai=Di[--Oi],Di[Oi]=null}function Ii(e,t){Di[Oi++]=Ai,Di[Oi++]=ji,Di[Oi++]=ki,Ai=t.id,ji=t.overflow,ki=e}var F=null,Li=null,I=!1,Ri=null,zi=!1,Bi=Error(i(519));function Vi(e){throw qi(Si(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Bi}function Hi(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[gt]=e,t[_t]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<_d.length;n++)Q(_d[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),Jt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),Qt(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Md(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=cn),t=!0):t=!1,t||Vi(e,!0)}function Ui(e){for(F=e.return;F;)switch(F.tag){case 5:case 31:case 13:zi=!1;return;case 27:case 3:zi=!0;return;default:F=F.return}}function Wi(e){if(e!==F)return!1;if(!I)return Ui(e),I=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!==`form`&&n!==`button`)||Ud(e.type,e.memoizedProps)),n=!n),n&&Li&&Vi(e),Ui(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Li=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Li=uf(e)}else t===27?(t=Li,Zd(e.type)?(e=lf,lf=null,Li=e):Li=t):Li=F?cf(e.stateNode.nextSibling):null;return!0}function Gi(){Li=F=null,I=!1}function Ki(){var e=Ri;return e!==null&&(tu===null?tu=e:tu.push.apply(tu,e),Ri=null),e}function qi(e){Ri===null?Ri=[e]:Ri.push(e)}var Ji=pe(null),Yi=null,Xi=null;function Zi(e,t,n){O(Ji,t._currentValue),t._currentValue=n}function Qi(e){e._currentValue=Ji.current,me(Ji)}function $i(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function ea(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),$i(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),$i(s,n,e),s=null}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function ta(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Or(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===ve.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}a=a.return}e!==null&&ea(t,e,n,r),t.flags|=262144}function na(e){for(e=e.firstContext;e!==null;){if(!Or(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ra(e){Yi=e,Xi=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function ia(e){return oa(Yi,e)}function aa(e,t){return Yi===null&&ra(e),oa(e,t)}function oa(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Xi===null){if(e===null)throw Error(i(308));Xi=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Xi=Xi.next=t;return n}var sa=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},ca=t.unstable_scheduleCallback,la=t.unstable_NormalPriority,ua={$$typeof:C,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function da(){return{controller:new sa,data:new Map,refCount:0}}function fa(e){e.refCount--,e.refCount===0&&ca(la,function(){e.controller.abort()})}var pa=null,ma=0,ha=0,ga=null;function _a(e,t){if(pa===null){var n=pa=[];ma=0,ha=dd(),ga={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return ma++,t.then(va,va),t}function va(){if(--ma===0&&pa!==null){ga!==null&&(ga.status=`fulfilled`);var e=pa;pa=null,ha=0,ga=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function ya(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var ba=E.S;E.S=function(e,t){iu=Fe(),typeof t==`object`&&t&&typeof t.then==`function`&&_a(e,t),ba!==null&&ba(e,t)};var xa=pe(null);function Sa(){var e=xa.current;return e===null?U.pooledCache:e}function Ca(e,t){t===null?O(xa,xa.current):O(xa,t.pool)}function wa(){var e=Sa();return e===null?null:{parent:ua._currentValue,pool:e}}var Ta=Error(i(460)),Ea=Error(i(474)),Da=Error(i(542)),Oa={then:function(){}};function ka(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Aa(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(cn,cn),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Pa(e),e;default:if(typeof t.status==`string`)t.then(cn,cn);else{if(e=U,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Pa(e),e}throw Ma=t,Ta}}function ja(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(Ma=e,Ta):e}}var Ma=null;function Na(){if(Ma===null)throw Error(i(459));var e=Ma;return Ma=null,e}function Pa(e){if(e===Ta||e===Da)throw Error(i(483))}var Fa=null,Ia=0;function La(e){var t=Ia;return Ia+=1,Fa===null&&(Fa=[]),Aa(Fa,e,t)}function L(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function Ra(e,t){throw t.$$typeof===g?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function za(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=mi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=vi(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===ne&&ja(i)===t.type)?(t=a(t,n.props),L(t,n),t.return=e,t):(t=gi(n.type,n.key,n.props,null,e.mode,r),L(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=bi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=_i(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=vi(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case _:return n=gi(t.type,t.key,t.props,null,e.mode,n),L(n,t),n.return=e,n;case v:return t=bi(t,e.mode,n),t.return=e,t;case ne:return t=ja(t),f(e,t,n)}if(le(t)||oe(t))return t=_i(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,La(t),n);if(t.$$typeof===C)return f(e,aa(e,t),n);Ra(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case _:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case ne:return n=ja(n),p(e,t,n,r)}if(le(n)||oe(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,La(n),r);if(n.$$typeof===C)return p(e,t,aa(e,n),r);Ra(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case _:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case ne:return r=ja(r),m(e,t,n,r,i)}if(le(r)||oe(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,La(r),i);if(r.$$typeof===C)return m(e,t,n,aa(t,r),i);Ra(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),I&&Mi(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return I&&Mi(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),I&&Mi(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),I&&Mi(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return I&&Mi(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),I&&Mi(a,g),u}function b(e,r,o,c){if(typeof o==`object`&&o&&o.type===y&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case _:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===y){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===ne&&ja(l)===r.type){n(e,r.sibling),c=a(r,o.props),L(c,o),c.return=e,e=c;break a}n(e,r);break}else t(e,r);r=r.sibling}o.type===y?(c=_i(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=gi(o.type,o.key,o.props,null,e.mode,c),L(c,o),c.return=e,e=c)}return s(e);case v:a:{for(l=o.key;r!==null;){if(r.key===l)if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}else{n(e,r);break}else t(e,r);r=r.sibling}c=bi(o,e.mode,c),c.return=e,e=c}return s(e);case ne:return o=ja(o),b(e,r,o,c)}if(le(o))return h(e,r,o,c);if(oe(o)){if(l=oe(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return b(e,r,La(o),c);if(o.$$typeof===C)return b(e,r,aa(e,o),c);Ra(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=vi(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{Ia=0;var i=b(e,t,n,r);return Fa=null,i}catch(t){if(t===Ta||t===Da)throw t;var a=fi(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Ba=za(!0),Va=za(!1),Ha=!1;function Ua(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Wa(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Ga(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ka(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,H&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=li(e),ci(e,null,n),t}return ai(e,r,t,n),li(e)}function qa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lt(e,n)}}function Ja(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Ya=!1;function Xa(){if(Ya){var e=ga;if(e!==null)throw e}}function Za(e,t,n,r){Ya=!1;var i=e.updateQueue;Ha=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(G&f)===f:(r&f)===f){f!==0&&f===ha&&(Ya=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var h=e,g=s;f=t;var _=n;switch(g.tag){case 1:if(h=g.payload,typeof h==`function`){d=h.call(_,d,f);break a}d=h;break a;case 3:h.flags=h.flags&-65537|128;case 0:if(h=g.payload,f=typeof h==`function`?h.call(_,d,f):h,f==null)break a;d=m({},d,f);break a;case 2:Ha=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Yl|=o,e.lanes=o,e.memoizedState=d}}function Qa(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function $a(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Qa(n[e],t)}var eo=pe(null),to=pe(0);function no(e,t){e=ql,O(to,e),O(eo,t),ql=e|t.baseLanes}function ro(){O(to,ql),O(eo,eo.current)}function io(){ql=to.current,me(eo),me(to)}var ao=pe(null),oo=null;function so(e){var t=e.alternate;O(po,po.current&1),O(ao,e),oo===null&&(t===null||eo.current!==null||t.memoizedState!==null)&&(oo=e)}function co(e){O(po,po.current),O(ao,e),oo===null&&(oo=e)}function lo(e){e.tag===22?(O(po,po.current),O(ao,e),oo===null&&(oo=e)):uo(e)}function uo(){O(po,po.current),O(ao,ao.current)}function fo(e){me(ao),oo===e&&(oo=null),me(po)}var po=pe(0);function mo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ho=0,R=null,z=null,go=null,_o=!1,vo=!1,yo=!1,bo=0,xo=0,So=null,Co=0;function B(){throw Error(i(321))}function wo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Or(e[n],t[n]))return!1;return!0}function To(e,t,n,r,i,a){return ho=a,R=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,E.H=e===null||e.memoizedState===null?Vs:Hs,yo=!1,a=n(r,i),yo=!1,vo&&(a=Do(t,n,r,i)),Eo(e),a}function Eo(e){E.H=Bs;var t=z!==null&&z.next!==null;if(ho=0,go=z=R=null,_o=!1,xo=0,So=null,t)throw Error(i(300));e===null||ac||(e=e.dependencies,e!==null&&na(e)&&(ac=!0))}function Do(e,t,n,r){R=e;var a=0;do{if(vo&&(So=null),xo=0,vo=!1,25<=a)throw Error(i(301));if(a+=1,go=z=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}E.H=Us,o=t(n,r)}while(vo);return o}function Oo(){var e=E.H,t=e.useState()[0];return t=typeof t.then==`function`?Fo(t):t,e=e.useState()[0],(z===null?null:z.memoizedState)!==e&&(R.flags|=1024),t}function ko(){var e=bo!==0;return bo=0,e}function Ao(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function jo(e){if(_o){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}_o=!1}ho=0,go=z=R=null,vo=!1,xo=bo=0,So=null}function Mo(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return go===null?R.memoizedState=go=e:go=go.next=e,go}function No(){if(z===null){var e=R.alternate;e=e===null?null:e.memoizedState}else e=z.next;var t=go===null?R.memoizedState:go.next;if(t!==null)go=t,z=e;else{if(e===null)throw R.alternate===null?Error(i(467)):Error(i(310));z=e,e={memoizedState:z.memoizedState,baseState:z.baseState,baseQueue:z.baseQueue,queue:z.queue,next:null},go===null?R.memoizedState=go=e:go=go.next=e}return go}function Po(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Fo(e){var t=xo;return xo+=1,So===null&&(So=[]),e=Aa(So,e,t),t=R,(go===null?t.memoizedState:go.next)===null&&(t=t.alternate,E.H=t===null||t.memoizedState===null?Vs:Hs),e}function Io(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Fo(e);if(e.$$typeof===C)return ia(e)}throw Error(i(438,String(e)))}function Lo(e){var t=null,n=R.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=R.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=Po(),R.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=ie;return t.index++,n}function Ro(e,t){return typeof t==`function`?t(e):t}function zo(e){return Bo(No(),z,e)}function Bo(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(ho&f)===f:(G&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===ha&&(d=!0);else if((ho&p)===p){u=u.next,p===ha&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,R.lanes|=p,Yl|=p;f=u.action,yo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,R.lanes|=f,Yl|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Or(o,e.memoizedState)&&(ac=!0,d&&(n=ga,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Vo(e){var t=No(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Or(o,t.memoizedState)||(ac=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function Ho(e,t,n){var r=R,a=No(),o=I;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Or((z||a).memoizedState,n);if(s&&(a.memoizedState=n,ac=!0),a=a.queue,fs(Go.bind(null,r,a,e),[e]),a.getSnapshot!==t||s||go!==null&&go.memoizedState.tag&1){if(r.flags|=2048,ss(9,{destroy:void 0},Wo.bind(null,r,a,n,t),null),U===null)throw Error(i(349));o||ho&127||Uo(r,t,n)}return n}function Uo(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=R.updateQueue,t===null?(t=Po(),R.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Wo(e,t,n,r){t.value=n,t.getSnapshot=r,Ko(t)&&qo(e)}function Go(e,t,n){return n(function(){Ko(t)&&qo(e)})}function Ko(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Or(e,n)}catch{return!0}}function qo(e){var t=si(e,2);t!==null&&J(t,e,2)}function Jo(e){var t=Mo();if(typeof e==`function`){var n=e;if(e=n(),yo){Ke(!0);try{n()}finally{Ke(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ro,lastRenderedState:e},t}function Yo(e,t,n,r){return e.baseState=n,Bo(e,z,typeof r==`function`?r:Ro)}function Xo(e,t,n,r,a){if(Ls(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};E.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,Zo(t,o)):(o.next=n.next,t.pending=n.next=o)}}function Zo(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=E.T,o={};E.T=o;try{var s=n(i,r),c=E.S;c!==null&&c(o,s),Qo(e,t,s)}catch(n){es(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),E.T=a}}else try{a=n(i,r),Qo(e,t,a)}catch(n){es(e,t,n)}}function Qo(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){$o(e,t,n)},function(n){return es(e,t,n)}):$o(e,t,n)}function $o(e,t,n){t.status=`fulfilled`,t.value=n,ts(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Zo(e,n)))}function es(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,ts(t),t=t.next;while(t!==r)}e.action=null}function ts(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function ns(e,t){return t}function rs(e,t){if(I){var n=U.formState;if(n!==null){a:{var r=R;if(I){if(Li){b:{for(var i=Li,a=zi;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){Li=cf(i.nextSibling),r=i.data===`F!`;break a}}Vi(r)}r=!1}r&&(t=n[0])}}return n=Mo(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ns,lastRenderedState:t},n.queue=r,n=Ps.bind(null,R,r),r.dispatch=n,r=Jo(!1),a=Is.bind(null,R,!1,r.queue),r=Mo(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Xo.bind(null,R,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function V(e){return is(No(),z,e)}function is(e,t,n){if(t=Bo(e,t,ns)[0],e=zo(Ro)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Fo(t)}catch(e){throw e===Ta?Da:e}else r=t;t=No();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(R.flags|=2048,ss(9,{destroy:void 0},as.bind(null,i,n),null)),[r,a,e]}function as(e,t){e.action=t}function os(e){var t=No(),n=z;if(n!==null)return is(t,n,e);No(),t=t.memoizedState,n=No();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function ss(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=R.updateQueue,t===null&&(t=Po(),R.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function cs(){return No().memoizedState}function ls(e,t,n,r){var i=Mo();R.flags|=e,i.memoizedState=ss(1|t,{destroy:void 0},n,r===void 0?null:r)}function us(e,t,n,r){var i=No();r=r===void 0?null:r;var a=i.memoizedState.inst;z!==null&&r!==null&&wo(r,z.memoizedState.deps)?i.memoizedState=ss(t,a,n,r):(R.flags|=e,i.memoizedState=ss(1|t,a,n,r))}function ds(e,t){ls(8390656,8,e,t)}function fs(e,t){us(2048,8,e,t)}function ps(e){R.flags|=4;var t=R.updateQueue;if(t===null)t=Po(),R.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function ms(e){var t=No().memoizedState;return ps({ref:t,nextImpl:e}),function(){if(H&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function hs(e,t){return us(4,2,e,t)}function gs(e,t){return us(4,4,e,t)}function _s(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function vs(e,t,n){n=n==null?null:n.concat([e]),us(4,4,_s.bind(null,t,e),n)}function ys(){}function bs(e,t){var n=No();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&wo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function xs(e,t){var n=No();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&wo(t,r[1]))return r[0];if(r=e(),yo){Ke(!0);try{e()}finally{Ke(!1)}}return n.memoizedState=[r,t],r}function Ss(e,t,n){return n===void 0||ho&1073741824&&!(G&261930)?e.memoizedState=t:(e.memoizedState=n,e=_u(),R.lanes|=e,Yl|=e,n)}function Cs(e,t,n,r){return Or(n,t)?n:eo.current===null?!(ho&42)||ho&1073741824&&!(G&261930)?(ac=!0,e.memoizedState=n):(e=_u(),R.lanes|=e,Yl|=e,t):(e=Ss(e,n,r),Or(e,t)||(ac=!0),e)}function ws(e,t,n,r,i){var a=D.p;D.p=a!==0&&8>a?a:8;var o=E.T,s={};E.T=s,Is(e,!1,t,n);try{var c=i(),l=E.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?Fs(e,t,ya(c,r),gu(e)):Fs(e,t,r,gu(e))}catch(n){Fs(e,t,{then:function(){},status:`rejected`,reason:n},gu())}finally{D.p=a,o!==null&&s.types!==null&&(o.types=s.types),E.T=o}}function Ts(){}function Es(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=Ds(e).queue;ws(e,a,t,ue,n===null?Ts:function(){return Os(e),n(r)})}function Ds(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ue,baseState:ue,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ro,lastRenderedState:ue},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ro,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Os(e){var t=Ds(e);t.next===null&&(t=e.alternate.memoizedState),Fs(e,t.next.queue,{},gu())}function ks(){return ia(Qf)}function As(){return No().memoizedState}function js(){return No().memoizedState}function Ms(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=gu();e=Ga(n);var r=Ka(t,e,n);r!==null&&(J(r,t,n),qa(r,t,n)),t={cache:da()},e.payload=t;return}t=t.return}}function Ns(e,t,n){var r=gu();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Ls(e)?Rs(t,n):(n=oi(e,t,n,r),n!==null&&(J(n,e,r),zs(n,t,r)))}function Ps(e,t,n){Fs(e,t,n,gu())}function Fs(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ls(e))Rs(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Or(s,o))return ai(e,t,i,0),U===null&&ii(),!1}catch{}if(n=oi(e,t,i,r),n!==null)return J(n,e,r),zs(n,t,r),!0}return!1}function Is(e,t,n,r){if(r={lane:2,revertLane:dd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Ls(e)){if(t)throw Error(i(479))}else t=oi(e,n,r,2),t!==null&&J(t,e,2)}function Ls(e){var t=e.alternate;return e===R||t!==null&&t===R}function Rs(e,t){vo=_o=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function zs(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lt(e,n)}}var Bs={readContext:ia,use:Io,useCallback:B,useContext:B,useEffect:B,useImperativeHandle:B,useLayoutEffect:B,useInsertionEffect:B,useMemo:B,useReducer:B,useRef:B,useState:B,useDebugValue:B,useDeferredValue:B,useTransition:B,useSyncExternalStore:B,useId:B,useHostTransitionStatus:B,useFormState:B,useActionState:B,useOptimistic:B,useMemoCache:B,useCacheRefresh:B};Bs.useEffectEvent=B;var Vs={readContext:ia,use:Io,useCallback:function(e,t){return Mo().memoizedState=[e,t===void 0?null:t],e},useContext:ia,useEffect:ds,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),ls(4194308,4,_s.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ls(4194308,4,e,t)},useInsertionEffect:function(e,t){ls(4,2,e,t)},useMemo:function(e,t){var n=Mo();t=t===void 0?null:t;var r=e();if(yo){Ke(!0);try{e()}finally{Ke(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Mo();if(n!==void 0){var i=n(t);if(yo){Ke(!0);try{n(t)}finally{Ke(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Ns.bind(null,R,e),[r.memoizedState,e]},useRef:function(e){var t=Mo();return e={current:e},t.memoizedState=e},useState:function(e){e=Jo(e);var t=e.queue,n=Ps.bind(null,R,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:ys,useDeferredValue:function(e,t){return Ss(Mo(),e,t)},useTransition:function(){var e=Jo(!1);return e=ws.bind(null,R,e.queue,!0,!1),Mo().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=R,a=Mo();if(I){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),U===null)throw Error(i(349));G&127||Uo(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,ds(Go.bind(null,r,o,e),[e]),r.flags|=2048,ss(9,{destroy:void 0},Wo.bind(null,r,o,n,t),null),n},useId:function(){var e=Mo(),t=U.identifierPrefix;if(I){var n=ji,r=Ai;n=(r&~(1<<32-qe(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=bo++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=Co++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:ks,useFormState:rs,useActionState:rs,useOptimistic:function(e){var t=Mo();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Is.bind(null,R,!0,n),n.dispatch=t,[e,t]},useMemoCache:Lo,useCacheRefresh:function(){return Mo().memoizedState=Ms.bind(null,R)},useEffectEvent:function(e){var t=Mo(),n={impl:e};return t.memoizedState=n,function(){if(H&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},Hs={readContext:ia,use:Io,useCallback:bs,useContext:ia,useEffect:fs,useImperativeHandle:vs,useInsertionEffect:hs,useLayoutEffect:gs,useMemo:xs,useReducer:zo,useRef:cs,useState:function(){return zo(Ro)},useDebugValue:ys,useDeferredValue:function(e,t){return Cs(No(),z.memoizedState,e,t)},useTransition:function(){var e=zo(Ro)[0],t=No().memoizedState;return[typeof e==`boolean`?e:Fo(e),t]},useSyncExternalStore:Ho,useId:As,useHostTransitionStatus:ks,useFormState:V,useActionState:V,useOptimistic:function(e,t){return Yo(No(),z,e,t)},useMemoCache:Lo,useCacheRefresh:js};Hs.useEffectEvent=ms;var Us={readContext:ia,use:Io,useCallback:bs,useContext:ia,useEffect:fs,useImperativeHandle:vs,useInsertionEffect:hs,useLayoutEffect:gs,useMemo:xs,useReducer:Vo,useRef:cs,useState:function(){return Vo(Ro)},useDebugValue:ys,useDeferredValue:function(e,t){var n=No();return z===null?Ss(n,e,t):Cs(n,z.memoizedState,e,t)},useTransition:function(){var e=Vo(Ro)[0],t=No().memoizedState;return[typeof e==`boolean`?e:Fo(e),t]},useSyncExternalStore:Ho,useId:As,useHostTransitionStatus:ks,useFormState:os,useActionState:os,useOptimistic:function(e,t){var n=No();return z===null?(n.baseState=e,[e,n.queue.dispatch]):Yo(n,z,e,t)},useMemoCache:Lo,useCacheRefresh:js};Us.useEffectEvent=ms;function Ws(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:m({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Gs={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=gu(),i=Ga(r);i.payload=t,n!=null&&(i.callback=n),t=Ka(e,i,r),t!==null&&(J(t,e,r),qa(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=gu(),i=Ga(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Ka(e,i,r),t!==null&&(J(t,e,r),qa(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=gu(),r=Ga(n);r.tag=2,t!=null&&(r.callback=t),t=Ka(e,r,n),t!==null&&(J(t,e,n),qa(t,e,n))}};function Ks(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!kr(n,r)||!kr(i,a):!0}function qs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Gs.enqueueReplaceState(t,t.state,null)}function Js(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=m({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Ys(e){ei(e)}function Xs(e){console.error(e)}function Zs(e){ei(e)}function Qs(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function $s(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function ec(e,t,n){return n=Ga(n),n.tag=3,n.payload={element:null},n.callback=function(){Qs(e,t)},n}function tc(e){return e=Ga(e),e.tag=3,e}function nc(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){$s(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){$s(t,n,r),typeof i!=`function`&&(su===null?su=new Set([this]):su.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function rc(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&ta(t,n,a,!0),n=ao.current,n!==null){switch(n.tag){case 31:case 13:return oo===null?ku():n.alternate===null&&Jl===0&&(Jl=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Oa?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),qu(e,r,a)),!1;case 22:return n.flags|=65536,r===Oa?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),qu(e,r,a)),!1}throw Error(i(435,n.tag))}return qu(e,r,a),ku(),!1}if(I)return t=ao.current,t===null?(r!==Bi&&(t=Error(i(423),{cause:r}),qi(Si(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Si(r,n),a=ec(e.stateNode,r,a),Ja(e,a),Jl!==4&&(Jl=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==Bi&&(e=Error(i(422),{cause:r}),qi(Si(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Si(o,n),eu===null?eu=[o]:eu.push(o),Jl!==4&&(Jl=2),t===null)return!0;r=Si(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=ec(n.stateNode,r,e),Ja(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(su===null||!su.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=tc(a),nc(a,e,n,r),Ja(n,a),!1}n=n.return}while(n!==null);return!1}var ic=Error(i(461)),ac=!1;function oc(e,t,n,r){t.child=e===null?Va(t,null,n,r):Ba(t,e.child,n,r)}function sc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return ra(t),r=To(e,t,n,o,a,i),s=ko(),e!==null&&!ac?(Ao(e,t,i),jc(e,t,i)):(I&&s&&Pi(t),t.flags|=1,oc(e,t,r,i),t.child)}function cc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!pi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,lc(e,t,a,r,i)):(e=gi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Mc(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?kr:n,n(o,r)&&e.ref===t.ref)return jc(e,t,i)}return t.flags|=1,e=mi(a,r),e.ref=t.ref,e.return=t,t.child=e}function lc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(kr(a,r)&&e.ref===t.ref)if(ac=!1,t.pendingProps=r=a,Mc(e,i))e.flags&131072&&(ac=!0);else return t.lanes=e.lanes,jc(e,t,i)}return _c(e,t,n,r,i)}function uc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return fc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ca(t,a===null?null:a.cachePool),a===null?ro():no(t,a),lo(t);else return r=t.lanes=536870912,fc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Ca(t,null),ro(),uo(t)):(Ca(t,a.cachePool),no(t,a),uo(t),t.memoizedState=null);return oc(e,t,i,n),t.child}function dc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function fc(e,t,n,r,i){var a=Sa();return a=a===null?null:{parent:ua._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Ca(t,null),ro(),lo(t),e!==null&&ta(e,t,r,!0),t.childLanes=i,null}function pc(e,t){return t=Ec({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function mc(e,t,n){return Ba(t,e.child,null,n),e=pc(t,t.pendingProps),e.flags|=2,fo(t),t.memoizedState=null,e}function hc(e,t,n){var r=t.pendingProps,a=(t.flags&128)!=0;if(t.flags&=-129,e===null){if(I){if(r.mode===`hidden`)return e=pc(t,r),t.lanes=536870912,dc(null,e);if(co(t),(e=Li)?(e=rf(e,zi),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ki===null?null:{id:Ai,overflow:ji},retryLane:536870912,hydrationErrors:null},n=yi(e),n.return=t,t.child=n,F=t,Li=null)):e=null,e===null)throw Vi(t);return t.lanes=536870912,null}return pc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(co(t),a)if(t.flags&256)t.flags&=-257,t=mc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558));else if(ac||ta(e,t,n,!1),a=(n&e.childLanes)!==0,ac||a){if(r=U,r!==null&&(s=ut(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,si(e,s),J(r,e,s),ic;ku(),t=mc(e,t,n)}else e=o.treeContext,Li=cf(s.nextSibling),F=t,I=!0,Ri=null,zi=!1,e!==null&&Ii(t,e),t=pc(t,r),t.flags|=4096;return t}return e=mi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function gc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function _c(e,t,n,r,i){return ra(t),n=To(e,t,n,r,void 0,i),r=ko(),e!==null&&!ac?(Ao(e,t,i),jc(e,t,i)):(I&&r&&Pi(t),t.flags|=1,oc(e,t,n,i),t.child)}function vc(e,t,n,r,i,a){return ra(t),t.updateQueue=null,n=Do(t,r,n,i),Eo(e),r=ko(),e!==null&&!ac?(Ao(e,t,a),jc(e,t,a)):(I&&r&&Pi(t),t.flags|=1,oc(e,t,n,a),t.child)}function yc(e,t,n,r,i){if(ra(t),t.stateNode===null){var a=ui,o=n.contextType;typeof o==`object`&&o&&(a=ia(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Gs,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},Ua(t),o=n.contextType,a.context=typeof o==`object`&&o?ia(o):ui,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(Ws(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&Gs.enqueueReplaceState(a,a.state,null),Za(t,r,a,i),Xa(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Js(n,s);a.props=c;var l=a.context,u=n.contextType;o=ui,typeof u==`object`&&u&&(o=ia(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&qs(t,a,r,o),Ha=!1;var f=t.memoizedState;a.state=f,Za(t,r,a,i),Xa(),l=t.memoizedState,s||f!==l||Ha?(typeof d==`function`&&(Ws(t,n,d,r),l=t.memoizedState),(c=Ha||Ks(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Wa(e,t),o=t.memoizedProps,u=Js(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=ui,typeof l==`object`&&l&&(c=ia(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&qs(t,a,r,c),Ha=!1,f=t.memoizedState,a.state=f,Za(t,r,a,i),Xa();var p=t.memoizedState;o!==d||f!==p||Ha||e!==null&&e.dependencies!==null&&na(e.dependencies)?(typeof s==`function`&&(Ws(t,n,s,r),p=t.memoizedState),(u=Ha||Ks(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&na(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,gc(e,t),r=(t.flags&128)!=0,a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Ba(t,e.child,null,i),t.child=Ba(t,null,n,i)):oc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=jc(e,t,i),e}function bc(e,t,n,r){return Gi(),t.flags|=256,oc(e,t,n,r),t.child}var xc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Sc(e){return{baseLanes:e,cachePool:wa()}}function Cc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=Ql),e}function wc(e,t,n){var r=t.pendingProps,a=!1,o=(t.flags&128)!=0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(po.current&2)!=0),s&&(a=!0,t.flags&=-129),s=(t.flags&32)!=0,t.flags&=-33,e===null){if(I){if(a?so(t):uo(t),(e=Li)?(e=rf(e,zi),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ki===null?null:{id:Ai,overflow:ji},retryLane:536870912,hydrationErrors:null},n=yi(e),n.return=t,t.child=n,F=t,Li=null)):e=null,e===null)throw Vi(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,a?(uo(t),a=t.mode,c=Ec({mode:`hidden`,children:c},a),r=_i(r,a,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=Sc(n),r.childLanes=Cc(e,s,n),t.memoizedState=xc,dc(null,r)):(so(t),Tc(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(so(t),t.flags&=-257,t=Dc(e,t,n)):t.memoizedState===null?(uo(t),c=r.fallback,a=t.mode,r=Ec({mode:`visible`,children:r.children},a),c=_i(c,a,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Ba(t,e.child,null,n),r=t.child,r.memoizedState=Sc(n),r.childLanes=Cc(e,s,n),t.memoizedState=xc,t=dc(null,r)):(uo(t),t.child=e.child,t.flags|=128,t=null);else if(so(t),of(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(i(419)),r.stack=``,r.digest=s,qi({value:r,source:null,stack:null}),t=Dc(e,t,n)}else if(ac||ta(e,t,n,!1),s=(n&e.childLanes)!==0,ac||s){if(s=U,s!==null&&(r=ut(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,si(e,r),J(s,e,r),ic;af(c)||ku(),t=Dc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,Li=cf(c.nextSibling),F=t,I=!0,Ri=null,zi=!1,e!==null&&Ii(t,e),t=Tc(t,r.children),t.flags|=4096);return t}return a?(uo(t),c=r.fallback,a=t.mode,l=e.child,u=l.sibling,r=mi(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=_i(c,a,n,null),c.flags|=2):c=mi(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,dc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=Sc(n):(a=c.cachePool,a===null?a=wa():(l=ua._currentValue,a=a.parent===l?a:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:a}),r.memoizedState=c,r.childLanes=Cc(e,s,n),t.memoizedState=xc,dc(e.child,r)):(so(t),n=e.child,e=n.sibling,n=mi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function Tc(e,t){return t=Ec({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function Ec(e,t){return e=fi(22,e,null,t),e.lanes=0,e}function Dc(e,t,n){return Ba(t,e.child,null,n),e=Tc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Oc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),$i(e.return,t,n)}function kc(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function Ac(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=po.current,s=(o&2)!=0;if(s?(o=o&1|2,t.flags|=128):o&=1,O(po,o),oc(e,t,r,n),r=I?Ei:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Oc(e,n,t);else if(e.tag===19)Oc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&mo(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),kc(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&mo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}kc(t,!0,n,null,a,r);break;case`together`:kc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function jc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Yl|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(ta(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=mi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=mi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Mc(e,t){return(e.lanes&t)===0?(e=e.dependencies,!!(e!==null&&na(e))):!0}function Nc(e,t,n){switch(t.tag){case 3:ye(t,t.stateNode.containerInfo),Zi(t,ua,e.memoizedState.cache),Gi();break;case 27:case 5:xe(t);break;case 4:ye(t,t.stateNode.containerInfo);break;case 10:Zi(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,co(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(so(t),e=jc(e,t,n),e===null?null:e.sibling):wc(e,t,n):(so(t),t.flags|=128,null);so(t);break;case 19:var i=(e.flags&128)!=0;if(r=(n&t.childLanes)!==0,r||=(ta(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return Ac(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),O(po,po.current),r)break;return null;case 22:return t.lanes=0,uc(e,t,n,t.pendingProps);case 24:Zi(t,ua,e.memoizedState.cache)}return jc(e,t,n)}function Pc(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)ac=!0;else{if(!Mc(e,n)&&!(t.flags&128))return ac=!1,Nc(e,t,n);ac=!!(e.flags&131072)}else ac=!1,I&&t.flags&1048576&&Ni(t,Ei,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=ja(t.elementType),t.type=e,typeof e==`function`)pi(e)?(r=Js(e,r),t.tag=1,t=yc(null,t,e,r,n)):(t.tag=0,t=_c(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===w){t.tag=11,t=sc(null,t,e,r,n);break a}else if(a===T){t.tag=14,t=cc(null,t,e,r,n);break a}}throw t=ce(e)||e,Error(i(306,t,``))}}return t;case 0:return _c(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=Js(r,t.pendingProps),yc(e,t,r,a,n);case 3:a:{if(ye(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,Wa(e,t),Za(t,r,null,n);var s=t.memoizedState;if(r=s.cache,Zi(t,ua,r),r!==o.cache&&ea(t,[ua],n,!0),Xa(),r=s.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=bc(e,t,r,n);break a}else if(r!==a){a=Si(Error(i(424)),t),qi(a),t=bc(e,t,r,n);break a}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(Li=cf(e.firstChild),F=t,I=!0,Ri=null,zi=!0,n=Va(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Gi(),r===a){t=jc(e,t,n);break a}oc(e,t,r,n)}t=t.child}return t;case 26:return gc(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:I||(n=t.type,e=t.pendingProps,r=Bd(_e.current).createElement(n),r[gt]=t,r[_t]=e,Pd(r,n,e),Ot(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return xe(t),e===null&&I&&(r=t.stateNode=ff(t.type,t.pendingProps,_e.current),F=t,zi=!0,a=Li,Zd(t.type)?(lf=a,Li=cf(r.firstChild)):Li=a),oc(e,t,t.pendingProps.children,n),gc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&I&&((a=r=Li)&&(r=tf(r,t.type,t.pendingProps,zi),r===null?a=!1:(t.stateNode=r,F=t,Li=cf(r.firstChild),zi=!1,a=!0)),a||Vi(t)),xe(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Ud(a,o)?r=null:s!==null&&Ud(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=To(e,t,Oo,null,null,n),Qf._currentValue=a),gc(e,t),oc(e,t,r,n),t.child;case 6:return e===null&&I&&((e=n=Li)&&(n=nf(n,t.pendingProps,zi),n===null?e=!1:(t.stateNode=n,F=t,Li=null,e=!0)),e||Vi(t)),null;case 13:return wc(e,t,n);case 4:return ye(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Ba(t,null,r,n):oc(e,t,r,n),t.child;case 11:return sc(e,t,t.type,t.pendingProps,n);case 7:return oc(e,t,t.pendingProps,n),t.child;case 8:return oc(e,t,t.pendingProps.children,n),t.child;case 12:return oc(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,Zi(t,t.type,r.value),oc(e,t,r.children,n),t.child;case 9:return a=t.type._context,r=t.pendingProps.children,ra(t),a=ia(a),r=r(a),t.flags|=1,oc(e,t,r,n),t.child;case 14:return cc(e,t,t.type,t.pendingProps,n);case 15:return lc(e,t,t.type,t.pendingProps,n);case 19:return Ac(e,t,n);case 31:return hc(e,t,n);case 22:return uc(e,t,n,t.pendingProps);case 24:return ra(t),r=ia(ua),e===null?(a=Sa(),a===null&&(a=U,o=da(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},Ua(t),Zi(t,ua,a)):((e.lanes&n)!==0&&(Wa(e,t),Za(t,null,null,n),Xa()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,Zi(t,ua,r),r!==a.cache&&ea(t,[ua],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Zi(t,ua,r))),oc(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function Fc(e){e.flags|=4}function Ic(e,t,n,r,i){if((t=(e.mode&32)!=0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(Eu())e.flags|=8192;else throw Ma=Oa,Ea}else e.flags&=-16777217}function Lc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t))if(Eu())e.flags|=8192;else throw Ma=Oa,Ea}function Rc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:it(),e.lanes|=t,$l|=t)}function zc(e,t){if(!I)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Bc(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Vc(e,t,n){var r=t.pendingProps;switch(Fi(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Bc(t),null;case 1:return Bc(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),Qi(ua),be(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Wi(t)?Fc(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Ki())),Bc(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(Fc(t),o===null?(Bc(t),Ic(t,a,null,r,n)):(Bc(t),Lc(t,o))):o?o===e.memoizedState?(Bc(t),t.flags&=-16777217):(Fc(t),Bc(t),Lc(t,o)):(e=e.memoizedProps,e!==r&&Fc(t),Bc(t),Ic(t,a,e,r,n)),null;case 27:if(Se(t),n=_e.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Fc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Bc(t),null}e=he.current,Wi(t)?Hi(t,e):(e=ff(a,r,n),t.stateNode=e,Fc(t))}return Bc(t),null;case 5:if(Se(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Fc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Bc(t),null}if(o=he.current,Wi(t))Hi(t,o);else{var s=Bd(_e.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[gt]=t,o[_t]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(Pd(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&Fc(t)}}return Bc(t),Ic(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Fc(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=_e.current,Wi(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=F,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[gt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Md(e.nodeValue,n)),e||Vi(t,!0)}else e=Bd(e).createTextNode(r),e[gt]=t,t.stateNode=e}return Bc(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Wi(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[gt]=t}else Gi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Bc(t),e=!1}else n=Ki(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(fo(t),t):(fo(t),null);if(t.flags&128)throw Error(i(558))}return Bc(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Wi(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[gt]=t}else Gi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Bc(t),a=!1}else a=Ki(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(fo(t),t):(fo(t),null)}return fo(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Rc(t,t.updateQueue),Bc(t),null);case 4:return be(),e===null&&Sd(t.stateNode.containerInfo),Bc(t),null;case 10:return Qi(t.type),Bc(t),null;case 19:if(me(po),r=t.memoizedState,r===null)return Bc(t),null;if(a=(t.flags&128)!=0,o=r.rendering,o===null)if(a)zc(r,!1);else{if(Jl!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=mo(e),o!==null){for(t.flags|=128,zc(r,!1),e=o.updateQueue,t.updateQueue=e,Rc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)hi(n,e),n=n.sibling;return O(po,po.current&1|2),I&&Mi(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Fe()>au&&(t.flags|=128,a=!0,zc(r,!1),t.lanes=4194304)}else{if(!a)if(e=mo(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Rc(t,e),zc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!I)return Bc(t),null}else 2*Fe()-r.renderingStartTime>au&&n!==536870912&&(t.flags|=128,a=!0,zc(r,!1),t.lanes=4194304);r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(Bc(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Fe(),e.sibling=null,n=po.current,O(po,a?n&1|2:n&1),I&&Mi(t,r.treeForkCount),e);case 22:case 23:return fo(t),io(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(Bc(t),t.subtreeFlags&6&&(t.flags|=8192)):Bc(t),n=t.updateQueue,n!==null&&Rc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&me(xa),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),Qi(ua),Bc(t),null;case 25:return null;case 30:return null}throw Error(i(156,t.tag))}function Hc(e,t){switch(Fi(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Qi(ua),be(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Se(t),null;case 31:if(t.memoizedState!==null){if(fo(t),t.alternate===null)throw Error(i(340));Gi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(fo(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));Gi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return me(po),null;case 4:return be(),null;case 10:return Qi(t.type),null;case 22:case 23:return fo(t),io(),e!==null&&me(xa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Qi(ua),null;case 25:return null;default:return null}}function Uc(e,t){switch(Fi(t),t.tag){case 3:Qi(ua),be();break;case 26:case 27:case 5:Se(t);break;case 4:be();break;case 31:t.memoizedState!==null&&fo(t);break;case 13:fo(t);break;case 19:me(po);break;case 10:Qi(t.type);break;case 22:case 23:fo(t),io(),e!==null&&me(xa);break;case 24:Qi(ua)}}function Wc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Y(t,t.return,e)}}function Gc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Y(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Y(t,t.return,e)}}function Kc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{$a(t,n)}catch(t){Y(e,e.return,t)}}}function qc(e,t,n){n.props=Js(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Y(e,t,n)}}function Jc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Y(e,t,n)}}function Yc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null)if(typeof r==`function`)try{r()}catch(n){Y(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Y(e,t,n)}else n.current=null}function Xc(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Y(e,e.return,t)}}function Zc(e,t,n){try{var r=e.stateNode;Fd(r,e.type,n,t),r[_t]=t}catch(t){Y(e,e.return,t)}}function Qc(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function $c(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Qc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function el(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=cn));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(el(e,t,n),e=e.sibling;e!==null;)el(e,t,n),e=e.sibling}function tl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(tl(e,t,n),e=e.sibling;e!==null;)tl(e,t,n),e=e.sibling}function nl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Pd(t,r,n),t[gt]=e,t[_t]=n}catch(t){Y(e,e.return,t)}}var rl=!1,il=!1,al=!1,ol=typeof WeakSet==`function`?WeakSet:Set,sl=null;function cl(e,t){if(e=e.containerInfo,Rd=sp,e=Nr(e),Pr(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(zd={focusedElem:e,selectionRange:n},sp=!1,sl=t;sl!==null;)if(t=sl,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,sl=e;else for(;sl!==null;){switch(t=sl,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,a=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=Js(n.type,a);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){Y(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(i(163))}if(e=t.sibling,e!==null){e.return=t.return,sl=e;break}sl=t.return}}function ll(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:wl(e,n),r&4&&Wc(5,n);break;case 1:if(wl(e,n),r&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Y(n,n.return,e)}else{var i=Js(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Y(n,n.return,e)}}r&64&&Kc(n),r&512&&Jc(n,n.return);break;case 3:if(wl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{$a(e,t)}catch(e){Y(n,n.return,e)}}break;case 27:t===null&&r&4&&nl(n);case 26:case 5:wl(e,n),t===null&&r&4&&Xc(n),r&512&&Jc(n,n.return);break;case 12:wl(e,n);break;case 31:wl(e,n),r&4&&hl(e,n);break;case 13:wl(e,n),r&4&&gl(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Xu.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||rl,!r){t=t!==null&&t.memoizedState!==null||il,i=rl;var a=il;rl=r,(il=t)&&!a?El(e,n,(n.subtreeFlags&8772)!=0):wl(e,n),rl=i,il=a}break;case 30:break;default:wl(e,n)}}function ul(e){var t=e.alternate;t!==null&&(e.alternate=null,ul(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&wt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var dl=null,fl=!1;function pl(e,t,n){for(n=n.child;n!==null;)ml(e,t,n),n=n.sibling}function ml(e,t,n){if(Ge&&typeof Ge.onCommitFiberUnmount==`function`)try{Ge.onCommitFiberUnmount(We,n)}catch{}switch(n.tag){case 26:il||Yc(n,t),pl(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:il||Yc(n,t);var r=dl,i=fl;Zd(n.type)&&(dl=n.stateNode,fl=!1),pl(e,t,n),pf(n.stateNode),dl=r,fl=i;break;case 5:il||Yc(n,t);case 6:if(r=dl,i=fl,dl=null,pl(e,t,n),dl=r,fl=i,dl!==null)if(fl)try{(dl.nodeType===9?dl.body:dl.nodeName===`HTML`?dl.ownerDocument.body:dl).removeChild(n.stateNode)}catch(e){Y(n,t,e)}else try{dl.removeChild(n.stateNode)}catch(e){Y(n,t,e)}break;case 18:dl!==null&&(fl?(e=dl,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(dl,n.stateNode));break;case 4:r=dl,i=fl,dl=n.stateNode.containerInfo,fl=!0,pl(e,t,n),dl=r,fl=i;break;case 0:case 11:case 14:case 15:Gc(2,n,t),il||Gc(4,n,t),pl(e,t,n);break;case 1:il||(Yc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&qc(n,t,r)),pl(e,t,n);break;case 21:pl(e,t,n);break;case 22:il=(r=il)||n.memoizedState!==null,pl(e,t,n),il=r;break;default:pl(e,t,n)}}function hl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){Y(t,t.return,e)}}}function gl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){Y(t,t.return,e)}}function _l(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new ol),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new ol),t;default:throw Error(i(435,e.tag))}}function vl(e,t){var n=_l(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Zu.bind(null,e,t);t.then(r,r)}})}function yl(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){dl=c.stateNode,fl=!1;break a}break;case 5:dl=c.stateNode,fl=!1;break a;case 3:case 4:dl=c.stateNode.containerInfo,fl=!0;break a}c=c.return}if(dl===null)throw Error(i(160));ml(o,s,a),dl=null,fl=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)xl(t,e),t=t.sibling}var bl=null;function xl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:yl(t,e),Sl(e),r&4&&(Gc(3,e,e.return),Wc(3,e),Gc(5,e,e.return));break;case 1:yl(t,e),Sl(e),r&512&&(il||n===null||Yc(n,n.return)),r&64&&rl&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var a=bl;if(yl(t,e),Sl(e),r&512&&(il||n===null||Yc(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null)if(r===null)if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,a=a.ownerDocument||a;b:switch(r){case`title`:o=a.getElementsByTagName(`title`)[0],(!o||o[Ct]||o[gt]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=a.createElement(r),a.head.insertBefore(o,a.querySelector(`head > title`))),Pd(o,r,n),o[gt]=e,Ot(o),r=o;break a;case`link`:var s=Vf(`link`,`href`,a).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;case`meta`:if(s=Vf(`meta`,`content`,a).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;default:throw Error(i(468,r))}o[gt]=e,Ot(o),r=o}e.stateNode=r}else Hf(a,e.type,e.stateNode);else e.stateNode=If(a,r,e.memoizedProps);else o===r?r===null&&e.stateNode!==null&&Zc(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Hf(a,e.type,e.stateNode):If(a,r,e.memoizedProps))}break;case 27:yl(t,e),Sl(e),r&512&&(il||n===null||Yc(n,n.return)),n!==null&&r&4&&Zc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(yl(t,e),Sl(e),r&512&&(il||n===null||Yc(n,n.return)),e.flags&32){a=e.stateNode;try{$t(a,``)}catch(t){Y(e,e.return,t)}}r&4&&e.stateNode!=null&&(a=e.memoizedProps,Zc(e,a,n===null?a:n.memoizedProps)),r&1024&&(al=!0);break;case 6:if(yl(t,e),Sl(e),r&4){if(e.stateNode===null)throw Error(i(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){Y(e,e.return,t)}}break;case 3:if(Bf=null,a=bl,bl=gf(t.containerInfo),yl(t,e),bl=a,Sl(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){Y(e,e.return,t)}al&&(al=!1,Cl(e));break;case 4:r=bl,bl=gf(e.stateNode.containerInfo),yl(t,e),Sl(e),bl=r;break;case 12:yl(t,e),Sl(e);break;case 31:yl(t,e),Sl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,vl(e,r)));break;case 13:yl(t,e),Sl(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(ru=Fe()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,vl(e,r)));break;case 22:a=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=rl,d=il;if(rl=u||a,il=d||l,yl(t,e),il=d,rl=u,Sl(e),r&8192)a:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||l||rl||il||Tl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,a)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){Y(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=a?``:l.memoizedProps}catch(e){Y(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;a?$d(m,!0):$d(l.stateNode,!1)}catch(e){Y(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,vl(e,n))));break;case 19:yl(t,e),Sl(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,vl(e,r)));break;case 30:break;case 21:break;default:yl(t,e),Sl(e)}}function Sl(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Qc(r)){n=r;break}r=r.return}if(n==null)throw Error(i(160));switch(n.tag){case 27:var a=n.stateNode;tl(e,$c(e),a);break;case 5:var o=n.stateNode;n.flags&32&&($t(o,``),n.flags&=-33),tl(e,$c(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;el(e,$c(e),s);break;default:throw Error(i(161))}}catch(t){Y(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Cl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Cl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function wl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)ll(e,t.alternate,t),t=t.sibling}function Tl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Gc(4,t,t.return),Tl(t);break;case 1:Yc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&qc(t,t.return,n),Tl(t);break;case 27:pf(t.stateNode);case 26:case 5:Yc(t,t.return),Tl(t);break;case 22:t.memoizedState===null&&Tl(t);break;case 30:Tl(t);break;default:Tl(t)}e=e.sibling}}function El(e,t,n){for(n&&=(t.subtreeFlags&8772)!=0,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:El(i,a,n),Wc(4,a);break;case 1:if(El(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Y(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)Qa(c[i],s)}catch(e){Y(r,r.return,e)}}n&&o&64&&Kc(a),Jc(a,a.return);break;case 27:nl(a);case 26:case 5:El(i,a,n),n&&r===null&&o&4&&Xc(a),Jc(a,a.return);break;case 12:El(i,a,n);break;case 31:El(i,a,n),n&&o&4&&hl(i,a);break;case 13:El(i,a,n),n&&o&4&&gl(i,a);break;case 22:a.memoizedState===null&&El(i,a,n),Jc(a,a.return);break;case 30:break;default:El(i,a,n)}t=t.sibling}}function Dl(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&fa(n))}function Ol(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&fa(e))}function kl(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Al(e,t,n,r),t=t.sibling}function Al(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:kl(e,t,n,r),i&2048&&Wc(9,t);break;case 1:kl(e,t,n,r);break;case 3:kl(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&fa(e)));break;case 12:if(i&2048){kl(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){Y(t,t.return,e)}}else kl(e,t,n,r);break;case 31:kl(e,t,n,r);break;case 13:kl(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?kl(e,t,n,r):(a._visibility|=2,jl(e,t,n,r,(t.subtreeFlags&10256)!=0||!1)):a._visibility&2?kl(e,t,n,r):Ml(e,t),i&2048&&Dl(o,t);break;case 24:kl(e,t,n,r),i&2048&&Ol(t.alternate,t);break;default:kl(e,t,n,r)}}function jl(e,t,n,r,i){for(i&&=(t.subtreeFlags&10256)!=0||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:jl(a,o,s,c,i),Wc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,jl(a,o,s,c,i)):u._visibility&2?jl(a,o,s,c,i):Ml(a,o),i&&l&2048&&Dl(o.alternate,o);break;case 24:jl(a,o,s,c,i),i&&l&2048&&Ol(o.alternate,o);break;default:jl(a,o,s,c,i)}t=t.sibling}}function Ml(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Ml(n,r),i&2048&&Dl(r.alternate,r);break;case 24:Ml(n,r),i&2048&&Ol(r.alternate,r);break;default:Ml(n,r)}t=t.sibling}}var Nl=8192;function Pl(e,t,n){if(e.subtreeFlags&Nl)for(e=e.child;e!==null;)Fl(e,t,n),e=e.sibling}function Fl(e,t,n){switch(e.tag){case 26:Pl(e,t,n),e.flags&Nl&&e.memoizedState!==null&&Gf(n,bl,e.memoizedState,e.memoizedProps);break;case 5:Pl(e,t,n);break;case 3:case 4:var r=bl;bl=gf(e.stateNode.containerInfo),Pl(e,t,n),bl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Nl,Nl=16777216,Pl(e,t,n),Nl=r):Pl(e,t,n));break;default:Pl(e,t,n)}}function Il(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Ll(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];sl=r,Bl(r,e)}Il(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Rl(e),e=e.sibling}function Rl(e){switch(e.tag){case 0:case 11:case 15:Ll(e),e.flags&2048&&Gc(9,e,e.return);break;case 3:Ll(e);break;case 12:Ll(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,zl(e)):Ll(e);break;default:Ll(e)}}function zl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];sl=r,Bl(r,e)}Il(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Gc(8,t,t.return),zl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,zl(t));break;default:zl(t)}e=e.sibling}}function Bl(e,t){for(;sl!==null;){var n=sl;switch(n.tag){case 0:case 11:case 15:Gc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:fa(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,sl=r;else a:for(n=e;sl!==null;){r=sl;var i=r.sibling,a=r.return;if(ul(r),r===n){sl=null;break a}if(i!==null){i.return=a,sl=i;break a}sl=a}}}var Vl={getCacheForType:function(e){var t=ia(ua),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return ia(ua).controller.signal}},Hl=typeof WeakMap==`function`?WeakMap:Map,H=0,U=null,W=null,G=0,K=0,Ul=null,Wl=!1,Gl=!1,Kl=!1,ql=0,Jl=0,Yl=0,Xl=0,Zl=0,Ql=0,$l=0,eu=null,tu=null,nu=!1,ru=0,iu=0,au=1/0,ou=null,su=null,cu=0,lu=null,uu=null,du=0,fu=0,pu=null,mu=null,hu=0,q=null;function gu(){return H&2&&G!==0?G&-G:E.T===null?pt():dd()}function _u(){if(Ql===0)if(!(G&536870912)||I){var e=Qe;Qe<<=1,!(Qe&3932160)&&(Qe=262144),Ql=e}else Ql=536870912;return e=ao.current,e!==null&&(e.flags|=32),Ql}function J(e,t,n){(e===U&&(K===2||K===9)||e.cancelPendingCommit!==null)&&(wu(e,0),xu(e,G,Ql,!1)),ot(e,n),(!(H&2)||e!==U)&&(e===U&&(!(H&2)&&(Xl|=n),Jl===4&&xu(e,G,Ql,!1)),rd(e))}function vu(e,t,n){if(H&6)throw Error(i(327));var r=!n&&(t&127)==0&&(t&e.expiredLanes)===0||nt(e,t),a=r?Mu(e,t):Au(e,t,!0),o=r;do{if(a===0){Gl&&!r&&xu(e,t,0,!1);break}else{if(n=e.current.alternate,o&&!bu(n)){a=Au(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=eu;var l=c.current.memoizedState.isDehydrated;if(l&&(wu(c,s).flags|=256),s=Au(c,s,!1),s!==2){if(Kl&&!l){c.errorRecoveryDisabledLanes|=o,Xl|=o,a=4;break a}o=tu,tu=a,o!==null&&(tu===null?tu=o:tu.push.apply(tu,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){wu(e,0),xu(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t)break;case 6:xu(r,t,Ql,!Wl);break a;case 2:tu=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=ru+300-Fe(),10<a)){if(xu(r,t,Ql,!Wl),tt(r,0,!0)!==0)break a;du=t,r.timeoutHandle=Kd(yu.bind(null,r,n,tu,ou,nu,t,Ql,Xl,$l,Wl,o,`Throttled`,-0,0),a);break a}yu(r,n,tu,ou,nu,t,Ql,Xl,$l,Wl,o,null,-0,0)}}break}while(1);rd(e)}function yu(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:cn},Fl(t,a,d);var m=(a&62914560)===a?ru-Fe():(a&4194048)===a?iu-Fe():0;if(m=qf(d,m),m!==null){du=a,e.cancelPendingCommit=m(zu.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),xu(e,a,o,!l);return}}zu(e,t,a,n,r,i,o,s,c)}function bu(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Or(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function xu(e,t,n,r){t&=~Zl,t&=~Xl,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-qe(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&ct(e,n,t)}function Su(){return H&6?!0:(id(0,!1),!1)}function Cu(){if(W!==null){if(K===0)var e=W.return;else e=W,Xi=Yi=null,jo(e),Fa=null,Ia=0,e=W;for(;e!==null;)Uc(e.alternate,e),e=e.return;W=null}}function wu(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,qd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),du=0,Cu(),U=e,W=n=mi(e.current,null),G=t,K=0,Ul=null,Wl=!1,Gl=nt(e,t),Kl=!1,$l=Ql=Zl=Xl=Yl=Jl=0,tu=eu=null,nu=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-qe(r),a=1<<i;t|=e[i],r&=~a}return ql=t,ii(),n}function Tu(e,t){R=null,E.H=Bs,t===Ta||t===Da?(t=Na(),K=3):t===Ea?(t=Na(),K=4):K=t===ic?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Ul=t,W===null&&(Jl=1,Qs(e,Si(t,e.current)))}function Eu(){var e=ao.current;return e===null?!0:(G&4194048)===G?oo===null:(G&62914560)===G||G&536870912?e===oo:!1}function Du(){var e=E.H;return E.H=Bs,e===null?Bs:e}function Ou(){var e=E.A;return E.A=Vl,e}function ku(){Jl=4,Wl||(G&4194048)!==G&&ao.current!==null||(Gl=!0),!(Yl&134217727)&&!(Xl&134217727)||U===null||xu(U,G,Ql,!1)}function Au(e,t,n){var r=H;H|=2;var i=Du(),a=Ou();(U!==e||G!==t)&&(ou=null,wu(e,t)),t=!1;var o=Jl;a:do try{if(K!==0&&W!==null){var s=W,c=Ul;switch(K){case 8:Cu(),o=6;break a;case 3:case 2:case 9:case 6:ao.current===null&&(t=!0);var l=K;if(K=0,Ul=null,Iu(e,s,c,l),n&&Gl){o=0;break a}break;default:l=K,K=0,Ul=null,Iu(e,s,c,l)}}ju(),o=Jl;break}catch(t){Tu(e,t)}while(1);return t&&e.shellSuspendCounter++,Xi=Yi=null,H=r,E.H=i,E.A=a,W===null&&(U=null,G=0,ii()),o}function ju(){for(;W!==null;)Pu(W)}function Mu(e,t){var n=H;H|=2;var r=Du(),a=Ou();U!==e||G!==t?(ou=null,au=Fe()+500,wu(e,t)):Gl=nt(e,t);a:do try{if(K!==0&&W!==null){t=W;var o=Ul;b:switch(K){case 1:K=0,Ul=null,Iu(e,t,o,1);break;case 2:case 9:if(ka(o)){K=0,Ul=null,Fu(t);break}t=function(){K!==2&&K!==9||U!==e||(K=7),rd(e)},o.then(t,t);break a;case 3:K=7;break a;case 4:K=5;break a;case 7:ka(o)?(K=0,Ul=null,Fu(t)):(K=0,Ul=null,Iu(e,t,o,7));break;case 5:var s=null;switch(W.tag){case 26:s=W.memoizedState;case 5:case 27:var c=W;if(s?Wf(s):c.stateNode.complete){K=0,Ul=null;var l=c.sibling;if(l!==null)W=l;else{var u=c.return;u===null?W=null:(W=u,Lu(u))}break b}}K=0,Ul=null,Iu(e,t,o,5);break;case 6:K=0,Ul=null,Iu(e,t,o,6);break;case 8:Cu(),Jl=6;break a;default:throw Error(i(462))}}Nu();break}catch(t){Tu(e,t)}while(1);return Xi=Yi=null,E.H=r,E.A=a,H=n,W===null?(U=null,G=0,ii(),Jl):0}function Nu(){for(;W!==null&&!Ne();)Pu(W)}function Pu(e){var t=Pc(e.alternate,e,ql);e.memoizedProps=e.pendingProps,t===null?Lu(e):W=t}function Fu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=vc(n,t,t.pendingProps,t.type,void 0,G);break;case 11:t=vc(n,t,t.pendingProps,t.type.render,t.ref,G);break;case 5:jo(t);default:Uc(n,t),t=W=hi(t,ql),t=Pc(n,t,ql)}e.memoizedProps=e.pendingProps,t===null?Lu(e):W=t}function Iu(e,t,n,r){Xi=Yi=null,jo(t),Fa=null,Ia=0;var i=t.return;try{if(rc(e,i,t,n,G)){Jl=1,Qs(e,Si(n,e.current)),W=null;return}}catch(t){if(i!==null)throw W=i,t;Jl=1,Qs(e,Si(n,e.current)),W=null;return}t.flags&32768?(I||r===1?e=!0:Gl||G&536870912?e=!1:(Wl=e=!0,(r===2||r===9||r===3||r===6)&&(r=ao.current,r!==null&&r.tag===13&&(r.flags|=16384))),Ru(t,e)):Lu(t)}function Lu(e){var t=e;do{if(t.flags&32768){Ru(t,Wl);return}e=t.return;var n=Vc(t.alternate,t,ql);if(n!==null){W=n;return}if(t=t.sibling,t!==null){W=t;return}W=t=e}while(t!==null);Jl===0&&(Jl=5)}function Ru(e,t){do{var n=Hc(e.alternate,e);if(n!==null){n.flags&=32767,W=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){W=e;return}W=e=n}while(e!==null);Jl=6,W=null}function zu(e,t,n,r,a,o,s,c,l){e.cancelPendingCommit=null;do Wu();while(cu!==0);if(H&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));if(o=t.lanes|t.childLanes,o|=ri,st(e,n,o,s,c,l),e===U&&(W=U=null,G=0),uu=t,lu=e,du=n,fu=o,pu=a,mu=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Qu(ze,function(){return Gu(),null})):(e.callbackNode=null,e.callbackPriority=0),r=(t.flags&13878)!=0,t.subtreeFlags&13878||r){r=E.T,E.T=null,a=D.p,D.p=2,s=H,H|=4;try{cl(e,t,n)}finally{H=s,D.p=a,E.T=r}}cu=1,Bu(),Vu(),Hu()}}function Bu(){if(cu===1){cu=0;var e=lu,t=uu,n=(t.flags&13878)!=0;if(t.subtreeFlags&13878||n){n=E.T,E.T=null;var r=D.p;D.p=2;var i=H;H|=4;try{xl(t,e);var a=zd,o=Nr(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Mr(s.ownerDocument.documentElement,s)){if(c!==null&&Pr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=jr(s,h),v=jr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!Rd,zd=Rd=null}finally{H=i,D.p=r,E.T=n}}e.current=t,cu=2}}function Vu(){if(cu===2){cu=0;var e=lu,t=uu,n=(t.flags&8772)!=0;if(t.subtreeFlags&8772||n){n=E.T,E.T=null;var r=D.p;D.p=2;var i=H;H|=4;try{ll(e,t.alternate,t)}finally{H=i,D.p=r,E.T=n}}cu=3}}function Hu(){if(cu===4||cu===3){cu=0,Pe();var e=lu,t=uu,n=du,r=mu;t.subtreeFlags&10256||t.flags&10256?cu=5:(cu=0,uu=lu=null,Uu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(su=null),ft(n),t=t.stateNode,Ge&&typeof Ge.onCommitFiberRoot==`function`)try{Ge.onCommitFiberRoot(We,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=E.T,i=D.p,D.p=2,E.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{E.T=t,D.p=i}}du&3&&Wu(),rd(e),i=e.pendingLanes,n&261930&&i&42?e===q?hu++:(hu=0,q=e):hu=0,id(0,!1)}}function Uu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,fa(t)))}function Wu(){return Bu(),Vu(),Hu(),Gu()}function Gu(){if(cu!==5)return!1;var e=lu,t=fu;fu=0;var n=ft(du),r=E.T,a=D.p;try{D.p=32>n?32:n,E.T=null,n=pu,pu=null;var o=lu,s=du;if(cu=0,uu=lu=null,du=0,H&6)throw Error(i(331));var c=H;if(H|=4,Rl(o.current),Al(o,o.current,s,n),H=c,id(0,!1),Ge&&typeof Ge.onPostCommitFiberRoot==`function`)try{Ge.onPostCommitFiberRoot(We,o)}catch{}return!0}finally{D.p=a,E.T=r,Uu(e,t)}}function Ku(e,t,n){t=Si(n,t),t=ec(e.stateNode,t,2),e=Ka(e,t,2),e!==null&&(ot(e,2),rd(e))}function Y(e,t,n){if(e.tag===3)Ku(e,e,n);else for(;t!==null;){if(t.tag===3){Ku(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(su===null||!su.has(r))){e=Si(n,e),n=tc(2),r=Ka(t,n,2),r!==null&&(nc(n,r,t,e),ot(r,2),rd(r));break}}t=t.return}}function qu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Hl;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Kl=!0,i.add(n),e=Ju.bind(null,e,t,n),t.then(e,e))}function Ju(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,U===e&&(G&n)===n&&(Jl===4||Jl===3&&(G&62914560)===G&&300>Fe()-ru?!(H&2)&&wu(e,0):Zl|=n,$l===G&&($l=0)),rd(e)}function Yu(e,t){t===0&&(t=it()),e=si(e,t),e!==null&&(ot(e,t),rd(e))}function Xu(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Yu(e,n)}function Zu(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),Yu(e,n)}function Qu(e,t){return je(e,t)}var X=null,$u=null,ed=!1,td=!1,nd=!1,Z=0;function rd(e){e!==$u&&e.next===null&&($u===null?X=$u=e:$u=$u.next=e),td=!0,ed||(ed=!0,ud())}function id(e,t){if(!nd&&td){nd=!0;do for(var n=!1,r=X;r!==null;){if(!t)if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-qe(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,ld(r,a))}else a=G,a=tt(r,r===U?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||nt(r,a)||(n=!0,ld(r,a));r=r.next}while(n);nd=!1}}function ad(){od()}function od(){td=ed=!1;var e=0;Z!==0&&Gd()&&(e=Z);for(var t=Fe(),n=null,r=X;r!==null;){var i=r.next,a=sd(r,t);a===0?(r.next=null,n===null?X=i:n.next=i,i===null&&($u=n)):(n=r,(e!==0||a&3)&&(td=!0)),r=i}cu!==0&&cu!==5||id(e,!1),Z!==0&&(Z=0)}function sd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-qe(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=rt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=U,n=G,n=tt(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(K===2||K===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Me(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||nt(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Me(r),ft(n)){case 2:case 8:n=Re;break;case 32:n=ze;break;case 268435456:n=Ve;break;default:n=ze}return r=cd.bind(null,e),n=je(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Me(r),e.callbackPriority=2,e.callbackNode=null,2}function cd(e,t){if(cu!==0&&cu!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Wu()&&e.callbackNode!==n)return null;var r=G;return r=tt(e,e===U?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(vu(e,r,t),sd(e,Fe()),e.callbackNode!=null&&e.callbackNode===n?cd.bind(null,e):null)}function ld(e,t){if(Wu())return null;vu(e,t,!0)}function ud(){Yd(function(){H&6?je(Le,ad):od()})}function dd(){if(Z===0){var e=ha;e===0&&(e=Ze,Ze<<=1,!(Ze&261888)&&(Ze=256)),Z=e}return Z}function fd(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:sn(``+e)}function pd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function md(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=fd((i[_t]||null).action),o=r.submitter;o&&(t=(t=o[_t]||null)?fd(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new Dn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(Z!==0){var e=o?pd(i,o):new FormData(i);Es(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?pd(i,o):new FormData(i),Es(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var hd=0;hd<Qr.length;hd++){var gd=Qr[hd];$r(gd.toLowerCase(),`on`+(gd[0].toUpperCase()+gd.slice(1)))}$r(Gr,`onAnimationEnd`),$r(Kr,`onAnimationIteration`),$r(qr,`onAnimationStart`),$r(`dblclick`,`onDoubleClick`),$r(`focusin`,`onFocus`),$r(`focusout`,`onBlur`),$r(P,`onTransitionRun`),$r(Jr,`onTransitionStart`),$r(Yr,`onTransitionCancel`),$r(Xr,`onTransitionEnd`),Mt(`onMouseEnter`,[`mouseout`,`mouseover`]),Mt(`onMouseLeave`,[`mouseout`,`mouseover`]),Mt(`onPointerEnter`,[`pointerout`,`pointerover`]),Mt(`onPointerLeave`,[`pointerout`,`pointerover`]),jt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),jt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),jt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),jt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),jt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),jt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var _d=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),vd=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(_d));function yd(e,t){t=(t&4)!=0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ei(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ei(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[yt];n===void 0&&(n=t[yt]=new Set);var r=e+`__bubble`;n.has(r)||(Cd(t,e,2,!1),n.add(r))}function bd(e,t,n){var r=0;t&&(r|=4),Cd(n,e,r,t)}var xd=`_reactListening`+Math.random().toString(36).slice(2);function Sd(e){if(!e[xd]){e[xd]=!0,kt.forEach(function(t){t!==`selectionchange`&&(vd.has(t)||bd(t,!1,e),bd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[xd]||(t[xd]=!0,bd(`selectionchange`,!1,t))}}function Cd(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!gn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function wd(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=Tt(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}hn(function(){var r=a,i=un(n),s=[];a:{var c=Zr.get(e);if(c!==void 0){var l=Dn,u=e;switch(e){case`keypress`:if(Sn(n)===0)break a;case`keydown`:case`keyup`:l=Gn;break;case`focusin`:u=`focus`,l=In;break;case`focusout`:u=`blur`,l=In;break;case`beforeblur`:case`afterblur`:l=In;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=Pn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Fn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=qn;break;case Gr:case Kr:case qr:l=Ln;break;case Xr:l=Jn;break;case`scroll`:case`scrollend`:l=kn;break;case`wheel`:l=Yn;break;case`copy`:case`cut`:case`paste`:l=Rn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=Kn;break;case`toggle`:case`beforetoggle`:l=Xn}var d=(t&4)!=0,f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=j(m,p),g!=null&&d.push(Td(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(c=e===`mouseover`||e===`pointerover`,l=e===`mouseout`||e===`pointerout`,c&&n!==ln&&(u=n.relatedTarget||n.fromElement)&&(Tt(u)||u[vt]))break a;if((l||c)&&(c=i.window===i?i:(c=i.ownerDocument)?c.defaultView||c.parentWindow:window,l?(u=n.relatedTarget||n.toElement,l=r,u=u?Tt(u):null,u!==null&&(f=o(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(l=null,u=r),l!==u)){if(d=Pn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Kn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=l==null?c:Dt(l),h=u==null?c:Dt(u),c=new d(g,m+`leave`,l,n,i),c.target=f,c.relatedTarget=h,g=null,Tt(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,l&&u)b:{for(d=Dd,p=l,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;l!==null&&Od(s,c,l,d,!1),u!==null&&f!==null&&Od(s,f,u,d,!0)}}a:{if(c=r?Dt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var v=gr;else if(ur(c))if(_r)v=Er;else{v=wr;var y=Cr}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&rn(r.elementType)&&(v=gr):v=Tr;if(v&&=v(e,r)){dr(s,v,n,i);break a}y&&y(e,c,r),e===`focusout`&&r&&c.type===`number`&&r.memoizedProps.value!=null&&Yt(c,`number`,c.value)}switch(y=r?Dt(r):window,e){case`focusin`:(ur(y)||y.contentEditable===`true`)&&(Ir=y,Lr=r,Rr=null);break;case`focusout`:Rr=Lr=Ir=null;break;case`mousedown`:zr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:zr=!1,Br(s,n,i);break;case`selectionchange`:if(Fr)break;case`keydown`:case`keyup`:Br(s,n,i)}var b;if(Qn)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else or?ir(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(tr&&n.locale!==`ko`&&(or||x!==`onCompositionStart`?x===`onCompositionEnd`&&or&&(b=xn()):(vn=i,yn=`value`in vn?vn.value:vn.textContent,or=!0)),y=Ed(r,x),0<y.length&&(x=new zn(x,e,null,n,i),s.push({event:x,listeners:y}),b?x.data=b:(b=ar(n),b!==null&&(x.data=b)))),(b=er?sr(e,n):cr(e,n))&&(x=Ed(r,`onBeforeInput`),0<x.length&&(y=new zn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:y,listeners:x}),y.data=b)),md(s,e,r,n,i)}yd(s,t)})}function Td(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ed(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=j(e,n),i!=null&&r.unshift(Td(e,i,a)),i=j(e,t),i!=null&&r.push(Td(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Dd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Od(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=j(n,a),l!=null&&o.unshift(Td(n,l,c))):i||(l=j(n,a),l!=null&&o.push(Td(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var kd=/\r\n?/g,Ad=/\u0000|\uFFFD/g;function jd(e){return(typeof e==`string`?e:``+e).replace(kd,`
`).replace(Ad,``)}function Md(e,t){return t=jd(t),jd(e)===t}function $(e,t,n,r,a,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||$t(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&$t(e,``+r);break;case`className`:Lt(e,`class`,r);break;case`tabIndex`:Lt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Lt(e,n,r);break;case`style`:nn(e,r,o);break;case`data`:if(t!==`object`){Lt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=sn(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}else typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,a.name,a,null),$(e,t,`formEncType`,a.formEncType,a,null),$(e,t,`formMethod`,a.formMethod,a,null),$(e,t,`formTarget`,a.formTarget,a,null)):($(e,t,`encType`,a.encType,a,null),$(e,t,`method`,a.method,a,null),$(e,t,`target`,a.target,a,null)));if(r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=sn(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=cn);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=sn(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),It(e,`popover`,r);break;case`xlinkActuate`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Rt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Rt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:It(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=an.get(n)||n,It(e,n,r))}}function Nd(e,t,n,r,a,o){switch(n){case`style`:nn(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?$t(e,r):(typeof r==`number`||typeof r==`bigint`)&&$t(e,``+r);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=cn);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!At.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),t=n.slice(2,a?n.length-7:void 0),o=e[_t]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,a),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,a);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):It(e,n,r)}}}function Pd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,o,s,n,null)}}a&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:$(e,t,r,d,n,null)}}Jt(e,o,c,l,u,s,a,!1);return;case`select`:for(a in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Xt(e,!!r,n,!0):Xt(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:$(e,t,s,c,n,null)}Qt(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<_d.length;r++)Q(_d[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,u,r,n,null)}return;default:if(rn(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Nd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}function Fd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:a=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}qt(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&$(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Xt(e,!!n,n?[]:``,!1):Xt(e,!!n,t,!0)):Xt(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:p=a;break;case`defaultValue`:m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&$(e,t,s,a,r,o)}Zt(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(rn(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Nd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Nd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function Id(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ld(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Id(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Id(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Rd=null,zd=null;function Bd(e){return e.nodeType===9?e:e.ownerDocument}function Vd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Hd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Ud(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Wd=null;function Gd(){var e=window.event;return e&&e.type===`popstate`?e===Wd?!1:(Wd=e,!0):(Wd=null,!1)}var Kd=typeof setTimeout==`function`?setTimeout:void 0,qd=typeof clearTimeout==`function`?clearTimeout:void 0,Jd=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:Jd===void 0?Kd:function(e){return Jd.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[Ct]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body);n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8)if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++;n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),wt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r)if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e;else if(!e[Ct])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Bd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);wt(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=D.d;D.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=Su();return e||t}function yf(e){var t=Et(e);t!==null&&t.tag===5&&t.type===`form`?Os(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=Kt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Pd(t,`link`,e),Ot(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+Kt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+Kt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+Kt(n.imageSizes)+`"]`)):i+=`[href="`+Kt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=m({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),Pd(t,`link`,e),Ot(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+Kt(r)+`"][href="`+Kt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=m({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),Pd(r,`link`,e),Ot(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=k(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=m({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);Ot(c),Pd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=k(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),Ot(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=k(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),Ot(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var a=(a=_e.current)?gf(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=k(a).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var o=k(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(jf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),o||Nf(a,e,n,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=k(a).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Af(e){return`href="`+Kt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return m({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Pd(t,`link`,n),Ot(t),e.head.appendChild(t))}function Pf(e){return`[src="`+Kt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+Kt(n.href)+`"]`);if(r)return t.instance=r,Ot(r),r;var a=m({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),Ot(r),Pd(r,`style`,a),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Af(n.href);var o=e.querySelector(jf(a));if(o)return t.state.loading|=4,t.instance=o,Ot(o),o;r=Mf(n),(a=mf.get(a))&&Rf(r,a),o=(e.ownerDocument||e).createElement(`link`),Ot(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),Pd(o,`link`,r),t.state.loading|=4,Lf(o,n.precedence,e),t.instance=o;case`script`:return o=Pf(n.src),(a=e.querySelector(Ff(o)))?(t.instance=a,Ot(a),a):(r=n,(a=mf.get(o))&&(r=m({},n),zf(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),Ot(a),Pd(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[Ct]||a[gt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,Ot(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),Ot(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Pd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Ld());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:C,Provider:null,Consumer:null,_currentValue:ue,_currentValue2:ue,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=at(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=at(0),this.hiddenUpdates=at(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=fi(3,null,null,t),e.current=a,a.stateNode=e,t=da(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},Ua(a),e}function tp(e){return e?(e=ui,e):ui}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=Ga(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=Ka(e,r,t),n!==null&&(J(n,e,t),qa(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=si(e,67108864);t!==null&&J(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=gu();t=dt(t);var n=si(e,t);n!==null&&J(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=E.T;E.T=null;var a=D.p;try{D.p=2,up(e,t,n,r)}finally{D.p=a,E.T=i}}function lp(e,t,n,r){var i=E.T;E.T=null;var a=D.p;try{D.p=8,up(e,t,n,r)}finally{D.p=a,E.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)wd(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=Et(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=et(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-qe(o);s.entanglements[1]|=c,o&=~c}rd(a),!(H&6)&&(au=Fe()+500,id(0,!1))}}break;case 31:case 13:s=si(a,2),s!==null&&J(s,a,2),Su(),ip(a,2)}if(a=dp(r),a===null&&wd(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else wd(e,t,r,null,n)}}function dp(e){return e=un(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=Tt(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Ie()){case Le:return 2;case Re:return 8;case ze:case Be:return 32;case Ve:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=Et(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=Tt(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,mt(e.priority,function(){op(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,mt(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ln=r,n.target.dispatchEvent(r),ln=null}else return t=Et(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=Et(n);a!==null&&(e.splice(t,3),t-=3,Es(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[_t]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[_t]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;np(n,gu(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),Su(),t[vt]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=pt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=n.version;if(Lp!==`19.2.6`)throw Error(i(527,Lp,`19.2.6`));D.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:f(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.6`,rendererPackageName:`react-dom`,currentDispatcherRef:E,reconcilerVersion:`19.2.6`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{We=zp.inject(Rp),Ge=zp}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=Ys,s=Xs,c=Zs;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,o,s,c,Pp),e[vt]=t.current,Sd(e),new Fp(t)}})),_=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()})),v=o(((e,t)=>{(function(){var n,r=`4.18.1`,i=200,a=`Unsupported core-js use. Try https://npms.io/search?q=ponyfill.`,o=`Expected a function`,s="Invalid `variable` option passed into `_.template`",c="Invalid `imports` option passed into `_.template`",l=`__lodash_hash_undefined__`,u=500,d=`__lodash_placeholder__`,f=1,p=2,m=4,h=1,g=2,_=1,v=2,y=4,b=8,x=16,S=32,C=64,w=128,ee=256,te=512,T=30,ne=`...`,re=800,ie=16,ae=1,oe=2,se=3,ce=1/0,le=9007199254740991,E=17976931348623157e292,D=NaN,ue=4294967295,de=ue-1,fe=ue>>>1,pe=[[`ary`,w],[`bind`,_],[`bindKey`,v],[`curry`,b],[`curryRight`,x],[`flip`,te],[`partial`,S],[`partialRight`,C],[`rearg`,ee]],me=`[object Arguments]`,O=`[object Array]`,he=`[object AsyncFunction]`,ge=`[object Boolean]`,_e=`[object Date]`,ve=`[object DOMException]`,ye=`[object Error]`,be=`[object Function]`,xe=`[object GeneratorFunction]`,Se=`[object Map]`,Ce=`[object Number]`,we=`[object Null]`,Te=`[object Object]`,Ee=`[object Promise]`,De=`[object Proxy]`,Oe=`[object RegExp]`,ke=`[object Set]`,Ae=`[object String]`,je=`[object Symbol]`,Me=`[object Undefined]`,Ne=`[object WeakMap]`,Pe=`[object WeakSet]`,Fe=`[object ArrayBuffer]`,Ie=`[object DataView]`,Le=`[object Float32Array]`,Re=`[object Float64Array]`,ze=`[object Int8Array]`,Be=`[object Int16Array]`,Ve=`[object Int32Array]`,He=`[object Uint8Array]`,Ue=`[object Uint8ClampedArray]`,We=`[object Uint16Array]`,Ge=`[object Uint32Array]`,Ke=/\b__p \+= '';/g,qe=/\b(__p \+=) '' \+/g,Je=/(__e\(.*?\)|\b__t\)) \+\n'';/g,Ye=/&(?:amp|lt|gt|quot|#39);/g,Xe=/[&<>"']/g,Ze=RegExp(Ye.source),Qe=RegExp(Xe.source),$e=/<%-([\s\S]+?)%>/g,et=/<%([\s\S]+?)%>/g,tt=/<%=([\s\S]+?)%>/g,nt=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,rt=/^\w*$/,it=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,at=/[\\^$.*+?()[\]{}|]/g,ot=RegExp(at.source),st=/^\s+/,ct=/\s/,lt=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,ut=/\{\n\/\* \[wrapped with (.+)\] \*/,dt=/,? & /,ft=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,pt=/[()=,{}\[\]\/\s]/,mt=/\\(\\)?/g,ht=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,gt=/\w*$/,_t=/^[-+]0x[0-9a-f]+$/i,vt=/^0b[01]+$/i,yt=/^\[object .+?Constructor\]$/,bt=/^0o[0-7]+$/i,xt=/^(?:0|[1-9]\d*)$/,St=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Ct=/($^)/,wt=/['\n\r\u2028\u2029\\]/g,Tt=`\\ud800-\\udfff`,Et=`\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff`,Dt=`\\u2700-\\u27bf`,k=`a-z\\xdf-\\xf6\\xf8-\\xff`,Ot=`\\xac\\xb1\\xd7\\xf7`,kt=`\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf`,At=`\\u2000-\\u206f`,jt=` \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000`,Mt=`A-Z\\xc0-\\xd6\\xd8-\\xde`,Nt=`\\ufe0e\\ufe0f`,Pt=Ot+kt+At+jt,Ft=`['’]`,A=`[`+Tt+`]`,It=`[`+Pt+`]`,Lt=`[`+Et+`]`,Rt=`\\d+`,zt=`[`+Dt+`]`,Bt=`[`+k+`]`,Vt=`[^`+Tt+Pt+Rt+Dt+k+Mt+`]`,Ht=`\\ud83c[\\udffb-\\udfff]`,Ut=`(?:`+Lt+`|`+Ht+`)`,Wt=`[^`+Tt+`]`,Gt=`(?:\\ud83c[\\udde6-\\uddff]){2}`,Kt=`[\\ud800-\\udbff][\\udc00-\\udfff]`,qt=`[`+Mt+`]`,Jt=`\\u200d`,Yt=`(?:`+Bt+`|`+Vt+`)`,Xt=`(?:`+qt+`|`+Vt+`)`,Zt=`(?:`+Ft+`(?:d|ll|m|re|s|t|ve))?`,Qt=`(?:`+Ft+`(?:D|LL|M|RE|S|T|VE))?`,$t=Ut+`?`,en=`[`+Nt+`]?`,tn=`(?:`+Jt+`(?:`+[Wt,Gt,Kt].join(`|`)+`)`+en+$t+`)*`,nn=`\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])`,rn=`\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])`,an=en+$t+tn,on=`(?:`+[zt,Gt,Kt].join(`|`)+`)`+an,sn=`(?:`+[Wt+Lt+`?`,Lt,Gt,Kt,A].join(`|`)+`)`,cn=RegExp(Ft,`g`),ln=RegExp(Lt,`g`),un=RegExp(Ht+`(?=`+Ht+`)|`+sn+an,`g`),dn=RegExp([qt+`?`+Bt+`+`+Zt+`(?=`+[It,qt,`$`].join(`|`)+`)`,Xt+`+`+Qt+`(?=`+[It,qt+Yt,`$`].join(`|`)+`)`,qt+`?`+Yt+`+`+Zt,qt+`+`+Qt,rn,nn,Rt,on].join(`|`),`g`),fn=RegExp(`[`+Jt+Tt+Et+Nt+`]`),pn=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,mn=`Array.Buffer.DataView.Date.Error.Float32Array.Float64Array.Function.Int8Array.Int16Array.Int32Array.Map.Math.Object.Promise.RegExp.Set.String.Symbol.TypeError.Uint8Array.Uint8ClampedArray.Uint16Array.Uint32Array.WeakMap._.clearTimeout.isFinite.parseInt.setTimeout`.split(`.`),hn=-1,j={};j[Le]=j[Re]=j[ze]=j[Be]=j[Ve]=j[He]=j[Ue]=j[We]=j[Ge]=!0,j[me]=j[O]=j[Fe]=j[ge]=j[Ie]=j[_e]=j[ye]=j[be]=j[Se]=j[Ce]=j[Te]=j[Oe]=j[ke]=j[Ae]=j[Ne]=!1;var M={};M[me]=M[O]=M[Fe]=M[Ie]=M[ge]=M[_e]=M[Le]=M[Re]=M[ze]=M[Be]=M[Ve]=M[Se]=M[Ce]=M[Te]=M[Oe]=M[ke]=M[Ae]=M[je]=M[He]=M[Ue]=M[We]=M[Ge]=!0,M[ye]=M[be]=M[Ne]=!1;var gn={À:`A`,Á:`A`,Â:`A`,Ã:`A`,Ä:`A`,Å:`A`,à:`a`,á:`a`,â:`a`,ã:`a`,ä:`a`,å:`a`,Ç:`C`,ç:`c`,Ð:`D`,ð:`d`,È:`E`,É:`E`,Ê:`E`,Ë:`E`,è:`e`,é:`e`,ê:`e`,ë:`e`,Ì:`I`,Í:`I`,Î:`I`,Ï:`I`,ì:`i`,í:`i`,î:`i`,ï:`i`,Ñ:`N`,ñ:`n`,Ò:`O`,Ó:`O`,Ô:`O`,Õ:`O`,Ö:`O`,Ø:`O`,ò:`o`,ó:`o`,ô:`o`,õ:`o`,ö:`o`,ø:`o`,Ù:`U`,Ú:`U`,Û:`U`,Ü:`U`,ù:`u`,ú:`u`,û:`u`,ü:`u`,Ý:`Y`,ý:`y`,ÿ:`y`,Æ:`Ae`,æ:`ae`,Þ:`Th`,þ:`th`,ß:`ss`,Ā:`A`,Ă:`A`,Ą:`A`,ā:`a`,ă:`a`,ą:`a`,Ć:`C`,Ĉ:`C`,Ċ:`C`,Č:`C`,ć:`c`,ĉ:`c`,ċ:`c`,č:`c`,Ď:`D`,Đ:`D`,ď:`d`,đ:`d`,Ē:`E`,Ĕ:`E`,Ė:`E`,Ę:`E`,Ě:`E`,ē:`e`,ĕ:`e`,ė:`e`,ę:`e`,ě:`e`,Ĝ:`G`,Ğ:`G`,Ġ:`G`,Ģ:`G`,ĝ:`g`,ğ:`g`,ġ:`g`,ģ:`g`,Ĥ:`H`,Ħ:`H`,ĥ:`h`,ħ:`h`,Ĩ:`I`,Ī:`I`,Ĭ:`I`,Į:`I`,İ:`I`,ĩ:`i`,ī:`i`,ĭ:`i`,į:`i`,ı:`i`,Ĵ:`J`,ĵ:`j`,Ķ:`K`,ķ:`k`,ĸ:`k`,Ĺ:`L`,Ļ:`L`,Ľ:`L`,Ŀ:`L`,Ł:`L`,ĺ:`l`,ļ:`l`,ľ:`l`,ŀ:`l`,ł:`l`,Ń:`N`,Ņ:`N`,Ň:`N`,Ŋ:`N`,ń:`n`,ņ:`n`,ň:`n`,ŋ:`n`,Ō:`O`,Ŏ:`O`,Ő:`O`,ō:`o`,ŏ:`o`,ő:`o`,Ŕ:`R`,Ŗ:`R`,Ř:`R`,ŕ:`r`,ŗ:`r`,ř:`r`,Ś:`S`,Ŝ:`S`,Ş:`S`,Š:`S`,ś:`s`,ŝ:`s`,ş:`s`,š:`s`,Ţ:`T`,Ť:`T`,Ŧ:`T`,ţ:`t`,ť:`t`,ŧ:`t`,Ũ:`U`,Ū:`U`,Ŭ:`U`,Ů:`U`,Ű:`U`,Ų:`U`,ũ:`u`,ū:`u`,ŭ:`u`,ů:`u`,ű:`u`,ų:`u`,Ŵ:`W`,ŵ:`w`,Ŷ:`Y`,ŷ:`y`,Ÿ:`Y`,Ź:`Z`,Ż:`Z`,Ž:`Z`,ź:`z`,ż:`z`,ž:`z`,Ĳ:`IJ`,ĳ:`ij`,Œ:`Oe`,œ:`oe`,ŉ:`'n`,ſ:`s`},_n={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`},vn={"&amp;":`&`,"&lt;":`<`,"&gt;":`>`,"&quot;":`"`,"&#39;":`'`},yn={"\\":`\\`,"'":`'`,"\n":`n`,"\r":`r`,"\u2028":`u2028`,"\u2029":`u2029`},bn=parseFloat,xn=parseInt,Sn=typeof global==`object`&&global&&global.Object===Object&&global,Cn=typeof self==`object`&&self&&self.Object===Object&&self,wn=Sn||Cn||Function(`return this`)(),Tn=typeof e==`object`&&e&&!e.nodeType&&e,En=Tn&&typeof t==`object`&&t&&!t.nodeType&&t,Dn=En&&En.exports===Tn,On=Dn&&Sn.process,kn=function(){try{return En&&En.require&&En.require(`util`).types||On&&On.binding&&On.binding(`util`)}catch{}}(),An=kn&&kn.isArrayBuffer,jn=kn&&kn.isDate,Mn=kn&&kn.isMap,Nn=kn&&kn.isRegExp,Pn=kn&&kn.isSet,Fn=kn&&kn.isTypedArray;function In(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}function Ln(e,t,n,r){for(var i=-1,a=e==null?0:e.length;++i<a;){var o=e[i];t(r,o,n(o),e)}return r}function Rn(e,t){for(var n=-1,r=e==null?0:e.length;++n<r&&t(e[n],n,e)!==!1;);return e}function zn(e,t){for(var n=e==null?0:e.length;n--&&t(e[n],n,e)!==!1;);return e}function Bn(e,t){for(var n=-1,r=e==null?0:e.length;++n<r;)if(!t(e[n],n,e))return!1;return!0}function Vn(e,t){for(var n=-1,r=e==null?0:e.length,i=0,a=[];++n<r;){var o=e[n];t(o,n,e)&&(a[i++]=o)}return a}function Hn(e,t){return!!(e!=null&&e.length)&&er(e,t,0)>-1}function Un(e,t,n){for(var r=-1,i=e==null?0:e.length;++r<i;)if(n(t,e[r]))return!0;return!1}function Wn(e,t){for(var n=-1,r=e==null?0:e.length,i=Array(r);++n<r;)i[n]=t(e[n],n,e);return i}function Gn(e,t){for(var n=-1,r=t.length,i=e.length;++n<r;)e[i+n]=t[n];return e}function Kn(e,t,n,r){var i=-1,a=e==null?0:e.length;for(r&&a&&(n=e[++i]);++i<a;)n=t(n,e[i],i,e);return n}function qn(e,t,n,r){var i=e==null?0:e.length;for(r&&i&&(n=e[--i]);i--;)n=t(n,e[i],i,e);return n}function Jn(e,t){for(var n=-1,r=e==null?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}var Yn=ir(`length`);function Xn(e){return e.split(``)}function Zn(e){return e.match(ft)||[]}function Qn(e,t,n){var r;return n(e,function(e,n,i){if(t(e,n,i))return r=n,!1}),r}function $n(e,t,n,r){for(var i=e.length,a=n+(r?1:-1);r?a--:++a<i;)if(t(e[a],a,e))return a;return-1}function er(e,t,n){return t===t?Ar(e,t,n):$n(e,nr,n)}function tr(e,t,n,r){for(var i=n-1,a=e.length;++i<a;)if(r(e[i],t))return i;return-1}function nr(e){return e!==e}function rr(e,t){var n=e==null?0:e.length;return n?cr(e,t)/n:D}function ir(e){return function(t){return t==null?n:t[e]}}function ar(e){return function(t){return e==null?n:e[t]}}function or(e,t,n,r,i){return i(e,function(e,i,a){n=r?(r=!1,e):t(n,e,i,a)}),n}function sr(e,t){var n=e.length;for(e.sort(t);n--;)e[n]=e[n].value;return e}function cr(e,t){for(var r,i=-1,a=e.length;++i<a;){var o=t(e[i]);o!==n&&(r=r===n?o:r+o)}return r}function lr(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}function ur(e,t){return Wn(t,function(t){return[t,e[t]]})}function dr(e){return e&&e.slice(0,Pr(e)+1).replace(st,``)}function fr(e){return function(t){return e(t)}}function pr(e,t){return Wn(t,function(t){return e[t]})}function mr(e,t){return e.has(t)}function hr(e,t){for(var n=-1,r=e.length;++n<r&&er(t,e[n],0)>-1;);return n}function gr(e,t){for(var n=e.length;n--&&er(t,e[n],0)>-1;);return n}function _r(e,t){for(var n=e.length,r=0;n--;)e[n]===t&&++r;return r}var vr=ar(gn),yr=ar(_n);function br(e){return`\\`+yn[e]}function xr(e,t){return e==null?n:e[t]}function Sr(e){return fn.test(e)}function Cr(e){return pn.test(e)}function wr(e){for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n}function Tr(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function Er(e,t){return function(n){return e(t(n))}}function Dr(e,t){for(var n=-1,r=e.length,i=0,a=[];++n<r;){var o=e[n];(o===t||o===d)&&(e[n]=d,a[i++]=n)}return a}function Or(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}function kr(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=[e,e]}),n}function Ar(e,t,n){for(var r=n-1,i=e.length;++r<i;)if(e[r]===t)return r;return-1}function jr(e,t,n){for(var r=n+1;r--;)if(e[r]===t)return r;return r}function Mr(e){return Sr(e)?Ir(e):Yn(e)}function Nr(e){return Sr(e)?Lr(e):Xn(e)}function Pr(e){for(var t=e.length;t--&&ct.test(e.charAt(t)););return t}var Fr=ar(vn);function Ir(e){for(var t=un.lastIndex=0;un.test(e);)++t;return t}function Lr(e){return e.match(un)||[]}function Rr(e){return e.match(dn)||[]}var zr=(function e(t){t=t==null?wn:zr.defaults(wn.Object(),t,zr.pick(wn,mn));var ct=t.Array,ft=t.Date,Tt=t.Error,Et=t.Function,Dt=t.Math,k=t.Object,Ot=t.RegExp,kt=t.String,At=t.TypeError,jt=ct.prototype,Mt=Et.prototype,Nt=k.prototype,Pt=t[`__core-js_shared__`],Ft=Mt.toString,A=Nt.hasOwnProperty,It=0,Lt=function(){var e=/[^.]+$/.exec(Pt&&Pt.keys&&Pt.keys.IE_PROTO||``);return e?`Symbol(src)_1.`+e:``}(),Rt=Nt.toString,zt=Ft.call(k),Bt=wn._,Vt=Ot(`^`+Ft.call(A).replace(at,`\\$&`).replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,`$1.*?`)+`$`),Ht=Dn?t.Buffer:n,Ut=t.Symbol,Wt=t.Uint8Array,Gt=Ht?Ht.allocUnsafe:n,Kt=Er(k.getPrototypeOf,k),qt=k.create,Jt=Nt.propertyIsEnumerable,Yt=jt.splice,Xt=Ut?Ut.isConcatSpreadable:n,Zt=Ut?Ut.iterator:n,Qt=Ut?Ut.toStringTag:n,$t=function(){try{var e=os(k,`defineProperty`);return e({},``,{}),e}catch{}}(),en=t.clearTimeout!==wn.clearTimeout&&t.clearTimeout,tn=ft&&ft.now!==wn.Date.now&&ft.now,nn=t.setTimeout!==wn.setTimeout&&t.setTimeout,rn=Dt.ceil,an=Dt.floor,on=k.getOwnPropertySymbols,sn=Ht?Ht.isBuffer:n,un=t.isFinite,dn=jt.join,fn=Er(k.keys,k),pn=Dt.max,gn=Dt.min,_n=ft.now,vn=t.parseInt,yn=Dt.random,Sn=jt.reverse,Cn=os(t,`DataView`),Tn=os(t,`Map`),En=os(t,`Promise`),On=os(t,`Set`),kn=os(t,`WeakMap`),Yn=os(k,`create`),Xn=kn&&new kn,ar={},Ar=Gs(Cn),Ir=Gs(Tn),Lr=Gs(En),Br=Gs(On),Vr=Gs(kn),Hr=Ut?Ut.prototype:n,Ur=Hr?Hr.valueOf:n,Wr=Hr?Hr.toString:n;function N(e){if(ju(e)&&!q(e)&&!(e instanceof P)){if(e instanceof qr)return e;if(A.call(e,`__wrapped__`))return qs(e)}return new qr(e)}var Gr=function(){function e(){}return function(t){if(!Au(t))return{};if(qt)return qt(t);e.prototype=t;var r=new e;return e.prototype=n,r}}();function Kr(){}function qr(e,t){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=n}N.templateSettings={escape:$e,evaluate:et,interpolate:tt,variable:``,imports:{_:N}},N.prototype=Kr.prototype,N.prototype.constructor=N,qr.prototype=Gr(Kr.prototype),qr.prototype.constructor=qr;function P(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=ue,this.__views__=[]}function Jr(){var e=new P(this.__wrapped__);return e.__actions__=yo(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=yo(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=yo(this.__views__),e}function Yr(){if(this.__filtered__){var e=new P(this);e.__dir__=-1,e.__filtered__=!0}else e=this.clone(),e.__dir__*=-1;return e}function Xr(){var e=this.__wrapped__.value(),t=this.__dir__,n=q(e),r=t<0,i=n?e.length:0,a=ds(0,i,this.__views__),o=a.start,s=a.end,c=s-o,l=r?s:o-1,u=this.__iteratees__,d=u.length,f=0,p=gn(c,this.__takeCount__);if(!n||!r&&i==c&&p==c)return to(e,this.__actions__);var m=[];outer:for(;c--&&f<p;){l+=t;for(var h=-1,g=e[l];++h<d;){var _=u[h],v=_.iteratee,y=_.type,b=v(g);if(y==oe)g=b;else if(!b){if(y==ae)continue outer;break outer}}m[f++]=g}return m}P.prototype=Gr(Kr.prototype),P.prototype.constructor=P;function Zr(e){var t=-1,n=e==null?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Qr(){this.__data__=Yn?Yn(null):{},this.size=0}function $r(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=+!!t,t}function ei(e){var t=this.__data__;if(Yn){var r=t[e];return r===l?n:r}return A.call(t,e)?t[e]:n}function ti(e){var t=this.__data__;return Yn?t[e]!==n:A.call(t,e)}function ni(e,t){var r=this.__data__;return this.size+=+!this.has(e),r[e]=Yn&&t===n?l:t,this}Zr.prototype.clear=Qr,Zr.prototype.delete=$r,Zr.prototype.get=ei,Zr.prototype.has=ti,Zr.prototype.set=ni;function ri(e){var t=-1,n=e==null?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function ii(){this.__data__=[],this.size=0}function ai(e){var t=this.__data__,n=Ai(t,e);return n<0?!1:(n==t.length-1?t.pop():Yt.call(t,n,1),--this.size,!0)}function oi(e){var t=this.__data__,r=Ai(t,e);return r<0?n:t[r][1]}function si(e){return Ai(this.__data__,e)>-1}function ci(e,t){var n=this.__data__,r=Ai(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}ri.prototype.clear=ii,ri.prototype.delete=ai,ri.prototype.get=oi,ri.prototype.has=si,ri.prototype.set=ci;function li(e){var t=-1,n=e==null?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function ui(){this.size=0,this.__data__={hash:new Zr,map:new(Tn||ri),string:new Zr}}function di(e){var t=is(this,e).delete(e);return this.size-=+!!t,t}function fi(e){return is(this,e).get(e)}function pi(e){return is(this,e).has(e)}function mi(e,t){var n=is(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this}li.prototype.clear=ui,li.prototype.delete=di,li.prototype.get=fi,li.prototype.has=pi,li.prototype.set=mi;function hi(e){var t=-1,n=e==null?0:e.length;for(this.__data__=new li;++t<n;)this.add(e[t])}function gi(e){return this.__data__.set(e,l),this}function _i(e){return this.__data__.has(e)}hi.prototype.add=hi.prototype.push=gi,hi.prototype.has=_i;function vi(e){var t=this.__data__=new ri(e);this.size=t.size}function yi(){this.__data__=new ri,this.size=0}function bi(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}function xi(e){return this.__data__.get(e)}function Si(e){return this.__data__.has(e)}function Ci(e,t){var n=this.__data__;if(n instanceof ri){var r=n.__data__;if(!Tn||r.length<i-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new li(r)}return n.set(e,t),this.size=n.size,this}vi.prototype.clear=yi,vi.prototype.delete=bi,vi.prototype.get=xi,vi.prototype.has=Si,vi.prototype.set=Ci;function wi(e,t){var n=q(e),r=!n&&hu(e),i=!n&&!r&&yu(e),a=!n&&!r&&!i&&Ku(e),o=n||r||i||a,s=o?lr(e.length,kt):[],c=s.length;for(var l in e)(t||A.call(e,l))&&!(o&&(l==`length`||i&&(l==`offset`||l==`parent`)||a&&(l==`buffer`||l==`byteLength`||l==`byteOffset`)||ys(l,c)))&&s.push(l);return s}function Ti(e){var t=e.length;return t?e[Fa(0,t-1)]:n}function Ei(e,t){return Hs(yo(e),Ii(t,0,e.length))}function Di(e){return Hs(yo(e))}function Oi(e,t,r){(r!==n&&!fu(e[t],r)||r===n&&!(t in e))&&Pi(e,t,r)}function ki(e,t,r){var i=e[t];(!(A.call(e,t)&&fu(i,r))||r===n&&!(t in e))&&Pi(e,t,r)}function Ai(e,t){for(var n=e.length;n--;)if(fu(e[n][0],t))return n;return-1}function ji(e,t,n,r){return Bi(e,function(e,i,a){t(r,e,n(e),a)}),r}function Mi(e,t){return e&&bo(t,wd(t),e)}function Ni(e,t){return e&&bo(t,Td(t),e)}function Pi(e,t,n){t==`__proto__`&&$t?$t(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}function Fi(e,t){for(var r=-1,i=t.length,a=ct(i),o=e==null;++r<i;)a[r]=o?n:yd(e,t[r]);return a}function Ii(e,t,r){return e===e&&(r!==n&&(e=e<=r?e:r),t!==n&&(e=e>=t?e:t)),e}function F(e,t,r,i,a,o){var s,c=t&f,l=t&p,u=t&m;if(r&&(s=a?r(e,i,a,o):r(e)),s!==n)return s;if(!Au(e))return e;var d=q(e);if(d){if(s=ms(e),!c)return yo(e,s)}else{var h=us(e),g=h==be||h==xe;if(yu(e))return uo(e,c);if(h==Te||h==me||g&&!a){if(s=l||g?{}:hs(e),!c)return l?So(e,Ni(s,e)):xo(e,Mi(s,e))}else{if(!M[h])return a?e:{};s=gs(e,h,c)}}o||=new vi;var _=o.get(e);if(_)return _;o.set(e,s),Uu(e)?e.forEach(function(n){s.add(F(n,t,r,n,e,o))}):Mu(e)&&e.forEach(function(n,i){s.set(i,F(n,t,r,i,e,o))});var v=d?n:(u?l?es:$o:l?Td:wd)(e);return Rn(v||e,function(n,i){v&&(i=n,n=e[i]),ki(s,i,F(n,t,r,i,e,o))}),s}function Li(e){var t=wd(e);return function(n){return I(n,e,t)}}function I(e,t,r){var i=r.length;if(e==null)return!i;for(e=k(e);i--;){var a=r[i],o=t[a],s=e[a];if(s===n&&!(a in e)||!o(s))return!1}return!0}function Ri(e,t,r){if(typeof e!=`function`)throw new At(o);return Rs(function(){e.apply(n,r)},t)}function zi(e,t,n,r){var a=-1,o=Hn,s=!0,c=e.length,l=[],u=t.length;if(!c)return l;n&&(t=Wn(t,fr(n))),r?(o=Un,s=!1):t.length>=i&&(o=mr,s=!1,t=new hi(t));outer:for(;++a<c;){var d=e[a],f=n==null?d:n(d);if(d=r||d!==0?d:0,s&&f===f){for(var p=u;p--;)if(t[p]===f)continue outer;l.push(d)}else o(t,f,r)||l.push(d)}return l}var Bi=wo(Yi),Vi=wo(Xi,!0);function Hi(e,t){var n=!0;return Bi(e,function(e,r,i){return n=!!t(e,r,i),n}),n}function Ui(e,t,r){for(var i=-1,a=e.length;++i<a;){var o=e[i],s=t(o);if(s!=null&&(c===n?s===s&&!Gu(s):r(s,c)))var c=s,l=o}return l}function Wi(e,t,r,i){var a=e.length;for(r=X(r),r<0&&(r=-r>a?0:a+r),i=i===n||i>a?a:X(i),i<0&&(i+=a),i=r>i?0:$u(i);r<i;)e[r++]=t;return e}function Gi(e,t){var n=[];return Bi(e,function(e,r,i){t(e,r,i)&&n.push(e)}),n}function Ki(e,t,n,r,i){var a=-1,o=e.length;for(n||=vs,i||=[];++a<o;){var s=e[a];t>0&&n(s)?t>1?Ki(s,t-1,n,r,i):Gn(i,s):r||(i[i.length]=s)}return i}var qi=To(),Ji=To(!0);function Yi(e,t){return e&&qi(e,t,wd)}function Xi(e,t){return e&&Ji(e,t,wd)}function Zi(e,t){return Vn(t,function(t){return Du(e[t])})}function Qi(e,t){t=oo(t,e);for(var r=0,i=t.length;e!=null&&r<i;)e=e[Ws(t[r++])];return r&&r==i?e:n}function $i(e,t,n){var r=t(e);return q(e)?r:Gn(r,n(e))}function ea(e){return e==null?e===n?Me:we:Qt&&Qt in k(e)?ss(e):Ms(e)}function ta(e,t){return e>t}function na(e,t){return e!=null&&A.call(e,t)}function ra(e,t){return e!=null&&t in k(e)}function ia(e,t,n){return e>=gn(t,n)&&e<pn(t,n)}function aa(e,t,r){for(var i=r?Un:Hn,a=e[0].length,o=e.length,s=o,c=ct(o),l=1/0,u=[];s--;){var d=e[s];s&&t&&(d=Wn(d,fr(t))),l=gn(d.length,l),c[s]=!r&&(t||a>=120&&d.length>=120)?new hi(s&&d):n}d=e[0];var f=-1,p=c[0];outer:for(;++f<a&&u.length<l;){var m=d[f],h=t?t(m):m;if(m=r||m!==0?m:0,!(p?mr(p,h):i(u,h,r))){for(s=o;--s;){var g=c[s];if(!(g?mr(g,h):i(e[s],h,r)))continue outer}p&&p.push(h),u.push(m)}}return u}function oa(e,t,n,r){return Yi(e,function(e,i,a){t(r,n(e),i,a)}),r}function sa(e,t,r){t=oo(t,e),e=Ps(e,t);var i=e==null?e:e[Ws(vc(t))];return i==null?n:In(i,e,r)}function ca(e){return ju(e)&&ea(e)==me}function la(e){return ju(e)&&ea(e)==Fe}function ua(e){return ju(e)&&ea(e)==_e}function da(e,t,n,r,i){return e===t?!0:e==null||t==null||!ju(e)&&!ju(t)?e!==e&&t!==t:fa(e,t,n,r,da,i)}function fa(e,t,n,r,i,a){var o=q(e),s=q(t),c=o?O:us(e),l=s?O:us(t);c=c==me?Te:c,l=l==me?Te:l;var u=c==Te,d=l==Te,f=c==l;if(f&&yu(e)){if(!yu(t))return!1;o=!0,u=!1}if(f&&!u)return a||=new vi,o||Ku(e)?Yo(e,t,n,r,i,a):Xo(e,t,c,n,r,i,a);if(!(n&h)){var p=u&&A.call(e,`__wrapped__`),m=d&&A.call(t,`__wrapped__`);if(p||m){var g=p?e.value():e,_=m?t.value():t;return a||=new vi,i(g,_,n,r,a)}}return f?(a||=new vi,Zo(e,t,n,r,i,a)):!1}function pa(e){return ju(e)&&us(e)==Se}function ma(e,t,r,i){var a=r.length,o=a,s=!i;if(e==null)return!o;for(e=k(e);a--;){var c=r[a];if(s&&c[2]?c[1]!==e[c[0]]:!(c[0]in e))return!1}for(;++a<o;){c=r[a];var l=c[0],u=e[l],d=c[1];if(s&&c[2]){if(u===n&&!(l in e))return!1}else{var f=new vi;if(i)var p=i(u,d,l,e,t,f);if(!(p===n?da(d,u,h|g,i,f):p))return!1}}return!0}function ha(e){return!Au(e)||ws(e)?!1:(Du(e)?Vt:yt).test(Gs(e))}function ga(e){return ju(e)&&ea(e)==Oe}function _a(e){return ju(e)&&us(e)==ke}function va(e){return ju(e)&&ku(e.length)&&!!j[ea(e)]}function ya(e){return typeof e==`function`?e:e==null?Mf:typeof e==`object`?q(e)?Ta(e[0],e[1]):wa(e):Gf(e)}function ba(e){if(!Es(e))return fn(e);var t=[];for(var n in k(e))A.call(e,n)&&n!=`constructor`&&t.push(n);return t}function xa(e){if(!Au(e))return js(e);var t=Es(e),n=[];for(var r in e)r==`constructor`&&(t||!A.call(e,r))||n.push(r);return n}function Sa(e,t){return e<t}function Ca(e,t){var n=-1,r=_u(e)?ct(e.length):[];return Bi(e,function(e,i,a){r[++n]=t(e,i,a)}),r}function wa(e){var t=as(e);return t.length==1&&t[0][2]?Os(t[0][0],t[0][1]):function(n){return n===e||ma(n,e,t)}}function Ta(e,t){return xs(e)&&Ds(t)?Os(Ws(e),t):function(r){var i=yd(r,e);return i===n&&i===t?bd(r,e):da(t,i,h|g)}}function Ea(e,t,r,i,a){e!==t&&qi(t,function(o,s){if(a||=new vi,Au(o))Da(e,t,s,r,Ea,i,a);else{var c=i?i(Is(e,s),o,s+``,e,t,a):n;c===n&&(c=o),Oi(e,s,c)}},Td)}function Da(e,t,r,i,a,o,s){var c=Is(e,r),l=Is(t,r),u=s.get(l);if(u){Oi(e,r,u);return}var d=o?o(c,l,r+``,e,t,s):n,f=d===n;if(f){var p=q(l),m=!p&&yu(l),h=!p&&!m&&Ku(l);d=l,p||m||h?q(c)?d=c:J(c)?d=yo(c):m?(f=!1,d=uo(l,!0)):h?(f=!1,d=R(l,!0)):d=[]:Bu(l)||hu(l)?(d=c,hu(c)?d=td(c):(!Au(c)||Du(c))&&(d=hs(l))):f=!1}f&&(s.set(l,d),a(d,l,i,o,s),s.delete(l)),Oi(e,r,d)}function Oa(e,t){var r=e.length;if(r)return t+=t<0?r:0,ys(t,r)?e[t]:n}function ka(e,t,n){t=t.length?Wn(t,function(e){return q(e)?function(t){return Qi(t,e.length===1?e[0]:e)}:e}):[Mf];var r=-1;return t=Wn(t,fr(V())),sr(Ca(e,function(e,n,i){return{criteria:Wn(t,function(t){return t(e)}),index:++r,value:e}}),function(e,t){return go(e,t,n)})}function Aa(e,t){return ja(e,t,function(t,n){return bd(e,n)})}function ja(e,t,n){for(var r=-1,i=t.length,a={};++r<i;){var o=t[r],s=Qi(e,o);n(s,o)&&Ba(a,oo(o,e),s)}return a}function Ma(e){return function(t){return Qi(t,e)}}function Na(e,t,n,r){var i=r?tr:er,a=-1,o=t.length,s=e;for(e===t&&(t=yo(t)),n&&(s=Wn(e,fr(n)));++a<o;)for(var c=0,l=t[a],u=n?n(l):l;(c=i(s,u,c,r))>-1;)s!==e&&Yt.call(s,c,1),Yt.call(e,c,1);return e}function Pa(e,t){for(var n=e?t.length:0,r=n-1;n--;){var i=t[n];if(n==r||i!==a){var a=i;ys(i)?Yt.call(e,i,1):Qa(e,i)}}return e}function Fa(e,t){return e+an(yn()*(t-e+1))}function Ia(e,t,n,r){for(var i=-1,a=pn(rn((t-e)/(n||1)),0),o=ct(a);a--;)o[r?a:++i]=e,e+=n;return o}function La(e,t){var n=``;if(!e||t<1||t>le)return n;do t%2&&(n+=e),t=an(t/2),t&&(e+=e);while(t);return n}function L(e,t){return zs(Ns(e,t,Mf),e+``)}function Ra(e){return Ti(Hd(e))}function za(e,t){var n=Hd(e);return Hs(n,Ii(t,0,n.length))}function Ba(e,t,r,i){if(!Au(e))return e;t=oo(t,e);for(var a=-1,o=t.length,s=o-1,c=e;c!=null&&++a<o;){var l=Ws(t[a]),u=r;if(l===`__proto__`||l===`constructor`||l===`prototype`)return e;if(a!=s){var d=c[l];u=i?i(d,l,c):n,u===n&&(u=Au(d)?d:ys(t[a+1])?[]:{})}ki(c,l,u),c=c[l]}return e}var Va=Xn?function(e,t){return Xn.set(e,t),e}:Mf,Ha=$t?function(e,t){return $t(e,`toString`,{configurable:!0,enumerable:!1,value:Of(t),writable:!0})}:Mf;function Ua(e){return Hs(Hd(e))}function Wa(e,t,n){var r=-1,i=e.length;t<0&&(t=-t>i?0:i+t),n=n>i?i:n,n<0&&(n+=i),i=t>n?0:n-t>>>0,t>>>=0;for(var a=ct(i);++r<i;)a[r]=e[r+t];return a}function Ga(e,t){var n;return Bi(e,function(e,r,i){return n=t(e,r,i),!n}),!!n}function Ka(e,t,n){var r=0,i=e==null?r:e.length;if(typeof t==`number`&&t===t&&i<=fe){for(;r<i;){var a=r+i>>>1,o=e[a];o!==null&&!Gu(o)&&(n?o<=t:o<t)?r=a+1:i=a}return i}return qa(e,t,Mf,n)}function qa(e,t,r,i){var a=0,o=e==null?0:e.length;if(o===0)return 0;t=r(t);for(var s=t!==t,c=t===null,l=Gu(t),u=t===n;a<o;){var d=an((a+o)/2),f=r(e[d]),p=f!==n,m=f===null,h=f===f,g=Gu(f);if(s)var _=i||h;else _=u?h&&(i||p):c?h&&p&&(i||!m):l?h&&p&&!m&&(i||!g):m||g?!1:i?f<=t:f<t;_?a=d+1:o=d}return gn(o,de)}function Ja(e,t){for(var n=-1,r=e.length,i=0,a=[];++n<r;){var o=e[n],s=t?t(o):o;if(!n||!fu(s,c)){var c=s;a[i++]=o===0?0:o}}return a}function Ya(e){return typeof e==`number`?e:Gu(e)?D:+e}function Xa(e){if(typeof e==`string`)return e;if(q(e))return Wn(e,Xa)+``;if(Gu(e))return Wr?Wr.call(e):``;var t=e+``;return t==`0`&&1/e==-ce?`-0`:t}function Za(e,t,n){var r=-1,a=Hn,o=e.length,s=!0,c=[],l=c;if(n)s=!1,a=Un;else if(o>=i){var u=t?null:Uo(e);if(u)return Or(u);s=!1,a=mr,l=new hi}else l=t?[]:c;outer:for(;++r<o;){var d=e[r],f=t?t(d):d;if(d=n||d!==0?d:0,s&&f===f){for(var p=l.length;p--;)if(l[p]===f)continue outer;t&&l.push(f),c.push(d)}else a(l,f,n)||(l!==c&&l.push(f),c.push(d))}return c}function Qa(e,t){t=oo(t,e);var n=-1,r=t.length;if(!r)return!0;for(;++n<r;){var i=Ws(t[n]);if(i===`__proto__`&&!A.call(e,`__proto__`)||(i===`constructor`||i===`prototype`)&&n<r-1)return!1}var a=Ps(e,t);return a==null||delete a[Ws(vc(t))]}function $a(e,t,n,r){return Ba(e,t,n(Qi(e,t)),r)}function eo(e,t,n,r){for(var i=e.length,a=r?i:-1;(r?a--:++a<i)&&t(e[a],a,e););return n?Wa(e,r?0:a,r?a+1:i):Wa(e,r?a+1:0,r?i:a)}function to(e,t){var n=e;return n instanceof P&&(n=n.value()),Kn(t,function(e,t){return t.func.apply(t.thisArg,Gn([e],t.args))},n)}function no(e,t,n){var r=e.length;if(r<2)return r?Za(e[0]):[];for(var i=-1,a=ct(r);++i<r;)for(var o=e[i],s=-1;++s<r;)s!=i&&(a[i]=zi(a[i]||o,e[s],t,n));return Za(Ki(a,1),t,n)}function ro(e,t,r){for(var i=-1,a=e.length,o=t.length,s={};++i<a;){var c=i<o?t[i]:n;r(s,e[i],c)}return s}function io(e){return J(e)?e:[]}function ao(e){return typeof e==`function`?e:Mf}function oo(e,t){return q(e)?e:xs(e,t)?[e]:Us(Z(e))}var so=L;function co(e,t,r){var i=e.length;return r=r===n?i:r,!t&&r>=i?e:Wa(e,t,r)}var lo=en||function(e){return wn.clearTimeout(e)};function uo(e,t){if(t)return e.slice();var n=e.length,r=Gt?Gt(n):new e.constructor(n);return e.copy(r),r}function fo(e){var t=new e.constructor(e.byteLength);return new Wt(t).set(new Wt(e)),t}function po(e,t){var n=t?fo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}function mo(e){var t=new e.constructor(e.source,gt.exec(e));return t.lastIndex=e.lastIndex,t}function ho(e){return Ur?k(Ur.call(e)):{}}function R(e,t){var n=t?fo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}function z(e,t){if(e!==t){var r=e!==n,i=e===null,a=e===e,o=Gu(e),s=t!==n,c=t===null,l=t===t,u=Gu(t);if(!c&&!u&&!o&&e>t||o&&s&&l&&!c&&!u||i&&s&&l||!r&&l||!a)return 1;if(!i&&!o&&!u&&e<t||u&&r&&a&&!i&&!o||c&&r&&a||!s&&a||!l)return-1}return 0}function go(e,t,n){for(var r=-1,i=e.criteria,a=t.criteria,o=i.length,s=n.length;++r<o;){var c=z(i[r],a[r]);if(c)return r>=s?c:c*(n[r]==`desc`?-1:1)}return e.index-t.index}function _o(e,t,n,r){for(var i=-1,a=e.length,o=n.length,s=-1,c=t.length,l=pn(a-o,0),u=ct(c+l),d=!r;++s<c;)u[s]=t[s];for(;++i<o;)(d||i<a)&&(u[n[i]]=e[i]);for(;l--;)u[s++]=e[i++];return u}function vo(e,t,n,r){for(var i=-1,a=e.length,o=-1,s=n.length,c=-1,l=t.length,u=pn(a-s,0),d=ct(u+l),f=!r;++i<u;)d[i]=e[i];for(var p=i;++c<l;)d[p+c]=t[c];for(;++o<s;)(f||i<a)&&(d[p+n[o]]=e[i++]);return d}function yo(e,t){var n=-1,r=e.length;for(t||=ct(r);++n<r;)t[n]=e[n];return t}function bo(e,t,r,i){var a=!r;r||={};for(var o=-1,s=t.length;++o<s;){var c=t[o],l=i?i(r[c],e[c],c,r,e):n;l===n&&(l=e[c]),a?Pi(r,c,l):ki(r,c,l)}return r}function xo(e,t){return bo(e,cs(e),t)}function So(e,t){return bo(e,ls(e),t)}function Co(e,t){return function(n,r){var i=q(n)?Ln:ji,a=t?t():{};return i(n,e,V(r,2),a)}}function B(e){return L(function(t,r){var i=-1,a=r.length,o=a>1?r[a-1]:n,s=a>2?r[2]:n;for(o=e.length>3&&typeof o==`function`?(a--,o):n,s&&bs(r[0],r[1],s)&&(o=a<3?n:o,a=1),t=k(t);++i<a;){var c=r[i];c&&e(t,c,i,o)}return t})}function wo(e,t){return function(n,r){if(n==null)return n;if(!_u(n))return e(n,r);for(var i=n.length,a=t?i:-1,o=k(n);(t?a--:++a<i)&&r(o[a],a,o)!==!1;);return n}}function To(e){return function(t,n,r){for(var i=-1,a=k(t),o=r(t),s=o.length;s--;){var c=o[e?s:++i];if(n(a[c],c,a)===!1)break}return t}}function Eo(e,t,n){var r=t&_,i=ko(e);function a(){return(this&&this!==wn&&this instanceof a?i:e).apply(r?n:this,arguments)}return a}function Do(e){return function(t){t=Z(t);var r=Sr(t)?Nr(t):n,i=r?r[0]:t.charAt(0),a=r?co(r,1).join(``):t.slice(1);return i[e]()+a}}function Oo(e){return function(t){return Kn(Cf(Yd(t).replace(cn,``)),e,``)}}function ko(e){return function(){var t=arguments;switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var n=Gr(e.prototype),r=e.apply(n,t);return Au(r)?r:n}}function Ao(e,t,r){var i=ko(e);function a(){for(var o=arguments.length,s=ct(o),c=o,l=rs(a);c--;)s[c]=arguments[c];var u=o<3&&s[0]!==l&&s[o-1]!==l?[]:Dr(s,l);return o-=u.length,o<r?Vo(e,t,No,a.placeholder,n,s,u,n,n,r-o):In(this&&this!==wn&&this instanceof a?i:e,this,s)}return a}function jo(e){return function(t,r,i){var a=k(t);if(!_u(t)){var o=V(r,3);t=wd(t),r=function(e){return o(a[e],e,a)}}var s=e(t,r,i);return s>-1?a[o?t[s]:s]:n}}function Mo(e){return Qo(function(t){var r=t.length,i=r,a=qr.prototype.thru;for(e&&t.reverse();i--;){var s=t[i];if(typeof s!=`function`)throw new At(o);if(a&&!c&&ns(s)==`wrapper`)var c=new qr([],!0)}for(i=c?i:r;++i<r;){s=t[i];var l=ns(s),u=l==`wrapper`?ts(s):n;c=u&&Cs(u[0])&&u[1]==(w|b|S|ee)&&!u[4].length&&u[9]==1?c[ns(u[0])].apply(c,u[3]):s.length==1&&Cs(s)?c[l]():c.thru(s)}return function(){var e=arguments,n=e[0];if(c&&e.length==1&&q(n))return c.plant(n).value();for(var i=0,a=r?t[i].apply(this,e):n;++i<r;)a=t[i].call(this,a);return a}})}function No(e,t,r,i,a,o,s,c,l,u){var d=t&w,f=t&_,p=t&v,m=t&(b|x),h=t&te,g=p?n:ko(e);function y(){for(var n=arguments.length,_=ct(n),v=n;v--;)_[v]=arguments[v];if(m)var b=rs(y),x=_r(_,b);if(i&&(_=_o(_,i,a,m)),o&&(_=vo(_,o,s,m)),n-=x,m&&n<u){var S=Dr(_,b);return Vo(e,t,No,y.placeholder,r,_,S,c,l,u-n)}var C=f?r:this,w=p?C[e]:e;return n=_.length,c?_=Fs(_,c):h&&n>1&&_.reverse(),d&&l<n&&(_.length=l),this&&this!==wn&&this instanceof y&&(w=g||ko(w)),w.apply(C,_)}return y}function Po(e,t){return function(n,r){return oa(n,e,t(r),{})}}function Fo(e,t){return function(r,i){var a;if(r===n&&i===n)return t;if(r!==n&&(a=r),i!==n){if(a===n)return i;typeof r==`string`||typeof i==`string`?(r=Xa(r),i=Xa(i)):(r=Ya(r),i=Ya(i)),a=e(r,i)}return a}}function Io(e){return Qo(function(t){return t=Wn(t,fr(V())),L(function(n){var r=this;return e(t,function(e){return In(e,r,n)})})})}function Lo(e,t){t=t===n?` `:Xa(t);var r=t.length;if(r<2)return r?La(t,e):t;var i=La(t,rn(e/Mr(t)));return Sr(t)?co(Nr(i),0,e).join(``):i.slice(0,e)}function Ro(e,t,n,r){var i=t&_,a=ko(e);function o(){for(var t=-1,s=arguments.length,c=-1,l=r.length,u=ct(l+s),d=this&&this!==wn&&this instanceof o?a:e;++c<l;)u[c]=r[c];for(;s--;)u[c++]=arguments[++t];return In(d,i?n:this,u)}return o}function zo(e){return function(t,r,i){return i&&typeof i!=`number`&&bs(t,r,i)&&(r=i=n),t=Qu(t),r===n?(r=t,t=0):r=Qu(r),i=i===n?t<r?1:-1:Qu(i),Ia(t,r,i,e)}}function Bo(e){return function(t,n){return typeof t==`string`&&typeof n==`string`||(t=ed(t),n=ed(n)),e(t,n)}}function Vo(e,t,r,i,a,o,s,c,l,u){var d=t&b,f=d?s:n,p=d?n:s,m=d?o:n,h=d?n:o;t|=d?S:C,t&=~(d?C:S),t&y||(t&=~(_|v));var g=[e,t,a,m,f,h,p,c,l,u],x=r.apply(n,g);return Cs(e)&&Ls(x,g),x.placeholder=i,Bs(x,e,t)}function Ho(e){var t=Dt[e];return function(e,n){if(e=ed(e),n=n==null?0:gn(X(n),292),n&&un(e)){var r=(Z(e)+`e`).split(`e`);return r=(Z(t(r[0]+`e`+(+r[1]+n)))+`e`).split(`e`),+(r[0]+`e`+(+r[1]-n))}return t(e)}}var Uo=On&&1/Or(new On([,-0]))[1]==ce?function(e){return new On(e)}:Bf;function Wo(e){return function(t){var n=us(t);return n==Se?Tr(t):n==ke?kr(t):ur(t,e(t))}}function Go(e,t,r,i,a,s,c,l){var u=t&v;if(!u&&typeof e!=`function`)throw new At(o);var d=i?i.length:0;if(d||(t&=~(S|C),i=a=n),c=c===n?c:pn(X(c),0),l=l===n?l:X(l),d-=a?a.length:0,t&C){var f=i,p=a;i=a=n}var m=u?n:ts(e),h=[e,t,r,i,a,f,p,s,c,l];if(m&&As(h,m),e=h[0],t=h[1],r=h[2],i=h[3],a=h[4],l=h[9]=h[9]===n?u?0:e.length:pn(h[9]-d,0),!l&&t&(b|x)&&(t&=~(b|x)),!t||t==_)var g=Eo(e,t,r);else g=t==b||t==x?Ao(e,t,l):(t==S||t==(_|S))&&!a.length?Ro(e,t,r,i):No.apply(n,h);return Bs((m?Va:Ls)(g,h),e,t)}function Ko(e,t,r,i){return e===n||fu(e,Nt[r])&&!A.call(i,r)?t:e}function qo(e,t,r,i,a,o){return Au(e)&&Au(t)&&(o.set(t,e),Ea(e,t,n,qo,o),o.delete(t)),e}function Jo(e){return Bu(e)?n:e}function Yo(e,t,r,i,a,o){var s=r&h,c=e.length,l=t.length;if(c!=l&&!(s&&l>c))return!1;var u=o.get(e),d=o.get(t);if(u&&d)return u==t&&d==e;var f=-1,p=!0,m=r&g?new hi:n;for(o.set(e,t),o.set(t,e);++f<c;){var _=e[f],v=t[f];if(i)var y=s?i(v,_,f,t,e,o):i(_,v,f,e,t,o);if(y!==n){if(y)continue;p=!1;break}if(m){if(!Jn(t,function(e,t){if(!mr(m,t)&&(_===e||a(_,e,r,i,o)))return m.push(t)})){p=!1;break}}else if(!(_===v||a(_,v,r,i,o))){p=!1;break}}return o.delete(e),o.delete(t),p}function Xo(e,t,n,r,i,a,o){switch(n){case Ie:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case Fe:return!(e.byteLength!=t.byteLength||!a(new Wt(e),new Wt(t)));case ge:case _e:case Ce:return fu(+e,+t);case ye:return e.name==t.name&&e.message==t.message;case Oe:case Ae:return e==t+``;case Se:var s=Tr;case ke:var c=r&h;if(s||=Or,e.size!=t.size&&!c)return!1;var l=o.get(e);if(l)return l==t;r|=g,o.set(e,t);var u=Yo(s(e),s(t),r,i,a,o);return o.delete(e),u;case je:if(Ur)return Ur.call(e)==Ur.call(t)}return!1}function Zo(e,t,r,i,a,o){var s=r&h,c=$o(e),l=c.length;if(l!=$o(t).length&&!s)return!1;for(var u=l;u--;){var d=c[u];if(!(s?d in t:A.call(t,d)))return!1}var f=o.get(e),p=o.get(t);if(f&&p)return f==t&&p==e;var m=!0;o.set(e,t),o.set(t,e);for(var g=s;++u<l;){d=c[u];var _=e[d],v=t[d];if(i)var y=s?i(v,_,d,t,e,o):i(_,v,d,e,t,o);if(!(y===n?_===v||a(_,v,r,i,o):y)){m=!1;break}g||=d==`constructor`}if(m&&!g){var b=e.constructor,x=t.constructor;b!=x&&`constructor`in e&&`constructor`in t&&!(typeof b==`function`&&b instanceof b&&typeof x==`function`&&x instanceof x)&&(m=!1)}return o.delete(e),o.delete(t),m}function Qo(e){return zs(Ns(e,n,sc),e+``)}function $o(e){return $i(e,wd,cs)}function es(e){return $i(e,Td,ls)}var ts=Xn?function(e){return Xn.get(e)}:Bf;function ns(e){for(var t=e.name+``,n=ar[t],r=A.call(ar,t)?n.length:0;r--;){var i=n[r],a=i.func;if(a==null||a==e)return i.name}return t}function rs(e){return(A.call(N,`placeholder`)?N:e).placeholder}function V(){var e=N.iteratee||Nf;return e=e===Nf?ya:e,arguments.length?e(arguments[0],arguments[1]):e}function is(e,t){var n=e.__data__;return Ss(t)?n[typeof t==`string`?`string`:`hash`]:n.map}function as(e){for(var t=wd(e),n=t.length;n--;){var r=t[n],i=e[r];t[n]=[r,i,Ds(i)]}return t}function os(e,t){var r=xr(e,t);return ha(r)?r:n}function ss(e){var t=A.call(e,Qt),r=e[Qt];try{e[Qt]=n;var i=!0}catch{}var a=Rt.call(e);return i&&(t?e[Qt]=r:delete e[Qt]),a}var cs=on?function(e){return e==null?[]:(e=k(e),Vn(on(e),function(t){return Jt.call(e,t)}))}:Yf,ls=on?function(e){for(var t=[];e;)Gn(t,cs(e)),e=Kt(e);return t}:Yf,us=ea;(Cn&&us(new Cn(new ArrayBuffer(1)))!=Ie||Tn&&us(new Tn)!=Se||En&&us(En.resolve())!=Ee||On&&us(new On)!=ke||kn&&us(new kn)!=Ne)&&(us=function(e){var t=ea(e),r=t==Te?e.constructor:n,i=r?Gs(r):``;if(i)switch(i){case Ar:return Ie;case Ir:return Se;case Lr:return Ee;case Br:return ke;case Vr:return Ne}return t});function ds(e,t,n){for(var r=-1,i=n.length;++r<i;){var a=n[r],o=a.size;switch(a.type){case`drop`:e+=o;break;case`dropRight`:t-=o;break;case`take`:t=gn(t,e+o);break;case`takeRight`:e=pn(e,t-o);break}}return{start:e,end:t}}function fs(e){var t=e.match(ut);return t?t[1].split(dt):[]}function ps(e,t,n){t=oo(t,e);for(var r=-1,i=t.length,a=!1;++r<i;){var o=Ws(t[r]);if(!(a=e!=null&&n(e,o)))break;e=e[o]}return a||++r!=i?a:(i=e==null?0:e.length,!!i&&ku(i)&&ys(o,i)&&(q(e)||hu(e)))}function ms(e){var t=e.length,n=new e.constructor(t);return t&&typeof e[0]==`string`&&A.call(e,`index`)&&(n.index=e.index,n.input=e.input),n}function hs(e){return typeof e.constructor==`function`&&!Es(e)?Gr(Kt(e)):{}}function gs(e,t,n){var r=e.constructor;switch(t){case Fe:return fo(e);case ge:case _e:return new r(+e);case Ie:return po(e,n);case Le:case Re:case ze:case Be:case Ve:case He:case Ue:case We:case Ge:return R(e,n);case Se:return new r;case Ce:case Ae:return new r(e);case Oe:return mo(e);case ke:return new r;case je:return ho(e)}}function _s(e,t){var n=t.length;if(!n)return e;var r=n-1;return t[r]=(n>1?`& `:``)+t[r],t=t.join(n>2?`, `:` `),e.replace(lt,`{
/* [wrapped with `+t+`] */
`)}function vs(e){return q(e)||hu(e)||!!(Xt&&e&&e[Xt])}function ys(e,t){var n=typeof e;return t??=le,!!t&&(n==`number`||n!=`symbol`&&xt.test(e))&&e>-1&&e%1==0&&e<t}function bs(e,t,n){if(!Au(n))return!1;var r=typeof t;return(r==`number`?_u(n)&&ys(t,n.length):r==`string`&&t in n)?fu(n[t],e):!1}function xs(e,t){if(q(e))return!1;var n=typeof e;return n==`number`||n==`symbol`||n==`boolean`||e==null||Gu(e)?!0:rt.test(e)||!nt.test(e)||t!=null&&e in k(t)}function Ss(e){var t=typeof e;return t==`string`||t==`number`||t==`symbol`||t==`boolean`?e!==`__proto__`:e===null}function Cs(e){var t=ns(e),n=N[t];if(typeof n!=`function`||!(t in P.prototype))return!1;if(e===n)return!0;var r=ts(n);return!!r&&e===r[0]}function ws(e){return!!Lt&&Lt in e}var Ts=Pt?Du:Xf;function Es(e){var t=e&&e.constructor;return e===(typeof t==`function`&&t.prototype||Nt)}function Ds(e){return e===e&&!Au(e)}function Os(e,t){return function(r){return r==null?!1:r[e]===t&&(t!==n||e in k(r))}}function ks(e){var t=Jl(e,function(e){return n.size===u&&n.clear(),e}),n=t.cache;return t}function As(e,t){var n=e[1],r=t[1],i=n|r,a=i<(_|v|w),o=r==w&&n==b||r==w&&n==ee&&e[7].length<=t[8]||r==(w|ee)&&t[7].length<=t[8]&&n==b;if(!(a||o))return e;r&_&&(e[2]=t[2],i|=n&_?0:y);var s=t[3];if(s){var c=e[3];e[3]=c?_o(c,s,t[4]):s,e[4]=c?Dr(e[3],d):t[4]}return s=t[5],s&&(c=e[5],e[5]=c?vo(c,s,t[6]):s,e[6]=c?Dr(e[5],d):t[6]),s=t[7],s&&(e[7]=s),r&w&&(e[8]=e[8]==null?t[8]:gn(e[8],t[8])),e[9]??=t[9],e[0]=t[0],e[1]=i,e}function js(e){var t=[];if(e!=null)for(var n in k(e))t.push(n);return t}function Ms(e){return Rt.call(e)}function Ns(e,t,r){return t=pn(t===n?e.length-1:t,0),function(){for(var n=arguments,i=-1,a=pn(n.length-t,0),o=ct(a);++i<a;)o[i]=n[t+i];i=-1;for(var s=ct(t+1);++i<t;)s[i]=n[i];return s[t]=r(o),In(e,this,s)}}function Ps(e,t){return t.length<2?e:Qi(e,Wa(t,0,-1))}function Fs(e,t){for(var r=e.length,i=gn(t.length,r),a=yo(e);i--;){var o=t[i];e[i]=ys(o,r)?a[o]:n}return e}function Is(e,t){if(!(t===`constructor`&&typeof e[t]==`function`)&&t!=`__proto__`)return e[t]}var Ls=Vs(Va),Rs=nn||function(e,t){return wn.setTimeout(e,t)},zs=Vs(Ha);function Bs(e,t,n){var r=t+``;return zs(e,_s(r,Ks(fs(r),n)))}function Vs(e){var t=0,r=0;return function(){var i=_n(),a=ie-(i-r);if(r=i,a>0){if(++t>=re)return arguments[0]}else t=0;return e.apply(n,arguments)}}function Hs(e,t){var r=-1,i=e.length,a=i-1;for(t=t===n?i:t;++r<t;){var o=Fa(r,a),s=e[o];e[o]=e[r],e[r]=s}return e.length=t,e}var Us=ks(function(e){var t=[];return e.charCodeAt(0)===46&&t.push(``),e.replace(it,function(e,n,r,i){t.push(r?i.replace(mt,`$1`):n||e)}),t});function Ws(e){if(typeof e==`string`||Gu(e))return e;var t=e+``;return t==`0`&&1/e==-ce?`-0`:t}function Gs(e){if(e!=null){try{return Ft.call(e)}catch{}try{return e+``}catch{}}return``}function Ks(e,t){return Rn(pe,function(n){var r=`_.`+n[0];t&n[1]&&!Hn(e,r)&&e.push(r)}),e.sort()}function qs(e){if(e instanceof P)return e.clone();var t=new qr(e.__wrapped__,e.__chain__);return t.__actions__=yo(e.__actions__),t.__index__=e.__index__,t.__values__=e.__values__,t}function Js(e,t,r){t=(r?bs(e,t,r):t===n)?1:pn(X(t),0);var i=e==null?0:e.length;if(!i||t<1)return[];for(var a=0,o=0,s=ct(rn(i/t));a<i;)s[o++]=Wa(e,a,a+=t);return s}function Ys(e){for(var t=-1,n=e==null?0:e.length,r=0,i=[];++t<n;){var a=e[t];a&&(i[r++]=a)}return i}function Xs(){var e=arguments.length;if(!e)return[];for(var t=ct(e-1),n=arguments[0],r=e;r--;)t[r-1]=arguments[r];return Gn(q(n)?yo(n):[n],Ki(t,1))}var Zs=L(function(e,t){return J(e)?zi(e,Ki(t,1,J,!0)):[]}),Qs=L(function(e,t){var r=vc(t);return J(r)&&(r=n),J(e)?zi(e,Ki(t,1,J,!0),V(r,2)):[]}),$s=L(function(e,t){var r=vc(t);return J(r)&&(r=n),J(e)?zi(e,Ki(t,1,J,!0),n,r):[]});function ec(e,t,r){var i=e==null?0:e.length;return i?(t=r||t===n?1:X(t),Wa(e,t<0?0:t,i)):[]}function tc(e,t,r){var i=e==null?0:e.length;return i?(t=r||t===n?1:X(t),t=i-t,Wa(e,0,t<0?0:t)):[]}function nc(e,t){return e&&e.length?eo(e,V(t,3),!0,!0):[]}function rc(e,t){return e&&e.length?eo(e,V(t,3),!0):[]}function ic(e,t,n,r){var i=e==null?0:e.length;return i?(n&&typeof n!=`number`&&bs(e,t,n)&&(n=0,r=i),Wi(e,t,n,r)):[]}function ac(e,t,n){var r=e==null?0:e.length;if(!r)return-1;var i=n==null?0:X(n);return i<0&&(i=pn(r+i,0)),$n(e,V(t,3),i)}function oc(e,t,r){var i=e==null?0:e.length;if(!i)return-1;var a=i-1;return r!==n&&(a=X(r),a=r<0?pn(i+a,0):gn(a,i-1)),$n(e,V(t,3),a,!0)}function sc(e){return e!=null&&e.length?Ki(e,1):[]}function cc(e){return e!=null&&e.length?Ki(e,ce):[]}function lc(e,t){return e!=null&&e.length?(t=t===n?1:X(t),Ki(e,t)):[]}function uc(e){for(var t=-1,n=e==null?0:e.length,r={};++t<n;){var i=e[t];Pi(r,i[0],i[1])}return r}function dc(e){return e&&e.length?e[0]:n}function fc(e,t,n){var r=e==null?0:e.length;if(!r)return-1;var i=n==null?0:X(n);return i<0&&(i=pn(r+i,0)),er(e,t,i)}function pc(e){return e!=null&&e.length?Wa(e,0,-1):[]}var mc=L(function(e){var t=Wn(e,io);return t.length&&t[0]===e[0]?aa(t):[]}),hc=L(function(e){var t=vc(e),r=Wn(e,io);return t===vc(r)?t=n:r.pop(),r.length&&r[0]===e[0]?aa(r,V(t,2)):[]}),gc=L(function(e){var t=vc(e),r=Wn(e,io);return t=typeof t==`function`?t:n,t&&r.pop(),r.length&&r[0]===e[0]?aa(r,n,t):[]});function _c(e,t){return e==null?``:dn.call(e,t)}function vc(e){var t=e==null?0:e.length;return t?e[t-1]:n}function yc(e,t,r){var i=e==null?0:e.length;if(!i)return-1;var a=i;return r!==n&&(a=X(r),a=a<0?pn(i+a,0):gn(a,i-1)),t===t?jr(e,t,a):$n(e,nr,a,!0)}function bc(e,t){return e&&e.length?Oa(e,X(t)):n}var xc=L(Sc);function Sc(e,t){return e&&e.length&&t&&t.length?Na(e,t):e}function Cc(e,t,n){return e&&e.length&&t&&t.length?Na(e,t,V(n,2)):e}function wc(e,t,r){return e&&e.length&&t&&t.length?Na(e,t,n,r):e}var Tc=Qo(function(e,t){var n=e==null?0:e.length,r=Fi(e,t);return Pa(e,Wn(t,function(e){return ys(e,n)?+e:e}).sort(z)),r});function Ec(e,t){var n=[];if(!(e&&e.length))return n;var r=-1,i=[],a=e.length;for(t=V(t,3);++r<a;){var o=e[r];t(o,r,e)&&(n.push(o),i.push(r))}return Pa(e,i),n}function Dc(e){return e==null?e:Sn.call(e)}function Oc(e,t,r){var i=e==null?0:e.length;return i?(r&&typeof r!=`number`&&bs(e,t,r)?(t=0,r=i):(t=t==null?0:X(t),r=r===n?i:X(r)),Wa(e,t,r)):[]}function kc(e,t){return Ka(e,t)}function Ac(e,t,n){return qa(e,t,V(n,2))}function jc(e,t){var n=e==null?0:e.length;if(n){var r=Ka(e,t);if(r<n&&fu(e[r],t))return r}return-1}function Mc(e,t){return Ka(e,t,!0)}function Nc(e,t,n){return qa(e,t,V(n,2),!0)}function Pc(e,t){if(e!=null&&e.length){var n=Ka(e,t,!0)-1;if(fu(e[n],t))return n}return-1}function Fc(e){return e&&e.length?Ja(e):[]}function Ic(e,t){return e&&e.length?Ja(e,V(t,2)):[]}function Lc(e){var t=e==null?0:e.length;return t?Wa(e,1,t):[]}function Rc(e,t,r){return e&&e.length?(t=r||t===n?1:X(t),Wa(e,0,t<0?0:t)):[]}function zc(e,t,r){var i=e==null?0:e.length;return i?(t=r||t===n?1:X(t),t=i-t,Wa(e,t<0?0:t,i)):[]}function Bc(e,t){return e&&e.length?eo(e,V(t,3),!1,!0):[]}function Vc(e,t){return e&&e.length?eo(e,V(t,3)):[]}var Hc=L(function(e){return Za(Ki(e,1,J,!0))}),Uc=L(function(e){var t=vc(e);return J(t)&&(t=n),Za(Ki(e,1,J,!0),V(t,2))}),Wc=L(function(e){var t=vc(e);return t=typeof t==`function`?t:n,Za(Ki(e,1,J,!0),n,t)});function Gc(e){return e&&e.length?Za(e):[]}function Kc(e,t){return e&&e.length?Za(e,V(t,2)):[]}function qc(e,t){return t=typeof t==`function`?t:n,e&&e.length?Za(e,n,t):[]}function Jc(e){if(!(e&&e.length))return[];var t=0;return e=Vn(e,function(e){if(J(e))return t=pn(e.length,t),!0}),lr(t,function(t){return Wn(e,ir(t))})}function Yc(e,t){if(!(e&&e.length))return[];var r=Jc(e);return t==null?r:Wn(r,function(e){return In(t,n,e)})}var Xc=L(function(e,t){return J(e)?zi(e,t):[]}),Zc=L(function(e){return no(Vn(e,J))}),Qc=L(function(e){var t=vc(e);return J(t)&&(t=n),no(Vn(e,J),V(t,2))}),$c=L(function(e){var t=vc(e);return t=typeof t==`function`?t:n,no(Vn(e,J),n,t)}),el=L(Jc);function tl(e,t){return ro(e||[],t||[],ki)}function nl(e,t){return ro(e||[],t||[],Ba)}var rl=L(function(e){var t=e.length,r=t>1?e[t-1]:n;return r=typeof r==`function`?(e.pop(),r):n,Yc(e,r)});function il(e){var t=N(e);return t.__chain__=!0,t}function al(e,t){return t(e),e}function ol(e,t){return t(e)}var sl=Qo(function(e){var t=e.length,r=t?e[0]:0,i=this.__wrapped__,a=function(t){return Fi(t,e)};return t>1||this.__actions__.length||!(i instanceof P)||!ys(r)?this.thru(a):(i=i.slice(r,+r+ +!!t),i.__actions__.push({func:ol,args:[a],thisArg:n}),new qr(i,this.__chain__).thru(function(e){return t&&!e.length&&e.push(n),e}))});function cl(){return il(this)}function ll(){return new qr(this.value(),this.__chain__)}function ul(){this.__values__===n&&(this.__values__=Zu(this.value()));var e=this.__index__>=this.__values__.length;return{done:e,value:e?n:this.__values__[this.__index__++]}}function dl(){return this}function fl(e){for(var t,r=this;r instanceof Kr;){var i=qs(r);i.__index__=0,i.__values__=n,t?a.__wrapped__=i:t=i;var a=i;r=r.__wrapped__}return a.__wrapped__=e,t}function pl(){var e=this.__wrapped__;if(e instanceof P){var t=e;return this.__actions__.length&&(t=new P(this)),t=t.reverse(),t.__actions__.push({func:ol,args:[Dc],thisArg:n}),new qr(t,this.__chain__)}return this.thru(Dc)}function ml(){return to(this.__wrapped__,this.__actions__)}var hl=Co(function(e,t,n){A.call(e,n)?++e[n]:Pi(e,n,1)});function gl(e,t,r){var i=q(e)?Bn:Hi;return r&&bs(e,t,r)&&(t=n),i(e,V(t,3))}function _l(e,t){return(q(e)?Vn:Gi)(e,V(t,3))}var vl=jo(ac),yl=jo(oc);function bl(e,t){return Ki(kl(e,t),1)}function xl(e,t){return Ki(kl(e,t),ce)}function Sl(e,t,r){return r=r===n?1:X(r),Ki(kl(e,t),r)}function Cl(e,t){return(q(e)?Rn:Bi)(e,V(t,3))}function wl(e,t){return(q(e)?zn:Vi)(e,V(t,3))}var Tl=Co(function(e,t,n){A.call(e,n)?e[n].push(t):Pi(e,n,[t])});function El(e,t,n,r){e=_u(e)?e:Hd(e),n=n&&!r?X(n):0;var i=e.length;return n<0&&(n=pn(i+n,0)),Wu(e)?n<=i&&e.indexOf(t,n)>-1:!!i&&er(e,t,n)>-1}var Dl=L(function(e,t,n){var r=-1,i=typeof t==`function`,a=_u(e)?ct(e.length):[];return Bi(e,function(e){a[++r]=i?In(t,e,n):sa(e,t,n)}),a}),Ol=Co(function(e,t,n){Pi(e,n,t)});function kl(e,t){return(q(e)?Wn:Ca)(e,V(t,3))}function Al(e,t,r,i){return e==null?[]:(q(t)||(t=t==null?[]:[t]),r=i?n:r,q(r)||(r=r==null?[]:[r]),ka(e,t,r))}var jl=Co(function(e,t,n){e[+!n].push(t)},function(){return[[],[]]});function Ml(e,t,n){var r=q(e)?Kn:or,i=arguments.length<3;return r(e,V(t,4),n,i,Bi)}function Nl(e,t,n){var r=q(e)?qn:or,i=arguments.length<3;return r(e,V(t,4),n,i,Vi)}function Pl(e,t){return(q(e)?Vn:Gi)(e,Yl(V(t,3)))}function Fl(e){return(q(e)?Ti:Ra)(e)}function Il(e,t,r){return t=(r?bs(e,t,r):t===n)?1:X(t),(q(e)?Ei:za)(e,t)}function Ll(e){return(q(e)?Di:Ua)(e)}function Rl(e){if(e==null)return 0;if(_u(e))return Wu(e)?Mr(e):e.length;var t=us(e);return t==Se||t==ke?e.size:ba(e).length}function zl(e,t,r){var i=q(e)?Jn:Ga;return r&&bs(e,t,r)&&(t=n),i(e,V(t,3))}var Bl=L(function(e,t){if(e==null)return[];var n=t.length;return n>1&&bs(e,t[0],t[1])?t=[]:n>2&&bs(t[0],t[1],t[2])&&(t=[t[0]]),ka(e,Ki(t,1),[])}),Vl=tn||function(){return wn.Date.now()};function Hl(e,t){if(typeof t!=`function`)throw new At(o);return e=X(e),function(){if(--e<1)return t.apply(this,arguments)}}function H(e,t,r){return t=r?n:t,t=e&&t==null?e.length:t,Go(e,w,n,n,n,n,t)}function U(e,t){var r;if(typeof t!=`function`)throw new At(o);return e=X(e),function(){return--e>0&&(r=t.apply(this,arguments)),e<=1&&(t=n),r}}var W=L(function(e,t,n){var r=_;if(n.length){var i=Dr(n,rs(W));r|=S}return Go(e,r,t,n,i)}),G=L(function(e,t,n){var r=_|v;if(n.length){var i=Dr(n,rs(G));r|=S}return Go(t,r,e,n,i)});function K(e,t,r){t=r?n:t;var i=Go(e,b,n,n,n,n,n,t);return i.placeholder=K.placeholder,i}function Ul(e,t,r){t=r?n:t;var i=Go(e,x,n,n,n,n,n,t);return i.placeholder=Ul.placeholder,i}function Wl(e,t,r){var i,a,s,c,l,u,d=0,f=!1,p=!1,m=!0;if(typeof e!=`function`)throw new At(o);t=ed(t)||0,Au(r)&&(f=!!r.leading,p=`maxWait`in r,s=p?pn(ed(r.maxWait)||0,t):s,m=`trailing`in r?!!r.trailing:m);function h(t){var r=i,o=a;return i=a=n,d=t,c=e.apply(o,r),c}function g(e){return d=e,l=Rs(y,t),f?h(e):c}function _(e){var n=e-u,r=e-d,i=t-n;return p?gn(i,s-r):i}function v(e){var r=e-u,i=e-d;return u===n||r>=t||r<0||p&&i>=s}function y(){var e=Vl();if(v(e))return b(e);l=Rs(y,_(e))}function b(e){return l=n,m&&i?h(e):(i=a=n,c)}function x(){l!==n&&lo(l),d=0,i=u=a=l=n}function S(){return l===n?c:b(Vl())}function C(){var e=Vl(),r=v(e);if(i=arguments,a=this,u=e,r){if(l===n)return g(u);if(p)return lo(l),l=Rs(y,t),h(u)}return l===n&&(l=Rs(y,t)),c}return C.cancel=x,C.flush=S,C}var Gl=L(function(e,t){return Ri(e,1,t)}),Kl=L(function(e,t,n){return Ri(e,ed(t)||0,n)});function ql(e){return Go(e,te)}function Jl(e,t){if(typeof e!=`function`||t!=null&&typeof t!=`function`)throw new At(o);var n=function(){var r=arguments,i=t?t.apply(this,r):r[0],a=n.cache;if(a.has(i))return a.get(i);var o=e.apply(this,r);return n.cache=a.set(i,o)||a,o};return n.cache=new(Jl.Cache||li),n}Jl.Cache=li;function Yl(e){if(typeof e!=`function`)throw new At(o);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}function Xl(e){return U(2,e)}var Zl=so(function(e,t){t=t.length==1&&q(t[0])?Wn(t[0],fr(V())):Wn(Ki(t,1),fr(V()));var n=t.length;return L(function(r){for(var i=-1,a=gn(r.length,n);++i<a;)r[i]=t[i].call(this,r[i]);return In(e,this,r)})}),Ql=L(function(e,t){return Go(e,S,n,t,Dr(t,rs(Ql)))}),$l=L(function(e,t){return Go(e,C,n,t,Dr(t,rs($l)))}),eu=Qo(function(e,t){return Go(e,ee,n,n,n,t)});function tu(e,t){if(typeof e!=`function`)throw new At(o);return t=t===n?t:X(t),L(e,t)}function nu(e,t){if(typeof e!=`function`)throw new At(o);return t=t==null?0:pn(X(t),0),L(function(n){var r=n[t],i=co(n,0,t);return r&&Gn(i,r),In(e,this,i)})}function ru(e,t,n){var r=!0,i=!0;if(typeof e!=`function`)throw new At(o);return Au(n)&&(r=`leading`in n?!!n.leading:r,i=`trailing`in n?!!n.trailing:i),Wl(e,t,{leading:r,maxWait:t,trailing:i})}function iu(e){return H(e,1)}function au(e,t){return Ql(ao(t),e)}function ou(){if(!arguments.length)return[];var e=arguments[0];return q(e)?e:[e]}function su(e){return F(e,m)}function cu(e,t){return t=typeof t==`function`?t:n,F(e,m,t)}function lu(e){return F(e,f|m)}function uu(e,t){return t=typeof t==`function`?t:n,F(e,f|m,t)}function du(e,t){return t==null||I(e,t,wd(t))}function fu(e,t){return e===t||e!==e&&t!==t}var pu=Bo(ta),mu=Bo(function(e,t){return e>=t}),hu=ca(function(){return arguments}())?ca:function(e){return ju(e)&&A.call(e,`callee`)&&!Jt.call(e,`callee`)},q=ct.isArray,gu=An?fr(An):la;function _u(e){return e!=null&&ku(e.length)&&!Du(e)}function J(e){return ju(e)&&_u(e)}function vu(e){return e===!0||e===!1||ju(e)&&ea(e)==ge}var yu=sn||Xf,bu=jn?fr(jn):ua;function xu(e){return ju(e)&&e.nodeType===1&&!Bu(e)}function Su(e){if(e==null)return!0;if(_u(e)&&(q(e)||typeof e==`string`||typeof e.splice==`function`||yu(e)||Ku(e)||hu(e)))return!e.length;var t=us(e);if(t==Se||t==ke)return!e.size;if(Es(e))return!ba(e).length;for(var n in e)if(A.call(e,n))return!1;return!0}function Cu(e,t){return da(e,t)}function wu(e,t,r){r=typeof r==`function`?r:n;var i=r?r(e,t):n;return i===n?da(e,t,n,r):!!i}function Tu(e){if(!ju(e))return!1;var t=ea(e);return t==ye||t==ve||typeof e.message==`string`&&typeof e.name==`string`&&!Bu(e)}function Eu(e){return typeof e==`number`&&un(e)}function Du(e){if(!Au(e))return!1;var t=ea(e);return t==be||t==xe||t==he||t==De}function Ou(e){return typeof e==`number`&&e==X(e)}function ku(e){return typeof e==`number`&&e>-1&&e%1==0&&e<=le}function Au(e){var t=typeof e;return e!=null&&(t==`object`||t==`function`)}function ju(e){return typeof e==`object`&&!!e}var Mu=Mn?fr(Mn):pa;function Nu(e,t){return e===t||ma(e,t,as(t))}function Pu(e,t,r){return r=typeof r==`function`?r:n,ma(e,t,as(t),r)}function Fu(e){return zu(e)&&e!=+e}function Iu(e){if(Ts(e))throw new Tt(a);return ha(e)}function Lu(e){return e===null}function Ru(e){return e==null}function zu(e){return typeof e==`number`||ju(e)&&ea(e)==Ce}function Bu(e){if(!ju(e)||ea(e)!=Te)return!1;var t=Kt(e);if(t===null)return!0;var n=A.call(t,`constructor`)&&t.constructor;return typeof n==`function`&&n instanceof n&&Ft.call(n)==zt}var Vu=Nn?fr(Nn):ga;function Hu(e){return Ou(e)&&e>=-le&&e<=le}var Uu=Pn?fr(Pn):_a;function Wu(e){return typeof e==`string`||!q(e)&&ju(e)&&ea(e)==Ae}function Gu(e){return typeof e==`symbol`||ju(e)&&ea(e)==je}var Ku=Fn?fr(Fn):va;function Y(e){return e===n}function qu(e){return ju(e)&&us(e)==Ne}function Ju(e){return ju(e)&&ea(e)==Pe}var Yu=Bo(Sa),Xu=Bo(function(e,t){return e<=t});function Zu(e){if(!e)return[];if(_u(e))return Wu(e)?Nr(e):yo(e);if(Zt&&e[Zt])return wr(e[Zt]());var t=us(e);return(t==Se?Tr:t==ke?Or:Hd)(e)}function Qu(e){return e?(e=ed(e),e===ce||e===-ce?(e<0?-1:1)*E:e===e?e:0):e===0?e:0}function X(e){var t=Qu(e),n=t%1;return t===t?n?t-n:t:0}function $u(e){return e?Ii(X(e),0,ue):0}function ed(e){if(typeof e==`number`)return e;if(Gu(e))return D;if(Au(e)){var t=typeof e.valueOf==`function`?e.valueOf():e;e=Au(t)?t+``:t}if(typeof e!=`string`)return e===0?e:+e;e=dr(e);var n=vt.test(e);return n||bt.test(e)?xn(e.slice(2),n?2:8):_t.test(e)?D:+e}function td(e){return bo(e,Td(e))}function nd(e){return e?Ii(X(e),-le,le):e===0?e:0}function Z(e){return e==null?``:Xa(e)}var rd=B(function(e,t){if(Es(t)||_u(t)){bo(t,wd(t),e);return}for(var n in t)A.call(t,n)&&ki(e,n,t[n])}),id=B(function(e,t){bo(t,Td(t),e)}),ad=B(function(e,t,n,r){bo(t,Td(t),e,r)}),od=B(function(e,t,n,r){bo(t,wd(t),e,r)}),sd=Qo(Fi);function cd(e,t){var n=Gr(e);return t==null?n:Mi(n,t)}var ld=L(function(e,t){e=k(e);var r=-1,i=t.length,a=i>2?t[2]:n;for(a&&bs(t[0],t[1],a)&&(i=1);++r<i;)for(var o=t[r],s=Td(o),c=-1,l=s.length;++c<l;){var u=s[c],d=e[u];(d===n||fu(d,Nt[u])&&!A.call(e,u))&&(e[u]=o[u])}return e}),ud=L(function(e){return e.push(n,qo),In(kd,n,e)});function dd(e,t){return Qn(e,V(t,3),Yi)}function fd(e,t){return Qn(e,V(t,3),Xi)}function pd(e,t){return e==null?e:qi(e,V(t,3),Td)}function md(e,t){return e==null?e:Ji(e,V(t,3),Td)}function hd(e,t){return e&&Yi(e,V(t,3))}function gd(e,t){return e&&Xi(e,V(t,3))}function _d(e){return e==null?[]:Zi(e,wd(e))}function vd(e){return e==null?[]:Zi(e,Td(e))}function yd(e,t,r){var i=e==null?n:Qi(e,t);return i===n?r:i}function Q(e,t){return e!=null&&ps(e,t,na)}function bd(e,t){return e!=null&&ps(e,t,ra)}var xd=Po(function(e,t,n){t!=null&&typeof t.toString!=`function`&&(t=Rt.call(t)),e[t]=n},Of(Mf)),Sd=Po(function(e,t,n){t!=null&&typeof t.toString!=`function`&&(t=Rt.call(t)),A.call(e,t)?e[t].push(n):e[t]=[n]},V),Cd=L(sa);function wd(e){return _u(e)?wi(e):ba(e)}function Td(e){return _u(e)?wi(e,!0):xa(e)}function Ed(e,t){var n={};return t=V(t,3),Yi(e,function(e,r,i){Pi(n,t(e,r,i),e)}),n}function Dd(e,t){var n={};return t=V(t,3),Yi(e,function(e,r,i){Pi(n,r,t(e,r,i))}),n}var Od=B(function(e,t,n){Ea(e,t,n)}),kd=B(function(e,t,n,r){Ea(e,t,n,r)}),Ad=Qo(function(e,t){var n={};if(e==null)return n;var r=!1;t=Wn(t,function(t){return t=oo(t,e),r||=t.length>1,t}),bo(e,es(e),n),r&&(n=F(n,f|p|m,Jo));for(var i=t.length;i--;)Qa(n,t[i]);return n});function jd(e,t){return $(e,Yl(V(t)))}var Md=Qo(function(e,t){return e==null?{}:Aa(e,t)});function $(e,t){if(e==null)return{};var n=Wn(es(e),function(e){return[e]});return t=V(t),ja(e,n,function(e,n){return t(e,n[0])})}function Nd(e,t,r){t=oo(t,e);var i=-1,a=t.length;for(a||(a=1,e=n);++i<a;){var o=e==null?n:e[Ws(t[i])];o===n&&(i=a,o=r),e=Du(o)?o.call(e):o}return e}function Pd(e,t,n){return e==null?e:Ba(e,t,n)}function Fd(e,t,r,i){return i=typeof i==`function`?i:n,e==null?e:Ba(e,t,r,i)}var Id=Wo(wd),Ld=Wo(Td);function Rd(e,t,n){var r=q(e),i=r||yu(e)||Ku(e);if(t=V(t,4),n==null){var a=e&&e.constructor;n=i?r?new a:[]:Au(e)&&Du(a)?Gr(Kt(e)):{}}return(i?Rn:Yi)(e,function(e,r,i){return t(n,e,r,i)}),n}function zd(e,t){return e==null?!0:Qa(e,t)}function Bd(e,t,n){return e==null?e:$a(e,t,ao(n))}function Vd(e,t,r,i){return i=typeof i==`function`?i:n,e==null?e:$a(e,t,ao(r),i)}function Hd(e){return e==null?[]:pr(e,wd(e))}function Ud(e){return e==null?[]:pr(e,Td(e))}function Wd(e,t,r){return r===n&&(r=t,t=n),r!==n&&(r=ed(r),r=r===r?r:0),t!==n&&(t=ed(t),t=t===t?t:0),Ii(ed(e),t,r)}function Gd(e,t,r){return t=Qu(t),r===n?(r=t,t=0):r=Qu(r),e=ed(e),ia(e,t,r)}function Kd(e,t,r){if(r&&typeof r!=`boolean`&&bs(e,t,r)&&(t=r=n),r===n&&(typeof t==`boolean`?(r=t,t=n):typeof e==`boolean`&&(r=e,e=n)),e===n&&t===n?(e=0,t=1):(e=Qu(e),t===n?(t=e,e=0):t=Qu(t)),e>t){var i=e;e=t,t=i}if(r||e%1||t%1){var a=yn();return gn(e+a*(t-e+bn(`1e-`+((a+``).length-1))),t)}return Fa(e,t)}var qd=Oo(function(e,t,n){return t=t.toLowerCase(),e+(n?Jd(t):t)});function Jd(e){return Sf(Z(e).toLowerCase())}function Yd(e){return e=Z(e),e&&e.replace(St,vr).replace(ln,``)}function Xd(e,t,r){e=Z(e),t=Xa(t);var i=e.length;r=r===n?i:Ii(X(r),0,i);var a=r;return r-=t.length,r>=0&&e.slice(r,a)==t}function Zd(e){return e=Z(e),e&&Qe.test(e)?e.replace(Xe,yr):e}function Qd(e){return e=Z(e),e&&ot.test(e)?e.replace(at,`\\$&`):e}var $d=Oo(function(e,t,n){return e+(n?`-`:``)+t.toLowerCase()}),ef=Oo(function(e,t,n){return e+(n?` `:``)+t.toLowerCase()}),tf=Do(`toLowerCase`);function nf(e,t,n){e=Z(e),t=X(t);var r=t?Mr(e):0;if(!t||r>=t)return e;var i=(t-r)/2;return Lo(an(i),n)+e+Lo(rn(i),n)}function rf(e,t,n){e=Z(e),t=X(t);var r=t?Mr(e):0;return t&&r<t?e+Lo(t-r,n):e}function af(e,t,n){e=Z(e),t=X(t);var r=t?Mr(e):0;return t&&r<t?Lo(t-r,n)+e:e}function of(e,t,n){return n||t==null?t=0:t&&=+t,vn(Z(e).replace(st,``),t||0)}function sf(e,t,r){return t=(r?bs(e,t,r):t===n)?1:X(t),La(Z(e),t)}function cf(){var e=arguments,t=Z(e[0]);return e.length<3?t:t.replace(e[1],e[2])}var lf=Oo(function(e,t,n){return e+(n?`_`:``)+t.toLowerCase()});function uf(e,t,r){return r&&typeof r!=`number`&&bs(e,t,r)&&(t=r=n),r=r===n?ue:r>>>0,r?(e=Z(e),e&&(typeof t==`string`||t!=null&&!Vu(t))&&(t=Xa(t),!t&&Sr(e))?co(Nr(e),0,r):e.split(t,r)):[]}var df=Oo(function(e,t,n){return e+(n?` `:``)+Sf(t)});function ff(e,t,n){return e=Z(e),n=n==null?0:Ii(X(n),0,e.length),t=Xa(t),e.slice(n,n+t.length)==t}function pf(e,t,r){var i=N.templateSettings;r&&bs(e,t,r)&&(t=n),e=Z(e),t=od({},t,i,Ko);var a=od({},t.imports,i.imports,Ko),o=wd(a),l=pr(a,o);Rn(o,function(e){if(pt.test(e))throw new Tt(c)});var u,d,f=0,p=t.interpolate||Ct,m=`__p += '`,h=Ot((t.escape||Ct).source+`|`+p.source+`|`+(p===tt?ht:Ct).source+`|`+(t.evaluate||Ct).source+`|$`,`g`),g=`//# sourceURL=`+(A.call(t,`sourceURL`)?(t.sourceURL+``).replace(/\s/g,` `):`lodash.templateSources[`+ ++hn+`]`)+`
`;e.replace(h,function(t,n,r,i,a,o){return r||=i,m+=e.slice(f,o).replace(wt,br),n&&(u=!0,m+=`' +
__e(`+n+`) +
'`),a&&(d=!0,m+=`';
`+a+`;
__p += '`),r&&(m+=`' +
((__t = (`+r+`)) == null ? '' : __t) +
'`),f=o+t.length,t}),m+=`';
`;var _=A.call(t,`variable`)&&t.variable;if(!_)m=`with (obj) {
`+m+`
}
`;else if(pt.test(_))throw new Tt(s);m=(d?m.replace(Ke,``):m).replace(qe,`$1`).replace(Je,`$1;`),m=`function(`+(_||`obj`)+`) {
`+(_?``:`obj || (obj = {});
`)+`var __t, __p = ''`+(u?`, __e = _.escape`:``)+(d?`, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
`:`;
`)+m+`return __p
}`;var v=wf(function(){return Et(o,g+`return `+m).apply(n,l)});if(v.source=m,Tu(v))throw v;return v}function mf(e){return Z(e).toLowerCase()}function hf(e){return Z(e).toUpperCase()}function gf(e,t,r){if(e=Z(e),e&&(r||t===n))return dr(e);if(!e||!(t=Xa(t)))return e;var i=Nr(e),a=Nr(t);return co(i,hr(i,a),gr(i,a)+1).join(``)}function _f(e,t,r){if(e=Z(e),e&&(r||t===n))return e.slice(0,Pr(e)+1);if(!e||!(t=Xa(t)))return e;var i=Nr(e);return co(i,0,gr(i,Nr(t))+1).join(``)}function vf(e,t,r){if(e=Z(e),e&&(r||t===n))return e.replace(st,``);if(!e||!(t=Xa(t)))return e;var i=Nr(e);return co(i,hr(i,Nr(t))).join(``)}function yf(e,t){var r=T,i=ne;if(Au(t)){var a=`separator`in t?t.separator:a;r=`length`in t?X(t.length):r,i=`omission`in t?Xa(t.omission):i}e=Z(e);var o=e.length;if(Sr(e)){var s=Nr(e);o=s.length}if(r>=o)return e;var c=r-Mr(i);if(c<1)return i;var l=s?co(s,0,c).join(``):e.slice(0,c);if(a===n)return l+i;if(s&&(c+=l.length-c),Vu(a)){if(e.slice(c).search(a)){var u,d=l;for(a.global||(a=Ot(a.source,Z(gt.exec(a))+`g`)),a.lastIndex=0;u=a.exec(d);)var f=u.index;l=l.slice(0,f===n?c:f)}}else if(e.indexOf(Xa(a),c)!=c){var p=l.lastIndexOf(a);p>-1&&(l=l.slice(0,p))}return l+i}function bf(e){return e=Z(e),e&&Ze.test(e)?e.replace(Ye,Fr):e}var xf=Oo(function(e,t,n){return e+(n?` `:``)+t.toUpperCase()}),Sf=Do(`toUpperCase`);function Cf(e,t,r){return e=Z(e),t=r?n:t,t===n?Cr(e)?Rr(e):Zn(e):e.match(t)||[]}var wf=L(function(e,t){try{return In(e,n,t)}catch(e){return Tu(e)?e:new Tt(e)}}),Tf=Qo(function(e,t){return Rn(t,function(t){t=Ws(t),Pi(e,t,W(e[t],e))}),e});function Ef(e){var t=e==null?0:e.length,n=V();return e=t?Wn(e,function(e){if(typeof e[1]!=`function`)throw new At(o);return[n(e[0]),e[1]]}):[],L(function(n){for(var r=-1;++r<t;){var i=e[r];if(In(i[0],this,n))return In(i[1],this,n)}})}function Df(e){return Li(F(e,f))}function Of(e){return function(){return e}}function kf(e,t){return e==null||e!==e?t:e}var Af=Mo(),jf=Mo(!0);function Mf(e){return e}function Nf(e){return ya(typeof e==`function`?e:F(e,f))}function Pf(e){return wa(F(e,f))}function Ff(e,t){return Ta(e,F(t,f))}var If=L(function(e,t){return function(n){return sa(n,e,t)}}),Lf=L(function(e,t){return function(n){return sa(e,n,t)}});function Rf(e,t,n){var r=wd(t),i=Zi(t,r);n==null&&!(Au(t)&&(i.length||!r.length))&&(n=t,t=e,e=this,i=Zi(t,wd(t)));var a=!(Au(n)&&`chain`in n)||!!n.chain,o=Du(e);return Rn(i,function(n){var r=t[n];e[n]=r,o&&(e.prototype[n]=function(){var t=this.__chain__;if(a||t){var n=e(this.__wrapped__);return(n.__actions__=yo(this.__actions__)).push({func:r,args:arguments,thisArg:e}),n.__chain__=t,n}return r.apply(e,Gn([this.value()],arguments))})}),e}function zf(){return wn._===this&&(wn._=Bt),this}function Bf(){}function Vf(e){return e=X(e),L(function(t){return Oa(t,e)})}var Hf=Io(Wn),Uf=Io(Bn),Wf=Io(Jn);function Gf(e){return xs(e)?ir(Ws(e)):Ma(e)}function Kf(e){return function(t){return e==null?n:Qi(e,t)}}var qf=zo(),Jf=zo(!0);function Yf(){return[]}function Xf(){return!1}function Zf(){return{}}function Qf(){return``}function $f(){return!0}function ep(e,t){if(e=X(e),e<1||e>le)return[];var n=ue,r=gn(e,ue);t=V(t),e-=ue;for(var i=lr(r,t);++n<e;)t(n);return i}function tp(e){return q(e)?Wn(e,Ws):Gu(e)?[e]:yo(Us(Z(e)))}function np(e){var t=++It;return Z(e)+t}var rp=Fo(function(e,t){return e+t},0),ip=Ho(`ceil`),ap=Fo(function(e,t){return e/t},1),op=Ho(`floor`);function sp(e){return e&&e.length?Ui(e,Mf,ta):n}function cp(e,t){return e&&e.length?Ui(e,V(t,2),ta):n}function lp(e){return rr(e,Mf)}function up(e,t){return rr(e,V(t,2))}function dp(e){return e&&e.length?Ui(e,Mf,Sa):n}function fp(e,t){return e&&e.length?Ui(e,V(t,2),Sa):n}var pp=Fo(function(e,t){return e*t},1),mp=Ho(`round`),hp=Fo(function(e,t){return e-t},0);function gp(e){return e&&e.length?cr(e,Mf):0}function _p(e,t){return e&&e.length?cr(e,V(t,2)):0}return N.after=Hl,N.ary=H,N.assign=rd,N.assignIn=id,N.assignInWith=ad,N.assignWith=od,N.at=sd,N.before=U,N.bind=W,N.bindAll=Tf,N.bindKey=G,N.castArray=ou,N.chain=il,N.chunk=Js,N.compact=Ys,N.concat=Xs,N.cond=Ef,N.conforms=Df,N.constant=Of,N.countBy=hl,N.create=cd,N.curry=K,N.curryRight=Ul,N.debounce=Wl,N.defaults=ld,N.defaultsDeep=ud,N.defer=Gl,N.delay=Kl,N.difference=Zs,N.differenceBy=Qs,N.differenceWith=$s,N.drop=ec,N.dropRight=tc,N.dropRightWhile=nc,N.dropWhile=rc,N.fill=ic,N.filter=_l,N.flatMap=bl,N.flatMapDeep=xl,N.flatMapDepth=Sl,N.flatten=sc,N.flattenDeep=cc,N.flattenDepth=lc,N.flip=ql,N.flow=Af,N.flowRight=jf,N.fromPairs=uc,N.functions=_d,N.functionsIn=vd,N.groupBy=Tl,N.initial=pc,N.intersection=mc,N.intersectionBy=hc,N.intersectionWith=gc,N.invert=xd,N.invertBy=Sd,N.invokeMap=Dl,N.iteratee=Nf,N.keyBy=Ol,N.keys=wd,N.keysIn=Td,N.map=kl,N.mapKeys=Ed,N.mapValues=Dd,N.matches=Pf,N.matchesProperty=Ff,N.memoize=Jl,N.merge=Od,N.mergeWith=kd,N.method=If,N.methodOf=Lf,N.mixin=Rf,N.negate=Yl,N.nthArg=Vf,N.omit=Ad,N.omitBy=jd,N.once=Xl,N.orderBy=Al,N.over=Hf,N.overArgs=Zl,N.overEvery=Uf,N.overSome=Wf,N.partial=Ql,N.partialRight=$l,N.partition=jl,N.pick=Md,N.pickBy=$,N.property=Gf,N.propertyOf=Kf,N.pull=xc,N.pullAll=Sc,N.pullAllBy=Cc,N.pullAllWith=wc,N.pullAt=Tc,N.range=qf,N.rangeRight=Jf,N.rearg=eu,N.reject=Pl,N.remove=Ec,N.rest=tu,N.reverse=Dc,N.sampleSize=Il,N.set=Pd,N.setWith=Fd,N.shuffle=Ll,N.slice=Oc,N.sortBy=Bl,N.sortedUniq=Fc,N.sortedUniqBy=Ic,N.split=uf,N.spread=nu,N.tail=Lc,N.take=Rc,N.takeRight=zc,N.takeRightWhile=Bc,N.takeWhile=Vc,N.tap=al,N.throttle=ru,N.thru=ol,N.toArray=Zu,N.toPairs=Id,N.toPairsIn=Ld,N.toPath=tp,N.toPlainObject=td,N.transform=Rd,N.unary=iu,N.union=Hc,N.unionBy=Uc,N.unionWith=Wc,N.uniq=Gc,N.uniqBy=Kc,N.uniqWith=qc,N.unset=zd,N.unzip=Jc,N.unzipWith=Yc,N.update=Bd,N.updateWith=Vd,N.values=Hd,N.valuesIn=Ud,N.without=Xc,N.words=Cf,N.wrap=au,N.xor=Zc,N.xorBy=Qc,N.xorWith=$c,N.zip=el,N.zipObject=tl,N.zipObjectDeep=nl,N.zipWith=rl,N.entries=Id,N.entriesIn=Ld,N.extend=id,N.extendWith=ad,Rf(N,N),N.add=rp,N.attempt=wf,N.camelCase=qd,N.capitalize=Jd,N.ceil=ip,N.clamp=Wd,N.clone=su,N.cloneDeep=lu,N.cloneDeepWith=uu,N.cloneWith=cu,N.conformsTo=du,N.deburr=Yd,N.defaultTo=kf,N.divide=ap,N.endsWith=Xd,N.eq=fu,N.escape=Zd,N.escapeRegExp=Qd,N.every=gl,N.find=vl,N.findIndex=ac,N.findKey=dd,N.findLast=yl,N.findLastIndex=oc,N.findLastKey=fd,N.floor=op,N.forEach=Cl,N.forEachRight=wl,N.forIn=pd,N.forInRight=md,N.forOwn=hd,N.forOwnRight=gd,N.get=yd,N.gt=pu,N.gte=mu,N.has=Q,N.hasIn=bd,N.head=dc,N.identity=Mf,N.includes=El,N.indexOf=fc,N.inRange=Gd,N.invoke=Cd,N.isArguments=hu,N.isArray=q,N.isArrayBuffer=gu,N.isArrayLike=_u,N.isArrayLikeObject=J,N.isBoolean=vu,N.isBuffer=yu,N.isDate=bu,N.isElement=xu,N.isEmpty=Su,N.isEqual=Cu,N.isEqualWith=wu,N.isError=Tu,N.isFinite=Eu,N.isFunction=Du,N.isInteger=Ou,N.isLength=ku,N.isMap=Mu,N.isMatch=Nu,N.isMatchWith=Pu,N.isNaN=Fu,N.isNative=Iu,N.isNil=Ru,N.isNull=Lu,N.isNumber=zu,N.isObject=Au,N.isObjectLike=ju,N.isPlainObject=Bu,N.isRegExp=Vu,N.isSafeInteger=Hu,N.isSet=Uu,N.isString=Wu,N.isSymbol=Gu,N.isTypedArray=Ku,N.isUndefined=Y,N.isWeakMap=qu,N.isWeakSet=Ju,N.join=_c,N.kebabCase=$d,N.last=vc,N.lastIndexOf=yc,N.lowerCase=ef,N.lowerFirst=tf,N.lt=Yu,N.lte=Xu,N.max=sp,N.maxBy=cp,N.mean=lp,N.meanBy=up,N.min=dp,N.minBy=fp,N.stubArray=Yf,N.stubFalse=Xf,N.stubObject=Zf,N.stubString=Qf,N.stubTrue=$f,N.multiply=pp,N.nth=bc,N.noConflict=zf,N.noop=Bf,N.now=Vl,N.pad=nf,N.padEnd=rf,N.padStart=af,N.parseInt=of,N.random=Kd,N.reduce=Ml,N.reduceRight=Nl,N.repeat=sf,N.replace=cf,N.result=Nd,N.round=mp,N.runInContext=e,N.sample=Fl,N.size=Rl,N.snakeCase=lf,N.some=zl,N.sortedIndex=kc,N.sortedIndexBy=Ac,N.sortedIndexOf=jc,N.sortedLastIndex=Mc,N.sortedLastIndexBy=Nc,N.sortedLastIndexOf=Pc,N.startCase=df,N.startsWith=ff,N.subtract=hp,N.sum=gp,N.sumBy=_p,N.template=pf,N.times=ep,N.toFinite=Qu,N.toInteger=X,N.toLength=$u,N.toLower=mf,N.toNumber=ed,N.toSafeInteger=nd,N.toString=Z,N.toUpper=hf,N.trim=gf,N.trimEnd=_f,N.trimStart=vf,N.truncate=yf,N.unescape=bf,N.uniqueId=np,N.upperCase=xf,N.upperFirst=Sf,N.each=Cl,N.eachRight=wl,N.first=dc,Rf(N,function(){var e={};return Yi(N,function(t,n){A.call(N.prototype,n)||(e[n]=t)}),e}(),{chain:!1}),N.VERSION=r,Rn([`bind`,`bindKey`,`curry`,`curryRight`,`partial`,`partialRight`],function(e){N[e].placeholder=N}),Rn([`drop`,`take`],function(e,t){P.prototype[e]=function(r){r=r===n?1:pn(X(r),0);var i=this.__filtered__&&!t?new P(this):this.clone();return i.__filtered__?i.__takeCount__=gn(r,i.__takeCount__):i.__views__.push({size:gn(r,ue),type:e+(i.__dir__<0?`Right`:``)}),i},P.prototype[e+`Right`]=function(t){return this.reverse()[e](t).reverse()}}),Rn([`filter`,`map`,`takeWhile`],function(e,t){var n=t+1,r=n==ae||n==se;P.prototype[e]=function(e){var t=this.clone();return t.__iteratees__.push({iteratee:V(e,3),type:n}),t.__filtered__=t.__filtered__||r,t}}),Rn([`head`,`last`],function(e,t){var n=`take`+(t?`Right`:``);P.prototype[e]=function(){return this[n](1).value()[0]}}),Rn([`initial`,`tail`],function(e,t){var n=`drop`+(t?``:`Right`);P.prototype[e]=function(){return this.__filtered__?new P(this):this[n](1)}}),P.prototype.compact=function(){return this.filter(Mf)},P.prototype.find=function(e){return this.filter(e).head()},P.prototype.findLast=function(e){return this.reverse().find(e)},P.prototype.invokeMap=L(function(e,t){return typeof e==`function`?new P(this):this.map(function(n){return sa(n,e,t)})}),P.prototype.reject=function(e){return this.filter(Yl(V(e)))},P.prototype.slice=function(e,t){e=X(e);var r=this;return r.__filtered__&&(e>0||t<0)?new P(r):(e<0?r=r.takeRight(-e):e&&(r=r.drop(e)),t!==n&&(t=X(t),r=t<0?r.dropRight(-t):r.take(t-e)),r)},P.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},P.prototype.toArray=function(){return this.take(ue)},Yi(P.prototype,function(e,t){var r=/^(?:filter|find|map|reject)|While$/.test(t),i=/^(?:head|last)$/.test(t),a=N[i?`take`+(t==`last`?`Right`:``):t],o=i||/^find/.test(t);a&&(N.prototype[t]=function(){var t=this.__wrapped__,s=i?[1]:arguments,c=t instanceof P,l=s[0],u=c||q(t),d=function(e){var t=a.apply(N,Gn([e],s));return i&&f?t[0]:t};u&&r&&typeof l==`function`&&l.length!=1&&(c=u=!1);var f=this.__chain__,p=!!this.__actions__.length,m=o&&!f,h=c&&!p;if(!o&&u){t=h?t:new P(this);var g=e.apply(t,s);return g.__actions__.push({func:ol,args:[d],thisArg:n}),new qr(g,f)}return m&&h?e.apply(this,s):(g=this.thru(d),m?i?g.value()[0]:g.value():g)})}),Rn([`pop`,`push`,`shift`,`sort`,`splice`,`unshift`],function(e){var t=jt[e],n=/^(?:push|sort|unshift)$/.test(e)?`tap`:`thru`,r=/^(?:pop|shift)$/.test(e);N.prototype[e]=function(){var e=arguments;if(r&&!this.__chain__){var i=this.value();return t.apply(q(i)?i:[],e)}return this[n](function(n){return t.apply(q(n)?n:[],e)})}}),Yi(P.prototype,function(e,t){var n=N[t];if(n){var r=n.name+``;A.call(ar,r)||(ar[r]=[]),ar[r].push({name:t,func:n})}}),ar[No(n,v).name]=[{name:`wrapper`,func:n}],P.prototype.clone=Jr,P.prototype.reverse=Yr,P.prototype.value=Xr,N.prototype.at=sl,N.prototype.chain=cl,N.prototype.commit=ll,N.prototype.next=ul,N.prototype.plant=fl,N.prototype.reverse=pl,N.prototype.toJSON=N.prototype.valueOf=N.prototype.value=ml,N.prototype.first=N.prototype.head,Zt&&(N.prototype[Zt]=dl),N})();typeof define==`function`&&typeof define.amd==`object`&&define.amd?(wn._=zr,define(function(){return zr})):En?((En.exports=zr)._=zr,Tn._=zr):wn._=zr}).call(e)})),y=c(p(),1),b=_(),x=c(v(),1),S=e=>e.join(`, `),C=[{id:`koko-eating-bananas`,title:`Koko Eating Bananas`,difficulty:`Medium`,category:`binary-search`,askedBy:`himali`,description:[`Koko loves to eat bananas. There are <code>n</code> piles of bananas; the <code>i-th</code> pile has <code>piles[i]</code> bananas. The guards will be back in <code>h</code> hours.`,`Koko can decide her bananas-per-hour eating speed <code>k</code>. Each hour she eats from one pile (at most <code>k</code> bananas). If the pile has fewer, she finishes it and waits.`,`Return the minimum integer <code>k</code> such that she can eat all bananas within <code>h</code> hours.`],examples:[{input:`piles = [3,6,7,11],  h = 8`,output:`4`,explanation:`At speed 4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 hours.`},{input:`piles = [30,11,23,4,20],  h = 5`,output:`30`,explanation:`Each pile must be finished in exactly 1 hour, so k must be at least max(piles) = 30.`}],constraints:[`1 ≤ piles.length ≤ 10⁴`,`piles.length ≤ h ≤ 10⁹`,`1 ≤ piles[i] ≤ 10⁹`],hints:[`The answer lies in [1, max(piles)]. Binary search on the speed.`,`For a candidate speed k, compute total hours = Σ ceil(pile / k). If hours ≤ h, k might be feasible — try lower.`,`Use integer ceiling: ceil(a/b) = (a + b - 1) / b.`],inputFormat:`Line 1: space-separated pile sizes
Line 2: h (integer)`,defaultCustomInput:`3 6 7 11
8`,testCases:[{label:`Example 1`,input:`piles=[3,6,7,11], h=8`,expected:`4`},{label:`Example 2`,input:`piles=[30,11,23,4,20], h=5`,expected:`30`},{label:`h=6 case`,input:`piles=[30,11,23,4,20], h=6`,expected:`23`},{label:`Single pile`,input:`piles=[1000000000], h=2`,expected:`500000000`}],cppStarter:`class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {

    }
};`,pythonStarter:`from typing import List
import math

class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> piles = {3,6,7,11};
    int got = sol.minEatingSpeed(piles, 8);
    cout << "\\n---RESULT---\\n";
    if (got == 4) cout << "RESULT:PASS:4:" << got << "\\n";
    else          cout << "RESULT:FAIL:4:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed = 0, total = 4;
    vector<string> res;
    auto chk = [&](vector<int> p, int h, int exp, int n) {
        int got = sol.minEatingSpeed(p, h);
        bool ok = got == exp; passed += ok;
        res.push_back("TEST:" + to_string(n) + (ok?":PASS:":":FAIL:") + to_string(exp) + ":" + to_string(got));
    };
    chk({3,6,7,11},      8,         4, 1);
    chk({30,11,23,4,20}, 5,        30, 2);
    chk({30,11,23,4,20}, 6,        23, 3);
    chk({1000000000},    2, 500000000, 4);
    cout << "\\n---RESULT---\\n";
    for (auto& s : res) cout << s << "\\n";
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`3 6 7 11`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`8`);return`
int main() {
    Solution sol;
    vector<int> piles = {${S(n)}};
    cout << sol.minEatingSpeed(piles, ${r}) << "\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.minEatingSpeed([3,6,7,11], 8)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==4 else 'FAIL'}:4:{got}")`;if(e===`submit`)return`
sol = Solution()
cases = [([3,6,7,11],8,4),([30,11,23,4,20],5,30),([30,11,23,4,20],6,23),([1000000000],2,500000000)]
passed=0; res=[]
for i,(p,h,exp) in enumerate(cases,1):
    got=sol.minEatingSpeed(list(p),h); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`3 6 7 11`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`8`);return`
sol = Solution()
print(sol.minEatingSpeed([${n.join(`,`)}], ${r}))`}}},{id:`aggressive-cows`,title:`Aggressive Cows`,difficulty:`Medium`,category:`binary-search`,askedBy:`himali`,description:[`Given <code>n</code> stall positions and <code>k</code> cows, place the cows in stalls so that the <strong>minimum distance</strong> between any two cows is <strong>maximised</strong>.`,`Return that maximum possible minimum distance.`],examples:[{input:`stalls = [1,2,4,8,9],  k = 3`,output:`3`,explanation:`Place cows at positions 1, 4, 9. Distances: 3 and 5. Minimum is 3.`},{input:`stalls = [1,2,3],  k = 2`,output:`2`,explanation:`Place cows at 1 and 3.`}],constraints:[`2 ≤ k ≤ n ≤ 10⁵`,`0 ≤ stalls[i] ≤ 10⁹`,`All stall positions are distinct`],hints:[`Sort the stall positions. Binary search on the minimum distance (range: [1, stalls[n-1] - stalls[0]]).`,`For a candidate distance d, greedily place cows: start at stalls[0], then place the next cow at the first stall ≥ prev + d. Count placements.`,`If you can place ≥ k cows with minimum gap d, try a larger d.`],inputFormat:`Line 1: space-separated stall positions
Line 2: k (integer)`,defaultCustomInput:`1 2 4 8 9
3`,testCases:[{label:`Example 1`,input:`stalls=[1,2,4,8,9], k=3`,expected:`3`},{label:`Example 2`,input:`stalls=[1,2,3], k=2`,expected:`2`},{label:`All k cows`,input:`stalls=[1,2,4,8,9], k=5`,expected:`1`},{label:`Large gap`,input:`stalls=[1,10,20,30], k=2`,expected:`29`}],cppStarter:`class Solution {
public:
    int aggressiveCows(vector<int>& stalls, int k) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def aggressiveCows(self, stalls: List[int], k: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> s = {1,2,4,8,9};
    int got = sol.aggressiveCows(s, 3);
    cout << "\\n---RESULT---\\n";
    if (got==3) cout << "RESULT:PASS:3:" << got << "\\n";
    else        cout << "RESULT:FAIL:3:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<int> s,int k,int exp,int n){
        int got=sol.aggressiveCows(s,k); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,2,4,8,9},3,3,1);
    chk({1,2,3},2,2,2);
    chk({1,2,4,8,9},5,1,3);
    chk({1,10,20,30},2,29,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 2 4 8 9`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`3`);return`
int main() {
    Solution sol;
    vector<int> s = {${S(n)}};
    cout << sol.aggressiveCows(s, ${r}) << "\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.aggressiveCows([1,2,4,8,9], 3)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`;if(e===`submit`)return`
sol = Solution()
cases = [([1,2,4,8,9],3,3),([1,2,3],2,2),([1,2,4,8,9],5,1),([1,10,20,30],2,29)]
passed=0; res=[]
for i,(s,k,exp) in enumerate(cases,1):
    got=sol.aggressiveCows(list(s),k); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 2 4 8 9`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`3`);return`
sol = Solution()
print(sol.aggressiveCows([${n.join(`,`)}], ${r}))`}}},{id:`find-peak-element`,title:`Find Peak Element`,difficulty:`Medium`,category:`binary-search`,askedBy:`himali`,description:[`A peak element is one that is strictly greater than its neighbours. Given an integer array <code>nums</code>, find a peak element and return its index.`,`Assume <code>nums[-1] = nums[n] = -∞</code>. You may return the index of any peak.`,`Must run in <code>O(log n)</code> time.`],examples:[{input:`nums = [1,2,3,1]`,output:`2`,explanation:`3 is a peak (3 > 2 and 3 > 1).`},{input:`nums = [1,2,1,3,5,6,4]`,output:`5`,explanation:`6 (index 5) is one valid peak; index 1 is another.`}],constraints:[`1 ≤ nums.length ≤ 1000`,`-2³¹ ≤ nums[i] ≤ 2³¹ - 1`,`nums[i] ≠ nums[i+1] for all valid i`],hints:[`Binary search: if nums[mid] < nums[mid+1], a peak must exist in the right half (the element at mid+1 is larger, so the right side is "uphill").`,`Otherwise a peak exists in the left half (including mid).`,`The search converges to a single peak index in O(log n).`],inputFormat:`Line 1: space-separated integers`,defaultCustomInput:`1 2 3 1`,testCases:[{label:`Single peak`,input:`nums=[1,2,3,1]`,expected:`2`},{label:`Left peak`,input:`nums=[3,1]`,expected:`0`},{label:`Right peak`,input:`nums=[1,3]`,expected:`1`},{label:`One element`,input:`nums=[1]`,expected:`0`}],cppStarter:`class Solution {
public:
    int findPeakElement(vector<int>& nums) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> nums = {1,2,3,1};
    int got = sol.findPeakElement(nums);
    cout << "\\n---RESULT---\\n";
    if (got==2) cout << "RESULT:PASS:2:" << got << "\\n";
    else        cout << "RESULT:FAIL:2:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<int> n,int exp,int t){
        int got=sol.findPeakElement(n); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(t)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,2,3,1},2,1);
    chk({3,1},0,2);
    chk({1,3},1,3);
    chk({1},0,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> nums = {${S((t.trim()||`1 2 3 1`).split(/\s+/).map(Number))}};
    cout << sol.findPeakElement(nums) << "\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.findPeakElement([1,2,3,1])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==2 else 'FAIL'}:2:{got}")`;if(e===`submit`)return`
sol = Solution()
cases = [([1,2,3,1],2),([3,1],0),([1,3],1),([1],0)]
passed=0; res=[]
for i,(n,exp) in enumerate(cases,1):
    got=sol.findPeakElement(list(n)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(sol.findPeakElement([${(t.trim()||`1 2 3 1`).split(/\s+/).map(Number).join(`,`)}]))`}},{id:`search-rotated-sorted-array`,title:`Search in Rotated Sorted Array`,difficulty:`Medium`,category:`binary-search`,askedBy:`vjs`,description:[`An integer array <code>nums</code> sorted in ascending order has been rotated at an unknown pivot. Given <code>nums</code> and a <code>target</code>, return the index of <code>target</code> or <code>-1</code> if not present.`,`Must run in <code>O(log n)</code> time.`],examples:[{input:`nums = [4,5,6,7,0,1,2],  target = 0`,output:`4`},{input:`nums = [4,5,6,7,0,1,2],  target = 3`,output:`-1`}],constraints:[`1 ≤ nums.length ≤ 5000`,`-10⁴ ≤ nums[i], target ≤ 10⁴`,`All values are unique`],hints:[`At any mid point, one half is always sorted. Determine which half.`,`If left half is sorted (nums[lo] ≤ nums[mid]) and target is in [nums[lo], nums[mid]], search left; else search right.`,`Mirror logic for the right half.`],inputFormat:`Line 1: space-separated integers
Line 2: target`,defaultCustomInput:`4 5 6 7 0 1 2
0`,testCases:[{label:`Example 1`,input:`nums=[4,5,6,7,0,1,2], target=0`,expected:`4`},{label:`Not found`,input:`nums=[4,5,6,7,0,1,2], target=3`,expected:`-1`},{label:`One elem`,input:`nums=[1], target=0`,expected:`-1`},{label:`Two elems`,input:`nums=[1,3], target=3`,expected:`1`}],cppStarter:`class Solution {
public:
    int search(vector<int>& nums, int target) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> nums = {4,5,6,7,0,1,2};
    int got = sol.search(nums, 0);
    cout << "\\n---RESULT---\\n";
    if (got==4) cout << "RESULT:PASS:4:" << got << "\\n";
    else        cout << "RESULT:FAIL:4:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<int> n,int t,int exp,int tc){
        int got=sol.search(n,t); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(tc)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({4,5,6,7,0,1,2},0,4,1);
    chk({4,5,6,7,0,1,2},3,-1,2);
    chk({1},0,-1,3);
    chk({1,3},3,1,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`4 5 6 7 0 1 2`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`0`);return`
int main() {
    Solution sol;
    vector<int> nums = {${S(n)}};
    cout << sol.search(nums, ${r}) << "\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.search([4,5,6,7,0,1,2], 0)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==4 else 'FAIL'}:4:{got}")`;if(e===`submit`)return`
sol = Solution()
cases = [([4,5,6,7,0,1,2],0,4),([4,5,6,7,0,1,2],3,-1),([1],0,-1),([1,3],3,1)]
passed=0; res=[]
for i,(n,t,exp) in enumerate(cases,1):
    got=sol.search(list(n),t); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`4 5 6 7 0 1 2`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`0`);return`
sol = Solution()
print(sol.search([${n.join(`,`)}], ${r}))`}}},{id:`painters-partition`,title:`Painters Partition Problem`,difficulty:`Hard`,category:`binary-search`,askedBy:`vjs`,description:[`Given <code>n</code> boards of lengths and <code>k</code> painters, each painter paints a contiguous section. Every painter takes 1 unit of time per unit of board length.`,`All painters work simultaneously. Return the <strong>minimum time</strong> to paint all boards.`],examples:[{input:`boards = [10,20,30,40],  k = 2`,output:`60`,explanation:`Painter 1: [10,20,30] = 60. Painter 2: [40] = 40. Max = 60.`},{input:`boards = [10,20,30,40],  k = 4`,output:`40`,explanation:`One painter per board. Time = max board = 40.`}],constraints:[`1 ≤ k ≤ n ≤ 10⁵`,`1 ≤ boards[i] ≤ 10⁶`],hints:[`Binary search on the answer (time). Range: [max(boards), sum(boards)].`,`For a given time t, greedily check: how many painters are needed? Assign each painter as many boards as possible without exceeding t.`,`If painters needed ≤ k, t is feasible — try lower.`],inputFormat:`Line 1: space-separated board lengths
Line 2: k (integer)`,defaultCustomInput:`10 20 30 40
2`,testCases:[{label:`Example 1`,input:`boards=[10,20,30,40], k=2`,expected:`60`},{label:`Example 2`,input:`boards=[10,20,30,40], k=4`,expected:`40`},{label:`2 painters`,input:`boards=[7,2,5,10,8], k=2`,expected:`18`},{label:`1 painter`,input:`boards=[5,5,5,5], k=1`,expected:`20`}],cppStarter:`class Solution {
public:
    int minTime(vector<int>& boards, int k) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def minTime(self, boards: List[int], k: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> b = {10,20,30,40};
    int got = sol.minTime(b, 2);
    cout << "\\n---RESULT---\\n";
    if (got==60) cout << "RESULT:PASS:60:" << got << "\\n";
    else         cout << "RESULT:FAIL:60:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<int> b,int k,int exp,int n){
        int got=sol.minTime(b,k); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({10,20,30,40},2,60,1);
    chk({10,20,30,40},4,40,2);
    chk({7,2,5,10,8},2,18,3);
    chk({5,5,5,5},1,20,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`10 20 30 40`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`2`);return`
int main() {
    Solution sol;
    vector<int> b = {${S(n)}};
    cout << sol.minTime(b, ${r}) << "\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.minTime([10,20,30,40], 2)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==60 else 'FAIL'}:60:{got}")`;if(e===`submit`)return`
sol = Solution()
cases = [([10,20,30,40],2,60),([10,20,30,40],4,40),([7,2,5,10,8],2,18),([5,5,5,5],1,20)]
passed=0; res=[]
for i,(b,k,exp) in enumerate(cases,1):
    got=sol.minTime(list(b),k); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`10 20 30 40`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`2`);return`
sol = Solution()
print(sol.minTime([${n.join(`,`)}], ${r}))`}}},{id:`magic-powder`,title:`Magic Powder`,difficulty:`Medium`,category:`binary-search`,askedBy:`vjs`,description:[`You are baking cookies. Each batch requires <code>a[i]</code> units of ingredient <code>i</code>. You have <code>b[i]</code> units of ingredient <code>i</code> and <code>k</code> bags of magic powder (each bag replaces 1 unit of any ingredient).`,`Return the maximum number of complete cookie batches you can bake.`],examples:[{input:`a = [2,1,4],  b = [11,3,16],  k = 1`,output:`4`,explanation:`Batch 4 needs 8,4,16. You have 11,3,16 — only 1 unit of ingredient 2 short. Use 1 bag of magic powder.`},{input:`a = [2,1,4],  b = [11,3,16],  k = 0`,output:`3`,explanation:`Without powder: min(11/2, 3/1, 16/4) = min(5,3,4) = 3.`}],constraints:[`1 ≤ n ≤ 10⁵`,`0 ≤ k ≤ 10⁹`,`1 ≤ a[i] ≤ 10⁹`,`0 ≤ b[i] ≤ 10⁹`],hints:[`Binary search on the number of batches m.`,`For m batches, total magic powder needed = Σ max(0, m*a[i] − b[i]). If this ≤ k, m batches are feasible.`,`Watch for overflow: use long long for intermediate products.`],inputFormat:`Line 1: n k
Line 2: a[0] … a[n-1]
Line 3: b[0] … b[n-1]`,defaultCustomInput:`3 1
2 1 4
11 3 16`,testCases:[{label:`Example 1`,input:`a=[2,1,4], b=[11,3,16], k=1`,expected:`4`},{label:`No powder`,input:`a=[2,1,4], b=[11,3,16], k=0`,expected:`3`},{label:`Plenty`,input:`a=[1,1,1], b=[3,3,3], k=3`,expected:`4`},{label:`All powder`,input:`a=[5], b=[0], k=10`,expected:`2`}],cppStarter:`class Solution {
public:
    long long maxBatches(vector<long long>& a, vector<long long>& b, long long k) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def maxBatches(self, a: List[int], b: List[int], k: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<long long> a={2,1,4}, b={11,3,16};
    long long got = sol.maxBatches(a, b, 1);
    cout << "\\n---RESULT---\\n";
    if (got==4) cout << "RESULT:PASS:4:" << got << "\\n";
    else        cout << "RESULT:FAIL:4:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<long long> a,vector<long long> b,long long k,long long exp,int n){
        long long got=sol.maxBatches(a,b,k); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({2,1,4},{11,3,16},1,4,1);
    chk({2,1,4},{11,3,16},0,3,2);
    chk({1,1,1},{3,3,3},3,4,3);
    chk({5},{0},10,2,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),[,n]=(e[0]||`3 1`).trim().split(/\s+/).map(Number),r=(e[1]||`2 1 4`).trim().split(/\s+/).map(Number),i=(e[2]||`11 3 16`).trim().split(/\s+/).map(Number);return`
int main() {
    Solution sol;
    vector<long long> a={${S(r)}}, b={${S(i)}};
    cout << sol.maxBatches(a, b, ${n}) << "\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.maxBatches([2,1,4],[11,3,16],1)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==4 else 'FAIL'}:4:{got}")`;if(e===`submit`)return`
sol = Solution()
cases = [([2,1,4],[11,3,16],1,4),([2,1,4],[11,3,16],0,3),([1,1,1],[3,3,3],3,4),([5],[0],10,2)]
passed=0; res=[]
for i,(a,b,k,exp) in enumerate(cases,1):
    got=sol.maxBatches(list(a),list(b),k); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),[,n]=(e[0]||`3 1`).trim().split(/\s+/).map(Number),r=(e[1]||`2 1 4`).trim().split(/\s+/).map(Number),i=(e[2]||`11 3 16`).trim().split(/\s+/).map(Number);return`
sol = Solution()
print(sol.maxBatches([${r.join(`,`)}],[${i.join(`,`)}],${n}))`}}}],w=e=>e.join(`, `),ee=[{id:`fractional-knapsack`,title:`Fractional Knapsack`,difficulty:`Easy`,category:`greedy`,askedBy:`himali`,description:[`Given weights and values of <code>n</code> items and a knapsack capacity <code>W</code>, find the maximum total value you can carry.`,`Unlike 0/1 knapsack, you can take <strong>fractions</strong> of an item.`],examples:[{input:`W=50, val=[60,100,120], wt=[10,20,30]`,output:`240.00`,explanation:`Take all of item 0 (60), all of item 1 (100), 20/30 of item 2 (80). Total = 240.`},{input:`W=10, val=[500], wt=[30]`,output:`166.67`,explanation:`Take 10/30 of the item: 500 × (10/30) ≈ 166.67.`}],constraints:[`1 ≤ n ≤ 1000`,`1 ≤ W ≤ 10⁶`,`1 ≤ val[i], wt[i] ≤ 10⁶`],hints:[`Sort items by value/weight ratio in descending order.`,`Greedily fill the knapsack: take as much of the best-ratio item as possible, then move to the next.`,`If the knapsack can fit an entire item, add its full value; otherwise add a fraction.`],inputFormat:`Line 1: W
Line 2: space-separated values
Line 3: space-separated weights`,defaultCustomInput:`50
60 100 120
10 20 30`,testCases:[{label:`Example 1`,input:`W=50, val=[60,100,120], wt=[10,20,30]`,expected:`240.00`},{label:`Fraction`,input:`W=10, val=[500], wt=[30]`,expected:`166.67`},{label:`W=0`,input:`W=0, val=[60,100], wt=[10,20]`,expected:`0.00`},{label:`Exact fit`,input:`W=30, val=[60,100,120], wt=[10,20,30]`,expected:`160.00`}],cppStarter:`class Solution {
public:
    double fractionalKnapsack(int W, vector<int>& val, vector<int>& wt) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def fractionalKnapsack(self, W: int, val: List[int], wt: List[int]) -> float:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> val={60,100,120}, wt={10,20,30};
    double got = sol.fractionalKnapsack(50, val, wt);
    cout << "\\n---RESULT---\\n";
    if (abs(got-240.0)<0.01) cout << "RESULT:PASS:240.00:" << fixed << setprecision(2) << got << "\\n";
    else                     cout << "RESULT:FAIL:240.00:" << fixed << setprecision(2) << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4;
    vector<string> res;
    auto chk=[&](int W,vector<int> v,vector<int> w,double exp,int n){
        double got=sol.fractionalKnapsack(W,v,w);
        bool ok=abs(got-exp)<0.01; passed+=ok;
        ostringstream o; o<<fixed<<setprecision(2)<<exp; string es=o.str();
        ostringstream g; g<<fixed<<setprecision(2)<<got; string gs=g.str();
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+es+":"+gs);
    };
    chk(50,{60,100,120},{10,20,30},240.0,1);
    chk(10,{500},{30},500.0/3.0,2);
    chk(0,{60,100},{10,20},0.0,3);
    chk(30,{60,100,120},{10,20,30},160.0,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=parseInt(e[0]??`50`),r=(e[1]||`60 100 120`).trim().split(/\s+/).map(Number),i=(e[2]||`10 20 30`).trim().split(/\s+/).map(Number);return`
int main() {
    Solution sol;
    vector<int> val={${w(r)}}, wt={${w(i)}};
    cout << fixed << setprecision(2) << sol.fractionalKnapsack(${n}, val, wt) << "\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.fractionalKnapsack(50,[60,100,120],[10,20,30])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if abs(got-240.0)<0.01 else 'FAIL'}:240.00:{got:.2f}")`;if(e===`submit`)return`
sol = Solution()
cases=[(50,[60,100,120],[10,20,30],240.0),(10,[500],[30],500/3),(0,[60,100],[10,20],0.0),(30,[60,100,120],[10,20,30],160.0)]
passed=0; res=[]
for i,(W,v,w,exp) in enumerate(cases,1):
    got=sol.fractionalKnapsack(W,list(v),list(w)); ok=abs(got-exp)<0.01; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp:.2f}:{got:.2f}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=parseInt(e[0]??`50`),r=(e[1]||`60 100 120`).trim().split(/\s+/).map(Number),i=(e[2]||`10 20 30`).trim().split(/\s+/).map(Number);return`
sol = Solution()
print(f"{sol.fractionalKnapsack(${n},[${r.join(`,`)}],[${i.join(`,`)}]):.2f}")`}}},{id:`minimum-coins`,title:`Minimum Coins`,difficulty:`Easy`,category:`greedy`,askedBy:`himali`,description:[`Given coin denominations and an amount, return the minimum number of coins needed to make that amount using a greedy approach.`,`Denominations are given in sorted order and satisfy the greedy property (each denomination divides the next).`],examples:[{input:`coins=[1,5,10,25], amount=36`,output:`3`,explanation:`25 + 10 + 1 = 36 using 3 coins.`},{input:`coins=[1,5,10,25], amount=30`,output:`2`,explanation:`25 + 5 = 30 using 2 coins.`}],constraints:[`1 ≤ coins.length ≤ 10`,`1 ≤ coins[i] ≤ 10⁴`,`0 ≤ amount ≤ 10⁴`],hints:[`Sort denominations in descending order.`,`Greedily pick the largest coin that fits. Subtract it from the amount and repeat.`,`This works when denominations are canonical (e.g., 1,5,10,25). For arbitrary denominations, use DP.`],inputFormat:`Line 1: space-separated coin values
Line 2: amount`,defaultCustomInput:`1 5 10 25
36`,testCases:[{label:`Example 1`,input:`coins=[1,5,10,25], amount=36`,expected:`3`},{label:`Example 2`,input:`coins=[1,5,10,25], amount=30`,expected:`2`},{label:`Zero`,input:`coins=[1,5,10,25], amount=0`,expected:`0`},{label:`4 coins`,input:`coins=[1,5,10,25], amount=100`,expected:`4`}],cppStarter:`class Solution {
public:
    int minCoins(vector<int>& coins, int amount) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def minCoins(self, coins: List[int], amount: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> c={1,5,10,25};
    int got=sol.minCoins(c,36);
    cout<<"\\n---RESULT---\\n";
    if(got==3) cout<<"RESULT:PASS:3:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:3:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> c,int a,int exp,int n){
        int got=sol.minCoins(c,a); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,5,10,25},36,3,1);
    chk({1,5,10,25},30,2,2);
    chk({1,5,10,25},0,0,3);
    chk({1,5,10,25},100,4,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 5 10 25`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`36`);return`
int main() {
    Solution sol;
    vector<int> c={${w(n)}};
    cout<<sol.minCoins(c,${r})<<"\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.minCoins([1,5,10,25],36)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([1,5,10,25],36,3),([1,5,10,25],30,2),([1,5,10,25],0,0),([1,5,10,25],100,4)]
passed=0; res=[]
for i,(c,a,exp) in enumerate(cases,1):
    got=sol.minCoins(list(c),a); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 5 10 25`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`36`);return`
sol = Solution()
print(sol.minCoins([${n.join(`,`)}],${r}))`}}},{id:`minimum-platforms`,title:`Minimum Platforms (Railway Station)`,difficulty:`Medium`,category:`greedy`,askedBy:`himali`,description:[`Given arrival and departure times of trains at a station, find the minimum number of platforms needed so no train waits.`,`Trains arrive and depart at times given as integers (e.g., 900 = 9:00 AM).`],examples:[{input:`arr=[900,940,950,1100,1500,1800], dep=[910,1200,1120,1130,1900,2000]`,output:`3`,explanation:`At 9:50 three trains overlap: the 9:00, 9:40, and 9:50 arrivals.`},{input:`arr=[900,1100], dep=[1100,1200]`,output:`1`,explanation:`First train departs when second arrives — 1 platform suffices.`}],constraints:[`1 ≤ n ≤ 10⁵`,`0 ≤ arr[i] < dep[i] ≤ 2359`],hints:[`Sort arrivals and departures separately.`,`Use two pointers: increment platform count when a train arrives before the earliest remaining departure.`,`Track the running max of platforms needed.`],inputFormat:`Line 1: space-separated arrival times
Line 2: space-separated departure times`,defaultCustomInput:`900 940 950 1100 1500 1800
910 1200 1120 1130 1900 2000`,testCases:[{label:`Example 1`,input:`arr=[900,940,950,1100,1500,1800], dep=[910,1200,1120,1130,1900,2000]`,expected:`3`},{label:`Example 2`,input:`arr=[900,1100], dep=[1100,1200]`,expected:`1`},{label:`Single`,input:`arr=[900], dep=[910]`,expected:`1`},{label:`All overlap`,input:`arr=[100,200,300,400], dep=[500,600,700,800]`,expected:`4`}],cppStarter:`class Solution {
public:
    int findPlatform(vector<int>& arr, vector<int>& dep) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def findPlatform(self, arr: List[int], dep: List[int]) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> a={900,940,950,1100,1500,1800}, d={910,1200,1120,1130,1900,2000};
    int got=sol.findPlatform(a,d);
    cout<<"\\n---RESULT---\\n";
    if(got==3) cout<<"RESULT:PASS:3:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:3:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,vector<int> d,int exp,int n){
        int got=sol.findPlatform(a,d); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({900,940,950,1100,1500,1800},{910,1200,1120,1130,1900,2000},3,1);
    chk({900,1100},{1100,1200},1,2);
    chk({900},{910},1,3);
    chk({100,200,300,400},{500,600,700,800},4,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`900 940 950 1100 1500 1800`).trim().split(/\s+/).map(Number),r=(e[1]||`910 1200 1120 1130 1900 2000`).trim().split(/\s+/).map(Number);return`
int main() {
    Solution sol;
    vector<int> a={${w(n)}}, d={${w(r)}};
    cout<<sol.findPlatform(a,d)<<"\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.findPlatform([900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000],3),([900,1100],[1100,1200],1),([900],[910],1),([100,200,300,400],[500,600,700,800],4)]
passed=0; res=[]
for i,(a,d,exp) in enumerate(cases,1):
    got=sol.findPlatform(list(a),list(d)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`900 940 950 1100 1500 1800`).trim().split(/\s+/).map(Number),r=(e[1]||`910 1200 1120 1130 1900 2000`).trim().split(/\s+/).map(Number);return`
sol = Solution()
print(sol.findPlatform([${n.join(`,`)}],[${r.join(`,`)}]))`}}},{id:`candy`,title:`Candy`,difficulty:`Hard`,category:`greedy`,askedBy:`himali`,description:[`There are <code>n</code> children with ratings. Give each child at least 1 candy. Children with a higher rating than their immediate neighbour must receive more candies.`,`Return the minimum total number of candies.`],examples:[{input:`ratings = [1,0,2]`,output:`5`,explanation:`Give [2,1,2]. Total = 5.`},{input:`ratings = [1,2,2]`,output:`4`,explanation:`Give [1,2,1]. The third child does not need more than the second since ratings are equal.`}],constraints:[`n ≥ 1`,`0 ≤ ratings[i] ≤ 2×10⁴`],hints:[`Two-pass greedy: initialise all candies to 1.`,`Left-to-right pass: if ratings[i] > ratings[i-1], candies[i] = candies[i-1] + 1.`,`Right-to-left pass: if ratings[i] > ratings[i+1], candies[i] = max(candies[i], candies[i+1] + 1). Sum the result.`],inputFormat:`Line 1: space-separated ratings`,defaultCustomInput:`1 0 2`,testCases:[{label:`Example 1`,input:`ratings=[1,0,2]`,expected:`5`},{label:`Example 2`,input:`ratings=[1,2,2]`,expected:`4`},{label:`Descending`,input:`ratings=[3,2,1]`,expected:`6`},{label:`Valley`,input:`ratings=[1,2,3,4,3,2,1]`,expected:`16`}],cppStarter:`class Solution {
public:
    int candy(vector<int>& ratings) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def candy(self, ratings: List[int]) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> r={1,0,2};
    int got=sol.candy(r);
    cout<<"\\n---RESULT---\\n";
    if(got==5) cout<<"RESULT:PASS:5:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:5:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> r,int exp,int n){
        int got=sol.candy(r); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,0,2},5,1);
    chk({1,2,2},4,2);
    chk({3,2,1},6,3);
    chk({1,2,3,4,3,2,1},16,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> r={${w((t.trim()||`1 0 2`).split(/\s+/).map(Number))}};
    cout<<sol.candy(r)<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.candy([1,0,2])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==5 else 'FAIL'}:5:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([1,0,2],5),([1,2,2],4),([3,2,1],6),([1,2,3,4,3,2,1],16)]
passed=0; res=[]
for i,(r,exp) in enumerate(cases,1):
    got=sol.candy(list(r)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(sol.candy([${(t.trim()||`1 0 2`).split(/\s+/).map(Number).join(`,`)}]))`}},{id:`jump-game`,title:`Jump Game`,difficulty:`Medium`,category:`greedy`,askedBy:`vjs`,description:[`Given an array <code>nums</code> where <code>nums[i]</code> is your maximum jump length from index <code>i</code>, return <code>true</code> if you can reach the last index starting from index 0.`],examples:[{input:`nums = [2,3,1,1,4]`,output:`true`,explanation:`Jump 1 step to index 1, then 3 steps to the last index.`},{input:`nums = [3,2,1,0,4]`,output:`false`,explanation:`You always reach index 3, which has jump 0 — you are stuck.`}],constraints:[`1 ≤ nums.length ≤ 3×10⁴`,`0 ≤ nums[i] ≤ 10⁵`],hints:[`Track the furthest index reachable at each step.`,`At index i, update max_reach = max(max_reach, i + nums[i]).`,`If you ever reach an index beyond max_reach, return false. If max_reach ≥ last index, return true.`],inputFormat:`Line 1: space-separated integers`,defaultCustomInput:`2 3 1 1 4`,testCases:[{label:`Can reach`,input:`nums=[2,3,1,1,4]`,expected:`1`},{label:`Stuck`,input:`nums=[3,2,1,0,4]`,expected:`0`},{label:`Single`,input:`nums=[0]`,expected:`1`},{label:`Long zero`,input:`nums=[1,1,1,1,0]`,expected:`1`}],cppStarter:`class Solution {
public:
    bool canJump(vector<int>& nums) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> n={2,3,1,1,4};
    int got=sol.canJump(n)?1:0;
    cout<<"\\n---RESULT---\\n";
    if(got==1) cout<<"RESULT:PASS:1:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:1:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> n,int exp,int t){
        int got=sol.canJump(n)?1:0; bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(t)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({2,3,1,1,4},1,1);
    chk({3,2,1,0,4},0,2);
    chk({0},1,3);
    chk({1,1,1,1,0},1,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> n={${w((t.trim()||`2 3 1 1 4`).split(/\s+/).map(Number))}};
    cout<<(sol.canJump(n)?1:0)<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = 1 if sol.canJump([2,3,1,1,4]) else 0
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==1 else 'FAIL'}:1:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([2,3,1,1,4],1),([3,2,1,0,4],0),([0],1),([1,1,1,1,0],1)]
passed=0; res=[]
for i,(n,exp) in enumerate(cases,1):
    got=1 if sol.canJump(list(n)) else 0; ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(1 if sol.canJump([${(t.trim()||`2 3 1 1 4`).split(/\s+/).map(Number).join(`,`)}]) else 0)`}},{id:`lru-cache`,title:`LRU Cache`,difficulty:`Medium`,category:`greedy`,askedBy:`vjs`,description:[`Design a data structure that follows the constraints of a <strong>Least Recently Used (LRU)</strong> cache.`,`Implement <code>LRUCache(capacity)</code>, <code>get(key)</code> (return value or -1 if missing), and <code>put(key, value)</code> (insert/update; evict LRU if at capacity).`,`Both operations must run in <code>O(1)</code> average time.`],examples:[{input:`LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2); put(4,4); get(1); get(3); get(4)`,output:`[1,-1,-1,3,4]`,explanation:`After put(3,3), key 2 is evicted (LRU). After put(4,4), key 1 is evicted.`}],constraints:[`1 ≤ capacity ≤ 3000`,`0 ≤ key, value ≤ 10⁴`,`At most 2×10⁵ calls`],hints:[`Use a doubly-linked list to track usage order (most recent at head, LRU at tail).`,`Use a hash map from key → list node for O(1) access.`,`On get/put: move the node to the head. On eviction: remove the tail node.`],inputFormat:`Sequence of operations (run mode uses hardcoded sequence)`,defaultCustomInput:``,testCases:[{label:`LeetCode ex`,input:`cap=2; put(1,1);put(2,2);get(1);put(3,3);get(2);put(4,4);get(1);get(3);get(4)`,expected:`1,-1,-1,3,4`},{label:`Cap 1`,input:`cap=1; put(2,1);get(2);put(3,2);get(2);get(3)`,expected:`1,-1,2`},{label:`Overwrite`,input:`cap=2; put(1,1);put(2,2);put(1,10);get(1)`,expected:`10`},{label:`Miss`,input:`cap=2; put(1,1);get(2)`,expected:`-1`}],cppStarter:`class LRUCache {
    int cap;
    list<pair<int,int>> lst;
    unordered_map<int, list<pair<int,int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {

    }

    void put(int key, int value) {

    }
};`,pythonStarter:`class LRUCache:
    def __init__(self, capacity: int):


    def get(self, key: int) -> int:


    def put(self, key: int, value: int) -> None:
        `,buildCppHarness(e,t=``){let n=`
    LRUCache c(2);
    c.put(1,1); c.put(2,2);
    string got="";
    got+=to_string(c.get(1)); c.put(3,3);
    got+=","+to_string(c.get(2)); c.put(4,4);
    got+=","+to_string(c.get(1));
    got+=","+to_string(c.get(3));
    got+=","+to_string(c.get(4));`;if(e===`run`)return`
int main() {${n}
    cout<<"\\n---RESULT---\\n";
    string exp="1,-1,-1,3,4";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    int passed=0,total=4; vector<string> res;
    {${n}
     string exp="1,-1,-1,3,4"; bool ok=got==exp; passed+=ok;
     res.push_back("TEST:1"+(ok?string(":PASS:"):string(":FAIL:"))+exp+":"+got);}
    {LRUCache c(1); c.put(2,1); string got=to_string(c.get(2)); c.put(3,2); got+=","+to_string(c.get(2)); got+=","+to_string(c.get(3));
     string exp="1,-1,2"; bool ok=got==exp; passed+=ok;
     res.push_back("TEST:2"+(ok?string(":PASS:"):string(":FAIL:"))+exp+":"+got);}
    {LRUCache c(2); c.put(1,1); c.put(2,2); c.put(1,10); string got=to_string(c.get(1));
     string exp="10"; bool ok=got==exp; passed+=ok;
     res.push_back("TEST:3"+(ok?string(":PASS:"):string(":FAIL:"))+exp+":"+got);}
    {LRUCache c(2); c.put(1,1); string got=to_string(c.get(2));
     string exp="-1"; bool ok=got==exp; passed+=ok;
     res.push_back("TEST:4"+(ok?string(":PASS:"):string(":FAIL:"))+exp+":"+got);}
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":4\\n";
    return passed==4?0:1;
}`;if(e===`custom`)return`
int main() {
    cout << "Use run/submit mode for LRU Cache" << "\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
c = LRUCache(2)
c.put(1,1); c.put(2,2)
r = [c.get(1)]
c.put(3,3); r.append(c.get(2)); c.put(4,4)
r.append(c.get(1)); r.append(c.get(3)); r.append(c.get(4))
got=",".join(map(str,r))
exp="1,-1,-1,3,4"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
passed=0; res=[]
def chk(n,got,exp):
    global passed
    ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
c=LRUCache(2); c.put(1,1); c.put(2,2); r=[c.get(1)]; c.put(3,3); r.append(c.get(2)); c.put(4,4); r.append(c.get(1)); r.append(c.get(3)); r.append(c.get(4))
chk(1,",".join(map(str,r)),"1,-1,-1,3,4")
c=LRUCache(1); c.put(2,1); r=[c.get(2)]; c.put(3,2); r.append(c.get(2)); r.append(c.get(3))
chk(2,",".join(map(str,r)),"1,-1,2")
c=LRUCache(2); c.put(1,1); c.put(2,2); c.put(1,10)
chk(3,str(c.get(1)),"10")
c=LRUCache(2); c.put(1,1)
chk(4,str(c.get(2)),"-1")
print("\\n---RESULT---")
for r2 in res: print(r2)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`
print("Use run/submit mode for LRU Cache")`}},{id:`merge-intervals`,title:`Merge Intervals`,difficulty:`Medium`,category:`greedy`,askedBy:`vjs`,description:[`Given an array of intervals, merge all overlapping intervals and return the result.`],examples:[{input:`intervals = [[1,3],[2,6],[8,10],[15,18]]`,output:`[[1,6],[8,10],[15,18]]`},{input:`intervals = [[1,4],[4,5]]`,output:`[[1,5]]`}],constraints:[`1 ≤ intervals.length ≤ 10⁴`,`intervals[i].length == 2`,`0 ≤ start ≤ end ≤ 10⁴`],hints:[`Sort intervals by start time.`,`Iterate: if current interval overlaps with the last merged interval, extend it. Otherwise add it.`,`Two intervals overlap if current.start ≤ merged.end.`],inputFormat:`Each line: start end (one interval per line)`,defaultCustomInput:`1 3
2 6
8 10
15 18`,testCases:[{label:`Example 1`,input:`[[1,3],[2,6],[8,10],[15,18]]`,expected:`[[1,6],[8,10],[15,18]]`},{label:`Example 2`,input:`[[1,4],[4,5]]`,expected:`[[1,5]]`},{label:`No overlap`,input:`[[1,2],[3,4],[5,6]]`,expected:`[[1,2],[3,4],[5,6]]`},{label:`One swallows`,input:`[[1,10],[2,3],[4,5]]`,expected:`[[1,10]]`}],cppStarter:`class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        `,buildCppHarness(e,t=``){let n=`auto fmt=[](vector<vector<int>> v){string s="[";for(int i=0;i<(int)v.size();i++){s+="["+to_string(v[i][0])+","+to_string(v[i][1])+"]";if(i+1<(int)v.size())s+=",";}return s+"]";};`;if(e===`run`)return`
int main() {
    Solution sol;
    ${n}
    vector<vector<int>> iv={{1,3},{2,6},{8,10},{15,18}};
    string got=fmt(sol.merge(iv)), exp="[[1,6],[8,10],[15,18]]";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    ${n}
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<vector<int>> iv,string exp,int n){
        string got=fmt(sol.merge(iv)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({{1,3},{2,6},{8,10},{15,18}},"[[1,6],[8,10],[15,18]]",1);
    chk({{1,4},{4,5}},"[[1,5]]",2);
    chk({{1,2},{3,4},{5,6}},"[[1,2],[3,4],[5,6]]",3);
    chk({{1,10},{2,3},{4,5}},"[[1,10]]",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<vector<int>> iv={${t.trim().split(`
`).map(e=>e.trim().split(/\s+/).map(Number)).filter(e=>e.length===2).map(([e,t])=>`{${e},${t}}`).join(`,`)}};
    auto r=sol.merge(iv);
    cout<<"[";
    for(int i=0;i<(int)r.size();i++){cout<<"["<<r[i][0]<<","<<r[i][1]<<"]";if(i+1<(int)r.size())cout<<",";}
    cout<<"]\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = str(sol.merge([[1,3],[2,6],[8,10],[15,18]])).replace(" ","")
exp = "[[1,6],[8,10],[15,18]]"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
sol = Solution()
passed=0; res=[]
def chk(n,iv,exp):
    global passed
    got=str(sol.merge(iv)).replace(" ",""); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[[1,3],[2,6],[8,10],[15,18]],"[[1,6],[8,10],[15,18]]")
chk(2,[[1,4],[4,5]],"[[1,5]]")
chk(3,[[1,2],[3,4],[5,6]],"[[1,2],[3,4],[5,6]]")
chk(4,[[1,10],[2,3],[4,5]],"[[1,10]]")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`
sol = Solution()
iv = [${t.trim().split(`
`).map(e=>JSON.stringify(e.trim().split(/\s+/).map(Number))).join(`,`)}]
print(sol.merge(iv))`}},{id:`valid-parentheses`,title:`Valid Parentheses`,difficulty:`Easy`,category:`greedy`,askedBy:`vjs`,description:[`Given a string containing only <code>(</code>, <code>)</code>, <code>{</code>, <code>}</code>, <code>[</code>, <code>]</code>, determine if the input string is valid.`,`A string is valid if every open bracket is closed by the correct type in the correct order.`],examples:[{input:`s = "()"`,output:`true`},{input:`s = "()[]{}"`,output:`true`},{input:`s = "(]"`,output:`false`}],constraints:[`1 ≤ s.length ≤ 10⁴`,`s consists only of parentheses characters`],hints:[`Use a stack. Push opening brackets. On closing bracket, check if top of stack matches.`,`If stack is empty at a closing bracket, or top does not match, return false.`,`After scanning, return true only if the stack is empty.`],inputFormat:`Line 1: bracket string`,defaultCustomInput:`()[]{}`,testCases:[{label:`Valid pair`,input:`s="()"`,expected:`1`},{label:`Mixed valid`,input:`s="()[]{}"`,expected:`1`},{label:`Mismatch`,input:`s="(]"`,expected:`0`},{label:`Interleaved`,input:`s="([)]"`,expected:`0`}],cppStarter:`class Solution {
public:
    bool isValid(string s) {

    }
};`,pythonStarter:`class Solution:
    def isValid(self, s: str) -> bool:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    int got=sol.isValid("()")?1:0;
    cout<<"\\n---RESULT---\\n";
    if(got==1) cout<<"RESULT:PASS:1:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:1:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](string s,int exp,int n){
        int got=sol.isValid(s)?1:0; bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk("()",1,1);
    chk("()[]{}",1,2);
    chk("(]",0,3);
    chk("([)]",0,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    cout<<(sol.isValid("${(t.trim()||`()[]{}`).replace(/\\/g,`\\\\`).replace(/"/g,`\\"`)}")?1:0)<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = 1 if sol.isValid("()") else 0
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==1 else 'FAIL'}:1:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[("()",1),("()[]{}",1),("(]",0),("([)]",0)]
passed=0; res=[]
for i,(s,exp) in enumerate(cases,1):
    got=1 if sol.isValid(s) else 0; ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(1 if sol.isValid("${(t.trim()||`()[]{}`).replace(/\\/g,`\\\\`).replace(/"/g,`\\"`)}") else 0)`}}],te=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),T=o(((e,t)=>{t.exports=te()}))();function ne(e,t){if(t==null||!e[t])return{positions:{},edges:[],items:[],svgW:300,svgH:94};let n=[{idx:t,depth:0,offset:0,span:1}],r={},i=[],a={},o=[];for(;n.length;){let{idx:t,depth:r,offset:i,span:s}=n.shift();if(!e[t])continue;a[r]=(a[r]||0)+1,o.push({idx:t,depth:r,offset:i,span:s});let c=e[t];c.left!=null&&n.push({idx:c.left,depth:r+1,offset:i,span:s/2}),c.right!=null&&n.push({idx:c.right,depth:r+1,offset:i+s/2,span:s/2})}let s=Math.max(...o.map(e=>e.depth)),c=Math.max(300,2**s*36);return o.forEach(({idx:e,depth:t,offset:n,span:i})=>{r[e]={x:(n+i/2)*c,y:t*64+30}}),o.forEach(({idx:t})=>{let n=e[t];n.left!=null&&r[n.left]&&i.push({x1:r[t].x,y1:r[t].y,x2:r[n.left].x,y2:r[n.left].y}),n.right!=null&&r[n.right]&&i.push({x1:r[t].x,y1:r[t].y,x2:r[n.right].x,y2:r[n.right].y})}),{positions:r,edges:i,svgW:c,svgH:(s+1)*64+30,items:o}}function re({nodes:e,root:t=0,highlight:n=new Set,highlightColor:r=`var(--warn)`,label:i=``}){let{positions:a,edges:o,svgW:s,svgH:c,items:l}=ne(e,t);return!l||l.length===0?null:(0,T.jsxs)(`div`,{className:`viz-tree-wrap`,children:[i&&(0,T.jsx)(`div`,{className:`viz-label`,children:i}),(0,T.jsxs)(`svg`,{viewBox:`0 0 ${s} ${c}`,width:s,height:c,className:`viz-tree`,children:[o.map((e,t)=>(0,T.jsx)(`line`,{x1:e.x1,y1:e.y1,x2:e.x2,y2:e.y2,stroke:`var(--border-bright)`,strokeWidth:2},t)),l.map(({idx:t})=>{let{x:i,y:o}=a[t],s=e[t].val,c=n.has(s);return(0,T.jsxs)(`g`,{children:[(0,T.jsx)(`circle`,{cx:i,cy:o,r:16,fill:c?r:`var(--surface-3)`,stroke:c?r:`var(--border-bright)`,strokeWidth:2}),(0,T.jsx)(`text`,{x:i,y:o+5,textAnchor:`middle`,fontSize:12,fill:`var(--text)`,fontFamily:`monospace`,children:s})]},t)})]})]})}var ie=`
TreeNode* buildTree(vector<int> a) {
    if(a.empty()||a[0]==-1) return nullptr;
    auto root=new TreeNode(a[0]);
    queue<TreeNode*> q; q.push(root);
    for(int i=1;i<(int)a.size();){
        auto node=q.front(); q.pop();
        if(i<(int)a.size()&&a[i]!=-1){node->left=new TreeNode(a[i]);q.push(node->left);}i++;
        if(i<(int)a.size()&&a[i]!=-1){node->right=new TreeNode(a[i]);q.push(node->right);}i++;
    }
    return root;
}
TreeNode* findNode(TreeNode* root,int val){
    if(!root)return nullptr;
    if(root->val==val)return root;
    auto l=findNode(root->left,val);
    return l?l:findNode(root->right,val);
}`,ae=`
from collections import deque
def buildTree(a):
    if not a or a[0] is None: return None
    root=TreeNode(a[0]); q=deque([root]); i=1
    while q and i<len(a):
        node=q.popleft()
        if i<len(a) and a[i] is not None: node.left=TreeNode(a[i]); q.append(node.left)
        i+=1
        if i<len(a) and a[i] is not None: node.right=TreeNode(a[i]); q.append(node.right)
        i+=1
    return root
def findNode(root,val):
    if not root: return None
    if root.val==val: return root
    return findNode(root.left,val) or findNode(root.right,val)`,oe=[{id:`lca-binary-tree`,title:`Lowest Common Ancestor of a Binary Tree`,difficulty:`Medium`,category:`binary-trees`,askedBy:`himali`,description:[`Given a binary tree and two nodes <code>p</code> and <code>q</code>, return their lowest common ancestor (LCA).`,`The LCA is the deepest node that has both <code>p</code> and <code>q</code> as descendants (a node is a descendant of itself).`],examples:[{input:`root=[3,5,1,6,2,0,8,-1,-1,7,4], p=5, q=1`,output:`3`},{input:`root=[3,5,1,6,2,0,8,-1,-1,7,4], p=5, q=4`,output:`5`,explanation:`Node 5 is an ancestor of 4.`}],constraints:[`2 ≤ nodes ≤ 10⁵`,`All node values are unique`,`p ≠ q`,`Both p and q exist in the tree`],hints:[`Recurse: if root is null, return null. If root equals p or q, return root.`,`Recurse left and right. If both return non-null, root is the LCA.`,`Otherwise return whichever subtree returned non-null.`],inputFormat:`Conceptual — use run/submit modes`,defaultCustomInput:``,testCases:[{label:`Root LCA`,input:`tree=[3,5,1,6,2,0,8], p=5, q=1`,expected:`3`},{label:`Ancestor`,input:`tree=[3,5,1,6,2,0,8], p=5, q=6`,expected:`5`},{label:`Simple`,input:`tree=[1,2,3], p=2, q=3`,expected:`1`},{label:`Deep`,input:`tree=[1,2,3,4,5], p=4, q=5`,expected:`2`}],cppStarter:`struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {

    }
};`,pythonStarter:`class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def lowestCommonAncestor(self, root, p, q):
        `,buildCppHarness(e,t=``){let n=ie;if(e===`run`)return`
${n}
int main() {
    Solution sol;
    auto root=buildTree({3,5,1,6,2,0,8,-1,-1,7,4});
    auto p=findNode(root,5), q=findNode(root,1);
    auto got=sol.lowestCommonAncestor(root,p,q);
    cout<<"\\n---RESULT---\\n";
    if(got&&got->val==3) cout<<"RESULT:PASS:3:"<<got->val<<"\\n";
    else cout<<"RESULT:FAIL:3:"<<(got?to_string(got->val):"-1")<<"\\n";
    return 0;
}`;if(e===`submit`)return`
${n}
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,int pv,int qv,int exp,int n){
        auto root=buildTree(a);
        auto p=findNode(root,pv),q=findNode(root,qv);
        auto got=sol.lowestCommonAncestor(root,p,q);
        int gv=got?got->val:-1; bool ok=gv==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(gv));
    };
    chk({3,5,1,6,2,0,8,-1,-1,7,4},5,1,3,1);
    chk({3,5,1,6,2,0,8,-1,-1,7,4},5,6,5,2);
    chk({1,2,3},2,3,1,3);
    chk({1,2,3,4,5},4,5,2,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){let n=ae;if(e===`run`)return`
${n}
sol = Solution()
root=buildTree([3,5,1,6,2,0,8,None,None,7,4])
p=findNode(root,5); q=findNode(root,1)
got=sol.lowestCommonAncestor(root,p,q)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got and got.val==3 else 'FAIL'}:3:{got.val if got else -1}")`;if(e===`submit`)return`
${n}
sol = Solution()
passed=0; res=[]
def chk(n,a,pv,qv,exp):
    global passed
    root=buildTree(a); p=findNode(root,pv); q=findNode(root,qv)
    got=sol.lowestCommonAncestor(root,p,q)
    gv=got.val if got else -1; ok=gv==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{gv}")
chk(1,[3,5,1,6,2,0,8,None,None,7,4],5,1,3)
chk(2,[3,5,1,6,2,0,8,None,None,7,4],5,6,5)
chk(3,[1,2,3],2,3,1)
chk(4,[1,2,3,4,5],4,5,2)
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`burn-binary-tree`,title:`Burn Binary Tree`,difficulty:`Hard`,category:`binary-trees`,askedBy:`himali`,description:[`Given a binary tree and a target leaf node, fire starts at the target. Each second, fire spreads to parent, left child, and right child.`,`Return the number of seconds to burn the entire tree.`],examples:[{input:`root=[1,2,3,4,5,6,7], target=5`,output:`3`,explanation:`Sec 0: {5}. Sec 1: {2}. Sec 2: {1,4}. Sec 3: {3}. Fully burned at sec 3.`}],constraints:[`1 ≤ nodes ≤ 10⁵`,`All node values unique`,`target is a leaf`],hints:[`Build a parent-pointer map via BFS.`,`Multi-source BFS from target: each level = 1 second. Spread to left, right, parent.`,`Use a visited set. The answer is the number of BFS levels − 1.`],inputFormat:`Conceptual — use run/submit modes`,defaultCustomInput:``,testCases:[{label:`Example`,input:`tree=[1,2,3,4,5,6,7], target=5`,expected:`3`},{label:`Root leaf`,input:`tree=[1], target=1`,expected:`0`},{label:`Deep right`,input:`tree=[1,2,3,-1,-1,-1,4], target=4`,expected:`3`},{label:`Left chain`,input:`tree=[1,2,-1,3,-1], target=3`,expected:`2`}],cppStarter:`struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    int timeToBurn(TreeNode* root, int target) {

    }
};`,pythonStarter:`class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def timeToBurn(self, root, target: int) -> int:
        `,buildCppHarness(e,t=``){let n=ie;if(e===`run`)return`
${n}
int main() {
    Solution sol;
    auto root=buildTree({1,2,3,4,5,6,7});
    int got=sol.timeToBurn(root,5);
    cout<<"\\n---RESULT---\\n";
    if(got==3) cout<<"RESULT:PASS:3:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:3:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
${n}
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,int t,int exp,int n){
        int got=sol.timeToBurn(buildTree(a),t); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,2,3,4,5,6,7},5,3,1);
    chk({1},1,0,2);
    chk({1,2,3,-1,-1,-1,4},4,3,3);
    chk({1,2,-1,3,-1},3,2,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){let n=ae;if(e===`run`)return`
${n}
sol = Solution()
got=sol.timeToBurn(buildTree([1,2,3,4,5,6,7]),5)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`;if(e===`submit`)return`
${n}
sol = Solution()
passed=0; res=[]
def chk(n,a,t,exp):
    global passed
    got=sol.timeToBurn(buildTree(a),t); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[1,2,3,4,5,6,7],5,3)
chk(2,[1],1,0)
chk(3,[1,2,3,None,None,None,4],4,3)
chk(4,[1,2,None,3,None],3,2)
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`morris-traversal`,title:`Morris Preorder / Inorder Traversal`,difficulty:`Hard`,category:`binary-trees`,askedBy:`himali`,description:[`Traverse a binary tree in <strong>preorder</strong> and <strong>inorder</strong> using <strong>O(1) extra space</strong> (Morris Traversal — no stack, no recursion).`,`Return both traversals.`],examples:[{input:`root=[1,2,3,4,5,6,7]`,output:`preorder=[1,2,4,5,3,6,7], inorder=[4,2,5,1,6,3,7]`}],constraints:[`0 ≤ nodes ≤ 10⁵`],hints:[`Morris uses threaded binary trees. For inorder: find the inorder predecessor of current node; if its right is null, thread it to current and move left. Else unthread it, visit current, move right.`,`For preorder: visit current before moving left (instead of after unthreading).`,`No additional data structures needed beyond a few pointers.`],inputFormat:`Conceptual — use run/submit modes`,defaultCustomInput:``,testCases:[{label:`Full tree`,input:`tree=[1,2,3,4,5,6,7]`,expected:`pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7`},{label:`Single`,input:`tree=[1]`,expected:`pre:1|in:1`},{label:`Left skew`,input:`tree=[3,2,-1,1,-1]`,expected:`pre:3,2,1|in:1,2,3`},{label:`Right skew`,input:`tree=[1,-1,2,-1,3]`,expected:`pre:1,2,3|in:1,2,3`}],cppStarter:`struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    vector<int> morrisPreorder(TreeNode* root) {

    }

    vector<int> morrisInorder(TreeNode* root) {

    }
};`,pythonStarter:`class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def morrisPreorder(self, root) -> list:


    def morrisInorder(self, root) -> list:
        `,buildCppHarness(e,t=``){let n=ie,r=`auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`;if(e===`run`)return`
${n}
int main() {
    Solution sol; ${r}
    auto root=buildTree({1,2,3,4,5,6,7});
    string pre=fmtV(sol.morrisPreorder(root));
    string in_=fmtV(sol.morrisInorder(buildTree({1,2,3,4,5,6,7})));
    string got="pre:"+pre+"|in:"+in_;
    string exp="pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
${n}
int main() {
    Solution sol; ${r}
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,string exp,int n){
        string pre=fmtV(sol.morrisPreorder(buildTree(a)));
        string in_=fmtV(sol.morrisInorder(buildTree(a)));
        string got="pre:"+pre+"|in:"+in_;
        bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({1,2,3,4,5,6,7},"pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7",1);
    chk({1},"pre:1|in:1",2);
    chk({3,2,-1,1,-1},"pre:3,2,1|in:1,2,3",3);
    chk({1,-1,2,-1,3},"pre:1,2,3|in:1,2,3",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){let n=ae;if(e===`run`)return`
${n}
sol = Solution()
pre=",".join(map(str,sol.morrisPreorder(buildTree([1,2,3,4,5,6,7]))))
in_=",".join(map(str,sol.morrisInorder(buildTree([1,2,3,4,5,6,7]))))
got=f"pre:{pre}|in:{in_}"; exp="pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
${n}
sol = Solution()
passed=0; res=[]
def chk(n,a,exp):
    global passed
    pre=",".join(map(str,sol.morrisPreorder(buildTree(a))))
    in_=",".join(map(str,sol.morrisInorder(buildTree(a))))
    got=f"pre:{pre}|in:{in_}"; ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[1,2,3,4,5,6,7],"pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7")
chk(2,[1],"pre:1|in:1")
chk(3,[3,2,None,1,None],"pre:3,2,1|in:1,2,3")
chk(4,[1,None,2,None,3],"pre:1,2,3|in:1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`children-sum-property`,title:`Children Sum Property in Binary Tree`,difficulty:`Medium`,category:`binary-trees`,askedBy:`vjs`,description:[`Given a binary tree, change node values so that every non-leaf node equals the sum of its children.`,`You may only <strong>increase</strong> node values (not decrease). Return the modified tree's root.`,`The property must hold for all non-leaf nodes.`],examples:[{input:`root=[2,35,10,2,3,5,2]`,output:`root=[45,35,10,2,3,5,2] (or any valid result)`}],constraints:[`1 ≤ nodes ≤ 10⁵`,`1 ≤ node.val ≤ 10⁴`],hints:[`DFS: at each node, set it to max(node.val, left.val + right.val) first, then propagate updates downward.`,`After setting children, recurse into children, then update parent to children sum on the way back up.`,`Two-pass approach: first pass pushes larger values down, second pass pushes sums back up.`],inputFormat:`Conceptual — use run/submit modes`,defaultCustomInput:``,testCases:[{label:`GFG ex`,input:`tree=[2,35,10,2,3,5,2]`,expected:`valid`},{label:`Single`,input:`tree=[5]`,expected:`valid`},{label:`Two nodes`,input:`tree=[1,2]`,expected:`valid`},{label:`Already`,input:`tree=[10,4,6,1,3,2,4]`,expected:`valid`}],cppStarter:`struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    void changeTree(TreeNode* root) {

    }
};`,pythonStarter:`class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def changeTree(self, root) -> None:
        `,buildCppHarness(e,t=``){let n=ie,r=`
bool verify(TreeNode* root){
    if(!root||(!root->left&&!root->right)) return true;
    int s=0; if(root->left)s+=root->left->val; if(root->right)s+=root->right->val;
    return root->val==s && verify(root->left) && verify(root->right);
}`;if(e===`run`)return`
${n}${r}
int main() {
    Solution sol;
    auto root=buildTree({2,35,10,2,3,5,2});
    sol.changeTree(root);
    int ok=verify(root)?1:0;
    cout<<"\\n---RESULT---\\n";
    if(ok) cout<<"RESULT:PASS:valid:valid\\n";
    else   cout<<"RESULT:FAIL:valid:invalid\\n";
    return 0;
}`;if(e===`submit`)return`
${n}${r}
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,int n){
        auto root=buildTree(a); sol.changeTree(root);
        bool ok=verify(root); passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:valid:valid":":FAIL:valid:invalid"));
    };
    chk({2,35,10,2,3,5,2},1);
    chk({5},2);
    chk({1,2},3);
    chk({10,4,6,1,3,2,4},4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){let n=ae;if(e===`run`)return`
${n}
def verify(root):
    if not root or (not root.left and not root.right): return True
    s=(root.left.val if root.left else 0)+(root.right.val if root.right else 0)
    return root.val==s and verify(root.left) and verify(root.right)
sol = Solution()
root=buildTree([2,35,10,2,3,5,2]); sol.changeTree(root)
ok=verify(root)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if ok else 'FAIL'}:valid:{'valid' if ok else 'invalid'}")`;if(e===`submit`)return`
${n}
def verify(root):
    if not root or (not root.left and not root.right): return True
    s=(root.left.val if root.left else 0)+(root.right.val if root.right else 0)
    return root.val==s and verify(root.left) and verify(root.right)
sol = Solution()
passed=0; res=[]
def chk(n,a):
    global passed
    root=buildTree(a); sol.changeTree(root); ok=verify(root); passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:valid:{'valid' if ok else 'invalid'}")
chk(1,[2,35,10,2,3,5,2]); chk(2,[5]); chk(3,[1,2]); chk(4,[10,4,6,1,3,2,4])
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`zigzag-level-order`,title:`Binary Tree Zigzag Level Order Traversal`,difficulty:`Medium`,category:`binary-trees`,askedBy:`vjs`,description:[`Given a binary tree, return the zigzag level order traversal of its node values.`,`Even levels (0-indexed) go left-to-right; odd levels go right-to-left.`],examples:[{input:`root=[3,9,20,-1,-1,15,7]`,output:`[[3],[20,9],[15,7]]`},{input:`root=[1]`,output:`[[1]]`}],constraints:[`0 ≤ nodes ≤ 2000`,`-100 ≤ node.val ≤ 100`],hints:[`Standard BFS level-order traversal.`,`After collecting each level, reverse it if the level index is odd (0-indexed).`,`Use a deque or just reverse the level vector on alternating levels.`],inputFormat:`Conceptual — use run/submit modes`,defaultCustomInput:``,testCases:[{label:`Example 1`,input:`tree=[3,9,20,-1,-1,15,7]`,expected:`[[3],[20,9],[15,7]]`},{label:`Single`,input:`tree=[1]`,expected:`[[1]]`},{label:`2 levels`,input:`tree=[1,2,3]`,expected:`[[1],[3,2]]`},{label:`3 levels`,input:`tree=[1,2,3,4,5,6,7]`,expected:`[[1],[3,2],[4,5,6,7]]`}],cppStarter:`struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {

    }
};`,pythonStarter:`from typing import List

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def zigzagLevelOrder(self, root) -> List[List[int]]:
        `,buildCppHarness(e,t=``){let n=ie,r=`auto fmtR=[](vector<vector<int>> v){string s="[";for(int i=0;i<(int)v.size();i++){s+="[";for(int j=0;j<(int)v[i].size();j++){if(j)s+=",";s+=to_string(v[i][j]);}s+="]";if(i+1<(int)v.size())s+=",";}return s+"]";};`;if(e===`run`)return`
${n}
int main() {
    Solution sol; ${r}
    string got=fmtR(sol.zigzagLevelOrder(buildTree({3,9,20,-1,-1,15,7})));
    string exp="[[3],[20,9],[15,7]]";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
${n}
int main() {
    Solution sol; ${r}
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,string exp,int n){
        string got=fmtR(sol.zigzagLevelOrder(buildTree(a))); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({3,9,20,-1,-1,15,7},"[[3],[20,9],[15,7]]",1);
    chk({1},"[[1]]",2);
    chk({1,2,3},"[[1],[3,2]]",3);
    chk({1,2,3,4,5,6,7},"[[1],[3,2],[4,5,6,7]]",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){let n=ae;if(e===`run`)return`
${n}
sol = Solution()
got=str(sol.zigzagLevelOrder(buildTree([3,9,20,None,None,15,7]))).replace(" ","")
exp="[[3],[20,9],[15,7]]"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
${n}
sol = Solution()
passed=0; res=[]
def chk(n,a,exp):
    global passed
    got=str(sol.zigzagLevelOrder(buildTree(a))).replace(" ",""); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[3,9,20,None,None,15,7],"[[3],[20,9],[15,7]]")
chk(2,[1],"[[1]]")
chk(3,[1,2,3],"[[1],[3,2]]")
chk(4,[1,2,3,4,5,6,7],"[[1],[3,2],[4,5,6,7]]")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`construct-bt-preorder-inorder`,title:`Construct Binary Tree from Preorder and Inorder`,difficulty:`Medium`,category:`binary-trees`,askedBy:`vjs`,description:[`Given <code>preorder</code> and <code>inorder</code> traversal arrays of a binary tree, construct and return the tree.`],examples:[{input:`preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]`,output:`[3,9,20,-1,-1,15,7]`}],constraints:[`1 ≤ n ≤ 3000`,`All values are unique`],hints:[`The first element of preorder is always the root.`,`Find the root in inorder — elements to its left form the left subtree, right form the right subtree.`,`Use a hashmap for O(1) inorder index lookup. Recurse with adjusted index ranges.`],inputFormat:`Conceptual — use run/submit modes`,defaultCustomInput:``,testCases:[{label:`Example`,input:`pre=[3,9,20,15,7], in=[9,3,15,20,7]`,expected:`[3,9,20,-1,-1,15,7]`},{label:`Single`,input:`pre=[1], in=[1]`,expected:`[1]`},{label:`Two nodes`,input:`pre=[1,2], in=[2,1]`,expected:`[1,2,-1]`},{label:`Right skew`,input:`pre=[1,2,3], in=[1,2,3]`,expected:`[1,-1,2,-1,3]`}],cppStarter:`struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {

    }
};`,pythonStarter:`from typing import List

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]):
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> pre={3,9,20,15,7}, in_={9,3,15,20,7};
    auto root=sol.buildTree(pre,in_);
    function<void(TreeNode*,vector<int>&)> inord=[&](TreeNode* r,vector<int>& v){if(!r)return;inord(r->left,v);v.push_back(r->val);inord(r->right,v);};
    vector<int> result; inord(root,result);
    string got="",exp="9,3,15,20,7";
    for(int i=0;i<(int)result.size();i++){if(i)got+=",";got+=to_string(result[i]);}
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    function<void(TreeNode*,vector<int>&)> inord=[&](TreeNode* r,vector<int>& v){if(!r)return;inord(r->left,v);v.push_back(r->val);inord(r->right,v);};
    auto joinV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    auto chk=[&](vector<int> pre,vector<int> in_,string expIn,int n){
        auto root=sol.buildTree(pre,in_);
        vector<int> gi; inord(root,gi);
        string gis=joinV(gi);
        bool ok=(gis==expIn); passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+expIn+":"+gis);
    };
    chk({3,9,20,15,7},{9,3,15,20,7},"9,3,15,20,7",1);
    chk({1},{1},"1",2);
    chk({1,2},{2,1},"2,1",3);
    chk({1,2,3},{1,2,3},"1,2,3",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
pre=[3,9,20,15,7]; in_=[9,3,15,20,7]
root=sol.buildTree(pre,in_)
def inorder(r):
    if not r: return []
    return inorder(r.left)+[r.val]+inorder(r.right)
got=",".join(map(str,inorder(root))); exp="9,3,15,20,7"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
sol = Solution()
passed=0; res=[]
def inorder(r):
    if not r: return []
    return inorder(r.left)+[r.val]+inorder(r.right)
def chk(n,pre,in_,expIn):
    global passed
    root=sol.buildTree(pre,in_)
    got=",".join(map(str,inorder(root))); ok=got==expIn; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{expIn}:{got}")
chk(1,[3,9,20,15,7],[9,3,15,20,7],"9,3,15,20,7")
chk(2,[1],[1],"1")
chk(3,[1,2],[2,1],"2,1")
chk(4,[1,2,3],[1,2,3],"1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`boundary-traversal-bt`,title:`Boundary Traversal of Binary Tree`,difficulty:`Medium`,category:`binary-trees`,askedBy:`vjs`,description:[`Return the boundary nodes of a binary tree in anti-clockwise order starting from the root.`,`Boundary = left boundary (top to bottom, excluding leaf) + all leaf nodes (left to right) + right boundary (bottom to top, excluding leaf).`],examples:[{input:`root=[1,2,3,4,5,6,7]`,output:`[1,2,4,5,6,7,3]`}],constraints:[`1 ≤ nodes ≤ 10⁵`],hints:[`Split into three parts: left boundary (go left when possible, else right; stop at leaf), leaves (DFS collect all leaves), right boundary (go right when possible, else left; collect in reverse).`,`Exclude the root from left/right boundary traversal (add it separately at the start).`,`Combine: root + left boundary + leaves + reversed right boundary.`],inputFormat:`Conceptual — use run/submit modes`,defaultCustomInput:``,testCases:[{label:`Full tree`,input:`tree=[1,2,3,4,5,6,7]`,expected:`1,2,4,5,6,7,3`},{label:`Single`,input:`tree=[1]`,expected:`1`},{label:`Left skew`,input:`tree=[1,2,-1,3,-1]`,expected:`1,2,3`},{label:`Two children`,input:`tree=[1,2,3]`,expected:`1,2,3`}],cppStarter:`struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    vector<int> boundaryOfBinaryTree(TreeNode* root) {

    }
};`,pythonStarter:`from typing import List

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def boundaryOfBinaryTree(self, root) -> List[int]:
        `,buildCppHarness(e,t=``){let n=ie,r=`auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`;if(e===`run`)return`
${n}
int main() {
    Solution sol; ${r}
    string got=fmtV(sol.boundaryOfBinaryTree(buildTree({1,2,3,4,5,6,7})));
    string exp="1,2,4,5,6,7,3";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
${n}
int main() {
    Solution sol; ${r}
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,string exp,int n){
        string got=fmtV(sol.boundaryOfBinaryTree(buildTree(a))); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({1,2,3,4,5,6,7},"1,2,4,5,6,7,3",1);
    chk({1},"1",2);
    chk({1,2,-1,3,-1},"1,2,3",3);
    chk({1,2,3},"1,2,3",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){let n=ae;if(e===`run`)return`
${n}
sol = Solution()
got=",".join(map(str,sol.boundaryOfBinaryTree(buildTree([1,2,3,4,5,6,7]))))
exp="1,2,4,5,6,7,3"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
${n}
sol = Solution()
passed=0; res=[]
def chk(n,a,exp):
    global passed
    got=",".join(map(str,sol.boundaryOfBinaryTree(buildTree(a)))); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[1,2,3,4,5,6,7],"1,2,4,5,6,7,3")
chk(2,[1],"1")
chk(3,[1,2,None,3,None],"1,2,3")
chk(4,[1,2,3],"1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}}];function se(){return(0,T.jsx)(re,{nodes:[{val:3,left:1,right:2},{val:5,left:3,right:4},{val:1,left:5,right:6},{val:6,left:null,right:null},{val:2,left:7,right:8},{val:0,left:null,right:null},{val:8,left:null,right:null},{val:7,left:null,right:null},{val:4,left:null,right:null}],root:0,highlight:new Set([3,5,6,4]),highlightColor:`var(--accent)`,label:`LCA(6, 4) = 3 — highlighted path`})}function ce(){return(0,T.jsx)(re,{nodes:[{val:1,left:1,right:2},{val:2,left:3,right:4},{val:3,left:null,right:null},{val:4,left:null,right:null},{val:5,left:null,right:null}],root:0,highlight:new Set([1]),highlightColor:`var(--error)`,label:`Fire starts at node 1`})}function le(){return(0,T.jsx)(re,{nodes:[{val:3,left:1,right:2},{val:9,left:null,right:null},{val:20,left:3,right:4},{val:15,left:null,right:null},{val:7,left:null,right:null}],root:0,highlight:new Set([]),label:`Zig-zag: [[3],[20,9],[15,7]]`})}var E={"lca-binary-tree":()=>(0,T.jsx)(se,{}),"burn-binary-tree":()=>(0,T.jsx)(ce,{}),"zigzag-level-order":()=>(0,T.jsx)(le,{})},D=e=>e.join(`, `),ue=[{id:`connect-sticks`,title:`Minimum Cost to Connect Sticks`,difficulty:`Medium`,category:`heap`,askedBy:`himali`,description:[`You have <code>n</code> sticks with given lengths. To connect two sticks the cost equals their combined length. Return the minimum cost to connect all sticks into one.`],examples:[{input:`sticks = [2,4,3]`,output:`14`,explanation:`Connect 2+3=5 (cost 5), then 4+5=9 (cost 9). Total = 14.`},{input:`sticks = [1,8,3,5]`,output:`30`}],constraints:[`1 ≤ sticks.length ≤ 10⁴`,`1 ≤ sticks[i] ≤ 10⁴`],hints:[`Use a min-heap. Always merge the two smallest sticks.`,`After merging, push the new stick back. Repeat until one stick remains.`,`This is the same idea as Huffman encoding.`],inputFormat:`Line 1: space-separated stick lengths`,defaultCustomInput:`2 4 3`,testCases:[{label:`Example 1`,input:`sticks=[2,4,3]`,expected:`14`},{label:`Example 2`,input:`sticks=[1,8,3,5]`,expected:`30`},{label:`Single`,input:`sticks=[5]`,expected:`0`},{label:`Equal`,input:`sticks=[1,1,1,1]`,expected:`8`}],cppStarter:`class Solution {
public:
    int connectSticks(vector<int>& sticks) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def connectSticks(self, sticks: List[int]) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> s={2,4,3};
    int got=sol.connectSticks(s);
    cout<<"\\n---RESULT---\\n";
    if(got==14) cout<<"RESULT:PASS:14:"<<got<<"\\n";
    else        cout<<"RESULT:FAIL:14:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> s,int exp,int n){
        int got=sol.connectSticks(s); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({2,4,3},14,1);
    chk({1,8,3,5},30,2);
    chk({5},0,3);
    chk({1,1,1,1},8,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> s={${D((t.trim()||`2 4 3`).split(/\s+/).map(Number))}};
    cout<<sol.connectSticks(s)<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=sol.connectSticks([2,4,3])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==14 else 'FAIL'}:14:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([2,4,3],14),([1,8,3,5],30),([5],0),([1,1,1,1],8)]
passed=0; res=[]
for i,(s,exp) in enumerate(cases,1):
    got=sol.connectSticks(list(s)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(sol.connectSticks([${(t.trim()||`2 4 3`).split(/\s+/).map(Number).join(`,`)}]))`}},{id:`find-median-data-stream`,title:`Find Median from Data Stream`,difficulty:`Hard`,category:`heap`,askedBy:`himali`,description:[`Design a data structure that supports adding integers from a stream and finding the median at any point.`,`Implement <code>addNum(num)</code> and <code>findMedian()</code>. Median is the middle value; if even count, it's the average of the two middle values.`],examples:[{input:`addNum(1); addNum(2); findMedian(); addNum(3); findMedian()`,output:`1.50, 2.00`}],constraints:[`-10⁵ ≤ num ≤ 10⁵`,`At most 5×10⁴ calls`],hints:[`Use two heaps: a max-heap for the lower half, a min-heap for the upper half.`,`Keep them balanced (size difference ≤ 1). The max-heap's top (or average of both tops) is the median.`,`On addNum: add to max-heap, move max-heap top to min-heap, rebalance if min-heap is larger.`],inputFormat:`Sequence of operations (use run/submit modes)`,defaultCustomInput:``,testCases:[{label:`Three nums`,input:`add(1),add(2),median,add(3),median`,expected:`1.50,2.00`},{label:`Even count`,input:`add(1),add(3),median`,expected:`2.00`},{label:`Odd count`,input:`add(1),add(2),add(3),median`,expected:`2.00`},{label:`Negatives`,input:`add(-1),add(-2),add(-3),median`,expected:`-2.00`}],cppStarter:`class MedianFinder {
    priority_queue<int> lo;                            // max-heap (lower half)
    priority_queue<int,vector<int>,greater<int>> hi;   // min-heap (upper half)
public:
    MedianFinder() {}

    void addNum(int num) {

    }

    double findMedian() {

    }
};`,pythonStarter:`import heapq

class MedianFinder:
    def __init__(self):


    def addNum(self, num: int) -> None:


    def findMedian(self) -> float:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    MedianFinder mf;
    mf.addNum(1); mf.addNum(2);
    double m1=mf.findMedian();
    mf.addNum(3);
    double m2=mf.findMedian();
    string got="",exp="1.50,2.00";
    ostringstream o1; o1<<fixed<<setprecision(2)<<m1; got+=o1.str();
    ostringstream o2; o2<<fixed<<setprecision(2)<<m2; got+=","+o2.str();
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    int passed=0,total=4; vector<string> res;
    auto fmt=[](double v){ostringstream o;o<<fixed<<setprecision(2)<<v;return o.str();};
    {MedianFinder mf; mf.addNum(1);mf.addNum(2);string g=fmt(mf.findMedian());mf.addNum(3);g+=","+fmt(mf.findMedian());
     bool ok=g=="1.50,2.00";passed+=ok;res.push_back("TEST:1"+(ok?string(":PASS:"):string(":FAIL:"))+"1.50,2.00:"+g);}
    {MedianFinder mf; mf.addNum(1);mf.addNum(3);string g=fmt(mf.findMedian());
     bool ok=g=="2.00";passed+=ok;res.push_back("TEST:2"+(ok?string(":PASS:"):string(":FAIL:"))+"2.00:"+g);}
    {MedianFinder mf; mf.addNum(1);mf.addNum(2);mf.addNum(3);string g=fmt(mf.findMedian());
     bool ok=g=="2.00";passed+=ok;res.push_back("TEST:3"+(ok?string(":PASS:"):string(":FAIL:"))+"2.00:"+g);}
    {MedianFinder mf; mf.addNum(-1);mf.addNum(-2);mf.addNum(-3);string g=fmt(mf.findMedian());
     bool ok=g=="-2.00";passed+=ok;res.push_back("TEST:4"+(ok?string(":PASS:"):string(":FAIL:"))+"-2.00:"+g);}
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":4\\n";
    return passed==4?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){if(e===`run`)return`
mf=MedianFinder(); mf.addNum(1); mf.addNum(2)
m1=mf.findMedian(); mf.addNum(3); m2=mf.findMedian()
got=f"{m1:.2f},{m2:.2f}"; exp="1.50,2.00"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
passed=0; res=[]
def chk(n,ops,exp):
    global passed
    mf=MedianFinder(); got_parts=[]
    for op,*args in ops:
        if op=="add": mf.addNum(args[0])
        else: got_parts.append(f"{mf.findMedian():.2f}")
    got=",".join(got_parts); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[("add",1),("add",2),("med",),("add",3),("med",)],"1.50,2.00")
chk(2,[("add",1),("add",3),("med",)],"2.00")
chk(3,[("add",1),("add",2),("add",3),("med",)],"2.00")
chk(4,[("add",-1),("add",-2),("add",-3),("med",)],"-2.00")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`merge-k-sorted-lists`,title:`Merge K Sorted Lists`,difficulty:`Hard`,category:`heap`,askedBy:`himali`,description:[`Given an array of <code>k</code> sorted linked lists, merge them all into one sorted linked list and return it.`],examples:[{input:`lists = [[1,4,5],[1,3,4],[2,6]]`,output:`[1,1,2,3,4,4,5,6]`},{input:`lists = []`,output:`[]`}],constraints:[`0 ≤ k ≤ 10⁴`,`0 ≤ total nodes ≤ 5×10⁴`,`-10⁴ ≤ node.val ≤ 10⁴`],hints:[`Use a min-heap of size k. Initially push the head of each list.`,`Pop the minimum node, add to result, push its next node (if any).`,`Total complexity O(N log k) where N = total nodes.`],inputFormat:`Each line: space-separated values of one sorted list`,defaultCustomInput:`1 4 5
1 3 4
2 6`,testCases:[{label:`Example`,input:`lists=[[1,4,5],[1,3,4],[2,6]]`,expected:`1,1,2,3,4,4,5,6`},{label:`Empty`,input:`lists=[]`,expected:``},{label:`One list`,input:`lists=[[1,2,3]]`,expected:`1,2,3`},{label:`Singles`,input:`lists=[[3],[1],[2]]`,expected:`1,2,3`}],cppStarter:`struct ListNode {
    int val; ListNode* next;
    ListNode(int x):val(x),next(nullptr){}
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {

    }
};`,pythonStarter:`from typing import List, Optional

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        `,buildCppHarness(e,t=``){let n=`
ListNode* makeList(vector<int> v){ListNode* h=nullptr,*t=nullptr;for(int x:v){auto n=new ListNode(x);if(!h)h=t=n;else{t->next=n;t=n;}}return h;}
string listToStr(ListNode* h){string s;while(h){if(s.size())s+=",";s+=to_string(h->val);h=h->next;}return s;}`;if(e===`run`)return`
${n}
int main() {
    Solution sol;
    vector<ListNode*> ls={makeList({1,4,5}),makeList({1,3,4}),makeList({2,6})};
    string got=listToStr(sol.mergeKLists(ls));
    string exp="1,1,2,3,4,4,5,6";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
${n}
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<vector<int>> vv,string exp,int n){
        vector<ListNode*> ls; for(auto& v:vv) ls.push_back(makeList(v));
        string got=listToStr(sol.mergeKLists(ls)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({{1,4,5},{1,3,4},{2,6}},"1,1,2,3,4,4,5,6",1);
    chk({},"",2);
    chk({{1,2,3}},"1,2,3",3);
    chk({{3},{1},{2}},"1,2,3",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
${n}
int main() {
    Solution sol;
    vector<ListNode*> ls={${t.trim().split(`
`).map(e=>e.trim()).filter(Boolean).map(e=>`makeList({${e.split(/\s+/).join(`,`)}})`).join(`,`)}};
    cout<<listToStr(sol.mergeKLists(ls))<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
def makeList(v):
    h=None
    for x in reversed(v): n=ListNode(x); n.next=h; h=n
    return h
def listStr(h):
    r=[]
    while h: r.append(h.val); h=h.next
    return ",".join(map(str,r))
sol=Solution()
ls=[makeList([1,4,5]),makeList([1,3,4]),makeList([2,6])]
got=listStr(sol.mergeKLists(ls)); exp="1,1,2,3,4,4,5,6"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
def makeList(v):
    h=None
    for x in reversed(v): n=ListNode(x); n.next=h; h=n
    return h
def listStr(h):
    r=[]
    while h: r.append(h.val); h=h.next
    return ",".join(map(str,r))
sol=Solution(); passed=0; res=[]
def chk(n,vv,exp):
    global passed
    ls=[makeList(v) for v in vv]
    got=listStr(sol.mergeKLists(ls)); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[[1,4,5],[1,3,4],[2,6]],"1,1,2,3,4,4,5,6")
chk(2,[],"")
chk(3,[[1,2,3]],"1,2,3")
chk(4,[[3],[1],[2]],"1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`
def makeList(v):
    h=None
    for x in reversed(v): n=ListNode(x); n.next=h; h=n
    return h
def listStr(h):
    r=[]
    while h: r.append(h.val); h=h.next
    return ",".join(map(str,r))
sol=Solution()
ls=[makeList(v) for v in [${t.trim().split(`
`).map(e=>JSON.stringify(e.trim().split(/\s+/).map(Number))).join(`,`)}]]
print(listStr(sol.mergeKLists(ls)))`}},{id:`hand-of-straights`,title:`Hand of Straights`,difficulty:`Medium`,category:`heap`,askedBy:`himali`,description:[`A player wants to rearrange a hand of cards into groups of <code>groupSize</code> consecutive cards.`,`Return <code>true</code> if it's possible, <code>false</code> otherwise.`],examples:[{input:`hand=[1,2,3,6,2,3,4,7,8], groupSize=3`,output:`true`,explanation:`[1,2,3], [2,3,4], [6,7,8]`},{input:`hand=[1,2,3,4,5], groupSize=4`,output:`false`,explanation:`Cannot form groups of 4.`}],constraints:[`1 ≤ hand.length ≤ 10⁴`,`0 ≤ hand[i] ≤ 10⁹`,`1 ≤ groupSize ≤ hand.length`],hints:[`Count frequencies. Use a sorted map (or sorted keys + counter).`,`Greedily start each group from the smallest available card.`,`If hand.length % groupSize != 0, return false immediately.`],inputFormat:`Line 1: space-separated card values
Line 2: groupSize`,defaultCustomInput:`1 2 3 6 2 3 4 7 8
3`,testCases:[{label:`Example 1`,input:`hand=[1,2,3,6,2,3,4,7,8], groupSize=3`,expected:`1`},{label:`Example 2`,input:`hand=[1,2,3,4,5], groupSize=4`,expected:`0`},{label:`Size 1`,input:`hand=[1,2,3], groupSize=1`,expected:`1`},{label:`Gap`,input:`hand=[1,2,4,5], groupSize=2`,expected:`1`}],cppStarter:`class Solution {
public:
    bool isNStraightHand(vector<int>& hand, int groupSize) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> h={1,2,3,6,2,3,4,7,8};
    int got=sol.isNStraightHand(h,3)?1:0;
    cout<<"\\n---RESULT---\\n";
    if(got==1) cout<<"RESULT:PASS:1:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:1:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> h,int g,int exp,int n){
        int got=sol.isNStraightHand(h,g)?1:0; bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,2,3,6,2,3,4,7,8},3,1,1);
    chk({1,2,3,4,5},4,0,2);
    chk({1,2,3},1,1,3);
    chk({1,2,4,5},2,1,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 2 3 6 2 3 4 7 8`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`3`);return`
int main() {
    Solution sol;
    vector<int> h={${D(n)}};
    cout<<(sol.isNStraightHand(h,${r})?1:0)<<"\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=1 if sol.isNStraightHand([1,2,3,6,2,3,4,7,8],3) else 0
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==1 else 'FAIL'}:1:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([1,2,3,6,2,3,4,7,8],3,1),([1,2,3,4,5],4,0),([1,2,3],1,1),([1,2,4,5],2,1)]
passed=0; res=[]
for i,(h,g,exp) in enumerate(cases,1):
    got=1 if sol.isNStraightHand(list(h),g) else 0; ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 2 3 6 2 3 4 7 8`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`3`);return`
sol = Solution()
print(1 if sol.isNStraightHand([${n.join(`,`)}],${r}) else 0)`}}},{id:`task-scheduler`,title:`Task Scheduler`,difficulty:`Medium`,category:`heap`,askedBy:`vjs`,description:[`Given a list of CPU tasks and a cooldown <code>n</code> (same task must wait <code>n</code> intervals before running again), return the minimum number of intervals to execute all tasks.`,`CPU can be idle during cooldown.`],examples:[{input:`tasks=["A","A","A","B","B","B"], n=2`,output:`8`,explanation:`A→B→idle→A→B→idle→A→B. 8 intervals.`},{input:`tasks=["A","A","A","B","B","B"], n=0`,output:`6`}],constraints:[`1 ≤ tasks.length ≤ 10⁴`,`0 ≤ n ≤ 100`],hints:[`Count task frequencies. The most frequent task determines the lower bound.`,`Formula: max(len(tasks), (maxFreq - 1) * (n + 1) + countOfMaxFreq).`,`Alternatively: simulate with a max-heap and a cooldown queue.`],inputFormat:`Line 1: space-separated tasks (e.g., A B A B)
Line 2: n`,defaultCustomInput:`A A A B B B
2`,testCases:[{label:`Example 1`,input:`tasks=[A,A,A,B,B,B], n=2`,expected:`8`},{label:`n=0`,input:`tasks=[A,A,A,B,B,B], n=0`,expected:`6`},{label:`All same`,input:`tasks=[A,A,A], n=2`,expected:`7`},{label:`Diverse`,input:`tasks=[A,B,C,D,E,F], n=2`,expected:`6`}],cppStarter:`class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<char> t={'A','A','A','B','B','B'};
    int got=sol.leastInterval(t,2);
    cout<<"\\n---RESULT---\\n";
    if(got==8) cout<<"RESULT:PASS:8:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:8:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<char> t,int n,int exp,int tc){
        int got=sol.leastInterval(t,n); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(tc)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({'A','A','A','B','B','B'},2,8,1);
    chk({'A','A','A','B','B','B'},0,6,2);
    chk({'A','A','A'},2,7,3);
    chk({'A','B','C','D','E','F'},2,6,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`A A A B B B`).trim().split(/\s+/),r=parseInt(e[1]??`2`);return`
int main() {
    Solution sol;
    vector<char> t={${n.map(e=>`'${e}'`).join(`,`)}};
    cout<<sol.leastInterval(t,${r})<<"\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=sol.leastInterval(list("AAABBB"),2)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==8 else 'FAIL'}:8:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[(list("AAABBB"),2,8),(list("AAABBB"),0,6),(list("AAA"),2,7),(list("ABCDEF"),2,6)]
passed=0; res=[]
for i,(t,n,exp) in enumerate(cases,1):
    got=sol.leastInterval(list(t),n); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`A A A B B B`).trim().split(/\s+/),r=parseInt(e[1]??`2`);return`
sol = Solution()
print(sol.leastInterval(${JSON.stringify(n)},${r}))`}}},{id:`kth-largest-stream`,title:`Kth Largest Element in a Stream`,difficulty:`Medium`,category:`heap`,askedBy:`vjs`,description:[`Design a class to find the <code>k</code>-th largest element in a stream of integers.`,`Implement <code>KthLargest(k, nums)</code> constructor and <code>add(val)</code> which returns the k-th largest after inserting <code>val</code>.`],examples:[{input:`KthLargest(3,[4,5,8,2]); add(3); add(5); add(10); add(9); add(4)`,output:`[4,5,5,8,8]`}],constraints:[`1 ≤ k`,`0 ≤ nums.length`,`-10⁴ ≤ nums[i], val ≤ 10⁴`],hints:[`Maintain a min-heap of size k — the heap's top is always the k-th largest.`,`On add: push val. If heap size > k, pop the minimum.`,`Return heap top.`],inputFormat:`Use run/submit modes`,defaultCustomInput:``,testCases:[{label:`LeetCode ex`,input:`k=3, nums=[4,5,8,2], adds=[3,5,10,9,4]`,expected:`4,5,5,8,8`},{label:`k=1`,input:`k=1, nums=[1,2], adds=[3,1,1]`,expected:`3,3,3`},{label:`Empty init`,input:`k=1, nums=[], adds=[1,2,3]`,expected:`1,2,3`},{label:`k=2`,input:`k=2, nums=[0], adds=[1,2,3]`,expected:`0,1,2`}],cppStarter:`class KthLargest {
    int k;
    priority_queue<int,vector<int>,greater<int>> pq; // min-heap of size k
public:
    KthLargest(int k, vector<int>& nums) {

    }

    int add(int val) {

    }
};`,pythonStarter:`import heapq
from typing import List

class KthLargest:
    def __init__(self, k: int, nums: List[int]):


    def add(self, val: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    vector<int> nums={4,5,8,2};
    KthLargest kl(3,nums);
    string got="",exp="4,5,5,8,8";
    for(int v:{3,5,10,9,4}){if(got.size())got+=",";got+=to_string(kl.add(v));}
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    int passed=0,total=4; vector<string> res;
    auto run=[](int k,vector<int> n,vector<int> adds){
        KthLargest kl(k,n); string s;
        for(int v:adds){if(s.size())s+=",";s+=to_string(kl.add(v));}
        return s;
    };
    auto chk=[&](int k,vector<int> n,vector<int> a,string exp,int t){
        string got=run(k,n,a); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(t)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk(3,{4,5,8,2},{3,5,10,9,4},"4,5,5,8,8",1);
    chk(1,{1,2},{3,1,1},"3,3,3",2);
    chk(1,{},{1,2,3},"1,2,3",3);
    chk(2,{0},{1,2,3},"0,1,2",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){if(e===`run`)return`
kl=KthLargest(3,[4,5,8,2])
got=",".join(str(kl.add(v)) for v in [3,5,10,9,4]); exp="4,5,5,8,8"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
passed=0; res=[]
def chk(n,k,nums,adds,exp):
    global passed
    kl=KthLargest(k,nums); got=",".join(str(kl.add(v)) for v in adds)
    ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,3,[4,5,8,2],[3,5,10,9,4],"4,5,5,8,8")
chk(2,1,[1,2],[3,1,1],"3,3,3")
chk(3,1,[],[1,2,3],"1,2,3")
chk(4,2,[0],[1,2,3],"0,1,2")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`design-twitter`,title:`Design Twitter`,difficulty:`Medium`,category:`heap`,askedBy:`vjs`,description:[`Design a simplified Twitter where users can post tweets, follow/unfollow other users, and see the 10 most recent tweets in their news feed.`,`Implement: <code>postTweet(userId, tweetId)</code>, <code>getNewsFeed(userId)</code> (10 most recent from self + followees), <code>follow(followerId, followeeId)</code>, <code>unfollow(followerId, followeeId)</code>.`],examples:[{input:`postTweet(1,5); getNewsFeed(1); follow(1,2); postTweet(2,6); getNewsFeed(1); unfollow(1,2); getNewsFeed(1)`,output:`[[5],[6,5],[5]]`}],constraints:[`1 ≤ userId, followeeId ≤ 500`,`0 ≤ tweetId ≤ 10⁴`,`At most 3×10⁴ calls`],hints:[`Store tweets as (timestamp, tweetId). Use a global counter for timestamps.`,`getNewsFeed: collect tweets from userId and all followees, return top 10 by timestamp using a max-heap.`,`follow/unfollow: maintain a set of followees per user.`],inputFormat:`Use run/submit modes`,defaultCustomInput:``,testCases:[{label:`LeetCode ex`,input:`postTweet(1,5);feed(1);follow(1,2);postTweet(2,6);feed(1);unfollow(1,2);feed(1)`,expected:`[5],[6,5],[5]`},{label:`Self feed`,input:`postTweet(1,1);postTweet(1,2);feed(1)`,expected:`[2,1]`},{label:`No tweets`,input:`feed(1)`,expected:`[]`},{label:`Top 10`,input:`post 11 tweets for user 1, feed(1)`,expected:`[11,10,9,8,7,6,5,4,3,2]`}],cppStarter:`class Twitter {
    int ts = 0;
    unordered_map<int, vector<pair<int,int>>> tweets; // userId -> [(ts, tweetId)]
    unordered_map<int, unordered_set<int>> following;
public:
    Twitter() {}

    void postTweet(int userId, int tweetId) {

    }

    vector<int> getNewsFeed(int userId) {

    }

    void follow(int followerId, int followeeId) {

    }

    void unfollow(int followerId, int followeeId) {

    }
};`,pythonStarter:`from typing import List
import heapq
from collections import defaultdict

class Twitter:
    def __init__(self):


    def postTweet(self, userId: int, tweetId: int) -> None:


    def getNewsFeed(self, userId: int) -> List[int]:


    def follow(self, followerId: int, followeeId: int) -> None:


    def unfollow(self, followerId: int, followeeId: int) -> None:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Twitter t; auto fmtFeed=[](vector<int> v){string s="[";for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s+"]";};
    t.postTweet(1,5);
    string got=fmtFeed(t.getNewsFeed(1));
    t.follow(1,2); t.postTweet(2,6);
    got+=","+fmtFeed(t.getNewsFeed(1));
    t.unfollow(1,2);
    got+=","+fmtFeed(t.getNewsFeed(1));
    string exp="[5],[6,5],[5]";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    int passed=0,total=4; vector<string> res;
    auto fmtFeed=[](vector<int> v){string s="[";for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s+"]";};
    {Twitter t; t.postTweet(1,5); string g=fmtFeed(t.getNewsFeed(1)); t.follow(1,2); t.postTweet(2,6); g+=","+fmtFeed(t.getNewsFeed(1)); t.unfollow(1,2); g+=","+fmtFeed(t.getNewsFeed(1));
     bool ok=g=="[5],[6,5],[5]"; passed+=ok; res.push_back("TEST:1"+(ok?string(":PASS:"):string(":FAIL:"))+"[5],[6,5],[5]:"+g);}
    {Twitter t; t.postTweet(1,1); t.postTweet(1,2); string g=fmtFeed(t.getNewsFeed(1));
     bool ok=g=="[2,1]"; passed+=ok; res.push_back("TEST:2"+(ok?string(":PASS:"):string(":FAIL:"))+"[2,1]:"+g);}
    {Twitter t; string g=fmtFeed(t.getNewsFeed(1));
     bool ok=g=="[]"; passed+=ok; res.push_back("TEST:3"+(ok?string(":PASS:"):string(":FAIL:"))+"[]:"+g);}
    {Twitter t; for(int i=1;i<=11;i++) t.postTweet(1,i); string g=fmtFeed(t.getNewsFeed(1));
     bool ok=g=="[11,10,9,8,7,6,5,4,3,2]"; passed+=ok; res.push_back("TEST:4"+(ok?string(":PASS:"):string(":FAIL:"))+"[11,10,9,8,7,6,5,4,3,2]:"+g);}
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":4\\n";
    return passed==4?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){if(e===`run`)return`
t=Twitter(); t.postTweet(1,5)
g=[str(t.getNewsFeed(1)).replace(" ","")]
t.follow(1,2); t.postTweet(2,6); g.append(str(t.getNewsFeed(1)).replace(" ",""))
t.unfollow(1,2); g.append(str(t.getNewsFeed(1)).replace(" ",""))
got=",".join(g); exp="[5],[6,5],[5]"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
passed=0; res=[]
def chk(n,fn,exp):
    global passed; got=fn().replace(" ",""); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
def t1():
    t=Twitter(); t.postTweet(1,5); g=[str(t.getNewsFeed(1))]
    t.follow(1,2); t.postTweet(2,6); g.append(str(t.getNewsFeed(1)))
    t.unfollow(1,2); g.append(str(t.getNewsFeed(1)))
    return ",".join(g)
chk(1,t1,"[5],[6,5],[5]")
def t2():
    t=Twitter(); t.postTweet(1,1); t.postTweet(1,2); return str(t.getNewsFeed(1))
chk(2,t2,"[2,1]")
def t3():
    t=Twitter(); return str(t.getNewsFeed(1))
chk(3,t3,"[]")
def t4():
    t=Twitter()
    for i in range(1,12): t.postTweet(1,i)
    return str(t.getNewsFeed(1))
chk(4,t4,"[11,10,9,8,7,6,5,4,3,2]")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`maximum-sum-combination`,title:`Maximum Sum Combination`,difficulty:`Medium`,category:`heap`,askedBy:`vjs`,description:[`Given two integer arrays <code>A</code> and <code>B</code>, each of length <code>n</code>, find the top <code>k</code> maximum sums of pairs <code>A[i] + B[j]</code>.`,`Return them in descending order.`],examples:[{input:`A=[3,2], B=[1,4], k=2`,output:`[7,6]`,explanation:`A[0]+B[1]=7, A[0]+B[0]=6 or A[1]+B[1]=6.`},{input:`A=[1,4,2,3], B=[2,5,1,4], k=3`,output:`[9,8,8]`}],constraints:[`1 ≤ n ≤ 10³`,`1 ≤ A[i], B[i] ≤ 10⁴`,`1 ≤ k ≤ n`],hints:[`Sort both arrays in descending order.`,`Use a max-heap initialized with (A[0]+B[0], 0, 0). Use a visited set to avoid duplicates.`,`Pop the max, record it, push (i+1, j) and (i, j+1) if not visited.`],inputFormat:`Line 1: A values
Line 2: B values
Line 3: k`,defaultCustomInput:`3 2
1 4
2`,testCases:[{label:`Example 1`,input:`A=[3,2], B=[1,4], k=2`,expected:`7,6`},{label:`Example 2`,input:`A=[1,4,2,3], B=[2,5,1,4], k=3`,expected:`9,8,8`},{label:`k=1`,input:`A=[1,2,3], B=[4,5,6], k=1`,expected:`9`},{label:`All`,input:`A=[1,2], B=[3,4], k=4`,expected:`6,5,5,4`}],cppStarter:`class Solution {
public:
    vector<int> maxSumCombination(vector<int>& A, vector<int>& B, int k) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def maxSumCombination(self, A: List[int], B: List[int], k: int) -> List[int]:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol; auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    vector<int> A={3,2}, B={1,4};
    string got=fmtV(sol.maxSumCombination(A,B,2)), exp="7,6";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> A,vector<int> B,int k,string exp,int n){
        string got=fmtV(sol.maxSumCombination(A,B,k)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({3,2},{1,4},2,"7,6",1);
    chk({1,4,2,3},{2,5,1,4},3,"9,8,8",2);
    chk({1,2,3},{4,5,6},1,"9",3);
    chk({1,2},{3,4},4,"6,5,5,4",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`3 2`).trim().split(/\s+/).map(Number),r=(e[1]||`1 4`).trim().split(/\s+/).map(Number),i=parseInt(e[2]??`2`);return`
int main() {
    Solution sol;
    vector<int> A={${D(n)}}, B={${D(r)}};
    auto r=sol.maxSumCombination(A,B,${i});
    for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=",".join(map(str,sol.maxSumCombination([3,2],[1,4],2))); exp="7,6"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([3,2],[1,4],2,"7,6"),([1,4,2,3],[2,5,1,4],3,"9,8,8"),([1,2,3],[4,5,6],1,"9"),([1,2],[3,4],4,"6,5,5,4")]
passed=0; res=[]
for i,(A,B,k,exp) in enumerate(cases,1):
    got=",".join(map(str,sol.maxSumCombination(list(A),list(B),k))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`3 2`).trim().split(/\s+/).map(Number),r=(e[1]||`1 4`).trim().split(/\s+/).map(Number),i=parseInt(e[2]??`2`);return`
sol = Solution()
print(",".join(map(str,sol.maxSumCombination([${n.join(`,`)}],[${r.join(`,`)}],${i}))))`}}}];function de({heights:e,highlight:t=[],waterFill:n=!1,label:r=``}){let i=Math.max(...e,1),a=e.length*40+4,o=[];if(n){let t=Array(e.length).fill(0),n=Array(e.length).fill(0);t[0]=e[0];for(let n=1;n<e.length;n++)t[n]=Math.max(t[n-1],e[n]);n[e.length-1]=e[e.length-1];for(let t=e.length-2;t>=0;t--)n[t]=Math.max(n[t+1],e[t]);o=e.map((e,r)=>Math.max(0,Math.min(t[r],n[r])-e))}let s=new Set(t),c=e=>e/i*136;return(0,T.jsxs)(`div`,{className:`viz-histogram-wrap`,children:[r&&(0,T.jsx)(`div`,{className:`viz-label`,children:r}),(0,T.jsx)(`svg`,{viewBox:`0 0 ${a} 160`,width:a,height:160,className:`viz-histogram`,children:e.map((e,t)=>{let r=4+t*40,i=c(e),a=n?c(o[t]):0,l=s.has(t);return(0,T.jsxs)(`g`,{children:[(0,T.jsx)(`rect`,{x:r,y:140-i,width:36,height:i,fill:l?`var(--success)`:`var(--accent)`,rx:3}),a>0&&(0,T.jsx)(`rect`,{x:r,y:140-i-a,width:36,height:a,fill:`var(--accent-hi)`,opacity:.5,rx:3}),(0,T.jsx)(`text`,{x:r+36/2,y:156,textAnchor:`middle`,fontSize:11,fill:`var(--text-dim)`,fontFamily:`monospace`,children:e})]},t)})})]})}var fe=e=>e.join(`, `),pe=[{id:`binary-subarrays-sum`,title:`Binary Subarrays With Sum`,difficulty:`Medium`,category:`sliding-window`,askedBy:`vjs`,description:[`Given a binary array <code>nums</code> and an integer <code>goal</code>, return the number of non-empty subarrays with a sum equal to <code>goal</code>.`,`A <strong>subarray</strong> is a contiguous part of the array.`],examples:[{input:`nums = [1,0,1,0,1],  goal = 2`,output:`4`,explanation:`Each highlighted window below sums to 2.`,visualization:{type:`array-windows`,array:[1,0,1,0,1],windows:[{range:[0,2],color:`teal`,label:`sum = 2`},{range:[0,3],color:`blue`,label:`sum = 2`},{range:[1,4],color:`mauve`,label:`sum = 2`},{range:[2,4],color:`peach`,label:`sum = 2`}],caption:`4 non-overlapping windows — all sum to goal = 2`}},{input:`nums = [0,0,0,0,0],  goal = 0`,output:`15`,explanation:`Every subarray has sum 0. There are n×(n+1)/2 = 15 total subarrays.`}],constraints:[`1 ≤ nums.length ≤ 3 × 10⁴`,`nums[i] is either 0 or 1`,`0 ≤ goal ≤ nums.length`],hints:[`Counting subarrays with an <em>exact</em> sum is tricky. Try converting it: exact(k) = atMost(k) − atMost(k − 1).`,`Implement <code>atMost(k)</code> with a sliding window: expand right, shrink left whenever <code>sum > k</code>. At each right pointer, add <code>right − left + 1</code> to the count.`,`Handle the edge case where <code>goal = 0</code>: <code>atMost(−1)</code> should return 0, so guard before calling.`],inputFormat:`Line 1: space-separated 0s and 1s
Line 2: goal (integer)`,defaultCustomInput:`1 0 1 0 1
2`,testCases:[{label:`Example 1`,input:`nums=[1,0,1,0,1], goal=2`,expected:`4`},{label:`Example 2`,input:`nums=[0,0,0,0,0], goal=0`,expected:`15`},{label:`All ones`,input:`nums=[1,1,1,1], goal=2`,expected:`3`},{label:`Mixed`,input:`nums=[1,0,0,1,1], goal=2`,expected:`4`}],cppStarter:`class Solution {
public:
    int numSubarraysWithSum(vector<int>& nums, int goal) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def numSubarraysWithSum(self, nums: List[int], goal: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> nums = {1, 0, 1, 0, 1};
    int goal = 2;
    int got = sol.numSubarraysWithSum(nums, goal);
    cout << "\\n---RESULT---\\n";
    if (got == 4) cout << "RESULT:PASS:4:" << got << "\\n";
    else          cout << "RESULT:FAIL:4:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed = 0, total = 4;
    vector<string> res;
    auto chk = [&](vector<int> nums, int goal, int expected, int n) {
        int got = sol.numSubarraysWithSum(nums, goal);
        bool ok = got == expected;
        passed += ok;
        res.push_back(string("TEST:") + to_string(n) + (ok ? ":PASS:" : ":FAIL:") + to_string(expected) + ":" + to_string(got));
    };
    chk({1,0,1,0,1}, 2, 4,  1);
    chk({0,0,0,0,0}, 0, 15, 2);
    chk({1,1,1,1},   2, 3,  3);
    chk({1,0,0,1,1}, 2, 4,  4);
    cout << "\\n---RESULT---\\n";
    for (auto& s : res) cout << s << "\\n";
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 0 1 0 1`).trim().split(/\s+/).filter(Boolean).map(Number),r=parseInt(e[1]??`2`);return`
int main() {
    Solution sol;
    vector<int> nums = {${fe(n)}};
    int goal = ${r};
    cout << sol.numSubarraysWithSum(nums, goal) << "\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
# run
sol = Solution()
got = sol.numSubarraysWithSum([1,0,1,0,1], 2)
print("
---RESULT---")
print(f"RESULT:{'PASS' if got == 4 else 'FAIL'}:4:{got}")`;if(e===`submit`)return`
# submit
sol = Solution()
cases = [([1,0,1,0,1],2,4),([0,0,0,0,0],0,15),([1,1,1,1],2,3),([1,0,0,1,1],2,4)]
passed = 0
res = []
for i,(nums,goal,exp) in enumerate(cases,1):
    got=sol.numSubarraysWithSum(list(nums),goal); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("
---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 0 1 0 1`).trim().split(/\s+/).filter(Boolean).map(Number),r=parseInt(e[1]??`2`);return`
sol = Solution()
print(sol.numSubarraysWithSum([${n.join(`, `)}], ${r}))`}}},{id:`max-cards`,title:`Maximum Points You Can Obtain from Cards`,difficulty:`Medium`,category:`sliding-window`,askedBy:`vjs`,description:[`There are several cards arranged in a row, each with an associated number of points given in <code>cardPoints</code>.`,`In one step, you can take one card from the <strong>beginning</strong> or the <strong>end</strong> of the row. You must take exactly <code>k</code> cards.`,`Return the <strong>maximum score</strong> you can obtain.`],examples:[{input:`cardPoints = [1,2,3,4,5,6,1],  k = 3`,output:`12`,explanation:`Take 1 from the left and 2 from the right — teal cards are selected, middle is skipped.`,visualization:{type:`array-ends`,array:[1,2,3,4,5,6,1],leftCount:1,rightCount:2,caption:`1 + 6 + 1 = 12 (maximum possible with k = 3)`}},{input:`cardPoints = [2,2,2],  k = 2`,output:`4`,explanation:`Any 2 cards give score 4.`}],constraints:[`1 ≤ cardPoints.length ≤ 10⁵`,`1 ≤ cardPoints[i] ≤ 10⁴`,`1 ≤ k ≤ cardPoints.length`],hints:[`Instead of choosing which cards to <em>take</em>, think about which subarray you are <em>leaving behind</em>.`,`You always leave a contiguous subarray of length <code>n − k</code>. Minimising that window's sum maximises your score.`,`Use a fixed-size sliding window of length <code>n − k</code>. Track its minimum sum, then answer = totalSum − minWindowSum.`],inputFormat:`Line 1: space-separated card points
Line 2: k (integer)`,defaultCustomInput:`1 2 3 4 5 6 1
3`,testCases:[{label:`Example 1`,input:`cardPoints=[1,2,3,4,5,6,1], k=3`,expected:`12`},{label:`Example 2`,input:`cardPoints=[2,2,2], k=2`,expected:`4`},{label:`Take all`,input:`cardPoints=[9,7,7,9,7,7,9], k=7`,expected:`55`},{label:`k=1 boundary`,input:`cardPoints=[1,1000,1], k=1`,expected:`1`}],cppStarter:`class Solution {
public:
    int maxScore(vector<int>& cardPoints, int k) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def maxScore(self, cardPoints: List[int], k: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> pts = {1,2,3,4,5,6,1};
    int k = 3;
    int got = sol.maxScore(pts, k);
    cout << "\\n---RESULT---\\n";
    if (got == 12) cout << "RESULT:PASS:12:" << got << "\\n";
    else           cout << "RESULT:FAIL:12:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed = 0, total = 4;
    vector<string> res;
    auto chk = [&](vector<int> pts, int k, int expected, int n) {
        int got = sol.maxScore(pts, k);
        bool ok = got == expected;
        passed += ok;
        res.push_back(string("TEST:") + to_string(n) + (ok ? ":PASS:" : ":FAIL:") + to_string(expected) + ":" + to_string(got));
    };
    chk({1,2,3,4,5,6,1}, 3, 12, 1);
    chk({2,2,2},          2, 4,  2);
    chk({9,7,7,9,7,7,9},  7, 55, 3);
    chk({1,1000,1},        1, 1,  4);
    cout << "\\n---RESULT---\\n";
    for (auto& s : res) cout << s << "\\n";
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 2 3 4 5 6 1`).trim().split(/\s+/).filter(Boolean).map(Number),r=parseInt(e[1]??`3`);return`
int main() {
    Solution sol;
    vector<int> pts = {${fe(n)}};
    int k = ${r};
    cout << sol.maxScore(pts, k) << "\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.maxScore([1,2,3,4,5,6,1], 3)
print("
---RESULT---")
print(f"RESULT:{'PASS' if got == 12 else 'FAIL'}:12:{got}")`;if(e===`submit`)return`
sol = Solution()
cases = [([1,2,3,4,5,6,1],3,12),([2,2,2],2,4),([9,7,7,9,7,7,9],7,55),([1,1000,1],1,1)]
passed = 0
res = []
for i,(pts,k,exp) in enumerate(cases,1):
    got=sol.maxScore(list(pts),k); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("
---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 2 3 4 5 6 1`).trim().split(/\s+/).filter(Boolean).map(Number),r=parseInt(e[1]??`3`);return`
sol = Solution()
print(sol.maxScore([${n.join(`, `)}], ${r}))`}}},{id:`k-distinct-integers`,title:`Subarrays with K Different Integers`,difficulty:`Hard`,category:`sliding-window`,askedBy:`vjs`,description:[`Given an integer array <code>nums</code> and an integer <code>k</code>, return the number of <strong>good subarrays</strong>.`,`A subarray is <strong>good</strong> if the number of distinct integers in it is <em>exactly</em> <code>k</code>.`],examples:[{input:`nums = [1,2,1,2,3],  k = 2`,output:`7`,explanation:`<span class="hl hl-1">[1,2]</span>, <span class="hl hl-2">[2,1]</span>, <span class="hl hl-3">[1,2,1]</span>, <span class="hl hl-4">[2,1,2]</span>, <span class="hl hl-5">[1,2,1,2]</span>, <span class="hl hl-6">[2,3]</span>, <span class="hl hl-1">[1,2]</span> — seven subarrays each containing exactly 2 distinct integers.`},{input:`nums = [1,2,1,3,4],  k = 3`,output:`3`,explanation:`<span class="hl hl-1">[1,2,1,3]</span>, <span class="hl hl-2">[2,1,3]</span>, <span class="hl hl-3">[1,3,4]</span> — three subarrays with exactly 3 distinct integers.`}],constraints:[`1 ≤ nums.length ≤ 2 × 10⁴`,`1 ≤ nums[i] ≤ nums.length`,`1 ≤ k ≤ nums.length`],hints:[`Exact K distinct = atMost(K) − atMost(K − 1). Same trick as Binary Subarrays.`,`Implement <code>atMost(k)</code>: use a frequency map. Expand right; when distinct count exceeds k, shrink left and update the map.`,`At each right pointer, <code>right − left + 1</code> counts all valid subarrays ending at <code>right</code>.`],inputFormat:`Line 1: space-separated integers
Line 2: k (integer)`,defaultCustomInput:`1 2 1 2 3
2`,testCases:[{label:`Example 1`,input:`nums=[1,2,1,2,3], k=2`,expected:`7`},{label:`Example 2`,input:`nums=[1,2,1,3,4], k=3`,expected:`3`},{label:`Single elem`,input:`nums=[1], k=1`,expected:`1`},{label:`All same`,input:`nums=[1,1,1,1,1], k=1`,expected:`15`}],cppStarter:`class Solution {
public:
    int subarraysWithKDistinct(vector<int>& nums, int k) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def subarraysWithKDistinct(self, nums: List[int], k: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> nums = {1,2,1,2,3};
    int k = 2;
    int got = sol.subarraysWithKDistinct(nums, k);
    cout << "\\n---RESULT---\\n";
    if (got == 7) cout << "RESULT:PASS:7:" << got << "\\n";
    else          cout << "RESULT:FAIL:7:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed = 0, total = 4;
    vector<string> res;
    auto chk = [&](vector<int> nums, int k, int expected, int n) {
        int got = sol.subarraysWithKDistinct(nums, k);
        bool ok = got == expected;
        passed += ok;
        res.push_back(string("TEST:") + to_string(n) + (ok ? ":PASS:" : ":FAIL:") + to_string(expected) + ":" + to_string(got));
    };
    chk({1,2,1,2,3},   2, 7,  1);
    chk({1,2,1,3,4},   3, 3,  2);
    chk({1},           1, 1,  3);
    chk({1,1,1,1,1},   1, 15, 4);
    cout << "\\n---RESULT---\\n";
    for (auto& s : res) cout << s << "\\n";
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 2 1 2 3`).trim().split(/\s+/).filter(Boolean).map(Number),r=parseInt(e[1]??`2`);return`
int main() {
    Solution sol;
    vector<int> nums = {${fe(n)}};
    int k = ${r};
    cout << sol.subarraysWithKDistinct(nums, k) << "\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.subarraysWithKDistinct([1,2,1,2,3], 2)
print("
---RESULT---")
print(f"RESULT:{'PASS' if got == 7 else 'FAIL'}:7:{got}")`;if(e===`submit`)return`
sol = Solution()
cases = [([1,2,1,2,3],2,7),([1,2,1,3,4],3,3),([1],1,1),([1,1,1,1,1],1,15)]
passed = 0
res = []
for i,(nums,k,exp) in enumerate(cases,1):
    got=sol.subarraysWithKDistinct(list(nums),k); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("
---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 2 1 2 3`).trim().split(/\s+/).filter(Boolean).map(Number),r=parseInt(e[1]??`2`);return`
sol = Solution()
print(sol.subarraysWithKDistinct([${n.join(`, `)}], ${r}))`}}},{id:`min-window-subseq`,title:`Minimum Window Subsequence`,difficulty:`Hard`,category:`sliding-window`,askedBy:`vjs`,description:[`Given strings <code>s</code> and <code>t</code>, return the minimum contiguous substring of <code>s</code> such that <code>t</code> is a <strong>subsequence</strong> of that substring.`,`If no such window exists return <code>""</code>. If multiple minimum-length windows exist, return the <strong>left-most</strong> one.`],examples:[{input:`s = "abcdebdde",  t = "bde"`,output:`"bcde"`,explanation:`Window <b>"bcde"</b> (indices 1–4) contains b→d→e in order. Teal cells match t; blue cells are in the window but unmatched.`,visualization:{type:`string-window`,s:`abcdebdde`,t:`bde`,window:{start:1,end:4},matches:[1,3,4],caption:`"bcde" length 4 — shortest window containing "bde" as a subsequence`}},{input:`s = "jmeqksfrcdcmsarqjssrqnmjgcgxabegksnfhxekrzq",  t = "sf"`,output:`"sfr"`,explanation:`The first occurrence of s then f in sequence gives the window "sfr" (shortest).`}],constraints:[`1 ≤ s.length ≤ 2 × 10⁴`,`1 ≤ t.length ≤ 100`,`s and t consist of lowercase English letters`],hints:[`Use two pointers on <code>s</code> and <code>t</code>. Scan forward until all characters of <code>t</code> are matched as a subsequence — this gives the window end.`,`Once you have the window end, scan <em>backward</em> from that position to minimise the window start. This is the shortest window ending there.`,`Record the minimum, then advance the start by 1 and repeat the forward scan. Overall O(|s| × |t|).`],inputFormat:`Line 1: s (string)
Line 2: t (string)`,defaultCustomInput:`abcdebdde
bde`,testCases:[{label:`Example 1`,input:`s="abcdebdde", t="bde"`,expected:`"bcde"`},{label:`End match`,input:`s="xyzabc", t="abc"`,expected:`"abc"`},{label:`Same str`,input:`s="aa", t="aa"`,expected:`"aa"`},{label:`Long search`,input:`s="fgrqsqsnodwmxzkzxwqegkndaa", t="kzed"`,expected:`"kzxwqegknd"`}],cppStarter:`class Solution {
public:
    string minWindow(string s, string t) {

    }
};`,pythonStarter:`class Solution:
    def minWindow(self, s: str, t: str) -> str:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    string got = sol.minWindow("abcdebdde", "bde");
    cout << "\\n---RESULT---\\n";
    if (got == "bcde") cout << "RESULT:PASS:bcde:" << got << "\\n";
    else               cout << "RESULT:FAIL:bcde:" << got << "\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed = 0, total = 4;
    vector<string> res;
    auto chk = [&](string s, string t, string expected, int n) {
        string got = sol.minWindow(s, t);
        bool ok = got == expected;
        passed += ok;
        res.push_back(string("TEST:") + to_string(n) + (ok ? ":PASS:" : ":FAIL:") + expected + ":" + got);
    };
    chk("abcdebdde",                  "bde",  "bcde",       1);
    chk("xyzabc",                     "abc",  "abc",        2);
    chk("aa",                         "aa",   "aa",         3);
    chk("fgrqsqsnodwmxzkzxwqegkndaa", "kzed", "kzxwqegknd", 4);
    cout << "\\n---RESULT---\\n";
    for (auto& s : res) cout << s << "\\n";
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`;if(e===`custom`){let e=t.trim().split(`
`);return`
int main() {
    Solution sol;
    cout << "\\"" << sol.minWindow("${(e[0]||`abcdebdde`).trim()}", "${(e[1]||`bde`).trim()}") << "\\"\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got = sol.minWindow("abcdebdde", "bde")
print("
---RESULT---")
print(f"RESULT:{'PASS' if got == 'bcde' else 'FAIL'}:bcde:{got}")`;if(e===`submit`)return`
sol = Solution()
cases = [("abcdebdde","bde","bcde"),("xyzabc","abc","abc"),("aa","aa","aa"),("fgrqsqsnodwmxzkzxwqegkndaa","kzed","kzxwqegknd")]
passed = 0
res = []
for i,(s,t,exp) in enumerate(cases,1):
    got=sol.minWindow(s,t); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("
---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`);return`
sol = Solution()
got = sol.minWindow("${(e[0]||`abcdebdde`).trim()}", "${(e[1]||`bde`).trim()}")
print(f'"{got}"')`}}},{id:`fruit-into-baskets`,title:`Fruit Into Baskets`,difficulty:`Medium`,category:`sliding-window`,askedBy:`himali`,description:[`You have a row of trees where <code>fruits[i]</code> is the type of fruit at tree <code>i</code>. You have two baskets, each holding only one type of fruit.`,`Starting from any tree, pick one fruit from each tree you visit and move right. Return the maximum number of fruits you can collect.`],examples:[{input:`fruits = [1,2,1]`,output:`3`,explanation:`Take all — only 2 fruit types.`},{input:`fruits = [0,1,2,2]`,output:`3`,explanation:`Take [1,2,2] — types {1,2}.`}],constraints:[`1 ≤ fruits.length ≤ 10⁵`,`0 ≤ fruits[i] < fruits.length`],hints:[`Equivalent to: longest subarray with at most 2 distinct integers.`,`Sliding window: expand right, shrink left when distinct count > 2.`,`Use a frequency map. Window size is right−left+1.`],inputFormat:`Line 1: space-separated fruit types`,defaultCustomInput:`1 2 1`,testCases:[{label:`Example 1`,input:`fruits=[1,2,1]`,expected:`3`},{label:`Example 2`,input:`fruits=[0,1,2,2]`,expected:`3`},{label:`All same`,input:`fruits=[1,1,1,1]`,expected:`4`},{label:`Example 3`,input:`fruits=[1,2,3,2,2]`,expected:`4`}],cppStarter:`class Solution {
public:
    int totalFruit(vector<int>& fruits) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def totalFruit(self, fruits: List[int]) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> f={1,2,1};
    int got=sol.totalFruit(f);
    cout<<"\\n---RESULT---\\n";
    if(got==3) cout<<"RESULT:PASS:3:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:3:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> f,int exp,int n){
        int got=sol.totalFruit(f); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,2,1},3,1);
    chk({0,1,2,2},3,2);
    chk({1,1,1,1},4,3);
    chk({1,2,3,2,2},4,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> f={${(t.trim()||`1 2 1`).split(/\s+/).map(Number).join(`,`)}};
    cout<<sol.totalFruit(f)<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=sol.totalFruit([1,2,1])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([1,2,1],3),([0,1,2,2],3),([1,1,1,1],4),([1,2,3,2,2],4)]
passed=0; res=[]
for i,(f,exp) in enumerate(cases,1):
    got=sol.totalFruit(list(f)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(sol.totalFruit([${(t.trim()||`1 2 1`).split(/\s+/).map(Number).join(`,`)}]))`}},{id:`count-nice-subarrays`,title:`Count Number of Nice Subarrays`,difficulty:`Medium`,category:`sliding-window`,askedBy:`himali`,description:[`Given an array of integers <code>nums</code> and an integer <code>k</code>, return the number of <strong>nice</strong> subarrays.`,`A subarray is nice if it contains exactly <code>k</code> odd numbers.`],examples:[{input:`nums=[1,1,2,1,1], k=3`,output:`2`,explanation:`[1,1,2,1] and [1,2,1,1].`},{input:`nums=[2,4,6], k=1`,output:`0`}],constraints:[`1 ≤ nums.length ≤ 5×10⁴`,`1 ≤ nums[i] ≤ 10⁵`,`1 ≤ k ≤ nums.length`],hints:[`Transform: replace each number with 1 (odd) or 0 (even). Now count subarrays with exactly k ones.`,`Use the atMost(k) − atMost(k−1) trick, or prefix sum counting.`,`Same pattern as Binary Subarrays With Sum.`],inputFormat:`Line 1: space-separated integers
Line 2: k`,defaultCustomInput:`1 1 2 1 1
3`,testCases:[{label:`Example 1`,input:`nums=[1,1,2,1,1], k=3`,expected:`2`},{label:`No odds`,input:`nums=[2,4,6], k=1`,expected:`0`},{label:`k=1`,input:`nums=[1,2,3,4,5], k=1`,expected:`8`},{label:`All odd`,input:`nums=[1,1,1,1,1], k=2`,expected:`4`}],cppStarter:`class Solution {
public:
    int numberOfSubarrays(vector<int>& nums, int k) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def numberOfSubarrays(self, nums: List[int], k: int) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> n={1,1,2,1,1};
    int got=sol.numberOfSubarrays(n,3);
    cout<<"\\n---RESULT---\\n";
    if(got==2) cout<<"RESULT:PASS:2:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:2:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> n,int k,int exp,int t){
        int got=sol.numberOfSubarrays(n,k); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(t)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,1,2,1,1},3,2,1);
    chk({2,4,6},1,0,2);
    chk({1,2,3,4,5},1,8,3);
    chk({1,1,1,1,1},2,4,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 1 2 1 1`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`3`);return`
int main() {
    Solution sol;
    vector<int> n={${n.join(`,`)}};
    cout<<sol.numberOfSubarrays(n,${r})<<"\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=sol.numberOfSubarrays([1,1,2,1,1],3)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==2 else 'FAIL'}:2:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([1,1,2,1,1],3,2),([2,4,6],1,0),([1,2,3,4,5],1,8),([1,1,1,1,1],2,4)]
passed=0; res=[]
for i,(n,k,exp) in enumerate(cases,1):
    got=sol.numberOfSubarrays(list(n),k); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`),n=(e[0]||`1 1 2 1 1`).trim().split(/\s+/).map(Number),r=parseInt(e[1]??`3`);return`
sol = Solution()
print(sol.numberOfSubarrays([${n.join(`,`)}],${r}))`}}},{id:`substrings-all-three-chars`,title:`Number of Substrings Containing All Three Characters`,difficulty:`Medium`,category:`sliding-window`,askedBy:`himali`,description:[`Given a string <code>s</code> consisting only of characters <code>a</code>, <code>b</code>, and <code>c</code>, return the number of substrings containing at least one occurrence of all three characters.`],examples:[{input:`s = "abcabc"`,output:`10`},{input:`s = "aaacb"`,output:`3`}],constraints:[`3 ≤ s.length ≤ 5×10⁴`,`s consists only of a, b, c`],hints:[`For each right pointer, find the smallest left such that s[left..right] contains all 3 chars.`,`The number of valid substrings ending at right is (left + 1) — all starting positions from 0 to left are valid.`,`Use a frequency array of size 3. Shrink left when all 3 counts are > 0.`],inputFormat:`Line 1: string s`,defaultCustomInput:`abcabc`,testCases:[{label:`Example 1`,input:`s="abcabc"`,expected:`10`},{label:`Example 2`,input:`s="aaacb"`,expected:`3`},{label:`Minimal`,input:`s="abc"`,expected:`1`},{label:`Repeated`,input:`s="aabbcc"`,expected:`4`}],cppStarter:`class Solution {
public:
    int numberOfSubstrings(string s) {

    }
};`,pythonStarter:`class Solution:
    def numberOfSubstrings(self, s: str) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    int got=sol.numberOfSubstrings("abcabc");
    cout<<"\\n---RESULT---\\n";
    if(got==10) cout<<"RESULT:PASS:10:"<<got<<"\\n";
    else        cout<<"RESULT:FAIL:10:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](string s,int exp,int n){
        int got=sol.numberOfSubstrings(s); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk("abcabc",10,1);
    chk("aaacb",3,2);
    chk("abc",1,3);
    chk("aabbcc",4,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    cout<<sol.numberOfSubstrings("${t.trim()||`abcabc`}")<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=sol.numberOfSubstrings("abcabc")
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==10 else 'FAIL'}:10:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[("abcabc",10),("aaacb",3),("abc",1),("aabbcc",4)]
passed=0; res=[]
for i,(s,exp) in enumerate(cases,1):
    got=sol.numberOfSubstrings(s); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(sol.numberOfSubstrings("${t.trim()||`abcabc`}"))`}},{id:`minimum-window-substring`,title:`Minimum Window Substring`,difficulty:`Hard`,category:`sliding-window`,askedBy:`himali`,description:[`Given strings <code>s</code> and <code>t</code>, return the minimum window substring of <code>s</code> such that every character in <code>t</code> (including duplicates) is present in the window.`,`Return <code>""</code> if no such window exists.`],examples:[{input:`s="ADOBECODEBANC", t="ABC"`,output:`"BANC"`},{input:`s="a", t="a"`,output:`"a"`},{input:`s="a", t="aa"`,output:`""`}],constraints:[`1 ≤ s.length ≤ 10⁵`,`1 ≤ t.length ≤ 10⁴`,`s and t contain English letters`],hints:[`Sliding window with two frequency maps (one for t, one for current window).`,`Expand right until window is valid (all t chars covered). Then shrink left while still valid.`,`Track "formed" count: how many unique chars in t have their required frequency met.`],inputFormat:`Line 1: s
Line 2: t`,defaultCustomInput:`ADOBECODEBANC
ABC`,testCases:[{label:`Example 1`,input:`s="ADOBECODEBANC", t="ABC"`,expected:`BANC`},{label:`Single`,input:`s="a", t="a"`,expected:`a`},{label:`No window`,input:`s="a", t="aa"`,expected:``},{label:`Exact`,input:`s="abc", t="abc"`,expected:`abc`}],cppStarter:`class Solution {
public:
    string minWindow(string s, string t) {

    }
};`,pythonStarter:`class Solution:
    def minWindow(self, s: str, t: str) -> str:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    string got=sol.minWindow("ADOBECODEBANC","ABC"), exp="BANC";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](string s,string t,string exp,int n){
        string got=sol.minWindow(s,t); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk("ADOBECODEBANC","ABC","BANC",1);
    chk("a","a","a",2);
    chk("a","aa","",3);
    chk("abc","abc","abc",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`){let e=t.trim().split(`
`);return`
int main() {
    Solution sol;
    cout<<sol.minWindow("${(e[0]||`ADOBECODEBANC`).trim()}","${(e[1]||`ABC`).trim()}")<<"\\n";
    return 0;
}`}},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=sol.minWindow("ADOBECODEBANC","ABC"); exp="BANC"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[("ADOBECODEBANC","ABC","BANC"),("a","a","a"),("a","aa",""),("abc","abc","abc")]
passed=0; res=[]
for i,(s,t,exp) in enumerate(cases,1):
    got=sol.minWindow(s,t); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`){let e=t.trim().split(`
`);return`
sol = Solution()
print(sol.minWindow("${(e[0]||`ADOBECODEBANC`).trim()}","${(e[1]||`ABC`).trim()}"))`}}}];function me(){let e=[1,2,1,2,3,3,4],t=e.map((e,t)=>({val:e,inWindow:t>=0&&t<=3,color:e===1?`var(--accent)`:e===2?`var(--warn)`:`var(--surface-3)`})),n=e.length*44+4;return(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`div`,{className:`viz-label`,children:`Sliding window: [1,2,1,2] — 2 fruit types, 4 fruits`}),(0,T.jsx)(`svg`,{viewBox:`0 0 ${n} 56`,width:n,height:56,children:t.map((e,t)=>(0,T.jsxs)(`g`,{children:[(0,T.jsx)(`rect`,{x:4+t*44,y:4,width:40,height:36,fill:e.color,opacity:e.inWindow?1:.35,rx:4,stroke:e.inWindow?`var(--text)`:`none`,strokeWidth:2}),(0,T.jsx)(`text`,{x:4+t*44+40/2,y:28,textAnchor:`middle`,fontSize:13,fill:`var(--text)`,fontFamily:`monospace`,children:e.val})]},t))})]})}function O(){let e=`ADOBECODEBANC`.split(``),t=e.length*28+2,n=new Set(`ABC`);return(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`div`,{className:`viz-label`,children:`Min window in "ADOBECODEBANC" containing "ABC" → "BANC"`}),(0,T.jsx)(`svg`,{viewBox:`0 0 ${t} 48`,width:t,height:48,children:e.map((e,t)=>{let r=t>=9&&t<=12,i=n.has(e);return(0,T.jsxs)(`g`,{children:[(0,T.jsx)(`rect`,{x:2+t*28,y:4,width:26,height:32,fill:r?i?`var(--success)`:`var(--surface-2)`:`var(--surface-3)`,stroke:r?`var(--text)`:`none`,strokeWidth:1.5,rx:3}),(0,T.jsx)(`text`,{x:2+t*28+26/2,y:24,textAnchor:`middle`,fontSize:12,fill:`var(--text)`,fontFamily:`monospace`,children:e})]},t)})})]})}var he={"fruit-into-baskets":()=>(0,T.jsx)(me,{}),"minimum-window-substring":()=>(0,T.jsx)(O,{})},ge=e=>e.join(`, `),_e=[{id:`trapping-rain-water`,title:`Trapping Rain Water`,difficulty:`Hard`,category:`stacks-queues`,askedBy:`himali`,description:[`Given <code>n</code> non-negative integers representing an elevation map where each bar has width 1, compute how much water can be trapped after raining.`],examples:[{input:`height=[0,1,0,2,1,0,1,3,2,1,2,1]`,output:`6`},{input:`height=[4,2,0,3,2,5]`,output:`9`}],constraints:[`n ≥ 0`,`0 ≤ height[i] ≤ 3×10⁴`],hints:[`Two-pointer approach: maintain leftMax and rightMax. Water at position i = min(leftMax, rightMax) − height[i].`,`Or use a monotonic stack: for each bar, pop stack while current height > stack top, water = min(heights) × width.`,`Two-pointer is O(n) time, O(1) space.`],inputFormat:`Line 1: space-separated heights`,defaultCustomInput:`0 1 0 2 1 0 1 3 2 1 2 1`,testCases:[{label:`Example 1`,input:`height=[0,1,0,2,1,0,1,3,2,1,2,1]`,expected:`6`},{label:`Example 2`,input:`height=[4,2,0,3,2,5]`,expected:`9`},{label:`Flat`,input:`height=[3,3,3,3]`,expected:`0`},{label:`Valley`,input:`height=[3,0,3]`,expected:`3`}],cppStarter:`class Solution {
public:
    int trap(vector<int>& height) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def trap(self, height: List[int]) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> h={0,1,0,2,1,0,1,3,2,1,2,1};
    int got=sol.trap(h);
    cout<<"\\n---RESULT---\\n";
    if(got==6) cout<<"RESULT:PASS:6:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:6:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> h,int exp,int n){
        int got=sol.trap(h); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({0,1,0,2,1,0,1,3,2,1,2,1},6,1);
    chk({4,2,0,3,2,5},9,2);
    chk({3,3,3,3},0,3);
    chk({3,0,3},3,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> h={${ge((t.trim()||`0 1 0 2 1 0 1 3 2 1 2 1`).split(/\s+/).map(Number))}};
    cout<<sol.trap(h)<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=sol.trap([0,1,0,2,1,0,1,3,2,1,2,1])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==6 else 'FAIL'}:6:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([0,1,0,2,1,0,1,3,2,1,2,1],6),([4,2,0,3,2,5],9),([3,3,3,3],0),([3,0,3],3)]
passed=0; res=[]
for i,(h,exp) in enumerate(cases,1):
    got=sol.trap(list(h)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(sol.trap([${(t.trim()||`0 1 0 2 1 0 1 3 2 1 2 1`).split(/\s+/).map(Number).join(`,`)}]))`}},{id:`asteroid-collision`,title:`Asteroid Collision`,difficulty:`Medium`,category:`stacks-queues`,askedBy:`himali`,description:[`An array of integers represents asteroids. Positive = moving right, negative = moving left. Magnitude = size.`,`Asteroids moving in the same direction never meet. When they meet, the smaller one explodes; if equal both explode.`,`Return the final state.`],examples:[{input:`asteroids=[5,10,-5]`,output:`[5,10]`,explanation:`-5 collides with 10 and explodes.`},{input:`asteroids=[8,-8]`,output:`[]`,explanation:`Both equal size, both explode.`},{input:`asteroids=[10,2,-5]`,output:`[10]`,explanation:`-5 hits 2 (2 explodes), then -5 hits 10 (-5 explodes).`}],constraints:[`2 ≤ asteroids.length ≤ 10⁴`,`-1000 ≤ asteroids[i] ≤ 1000`,`asteroids[i] ≠ 0`],hints:[`Use a stack. Push positive asteroids.`,`For negative: pop all smaller positives. If equal, pop and stop. If top is larger positive, the negative explodes.`,`If stack empty or top is negative, push the negative asteroid.`],inputFormat:`Line 1: space-separated asteroid values`,defaultCustomInput:`5 10 -5`,testCases:[{label:`Example 1`,input:`asteroids=[5,10,-5]`,expected:`5,10`},{label:`Both die`,input:`asteroids=[8,-8]`,expected:``},{label:`Example 3`,input:`asteroids=[10,2,-5]`,expected:`10`},{label:`No collide`,input:`asteroids=[-2,-1,1,2]`,expected:`-2,-1,1,2`}],cppStarter:`class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol; auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    vector<int> a={5,10,-5};
    string got=fmtV(sol.asteroidCollision(a)), exp="5,10";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,string exp,int n){
        string got=fmtV(sol.asteroidCollision(a)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({5,10,-5},"5,10",1);
    chk({8,-8},"",2);
    chk({10,2,-5},"10",3);
    chk({-2,-1,1,2},"-2,-1,1,2",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> a={${ge((t.trim()||`5 10 -5`).split(/\s+/).map(Number))}};
    auto r=sol.asteroidCollision(a);
    for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=",".join(map(str,sol.asteroidCollision([5,10,-5]))); exp="5,10"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([5,10,-5],"5,10"),([8,-8],""),([10,2,-5],"10"),([-2,-1,1,2],"-2,-1,1,2")]
passed=0; res=[]
for i,(a,exp) in enumerate(cases,1):
    got=",".join(map(str,sol.asteroidCollision(list(a)))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(",".join(map(str,sol.asteroidCollision([${(t.trim()||`5 10 -5`).split(/\s+/).map(Number).join(`,`)}]))))`}},{id:`celebrity-problem`,title:`Celebrity Problem`,difficulty:`Medium`,category:`stacks-queues`,askedBy:`himali`,description:[`In a party of <code>n</code> people, a celebrity is known by everyone but knows no one. Given a function <code>knows(a, b)</code>, find the celebrity or return -1.`,`Minimise calls to <code>knows</code>.`],examples:[{input:`n=4, knows matrix=[[0,0,1,0],[0,0,1,0],[0,0,0,0],[0,0,1,0]]`,output:`2`,explanation:`Person 2 is known by all others but knows nobody.`},{input:`n=2, knows=[[1,1],[0,0]]`,output:`1`}],constraints:[`2 ≤ n ≤ 100`,`knows[i][j] is 0 or 1`,`knows[i][i] = 0`],hints:[`Stack approach: push all people. Pop two at a time — if A knows B, A can't be celebrity, push B; else push A.`,`One candidate remains. Verify it by checking it knows no one and everyone knows it.`,`Total calls: O(n).`],inputFormat:`Conceptual — use run/submit modes (knows matrix encoded as input)`,defaultCustomInput:``,testCases:[{label:`Example 1`,input:`n=4, celebrity=2`,expected:`2`},{label:`Example 2`,input:`n=2, celebrity=1`,expected:`1`},{label:`No celeb`,input:`n=3, knows each other`,expected:`-1`},{label:`n=3 celeb`,input:`n=3, celebrity=2`,expected:`2`}],cppStarter:`class Solution {
    vector<vector<int>> mat;
    bool knows(int a, int b) { return mat[a][b]; }
public:
    int celebrity(int n, vector<vector<int>>& knows_mat) {
        mat = knows_mat;
        // find celebrity among people 0..n-1

    }
};`,pythonStarter:`class Solution:
    def celebrity(self, n: int, knows_mat: list) -> int:
        def knows(a, b): return knows_mat[a][b]
        # find celebrity among people 0..n-1
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<vector<int>> m={{0,0,1,0},{0,0,1,0},{0,0,0,0},{0,0,1,0}};
    int got=sol.celebrity(4,m);
    cout<<"\\n---RESULT---\\n";
    if(got==2) cout<<"RESULT:PASS:2:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:2:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<vector<int>> m,int exp,int n){
        int got=sol.celebrity((int)m.size(),m); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({{0,0,1,0},{0,0,1,0},{0,0,0,0},{0,0,1,0}},2,1);
    chk({{0,1},{0,0}},1,2);
    chk({{0,1,0},{0,0,1},{1,0,0}},-1,3);
    chk({{0,1,1},{0,0,1},{0,0,0}},2,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
m=[[0,0,1,0],[0,0,1,0],[0,0,0,0],[0,0,1,0]]
got=sol.celebrity(4,m)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==2 else 'FAIL'}:2:{got}")`;if(e===`submit`)return`
sol = Solution()
passed=0; res=[]
def chk(n,m,exp):
    global passed
    got=sol.celebrity(len(m),m); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[[0,0,1,0],[0,0,1,0],[0,0,0,0],[0,0,1,0]],2)
chk(2,[[0,1],[0,0]],1)
chk(3,[[0,1,0],[0,0,1],[1,0,0]],-1)
chk(4,[[0,1,1],[0,0,1],[0,0,0]],2)
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`lfu-cache`,title:`LFU Cache`,difficulty:`Hard`,category:`stacks-queues`,askedBy:`himali`,description:[`Design a Least Frequently Used (LFU) cache. When at capacity, evict the least frequently used key. Ties are broken by recency (LRU among LFU).`,`Implement <code>LFUCache(capacity)</code>, <code>get(key)</code>, <code>put(key, value)</code>, all in O(1).`],examples:[{input:`LFUCache(2); put(1,1); put(2,2); get(1)→1; put(3,3); get(2)→-1; get(3)→3; put(4,4); get(1)→1; get(3)→3; get(4)→4`,output:`1,-1,3,1,3,4`}],constraints:[`0 ≤ capacity ≤ 10⁴`,`0 ≤ key ≤ 10⁵`,`0 ≤ value ≤ 10⁹`],hints:[`Maintain: (1) key→(value, freq) map, (2) freq→ordered list of keys (LRU order within same freq), (3) minFreq tracker.`,`On get: increment freq, move from freq list to freq+1 list, update minFreq.`,`On put: if at capacity, evict from minFreq list (LRU end). Insert new key with freq=1, set minFreq=1.`],inputFormat:`Use run/submit modes`,defaultCustomInput:``,testCases:[{label:`LeetCode ex`,input:`cap=2; put(1,1);put(2,2);get(1);put(3,3);get(2);get(3);put(4,4);get(1);get(3);get(4)`,expected:`1,-1,3,1,3,4`},{label:`Cap=1`,input:`cap=1; put(1,1);get(1);put(2,2);get(1);get(2)`,expected:`1,-1,2`},{label:`Overwrite`,input:`cap=2; put(1,1);put(1,2);get(1)`,expected:`2`},{label:`LRU tie-break`,input:`cap=2; put(1,1);put(2,2);get(1);get(2);put(3,3);get(1);get(2);get(3)`,expected:`1,2,1,2,3`}],cppStarter:`class LFUCache {
    int cap, minFreq;
    unordered_map<int,pair<int,int>> kv;        // key -> {val, freq}
    unordered_map<int,list<int>> freqList;       // freq -> LRU list of keys
    unordered_map<int,list<int>::iterator> pos;  // key -> iterator in freqList
public:
    LFUCache(int capacity) : cap(capacity), minFreq(0) {}

    int get(int key) {

    }

    void put(int key, int value) {

    }
};`,pythonStarter:`from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity: int):


    def get(self, key: int) -> int:


    def put(self, key: int, value: int) -> None:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    LFUCache c(2);
    c.put(1,1);c.put(2,2);
    string got=to_string(c.get(1)); c.put(3,3);
    got+=","+to_string(c.get(2));
    got+=","+to_string(c.get(3)); c.put(4,4);
    got+=","+to_string(c.get(1));
    got+=","+to_string(c.get(3));
    got+=","+to_string(c.get(4));
    string exp="1,-1,3,1,3,4";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    int passed=0,total=4; vector<string> res;
    {LFUCache c(2); c.put(1,1);c.put(2,2); string g=to_string(c.get(1)); c.put(3,3); g+=","+to_string(c.get(2)); g+=","+to_string(c.get(3)); c.put(4,4); g+=","+to_string(c.get(1)); g+=","+to_string(c.get(3)); g+=","+to_string(c.get(4));
     bool ok=g=="1,-1,3,1,3,4"; passed+=ok; res.push_back("TEST:1"+(ok?string(":PASS:"):string(":FAIL:"))+"1,-1,3,1,3,4:"+g);}
    {LFUCache c(1); c.put(1,1); string g=to_string(c.get(1)); c.put(2,2); g+=","+to_string(c.get(1)); g+=","+to_string(c.get(2));
     bool ok=g=="1,-1,2"; passed+=ok; res.push_back("TEST:2"+(ok?string(":PASS:"):string(":FAIL:"))+"1,-1,2:"+g);}
    {LFUCache c(2); c.put(1,1); c.put(1,2); string g=to_string(c.get(1));
     bool ok=g=="2"; passed+=ok; res.push_back("TEST:3"+(ok?string(":PASS:"):string(":FAIL:"))+"2:"+g);}
    {LFUCache c(2); c.put(1,1);c.put(2,2); string g=to_string(c.get(1)); g+=","+to_string(c.get(2)); c.put(3,3); g+=","+to_string(c.get(1)); g+=","+to_string(c.get(2)); g+=","+to_string(c.get(3));
     bool ok=g=="1,2,1,2,3"; passed+=ok; res.push_back("TEST:4"+(ok?string(":PASS:"):string(":FAIL:"))+"1,2,1,2,3:"+g);}
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":4\\n";
    return passed==4?0:1;
}`;if(e===`custom`)return`int main(){cout<<"Use run/submit mode\\n";return 0;}`},buildPythonHarness(e,t=``){if(e===`run`)return`
c=LFUCache(2); c.put(1,1); c.put(2,2)
r=[c.get(1)]; c.put(3,3); r.append(c.get(2)); r.append(c.get(3)); c.put(4,4)
r.append(c.get(1)); r.append(c.get(3)); r.append(c.get(4))
got=",".join(map(str,r)); exp="1,-1,3,1,3,4"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
passed=0; res=[]
def chk(n,fn,exp):
    global passed; got=fn(); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
def t1():
    c=LFUCache(2); c.put(1,1); c.put(2,2); r=[c.get(1)]; c.put(3,3); r.append(c.get(2)); r.append(c.get(3)); c.put(4,4); r.append(c.get(1)); r.append(c.get(3)); r.append(c.get(4)); return ",".join(map(str,r))
def t2():
    c=LFUCache(1); c.put(1,1); r=[c.get(1)]; c.put(2,2); r.append(c.get(1)); r.append(c.get(2)); return ",".join(map(str,r))
def t3():
    c=LFUCache(2); c.put(1,1); c.put(1,2); return str(c.get(1))
def t4():
    c=LFUCache(2); c.put(1,1); c.put(2,2); r=[c.get(1),c.get(2)]; c.put(3,3); r.append(c.get(1)); r.append(c.get(2)); r.append(c.get(3)); return ",".join(map(str,r))
chk(1,t1,"1,-1,3,1,3,4"); chk(2,t2,"1,-1,2"); chk(3,t3,"2"); chk(4,t4,"1,2,1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`print("Use run/submit mode")`}},{id:`stock-span`,title:`Stock Span`,difficulty:`Medium`,category:`stacks-queues`,askedBy:`vjs`,description:[`The stock span of a stock on a given day is the maximum number of consecutive days (including today) for which the stock price was less than or equal to today's price.`,`Given an array of daily prices, return the span for each day.`],examples:[{input:`prices=[100,80,60,70,60,75,85]`,output:`[1,1,1,2,1,4,6]`},{input:`prices=[10,4,5,90,120,80]`,output:`[1,1,2,4,5,1]`}],constraints:[`1 ≤ prices.length ≤ 10⁵`,`1 ≤ prices[i] ≤ 10⁵`],hints:[`Use a monotonic stack of (price, span) pairs.`,`For each price, pop all smaller/equal prices from the stack and accumulate their spans.`,`Push current (price, accumulated_span) onto the stack.`],inputFormat:`Line 1: space-separated prices`,defaultCustomInput:`100 80 60 70 60 75 85`,testCases:[{label:`Example 1`,input:`prices=[100,80,60,70,60,75,85]`,expected:`1,1,1,2,1,4,6`},{label:`Example 2`,input:`prices=[10,4,5,90,120,80]`,expected:`1,1,2,4,5,1`},{label:`Increasing`,input:`prices=[1,2,3,4,5]`,expected:`1,2,3,4,5`},{label:`Decreasing`,input:`prices=[5,4,3,2,1]`,expected:`1,1,1,1,1`}],cppStarter:`class Solution {
public:
    vector<int> calculateSpan(vector<int>& prices) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def calculateSpan(self, prices: List[int]) -> List[int]:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol; auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    vector<int> p={100,80,60,70,60,75,85};
    string got=fmtV(sol.calculateSpan(p)), exp="1,1,1,2,1,4,6";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> p,string exp,int n){
        string got=fmtV(sol.calculateSpan(p)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({100,80,60,70,60,75,85},"1,1,1,2,1,4,6",1);
    chk({10,4,5,90,120,80},"1,1,2,4,5,1",2);
    chk({1,2,3,4,5},"1,2,3,4,5",3);
    chk({5,4,3,2,1},"1,1,1,1,1",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> p={${ge((t.trim()||`100 80 60 70 60 75 85`).split(/\s+/).map(Number))}};
    auto r=sol.calculateSpan(p);
    for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=",".join(map(str,sol.calculateSpan([100,80,60,70,60,75,85]))); exp="1,1,1,2,1,4,6"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([100,80,60,70,60,75,85],"1,1,1,2,1,4,6"),([10,4,5,90,120,80],"1,1,2,4,5,1"),([1,2,3,4,5],"1,2,3,4,5"),([5,4,3,2,1],"1,1,1,1,1")]
passed=0; res=[]
for i,(p,exp) in enumerate(cases,1):
    got=",".join(map(str,sol.calculateSpan(list(p)))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(",".join(map(str,sol.calculateSpan([${(t.trim()||`100 80 60 70 60 75 85`).split(/\s+/).map(Number).join(`,`)}]))))`}},{id:`largest-rectangle-histogram`,title:`Largest Rectangle in a Histogram`,difficulty:`Hard`,category:`stacks-queues`,askedBy:`vjs`,description:[`Given an array of integers <code>heights</code> representing the histogram's bar heights (width 1 each), return the area of the largest rectangle in the histogram.`],examples:[{input:`heights=[2,1,5,6,2,3]`,output:`10`,explanation:`Rectangle of height 5, width 2 (bars 2 and 3).`},{input:`heights=[2,4]`,output:`4`}],constraints:[`1 ≤ heights.length ≤ 10⁵`,`0 ≤ heights[i] ≤ 10⁴`],hints:[`Use a monotonic increasing stack. For each bar, when you encounter a smaller bar, pop and compute area.`,`Popped bar's width extends from the new stack top + 1 to current index − 1.`,`Push a sentinel 0 at the end to flush the stack.`],inputFormat:`Line 1: space-separated heights`,defaultCustomInput:`2 1 5 6 2 3`,testCases:[{label:`Example 1`,input:`heights=[2,1,5,6,2,3]`,expected:`10`},{label:`Example 2`,input:`heights=[2,4]`,expected:`4`},{label:`Single`,input:`heights=[5]`,expected:`5`},{label:`Flat`,input:`heights=[3,3,3,3]`,expected:`12`}],cppStarter:`class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> h={2,1,5,6,2,3};
    int got=sol.largestRectangleArea(h);
    cout<<"\\n---RESULT---\\n";
    if(got==10) cout<<"RESULT:PASS:10:"<<got<<"\\n";
    else        cout<<"RESULT:FAIL:10:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> h,int exp,int n){
        int got=sol.largestRectangleArea(h); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({2,1,5,6,2,3},10,1);
    chk({2,4},4,2);
    chk({5},5,3);
    chk({3,3,3,3},12,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> h={${ge((t.trim()||`2 1 5 6 2 3`).split(/\s+/).map(Number))}};
    cout<<sol.largestRectangleArea(h)<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=sol.largestRectangleArea([2,1,5,6,2,3])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==10 else 'FAIL'}:10:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([2,1,5,6,2,3],10),([2,4],4),([5],5),([3,3,3,3],12)]
passed=0; res=[]
for i,(h,exp) in enumerate(cases,1):
    got=sol.largestRectangleArea(list(h)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(sol.largestRectangleArea([${(t.trim()||`2 1 5 6 2 3`).split(/\s+/).map(Number).join(`,`)}]))`}},{id:`sum-subarray-minimums`,title:`Sum of Subarray Minimums`,difficulty:`Medium`,category:`stacks-queues`,askedBy:`vjs`,description:[`Given an array of integers <code>arr</code>, find the sum of <code>min(b)</code> for every (contiguous) subarray <code>b</code>. Return the answer modulo <code>10⁹ + 7</code>.`],examples:[{input:`arr=[3,1,2,4]`,output:`17`,explanation:`Subarrays: [3]=3, [1]=1, [2]=2, [4]=4, [3,1]=1, [1,2]=1, [2,4]=2, [3,1,2]=1, [1,2,4]=1, [3,1,2,4]=1. Sum=17.`},{input:`arr=[11,81,94,43,3]`,output:`444`}],constraints:[`1 ≤ arr.length ≤ 3×10⁴`,`1 ≤ arr[i] ≤ 3×10⁴`],hints:[`For each element arr[i], count how many subarrays have arr[i] as their minimum. Multiply arr[i] by that count.`,`Use monotonic stacks to find: left[i] = distance to previous smaller element, right[i] = distance to next smaller or equal.`,`Contribution of arr[i] = arr[i] × left[i] × right[i].`],inputFormat:`Line 1: space-separated integers`,defaultCustomInput:`3 1 2 4`,testCases:[{label:`Example 1`,input:`arr=[3,1,2,4]`,expected:`17`},{label:`Example 2`,input:`arr=[11,81,94,43,3]`,expected:`444`},{label:`Single`,input:`arr=[5]`,expected:`5`},{label:`Equal`,input:`arr=[1,1,1]`,expected:`6`}],cppStarter:`class Solution {
public:
    int sumSubarrayMins(vector<int>& arr) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def sumSubarrayMins(self, arr: List[int]) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<int> a={3,1,2,4};
    int got=sol.sumSubarrayMins(a);
    cout<<"\\n---RESULT---\\n";
    if(got==17) cout<<"RESULT:PASS:17:"<<got<<"\\n";
    else        cout<<"RESULT:FAIL:17:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,int exp,int n){
        int got=sol.sumSubarrayMins(a); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({3,1,2,4},17,1);
    chk({11,81,94,43,3},444,2);
    chk({5},5,3);
    chk({1,1,1},6,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<int> a={${ge((t.trim()||`3 1 2 4`).split(/\s+/).map(Number))}};
    cout<<sol.sumSubarrayMins(a)<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
got=sol.sumSubarrayMins([3,1,2,4])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==17 else 'FAIL'}:17:{got}")`;if(e===`submit`)return`
sol = Solution()
cases=[([3,1,2,4],17),([11,81,94,43,3],444),([5],5),([1,1,1],6)]
passed=0; res=[]
for i,(a,exp) in enumerate(cases,1):
    got=sol.sumSubarrayMins(list(a)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`;if(e===`custom`)return`
sol = Solution()
print(sol.sumSubarrayMins([${(t.trim()||`3 1 2 4`).split(/\s+/).map(Number).join(`,`)}]))`}},{id:`maximum-rectangle`,title:`Maximum Rectangle`,difficulty:`Hard`,category:`stacks-queues`,askedBy:`vjs`,description:[`Given a 2D binary matrix filled with <code>0</code>s and <code>1</code>s, find the largest rectangle containing only <code>1</code>s and return its area.`],examples:[{input:`matrix=[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]`,output:`6`},{input:`matrix=[["0"]]`,output:`0`}],constraints:[`rows, cols ≤ 200`,`matrix[i][j] is "0" or "1"`],hints:[`Build a histogram row by row: heights[j] = number of consecutive 1s ending at current row in column j.`,`Apply the "Largest Rectangle in Histogram" solution on each row's heights.`,`Time O(rows × cols).`],inputFormat:`Each line: space-separated 0s and 1s (one row of the matrix)`,defaultCustomInput:`1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0`,testCases:[{label:`Example 1`,input:`matrix=4×5 (see description)`,expected:`6`},{label:`All zeros`,input:`matrix=[["0"]]`,expected:`0`},{label:`All ones`,input:`matrix=2×2 all 1s`,expected:`4`},{label:`1 row`,input:`matrix=[1,0,1,1,1]`,expected:`3`}],cppStarter:`class Solution {
public:
    int maximalRectangle(vector<vector<char>>& matrix) {

    }
};`,pythonStarter:`from typing import List

class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        `,buildCppHarness(e,t=``){if(e===`run`)return`
int main() {
    Solution sol;
    vector<vector<char>> m={{'1','0','1','0','0'},{'1','0','1','1','1'},{'1','1','1','1','1'},{'1','0','0','1','0'}};
    int got=sol.maximalRectangle(m);
    cout<<"\\n---RESULT---\\n";
    if(got==6) cout<<"RESULT:PASS:6:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:6:"<<got<<"\\n";
    return 0;
}`;if(e===`submit`)return`
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<vector<char>> m,int exp,int n){
        int got=sol.maximalRectangle(m); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({{'1','0','1','0','0'},{'1','0','1','1','1'},{'1','1','1','1','1'},{'1','0','0','1','0'}},6,1);
    chk({{'0'}},0,2);
    chk({{'1','1'},{'1','1'}},4,3);
    chk({{'1','0','1','1','1'}},3,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`;if(e===`custom`)return`
int main() {
    Solution sol;
    vector<vector<char>> m={${t.trim().split(`
`).map(e=>e.trim().split(/\s+/).map(e=>e===`1`?`'1'`:`'0'`)).map(e=>`{${e.join(`,`)}}`).join(`,`)}};
    cout<<sol.maximalRectangle(m)<<"\\n";
    return 0;
}`},buildPythonHarness(e,t=``){if(e===`run`)return`
sol = Solution()
m=[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
got=sol.maximalRectangle(m)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==6 else 'FAIL'}:6:{got}")`;if(e===`submit`)return`
sol = Solution()
passed=0; res=[]
def chk(n,m,exp):
    global passed
    got=sol.maximalRectangle(m); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]],6)
chk(2,[["0"]],0)
chk(3,[["1","1"],["1","1"]],4)
chk(4,[["1","0","1","1","1"]],3)
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`;if(e===`custom`)return`
sol = Solution()
m=[${t.trim().split(`
`).map(e=>JSON.stringify(e.trim().split(/\s+/))).join(`,`)}]
print(sol.maximalRectangle(m))`}}];function ve(){return(0,T.jsx)(de,{heights:[0,1,0,2,1,0,1,3,2,1,2,1],waterFill:!0,label:`Blue bars = water trapped above each column`})}function ye(){return(0,T.jsx)(de,{heights:[2,1,5,6,2,3],highlight:[2,3],label:`Largest rectangle = 10 (bars at index 2,3 with height 5,6)`})}function be(){let e=[[`1`,`0`,`1`,`0`,`0`],[`1`,`0`,`1`,`1`,`1`],[`1`,`1`,`1`,`1`,`1`],[`1`,`0`,`0`,`1`,`0`]],t=new Set([`1,2`,`1,3`,`1,4`,`2,2`,`2,3`,`2,4`]),n=e[0].length*32,r=e.length*32;return(0,T.jsxs)(`div`,{className:`viz-label-wrap`,children:[(0,T.jsx)(`div`,{className:`viz-label`,children:`Max rectangle = 6 (highlighted region)`}),(0,T.jsx)(`svg`,{viewBox:`0 0 ${n} ${r}`,width:n,height:r,className:`viz-grid`,children:e.map((e,n)=>e.map((e,r)=>{let i=t.has(`${n},${r}`);return(0,T.jsxs)(`g`,{children:[(0,T.jsx)(`rect`,{x:r*32,y:n*32,width:30,height:30,fill:e===`0`?`var(--surface-3)`:i?`var(--success)`:`var(--accent)`,rx:4}),(0,T.jsx)(`text`,{x:r*32+32/2,y:n*32+32/2+5,textAnchor:`middle`,fontSize:13,fill:`var(--text)`,fontFamily:`monospace`,children:e})]},`${n}-${r}`)}))})]})}var xe={"trapping-rain-water":()=>(0,T.jsx)(ve,{}),"largest-rectangle-histogram":()=>(0,T.jsx)(ye,{}),"maximum-rectangle":()=>(0,T.jsx)(be,{})},Se=[{id:`binary-search`,label:`Binary Search`},{id:`greedy`,label:`Greedy`},{id:`binary-trees`,label:`Binary Trees`},{id:`heap`,label:`Heap`},{id:`sliding-window`,label:`Sliding Window & Two Pointers`},{id:`stacks-queues`,label:`Stacks & Queues`}],Ce=[...C,...ee,...oe,...ue,...pe,..._e],we={...E,...he,...xe},Te=`#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <algorithm>
#include <numeric>
#include <climits>
#include <cmath>
#include <queue>
#include <stack>
#include <deque>
#include <functional>
#include <sstream>
#include <utility>
#include <iomanip>
#include <list>
using namespace std;
`;function Ee(e,t,n,r,i=``){return n===`cpp`?De(e,t,r,i):Oe(e,t,r,i)}function De(e,t,n,r){let i=e.replace(/#include\s*<bits\/stdc\+\+\.h>\s*\n?/g,``).replace(/#include\s*<\w[^>]*>\s*\n?/g,``).replace(/using\s+namespace\s+std\s*;\s*\n?/g,``).trimStart(),a=t.buildCppHarness(n,r)??``;return Te+`
`+i+`
`+a}function Oe(e,t,n,r){let i=t.buildPythonHarness(n,r)??``;return e+`
`+i}function ke(e){let t=e.findIndex(e=>e.text.includes(`---RESULT---`)),n=t>=0?e.slice(0,t):e;if(t>=0){let r=e[t],i=r.text.slice(0,r.text.indexOf(`---RESULT---`)).trimEnd();i&&(n=[...n,{text:i+`
`,cls:r.cls}])}let r=t>=0?e.slice(t+1):[],i=[],a=null;for(let{text:e}of r){let t=e.trim(),n=t.match(/^TEST:(\d+):(PASS|FAIL):(.+):(.+)$/);if(n){i.push({n:parseInt(n[1]),passed:n[2]===`PASS`,expected:n[3],got:n[4]});continue}let r=t.match(/^RESULT:(PASS|FAIL):(.+):(.+)$/);if(r){i.push({n:1,passed:r[1]===`PASS`,expected:r[2],got:r[3]});continue}let o=t.match(/^SUMMARY:(\d+):(\d+)$/);o&&(a={passed:parseInt(o[1]),total:parseInt(o[2])})}return{outputLines:n,tests:i,summary:a}}var Ae=`dsa-code`,je=`dsa-status`;function Me(e){try{return JSON.parse(localStorage.getItem(e))??{}}catch{return{}}}function Ne(){let[e,t]=(0,y.useState)(()=>Me(je)),n=(0,y.useRef)(Me(Ae)),r=(0,y.useRef)({});return{getCode:(0,y.useCallback)((e,t)=>{let r=n.current[e]?.[t];return r===void 0?Ce.find(t=>t.id===e)?.[`${t}Starter`]??``:r},[]),saveCode:(0,y.useCallback)((e,t,i)=>{n.current={...n.current,[e]:{...n.current[e],[t]:i}},clearTimeout(r.current[e]),r.current[e]=setTimeout(()=>{localStorage.setItem(Ae,JSON.stringify(n.current))},500)},[]),getStatus:(0,y.useCallback)(t=>e[t]??null,[e]),setStatus:(0,y.useCallback)((e,n)=>{t(t=>{let r={...t,[e]:n};return localStorage.setItem(je,JSON.stringify(r)),r})},[])}}function Pe({categories:e,problems:t,selectedId:n,onSelect:r,getStatus:i,onStatusChange:a,collapsed:o,onToggle:s}){let[c,l]=(0,y.useState)(null),u=e.map(e=>({...e,items:t.filter(t=>t.category===e.id)})),d=0;return(0,T.jsxs)(`aside`,{className:`sidebar${o?` collapsed`:``}`,children:[(0,T.jsxs)(`div`,{className:`sidebar-logo`,children:[!o&&(0,T.jsx)(`span`,{className:`logo-text`,children:`Practice`}),(0,T.jsx)(`button`,{className:`sidebar-toggle`,onClick:s,title:o?`Expand sidebar`:`Collapse sidebar`,children:o?`›`:`‹`})]}),(0,T.jsx)(`nav`,{className:`problem-list`,children:u.map(e=>(0,T.jsxs)(`div`,{className:`category-group`,children:[!o&&(0,T.jsx)(`div`,{className:`category-header`,children:e.label}),e.items.map(e=>{let t=++d,s=i(e.id);return(0,T.jsxs)(`div`,{className:`problem-row${n===e.id?` active`:``}`,children:[(0,T.jsxs)(`button`,{className:`problem-item`,onClick:()=>{r(e),l(null)},title:o?e.title:void 0,children:[(0,T.jsx)(`span`,{className:`problem-number`,children:String(t).padStart(2,`0`)}),!o&&(0,T.jsxs)(`span`,{className:`problem-item-content`,children:[(0,T.jsx)(`span`,{className:`problem-item-title`,children:e.title}),(0,T.jsxs)(`span`,{className:`problem-item-meta`,children:[(0,T.jsx)(`span`,{className:`asked-pill ${e.askedBy}`,children:e.askedBy===`himali`?`H`:`V`}),(0,T.jsx)(`span`,{className:`status-badge ${s||`none`}`,children:s===`complete`?`✓`:s===`revise`?`↩`:`○`})]})]}),o&&s&&(0,T.jsx)(`span`,{className:`status-dot ${s}`})]}),!o&&(0,T.jsxs)(`div`,{className:`context-wrap`,children:[(0,T.jsx)(`button`,{className:`context-btn`,onClick:t=>{t.stopPropagation(),l(c===e.id?null:e.id)},children:`⋯`}),c===e.id&&(0,T.jsxs)(`div`,{className:`context-popover`,children:[(0,T.jsxs)(`button`,{onClick:()=>{a(e.id,s===`complete`?null:`complete`),l(null)},children:[(0,T.jsx)(`span`,{className:`ctx-icon complete`,children:`✓`}),s===`complete`?`Unmark Complete`:`Mark Complete`]}),(0,T.jsxs)(`button`,{onClick:()=>{a(e.id,s===`revise`?null:`revise`),l(null)},children:[(0,T.jsx)(`span`,{className:`ctx-icon revise`,children:`↩`}),s===`revise`?`Unmark Revise`:`Mark Revise`]})]})]})]},e.id)})]},e.id))}),(0,T.jsxs)(`div`,{className:`sidebar-footer`,children:[(0,T.jsx)(`span`,{className:`footer-dot`}),!o&&(0,T.jsx)(`span`,{children:`Runs locally · no data leaves device`})]})]})}var Fe={teal:{bg:`rgba(148,226,213,.18)`,color:`#94e2d5`,border:`rgba(148,226,213,.4)`},blue:{bg:`rgba(137,180,250,.18)`,color:`#89b4fa`,border:`rgba(137,180,250,.4)`},mauve:{bg:`rgba(203,166,247,.18)`,color:`#cba6f7`,border:`rgba(203,166,247,.4)`},peach:{bg:`rgba(250,179,135,.18)`,color:`#fab387`,border:`rgba(250,179,135,.4)`},green:{bg:`rgba(166,227,161,.18)`,color:`#a6e3a1`,border:`rgba(166,227,161,.4)`}},Ie={bg:`rgba(49,50,68,.6)`,color:`#585b70`,border:`#313244`};function Le({value:e,color:t}){let n=t?Fe[t]:Ie;return(0,T.jsx)(`span`,{className:`viz-cell`,style:{background:n.bg,color:n.color,borderColor:n.border},children:e})}function Re({array:e,windows:t,caption:n}){return(0,T.jsxs)(`div`,{className:`example-viz`,children:[t.map((t,n)=>(0,T.jsxs)(`div`,{className:`viz-row`,children:[(0,T.jsx)(`div`,{className:`viz-cells`,children:e.map((e,n)=>(0,T.jsx)(Le,{value:e,color:n>=t.range[0]&&n<=t.range[1]?t.color:null},n))}),t.label&&(0,T.jsx)(`span`,{className:`viz-row-label`,children:t.label})]},n)),n&&(0,T.jsx)(`p`,{className:`viz-caption`,children:n})]})}function ze({array:e,leftCount:t,rightCount:n,caption:r}){return(0,T.jsxs)(`div`,{className:`example-viz`,children:[(0,T.jsx)(`div`,{className:`viz-row`,children:(0,T.jsx)(`div`,{className:`viz-cells`,children:e.map((r,i)=>{let a=i<t,o=i>=e.length-n;return(0,T.jsx)(Le,{value:r,color:a?`teal`:o?`peach`:null},i)})})}),r&&(0,T.jsx)(`p`,{className:`viz-caption`,children:r})]})}function Be({s:e,t,window:n,matches:r,caption:i}){return(0,T.jsxs)(`div`,{className:`example-viz`,children:[(0,T.jsxs)(`div`,{className:`viz-row`,children:[(0,T.jsx)(`span`,{className:`viz-seq-label`,children:`s`}),(0,T.jsx)(`div`,{className:`viz-cells`,children:e.split(``).map((e,t)=>{let i=t>=n.start&&t<=n.end;return(0,T.jsx)(Le,{value:e,color:r.includes(t)?`teal`:i?`blue`:null},t)})})]}),(0,T.jsxs)(`div`,{className:`viz-row`,children:[(0,T.jsx)(`span`,{className:`viz-seq-label`,children:`t`}),(0,T.jsx)(`div`,{className:`viz-cells`,children:t.split(``).map((e,t)=>(0,T.jsx)(Le,{value:e,color:`teal`},t))})]}),i&&(0,T.jsx)(`p`,{className:`viz-caption`,children:i})]})}function Ve({viz:e}){return e?e.type===`array-windows`?(0,T.jsx)(Re,{...e}):e.type===`array-ends`?(0,T.jsx)(ze,{...e}):e.type===`string-window`?(0,T.jsx)(Be,{...e}):null:null}var He={Easy:`easy`,Medium:`medium`,Hard:`hard`};function Ue({hints:e}){let[t,n]=(0,y.useState)(0);return(0,T.jsxs)(`div`,{className:`hints-section`,children:[(0,T.jsx)(`div`,{className:`section-label`,children:`Hints`}),(0,T.jsx)(`div`,{className:`hints-list`,children:e.map((e,r)=>{let i=r<t;return(0,T.jsx)(`div`,{className:`hint-item ${i?`unlocked`:``}`,children:i?(0,T.jsx)(`p`,{dangerouslySetInnerHTML:{__html:e}}):r===t?(0,T.jsxs)(`button`,{className:`unlock-hint-btn`,onClick:()=>n(r+1),children:[`Reveal Hint `,r+1]}):(0,T.jsxs)(`span`,{className:`hint-locked`,children:[`— Hint `,r+1,` locked`]})},r)})})]})}function We({problem:e}){return e?(0,T.jsxs)(`div`,{className:`problem-panel`,children:[(0,T.jsxs)(`div`,{className:`problem-header`,children:[(0,T.jsx)(`h1`,{className:`problem-title`,children:e.title}),(0,T.jsxs)(`div`,{className:`problem-meta`,children:[(0,T.jsx)(`span`,{className:`diff-badge ${He[e.difficulty]}`,children:e.difficulty}),(0,T.jsx)(`span`,{className:`category-tag`,children:Se.find(t=>t.id===e.category)?.label??e.category})]})]}),(0,T.jsxs)(`div`,{className:`problem-body`,children:[(0,T.jsx)(`div`,{className:`problem-description`,children:e.description.map((e,t)=>(0,T.jsx)(`p`,{dangerouslySetInnerHTML:{__html:e}},t))}),(0,T.jsx)(`div`,{className:`section-label`,children:`Examples`}),e.examples.map((e,t)=>(0,T.jsxs)(`div`,{className:`example-block`,children:[(0,T.jsxs)(`div`,{className:`example-num`,children:[`Example `,t+1]}),(0,T.jsxs)(`div`,{className:`example-io`,children:[(0,T.jsxs)(`div`,{className:`io-row`,children:[(0,T.jsx)(`span`,{className:`io-label`,children:`Input`}),(0,T.jsx)(`code`,{className:`io-value`,children:e.input})]}),(0,T.jsxs)(`div`,{className:`io-row`,children:[(0,T.jsx)(`span`,{className:`io-label`,children:`Output`}),(0,T.jsx)(`code`,{className:`io-value io-value-output`,children:e.output})]})]}),e.explanation&&(0,T.jsx)(`p`,{className:`example-explanation`,dangerouslySetInnerHTML:{__html:e.explanation}}),e.visualization&&(0,T.jsx)(Ve,{viz:e.visualization})]},t)),we[e.id]&&(0,T.jsx)(`div`,{className:`viz-section`,children:we[e.id]()}),(0,T.jsx)(`div`,{className:`section-label`,children:`Constraints`}),(0,T.jsx)(`ul`,{className:`constraints-list`,children:e.constraints.map((e,t)=>(0,T.jsx)(`li`,{children:e},t))}),(0,T.jsxs)(`div`,{className:`section-label`,children:[`Test Cases`,(0,T.jsx)(`span`,{className:`section-sublabel`,children:`all visible`})]}),(0,T.jsx)(`div`,{className:`test-cases-grid`,children:e.testCases.map((e,t)=>(0,T.jsxs)(`div`,{className:`tc-card`,children:[(0,T.jsxs)(`div`,{className:`tc-card-header`,children:[(0,T.jsx)(`span`,{className:`tc-number`,children:String(t+1).padStart(2,`0`)}),(0,T.jsx)(`span`,{className:`tc-label`,children:e.label})]}),(0,T.jsxs)(`div`,{className:`tc-card-body`,children:[(0,T.jsx)(`span`,{className:`tc-field-label`,children:`Input`}),(0,T.jsx)(`code`,{className:`tc-input`,children:e.input})]}),(0,T.jsxs)(`div`,{className:`tc-card-footer`,children:[(0,T.jsx)(`span`,{className:`tc-expected-label`,children:`Expected`}),(0,T.jsx)(`span`,{className:`tc-expected`,children:e.expected})]})]},t))}),(0,T.jsx)(Ue,{hints:e.hints},e.id)]})]}):null}function Ge(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function Ke(e){if(Array.isArray(e))return e}function qe(e,t,n){return(t=nt(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Je(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t!==0)for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function Ye(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Xe(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function Ze(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Xe(Object(n),!0).forEach(function(t){qe(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Xe(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Qe(e,t){if(e==null)return{};var n,r,i=$e(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function $e(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function et(e,t){return Ke(e)||Je(e,t)||rt(e,t)||Ye()}function tt(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function nt(e){var t=tt(e,`string`);return typeof t==`symbol`?t:t+``}function rt(e,t){if(e){if(typeof e==`string`)return Ge(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Ge(e,t):void 0}}function it(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function at(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function ot(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?at(Object(n),!0).forEach(function(t){it(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):at(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function st(){var e=[...arguments];return function(t){return e.reduceRight(function(e,t){return t(e)},t)}}function ct(e){return function t(){var n=this,r=[...arguments];return r.length>=e.length?e.apply(this,r):function(){var e=[...arguments];return t.apply(n,[].concat(r,e))}}}function lt(e){return{}.toString.call(e).includes(`Object`)}function ut(e){return!Object.keys(e).length}function dt(e){return typeof e==`function`}function ft(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function pt(e,t){return lt(t)||vt(`changeType`),Object.keys(t).some(function(t){return!ft(e,t)})&&vt(`changeField`),t}function mt(e){dt(e)||vt(`selectorType`)}function ht(e){dt(e)||lt(e)||vt(`handlerType`),lt(e)&&Object.values(e).some(function(e){return!dt(e)})&&vt(`handlersType`)}function gt(e){e||vt(`initialIsRequired`),lt(e)||vt(`initialType`),ut(e)&&vt(`initialContent`)}function _t(e,t){throw Error(e[t]||e.default)}var vt=ct(_t)({initialIsRequired:`initial state is required`,initialType:`initial state should be an object`,initialContent:`initial state shouldn't be an empty object`,handlerType:`handler should be an object or a function`,handlersType:`all handlers should be a functions`,selectorType:`selector should be a function`,changeType:`provided value of changes should be an object`,changeField:`it seams you want to change a field in the state which is not specified in the "initial" state`,default:"an unknown error accured in `state-local` package"}),yt={changes:pt,selector:mt,handler:ht,initial:gt};function bt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};yt.initial(e),yt.handler(t);var n={current:e},r=ct(Ct)(n,t),i=ct(St)(n),a=ct(yt.changes)(e),o=ct(xt)(n);function s(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:function(e){return e};return yt.selector(e),e(n.current)}function c(e){st(r,i,a,o)(e)}return[s,c]}function xt(e,t){return dt(t)?t(e.current):t}function St(e,t){return e.current=ot(ot({},e.current),t),t}function Ct(e,t,n){return dt(t)?t(e.current):Object.keys(n).forEach(function(n){return t[n]?.call(t,e.current[n])}),n}var wt={create:bt},Tt={paths:{vs:`https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs`}};function Et(e){return function t(){var n=this,r=[...arguments];return r.length>=e.length?e.apply(this,r):function(){var e=[...arguments];return t.apply(n,[].concat(r,e))}}}function Dt(e){return{}.toString.call(e).includes(`Object`)}function k(e){return e||jt(`configIsRequired`),Dt(e)||jt(`configType`),e.urls?(Ot(),{paths:{vs:e.urls.monacoBase}}):e}function Ot(){console.warn(At.deprecation)}function kt(e,t){throw Error(e[t]||e.default)}var At={configIsRequired:`the configuration object is required`,configType:`the configuration object should be an object`,default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:`Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `},jt=Et(kt)(At),Mt={config:k},Nt=function(){var e=[...arguments];return function(t){return e.reduceRight(function(e,t){return t(e)},t)}};function Pt(e,t){return Object.keys(t).forEach(function(n){t[n]instanceof Object&&e[n]&&Object.assign(t[n],Pt(e[n],t[n]))}),Ze(Ze({},e),t)}var Ft={type:`cancelation`,msg:`operation is manually canceled`};function A(e){var t=!1,n=new Promise(function(n,r){e.then(function(e){return t?r(Ft):n(e)}),e.catch(r)});return n.cancel=function(){return t=!0},n}var It=[`monaco`],Lt=et(wt.create({config:Tt,isInitialized:!1,resolve:null,reject:null,monaco:null}),2),Rt=Lt[0],zt=Lt[1];function Bt(e){var t=Mt.config(e),n=t.monaco,r=Qe(t,It);zt(function(e){return{config:Pt(e.config,r),monaco:n}})}function Vt(){var e=Rt(function(e){return{monaco:e.monaco,isInitialized:e.isInitialized,resolve:e.resolve}});if(!e.isInitialized){if(zt({isInitialized:!0}),e.monaco)return e.resolve(e.monaco),A(Jt);if(window.monaco&&window.monaco.editor)return Kt(window.monaco),e.resolve(window.monaco),A(Jt);Nt(Ht,Wt)(Gt)}return A(Jt)}function Ht(e){return document.body.appendChild(e)}function Ut(e){var t=document.createElement(`script`);return e&&(t.src=e),t}function Wt(e){var t=Rt(function(e){return{config:e.config,reject:e.reject}}),n=Ut(`${t.config.paths.vs}/loader.js`);return n.onload=function(){return e()},n.onerror=t.reject,n}function Gt(){var e=Rt(function(e){return{config:e.config,resolve:e.resolve,reject:e.reject}}),t=window.require;t.config(e.config),t([`vs/editor/editor.main`],function(t){var n=t.m||t;Kt(n),e.resolve(n)},function(t){e.reject(t)})}function Kt(e){Rt().monaco||zt({monaco:e})}function qt(){return Rt(function(e){return e.monaco})}var Jt=new Promise(function(e,t){return zt({resolve:e,reject:t})}),Yt={config:Bt,init:Vt,__getMonacoInstance:qt},Xt={wrapper:{display:`flex`,position:`relative`,textAlign:`initial`},fullWidth:{width:`100%`},hide:{display:`none`}},Zt={container:{display:`flex`,height:`100%`,width:`100%`,justifyContent:`center`,alignItems:`center`}};function Qt({children:e}){return y.createElement(`div`,{style:Zt.container},e)}var $t=Qt;function en({width:e,height:t,isEditorReady:n,loading:r,_ref:i,className:a,wrapperProps:o}){return y.createElement(`section`,{style:{...Xt.wrapper,width:e,height:t},...o},!n&&y.createElement($t,null,r),y.createElement(`div`,{ref:i,style:{...Xt.fullWidth,...!n&&Xt.hide},className:a}))}var tn=(0,y.memo)(en);function nn(e){(0,y.useEffect)(e,[])}var rn=nn;function an(e,t,n=!0){let r=(0,y.useRef)(!0);(0,y.useEffect)(r.current||!n?()=>{r.current=!1}:e,t)}var on=an;function sn(){}function cn(e,t,n,r){return ln(e,r)||un(e,t,n,r)}function ln(e,t){return e.editor.getModel(dn(e,t))}function un(e,t,n,r){return e.editor.createModel(t,n,r?dn(e,r):void 0)}function dn(e,t){return e.Uri.parse(t)}function fn({original:e,modified:t,language:n,originalLanguage:r,modifiedLanguage:i,originalModelPath:a,modifiedModelPath:o,keepCurrentOriginalModel:s=!1,keepCurrentModifiedModel:c=!1,theme:l=`light`,loading:u=`Loading...`,options:d={},height:f=`100%`,width:p=`100%`,className:m,wrapperProps:h={},beforeMount:g=sn,onMount:_=sn}){let[v,b]=(0,y.useState)(!1),[x,S]=(0,y.useState)(!0),C=(0,y.useRef)(null),w=(0,y.useRef)(null),ee=(0,y.useRef)(null),te=(0,y.useRef)(_),T=(0,y.useRef)(g),ne=(0,y.useRef)(!1);rn(()=>{let e=Yt.init();return e.then(e=>(w.current=e)&&S(!1)).catch(e=>e?.type!==`cancelation`&&console.error(`Monaco initialization: error:`,e)),()=>C.current?ae():e.cancel()}),on(()=>{if(C.current&&w.current){let t=C.current.getOriginalEditor(),i=cn(w.current,e||``,r||n||`text`,a||``);i!==t.getModel()&&t.setModel(i)}},[a],v),on(()=>{if(C.current&&w.current){let e=C.current.getModifiedEditor(),r=cn(w.current,t||``,i||n||`text`,o||``);r!==e.getModel()&&e.setModel(r)}},[o],v),on(()=>{let e=C.current.getModifiedEditor();e.getOption(w.current.editor.EditorOption.readOnly)?e.setValue(t||``):t!==e.getValue()&&(e.executeEdits(``,[{range:e.getModel().getFullModelRange(),text:t||``,forceMoveMarkers:!0}]),e.pushUndoStop())},[t],v),on(()=>{C.current?.getModel()?.original.setValue(e||``)},[e],v),on(()=>{let{original:e,modified:t}=C.current.getModel();w.current.editor.setModelLanguage(e,r||n||`text`),w.current.editor.setModelLanguage(t,i||n||`text`)},[n,r,i],v),on(()=>{w.current?.editor.setTheme(l)},[l],v),on(()=>{C.current?.updateOptions(d)},[d],v);let re=(0,y.useCallback)(()=>{if(!w.current)return;T.current(w.current);let s=cn(w.current,e||``,r||n||`text`,a||``),c=cn(w.current,t||``,i||n||`text`,o||``);C.current?.setModel({original:s,modified:c})},[n,t,i,e,r,a,o]),ie=(0,y.useCallback)(()=>{!ne.current&&ee.current&&(C.current=w.current.editor.createDiffEditor(ee.current,{automaticLayout:!0,...d}),re(),w.current?.editor.setTheme(l),b(!0),ne.current=!0)},[d,l,re]);(0,y.useEffect)(()=>{v&&te.current(C.current,w.current)},[v]),(0,y.useEffect)(()=>{!x&&!v&&ie()},[x,v,ie]);function ae(){let e=C.current?.getModel();s||e?.original?.dispose(),c||e?.modified?.dispose(),C.current?.dispose()}return y.createElement(tn,{width:p,height:f,isEditorReady:v,loading:u,_ref:ee,className:m,wrapperProps:h})}(0,y.memo)(fn);function pn(e){let t=(0,y.useRef)();return(0,y.useEffect)(()=>{t.current=e},[e]),t.current}var mn=pn,hn=new Map;function j({defaultValue:e,defaultLanguage:t,defaultPath:n,value:r,language:i,path:a,theme:o=`light`,line:s,loading:c=`Loading...`,options:l={},overrideServices:u={},saveViewState:d=!0,keepCurrentModel:f=!1,width:p=`100%`,height:m=`100%`,className:h,wrapperProps:g={},beforeMount:_=sn,onMount:v=sn,onChange:b,onValidate:x=sn}){let[S,C]=(0,y.useState)(!1),[w,ee]=(0,y.useState)(!0),te=(0,y.useRef)(null),T=(0,y.useRef)(null),ne=(0,y.useRef)(null),re=(0,y.useRef)(v),ie=(0,y.useRef)(_),ae=(0,y.useRef)(),oe=(0,y.useRef)(r),se=mn(a),ce=(0,y.useRef)(!1),le=(0,y.useRef)(!1);rn(()=>{let e=Yt.init();return e.then(e=>(te.current=e)&&ee(!1)).catch(e=>e?.type!==`cancelation`&&console.error(`Monaco initialization: error:`,e)),()=>T.current?D():e.cancel()}),on(()=>{let o=cn(te.current,e||r||``,t||i||``,a||n||``);o!==T.current?.getModel()&&(d&&hn.set(se,T.current?.saveViewState()),T.current?.setModel(o),d&&T.current?.restoreViewState(hn.get(a)))},[a],S),on(()=>{T.current?.updateOptions(l)},[l],S),on(()=>{!T.current||r===void 0||(T.current.getOption(te.current.editor.EditorOption.readOnly)?T.current.setValue(r):r!==T.current.getValue()&&(le.current=!0,T.current.executeEdits(``,[{range:T.current.getModel().getFullModelRange(),text:r,forceMoveMarkers:!0}]),T.current.pushUndoStop(),le.current=!1))},[r],S),on(()=>{let e=T.current?.getModel();e&&i&&te.current?.editor.setModelLanguage(e,i)},[i],S),on(()=>{s!==void 0&&T.current?.revealLine(s)},[s],S),on(()=>{te.current?.editor.setTheme(o)},[o],S);let E=(0,y.useCallback)(()=>{if(!(!ne.current||!te.current)&&!ce.current){ie.current(te.current);let c=a||n,f=cn(te.current,r||e||``,t||i||``,c||``);T.current=te.current?.editor.create(ne.current,{model:f,automaticLayout:!0,...l},u),d&&T.current.restoreViewState(hn.get(c)),te.current.editor.setTheme(o),s!==void 0&&T.current.revealLine(s),C(!0),ce.current=!0}},[e,t,n,r,i,a,l,u,d,o,s]);(0,y.useEffect)(()=>{S&&re.current(T.current,te.current)},[S]),(0,y.useEffect)(()=>{!w&&!S&&E()},[w,S,E]),oe.current=r,(0,y.useEffect)(()=>{S&&b&&(ae.current?.dispose(),ae.current=T.current?.onDidChangeModelContent(e=>{le.current||b(T.current.getValue(),e)}))},[S,b]),(0,y.useEffect)(()=>{if(S){let e=te.current.editor.onDidChangeMarkers(e=>{let t=T.current.getModel()?.uri;if(t&&e.find(e=>e.path===t.path)){let e=te.current.editor.getModelMarkers({resource:t});x?.(e)}});return()=>{e?.dispose()}}return()=>{}},[S,x]);function D(){ae.current?.dispose(),f?d&&hn.set(a,T.current.saveViewState()):T.current.getModel()?.dispose(),T.current.dispose()}return y.createElement(tn,{width:p,height:m,isEditorReady:S,loading:c,_ref:ne,className:h,wrapperProps:g})}var M=(0,y.memo)(j),gn={cpp:`C++`,python:`Python`},_n={cpp:`cpp`,python:`python`};function vn({language:e,onLanguageChange:t,problem:n,code:r,onCodeChange:i,running:a,runMode:o,onRun:s,results:c,statuses:l,problemStatus:u,onStatusChange:d}){let f=(0,y.useRef)(null),[p,m]=(0,y.useState)(!1),[h,g]=(0,y.useState)(``),[_,v]=(0,y.useState)(!1);(0,y.useEffect)(()=>{c&&v(!0)},[c]),(0,y.useEffect)(()=>{g(n?.defaultCustomInput??``),m(!1)},[n?.id]);let b=e=>{f.current=e,e.setValue(r)},x=e=>i(e??``);(0,y.useEffect)(()=>{f.current&&f.current.getValue()!==r&&f.current.setValue(r)},[r]);let S=e===`python`?l.pyodide===`ok`:l[`wasm-clang`]===`ok`,C=c?ke(c.lines):null,w=C&&C.tests.length>0,ee=C&&C.outputLines.some(e=>e.text.trim());return(0,T.jsxs)(`div`,{className:`workspace`,children:[(0,T.jsxs)(`div`,{className:`workspace-header`,children:[(0,T.jsx)(`div`,{className:`lang-toggle`,children:[`cpp`,`python`].map(n=>(0,T.jsx)(`button`,{className:`lang-btn${e===n?` active`:``}`,onClick:()=>t(n),disabled:a,children:gn[n]},n))}),(0,T.jsxs)(`div`,{className:`action-btns`,children:[(0,T.jsxs)(`button`,{className:`btn btn-run`,onClick:()=>{m(!1),s(`run`)},disabled:a||!S,title:S?`Run example`:`Runtime loading…`,children:[a&&o===`run`?(0,T.jsx)(`span`,{className:`spinner`}):(0,T.jsx)(`span`,{className:`btn-icon`,children:`▶`}),`Run`]}),(0,T.jsxs)(`button`,{className:`btn btn-submit`,onClick:()=>{m(!1),s(`submit`)},disabled:a||!S,title:S?`Run all test cases`:`Runtime loading…`,children:[a&&o===`submit`?(0,T.jsx)(`span`,{className:`spinner`}):null,`Submit`]}),(0,T.jsx)(`button`,{className:`btn btn-custom${p?` active`:``}`,onClick:()=>m(e=>!e),disabled:a,children:`Custom`}),(0,T.jsx)(`span`,{className:`action-sep`}),(0,T.jsx)(`button`,{className:`btn btn-status-complete${u===`complete`?` active`:``}`,onClick:()=>d(u===`complete`?null:`complete`),title:`Mark as complete`,children:`✓ Done`}),(0,T.jsx)(`button`,{className:`btn btn-status-revise${u===`revise`?` active`:``}`,onClick:()=>d(u===`revise`?null:`revise`),title:`Mark to revise`,children:`↩ Revise`})]}),(0,T.jsx)(`div`,{className:`runtime-pills`,children:[{key:`pyodide`,label:`Py`},{key:`wasm-clang`,label:`C++`}].map(({key:e,label:t})=>(0,T.jsxs)(`span`,{className:`rt-pill ${l[e]}`,children:[t,` `,l[e]===`ok`?`✓`:l[e]===`error`?`✗`:`…`]},e))})]}),p&&(0,T.jsxs)(`div`,{className:`custom-drawer`,children:[(0,T.jsxs)(`div`,{className:`custom-drawer-header`,children:[(0,T.jsx)(`span`,{className:`custom-label`,children:`Custom Input`}),(0,T.jsx)(`span`,{className:`custom-format`,children:n?.inputFormat})]}),(0,T.jsx)(`textarea`,{className:`custom-textarea`,value:h,onChange:e=>g(e.target.value),placeholder:n?.defaultCustomInput,spellCheck:!1}),(0,T.jsxs)(`button`,{className:`btn btn-run custom-run-btn`,onClick:()=>s(`custom`,h),disabled:a||!S,children:[a&&o===`custom`?(0,T.jsx)(`span`,{className:`spinner`}):(0,T.jsx)(`span`,{className:`btn-icon`,children:`▶`}),`Run`]})]}),(0,T.jsx)(`div`,{className:`editor-area`,children:(0,T.jsx)(M,{language:_n[e],theme:`vs-dark`,options:{fontSize:14,fontFamily:`"JetBrains Mono", "Fira Code", monospace`,fontLigatures:!0,minimap:{enabled:!1},scrollBeyondLastLine:!1,tabSize:4,lineNumbers:`on`,renderLineHighlight:`gutter`,padding:{top:16,bottom:16},quickSuggestions:!0,suggestOnTriggerCharacters:!0,acceptSuggestionOnEnter:`on`,tabCompletion:`on`,wordBasedSuggestions:`matchingDocuments`,parameterHints:{enabled:!0}},onMount:b,onChange:x})}),c&&_&&(0,T.jsxs)(`div`,{className:`results-panel`,children:[(0,T.jsxs)(`div`,{className:`results-header`,children:[(0,T.jsx)(`span`,{className:`results-title`,children:c.mode===`submit`?`Test Results`:c.mode===`custom`?`Custom Output`:`Output`}),C?.summary&&(0,T.jsxs)(`span`,{className:`summary-badge ${C.summary.passed===C.summary.total?`all-pass`:`some-fail`}`,children:[C.summary.passed,`/`,C.summary.total,` passed`]}),(0,T.jsx)(`button`,{className:`close-results`,onClick:()=>v(!1),children:`✕`})]}),(0,T.jsx)(`div`,{className:`results-body`,children:w?(0,T.jsxs)(T.Fragment,{children:[ee&&(0,T.jsxs)(`div`,{className:`output-section`,children:[(0,T.jsxs)(`div`,{className:`output-section-label`,children:[(0,T.jsx)(`span`,{className:`output-dot`}),`stdout`]}),(0,T.jsx)(`pre`,{className:`raw-output`,children:C.outputLines.map((e,t)=>(0,T.jsx)(`span`,{className:`out-${e.cls}`,children:e.text},t))})]}),(0,T.jsxs)(`div`,{className:`result-section${ee?` has-output`:``}`,children:[ee&&(0,T.jsx)(`div`,{className:`result-section-label`,children:`Result`}),(0,T.jsx)(`div`,{className:`test-result-list`,children:C.tests.map(e=>(0,T.jsxs)(`div`,{className:`tr-item ${e.passed?`pass`:`fail`}`,children:[c.mode===`submit`&&(0,T.jsxs)(`span`,{className:`tr-case-num`,children:[`Test `,e.n]}),(0,T.jsx)(`span`,{className:`tr-status`,children:e.passed?`PASS`:`FAIL`}),(0,T.jsxs)(`span`,{className:`tr-comparison`,children:[(0,T.jsxs)(`span`,{className:`tr-field`,children:[(0,T.jsx)(`span`,{className:`tr-field-label`,children:`Expected`}),(0,T.jsx)(`code`,{className:`tr-value`,children:e.expected})]}),(0,T.jsx)(`span`,{className:`tr-sep`,children:`·`}),(0,T.jsxs)(`span`,{className:`tr-field`,children:[(0,T.jsx)(`span`,{className:`tr-field-label`,children:`Got`}),(0,T.jsx)(`code`,{className:`tr-value${e.passed?``:` wrong`}`,children:e.got})]})]})]},e.n))})]})]}):(0,T.jsx)(`pre`,{className:`raw-output`,children:c.lines.map((e,t)=>(0,T.jsx)(`span`,{className:`out-${e.cls}`,children:e.text},t))})})]})]})}var yn=`modulepreload`,bn=function(e){return`/`+e},xn={},Sn=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=bn(t,n),t in xn)return;xn[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:yn,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};window._=x.default;var Cn={pyodide:`loading`,"wasm-clang":`loading`};function wn(){let[e,t]=(0,y.useState)(Ce[0]),[n,r]=(0,y.useState)(`cpp`),[i,a]=(0,y.useState)(!1),[o,s]=(0,y.useState)(null),[c,l]=(0,y.useState)(null),[u,d]=(0,y.useState)(Cn),[f,p]=(0,y.useState)(!0),m=(0,y.useRef)(null),h=(0,y.useRef)(null),g=(0,y.useRef)(0),_=(e,t)=>d(n=>({...n,[e]:t})),{getCode:v,saveCode:b,getStatus:x,setStatus:S}=Ne(),C=v(e.id,n);(0,y.useEffect)(()=>{Sn(async()=>{let{loadPyodide:e}=await import(`./pyodide-BbFimvPp.js`);return{loadPyodide:e}},[]).then(({loadPyodide:e})=>e({indexURL:`/node_modules/pyodide/`})).then(e=>{m.current=e,_(`pyodide`,`ok`)}).catch(()=>_(`pyodide`,`error`))},[]),(0,y.useEffect)(()=>{let e=new Worker(`/wasm-clang/worker.js`),{port1:t,port2:n}=new MessageChannel;e.postMessage({id:`constructor`,data:n},[n]);let r={port:t,handlers:{},onWrite:null};return t.onmessage=({data:{id:e,responseId:t,data:n}})=>{if(e===`write`)r.onWrite?.(n);else if(e===`compileLinkRunDone`){let e=r.handlers[t];e&&(e(n),delete r.handlers[t])}},e.onerror=()=>_(`wasm-clang`,`error`),h.current=r,_(`wasm-clang`,`ok`),()=>e.terminate()},[]);async function w(t,r=``){if(i)return;let o=Ee(v(e.id,n),e,n,t,r);a(!0),s(t),l(null);let c=[],u=(e,t=`stdout`)=>c.push({text:e,cls:t});try{n===`python`?await ee(o,u):await te(o,u,t)}catch(e){u(`[Error] `+e.message+`
`,`stderr`)}l({lines:c,mode:t}),a(!1)}async function ee(e,t){let n=m.current;if(!n){t(`Pyodide not ready.
`,`warn`);return}n.setStdout({batched:e=>t(e+`
`,`stdout`)}),n.setStderr({batched:e=>t(e+`
`,`stderr`)});try{await n.runPythonAsync(e)}catch(e){t((e.message||String(e))+`
`,`stderr`)}}async function te(e,t,n){let r=h.current;if(!r){t(`wasm-clang not ready.
`,`warn`);return}let i=String(++g.current),a=e=>e.replace(/\x1b\[[0-9;]*m/g,``),o=``;r.onWrite=e=>{o+=a(e)};let s=await new Promise(t=>{r.handlers[i]=t,r.port.postMessage({id:`compileLinkRun`,data:e,responseId:i})});if(r.onWrite=null,s.error){t(o.split(`
`).filter(e=>!e.startsWith(`> clang`)&&!e.startsWith(`> wasm-ld`)).join(`
`).trim()+`
`,`stderr`);return}let c=o.split(`
`).filter(e=>!e.startsWith(`>`));for(;c.length&&!c[c.length-1].trim();)c.pop();for(;c.length&&!c[0].trim();)c.shift();for(let e of c)t(e+`
`,`stdout`)}function ne(e){t(e),l(null)}function re(e){r(e),l(null)}function ie(t){b(e.id,n,t)}return(0,T.jsxs)(`div`,{className:`app-root`,style:{gridTemplateColumns:f?`var(--sidebar-w) 1fr 1.3fr`:`var(--sidebar-collapsed-w) 1fr 1.3fr`},children:[(0,T.jsx)(Pe,{categories:Se,problems:Ce,selectedId:e.id,onSelect:ne,getStatus:x,onStatusChange:S,collapsed:!f,onToggle:()=>p(e=>!e)}),(0,T.jsx)(We,{problem:e}),(0,T.jsx)(vn,{language:n,onLanguageChange:re,problem:e,code:C,onCodeChange:ie,running:i,runMode:o,onRun:w,results:c,statuses:u,problemStatus:x(e.id),onStatusChange:t=>S(e.id,t)})]})}(0,b.createRoot)(document.getElementById(`root`)).render((0,T.jsx)(wn,{}));export{c as i,o as n,l as r,Sn as t};