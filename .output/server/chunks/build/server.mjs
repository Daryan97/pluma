import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { computed, ref, toValue, getCurrentInstance, onServerPrefetch, hasInjectionContext, inject, defineComponent, shallowRef, h, resolveComponent, nextTick, unref, toRef, isRef, createElementBlock, provide, cloneVNode, Suspense, Fragment, watch, createApp, createVNode, Text, shallowReactive, onErrorCaptured, resolveDynamicComponent, reactive, effectScope, mergeProps, withAsyncContext, getCurrentScope, withCtx, openBlock, createBlock, toDisplayString as toDisplayString$1, createTextVNode, renderList, createCommentVNode, isReadonly, toRaw, useSSRContext, isShallow, isReactive } from 'vue';
import { o as klona, p as getRequestHeader, d as destr, q as isEqual$1, r as setCookie, v as getCookie, w as deleteCookie, x as getContext, k as createError$1, y as sanitizeStatusCode, $ as $fetch, z as createHooks, A as executeAsync, B as defu, C as getRequestProtocol, D as getRequestHeaders } from '../_/nitro.mjs';
import { u as useHead$1, a as useSeoMeta$1, h as headSymbol, b as baseURL } from '../routes/renderer.mjs';
import { defineStore, storeToRefs, createPinia, setActivePinia, shouldHydrate } from 'pinia';
import { RouterView, isNavigationFailure, useRouter as useRouter$1, createMemoryHistory, createRouter, START_LOCATION, RouterLink } from 'vue-router';
import { createClient } from '@supabase/supabase-js';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { Icon } from '@iconify/vue';
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuArrow, AvatarRoot, AvatarImage, AvatarFallback, DropdownMenuSeparator } from 'radix-vue';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = options || {};
  const dec = opt.decode || decode$1;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode$1(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

//#region src/index.ts
const DEBOUNCE_DEFAULTS = { trailing: true };
/**
Debounce functions
@param fn - Promise-returning/async function to debounce.
@param wait - Milliseconds to wait before calling `fn`. Default value is 25ms
@returns A function that delays calling `fn` until after `wait` milliseconds have elapsed since the last time it was called.
@example
```
import { debounce } from 'perfect-debounce';
const expensiveCall = async input => input;
const debouncedFn = debounce(expensiveCall, 200);
for (const number of [1, 2, 3]) {
console.log(await debouncedFn(number));
}
//=> 1
//=> 2
//=> 3
```
*/
function debounce(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.8";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}
const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function isEqual(a, b, options = {}) {
  if (!options.trailingSlash) {
    a = withTrailingSlash(a);
    b = withTrailingSlash(b);
  }
  if (!options.leadingSlash) {
    a = withLeadingSlash(a);
    b = withLeadingSlash(b);
  }
  if (!options.encoding) {
    a = decode(a);
    b = decode(b);
  }
  return a === b;
}
const protocolRelative = /* @__PURE__ */ Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const addRouteMiddleware = (name, middleware, options = {}) => {
  const nuxtApp = useNuxtApp();
  const global2 = options.global || typeof name !== "string";
  const mw = middleware;
  if (!mw) {
    console.warn("[nuxt] No route middleware passed to `addRouteMiddleware`.", name);
    return;
  }
  if (global2) {
    nuxtApp._middleware.global.push(mw);
  } else {
    nuxtApp._middleware.named[name] = mw;
  }
};
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
const HTML_ATTR_ENCODE_MAP = {
  "&": "%26",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E"
};
function encodeForHtmlAttr(value) {
  return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject$1(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedHeader = encodeURL(location2, isExternalHost);
        const encodedLoc = encodeForHtmlAttr(encodedHeader);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject$1(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    const pathname = url.pathname.replace(/^\/{2,}/, "/");
    return pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || tryUseNuxtApp();
  return nuxt?.ssrContext?.head || nuxt?.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
function useSeoMeta(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useSeoMeta$1(input, { head, ...options });
  }
}
const matcher = (m, p) => {
  return [];
};
const _routeRulesMatcher = (path) => defu({}, ...matcher("", typeof path === "string" ? path.toLowerCase() : path).map((r) => r.data).reverse());
const routeRulesMatcher = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher(path.toLowerCase());
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
function freezeHead(head) {
  const realPush = head.push;
  head.push = () => ({ dispose: () => {
  }, patch: () => {
  }, _poll: () => {
  } });
  return () => {
    head.push = realPush;
  };
}
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    if (nuxtApp.ssrContext.islandContext) {
      const unfreeze = freezeHead(head);
      nuxtApp.hooks.hookOnce("app:created", unfreeze);
    }
    nuxtApp.vueApp.use(head);
  }
});
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$8 = { devOnly: true };
const __nuxt_page_meta$7 = { requireAnonymous: true, ssr: false };
const __nuxt_page_meta$6 = { requireAnonymous: true, ssr: false };
const __nuxt_page_meta$5 = {
  // Install wizard is English-only — no /ku/install, /ar/install, etc.
  i18n: false
};
const __nuxt_page_meta$4 = { requiresAuth: true, ssr: false };
const __nuxt_page_meta$3 = { requiresAuth: true, ssr: false };
const __nuxt_page_meta$2 = { requiresAuth: true, requiresAuthorOrAdmin: true, ssr: false };
const __nuxt_page_meta$1 = { requiresAuth: true, requiresAuthorOrAdmin: true, ssr: false };
const __nuxt_page_meta = { requiresAuth: true, requiresAuthorOrAdmin: true, ssr: false };
const _routes = [
  {
    name: "Test___en",
    path: "/Test",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./Test-Fd2YV1tP.mjs')
  },
  {
    name: "Test___ku",
    path: "/ku/Test",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./Test-Fd2YV1tP.mjs')
  },
  {
    name: "Test___ar",
    path: "/ar/Test",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./Test-Fd2YV1tP.mjs')
  },
  {
    name: "Test___es",
    path: "/es/Test",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./Test-Fd2YV1tP.mjs')
  },
  {
    name: "Test___fr",
    path: "/fr/Test",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./Test-Fd2YV1tP.mjs')
  },
  {
    name: "Test___de",
    path: "/de/Test",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./Test-Fd2YV1tP.mjs')
  },
  {
    name: "index___en",
    path: "/",
    component: () => import('./index-b46YHEJT.mjs')
  },
  {
    name: "index___ku",
    path: "/ku",
    component: () => import('./index-b46YHEJT.mjs')
  },
  {
    name: "index___ar",
    path: "/ar",
    component: () => import('./index-b46YHEJT.mjs')
  },
  {
    name: "index___es",
    path: "/es",
    component: () => import('./index-b46YHEJT.mjs')
  },
  {
    name: "index___fr",
    path: "/fr",
    component: () => import('./index-b46YHEJT.mjs')
  },
  {
    name: "index___de",
    path: "/de",
    component: () => import('./index-b46YHEJT.mjs')
  },
  {
    name: "login___en",
    path: "/login",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./login-C9NODX5K.mjs')
  },
  {
    name: "login___ku",
    path: "/ku/login",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./login-C9NODX5K.mjs')
  },
  {
    name: "login___ar",
    path: "/ar/login",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./login-C9NODX5K.mjs')
  },
  {
    name: "login___es",
    path: "/es/login",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./login-C9NODX5K.mjs')
  },
  {
    name: "login___fr",
    path: "/fr/login",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./login-C9NODX5K.mjs')
  },
  {
    name: "login___de",
    path: "/de/login",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./login-C9NODX5K.mjs')
  },
  {
    name: "signup___en",
    path: "/signup",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./signup-Ce9Dugnc.mjs')
  },
  {
    name: "signup___ku",
    path: "/ku/signup",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./signup-Ce9Dugnc.mjs')
  },
  {
    name: "signup___ar",
    path: "/ar/signup",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./signup-Ce9Dugnc.mjs')
  },
  {
    name: "signup___es",
    path: "/es/signup",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./signup-Ce9Dugnc.mjs')
  },
  {
    name: "signup___fr",
    path: "/fr/signup",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./signup-Ce9Dugnc.mjs')
  },
  {
    name: "signup___de",
    path: "/de/signup",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./signup-Ce9Dugnc.mjs')
  },
  {
    name: "install",
    path: "/install",
    meta: __nuxt_page_meta$5 || {},
    component: () => import('./install-XoyxJovp.mjs')
  },
  {
    name: "profile___en",
    path: "/profile",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./profile-BIy3O2VW.mjs')
  },
  {
    name: "profile___ku",
    path: "/ku/profile",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./profile-BIy3O2VW.mjs')
  },
  {
    name: "profile___ar",
    path: "/ar/profile",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./profile-BIy3O2VW.mjs')
  },
  {
    name: "profile___es",
    path: "/es/profile",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./profile-BIy3O2VW.mjs')
  },
  {
    name: "profile___fr",
    path: "/fr/profile",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./profile-BIy3O2VW.mjs')
  },
  {
    name: "profile___de",
    path: "/de/profile",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./profile-BIy3O2VW.mjs')
  },
  {
    name: "posts-slug___en",
    path: "/posts/:slug()",
    component: () => import('./_slug_-FoYfbwb1.mjs')
  },
  {
    name: "posts-slug___ku",
    path: "/ku/posts/:slug()",
    component: () => import('./_slug_-FoYfbwb1.mjs')
  },
  {
    name: "posts-slug___ar",
    path: "/ar/posts/:slug()",
    component: () => import('./_slug_-FoYfbwb1.mjs')
  },
  {
    name: "posts-slug___es",
    path: "/es/posts/:slug()",
    component: () => import('./_slug_-FoYfbwb1.mjs')
  },
  {
    name: "posts-slug___fr",
    path: "/fr/posts/:slug()",
    component: () => import('./_slug_-FoYfbwb1.mjs')
  },
  {
    name: "posts-slug___de",
    path: "/de/posts/:slug()",
    component: () => import('./_slug_-FoYfbwb1.mjs')
  },
  {
    name: "archive___en",
    path: "/archive",
    component: () => import('./index-B_uLS72B.mjs')
  },
  {
    name: "archive___ku",
    path: "/ku/archive",
    component: () => import('./index-B_uLS72B.mjs')
  },
  {
    name: "archive___ar",
    path: "/ar/archive",
    component: () => import('./index-B_uLS72B.mjs')
  },
  {
    name: "archive___es",
    path: "/es/archive",
    component: () => import('./index-B_uLS72B.mjs')
  },
  {
    name: "archive___fr",
    path: "/fr/archive",
    component: () => import('./index-B_uLS72B.mjs')
  },
  {
    name: "archive___de",
    path: "/de/archive",
    component: () => import('./index-B_uLS72B.mjs')
  },
  {
    name: "category-slug___en",
    path: "/category/:slug()",
    component: () => import('./_slug_-DIhhmtyy.mjs')
  },
  {
    name: "category-slug___ku",
    path: "/ku/category/:slug()",
    component: () => import('./_slug_-DIhhmtyy.mjs')
  },
  {
    name: "category-slug___ar",
    path: "/ar/category/:slug()",
    component: () => import('./_slug_-DIhhmtyy.mjs')
  },
  {
    name: "category-slug___es",
    path: "/es/category/:slug()",
    component: () => import('./_slug_-DIhhmtyy.mjs')
  },
  {
    name: "category-slug___fr",
    path: "/fr/category/:slug()",
    component: () => import('./_slug_-DIhhmtyy.mjs')
  },
  {
    name: "category-slug___de",
    path: "/de/category/:slug()",
    component: () => import('./_slug_-DIhhmtyy.mjs')
  },
  {
    name: "change-password___en",
    path: "/change-password",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./change-password-DFRoDUOB.mjs')
  },
  {
    name: "change-password___ku",
    path: "/ku/change-password",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./change-password-DFRoDUOB.mjs')
  },
  {
    name: "change-password___ar",
    path: "/ar/change-password",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./change-password-DFRoDUOB.mjs')
  },
  {
    name: "change-password___es",
    path: "/es/change-password",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./change-password-DFRoDUOB.mjs')
  },
  {
    name: "change-password___fr",
    path: "/fr/change-password",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./change-password-DFRoDUOB.mjs')
  },
  {
    name: "change-password___de",
    path: "/de/change-password",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./change-password-DFRoDUOB.mjs')
  },
  {
    name: "dashboard___en",
    path: "/dashboard",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CRVDGkpu.mjs')
  },
  {
    name: "dashboard___ku",
    path: "/ku/dashboard",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CRVDGkpu.mjs')
  },
  {
    name: "dashboard___ar",
    path: "/ar/dashboard",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CRVDGkpu.mjs')
  },
  {
    name: "dashboard___es",
    path: "/es/dashboard",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CRVDGkpu.mjs')
  },
  {
    name: "dashboard___fr",
    path: "/fr/dashboard",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CRVDGkpu.mjs')
  },
  {
    name: "dashboard___de",
    path: "/de/dashboard",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./index-CRVDGkpu.mjs')
  },
  {
    name: "author-username___en",
    path: "/author/:username()",
    component: () => import('./_username_-CO-A_nJq.mjs')
  },
  {
    name: "author-username___ku",
    path: "/ku/author/:username()",
    component: () => import('./_username_-CO-A_nJq.mjs')
  },
  {
    name: "author-username___ar",
    path: "/ar/author/:username()",
    component: () => import('./_username_-CO-A_nJq.mjs')
  },
  {
    name: "author-username___es",
    path: "/es/author/:username()",
    component: () => import('./_username_-CO-A_nJq.mjs')
  },
  {
    name: "author-username___fr",
    path: "/fr/author/:username()",
    component: () => import('./_username_-CO-A_nJq.mjs')
  },
  {
    name: "author-username___de",
    path: "/de/author/:username()",
    component: () => import('./_username_-CO-A_nJq.mjs')
  },
  {
    name: "dashboard-new-post___en",
    path: "/dashboard/new-post",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./new-post-CHnLjI_B.mjs')
  },
  {
    name: "dashboard-new-post___ku",
    path: "/ku/dashboard/new-post",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./new-post-CHnLjI_B.mjs')
  },
  {
    name: "dashboard-new-post___ar",
    path: "/ar/dashboard/new-post",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./new-post-CHnLjI_B.mjs')
  },
  {
    name: "dashboard-new-post___es",
    path: "/es/dashboard/new-post",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./new-post-CHnLjI_B.mjs')
  },
  {
    name: "dashboard-new-post___fr",
    path: "/fr/dashboard/new-post",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./new-post-CHnLjI_B.mjs')
  },
  {
    name: "dashboard-new-post___de",
    path: "/de/dashboard/new-post",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./new-post-CHnLjI_B.mjs')
  },
  {
    name: "archive-post-slug___en",
    path: "/archive/post/:slug()",
    component: () => import('./_slug_-CoDBWza9.mjs')
  },
  {
    name: "archive-post-slug___ku",
    path: "/ku/archive/post/:slug()",
    component: () => import('./_slug_-CoDBWza9.mjs')
  },
  {
    name: "archive-post-slug___ar",
    path: "/ar/archive/post/:slug()",
    component: () => import('./_slug_-CoDBWza9.mjs')
  },
  {
    name: "archive-post-slug___es",
    path: "/es/archive/post/:slug()",
    component: () => import('./_slug_-CoDBWza9.mjs')
  },
  {
    name: "archive-post-slug___fr",
    path: "/fr/archive/post/:slug()",
    component: () => import('./_slug_-CoDBWza9.mjs')
  },
  {
    name: "archive-post-slug___de",
    path: "/de/archive/post/:slug()",
    component: () => import('./_slug_-CoDBWza9.mjs')
  },
  {
    name: "dashboard-edit-id___en",
    path: "/dashboard/edit/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_id_-RZmhjE0z.mjs')
  },
  {
    name: "dashboard-edit-id___ku",
    path: "/ku/dashboard/edit/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_id_-RZmhjE0z.mjs')
  },
  {
    name: "dashboard-edit-id___ar",
    path: "/ar/dashboard/edit/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_id_-RZmhjE0z.mjs')
  },
  {
    name: "dashboard-edit-id___es",
    path: "/es/dashboard/edit/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_id_-RZmhjE0z.mjs')
  },
  {
    name: "dashboard-edit-id___fr",
    path: "/fr/dashboard/edit/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_id_-RZmhjE0z.mjs')
  },
  {
    name: "dashboard-edit-id___de",
    path: "/de/dashboard/edit/:id()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_id_-RZmhjE0z.mjs')
  },
  {
    name: "archive-category-slug___en",
    path: "/archive/category/:slug()",
    component: () => import('./_slug_-C3Kctexe.mjs')
  },
  {
    name: "archive-category-slug___ku",
    path: "/ku/archive/category/:slug()",
    component: () => import('./_slug_-C3Kctexe.mjs')
  },
  {
    name: "archive-category-slug___ar",
    path: "/ar/archive/category/:slug()",
    component: () => import('./_slug_-C3Kctexe.mjs')
  },
  {
    name: "archive-category-slug___es",
    path: "/es/archive/category/:slug()",
    component: () => import('./_slug_-C3Kctexe.mjs')
  },
  {
    name: "archive-category-slug___fr",
    path: "/fr/archive/category/:slug()",
    component: () => import('./_slug_-C3Kctexe.mjs')
  },
  {
    name: "archive-category-slug___de",
    path: "/de/archive/category/:slug()",
    component: () => import('./_slug_-C3Kctexe.mjs')
  }
];
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    if (from === START_LOCATION) {
      return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
    }
    return new Promise((resolve2) => {
      const doScroll = () => {
        requestAnimationFrame(() => resolve2(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      };
      nuxtApp.hooks.hookOnce("page:loading:end", () => {
        const transitionPromise = nuxtApp["~transitionPromise"];
        if (transitionPromise) {
          transitionPromise.then(doScroll);
        } else {
          doScroll();
        }
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
function getBundleEnv() {
  return {
    VITE_SUPABASE_URL: "https://fzsazbuqdwwcoavibjiy.supabase.co",
    VITE_SUPABASE_ANON_KEY: "sb_publishable_ouXo2hj0agfnUUySksEY5A_Yq3TJr0L",
    VITE_ENV: "development",
    VITE_SITE_URL: "http://localhost:3000"
  };
}
function getRuntimeEnvSync() {
  return getBundleEnv();
}
let _client$1 = null;
let _clientKey = "";
function resolveUrlKey() {
  const config = /* @__PURE__ */ useRuntimeConfig();
  let url = config.public.supabaseUrl || "";
  let key = config.public.supabaseAnonKey || "";
  if ((!url || !key) && false) {
    const env = getRuntimeEnvSync();
    url = url || env.VITE_SUPABASE_URL || "";
    key = key || env.VITE_SUPABASE_ANON_KEY || "";
  }
  if ((!url || !key) && true) {
    url = url || process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    key = key || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  }
  return { url, key };
}
function isPlaceholder(url, key) {
  return !url || !key || url.includes("placeholder.supabase") || key === "public-anon-key";
}
function useSupabaseClient() {
  const { url: resolvedUrl, key: resolvedKey } = resolveUrlKey();
  let url = resolvedUrl;
  let key = resolvedKey;
  if (isPlaceholder(url, key)) {
    console.warn("[pluma] Supabase URL/key missing — client created with placeholders");
    url = url || "https://placeholder.supabase.co";
    key = key || "public-anon-key";
  }
  const cacheKey = `${url}::${key}`;
  if (_client$1 && _clientKey === cacheKey) return _client$1;
  if (_client$1 && _clientKey !== cacheKey && !isPlaceholder(resolvedUrl, resolvedKey)) {
    _client$1 = null;
  }
  _clientKey = cacheKey;
  _client$1 = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  return _client$1;
}
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
const assign = Object.assign;
const _create = Object.create;
const create = (obj = null) => _create(obj);
function escapeHtml(rawText) {
  return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
}
function escapeAttributeValue(value) {
  return value.replace(/&(?![a-zA-Z0-9#]{2,6};)/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function sanitizeTranslatedHtml(html) {
  html = html.replace(/(\w+)\s*=\s*"([^"]*)"/g, (_, attrName, attrValue) => `${attrName}="${escapeAttributeValue(attrValue)}"`);
  html = html.replace(/(\w+)\s*=\s*'([^']*)'/g, (_, attrName, attrValue) => `${attrName}='${escapeAttributeValue(attrValue)}'`);
  const eventHandlerPattern = /\s*on\w+\s*=\s*["']?[^"'>]+["']?/gi;
  if (eventHandlerPattern.test(html)) {
    html = html.replace(/(\s+)(on)(\w+\s*=)/gi, "$1&#111;n$3");
  }
  const javascriptUrlPattern = [
    // In href, src, action, formaction attributes
    /(\s+(?:href|src|action|formaction)\s*=\s*["']?)\s*javascript:/gi,
    // In style attributes within url()
    /(style\s*=\s*["'][^"']*url\s*\(\s*)javascript:/gi
  ];
  javascriptUrlPattern.forEach((pattern) => {
    html = html.replace(pattern, "$1javascript&#58;");
  });
  return html;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
function join(items, separator = "") {
  return items.reduce((str, item, index) => index === 0 ? str + item : str + separator + item, "");
}
const isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error("Invalid value");
  }
  const stack = [{ src, des }];
  while (stack.length) {
    const { src: src2, des: des2 } = stack.pop();
    Object.keys(src2).forEach((key) => {
      if (key === "__proto__") {
        return;
      }
      if (isObject(src2[key]) && !isObject(des2[key])) {
        des2[key] = Array.isArray(src2[key]) ? [] : create();
      }
      if (isNotObjectOrIsArray(des2[key]) || isNotObjectOrIsArray(src2[key])) {
        des2[key] = src2[key];
      } else {
        stack.push({ src: src2[key], des: des2[key] });
      }
    });
  }
}
const localeCodes = [
  "en",
  "ku",
  "ar",
  "es",
  "fr",
  "de"
];
const localeLoaders = {
  en: [
    {
      key: "locale_en_46json_c72587b4",
      load: () => import(
        './en-C_LaNo3-.mjs'
        /* webpackChunkName: "locale_en_46json_c72587b4" */
      ),
      cache: true
    }
  ],
  ku: [
    {
      key: "locale_ku_46json_d640beeb",
      load: () => import(
        './ku-QfLcCmxc.mjs'
        /* webpackChunkName: "locale_ku_46json_d640beeb" */
      ),
      cache: true
    }
  ],
  ar: [
    {
      key: "locale_ar_46json_cc8ede9e",
      load: () => import(
        './ar-2mVZdhxA.mjs'
        /* webpackChunkName: "locale_ar_46json_cc8ede9e" */
      ),
      cache: true
    }
  ],
  es: [
    {
      key: "locale_es_46json_e6292bd2",
      load: () => import(
        './es-CY4gMDHY.mjs'
        /* webpackChunkName: "locale_es_46json_e6292bd2" */
      ),
      cache: true
    }
  ],
  fr: [
    {
      key: "locale_fr_46json_0f744e2d",
      load: () => import(
        './fr-BVgqHZyS.mjs'
        /* webpackChunkName: "locale_fr_46json_0f744e2d" */
      ),
      cache: true
    }
  ],
  de: [
    {
      key: "locale_de_46json_b92507d1",
      load: () => import(
        './de-C5QJE260.mjs'
        /* webpackChunkName: "locale_de_46json_b92507d1" */
      ),
      cache: true
    }
  ]
};
const vueI18nConfigs = [];
const normalizedLocales = [
  {
    code: "en",
    language: "en-US",
    name: "English",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/en.json",
        cache: void 0
      }
    ]
  },
  {
    code: "ku",
    language: "ku",
    name: "کوردی",
    dir: "rtl",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/ku.json",
        cache: void 0
      }
    ]
  },
  {
    code: "ar",
    language: "ar",
    name: "العربية",
    dir: "rtl",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/ar.json",
        cache: void 0
      }
    ]
  },
  {
    code: "es",
    language: "es-ES",
    name: "Español",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/es.json",
        cache: void 0
      }
    ]
  },
  {
    code: "fr",
    language: "fr-FR",
    name: "Français",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/fr.json",
        cache: void 0
      }
    ]
  },
  {
    code: "de",
    language: "de-DE",
    name: "Deutsch",
    files: [
      {
        path: "C:/Projects/Web/Pluma/pluma-frontend/src/locales/de.json",
        cache: void 0
      }
    ]
  }
];
const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n";
const parallelPlugin = false;
const DEFAULT_COOKIE_KEY = "i18n_redirected";
const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18nInternal";
const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp";
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  function createInitialFetch() {
    const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
    if (!nuxtApp._asyncData[key.value]?._init) {
      initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
      nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
    }
    return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  }
  const initialFetch = createInitialFetch();
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => {
      if (!nuxtApp._asyncData[key.value]?._init) {
        const initialFetch2 = createInitialFetch();
        return initialFetch2();
      }
      return nuxtApp._asyncData[key.value].execute(...args2);
    },
    execute: (...args2) => asyncReturn.refresh(...args2),
    clear: () => {
      const entry2 = nuxtApp._asyncData[key.value];
      if (entry2?._abortController) {
        try {
          entry2._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
        } finally {
          entry2._abortController = void 0;
        }
      }
      clearNuxtDataByKey(nuxtApp, key.value);
    }
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  Object.defineProperties(asyncDataPromise, {
    then: { enumerable: true, value: asyncDataPromise.then.bind(asyncDataPromise) },
    catch: { enumerable: true, value: asyncDataPromise.catch.bind(asyncDataPromise) },
    finally: { enumerable: true, value: asyncDataPromise.finally.bind(asyncDataPromise) }
  });
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    {
      nuxtApp._asyncData[key].pending.value = false;
    }
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= asyncDataDefaults.errorValue;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData != null;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: shallowRef(!hasCachedData),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if (isDefer(opts.dedupe ?? options.dedupe)) {
          return nuxtApp._asyncDataPromises[key];
        }
      }
      if (opts.cause === "initial" || nuxtApp.isHydrating) {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData != null) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = asyncDataDefaults.errorValue;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      {
        asyncData.pending.value = true;
      }
      if (asyncData._abortController) {
        asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      }
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const cleanupController = new AbortController();
      const promise = new Promise(
        (resolve2, reject) => {
          try {
            const timeout = opts.timeout ?? options.timeout;
            const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
            if (mergedSignal.aborted) {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
              return;
            }
            mergedSignal.addEventListener("abort", () => {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
            }, { once: true, signal: cleanupController.signal });
            return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve2, reject);
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (nuxtApp._asyncDataPromises[key] !== promise) {
          return;
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = asyncDataDefaults.errorValue;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (nuxtApp._asyncDataPromises[key] !== promise) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (asyncData._abortController?.signal.aborted) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        cleanupController.abort();
        if (nuxtApp._asyncDataPromises[key] === promise) {
          {
            asyncData.pending.value = false;
          }
          delete nuxtApp._asyncDataPromises[key];
        }
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
            asyncData.data.value = asyncDataDefaults.value;
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => asyncDataDefaults.value;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = AbortSignal.timeout?.(timeout);
    if (timeoutSignal) {
      list.push(timeoutSignal);
    }
  }
  if (AbortSignal.any) {
    return AbortSignal.any(list);
  }
  const controller = new AbortController();
  for (const sig of list) {
    if (sig.aborted) {
      const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
      return controller.signal;
    }
  }
  const onAbort = () => {
    const abortedSignal = list.find((s) => s.aborted);
    const reason = abortedSignal?.reason ?? new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) {
    sig.addEventListener?.("abort", onAbort, { once: true, signal: cleanupSignal });
  }
  return controller.signal;
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestHeaders(include) {
  const event = useRequestEvent();
  const _headers = event ? getRequestHeaders(event) : {};
  if (!include || !event) {
    return _headers;
  }
  const headers = /* @__PURE__ */ Object.create(null);
  for (const _key of include) {
    const key = _key.toLowerCase();
    const header = _headers[key];
    if (header) {
      headers[key] = header;
    }
  }
  return headers;
}
function useRequestHeader(header) {
  const event = useRequestEvent();
  return event ? getRequestHeader(event, header) : void 0;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual$1(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual$1(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse$1(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
function sanitizeExternalHref(value) {
  let candidate = value.replace(/[\u0000-\u001f\s]+/g, "");
  while (candidate.toLowerCase().startsWith("view-source:")) {
    candidate = candidate.slice("view-source:".length);
  }
  const colon = candidate.indexOf(":");
  if (colon > 0 && isScriptProtocol(candidate.slice(0, colon + 1))) {
    return null;
  }
  return value;
}
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve2, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve2(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (unref(props.external)) {
        return true;
      }
      const path = unref(props.to) || unref(props.href) || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to, viewTransition: unref(props.viewTransition) });
    const href = computed(() => {
      const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        const raw = to.value;
        return typeof raw === "string" ? sanitizeExternalHref(raw) : raw;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject$1(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        const safe = typeof href2 === "string" ? sanitizeExternalHref(href2) : href2;
        return safe === null ? null : applyTrailingSlashBehavior(safe, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        if (href.value === null) {
          return;
        }
        await navigateTo(href.value, { replace: unref(props.replace), external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate: navigate2, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate: navigate2,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: async (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            try {
              const encodedHref = encodeRoutePath(href.value ?? "");
              return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
            } finally {
            }
          }
        }, slots.default?.());
      };
    }
  });
}
const __nuxt_component_0$1 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
function getRouteName(routeName) {
  if (isString(routeName)) return routeName;
  if (routeName != null) return routeName.toString();
  return "(null)";
}
function getLocaleRouteName(routeName, locale, opts) {
  const { defaultLocale, strategy, routesNameSeparator, defaultLocaleRouteNameSuffix, differentDomains } = opts;
  const localizedRoutes = strategy !== "no_prefix" || differentDomains;
  const name = getRouteName(routeName) + (localizedRoutes ? routesNameSeparator + locale : "");
  if (locale === defaultLocale && strategy === "prefix_and_default") {
    return name + routesNameSeparator + defaultLocaleRouteNameSuffix;
  }
  return name;
}
function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
  const normalizedLocales2 = locales.map((l) => ({ code: l.code, language: l.language || l.code }));
  const matchedLocales = matchBrowserLocale(normalizedLocales2, browserLocales);
  if (matchedLocales.length === 0) {
    return "";
  }
  if (matchedLocales.length > 1) {
    matchedLocales.sort(compareBrowserLocale);
  }
  return matchedLocales[0].code;
}
function getLocalesRegex(localeCodes2) {
  return new RegExp(`^/(${localeCodes2.join("|")})(?:/|$)`, "i");
}
const localesPattern = `(${localeCodes.join("|")})`;
const regexpPath = getLocalesRegex(localeCodes);
function createLocaleFromRouteGetter() {
  const { routesNameSeparator, defaultLocaleRouteNameSuffix } = (/* @__PURE__ */ useRuntimeConfig()).public.i18n;
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`;
  const regexpName = new RegExp(`${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`, "i");
  return (route) => {
    if (isString(route)) {
      return route.match(regexpPath)?.[1] ?? "";
    }
    if (route.name) {
      return getRouteName(route.name).match(regexpName)?.[1] ?? "";
    }
    if (route.path) {
      return route.path.match(regexpPath)?.[1] ?? "";
    }
    return "";
  };
}
function isI18nInstance(i18n) {
  return i18n != null && "global" in i18n && "mode" in i18n;
}
function isComposer(target) {
  return target != null && !("__composer" in target) && "locale" in target && isRef(target.locale);
}
function isVueI18n(target) {
  return target != null && "__composer" in target;
}
function getI18nTarget(i18n) {
  return isI18nInstance(i18n) ? i18n.global : i18n;
}
function getComposer$3(i18n) {
  const target = getI18nTarget(i18n);
  if (isComposer(target)) return target;
  if (isVueI18n(target)) return target.__composer;
  return target;
}
function getHost() {
  const header = useRequestHeaders(["x-forwarded-host", "host"]);
  return header["x-forwarded-host"] || header["host"] || "";
}
function getLocaleDomain(locales, strategy, route) {
  const host = getHost();
  if (!host) {
    return host;
  }
  const routePath = isString(route) ? route : route.path;
  const matchingLocales = locales.filter((locale) => {
    if (locale.domain) {
      return (hasProtocol(locale.domain) ? locale.domain.replace(/(http|https):\/\//, "") : locale.domain) === host;
    }
    return isArray(locale?.domains) ? locale.domains.includes(host) : false;
  });
  if (matchingLocales.length === 0) {
    return "";
  }
  if (matchingLocales.length === 1) {
    return matchingLocales[0]?.code ?? "";
  }
  if (strategy === "no_prefix") {
    console.warn(
      formatMessage(
        "Multiple matching domains found! This is not supported for no_prefix strategy in combination with differentDomains!"
      )
    );
    return matchingLocales[0]?.code ?? "";
  }
  if (route && routePath) {
    const matched = routePath.match(getLocalesRegex(matchingLocales.map((l) => l.code)))?.at(1);
    if (matched) {
      const matchingLocale2 = matchingLocales.find((l) => l.code === matched);
      return matchingLocale2?.code ?? "";
    }
  }
  const matchingLocale = matchingLocales.find((l) => l.defaultForDomains?.includes(host) ?? l.domainDefault);
  return matchingLocale?.code ?? "";
}
function getDomainFromLocale(localeCode) {
  const nuxt = useNuxtApp();
  const host = getHost();
  const { domainLocales } = (/* @__PURE__ */ useRuntimeConfig()).public.i18n;
  const lang = normalizedLocales.find((locale) => locale.code === localeCode);
  const domain = domainLocales?.[localeCode]?.domain || lang?.domain || lang?.domains?.find((v) => v === host);
  if (!domain) {
    console.warn(formatMessage("Could not find domain name for locale " + localeCode));
    return;
  }
  if (hasProtocol(domain, { strict: true })) {
    return domain;
  }
  const protocol = getRequestProtocol(useRequestEvent(nuxt)) + ":";
  return protocol + "//" + domain;
}
function setupMultiDomainLocales(runtimeI18n, defaultLocaleDomain) {
  const { multiDomainLocales, strategy, routesNameSeparator, defaultLocaleRouteNameSuffix } = runtimeI18n;
  if (!multiDomainLocales) return;
  if (!(strategy === "prefix_except_default" || strategy === "prefix_and_default")) return;
  const router = useRouter();
  const defaultRouteSuffix = [routesNameSeparator, defaultLocaleRouteNameSuffix].join("");
  for (const route of router.getRoutes()) {
    const routeName = getRouteName(route.name);
    if (routeName.endsWith(defaultRouteSuffix)) {
      router.removeRoute(routeName);
      continue;
    }
    const routeNameLocale = routeName.split(routesNameSeparator)[1];
    if (routeNameLocale === defaultLocaleDomain) {
      router.addRoute({
        ...route,
        path: route.path === `/${routeNameLocale}` ? "/" : route.path.replace(`/${routeNameLocale}`, "")
      });
    }
  }
}
function getDefaultLocaleForDomain(runtimeI18n) {
  const { locales, domainLocales, defaultLocale, multiDomainLocales } = runtimeI18n;
  const host = getHost();
  if (!multiDomainLocales) {
    const foundLocale = normalizedLocales.find((l) => {
      const localeCode = isString(l) ? l : l.code;
      const lang = normalizedLocales.find((locale) => locale.code === localeCode);
      const domain = domainLocales?.[localeCode]?.domain ?? lang?.domain;
      return domain === host;
    });
    return foundLocale?.code ?? defaultLocale ?? "";
  }
  if (locales.some((l) => !isString(l) && l.defaultForDomains != null)) {
    const findDefaultLocale = locales.find(
      (l) => !isString(l) && !!l.defaultForDomains?.includes(host)
    );
    return findDefaultLocale?.code ?? "";
  }
  return defaultLocale || "";
}
const cacheMessages = /* @__PURE__ */ new Map();
async function loadVueI18nOptions(vueI18nConfigs2, nuxt) {
  const vueI18nOptions = { messages: {} };
  for (const configFile of vueI18nConfigs2) {
    const { default: resolver } = await configFile();
    const resolved = isFunction(resolver) ? await nuxt.runWithContext(() => resolver()) : resolver;
    deepCopy(resolved, vueI18nOptions);
  }
  return vueI18nOptions;
}
function makeFallbackLocaleCodes(fallback, locales) {
  if (fallback === false) return [];
  if (isArray(fallback)) return fallback;
  let fallbackLocales = [];
  if (isString(fallback)) {
    if (locales.every((locale) => locale !== fallback)) {
      fallbackLocales.push(fallback);
    }
    return fallbackLocales;
  }
  const targets = [...locales, "default"];
  for (const locale of targets) {
    if (locale in fallback == false) continue;
    fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)];
  }
  return fallbackLocales;
}
const isModule = (val) => toTypeString(val) === "[object Module]";
async function loadMessage(locale, { key, load }, nuxt) {
  let message = null;
  try {
    const getter = await load().then((x) => isModule(x) ? x.default : x);
    if (isFunction(getter)) {
      message = await nuxt.runWithContext(() => getter(locale));
    } else {
      message = getter;
      if (message != null && cacheMessages && true) {
        cacheMessages.set(key, message);
      }
    }
  } catch (e) {
    console.error("Failed locale loading: " + e.message);
  }
  return message;
}
async function loadLocale(locale, localeLoaders2, setter, nuxt) {
  const loaders = localeLoaders2[locale];
  if (loaders == null) {
    return;
  }
  const targetMessage = {};
  for (const loader of loaders) {
    let message = null;
    if (cacheMessages && cacheMessages.has(loader.key) && loader.cache) {
      message = cacheMessages.get(loader.key);
    } else {
      message = await nuxt.runWithContext(() => loadMessage(locale, loader, nuxt));
    }
    if (message != null) {
      deepCopy(message, targetMessage);
    }
  }
  setter(locale, targetMessage);
}
function getRouteBaseName(common, route) {
  const _route = unref(route);
  const routeName = isObject(_route) ? _route?.name : _route;
  if (_route == null || !routeName) {
    return;
  }
  return getRouteName(routeName).split(common.runtimeConfig.public.i18n.routesNameSeparator)[0];
}
function localePath(common, route, locale) {
  if (isString(route) && hasProtocol(route, { acceptRelative: true })) {
    return route;
  }
  const localizedRoute = resolveRoute(common, route, locale);
  return localizedRoute == null ? "" : localizedRoute.redirectedFrom?.fullPath || localizedRoute.fullPath;
}
function localeRoute(common, route, locale) {
  return resolveRoute(common, route, locale) ?? void 0;
}
function normalizeRawLocation(route) {
  if (!isString(route)) {
    return assign({}, route);
  }
  if (route[0] === "/") {
    const { pathname: path, search, hash } = parsePath(route);
    return { path, query: parseQuery(search), hash };
  }
  return { name: route };
}
const isRouteLocationPathRaw = (val) => !!val.path && !val.name;
function resolveRouteObject(common, route, locale) {
  const runtimeI18n = common.runtimeConfig.public.i18n;
  if (isRouteLocationPathRaw(route)) {
    const resolved = resolve(common, route, locale);
    const resolvedName = getRouteBaseName(common, resolved);
    if (resolvedName) {
      resolved.name = getLocaleRouteName(resolvedName, locale, runtimeI18n);
      return resolved;
    }
    if (!runtimeI18n.differentDomains && prefixable(locale, runtimeI18n.defaultLocale, runtimeI18n.strategy)) {
      route.path = "/" + locale + route.path;
    }
    route.path = (runtimeI18n.trailingSlash ? withTrailingSlash : withoutTrailingSlash)(route.path, true);
    return route;
  }
  route.name ||= getRouteBaseName(common, common.router.currentRoute.value);
  const localizedName = getLocaleRouteName(route.name, locale, runtimeI18n);
  if (common.router.hasRoute(localizedName)) {
    route.name = localizedName;
  }
  return route;
}
function resolveRoute(common, route, locale) {
  try {
    const _locale = locale || unref(getI18nTarget(common.i18n).locale);
    const normalized = normalizeRawLocation(route);
    const resolved = common.router.resolve(resolveRouteObject(common, normalized, _locale));
    if (resolved.name) {
      return resolved;
    }
    return common.router.resolve(route);
  } catch (e) {
    if (isNavigationFailure(
      e,
      1
      /* No match */
    )) {
      return null;
    }
  }
}
function getLocalizableMetaFromDynamicParams(common, route) {
  if (common.runtimeConfig.public.i18n.experimental.switchLocalePathLinkSSR) {
    return unref(common.metaState.value);
  }
  const meta = route.meta || {};
  return unref(meta)?.[DEFAULT_DYNAMIC_PARAMS_KEY] || {};
}
function switchLocalePath(common, locale, _route) {
  const route = _route ?? common.router.currentRoute.value;
  const name = getRouteBaseName(common, route);
  if (!name) {
    return "";
  }
  const resolvedParams = getLocalizableMetaFromDynamicParams(common, route)[locale];
  const routeCopy = {
    name,
    params: assign({}, route.params, resolvedParams),
    fullPath: route.fullPath,
    query: route.query,
    hash: route.hash,
    path: route.path,
    meta: route.meta
    // matched: route.matched,
    // redirectedFrom: route.redirectedFrom
  };
  const path = localePath(common, routeCopy, locale);
  if (common.runtimeConfig.public.i18n.differentDomains) {
    const domain = getDomainFromLocale(locale);
    return domain && joinURL(domain, path) || path;
  }
  return path;
}
function resolve(common, route, locale) {
  if (common.runtimeConfig.public.i18n.strategy === "no_prefix") {
    return route;
  }
  if (common.runtimeConfig.public.i18n.strategy !== "prefix") {
    return common.router.resolve(route);
  }
  const restPath = route.path.slice(1);
  const targetPath = route.path[0] + locale + (restPath && "/" + restPath);
  const _route = common.router.options.routes.find((r) => r.path === targetPath);
  if (_route == null) {
    return route;
  }
  return common.router.resolve(assign({}, route, _route, { path: targetPath }));
}
function formatMessage(message) {
  return `[${NUXT_I18N_MODULE_ID}]: ${message}`;
}
function initCommonComposableOptions(i18n) {
  return {
    i18n: i18n ?? useNuxtApp().$i18n,
    router: useRouter(),
    runtimeConfig: /* @__PURE__ */ useRuntimeConfig(),
    metaState: useState("nuxt-i18n-meta", () => ({}))
  };
}
async function loadAndSetLocale(nuxtApp, newLocale, initial = false) {
  const { differentDomains, skipSettingLocaleOnNavigate } = nuxtApp.$config.public.i18n;
  const opts = runtimeDetectBrowserLanguage(nuxtApp.$config.public.i18n);
  const oldLocale = unref(nuxtApp.$i18n.locale);
  const localeCodes2 = unref(nuxtApp.$i18n.localeCodes);
  function syncCookie(locale = oldLocale) {
    if (opts === false || !opts.useCookie) return;
    if (skipSettingLocaleOnNavigate) return;
    nuxtApp.$i18n.setLocaleCookie(locale);
  }
  const localeOverride = await nuxtApp.$i18n.onBeforeLanguageSwitch(oldLocale, newLocale, initial, nuxtApp);
  if (localeOverride && localeCodes2.includes(localeOverride)) {
    if (oldLocale === localeOverride) {
      syncCookie();
      return false;
    }
    newLocale = localeOverride;
  }
  if (!newLocale) {
    syncCookie();
    return false;
  }
  if (!initial && differentDomains) {
    syncCookie();
    return false;
  }
  if (oldLocale === newLocale) {
    syncCookie();
    return false;
  }
  const i18nFallbackLocales = unref(nuxtApp.$i18n.fallbackLocale);
  const setter = nuxtApp.$i18n.mergeLocaleMessage.bind(nuxtApp.$i18n);
  if (i18nFallbackLocales) {
    const fallbackLocales = makeFallbackLocaleCodes(i18nFallbackLocales, [newLocale]);
    await Promise.all(fallbackLocales.map((locale) => loadLocale(locale, localeLoaders, setter, nuxtApp)));
  }
  await loadLocale(newLocale, localeLoaders, setter, nuxtApp);
  if (skipSettingLocaleOnNavigate) {
    return false;
  }
  syncCookie(newLocale);
  nuxtApp._vueI18n.__setLocale(newLocale);
  await nuxtApp.$i18n.onLanguageSwitched(oldLocale, newLocale);
  return true;
}
function detectLocale(nuxtApp, route, routeLocale, currentLocale, localeCookie) {
  const { strategy, defaultLocale, differentDomains, multiDomainLocales } = nuxtApp.$config.public.i18n;
  const _detectBrowserLanguage = runtimeDetectBrowserLanguage();
  const detectedBrowser = detectBrowserLanguage(nuxtApp, route, localeCookie, currentLocale);
  if (detectedBrowser.locale && detectedBrowser.from != null && localeCodes.includes(detectedBrowser.locale)) {
    return detectedBrowser.locale;
  }
  let detected = "";
  if (differentDomains || multiDomainLocales) {
    detected ||= getLocaleDomain(normalizedLocales, strategy, route);
  } else if (strategy !== "no_prefix") {
    detected ||= routeLocale;
  }
  const cookieLocale = (localeCodes.includes(detectedBrowser.locale) || localeCookie && localeCodes.includes(localeCookie)) && _detectBrowserLanguage && _detectBrowserLanguage.useCookie && localeCookie;
  detected ||= cookieLocale || currentLocale || defaultLocale || "";
  return detected;
}
function detectRedirect({ to, nuxtApp, from, locale, routeLocale }, inMiddleware = false) {
  if (routeLocale === locale || nuxtApp.$i18n.strategy === "no_prefix") {
    return "";
  }
  const common = initCommonComposableOptions();
  let redirectPath = switchLocalePath(common, locale, to);
  if (inMiddleware && !redirectPath) {
    redirectPath = localePath(common, to.fullPath, locale);
  }
  if (isEqual(redirectPath, to.fullPath) || from && isEqual(redirectPath, from.fullPath)) {
    return "";
  }
  return redirectPath;
}
const useRedirectState = () => useState(NUXT_I18N_MODULE_ID + ":redirect", () => "");
async function navigate({ nuxt, locale, route, redirectPath }, enableNavigate = false) {
  const { rootRedirect, differentDomains, multiDomainLocales, skipSettingLocaleOnNavigate, locales, strategy } = nuxt.$config.public.i18n;
  if (route.path === "/" && rootRedirect) {
    let redirectCode = 302;
    if (isString(rootRedirect)) {
      redirectPath = "/" + rootRedirect;
    } else {
      redirectPath = "/" + rootRedirect.path;
      redirectCode = rootRedirect.statusCode;
    }
    redirectPath = nuxt.$localePath(redirectPath, locale);
    return navigateTo(redirectPath, { redirectCode });
  }
  if (multiDomainLocales && strategy === "prefix_except_default") {
    const host = getHost();
    const currentDomain = locales.find((locale2) => {
      if (isString(locale2)) return;
      return locale2.defaultForDomains?.find((domain) => domain === host);
    });
    const defaultLocaleForDomain = !isString(currentDomain) ? currentDomain?.code : void 0;
    if (route.path.startsWith(`/${defaultLocaleForDomain}`)) {
      return navigateTo(route.path.replace(`/${defaultLocaleForDomain}`, ""));
    }
    if (!route.path.startsWith(`/${locale}`) && locale !== defaultLocaleForDomain) {
      const oldLocale = nuxt._vueI18n.__localeFromRoute(route.path);
      if (oldLocale !== "") {
        return navigateTo(`/${locale + route.path.replace(`/${oldLocale}`, "")}`);
      }
      return navigateTo(`/${locale + (route.path === "/" ? "" : route.path)}`);
    }
    if (redirectPath && route.path !== redirectPath) {
      return navigateTo(redirectPath);
    }
    return;
  }
  if (differentDomains) {
    const state = useRedirectState();
    if (state.value && state.value !== redirectPath) {
      {
        state.value = redirectPath;
      }
    }
  } else if (redirectPath) {
    return navigateTo(redirectPath);
  }
}
function prefixable(currentLocale, defaultLocale, strategy) {
  return (
    // strategy has no prefixes
    strategy !== "no_prefix" && // strategy should not prefix default locale
    !(currentLocale === defaultLocale && (strategy === "prefix_and_default" || strategy === "prefix_except_default"))
  );
}
function extendBaseUrl(ctx) {
  const { baseUrl, defaultLocale, differentDomains } = ctx.$config.public.i18n;
  if (isFunction(baseUrl)) {
    return () => {
      const baseUrlResult = baseUrl(ctx);
      return baseUrlResult;
    };
  }
  const localeCode = isFunction(defaultLocale) ? defaultLocale() : defaultLocale;
  return () => {
    if (differentDomains && localeCode) {
      const domain = getDomainFromLocale(localeCode);
      if (domain) {
        return domain;
      }
    }
    return baseUrl ?? "";
  };
}
function toArray(value) {
  return isArray(value) ? value : [value];
}
function wrapComposable(fn, common = initCommonComposableOptions()) {
  return (...args) => fn(common, ...args);
}
function parseAcceptLanguage(input = "") {
  return input.split(",").map((tag) => tag.split(";")[0]);
}
function getBrowserLocale() {
  const browserLocales = parseAcceptLanguage(useRequestHeader("accept-language"));
  return findBrowserLocale(normalizedLocales, browserLocales) || void 0;
}
function createI18nCookie() {
  const detect = runtimeDetectBrowserLanguage();
  const cookieKey = detect && detect.cookieKey || DEFAULT_COOKIE_KEY;
  const date = /* @__PURE__ */ new Date();
  const cookieOptions = {
    path: "/",
    readonly: false,
    expires: new Date(date.setDate(date.getDate() + 365)),
    sameSite: detect && detect.cookieCrossOrigin ? "none" : "lax",
    domain: detect && detect.cookieDomain || void 0,
    secure: detect && detect.cookieCrossOrigin || detect && detect.cookieSecure
  };
  return useCookie(cookieKey, cookieOptions);
}
function getLocaleCookie(cookieRef, detect, defaultLocale) {
  if (detect === false || !detect.useCookie) {
    return;
  }
  const localeCode = cookieRef.value ?? void 0;
  if (localeCode == null) {
    return;
  }
  if (localeCodes.includes(localeCode)) {
    return localeCode;
  }
  if (defaultLocale) {
    cookieRef.value = defaultLocale;
    return defaultLocale;
  }
  cookieRef.value = void 0;
}
function detectBrowserLanguage(nuxtApp, route, localeCookie, locale = "") {
  const _detect = runtimeDetectBrowserLanguage();
  if (!_detect) {
    return { locale: "", error: "disabled" };
  }
  const strategy = nuxtApp.$i18n.strategy;
  const firstAccess = nuxtApp._vueI18n.__firstAccess;
  if (!firstAccess) {
    return { locale: strategy === "no_prefix" ? locale : "", error: "first_access_only" };
  }
  if (strategy !== "no_prefix") {
    const path = isString(route) ? route : route.path;
    if (_detect.redirectOn === "root" && path !== "/") {
      return { locale: "", error: "not_redirect_on_root" };
    }
    if (_detect.redirectOn === "no prefix" && !_detect.alwaysRedirect && path.match(regexpPath)) {
      return { locale: "", error: "not_redirect_on_no_prefix" };
    }
  }
  const cookieMatch = _detect.useCookie && localeCookie || void 0;
  if (cookieMatch) {
    return { locale: cookieMatch, from: "cookie" };
  }
  const browserMatch = nuxtApp.$i18n.getBrowserLocale();
  if (browserMatch) {
    return { locale: browserMatch, from: "navigator_or_header" };
  }
  return { locale: _detect.fallbackLocale || "", from: "fallback" };
}
function runtimeDetectBrowserLanguage(opts = (/* @__PURE__ */ useRuntimeConfig()).public.i18n) {
  if (opts?.detectBrowserLanguage === false) return false;
  return opts?.detectBrowserLanguage;
}
function createHeadContext(options) {
  const nuxtApp = useNuxtApp();
  const locale = unref(nuxtApp.$i18n.locale);
  const locales = unref(nuxtApp.$i18n.locales).map((x) => isString(x) ? { code: x } : x);
  const currentLocale = locales.find((l) => l.code === locale) || { code: locale };
  const baseUrl = joinURL(unref(getComposer$3(nuxtApp.$i18n).baseUrl), nuxtApp.$config.app.baseURL);
  const runtimeI18n = nuxtApp.$config.public.i18n;
  if (!baseUrl) {
    console.warn("I18n `baseUrl` is required to generate valid SEO tag links.");
  }
  return {
    dir: options.dir,
    lang: options.lang,
    key: options.key,
    seo: options.seo,
    locale,
    locales,
    currentDir: currentLocale.dir || runtimeI18n.defaultDirection,
    currentLocale,
    currentLanguage: currentLocale.language,
    baseUrl,
    runtimeI18n
  };
}
function localeHead(common, { dir = true, lang = true, seo = true, key = "hid" }) {
  return _localeHead(common, { dir, lang, seo, key });
}
function _localeHead(common, options) {
  const metaObject = {
    htmlAttrs: {},
    link: [],
    meta: []
  };
  const ctx = createHeadContext(options);
  if (ctx.baseUrl == null) {
    return metaObject;
  }
  if (ctx.dir) {
    metaObject.htmlAttrs.dir = ctx.currentDir;
  }
  if (ctx.lang && ctx.currentLanguage) {
    metaObject.htmlAttrs.lang = ctx.currentLanguage;
  }
  if (ctx.seo) {
    metaObject.link = metaObject.link.concat(
      getHreflangLinks(common, ctx),
      getCanonicalLink(common, ctx)
    );
    metaObject.meta = metaObject.meta.concat(
      getOgUrl(common, ctx),
      getCurrentOgLocale(ctx),
      getAlternateOgLocales(ctx)
    );
  }
  return metaObject;
}
function getHreflangLinks(common, ctx) {
  const { defaultLocale, strategy, differentDomains } = ctx.runtimeI18n;
  const links = [];
  if (strategy === "no_prefix" && !differentDomains) return links;
  const localeMap = /* @__PURE__ */ new Map();
  for (const locale of ctx.locales) {
    if (!locale.language) {
      console.warn("Locale `language` ISO code is required to generate alternate link");
      continue;
    }
    const [language, region] = locale.language.split("-");
    if (language && region && (locale.isCatchallLocale || !localeMap.has(language))) {
      localeMap.set(language, locale);
    }
    localeMap.set(locale.language, locale);
  }
  const strictCanonicals = ctx.runtimeI18n.experimental.alternateLinkCanonicalQueries === true;
  const routeWithoutQuery = strictCanonicals ? common.router.resolve({ query: {} }) : void 0;
  if (!ctx.runtimeI18n.experimental.switchLocalePathLinkSSR && strictCanonicals) {
    routeWithoutQuery.meta = common.router.currentRoute.value.meta;
  }
  for (const [language, mapLocale] of localeMap.entries()) {
    const localePath2 = switchLocalePath(common, mapLocale.code, routeWithoutQuery);
    if (!localePath2) continue;
    const fullPath = differentDomains && mapLocale.domain ? localePath2 : joinURL(ctx.baseUrl, localePath2);
    const href = withQuery(fullPath, strictCanonicals ? getCanonicalQueryParams(common, ctx) : {});
    links.push({ [ctx.key]: `i18n-alt-${language}`, rel: "alternate", href, hreflang: language });
    if (defaultLocale && defaultLocale === mapLocale.code) {
      links.unshift({ [ctx.key]: "i18n-xd", rel: "alternate", href, hreflang: "x-default" });
    }
  }
  return links;
}
function getCanonicalUrl(common, ctx) {
  const route = common.router.currentRoute.value;
  const currentRoute = localeRoute(
    common,
    assign({}, route, { path: void 0, name: getRouteBaseName(common, route) })
  );
  if (!currentRoute) return "";
  return withQuery(joinURL(ctx.baseUrl, currentRoute.path), getCanonicalQueryParams(common, ctx));
}
function getCanonicalLink(common, ctx) {
  const href = getCanonicalUrl(common, ctx);
  if (!href) return [];
  return [{ [ctx.key]: "i18n-can", rel: "canonical", href }];
}
function getCanonicalQueryParams(common, ctx) {
  const route = common.router.currentRoute.value;
  const currentRoute = localeRoute(
    common,
    assign({}, route, { path: void 0, name: getRouteBaseName(common, route) })
  );
  const canonicalQueries = isObject(ctx.seo) && ctx.seo?.canonicalQueries || [];
  const currentRouteQuery = currentRoute?.query || {};
  const params = {};
  for (const param of canonicalQueries.filter((x) => x in currentRouteQuery)) {
    params[param] ??= [];
    for (const val of toArray(currentRouteQuery[param])) {
      params[param].push(val || "");
    }
  }
  return params;
}
function getOgUrl(common, ctx) {
  const href = getCanonicalUrl(common, ctx);
  if (!href) return [];
  return [{ [ctx.key]: "i18n-og-url", property: "og:url", content: href }];
}
function getCurrentOgLocale(ctx) {
  if (!ctx.currentLanguage) return [];
  return [{ [ctx.key]: "i18n-og", property: "og:locale", content: hyphenToUnderscore(ctx.currentLanguage) }];
}
function getAlternateOgLocales(ctx) {
  const alternateLocales = ctx.locales.filter((locale) => locale.language && locale.language !== ctx.currentLanguage);
  return alternateLocales.map((locale) => ({
    [ctx.key]: `i18n-og-alt-${locale.language}`,
    property: "og:locale:alternate",
    content: hyphenToUnderscore(locale.language)
  }));
}
function hyphenToUnderscore(val = "") {
  return val.replace(/-/g, "_");
}
function createPosition(line, column, offset) {
  return { line, column, offset };
}
function createLocation(start, end, source) {
  const loc = { start, end };
  return loc;
}
const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14};
const COMPILE_ERROR_CODES_EXTEND_POINT = 17;
function createCompileError(code, loc, options = {}) {
  const { domain, messages, args } = options;
  const msg = code;
  const error = new SyntaxError(String(msg));
  error.code = code;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
function defaultOnError(error) {
  throw error;
}
const CHAR_SP = " ";
const CHAR_CR = "\r";
const CHAR_LF = "\n";
const CHAR_LS = String.fromCharCode(8232);
const CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;
  const isCRLF = (index2) => _buf[index2] === CHAR_CR && _buf[index2 + 1] === CHAR_LF;
  const isLF = (index2) => _buf[index2] === CHAR_LF;
  const isPS = (index2) => _buf[index2] === CHAR_PS;
  const isLS = (index2) => _buf[index2] === CHAR_LS;
  const isLineEnd = (index2) => isCRLF(index2) || isLF(index2) || isPS(index2) || isLS(index2);
  const index = () => _index;
  const line = () => _line;
  const column = () => _column;
  const peekOffset = () => _peekOffset;
  const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
  const currentChar = () => charAt(_index);
  const currentPeek = () => charAt(_index + _peekOffset);
  function next() {
    _peekOffset = 0;
    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }
    if (isCRLF(_index)) {
      _index++;
    }
    _index++;
    _column++;
    return _buf[_index];
  }
  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }
    _peekOffset++;
    return _buf[_index + _peekOffset];
  }
  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }
  function resetPeek(offset = 0) {
    _peekOffset = offset;
  }
  function skipToPeek() {
    const target = _index + _peekOffset;
    while (target !== _index) {
      next();
    }
    _peekOffset = 0;
  }
  return {
    index,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}
const EOF = void 0;
const DOT = ".";
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$3 = "tokenizer";
function createTokenizer(source, options = {}) {
  const location = options.location !== false;
  const _scnr = createScanner(source);
  const currentOffset = () => _scnr.index();
  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
  const _initLoc = currentPosition();
  const _initOffset = currentOffset();
  const _context = {
    currentType: 13,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 13,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ""
  };
  const context = () => _context;
  const { onError } = options;
  function emitError(code, pos, offset, ...args) {
    const ctx = context();
    pos.column += offset;
    pos.offset += offset;
    if (onError) {
      const loc = location ? createLocation(ctx.startLoc, pos) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$3,
        args
      });
      onError(err);
    }
  }
  function getToken(context2, type, value) {
    context2.endLoc = currentPosition();
    context2.currentType = type;
    const token = { type };
    if (location) {
      token.loc = createLocation(context2.startLoc, context2.endLoc);
    }
    if (value != null) {
      token.value = value;
    }
    return token;
  }
  const getEndToken = (context2) => getToken(
    context2,
    13
    /* TokenTypes.EOF */
  );
  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
      return "";
    }
  }
  function peekSpaces(scnr) {
    let buf = "";
    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }
    return buf;
  }
  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }
  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc === 95;
  }
  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function isNamedIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isListIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }
  function isLiteralStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDotStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 7) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ".";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedModifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 8) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDelimiterStart(scnr, context2) {
    const { currentType } = context2;
    if (!(currentType === 7 || currentType === 11)) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedReferStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 9) {
      return false;
    }
    const fn = () => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn();
      } else {
        return isTextStart(scnr, false);
      }
    };
    const ret = fn();
    scnr.resetPeek();
    return ret;
  }
  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|";
    scnr.resetPeek();
    return ret;
  }
  function isTextStart(scnr, reset = true) {
    const fn = (hasSpace = false, prev = "") => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return hasSpace;
      } else if (ch === "@" || !ch) {
        return hasSpace;
      } else if (ch === "|") {
        return !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn(true, CHAR_SP);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn(true, CHAR_LF);
      } else {
        return true;
      }
    };
    const ret = fn();
    reset && scnr.resetPeek();
    return ret;
  }
  function takeChar(scnr, fn) {
    const ch = scnr.currentChar();
    if (ch === EOF) {
      return EOF;
    }
    if (fn(ch)) {
      scnr.next();
      return ch;
    }
    return null;
  }
  function isIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36;
  }
  function takeIdentifierChar(scnr) {
    return takeChar(scnr, isIdentifier);
  }
  function isNamedIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36 || // $
    cc === 45;
  }
  function takeNamedIdentifierChar(scnr) {
    return takeChar(scnr, isNamedIdentifier);
  }
  function isDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function takeDigit(scnr) {
    return takeChar(scnr, isDigit);
  }
  function isHexDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57 || // 0-9
    cc >= 65 && cc <= 70 || // A-F
    cc >= 97 && cc <= 102;
  }
  function takeHexDigit(scnr) {
    return takeChar(scnr, isHexDigit);
  }
  function getDigits(scnr) {
    let ch = "";
    let num = "";
    while (ch = takeDigit(scnr)) {
      num += ch;
    }
    return num;
  }
  function readText(scnr) {
    let buf = "";
    while (true) {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
        break;
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }
    return buf;
  }
  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let name = "";
    while (ch = takeNamedIdentifierChar(scnr)) {
      name += ch;
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return name;
  }
  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = "";
    if (scnr.currentChar() === "-") {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return value;
  }
  function isLiteral2(ch) {
    return ch !== LITERAL_DELIMITER && ch !== CHAR_LF;
  }
  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `'`);
    let ch = "";
    let literal = "";
    while (ch = takeChar(scnr, isLiteral2)) {
      if (ch === "\\") {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }
    const current = scnr.currentChar();
    if (current === CHAR_LF || current === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
      if (current === CHAR_LF) {
        scnr.next();
        eat(scnr, `'`);
      }
      return literal;
    }
    eat(scnr, `'`);
    return literal;
  }
  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();
    switch (ch) {
      case "\\":
      case `'`:
        scnr.next();
        return `\\${ch}`;
      case "u":
        return readUnicodeEscapeSequence(scnr, ch, 4);
      case "U":
        return readUnicodeEscapeSequence(scnr, ch, 6);
      default:
        emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
        return "";
    }
  }
  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = "";
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr);
      if (!ch) {
        emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }
      sequence += ch;
    }
    return `\\${unicode}${sequence}`;
  }
  function isInvalidIdentifier(ch) {
    return ch !== "{" && ch !== "}" && ch !== CHAR_SP && ch !== CHAR_LF;
  }
  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let identifiers = "";
    while (ch = takeChar(scnr, isInvalidIdentifier)) {
      identifiers += ch;
    }
    return identifiers;
  }
  function readLinkedModifier(scnr) {
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    return name;
  }
  function readLinkedRefer(scnr) {
    const fn = (buf) => {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF || ch === DOT) {
        buf += ch;
        scnr.next();
        return fn(buf);
      } else {
        buf += ch;
        scnr.next();
        return fn(buf);
      }
    };
    return fn("");
  }
  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(
      scnr,
      "|"
      /* TokenChars.Pipe */
    );
    skipSpaces(scnr);
    return plural;
  }
  function readTokenInPlaceholder(scnr, context2) {
    let token = null;
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        if (context2.braceNest >= 1) {
          emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          2,
          "{"
          /* TokenChars.BraceLeft */
        );
        skipSpaces(scnr);
        context2.braceNest++;
        return token;
      case "}":
        if (context2.braceNest > 0 && context2.currentType === 2) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
        context2.braceNest--;
        context2.braceNest > 0 && skipSpaces(scnr);
        if (context2.inLinked && context2.braceNest === 0) {
          context2.inLinked = false;
        }
        return token;
      case "@":
        if (context2.braceNest > 0) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
        }
        token = readTokenInLinked(scnr, context2) || getEndToken(context2);
        context2.braceNest = 0;
        return token;
      default: {
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;
        if (isPluralStart(scnr)) {
          if (context2.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (context2.braceNest > 0 && (context2.currentType === 4 || context2.currentType === 5 || context2.currentType === 6)) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          context2.braceNest = 0;
          return readToken(scnr, context2);
        }
        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
          token = getToken(context2, 4, readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
          token = getToken(context2, 5, readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validLiteral = isLiteralStart(scnr, context2)) {
          token = getToken(context2, 6, readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          token = getToken(context2, 12, readInvalidIdentifier(scnr));
          emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }
        break;
      }
    }
    return token;
  }
  function readTokenInLinked(scnr, context2) {
    const { currentType } = context2;
    let token = null;
    const ch = scnr.currentChar();
    if ((currentType === 7 || currentType === 8 || currentType === 11 || currentType === 9) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
    }
    switch (ch) {
      case "@":
        scnr.next();
        token = getToken(
          context2,
          7,
          "@"
          /* TokenChars.LinkedAlias */
        );
        context2.inLinked = true;
        return token;
      case ".":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          8,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          9,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context2);
        }
        if (isLinkedModifierStart(scnr, context2)) {
          skipSpaces(scnr);
          return getToken(context2, 11, readLinkedModifier(scnr));
        }
        if (isLinkedReferStart(scnr, context2)) {
          skipSpaces(scnr);
          if (ch === "{") {
            return readTokenInPlaceholder(scnr, context2) || token;
          } else {
            return getToken(context2, 10, readLinkedRefer(scnr));
          }
        }
        if (currentType === 7) {
          emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
        }
        context2.braceNest = 0;
        context2.inLinked = false;
        return readToken(scnr, context2);
    }
  }
  function readToken(scnr, context2) {
    let token = {
      type: 13
      /* TokenTypes.EOF */
    };
    if (context2.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
    }
    if (context2.inLinked) {
      return readTokenInLinked(scnr, context2) || getEndToken(context2);
    }
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      case "}":
        emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
        scnr.next();
        return getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      default: {
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isTextStart(scnr)) {
          return getToken(context2, 0, readText(scnr));
        }
        break;
      }
    }
    return token;
  }
  function nextToken() {
    const { currentType, offset, startLoc, endLoc } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();
    if (_scnr.currentChar() === EOF) {
      return getToken(
        _context,
        13
        /* TokenTypes.EOF */
      );
    }
    return readToken(_scnr, _context);
  }
  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}
const ERROR_DOMAIN$2 = "parser";
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;
    // eslint-disable-next-line no-useless-escape
    case `\\'`:
      return `'`;
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16);
      if (codePoint <= 55295 || codePoint >= 57344) {
        return String.fromCodePoint(codePoint);
      }
      return "�";
    }
  }
}
function createParser(options = {}) {
  const location = options.location !== false;
  const { onError } = options;
  function emitError(tokenzer, code, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onError) {
      const loc = location ? createLocation(start, end) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$2,
        args
      });
      onError(err);
    }
  }
  function startNode(type, offset, loc) {
    const node = { type };
    if (location) {
      node.start = offset;
      node.end = offset;
      node.loc = { start: loc, end: loc };
    }
    return node;
  }
  function endNode(node, offset, pos, type) {
    if (location) {
      node.end = offset;
      if (node.loc) {
        node.loc.end = pos;
      }
    }
  }
  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseList(tokenizer, index) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(5, offset, loc);
    node.index = parseInt(index, 10);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseNamed(tokenizer, key) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(4, offset, loc);
    node.key = key;
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(9, offset, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(8, offset, loc);
    if (token.type !== 11) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
      node.value = "";
      endNode(node, offset, loc);
      return {
        nextConsumeToken: token,
        node
      };
    }
    if (token.value == null) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    node.value = token.value || "";
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }
  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6, context.offset, context.startLoc);
    let token = tokenizer.nextToken();
    if (token.type === 8) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    }
    if (token.type !== 9) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    token = tokenizer.nextToken();
    if (token.type === 2) {
      token = tokenizer.nextToken();
    }
    switch (token.type) {
      case 10:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
        break;
      case 4:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseNamed(tokenizer, token.value || "");
        break;
      case 5:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseList(tokenizer, token.value || "");
        break;
      case 6:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || "");
        break;
      default: {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = "";
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
      }
    }
    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }
  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
    const node = startNode(2, startOffset, startLoc);
    node.items = [];
    let nextToken = null;
    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;
      switch (token.type) {
        case 0:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseText(tokenizer, token.value || ""));
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseList(tokenizer, token.value || ""));
          break;
        case 4:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseNamed(tokenizer, token.value || ""));
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseLiteral(tokenizer, token.value || ""));
          break;
        case 7: {
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
        }
      }
    } while (context.currentType !== 13 && context.currentType !== 1);
    const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }
  function parsePlural(tokenizer, offset, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1, offset, loc);
    node.cases = [];
    node.cases.push(msgNode);
    do {
      const msg = parseMessage(tokenizer);
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }
      node.cases.push(msg);
    } while (context.currentType !== 13);
    if (hasEmptyMessage) {
      emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const { offset, startLoc } = context;
    const msgNode = parseMessage(tokenizer);
    if (context.currentType === 13) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode);
    }
  }
  function parse2(source) {
    const tokenizer = createTokenizer(source, assign({}, options));
    const context = tokenizer.context();
    const node = startNode(0, context.offset, context.startLoc);
    if (location && node.loc) {
      node.loc.source = source;
    }
    node.body = parseResource(tokenizer);
    if (options.onCacheKey) {
      node.cacheKey = options.onCacheKey(source);
    }
    if (context.currentType !== 13) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  return { parse: parse2 };
}
function getTokenCaption(token) {
  if (token.type === 13) {
    return "EOF";
  }
  const name = (token.value || "").replace(/\r?\n/gu, "\\n");
  return name.length > 10 ? name.slice(0, 9) + "…" : name;
}
function createTransformer(ast, options = {}) {
  const _context = {
    ast,
    helpers: /* @__PURE__ */ new Set()
  };
  const context = () => _context;
  const helper = (name) => {
    _context.helpers.add(name);
    return name;
  };
  return { context, helper };
}
function traverseNodes(nodes, transformer) {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer);
  }
}
function traverseNode(node, transformer) {
  switch (node.type) {
    case 1:
      traverseNodes(node.cases, transformer);
      transformer.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      traverseNodes(node.items, transformer);
      break;
    case 6: {
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper(
        "linked"
        /* HelperNameMap.LINKED */
      );
      transformer.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    }
    case 5:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function transform(ast, options = {}) {
  const transformer = createTransformer(ast);
  transformer.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  );
  ast.body && traverseNode(ast.body, transformer);
  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}
function optimize(ast) {
  const body = ast.body;
  if (body.type === 2) {
    optimizeMessageNode(body);
  } else {
    body.cases.forEach((c) => optimizeMessageNode(c));
  }
  return ast;
}
function optimizeMessageNode(message) {
  if (message.items.length === 1) {
    const item = message.items[0];
    if (item.type === 3 || item.type === 9) {
      message.static = item.value;
      delete item.value;
    }
  } else {
    const values = [];
    for (let i = 0; i < message.items.length; i++) {
      const item = message.items[i];
      if (!(item.type === 3 || item.type === 9)) {
        break;
      }
      if (item.value == null) {
        break;
      }
      values.push(item.value);
    }
    if (values.length === message.items.length) {
      message.static = join(values);
      for (let i = 0; i < message.items.length; i++) {
        const item = message.items[i];
        if (item.type === 3 || item.type === 9) {
          delete item.value;
        }
      }
    }
  }
}
function minify(node) {
  node.t = node.type;
  switch (node.type) {
    case 0: {
      const resource = node;
      minify(resource.body);
      resource.b = resource.body;
      delete resource.body;
      break;
    }
    case 1: {
      const plural = node;
      const cases = plural.cases;
      for (let i = 0; i < cases.length; i++) {
        minify(cases[i]);
      }
      plural.c = cases;
      delete plural.cases;
      break;
    }
    case 2: {
      const message = node;
      const items = message.items;
      for (let i = 0; i < items.length; i++) {
        minify(items[i]);
      }
      message.i = items;
      delete message.items;
      if (message.static) {
        message.s = message.static;
        delete message.static;
      }
      break;
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const valueNode = node;
      if (valueNode.value) {
        valueNode.v = valueNode.value;
        delete valueNode.value;
      }
      break;
    }
    case 6: {
      const linked = node;
      minify(linked.key);
      linked.k = linked.key;
      delete linked.key;
      if (linked.modifier) {
        minify(linked.modifier);
        linked.m = linked.modifier;
        delete linked.modifier;
      }
      break;
    }
    case 5: {
      const list = node;
      list.i = list.index;
      delete list.index;
      break;
    }
    case 4: {
      const named = node;
      named.k = named.key;
      delete named.key;
      break;
    }
  }
  delete node.type;
}
function createCodeGenerator(ast, options) {
  const { filename, breakLineCode, needIndent: _needIndent } = options;
  const location = options.location !== false;
  const _context = {
    filename,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };
  if (location && ast.loc) {
    _context.source = ast.loc.source;
  }
  const context = () => _context;
  function push(code, node) {
    _context.code += code;
  }
  function _newline(n, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : "";
    push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
  }
  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }
  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }
  function newline() {
    _newline(_context.indentLevel);
  }
  const helper = (key) => `_${key}`;
  const needIndent = () => _context.needIndent;
  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}
function generateLinkedNode(generator, node) {
  const { helper } = generator;
  generator.push(`${helper(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`);
  generateNode(generator, node.key);
  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
    generator.push(`, _type`);
  } else {
    generator.push(`, undefined, _type`);
  }
  generator.push(`)`);
}
function generateMessageNode(generator, node) {
  const { helper, needIndent } = generator;
  generator.push(`${helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`);
  generator.indent(needIndent());
  const length = node.items.length;
  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i]);
    if (i === length - 1) {
      break;
    }
    generator.push(", ");
  }
  generator.deindent(needIndent());
  generator.push("])");
}
function generatePluralNode(generator, node) {
  const { helper, needIndent } = generator;
  if (node.cases.length > 1) {
    generator.push(`${helper(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`);
    generator.indent(needIndent());
    const length = node.cases.length;
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i]);
      if (i === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push(`])`);
  }
}
function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push("null");
  }
}
function generateNode(generator, node) {
  const { helper } = generator;
  switch (node.type) {
    case 0:
      generateResource(generator, node);
      break;
    case 1:
      generatePluralNode(generator, node);
      break;
    case 2:
      generateMessageNode(generator, node);
      break;
    case 6:
      generateLinkedNode(generator, node);
      break;
    case 8:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 7:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 5:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "list"
        /* HelperNameMap.LIST */
      )}(${node.index}))`, node);
      break;
    case 4:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(node.key)}))`, node);
      break;
    case 9:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 3:
      generator.push(JSON.stringify(node.value), node);
      break;
  }
}
const generate = (ast, options = {}) => {
  const mode = isString(options.mode) ? options.mode : "normal";
  const filename = isString(options.filename) ? options.filename : "message.intl";
  !!options.sourceMap;
  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
  const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    filename,
    breakLineCode,
    needIndent
  });
  generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);
  if (helpers.length > 0) {
    generator.push(`const { ${join(helpers.map((s) => `${s}: _${s}`), ", ")} } = ctx`);
    generator.newline();
  }
  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  delete ast.helpers;
  const { code, map } = generator.context();
  return {
    ast,
    code,
    map: map ? map.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function baseCompile$1(source, options = {}) {
  const assignedOptions = assign({}, options);
  const jit = !!assignedOptions.jit;
  const enalbeMinify = !!assignedOptions.minify;
  const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
  const parser = createParser(assignedOptions);
  const ast = parser.parse(source);
  if (!jit) {
    transform(ast, assignedOptions);
    return generate(ast, assignedOptions);
  } else {
    enambeOptimize && optimize(ast);
    enalbeMinify && minify(ast);
    return { ast, code: "" };
  }
}
function isMessageAST(val) {
  return isObject(val) && resolveType(val) === 0 && (hasOwn(val, "b") || hasOwn(val, "body"));
}
const PROPS_BODY = ["b", "body"];
function resolveBody(node) {
  return resolveProps(node, PROPS_BODY);
}
const PROPS_CASES = ["c", "cases"];
function resolveCases(node) {
  return resolveProps(node, PROPS_CASES, []);
}
const PROPS_STATIC = ["s", "static"];
function resolveStatic(node) {
  return resolveProps(node, PROPS_STATIC);
}
const PROPS_ITEMS = ["i", "items"];
function resolveItems(node) {
  return resolveProps(node, PROPS_ITEMS, []);
}
const PROPS_TYPE = ["t", "type"];
function resolveType(node) {
  return resolveProps(node, PROPS_TYPE);
}
const PROPS_VALUE = ["v", "value"];
function resolveValue$1(node, type) {
  const resolved = resolveProps(node, PROPS_VALUE);
  if (resolved != null) {
    return resolved;
  } else {
    throw createUnhandleNodeError(type);
  }
}
const PROPS_MODIFIER = ["m", "modifier"];
function resolveLinkedModifier(node) {
  return resolveProps(node, PROPS_MODIFIER);
}
const PROPS_KEY = ["k", "key"];
function resolveLinkedKey(node) {
  const resolved = resolveProps(node, PROPS_KEY);
  if (resolved) {
    return resolved;
  } else {
    throw createUnhandleNodeError(
      6
      /* NodeTypes.Linked */
    );
  }
}
function resolveProps(node, props, defaultValue) {
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (hasOwn(node, prop) && node[prop] != null) {
      return node[prop];
    }
  }
  return defaultValue;
}
const AST_NODE_PROPS_KEYS = [
  ...PROPS_BODY,
  ...PROPS_CASES,
  ...PROPS_STATIC,
  ...PROPS_ITEMS,
  ...PROPS_KEY,
  ...PROPS_MODIFIER,
  ...PROPS_VALUE,
  ...PROPS_TYPE
];
function createUnhandleNodeError(type) {
  return new Error(`unhandled node type: ${type}`);
}
function format(ast) {
  const msg = (ctx) => formatParts(ctx, ast);
  return msg;
}
function formatParts(ctx, ast) {
  const body = resolveBody(ast);
  if (body == null) {
    throw createUnhandleNodeError(
      0
      /* NodeTypes.Resource */
    );
  }
  const type = resolveType(body);
  if (type === 1) {
    const plural = body;
    const cases = resolveCases(plural);
    return ctx.plural(cases.reduce((messages, c) => [
      ...messages,
      formatMessageParts(ctx, c)
    ], []));
  } else {
    return formatMessageParts(ctx, body);
  }
}
function formatMessageParts(ctx, node) {
  const static_ = resolveStatic(node);
  if (static_ != null) {
    return ctx.type === "text" ? static_ : ctx.normalize([static_]);
  } else {
    const messages = resolveItems(node).reduce((acm, c) => [...acm, formatMessagePart(ctx, c)], []);
    return ctx.normalize(messages);
  }
}
function formatMessagePart(ctx, node) {
  const type = resolveType(node);
  switch (type) {
    case 3: {
      return resolveValue$1(node, type);
    }
    case 9: {
      return resolveValue$1(node, type);
    }
    case 4: {
      const named = node;
      if (hasOwn(named, "k") && named.k) {
        return ctx.interpolate(ctx.named(named.k));
      }
      if (hasOwn(named, "key") && named.key) {
        return ctx.interpolate(ctx.named(named.key));
      }
      throw createUnhandleNodeError(type);
    }
    case 5: {
      const list = node;
      if (hasOwn(list, "i") && isNumber(list.i)) {
        return ctx.interpolate(ctx.list(list.i));
      }
      if (hasOwn(list, "index") && isNumber(list.index)) {
        return ctx.interpolate(ctx.list(list.index));
      }
      throw createUnhandleNodeError(type);
    }
    case 6: {
      const linked = node;
      const modifier = resolveLinkedModifier(linked);
      const key = resolveLinkedKey(linked);
      return ctx.linked(formatMessagePart(ctx, key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
    }
    case 7: {
      return resolveValue$1(node, type);
    }
    case 8: {
      return resolveValue$1(node, type);
    }
    default:
      throw new Error(`unhandled node on format message part: ${type}`);
  }
}
const defaultOnCacheKey = (message) => message;
let compileCache = create();
function baseCompile(message, options = {}) {
  let detectError = false;
  const onError = options.onError || defaultOnError;
  options.onError = (err) => {
    detectError = true;
    onError(err);
  };
  return { ...baseCompile$1(message, options), detectError };
}
// @__NO_SIDE_EFFECTS__
function compile(message, context) {
  if (isString(message)) {
    isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: "production" !== "production",
      jit: true
    });
    const msg = format(ast);
    return !detectError ? compileCache[cacheKey] = msg : msg;
  } else {
    const cacheKey = message.cacheKey;
    if (cacheKey) {
      const cached = compileCache[cacheKey];
      if (cached) {
        return cached;
      }
      return compileCache[cacheKey] = format(message);
    } else {
      return format(message);
    }
  }
}
const CoreErrorCodes = {
  INVALID_ARGUMENT: COMPILE_ERROR_CODES_EXTEND_POINT,
  // 17
  INVALID_DATE_ARGUMENT: 18,
  INVALID_ISO_DATE_ARGUMENT: 19,
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
  NOT_SUPPORT_LOCALE_TYPE: 23
};
const CORE_ERROR_CODES_EXTEND_POINT = 24;
function createCoreError(code) {
  return createCompileError(code, null, void 0);
}
function getLocale(context, options) {
  return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
}
let _resolveLocale;
function resolveLocale(locale) {
  if (isString(locale)) {
    return locale;
  } else {
    if (isFunction(locale)) {
      if (locale.resolvedOnce && _resolveLocale != null) {
        return _resolveLocale;
      } else if (locale.constructor.name === "Function") {
        const resolve2 = locale();
        if (isPromise(resolve2)) {
          throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
        }
        return _resolveLocale = resolve2;
      } else {
        throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
      }
    } else {
      throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE);
    }
  }
}
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray(fallback) ? fallback : isObject(fallback) ? Object.keys(fallback) : isString(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString(start) ? start : DEFAULT_LOCALE$1;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults = isArray(fallback) || !isPlainObject(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString(defaults) ? [defaults] : defaults;
    if (isArray(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];
    if (isString(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const pathStateMachine = [];
pathStateMachine[
  0
  /* States.BEFORE_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    0
    /* States.BEFORE_PATH */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  1
  /* States.IN_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1
    /* States.IN_PATH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  2
  /* States.BEFORE_IDENT */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  3
  /* States.IN_IDENT */
] = {
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1,
    1
    /* Actions.PUSH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2,
    1
    /* Actions.PUSH */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    1
    /* Actions.PUSH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7,
    1
    /* Actions.PUSH */
  ]
};
pathStateMachine[
  4
  /* States.IN_SUB_PATH */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ],
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  [
    "]"
    /* PathCharTypes.RIGHT_BRACKET */
  ]: [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code = ch.charCodeAt(0);
  switch (code) {
    case 91:
    // [
    case 93:
    // ]
    case 46:
    // .
    case 34:
    // "
    case 39:
      return ch;
    case 95:
    // _
    case 36:
    // $
    case 45:
      return "i";
    case 9:
    // Tab (HT)
    case 10:
    // Newline (LF)
    case 13:
    // Return (CR)
    case 160:
    // No-break space (NBSP)
    case 65279:
    // Byte Order Mark (BOM)
    case 8232:
    // Line Separator (LS)
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[
    0
    /* Actions.APPEND */
  ] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[
    1
    /* Actions.PUSH */
  ] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[
      0
      /* Actions.APPEND */
    ]();
    subPathDepth++;
  };
  actions[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[
        0
        /* Actions.APPEND */
      ]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[
          1
          /* Actions.PUSH */
        ]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index++;
      newChar = "\\" + nextChar;
      actions[
        0
        /* Actions.APPEND */
      ]();
      return true;
    }
  }
  while (mode !== null) {
    index++;
    c = path[index];
    if (c === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap[
      "l"
      /* PathCharTypes.ELSE */
    ] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i = 0;
  while (i < len) {
    const key = hit[i];
    if (AST_NODE_PROPS_KEYS.includes(key) && isMessageAST(last)) {
      return null;
    }
    const val = last[key];
    if (val === void 0) {
      return null;
    }
    if (isFunction(last)) {
      return null;
    }
    last = val;
    i++;
  }
  return last;
}
const VERSION$1 = "10.0.8";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE$1 = "en-US";
const MISSING_RESOLVE_VALUE = "";
const capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
  return {
    upper: (val, type) => {
      return type === "text" && isString(val) ? val.toUpperCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type) => {
      return type === "text" && isString(val) ? val.toLowerCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type) => {
      return type === "text" && isString(val) ? capitalize(val) : type === "vnode" && isObject(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
    }
  };
}
let _compiler;
function registerMessageCompiler(compiler) {
  _compiler = compiler;
}
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
const setAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ (meta) => {
};
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn;
  const version = isString(options.version) ? options.version : VERSION$1;
  const locale = isString(options.locale) || isFunction(options.locale) ? options.locale : DEFAULT_LOCALE$1;
  const _locale = isFunction(locale) ? DEFAULT_LOCALE$1 : locale;
  const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
  const messages = isPlainObject(options.messages) ? options.messages : createResources(_locale);
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : createResources(_locale);
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : createResources(_locale);
  const modifiers = assign(create(), options.modifiers, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || create();
  const missing = isFunction(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject(options.fallbackContext) ? options.fallbackContext : void 0;
  const internalOptions = options;
  const __datetimeFormatters = isObject(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  return context;
}
const createResources = (locale) => ({ [locale]: create() });
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString(ret) ? ret : key;
  } else {
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
function isAlmostSameLocale(locale, compareLocale) {
  if (locale === compareLocale)
    return false;
  return locale.split("-")[0] === compareLocale.split("-")[0];
}
function isImplicitFallback(targetLocale, locales) {
  const index = locales.indexOf(targetLocale);
  if (index === -1) {
    return false;
  }
  for (let i = index + 1; i < locales.length; i++) {
    if (isAlmostSameLocale(targetLocale, locales[i])) {
      return true;
    }
  }
  return false;
}
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    return new Intl.DateTimeFormat(locale, overrides).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "datetime format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const DATETIME_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  let value;
  if (isString(arg1)) {
    const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches[3] ? matches[3].trim().startsWith("T") ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    return new Intl.NumberFormat(locale, overrides).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "number format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const NUMBER_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join(values);
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index : index;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages) => {
    return messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
  };
  const _list = options.list || [];
  const list = (index) => _list[index];
  const _named = options.named || create();
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key, useLinked) {
    const msg = isFunction(options.messages) ? options.messages(key, !!useLinked) : isObject(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isPlainObject(options.processor) && isFunction(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject(options.processor) && isFunction(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isPlainObject(options.processor) && isString(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type2 = "text";
    let modifier = "";
    if (args.length === 1) {
      if (isObject(arg1)) {
        modifier = arg1.modifier || modifier;
        type2 = arg1.type || type2;
      } else if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
      if (isString(arg2)) {
        type2 = arg2 || type2;
      }
    }
    const ret = message(key, true)(ctx);
    const msg = (
      // The message in vnode resolved with linked are returned as an array by processor.nomalize
      type2 === "vnode" && isArray(ret) && modifier ? ret[0] : ret
    );
    return modifier ? _modifier(modifier)(msg, type2) : msg;
  };
  const ctx = {
    [
      "list"
      /* HelperNameMap.LIST */
    ]: list,
    [
      "named"
      /* HelperNameMap.NAMED */
    ]: named,
    [
      "plural"
      /* HelperNameMap.PLURAL */
    ]: plural,
    [
      "linked"
      /* HelperNameMap.LINKED */
    ]: linked,
    [
      "message"
      /* HelperNameMap.MESSAGE */
    ]: message,
    [
      "type"
      /* HelperNameMap.TYPE */
    ]: type,
    [
      "interpolate"
      /* HelperNameMap.INTERPOLATE */
    ]: interpolate,
    [
      "normalize"
      /* HelperNameMap.NORMALIZE */
    ]: normalize,
    [
      "values"
      /* HelperNameMap.VALUES */
    ]: assign(create(), _list, _named)
  };
  return ctx;
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : null;
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey != null && (isString(defaultMsgOrKey) || isFunction(defaultMsgOrKey));
  const locale = getLocale(context, options);
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages[locale] || create()
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString(format2) || isMessageAST(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) || !isString(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let occurred = false;
  const onError = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  let ret = postTranslation ? postTranslation(messaged, key) : messaged;
  if (escapeParameter && isString(ret)) {
    ret = sanitizeTranslatedHtml(ret);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray(options.list)) {
    options.list = options.list.map((item) => isString(item) ? escapeHtml(item) : item);
  } else if (isObject(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = create();
  let targetLocale;
  let format2 = null;
  const type = "translate";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    message = messages[targetLocale] || create();
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) {
      break;
    }
    if (!isImplicitFallback(targetLocale, locales)) {
      const missingRet = handleMissing(
        context,
        // eslint-disable-line @typescript-eslint/no-explicit-any
        key,
        targetLocale,
        missingWarn,
        type
      );
      if (missingRet !== key) {
        format2 = missingRet;
      }
    }
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = (() => format2);
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  const msg = messageCompiler(format2, getCompileContext(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, onError));
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  const messaged = msg(msgCtx);
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = create();
  if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray(arg2)) {
    options.list = arg2;
  }
  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign(options, arg3);
  }
  return [key, options];
}
function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
  return {
    locale,
    key,
    warnHtmlMessage,
    onError: (err) => {
      onError && onError(err);
      {
        throw err;
      }
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key, useLinked) => {
    let val = resolveValue2(message, key);
    if (val == null && (fallbackContext || useLinked)) {
      const [, , message2] = resolveMessageFormat(
        fallbackContext || context,
        // NOTE: if has fallbackContext, fallback to root, else if use linked, fallback to local context
        key,
        locale,
        fallbackLocale,
        fallbackWarn,
        missingWarn
      );
      val = resolveValue2(message2, key);
    }
    if (isString(val) || isMessageAST(val)) {
      let occurred = false;
      const onError = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, onError);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
const VERSION = "10.0.8";
const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: CORE_ERROR_CODES_EXTEND_POINT,
  // 24
  // legacy module errors
  INVALID_ARGUMENT: 25,
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: 26,
  NOT_INSTALLED: 27,
  // directive module errors
  REQUIRED_VALUE: 28,
  INVALID_VALUE: 29,
  NOT_INSTALLED_WITH_PROVIDE: 31,
  // unexpected error
  UNEXPECTED_ERROR: 32};
function createI18nError(code, ...args) {
  return createCompileError(code, null, void 0);
}
const TranslateVNodeSymbol = /* @__PURE__ */ makeSymbol("__translateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ makeSymbol("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ makeSymbol("__numberParts");
const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
const InejctWithOptionSymbol = /* @__PURE__ */ makeSymbol("__injectWithOption");
const DisposeSymbol = /* @__PURE__ */ makeSymbol("__dispose");
function handleFlatJson(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  if (isMessageAST(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      let hasStringValue = false;
      for (let i = 0; i < lastIndex; i++) {
        if (subKeys[i] === "__proto__") {
          throw new Error(`unsafe key: ${subKeys[i]}`);
        }
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = create();
        }
        if (!isObject(currentObj[subKeys[i]])) {
          hasStringValue = true;
          break;
        }
        currentObj = currentObj[subKeys[i]];
      }
      if (!hasStringValue) {
        if (!isMessageAST(currentObj)) {
          currentObj[subKeys[lastIndex]] = obj[key];
          delete obj[key];
        } else {
          if (!AST_NODE_PROPS_KEYS.includes(subKeys[lastIndex])) {
            delete obj[key];
          }
        }
      }
      if (!isMessageAST(currentObj)) {
        const target = currentObj[subKeys[lastIndex]];
        if (isObject(target)) {
          handleFlatJson(target);
        }
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages, __i18n, messageResolver, flatJson } = options;
  const ret = isPlainObject(messages) ? messages : isArray(__i18n) ? create() : { [locale]: create() };
  if (isArray(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || create();
          deepCopy(resource, ret[locale2]);
        } else {
          deepCopy(resource, ret);
        }
      } else {
        isString(custom) && deepCopy(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(gl, options, componentOptions) {
  let messages = isObject(options.messages) ? options.messages : create();
  if ("__i18nGlobal" in componentOptions) {
    messages = getLocaleMessages(gl.locale.value, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages);
  if (locales.length) {
    locales.forEach((locale) => {
      gl.mergeLocaleMessage(locale, messages[locale]);
    });
  }
  {
    if (isObject(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
const NOOP_RETURN_ARRAY = () => [];
const NOOP_RETURN_FALSE = () => false;
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return ((ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  });
}
const getMetaInfo = /* @__NO_SIDE_EFFECTS__ */ () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}) {
  const { __root, __injectWithOption } = options;
  const _isGlobal = __root === void 0;
  const flatJson = options.flatJson;
  const _ref = shallowRef;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE$1
  );
  const _fallbackLocale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = _ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = _ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = _ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      messageCompiler: options.messageCompiler,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages = computed(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues();
    let ret;
    try {
      if ("production" !== "production" || false) ;
      if (!_isGlobal) {
        _context.fallbackContext = __root ? getFallbackContext() : void 0;
      }
      ret = fn(_context);
    } finally {
      if (!_isGlobal) {
        _context.fallbackContext = void 0;
      }
    }
    if (warnType !== "translate exists" && // for not `te` (e.g `t`)
    isNumber(ret) && ret === NOT_REOSLVED || warnType === "translate exists" && !ret) {
      const [key, arg2] = argumentParser();
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  };
  function t(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => isString(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val));
  }
  function normalize(values) {
    return values.map((val) => isString(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function translateVNode(...args) {
    return wrapWithDeps((context) => {
      let ret;
      const _context2 = context;
      try {
        _context2.processor = processor;
        ret = Reflect.apply(translate, null, [_context2, ...args]);
      } finally {
        _context2.processor = null;
      }
      return ret;
    }, () => parseTranslateArgs(...args), "translate", (root) => root[TranslateVNodeSymbol](...args), (key) => [createTextNode(key)], (val) => isArray(val));
  }
  function numberParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => root[NumberPartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
  }
  function datetimeParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => root[DatetimePartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    return wrapWithDeps(() => {
      if (!key) {
        return false;
      }
      const targetLocale = isString(locale2) ? locale2 : _locale.value;
      const message = getLocaleMessage(targetLocale);
      const resolved = _context.messageResolver(message, key);
      return isMessageAST(resolved) || isMessageFunction(resolved) || isString(resolved);
    }, () => [key], "translate exists", (root) => {
      return Reflect.apply(root.te, root, [key, locale2]);
    }, NOOP_RETURN_FALSE, (val) => isBoolean(val));
  }
  function resolveMessages(key) {
    let messages2 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages2 = messageValue;
        break;
      }
    }
    return messages2;
  }
  function tm(key) {
    const messages2 = resolveMessages(key);
    return messages2 != null ? messages2 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    if (flatJson) {
      const _message = { [locale2]: message };
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
      message = _message[locale2];
    }
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    const _message = { [locale2]: message };
    if (flatJson) {
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
    }
    message = _message[locale2];
    deepCopy(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = format2;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function mergeDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = assign(_datetimeFormats.value[locale2] || {}, format2);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = format2;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  function mergeNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = assign(_numberFormats.value[locale2] || {}, format2);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  composerID++;
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOptionSymbol] = __injectWithOption;
    composer[TranslateVNodeSymbol] = translateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  return composer;
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
    /* ComponentI18nScope */
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current) => {
      return [
        ...slot,
        // prettier-ignore
        ...current.type === Fragment ? current.children : [current]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, create());
  }
}
function getFragmentableTag() {
  return Fragment;
}
const TranslationImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-t",
  props: assign({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      validator: (val) => isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return () => {
      const keys = Object.keys(slots).filter((key) => key !== "_");
      const options = create();
      if (props.locale) {
        options.locale = props.locale;
      }
      if (props.plural !== void 0) {
        options.plural = isString(props.plural) ? +props.plural : props.plural;
      }
      const arg = getInterpolateArg(context, keys);
      const children = i18n[TranslateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = assign(create(), attrs);
      const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
      return h(tag, assignedAttrs, children);
    };
  }
});
const Translation = TranslationImpl;
function isVNode(target) {
  return isArray(target) && !isString(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = create();
    if (props.locale) {
      options.locale = props.locale;
    }
    if (isString(props.format)) {
      options.key = props.format;
    } else if (isObject(props.format)) {
      if (isString(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? assign(create(), options2, { [prop]: props.format[prop] }) : options2;
      }, create());
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (isArray(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type];
        const node = slot ? slot({ [part.type]: part.value, index, parts }) : [part.value];
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index}`;
        }
        return node;
      });
    } else if (isString(parts)) {
      children = [parts];
    }
    const assignedAttrs = assign(create(), attrs);
    const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
const NumberFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-n",
  props: assign({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[NumberPartsSymbol](...args)
    ));
  }
});
const NumberFormat = NumberFormatImpl;
const DatetimeFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-d",
  props: assign({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[DatetimePartsSymbol](...args)
    ));
  }
});
const DatetimeFormat = DatetimeFormatImpl;
function getComposer$1(i18n, instance) {
  const i18nInternal = i18n;
  if (i18n.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
  }
}
function vTDirective(i18n) {
  const _process = (binding) => {
    const { instance, value } = binding;
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$1(i18n, instance.$);
    const parsedValue = parseValue(value);
    return [
      Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
      composer
    ];
  };
  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);
    el.__composer = composer;
    el.textContent = textContent;
  };
  const unregister = (el) => {
    if (el.__composer) {
      el.__composer = void 0;
      delete el.__composer;
    }
  };
  const update = (el, { value }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ]);
    }
  };
  const getSSRProps = (binding) => {
    const [textContent] = _process(binding);
    return { textContent };
  };
  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}
function parseValue(value) {
  if (isString(value)) {
    return { path: value };
  } else if (isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString(locale)) {
    options.locale = locale;
  }
  if (isNumber(choice)) {
    options.plural = choice;
  }
  if (isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app, i18n, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (globalInstall) {
    [Translation.name, "I18nT"].forEach((name) => app.component(name, Translation));
    [NumberFormat.name, "I18nN"].forEach((name) => app.component(name, NumberFormat));
    [DatetimeFormat.name, "I18nD"].forEach((name) => app.component(name, DatetimeFormat));
  }
  {
    app.directive("t", vTDirective(i18n));
  }
}
const I18nInjectionKey = /* @__PURE__ */ makeSymbol("global-vue-i18n");
function createI18n(options = {}, VueI18nLegacy) {
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options);
  const symbol = /* @__PURE__ */ makeSymbol("");
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  const i18n = {
    // mode
    get mode() {
      return "composition";
    },
    // install plugin
    async install(app, ...options2) {
      app.__VUE_I18N_SYMBOL__ = symbol;
      app.provide(app.__VUE_I18N_SYMBOL__, i18n);
      if (isPlainObject(options2[0])) {
        const opts = options2[0];
        i18n.__composerExtend = opts.__composerExtend;
        i18n.__vueI18nExtend = opts.__vueI18nExtend;
      }
      let globalReleaseHandler = null;
      if (__globalInjection) {
        globalReleaseHandler = injectGlobalFields(app, i18n.global);
      }
      {
        apply(app, i18n, ...options2);
      }
      const unmountApp = app.unmount;
      app.unmount = () => {
        globalReleaseHandler && globalReleaseHandler();
        i18n.dispose();
        unmountApp();
      };
    },
    // global accessor
    get global() {
      return __global;
    },
    dispose() {
      globalScope.stop();
    },
    // @internal
    __instances,
    // @internal
    __getInstance,
    // @internal
    __setInstance,
    // @internal
    __deleteInstance
  };
  return i18n;
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSTALLED);
  }
  const i18n = getI18nInstance(instance);
  const gl = getGlobalComposer(i18n);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  if (scope === "global") {
    adjustI18nResources(gl, options, componentOptions);
    return gl;
  }
  if (scope === "parent") {
    let composer2 = getComposer(i18n, instance, options.__useComponent);
    if (composer2 == null) {
      composer2 = gl;
    }
    return composer2;
  }
  const i18nInternal = i18n;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = assign({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (gl) {
      composerOptions.__root = gl;
    }
    composer = createComposer(composerOptions);
    if (i18nInternal.__composerExtend) {
      composer[DisposeSymbol] = i18nInternal.__composerExtend(composer);
    }
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode, VueI18nLegacy) {
  const scope = effectScope();
  const obj = scope.run(() => createComposer(options));
  if (obj == null) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
  }
  return [scope, obj];
}
function getI18nInstance(instance) {
  const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
  if (!i18n) {
    throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE);
  }
  return i18n;
}
function getScope(options, componentOptions) {
  return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n) {
  return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
}
function getComposer(i18n, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current = getParentComponentInstance(target, useComponent);
  while (current != null) {
    const i18nInternal = i18n;
    if (i18n.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    }
    if (composer != null) {
      break;
    }
    if (root === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function getParentComponentInstance(target, useComponent = false) {
  if (target == null) {
    return null;
  }
  return !useComponent ? target.parent : target.vnode.ctx || target.parent;
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm", "te"];
function injectGlobalFields(app, composer) {
  const i18n = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n, prop, wrap);
  });
  app.config.globalProperties.$i18n = i18n;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
  const dispose = () => {
    delete app.config.globalProperties.$i18n;
    globalExportMethods.forEach((method) => {
      delete app.config.globalProperties[`$${method}`];
    });
  };
  return dispose;
}
registerMessageCompiler(compile);
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
function useRouteBaseName() {
  return wrapComposable(getRouteBaseName);
}
function useLocalePath() {
  return wrapComposable(localePath);
}
function useLocaleRoute() {
  return wrapComposable(localeRoute);
}
function useLocaleLocation() {
  return wrapComposable(localeRoute);
}
function useSwitchLocalePath() {
  return wrapComposable(switchLocalePath);
}
const auth_45global = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const supabase2 = useSupabaseClient();
  const { $toast, $i18n } = useNuxtApp();
  const config = /* @__PURE__ */ useRuntimeConfig();
  const localePath2 = useLocalePath();
  const lp = (path, query) => query ? { path: localePath2(path), query } : localePath2(path);
  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;
  const requiresAuthorOrAdmin = to.meta.requiresAuthorOrAdmin;
  const requireAnonymous = to.meta.requireAnonymous;
  const devOnly = to.meta.devOnly;
  const needsAuthGate = requiresAuth || requiresAdmin || requiresAuthorOrAdmin || requireAnonymous;
  if (devOnly && config.public.env !== "development") {
    return navigateTo(lp("/"));
  }
  const isInstallRoute = to.name === "install" || to.path === "/install" || to.path.endsWith("/install") || /(^|\/)install(\/|$)/.test(to.path);
  if (isInstallRoute && to.path !== "/install") {
    return navigateTo({ path: "/install", query: to.query, hash: to.hash });
  }
  function normalizeInstallFlag(raw) {
    if (raw === true || raw === "true" || raw === 1 || raw === "1") return true;
    if (raw && typeof raw === "object" && raw !== null) {
      if (raw.complete === true || raw.complete === "true") return true;
      if (raw.installed === true || raw.installed === "true") return true;
    }
    return false;
  }
  try {
    const url = config.public.supabaseUrl || "";
    const key = config.public.supabaseAnonKey || "";
    const credsMissing = !url || !key || url.includes("placeholder.supabase") || key === "public-anon-key";
    if (credsMissing) {
      console.warn("[install-gate] Supabase credentials missing; skipping gate");
    } else {
      const { data, error } = ([__temp, __restore] = executeAsync(() => supabase2.from("settings").select("value").eq("key", "installation").maybeSingle()), __temp = await __temp, __restore(), __temp);
      if (error) {
        if (/relation .* does not exist|Could not find the table|schema cache/i.test(
          error.message || ""
        )) {
          if (!isInstallRoute) return navigateTo("/install");
        } else {
          console.warn("[install-gate] settings read failed:", error.message);
        }
      } else {
        const installDone = !!data && normalizeInstallFlag(data.value);
        if (!installDone && !isInstallRoute) {
          return navigateTo("/install");
        }
        if (installDone && isInstallRoute) {
          return navigateTo(lp("/"));
        }
      }
    }
  } catch (e) {
    if (e?.message?.includes("JWSError")) {
      return;
    }
    console.warn("[install-gate] unexpected error:", e?.message || e);
  }
  if (needsAuthGate) {
    return;
  }
  const {
    data: { session }
  } = ([__temp, __restore] = executeAsync(() => supabase2.auth.getSession()), __temp = await __temp, __restore(), __temp);
  const user = session?.user;
  if (user && !to.path.includes("/profile")) {
    const { data: prof, error: profErr } = ([__temp, __restore] = executeAsync(() => supabase2.from("profiles").select("username, display_name, role").eq("id", user.id).single()), __temp = await __temp, __restore(), __temp);
    if (!profErr && (!prof?.username || !prof?.display_name)) {
      return navigateTo(lp("/profile", { edit: "true" }));
    }
    if (!profErr && prof?.role === "disabled") {
      [__temp, __restore] = executeAsync(() => supabase2.auth.signOut()), await __temp, __restore();
      return navigateTo(lp("/login"));
    }
  }
  if (requireAnonymous && user) {
    const redirect = typeof to.query.redirect === "string" ? to.query.redirect : "";
    if (redirect.startsWith("/") && !redirect.startsWith("//")) {
      return navigateTo(redirect);
    }
    return navigateTo(lp("/"));
  }
  if (requiresAuth && !user) {
    return navigateTo(lp("/login", { redirect: to.fullPath }));
  }
  if ((requiresAdmin || requiresAuthorOrAdmin) && user) {
    const { data: profile } = ([__temp, __restore] = executeAsync(() => supabase2.from("profiles").select("role").eq("id", user.id).single()), __temp = await __temp, __restore(), __temp);
    if (!profile?.role) return navigateTo(lp("/"));
    if (requiresAdmin && profile.role !== "admin") return navigateTo(lp("/"));
    if (requiresAuthorOrAdmin && !["admin", "author"].includes(profile.role)) {
      return navigateTo(lp("/"));
    }
  }
});
const primary_45locale_45global = /* @__PURE__ */ defineNuxtRouteMiddleware(() => {
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  auth_45global,
  primary_45locale_45global,
  manifest_45route_45rule
];
const namedMiddleware = {};
Object.assign(/* @__PURE__ */ Object.create(null), {});
const pageIslandRoutes = Object.assign(/* @__PURE__ */ Object.create(null), {});
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      const lastTo = to.matched.at(-1)?.components?.default;
      const lastFrom = from.matched.at(-1)?.components?.default;
      if (lastTo === lastFrom) {
        syncCurrentRoute();
        return;
      }
      if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const error = /* @__PURE__ */ useError();
    const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
    if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    const hasDeferredRoute = false;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext && !isServerPage) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray$1(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    if (isServerPage) {
      router.beforeResolve((to) => {
        const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
        const actual = to.matched.find((m) => m.components?.default?.__nuxt_island)?.components?.default;
        if (!expected || expected !== actual?.__nuxt_island) {
          nuxtApp.ssrContext["~renderResponse"] = {
            statusCode: 400,
            statusMessage: "Invalid island request path"
          };
          return false;
        }
      });
    }
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0 && !error.value) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        if (hasDeferredRoute) ;
        else {
          await router.replace({
            ...resolvedInitialRoute,
            force: true
          });
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const ensure_router_link_hVP_wIteVgMAzHd1KDJbRR_OyiXluHJNsPXoW5hTYeo = /* @__PURE__ */ defineNuxtPlugin({
  name: "ensure-router-link",
  enforce: "pre",
  setup(nuxtApp) {
    if (!nuxtApp.vueApp.component("RouterLink")) {
      nuxtApp.vueApp.component("RouterLink", RouterLink);
    }
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const switch_locale_path_ssr_NflG9_QeVcJ1jVig0vCfxB_cZhpEMQ9U2ujRUiYbbVw = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:switch-locale-path-ssr",
  dependsOn: ["i18n:plugin"],
  setup(_nuxt) {
    const nuxt = useNuxtApp(_nuxt._id);
    if (nuxt.$config.public.i18n.experimental.switchLocalePathLinkSSR !== true) return;
    const switchLocalePath2 = useSwitchLocalePath();
    const switchLocalePathLinkWrapperExpr = new RegExp(
      [
        `<!--${SWITCH_LOCALE_PATH_LINK_IDENTIFIER}-\\[(\\w+)\\]-->`,
        `.+?`,
        `<!--/${SWITCH_LOCALE_PATH_LINK_IDENTIFIER}-->`
      ].join(""),
      "g"
    );
    nuxt.hook("app:rendered", (ctx) => {
      if (ctx.renderResult?.html == null) return;
      ctx.renderResult.html = ctx.renderResult.html.replaceAll(
        switchLocalePathLinkWrapperExpr,
        (match, p1) => match.replace(/href="([^"]+)"/, `href="${encodeURI(switchLocalePath2(p1 ?? ""))}"`)
      );
    });
  }
});
const route_locale_detect__HPHJq3Jg7gwhwgKEI8tQavopSAjmrCSPXl9HgL2h9U = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:route-locale-detect",
  dependsOn: ["i18n:plugin"],
  async setup(_nuxt) {
    let __temp, __restore;
    const nuxt = useNuxtApp(_nuxt._id);
    const currentRoute = nuxt.$router.currentRoute;
    async function handleRouteDetect(to) {
      let detected = detectLocale(
        nuxt,
        to,
        nuxt._vueI18n.__localeFromRoute(to),
        unref(nuxt.$i18n.locale),
        nuxt.$i18n.getLocaleCookie()
      );
      if (nuxt._vueI18n.__firstAccess) {
        nuxt._vueI18n.__setLocale(detected);
        const fallbackLocales = makeFallbackLocaleCodes(unref(nuxt._vueI18n.global.fallbackLocale), [detected]);
        await Promise.all(fallbackLocales.map((x) => nuxt.$i18n.loadLocaleMessages(x)));
        await nuxt.$i18n.loadLocaleMessages(detected);
      }
      const modified = await nuxt.runWithContext(() => loadAndSetLocale(nuxt, detected, nuxt._vueI18n.__firstAccess));
      if (modified) {
        detected = unref(nuxt.$i18n.locale);
      }
      return detected;
    }
    [__temp, __restore] = executeAsync(() => handleRouteDetect(currentRoute.value)), await __temp, __restore();
    const localeChangeMiddleware = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
      let __temp2, __restore2;
      const locale = ([__temp2, __restore2] = executeAsync(() => nuxt.runWithContext(() => handleRouteDetect(to))), __temp2 = await __temp2, __restore2(), __temp2);
      const redirectPath = ([__temp2, __restore2] = executeAsync(() => nuxt.runWithContext(
        () => detectRedirect({ to, nuxtApp: nuxt, from, locale, routeLocale: nuxt._vueI18n.__localeFromRoute(to) }, true)
      )), __temp2 = await __temp2, __restore2(), __temp2);
      nuxt._vueI18n.__firstAccess = false;
      return [__temp2, __restore2] = executeAsync(() => nuxt.runWithContext(() => navigate({ nuxt, redirectPath, locale, route: to }))), __temp2 = await __temp2, __restore2(), __temp2;
    });
    addRouteMiddleware("locale-changing", localeChangeMiddleware, { global: true });
  }
});
function extendI18n(i18n, { extendComposer, extendComposerInstance }) {
  const scope = effectScope();
  const installI18n = i18n.install.bind(i18n);
  i18n.install = (app, ...options) => {
    const pluginOptions = assign({}, options[0]);
    pluginOptions.__composerExtend = (c) => {
      extendComposerInstance(c, getComposer$3(i18n));
      return () => {
      };
    };
    if (i18n.mode === "legacy") {
      pluginOptions.__vueI18nExtend = (vueI18n) => {
        extendComposerInstance(vueI18n, getComposer$3(vueI18n));
        return () => {
        };
      };
    }
    Reflect.apply(installI18n, i18n, [app, pluginOptions]);
    const globalComposer = getComposer$3(i18n);
    scope.run(() => {
      extendComposer(globalComposer);
      if (i18n.mode === "legacy" && isVueI18n(i18n.global)) {
        extendComposerInstance(i18n.global, getComposer$3(i18n.global));
      }
    });
    if (i18n.mode === "composition" && app.config.globalProperties.$i18n != null) {
      extendComposerInstance(app.config.globalProperties.$i18n, globalComposer);
    }
    if (app.unmount) {
      const unmountApp = app.unmount.bind(app);
      app.unmount = () => {
        scope.stop();
        unmountApp();
      };
    }
  };
}
const i18n_EI7LsD1KYQADczz5hrChviGQCdVM8yUkvFEZLJpmnvM = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin",
  parallel: parallelPlugin,
  async setup(_nuxt) {
    let __temp, __restore;
    const nuxt = useNuxtApp(_nuxt._id);
    Object.defineProperty(_nuxt.versions, "nuxtI18n", { get: () => "9.5.6" });
    const _runtimeI18n = nuxt.$config.public.i18n;
    const defaultLocaleDomain = getDefaultLocaleForDomain(_runtimeI18n);
    setupMultiDomainLocales(_runtimeI18n, defaultLocaleDomain);
    nuxt.$config.public.i18n.defaultLocale = defaultLocaleDomain;
    const runtimeI18n = {
      ..._runtimeI18n,
      defaultLocale: defaultLocaleDomain,
      baseUrl: extendBaseUrl(nuxt)
    };
    const vueI18nOptions = ([__temp, __restore] = executeAsync(() => loadVueI18nOptions(vueI18nConfigs, useNuxtApp())), __temp = await __temp, __restore(), __temp);
    vueI18nOptions.messages ||= {};
    vueI18nOptions.fallbackLocale ??= false;
    if (defaultLocaleDomain) {
      vueI18nOptions.locale = defaultLocaleDomain;
    }
    for (const l of localeCodes) {
      vueI18nOptions.messages[l] ??= {};
    }
    const i18n = createI18n(vueI18nOptions);
    nuxt._vueI18n = i18n;
    i18n.__localeFromRoute = createLocaleFromRouteGetter();
    i18n.__firstAccess = true;
    i18n.__setLocale = (locale) => {
      const i = getI18nTarget(i18n);
      if (isRef(i.locale)) {
        i.locale.value = locale;
      } else {
        i.locale = locale;
      }
    };
    const localeCookie = createI18nCookie();
    const detectBrowserOptions = runtimeDetectBrowserLanguage();
    extendI18n(i18n, {
      extendComposer(composer) {
        const _locales = ref(runtimeI18n.locales);
        composer.locales = computed(() => _locales.value);
        const _localeCodes = ref(localeCodes);
        composer.localeCodes = computed(() => _localeCodes.value);
        const _baseUrl = ref(runtimeI18n.baseUrl());
        composer.baseUrl = computed(() => _baseUrl.value);
        composer.strategy = runtimeI18n.strategy;
        composer.localeProperties = computed(
          () => normalizedLocales.find((l) => l.code === composer.locale.value) || { code: composer.locale.value }
        );
        composer.setLocale = async (locale) => {
          await loadAndSetLocale(nuxt, locale, i18n.__firstAccess);
          if (composer.strategy === "no_prefix" || false) {
            await composer.loadLocaleMessages(locale);
            i18n.__setLocale(locale);
            return;
          }
          const route = nuxt.$router.currentRoute.value;
          const redirectPath = await nuxt.runWithContext(
            () => detectRedirect({ to: route, nuxtApp: nuxt, locale, routeLocale: i18n.__localeFromRoute(route) })
          );
          await nuxt.runWithContext(() => navigate({ nuxt, redirectPath, locale, route }, true));
        };
        composer.loadLocaleMessages = async (locale) => await loadLocale(locale, localeLoaders, composer.mergeLocaleMessage.bind(composer), nuxt);
        composer.differentDomains = runtimeI18n.differentDomains;
        composer.defaultLocale = runtimeI18n.defaultLocale;
        composer.getBrowserLocale = () => getBrowserLocale();
        composer.getLocaleCookie = () => getLocaleCookie(localeCookie, detectBrowserOptions, composer.defaultLocale);
        composer.setLocaleCookie = (locale) => {
          if (!detectBrowserOptions || !detectBrowserOptions.useCookie) return;
          localeCookie.value = locale;
        };
        composer.onBeforeLanguageSwitch = (oldLocale, newLocale, initialSetup, context) => nuxt.callHook("i18n:beforeLocaleSwitch", {
          oldLocale,
          newLocale,
          initialSetup,
          context
        });
        composer.onLanguageSwitched = (oldLocale, newLocale) => nuxt.callHook("i18n:localeSwitched", { oldLocale, newLocale });
        composer.finalizePendingLocaleChange = async () => {
          if (!i18n.__pendingLocale) return;
          i18n.__setLocale(i18n.__pendingLocale);
          i18n.__resolvePendingLocalePromise?.();
          i18n.__pendingLocale = void 0;
        };
        composer.waitForPendingLocaleChange = async () => {
          if (i18n.__pendingLocale && i18n.__pendingLocalePromise) {
            await i18n.__pendingLocalePromise;
          }
        };
      },
      extendComposerInstance(instance, c) {
        const props = [
          ["locales", () => c.locales],
          ["localeCodes", () => c.localeCodes],
          ["baseUrl", () => c.baseUrl],
          ["strategy", () => c.strategy],
          ["localeProperties", () => c.localeProperties],
          ["setLocale", () => async (locale) => Reflect.apply(c.setLocale, c, [locale])],
          ["loadLocaleMessages", () => async (locale) => Reflect.apply(c.loadLocaleMessages, c, [locale])],
          ["differentDomains", () => c.differentDomains],
          ["defaultLocale", () => c.defaultLocale],
          ["getBrowserLocale", () => () => Reflect.apply(c.getBrowserLocale, c, [])],
          ["getLocaleCookie", () => () => Reflect.apply(c.getLocaleCookie, c, [])],
          ["setLocaleCookie", () => (locale) => Reflect.apply(c.setLocaleCookie, c, [locale])],
          [
            "onBeforeLanguageSwitch",
            () => (oldLocale, newLocale, initialSetup, context) => Reflect.apply(c.onBeforeLanguageSwitch, c, [oldLocale, newLocale, initialSetup, context])
          ],
          [
            "onLanguageSwitched",
            () => (oldLocale, newLocale) => Reflect.apply(c.onLanguageSwitched, c, [oldLocale, newLocale])
          ],
          ["finalizePendingLocaleChange", () => () => Reflect.apply(c.finalizePendingLocaleChange, c, [])],
          ["waitForPendingLocaleChange", () => () => Reflect.apply(c.waitForPendingLocaleChange, c, [])]
        ];
        for (const [key, get] of props) {
          Object.defineProperty(instance, key, { get });
        }
      }
    });
    nuxt.vueApp.use(i18n);
    Object.defineProperty(nuxt, "$i18n", { get: () => getI18nTarget(i18n) });
    return {
      provide: {
        /**
         * TODO: remove type assertions while type narrowing based on generated types
         */
        localeHead: wrapComposable(localeHead),
        localePath: useLocalePath(),
        localeRoute: useLocaleRoute(),
        getRouteBaseName: useRouteBaseName(),
        switchLocalePath: useSwitchLocalePath(),
        // TODO: remove in v10
        resolveRoute: wrapComposable(resolveRoute),
        // TODO: remove in v10
        localeLocation: useLocaleLocation()
      }
    };
  }
});
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const locale_aware_router_yclislyGP0IShjdtyY35jxjgSGM_X99l_Tot7kR5C1g = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const i18n = nuxtApp.$i18n;
  if (!i18n) return;
  function defaultLocale() {
    return unref(i18n.defaultLocale) || "en";
  }
  function localeCodes2() {
    const list = unref(i18n.locales) || [];
    return list.map((l) => typeof l === "string" ? l : l.code).filter(Boolean);
  }
  function currentLocale() {
    return unref(i18n.locale) || defaultLocale();
  }
  function stripLocalePrefix2(path) {
    const def = defaultLocale();
    for (const code of localeCodes2()) {
      if (code === def) continue;
      if (path === `/${code}`) return "/";
      if (path.startsWith(`/${code}/`)) return path.slice(code.length + 1);
    }
    return path;
  }
  function alreadyLocalized(path) {
    if (!path || typeof path !== "string" || !path.startsWith("/")) return true;
    const def = defaultLocale();
    return localeCodes2().filter((c) => c !== def).some((code) => path === `/${code}` || path.startsWith(`/${code}/`));
  }
  function localizePath2(path) {
    if (!path || typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
      return path;
    }
    if (/\.[a-z0-9]{1,8}(?:\?.*)?$/i.test(path)) {
      return path;
    }
    if (path === "/install" || path.startsWith("/install/") || path.startsWith("/install?") || path.startsWith("/install#")) {
      return path;
    }
    const stripped = stripLocalePrefix2(path);
    if (stripped === "/install" || stripped.startsWith("/install/") || stripped.startsWith("/install?")) {
      return stripped;
    }
    if (alreadyLocalized(path)) return path;
    const locale = currentLocale();
    const def = defaultLocale();
    if (locale === def) return path;
    const bare = stripLocalePrefix2(path);
    return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
  }
  function localizeTo(to) {
    if (to == null) return to;
    if (typeof to === "string") return localizePath2(to);
    if (typeof to === "object") {
      if (to.name != null) return to;
      if (typeof to.path === "string" && to.path.startsWith("/")) {
        return { ...to, path: localizePath2(to.path) };
      }
    }
    return to;
  }
  const originalPush = router.push.bind(router);
  const originalReplace = router.replace.bind(router);
  router.push = (to, ...args) => originalPush(localizeTo(to), ...args);
  router.replace = (to, ...args) => originalReplace(localizeTo(to), ...args);
});
const DEFAULT_LOCALE = "en";
const KNOWN_LOCALES = ["en", "ku", "ar", "es", "fr", "de"];
function normalizeSiteOrigin(url = "") {
  return String(url || "").replace(/\/$/, "");
}
function stripLocalePrefix(pathname = "/", locales = KNOWN_LOCALES) {
  const path = String(pathname || "/").replace(/\/+/g, "/") || "/";
  const codes = (locales || KNOWN_LOCALES).filter((c) => c && c !== DEFAULT_LOCALE);
  for (const code of codes) {
    if (path === `/${code}`) return "/";
    if (path.startsWith(`/${code}/`)) {
      const rest = path.slice(code.length + 1);
      return rest.startsWith("/") ? rest : `/${rest}`;
    }
  }
  return path === "" ? "/" : path;
}
function localizePath(pathname = "/", locale = DEFAULT_LOCALE, defaultLocale = DEFAULT_LOCALE) {
  const bare = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalized = bare.replace(/\/+/g, "/") || "/";
  if (!locale || locale === defaultLocale) {
    return normalized === "/" ? "/" : normalized.replace(/\/$/, "") || "/";
  }
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`.replace(/\/$/, "");
}
function buildHreflangs(canonical, locale = DEFAULT_LOCALE, options = {}) {
  const baseUrl = normalizeSiteOrigin(options.baseUrl || "");
  const locales = Array.isArray(options.locales) && options.locales.length ? options.locales : KNOWN_LOCALES;
  const defaultLocale = options.defaultLocale || DEFAULT_LOCALE;
  let path = options.path;
  if (!baseUrl || path == null) return [];
  const bare = stripLocalePrefix(path, locales);
  const out = [];
  for (const code of locales) {
    const localized = localizePath(bare, code, defaultLocale);
    out.push({
      lang: code,
      href: `${baseUrl}${localized === "/" ? "/" : localized}`
    });
  }
  const defaultHref = `${baseUrl}${localizePath(bare, defaultLocale, defaultLocale) === "/" ? "/" : localizePath(bare, defaultLocale, defaultLocale)}`;
  out.push({ lang: "x-default", href: defaultHref });
  return out;
}
function robotsForClientPath(path = "/") {
  const raw = path.replace(/\/+$/, "") || "/";
  const p = stripLocalePrefix(raw);
  const noindex = [
    "/dashboard",
    "/profile",
    "/login",
    "/signup",
    "/install",
    "/change-password",
    "/test"
  ];
  if (noindex.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))) {
    return "noindex, nofollow";
  }
  return "index, follow";
}
function twitterHandleFromSocialLinks(socialLinks2 = []) {
  if (!Array.isArray(socialLinks2)) return null;
  for (const link of socialLinks2) {
    const label = String(link?.label || "").toLowerCase();
    const icon = String(link?.icon || "").toLowerCase();
    const url = String(link?.url || "");
    const isTwitter = /twitter|\bx\b/.test(label) || /twitter|(^|:)x($|:)/.test(icon) || /(?:twitter\.com|x\.com)/i.test(url);
    if (!isTwitter || !url) continue;
    const handle = extractTwitterHandleFromUrl(url);
    if (handle) return handle;
  }
  return null;
}
function resolveTwitterSite({
  twitterHandle: twitterHandle2 = null,
  socialLinks: socialLinks2 = [],
  envHandle = null
} = {}) {
  const candidates = [
    twitterHandle2,
    twitterHandleFromSocialLinks(socialLinks2),
    envHandle
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    const cleaned = String(raw).trim();
    if (!cleaned) continue;
    if (/^https?:\/\//i.test(cleaned) || /(?:twitter\.com|x\.com)/i.test(cleaned)) {
      const fromUrl = extractTwitterHandleFromUrl(cleaned);
      if (fromUrl) return fromUrl;
      continue;
    }
    const handle = cleaned.replace(/^@/, "").replace(/\s+/g, "");
    if (/^[\w]{1,15}$/.test(handle)) return `@${handle}`;
  }
  return null;
}
function extractTwitterHandleFromUrl(url) {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (!/(^|\.)(twitter\.com|x\.com)$/i.test(u.hostname)) return null;
    const screenName = u.searchParams.get("screen_name");
    if (screenName) return `@${screenName.replace(/^@/, "")}`;
    const parts = u.pathname.split("/").filter(Boolean);
    if (!parts.length) return null;
    const skip = /* @__PURE__ */ new Set([
      "intent",
      "share",
      "i",
      "home",
      "explore",
      "search",
      "hashtag",
      "settings",
      "compose",
      "messages",
      "notifications"
    ]);
    const first = parts[0];
    if (skip.has(first.toLowerCase())) return null;
    return `@${first.replace(/^@/, "")}`;
  } catch (_) {
    const m = url.match(/(?:twitter\.com|x\.com)\/(@?[\w]+)/i);
    if (m?.[1] && !/^(intent|share|i|home)$/i.test(m[1])) {
      return `@${m[1].replace(/^@/, "")}`;
    }
  }
  return null;
}
function absoluteAssetUrl(url, origin = "") {
  if (!url) return null;
  const value = String(url).trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (!origin) return value;
  return value.startsWith("/") ? `${origin.replace(/\/$/, "")}${value}` : `${origin.replace(/\/$/, "")}/${value}`;
}
function resolveSeoImage(preferred, branding, baseUrl) {
  const base = baseUrl ? String(baseUrl).replace(/\/$/, "") : "";
  const candidates = [
    preferred,
    branding?.ogImageUrl,
    branding?.lightLogoUrl,
    branding?.darkLogoUrl,
    branding?.faviconUrl,
    base ? `${base}/og-default.png` : "/og-default.png",
    base ? `${base}/favicon.png` : "/favicon.png"
  ].filter(Boolean);
  for (const raw of candidates) {
    const value = String(raw).trim();
    if (!value) continue;
    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith("//")) return `https:${value}`;
    if (base) {
      return value.startsWith("/") ? `${base}${value}` : `${base}/${value}`;
    }
    return value;
  }
  return null;
}
const robots_meta_wtrJrtW6xVUMuVseqALK4rcGlQCJtQ9HbpRLvyAs7jw = /* @__PURE__ */ defineNuxtPlugin(() => {
  const route = useRoute();
  useHead(() => ({
    meta: [
      {
        name: "robots",
        content: robotsForClientPath(String(route.path || "/")),
        key: "robots"
      },
      {
        name: "googlebot",
        content: robotsForClientPath(String(route.path || "/")),
        key: "googlebot"
      }
    ]
  }));
});
const ssg_detect_IpHCGcQQ_IR5Rl99qyukWoMA9fJGfuTYyoksTzy81cs = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:ssg-detect",
  dependsOn: ["i18n:plugin", "i18n:plugin:route-locale-detect"],
  enforce: "post",
  setup(_nuxt) {
    useNuxtApp(_nuxt._id);
    return;
  }
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  ensure_router_link_hVP_wIteVgMAzHd1KDJbRR_OyiXluHJNsPXoW5hTYeo,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  switch_locale_path_ssr_NflG9_QeVcJ1jVig0vCfxB_cZhpEMQ9U2ujRUiYbbVw,
  route_locale_detect__HPHJq3Jg7gwhwgKEI8tQavopSAjmrCSPXl9HgL2h9U,
  i18n_EI7LsD1KYQADczz5hrChviGQCdVM8yUkvFEZLJpmnvM,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  locale_aware_router_yclislyGP0IShjdtyY35jxjgSGM_X99l_Tot7kR5C1g,
  robots_meta_wtrJrtW6xVUMuVseqALK4rcGlQCJtQ9HbpRLvyAs7jw,
  ssg_detect_IpHCGcQQ_IR5Rl99qyukWoMA9fJGfuTYyoksTzy81cs
];
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
let _client = null;
function resolveCredentials() {
  let url = "";
  let key = "";
  try {
    const config = /* @__PURE__ */ useRuntimeConfig();
    url = config.public.supabaseUrl || "";
    key = config.public.supabaseAnonKey || "";
  } catch {
  }
  if (!url || !key) {
    const env = getRuntimeEnvSync();
    url = url || env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    key = key || env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  }
  if (!url || !key) {
    console.warn("[pluma] Supabase credentials missing — using placeholders");
    url = "https://placeholder.supabase.co";
    key = "public-anon-key";
  }
  return { url, key };
}
function getSupabase() {
  if (_client) return _client;
  const { url, key } = resolveCredentials();
  _client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  return _client;
}
const supabase = new Proxy(
  {},
  {
    get(_t, prop) {
      const client = getSupabase();
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    }
  }
);
const useThemeStore = defineStore("theme", () => {
  const themeCookie = useCookie("pluma_theme", {
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    default: () => ""
  });
  const initial = themeCookie.value === "dark" || themeCookie.value === "light" ? themeCookie.value : "light";
  const theme = ref(initial);
  function persist(val) {
    themeCookie.value = val;
  }
  watch(theme, (val) => {
    return;
  });
  function syncFromClientStorage() {
    persist(theme.value);
  }
  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
  }
  return { theme, toggleTheme, syncFromClientStorage };
});
const _sfc_main$9 = {
  __name: "UserDropdown",
  __ssrInlineRender: true,
  props: {
    user: Object,
    avatarUrl: String
  },
  setup(__props) {
    const { t } = useI18n();
    const localePath2 = useLocalePath();
    const props = __props;
    const open = ref(false);
    const router = useRouter$1();
    const displayName = computed(
      () => props.user?.display_name || props.user?.username || t("nav.guest")
    );
    const roleInfo = computed(() => {
      const role = props.user?.role || (props.user ? "reader" : "guest");
      switch (role) {
        case "admin":
          return {
            label: t("roles.admin"),
            icon: "mdi:shield-crown-outline",
            classes: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
          };
        case "author":
          return {
            label: t("roles.author"),
            icon: "mdi:pen",
            classes: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
          };
        case "reader":
          return {
            label: t("roles.reader"),
            icon: "mdi:book-open-page-variant",
            classes: "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
          };
        default:
          return {
            label: t("roles.guest"),
            icon: "mdi:account-outline",
            classes: "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
          };
      }
    });
    function go(path) {
      open.value = false;
      router.push(localePath2(path));
    }
    const logout = async () => {
      await supabase.auth.signOut();
      (void 0).location.href = localePath2("/");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuRoot), mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DropdownMenuTrigger), {
              class: "inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 group",
              "aria-label": unref(t)("nav.profile")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(AvatarRoot), { class: "w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.avatarUrl) {
                          _push4(ssrRenderComponent(unref(AvatarImage), {
                            src: __props.avatarUrl,
                            alt: "User Avatar",
                            class: "w-full h-full object-cover"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(unref(AvatarFallback), { class: "w-full h-full flex items-center justify-center text-gray-500 text-sm" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Icon), {
                                icon: "mdi:account",
                                class: "text-lg"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Icon), {
                                  icon: "mdi:account",
                                  class: "text-lg"
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          __props.avatarUrl ? (openBlock(), createBlock(unref(AvatarImage), {
                            key: 0,
                            src: __props.avatarUrl,
                            alt: "User Avatar",
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src"])) : createCommentVNode("", true),
                          createVNode(unref(AvatarFallback), { class: "w-full h-full flex items-center justify-center text-gray-500 text-sm" }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), {
                                icon: "mdi:account",
                                class: "text-lg"
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span class="max-w-[90px] truncate font-medium"${_scopeId2}>${ssrInterpolate(displayName.value)}</span>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:chevron-down",
                    class: "text-lg opacity-60 group-hover:opacity-80 transition"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(AvatarRoot), { class: "w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600" }, {
                      default: withCtx(() => [
                        __props.avatarUrl ? (openBlock(), createBlock(unref(AvatarImage), {
                          key: 0,
                          src: __props.avatarUrl,
                          alt: "User Avatar",
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src"])) : createCommentVNode("", true),
                        createVNode(unref(AvatarFallback), { class: "w-full h-full flex items-center justify-center text-gray-500 text-sm" }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), {
                              icon: "mdi:account",
                              class: "text-lg"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("span", { class: "max-w-[90px] truncate font-medium" }, toDisplayString$1(displayName.value), 1),
                    createVNode(unref(Icon), {
                      icon: "mdi:chevron-down",
                      class: "text-lg opacity-60 group-hover:opacity-80 transition"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(DropdownMenuPortal), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(DropdownMenuContent), {
                    class: "min-w-[240px] p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/50 shadow-lg focus:outline-none text-sm origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade",
                    "side-offset": 8,
                    align: "end"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="px-3 pt-2 pb-3 flex items-center gap-3"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(AvatarRoot), { class: "w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (__props.avatarUrl) {
                                _push5(ssrRenderComponent(unref(AvatarImage), {
                                  src: __props.avatarUrl,
                                  alt: displayName.value,
                                  class: "w-full h-full object-cover"
                                }, null, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(ssrRenderComponent(unref(AvatarFallback), { class: "w-full h-full flex items-center justify-center text-gray-500" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Icon), {
                                      icon: "mdi:account",
                                      class: "text-xl"
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Icon), {
                                        icon: "mdi:account",
                                        class: "text-xl"
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                __props.avatarUrl ? (openBlock(), createBlock(unref(AvatarImage), {
                                  key: 0,
                                  src: __props.avatarUrl,
                                  alt: displayName.value,
                                  class: "w-full h-full object-cover"
                                }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                                createVNode(unref(AvatarFallback), { class: "w-full h-full flex items-center justify-center text-gray-500" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Icon), {
                                      icon: "mdi:account",
                                      class: "text-xl"
                                    })
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div class="flex-1 min-w-0"${_scopeId3}><p class="text-gray-900 dark:text-gray-100 font-medium truncate"${_scopeId3}>${ssrInterpolate(displayName.value)}</p><div class="mt-1 flex flex-wrap items-center gap-1.5"${_scopeId3}><span class="${ssrRenderClass(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide " + roleInfo.value.classes
                        )}"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Icon), {
                          icon: roleInfo.value.icon,
                          class: "text-xs"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(roleInfo.value.label)}</span></div></div></div>`);
                        _push4(ssrRenderComponent(unref(DropdownMenuSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }, null, _parent4, _scopeId3));
                        if (__props.user) {
                          _push4(`<!--[-->`);
                          _push4(ssrRenderComponent(unref(DropdownMenuItem), {
                            onSelect: ($event) => go("/profile"),
                            class: "menu-item"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Icon), {
                                  icon: "mdi:account-edit",
                                  class: "text-base"
                                }, null, _parent5, _scopeId4));
                                _push5(`<span${_scopeId4}>${ssrInterpolate(unref(t)("nav.profile"))}</span>`);
                              } else {
                                return [
                                  createVNode(unref(Icon), {
                                    icon: "mdi:account-edit",
                                    class: "text-base"
                                  }),
                                  createVNode("span", null, toDisplayString$1(unref(t)("nav.profile")), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(DropdownMenuItem), {
                            onSelect: ($event) => go("/change-password"),
                            class: "menu-item"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Icon), {
                                  icon: "mdi:lock-reset",
                                  class: "text-base"
                                }, null, _parent5, _scopeId4));
                                _push5(`<span${_scopeId4}>${ssrInterpolate(unref(t)("nav.changePassword"))}</span>`);
                              } else {
                                return [
                                  createVNode(unref(Icon), {
                                    icon: "mdi:lock-reset",
                                    class: "text-base"
                                  }),
                                  createVNode("span", null, toDisplayString$1(unref(t)("nav.changePassword")), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          if (__props.user.role === "admin" || __props.user.role === "author") {
                            _push4(ssrRenderComponent(unref(DropdownMenuItem), {
                              onSelect: ($event) => go("/dashboard"),
                              class: "menu-item"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(Icon), {
                                    icon: "mdi:view-dashboard-outline",
                                    class: "text-base"
                                  }, null, _parent5, _scopeId4));
                                  _push5(`<span${_scopeId4}>${ssrInterpolate(unref(t)("nav.dashboard"))}</span>`);
                                } else {
                                  return [
                                    createVNode(unref(Icon), {
                                      icon: "mdi:view-dashboard-outline",
                                      class: "text-base"
                                    }),
                                    createVNode("span", null, toDisplayString$1(unref(t)("nav.dashboard")), 1)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(ssrRenderComponent(unref(DropdownMenuSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(DropdownMenuItem), {
                            onSelect: logout,
                            class: "menu-item text-red-600 dark:text-red-400 data-[highlighted]:bg-red-100 dark:data-[highlighted]:bg-red-900/40"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Icon), {
                                  icon: "mdi:logout",
                                  class: "text-base"
                                }, null, _parent5, _scopeId4));
                                _push5(`<span${_scopeId4}>${ssrInterpolate(unref(t)("nav.logout"))}</span>`);
                              } else {
                                return [
                                  createVNode(unref(Icon), {
                                    icon: "mdi:logout",
                                    class: "text-base"
                                  }),
                                  createVNode("span", null, toDisplayString$1(unref(t)("nav.logout")), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--]-->`);
                        } else {
                          _push4(`<!--[-->`);
                          _push4(ssrRenderComponent(unref(DropdownMenuItem), {
                            onSelect: ($event) => go("/login"),
                            class: "menu-item"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Icon), {
                                  icon: "mdi:login",
                                  class: "text-base"
                                }, null, _parent5, _scopeId4));
                                _push5(`<span${_scopeId4}>${ssrInterpolate(unref(t)("nav.login"))}</span>`);
                              } else {
                                return [
                                  createVNode(unref(Icon), {
                                    icon: "mdi:login",
                                    class: "text-base"
                                  }),
                                  createVNode("span", null, toDisplayString$1(unref(t)("nav.login")), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(DropdownMenuItem), {
                            onSelect: ($event) => go("/signup"),
                            class: "menu-item"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Icon), {
                                  icon: "mdi:account-plus",
                                  class: "text-base"
                                }, null, _parent5, _scopeId4));
                                _push5(`<span${_scopeId4}>${ssrInterpolate(unref(t)("nav.signup"))}</span>`);
                              } else {
                                return [
                                  createVNode(unref(Icon), {
                                    icon: "mdi:account-plus",
                                    class: "text-base"
                                  }),
                                  createVNode("span", null, toDisplayString$1(unref(t)("nav.signup")), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<!--]-->`);
                        }
                        _push4(ssrRenderComponent(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("div", { class: "px-3 pt-2 pb-3 flex items-center gap-3" }, [
                            createVNode(unref(AvatarRoot), { class: "w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600" }, {
                              default: withCtx(() => [
                                __props.avatarUrl ? (openBlock(), createBlock(unref(AvatarImage), {
                                  key: 0,
                                  src: __props.avatarUrl,
                                  alt: displayName.value,
                                  class: "w-full h-full object-cover"
                                }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                                createVNode(unref(AvatarFallback), { class: "w-full h-full flex items-center justify-center text-gray-500" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Icon), {
                                      icon: "mdi:account",
                                      class: "text-xl"
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("div", { class: "flex-1 min-w-0" }, [
                              createVNode("p", { class: "text-gray-900 dark:text-gray-100 font-medium truncate" }, toDisplayString$1(displayName.value), 1),
                              createVNode("div", { class: "mt-1 flex flex-wrap items-center gap-1.5" }, [
                                createVNode("span", {
                                  class: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide " + roleInfo.value.classes
                                }, [
                                  createVNode(unref(Icon), {
                                    icon: roleInfo.value.icon,
                                    class: "text-xs"
                                  }, null, 8, ["icon"]),
                                  createTextVNode(" " + toDisplayString$1(roleInfo.value.label), 1)
                                ], 2)
                              ])
                            ])
                          ]),
                          createVNode(unref(DropdownMenuSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                          __props.user ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createVNode(unref(DropdownMenuItem), {
                              onSelect: ($event) => go("/profile"),
                              class: "menu-item"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), {
                                  icon: "mdi:account-edit",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString$1(unref(t)("nav.profile")), 1)
                              ]),
                              _: 1
                            }, 8, ["onSelect"]),
                            createVNode(unref(DropdownMenuItem), {
                              onSelect: ($event) => go("/change-password"),
                              class: "menu-item"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), {
                                  icon: "mdi:lock-reset",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString$1(unref(t)("nav.changePassword")), 1)
                              ]),
                              _: 1
                            }, 8, ["onSelect"]),
                            __props.user.role === "admin" || __props.user.role === "author" ? (openBlock(), createBlock(unref(DropdownMenuItem), {
                              key: 0,
                              onSelect: ($event) => go("/dashboard"),
                              class: "menu-item"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), {
                                  icon: "mdi:view-dashboard-outline",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString$1(unref(t)("nav.dashboard")), 1)
                              ]),
                              _: 1
                            }, 8, ["onSelect"])) : createCommentVNode("", true),
                            createVNode(unref(DropdownMenuSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                            createVNode(unref(DropdownMenuItem), {
                              onSelect: logout,
                              class: "menu-item text-red-600 dark:text-red-400 data-[highlighted]:bg-red-100 dark:data-[highlighted]:bg-red-900/40"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), {
                                  icon: "mdi:logout",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString$1(unref(t)("nav.logout")), 1)
                              ]),
                              _: 1
                            })
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createVNode(unref(DropdownMenuItem), {
                              onSelect: ($event) => go("/login"),
                              class: "menu-item"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), {
                                  icon: "mdi:login",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString$1(unref(t)("nav.login")), 1)
                              ]),
                              _: 1
                            }, 8, ["onSelect"]),
                            createVNode(unref(DropdownMenuItem), {
                              onSelect: ($event) => go("/signup"),
                              class: "menu-item"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), {
                                  icon: "mdi:account-plus",
                                  class: "text-base"
                                }),
                                createVNode("span", null, toDisplayString$1(unref(t)("nav.signup")), 1)
                              ]),
                              _: 1
                            }, 8, ["onSelect"])
                          ], 64)),
                          createVNode(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(DropdownMenuContent), {
                      class: "min-w-[240px] p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/50 shadow-lg focus:outline-none text-sm origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade",
                      "side-offset": 8,
                      align: "end"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "px-3 pt-2 pb-3 flex items-center gap-3" }, [
                          createVNode(unref(AvatarRoot), { class: "w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600" }, {
                            default: withCtx(() => [
                              __props.avatarUrl ? (openBlock(), createBlock(unref(AvatarImage), {
                                key: 0,
                                src: __props.avatarUrl,
                                alt: displayName.value,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                              createVNode(unref(AvatarFallback), { class: "w-full h-full flex items-center justify-center text-gray-500" }, {
                                default: withCtx(() => [
                                  createVNode(unref(Icon), {
                                    icon: "mdi:account",
                                    class: "text-xl"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("p", { class: "text-gray-900 dark:text-gray-100 font-medium truncate" }, toDisplayString$1(displayName.value), 1),
                            createVNode("div", { class: "mt-1 flex flex-wrap items-center gap-1.5" }, [
                              createVNode("span", {
                                class: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide " + roleInfo.value.classes
                              }, [
                                createVNode(unref(Icon), {
                                  icon: roleInfo.value.icon,
                                  class: "text-xs"
                                }, null, 8, ["icon"]),
                                createTextVNode(" " + toDisplayString$1(roleInfo.value.label), 1)
                              ], 2)
                            ])
                          ])
                        ]),
                        createVNode(unref(DropdownMenuSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                        __props.user ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createVNode(unref(DropdownMenuItem), {
                            onSelect: ($event) => go("/profile"),
                            class: "menu-item"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), {
                                icon: "mdi:account-edit",
                                class: "text-base"
                              }),
                              createVNode("span", null, toDisplayString$1(unref(t)("nav.profile")), 1)
                            ]),
                            _: 1
                          }, 8, ["onSelect"]),
                          createVNode(unref(DropdownMenuItem), {
                            onSelect: ($event) => go("/change-password"),
                            class: "menu-item"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), {
                                icon: "mdi:lock-reset",
                                class: "text-base"
                              }),
                              createVNode("span", null, toDisplayString$1(unref(t)("nav.changePassword")), 1)
                            ]),
                            _: 1
                          }, 8, ["onSelect"]),
                          __props.user.role === "admin" || __props.user.role === "author" ? (openBlock(), createBlock(unref(DropdownMenuItem), {
                            key: 0,
                            onSelect: ($event) => go("/dashboard"),
                            class: "menu-item"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), {
                                icon: "mdi:view-dashboard-outline",
                                class: "text-base"
                              }),
                              createVNode("span", null, toDisplayString$1(unref(t)("nav.dashboard")), 1)
                            ]),
                            _: 1
                          }, 8, ["onSelect"])) : createCommentVNode("", true),
                          createVNode(unref(DropdownMenuSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                          createVNode(unref(DropdownMenuItem), {
                            onSelect: logout,
                            class: "menu-item text-red-600 dark:text-red-400 data-[highlighted]:bg-red-100 dark:data-[highlighted]:bg-red-900/40"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), {
                                icon: "mdi:logout",
                                class: "text-base"
                              }),
                              createVNode("span", null, toDisplayString$1(unref(t)("nav.logout")), 1)
                            ]),
                            _: 1
                          })
                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createVNode(unref(DropdownMenuItem), {
                            onSelect: ($event) => go("/login"),
                            class: "menu-item"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), {
                                icon: "mdi:login",
                                class: "text-base"
                              }),
                              createVNode("span", null, toDisplayString$1(unref(t)("nav.login")), 1)
                            ]),
                            _: 1
                          }, 8, ["onSelect"]),
                          createVNode(unref(DropdownMenuItem), {
                            onSelect: ($event) => go("/signup"),
                            class: "menu-item"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), {
                                icon: "mdi:account-plus",
                                class: "text-base"
                              }),
                              createVNode("span", null, toDisplayString$1(unref(t)("nav.signup")), 1)
                            ]),
                            _: 1
                          }, 8, ["onSelect"])
                        ], 64)),
                        createVNode(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(DropdownMenuTrigger), {
                class: "inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 group",
                "aria-label": unref(t)("nav.profile")
              }, {
                default: withCtx(() => [
                  createVNode(unref(AvatarRoot), { class: "w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600" }, {
                    default: withCtx(() => [
                      __props.avatarUrl ? (openBlock(), createBlock(unref(AvatarImage), {
                        key: 0,
                        src: __props.avatarUrl,
                        alt: "User Avatar",
                        class: "w-full h-full object-cover"
                      }, null, 8, ["src"])) : createCommentVNode("", true),
                      createVNode(unref(AvatarFallback), { class: "w-full h-full flex items-center justify-center text-gray-500 text-sm" }, {
                        default: withCtx(() => [
                          createVNode(unref(Icon), {
                            icon: "mdi:account",
                            class: "text-lg"
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("span", { class: "max-w-[90px] truncate font-medium" }, toDisplayString$1(displayName.value), 1),
                  createVNode(unref(Icon), {
                    icon: "mdi:chevron-down",
                    class: "text-lg opacity-60 group-hover:opacity-80 transition"
                  })
                ]),
                _: 1
              }, 8, ["aria-label"]),
              createVNode(unref(DropdownMenuPortal), null, {
                default: withCtx(() => [
                  createVNode(unref(DropdownMenuContent), {
                    class: "min-w-[240px] p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/50 shadow-lg focus:outline-none text-sm origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade",
                    "side-offset": 8,
                    align: "end"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "px-3 pt-2 pb-3 flex items-center gap-3" }, [
                        createVNode(unref(AvatarRoot), { class: "w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden ring-1 ring-gray-300 dark:ring-gray-600" }, {
                          default: withCtx(() => [
                            __props.avatarUrl ? (openBlock(), createBlock(unref(AvatarImage), {
                              key: 0,
                              src: __props.avatarUrl,
                              alt: displayName.value,
                              class: "w-full h-full object-cover"
                            }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                            createVNode(unref(AvatarFallback), { class: "w-full h-full flex items-center justify-center text-gray-500" }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), {
                                  icon: "mdi:account",
                                  class: "text-xl"
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("p", { class: "text-gray-900 dark:text-gray-100 font-medium truncate" }, toDisplayString$1(displayName.value), 1),
                          createVNode("div", { class: "mt-1 flex flex-wrap items-center gap-1.5" }, [
                            createVNode("span", {
                              class: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide " + roleInfo.value.classes
                            }, [
                              createVNode(unref(Icon), {
                                icon: roleInfo.value.icon,
                                class: "text-xs"
                              }, null, 8, ["icon"]),
                              createTextVNode(" " + toDisplayString$1(roleInfo.value.label), 1)
                            ], 2)
                          ])
                        ])
                      ]),
                      createVNode(unref(DropdownMenuSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                      __props.user ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createVNode(unref(DropdownMenuItem), {
                          onSelect: ($event) => go("/profile"),
                          class: "menu-item"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), {
                              icon: "mdi:account-edit",
                              class: "text-base"
                            }),
                            createVNode("span", null, toDisplayString$1(unref(t)("nav.profile")), 1)
                          ]),
                          _: 1
                        }, 8, ["onSelect"]),
                        createVNode(unref(DropdownMenuItem), {
                          onSelect: ($event) => go("/change-password"),
                          class: "menu-item"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), {
                              icon: "mdi:lock-reset",
                              class: "text-base"
                            }),
                            createVNode("span", null, toDisplayString$1(unref(t)("nav.changePassword")), 1)
                          ]),
                          _: 1
                        }, 8, ["onSelect"]),
                        __props.user.role === "admin" || __props.user.role === "author" ? (openBlock(), createBlock(unref(DropdownMenuItem), {
                          key: 0,
                          onSelect: ($event) => go("/dashboard"),
                          class: "menu-item"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), {
                              icon: "mdi:view-dashboard-outline",
                              class: "text-base"
                            }),
                            createVNode("span", null, toDisplayString$1(unref(t)("nav.dashboard")), 1)
                          ]),
                          _: 1
                        }, 8, ["onSelect"])) : createCommentVNode("", true),
                        createVNode(unref(DropdownMenuSeparator), { class: "h-px bg-gray-200 dark:bg-gray-700 my-1" }),
                        createVNode(unref(DropdownMenuItem), {
                          onSelect: logout,
                          class: "menu-item text-red-600 dark:text-red-400 data-[highlighted]:bg-red-100 dark:data-[highlighted]:bg-red-900/40"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), {
                              icon: "mdi:logout",
                              class: "text-base"
                            }),
                            createVNode("span", null, toDisplayString$1(unref(t)("nav.logout")), 1)
                          ]),
                          _: 1
                        })
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createVNode(unref(DropdownMenuItem), {
                          onSelect: ($event) => go("/login"),
                          class: "menu-item"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), {
                              icon: "mdi:login",
                              class: "text-base"
                            }),
                            createVNode("span", null, toDisplayString$1(unref(t)("nav.login")), 1)
                          ]),
                          _: 1
                        }, 8, ["onSelect"]),
                        createVNode(unref(DropdownMenuItem), {
                          onSelect: ($event) => go("/signup"),
                          class: "menu-item"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), {
                              icon: "mdi:account-plus",
                              class: "text-base"
                            }),
                            createVNode("span", null, toDisplayString$1(unref(t)("nav.signup")), 1)
                          ]),
                          _: 1
                        }, 8, ["onSelect"])
                      ], 64)),
                      createVNode(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserDropdown.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {
  __name: "CategoriesDropdown",
  __ssrInlineRender: true,
  props: {
    categories: { type: Array, default: () => [] }
  },
  setup(__props) {
    const { t } = useI18n();
    const localePath2 = useLocalePath();
    const props = __props;
    const open = ref(false);
    const router = useRouter$1();
    function addUncategorized(list) {
      return [{ id: null, name: t("common.uncategorized"), slug: "uncategorized" }, ...list];
    }
    function sortList(list) {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    const categoriesList = computed(() => addUncategorized(sortList(props.categories || [])));
    function go(slug) {
      open.value = false;
      router.push(localePath2(`/category/${slug}`));
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuRoot), mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DropdownMenuTrigger), {
              class: "nav-pill data-[state=open]:bg-gray-200 dark:data-[state=open]:bg-gray-700/60",
              "aria-label": unref(t)("nav.categories")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:tag-multiple-outline",
                    class: "text-base"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="hidden md:inline"${_scopeId2}>${ssrInterpolate(unref(t)("nav.categories"))}</span>`);
                  _push3(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:chevron-down",
                    class: "text-base opacity-70"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Icon), {
                      icon: "mdi:tag-multiple-outline",
                      class: "text-base"
                    }),
                    createVNode("span", { class: "hidden md:inline" }, toDisplayString$1(unref(t)("nav.categories")), 1),
                    createVNode(unref(Icon), {
                      icon: "mdi:chevron-down",
                      class: "text-base opacity-70"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(DropdownMenuPortal), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(DropdownMenuContent), {
                    class: "min-w-[220px] max-h-[60vh] overflow-auto p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/30 shadow-lg focus:outline-none origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade",
                    "side-offset": 8,
                    align: "end"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Icon), {
                          icon: "mdi:tag-multiple",
                          class: "text-sm"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(unref(t)("nav.browseCategories"))}</div><!--[-->`);
                        ssrRenderList(categoriesList.value, (cat) => {
                          _push4(ssrRenderComponent(unref(DropdownMenuItem), {
                            key: cat.slug || cat.name || "uncategorized",
                            class: "menu-item",
                            onSelect: ($event) => go(cat.slug || cat.name)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Icon), {
                                  icon: cat.id ? "mdi:tag-outline" : "mdi:tag-off-outline",
                                  class: "text-base opacity-80"
                                }, null, _parent5, _scopeId4));
                                _push5(`<span class="truncate flex-1"${_scopeId4}>${ssrInterpolate(cat.name)}</span>`);
                                _push5(ssrRenderComponent(unref(Icon), {
                                  icon: "mdi:chevron-right",
                                  class: "text-xs opacity-40"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(Icon), {
                                    icon: cat.id ? "mdi:tag-outline" : "mdi:tag-off-outline",
                                    class: "text-base opacity-80"
                                  }, null, 8, ["icon"]),
                                  createVNode("span", { class: "truncate flex-1" }, toDisplayString$1(cat.name), 1),
                                  createVNode(unref(Icon), {
                                    icon: "mdi:chevron-right",
                                    class: "text-xs opacity-40"
                                  })
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                        _push4(ssrRenderComponent(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("div", { class: "px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400" }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:tag-multiple",
                              class: "text-sm"
                            }),
                            createTextVNode(" " + toDisplayString$1(unref(t)("nav.browseCategories")), 1)
                          ]),
                          (openBlock(true), createBlock(Fragment, null, renderList(categoriesList.value, (cat) => {
                            return openBlock(), createBlock(unref(DropdownMenuItem), {
                              key: cat.slug || cat.name || "uncategorized",
                              class: "menu-item",
                              onSelect: ($event) => go(cat.slug || cat.name)
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Icon), {
                                  icon: cat.id ? "mdi:tag-outline" : "mdi:tag-off-outline",
                                  class: "text-base opacity-80"
                                }, null, 8, ["icon"]),
                                createVNode("span", { class: "truncate flex-1" }, toDisplayString$1(cat.name), 1),
                                createVNode(unref(Icon), {
                                  icon: "mdi:chevron-right",
                                  class: "text-xs opacity-40"
                                })
                              ]),
                              _: 2
                            }, 1032, ["onSelect"]);
                          }), 128)),
                          createVNode(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(DropdownMenuContent), {
                      class: "min-w-[220px] max-h-[60vh] overflow-auto p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/30 shadow-lg focus:outline-none origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade",
                      "side-offset": 8,
                      align: "end"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400" }, [
                          createVNode(unref(Icon), {
                            icon: "mdi:tag-multiple",
                            class: "text-sm"
                          }),
                          createTextVNode(" " + toDisplayString$1(unref(t)("nav.browseCategories")), 1)
                        ]),
                        (openBlock(true), createBlock(Fragment, null, renderList(categoriesList.value, (cat) => {
                          return openBlock(), createBlock(unref(DropdownMenuItem), {
                            key: cat.slug || cat.name || "uncategorized",
                            class: "menu-item",
                            onSelect: ($event) => go(cat.slug || cat.name)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Icon), {
                                icon: cat.id ? "mdi:tag-outline" : "mdi:tag-off-outline",
                                class: "text-base opacity-80"
                              }, null, 8, ["icon"]),
                              createVNode("span", { class: "truncate flex-1" }, toDisplayString$1(cat.name), 1),
                              createVNode(unref(Icon), {
                                icon: "mdi:chevron-right",
                                class: "text-xs opacity-40"
                              })
                            ]),
                            _: 2
                          }, 1032, ["onSelect"]);
                        }), 128)),
                        createVNode(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(DropdownMenuTrigger), {
                class: "nav-pill data-[state=open]:bg-gray-200 dark:data-[state=open]:bg-gray-700/60",
                "aria-label": unref(t)("nav.categories")
              }, {
                default: withCtx(() => [
                  createVNode(unref(Icon), {
                    icon: "mdi:tag-multiple-outline",
                    class: "text-base"
                  }),
                  createVNode("span", { class: "hidden md:inline" }, toDisplayString$1(unref(t)("nav.categories")), 1),
                  createVNode(unref(Icon), {
                    icon: "mdi:chevron-down",
                    class: "text-base opacity-70"
                  })
                ]),
                _: 1
              }, 8, ["aria-label"]),
              createVNode(unref(DropdownMenuPortal), null, {
                default: withCtx(() => [
                  createVNode(unref(DropdownMenuContent), {
                    class: "min-w-[220px] max-h-[60vh] overflow-auto p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/30 shadow-lg focus:outline-none origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade",
                    "side-offset": 8,
                    align: "end"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400" }, [
                        createVNode(unref(Icon), {
                          icon: "mdi:tag-multiple",
                          class: "text-sm"
                        }),
                        createTextVNode(" " + toDisplayString$1(unref(t)("nav.browseCategories")), 1)
                      ]),
                      (openBlock(true), createBlock(Fragment, null, renderList(categoriesList.value, (cat) => {
                        return openBlock(), createBlock(unref(DropdownMenuItem), {
                          key: cat.slug || cat.name || "uncategorized",
                          class: "menu-item",
                          onSelect: ($event) => go(cat.slug || cat.name)
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Icon), {
                              icon: cat.id ? "mdi:tag-outline" : "mdi:tag-off-outline",
                              class: "text-base opacity-80"
                            }, null, 8, ["icon"]),
                            createVNode("span", { class: "truncate flex-1" }, toDisplayString$1(cat.name), 1),
                            createVNode(unref(Icon), {
                              icon: "mdi:chevron-right",
                              class: "text-xs opacity-40"
                            })
                          ]),
                          _: 2
                        }, 1032, ["onSelect"]);
                      }), 128)),
                      createVNode(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CategoriesDropdown.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const CONTENT_LOCALES = [
  { code: "en", name: "English" },
  { code: "ku", name: "کوردی" },
  { code: "ar", name: "العربية" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" }
];
function allConfiguredLocaleCodes() {
  return CONTENT_LOCALES.map((l) => l.code);
}
const DEFAULT_FOOTER_CREDITS = {
  plumaWatermark: true,
  rss: true,
  sitemap: true
};
function allConfiguredLocales() {
  return allConfiguredLocaleCodes();
}
function normalizeFooterCredits(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    plumaWatermark: src.plumaWatermark !== false,
    rss: src.rss !== false,
    sitemap: src.sitemap !== false
  };
}
function normalizeMetaTranslations(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out = {};
  for (const [code, entry2] of Object.entries(raw)) {
    if (!code || !entry2 || typeof entry2 !== "object") continue;
    const siteName2 = typeof entry2.siteName === "string" ? entry2.siteName.trim() || null : null;
    const siteDescription2 = typeof entry2.siteDescription === "string" ? entry2.siteDescription.trim() || null : null;
    if (siteName2 || siteDescription2) {
      out[code] = { siteName: siteName2, siteDescription: siteDescription2 };
    }
  }
  return out;
}
function resolveLocalizedSiteName(locale) {
  const primary = primaryLocale.value || "en";
  const code = locale || primary;
  if (code !== primary) {
    const tr = metaTranslations.value?.[code];
    if (tr) return tr.siteName || null;
    return siteName.value;
  }
  return siteName.value;
}
function resolveLocalizedSiteDescription(locale) {
  const primary = primaryLocale.value || "en";
  const code = locale || primary;
  if (code !== primary) {
    const tr = metaTranslations.value?.[code];
    if (tr) return tr.siteDescription || null;
    return siteDescription.value;
  }
  return siteDescription.value;
}
function normalizeLocaleSettings(rawEnabled, rawPrimary) {
  const known = allConfiguredLocales();
  const knownSet = new Set(known);
  let enabled = Array.isArray(rawEnabled) ? rawEnabled.map(String).filter((c) => knownSet.has(c)) : [...known];
  if (!enabled.length) {
    enabled = known.includes("en") ? ["en"] : [known[0]].filter(Boolean);
  }
  let primary = typeof rawPrimary === "string" ? rawPrimary : "en";
  if (!enabled.includes(primary)) {
    primary = enabled.includes("en") ? "en" : enabled[0];
  }
  return { enabledLocales: enabled, primaryLocale: primary };
}
const brandingLoaded = ref(false);
const brandingLoading = ref(false);
const brandingError = ref(null);
const siteName = ref(null);
const siteDescription = ref(null);
const twitterHandle = ref(null);
const footerCredits = ref({ ...DEFAULT_FOOTER_CREDITS });
const socialLinks = ref([]);
const lightLogoUrl = ref(null);
const darkLogoUrl = ref(null);
const faviconUrl = ref(null);
const lightLogoPath = ref(null);
const darkLogoPath = ref(null);
const faviconPath = ref(null);
const logoVersion = ref(Date.now());
const enabledLocales = ref(allConfiguredLocales());
const primaryLocale = ref("en");
const metaTranslations = ref({});
function isLocaleEnabled(code) {
  if (!code) return false;
  return enabledLocales.value.includes(code);
}
async function saveBrandingSettings(value) {
  const { data: existingRow, error: readErr } = await supabase.from("settings").select("key").eq("key", "branding").maybeSingle();
  if (readErr) return { error: readErr };
  if (existingRow?.key) {
    return supabase.from("settings").update({ value }).eq("key", "branding");
  }
  return supabase.from("settings").insert({ key: "branding", value });
}
function storagePathFromPublicUrl(url) {
  if (!url) return null;
  try {
    const m = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
    if (m) {
      return m[2];
    }
  } catch (e) {
    console.warn("[branding] invalid public URL:", url, e);
  }
  return null;
}
async function fetchBranding(force = false) {
  if (brandingLoaded.value && !force) return;
  brandingLoading.value = true;
  brandingError.value = null;
  try {
    const { data, error } = await supabase.from("settings").select("value").eq("key", "branding").maybeSingle();
    if (error) throw error;
    const value = data?.value || {};
    siteName.value = value.siteName || null;
    siteDescription.value = value.siteDescription || null;
    twitterHandle.value = value.twitterHandle || null;
    footerCredits.value = normalizeFooterCredits(value.footerCredits);
    socialLinks.value = Array.isArray(value.socialLinks) ? value.socialLinks : [];
    lightLogoUrl.value = value.lightLogoUrl || null;
    darkLogoUrl.value = value.darkLogoUrl || null;
    faviconUrl.value = value.faviconUrl || null;
    lightLogoPath.value = value.lightLogoPath || null;
    darkLogoPath.value = value.darkLogoPath || null;
    faviconPath.value = value.faviconPath || null;
    const localesNorm = normalizeLocaleSettings(
      value.enabledLocales,
      value.primaryLocale || value.locale
    );
    enabledLocales.value = localesNorm.enabledLocales;
    primaryLocale.value = localesNorm.primaryLocale;
    metaTranslations.value = normalizeMetaTranslations(value.metaTranslations);
    brandingLoaded.value = true;
  } catch (e) {
    console.error("[branding] fetch error", e);
    if (e.message === "JWSError JWSInvalidSignature") {
      await supabase.auth.signOut();
    }
    brandingError.value = e;
  } finally {
    brandingLoading.value = false;
  }
}
async function updateBranding({
  lightFile,
  darkFile,
  faviconFile,
  siteName: newSiteName,
  siteDescription: newSiteDescription,
  socialLinks: newSocialLinks,
  twitterHandle: newTwitterHandle,
  footerCredits: newFooterCredits,
  enabledLocales: newEnabledLocales,
  primaryLocale: newPrimaryLocale,
  metaTranslations: newMetaTranslations
}) {
  let existingValue = {};
  const { data: existingRow } = await supabase.from("settings").select("value").eq("key", "branding").maybeSingle();
  if (existingRow?.value) existingValue = existingRow.value;
  const newValue = { ...existingValue };
  if (typeof newSiteName === "string") newValue.siteName = newSiteName.trim() || null;
  if (typeof newSiteDescription === "string") newValue.siteDescription = newSiteDescription.trim() || null;
  if (typeof newTwitterHandle === "string") {
    const cleaned = newTwitterHandle.trim().replace(/^@/, "");
    newValue.twitterHandle = cleaned || null;
  }
  if (newFooterCredits && typeof newFooterCredits === "object") {
    newValue.footerCredits = normalizeFooterCredits(newFooterCredits);
  }
  if (Array.isArray(newSocialLinks)) newValue.socialLinks = newSocialLinks.filter((l) => l && l.label && l.url);
  if (newMetaTranslations !== void 0) {
    newValue.metaTranslations = normalizeMetaTranslations(newMetaTranslations);
  }
  if (Array.isArray(newEnabledLocales) || typeof newPrimaryLocale === "string") {
    const localesNorm = normalizeLocaleSettings(
      Array.isArray(newEnabledLocales) ? newEnabledLocales : existingValue.enabledLocales,
      typeof newPrimaryLocale === "string" ? newPrimaryLocale : existingValue.primaryLocale || existingValue.locale
    );
    newValue.enabledLocales = localesNorm.enabledLocales;
    newValue.primaryLocale = localesNorm.primaryLocale;
    newValue.locale = localesNorm.primaryLocale;
    const kept = normalizeMetaTranslations(newValue.metaTranslations);
    for (const code of Object.keys(kept)) {
      if (!localesNorm.enabledLocales.includes(code) || code === localesNorm.primaryLocale) {
        delete kept[code];
      }
    }
    newValue.metaTranslations = kept;
  }
  async function uploadVariant(file, variant) {
    if (!file) return;
    let prevUrlOrPath;
    if (variant === "light") prevUrlOrPath = newValue.lightLogoUrl || newValue.lightLogoPath;
    else if (variant === "dark") prevUrlOrPath = newValue.darkLogoUrl || newValue.darkLogoPath;
    else if (variant === "favicon") prevUrlOrPath = newValue.faviconUrl || newValue.faviconPath;
    const prevPath = /^https?:\/\//i.test(prevUrlOrPath) ? storagePathFromPublicUrl(prevUrlOrPath) : prevUrlOrPath;
    const originalName = file.name || "";
    const ext = originalName.includes(".") ? originalName.split(".").pop().toLowerCase() : "";
    const objectPath = ext ? `${variant}.${ext}` : variant;
    const pathsToRemove = [...new Set([prevPath, objectPath].filter(Boolean))];
    if (pathsToRemove.length) {
      try {
        await supabase.storage.from("branding").remove(pathsToRemove);
      } catch (e) {
        console.warn("[branding] remove previous variant failed", variant, pathsToRemove, e);
      }
    }
    const { error: upErr } = await supabase.storage.from("branding").upload(objectPath, file, {
      upsert: false,
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream"
    });
    if (upErr) {
      const err = new Error(upErr.message || "Failed to upload branding asset");
      err.cause = upErr;
      err.step = "storage";
      throw err;
    }
    const { data: pub } = supabase.storage.from("branding").getPublicUrl(objectPath);
    if (variant === "light") {
      newValue.lightLogoUrl = pub.publicUrl;
      newValue.lightLogoPath = objectPath;
    } else if (variant === "dark") {
      newValue.darkLogoUrl = pub.publicUrl;
      newValue.darkLogoPath = objectPath;
    } else if (variant === "favicon") {
      newValue.faviconUrl = pub.publicUrl;
      newValue.faviconPath = objectPath;
    }
  }
  await Promise.all([
    uploadVariant(lightFile, "light"),
    uploadVariant(darkFile, "dark"),
    uploadVariant(faviconFile, "favicon")
  ]);
  const { error } = await saveBrandingSettings(newValue);
  if (error) {
    const err = new Error(error.message || "Failed to save branding settings");
    err.cause = error;
    err.step = "settings";
    throw err;
  }
  brandingLoaded.value = false;
  await fetchBranding(true);
  logoVersion.value = Date.now();
}
async function removeBrandingVariant(variant) {
  const valid = ["light", "dark", "favicon"];
  if (!valid.includes(variant)) return;
  let existingValue = {};
  const { data: existingRow } = await supabase.from("settings").select("value").eq("key", "branding").single();
  if (existingRow?.value) existingValue = existingRow.value;
  const urlKey = variant === "light" ? "lightLogoUrl" : variant === "dark" ? "darkLogoUrl" : "faviconUrl";
  const pathKey = variant === "light" ? "lightLogoPath" : variant === "dark" ? "darkLogoPath" : "faviconPath";
  const prevUrlOrPath = existingValue[urlKey] || existingValue[pathKey];
  const prevPath = /^https?:\/\//i.test(prevUrlOrPath) ? storagePathFromPublicUrl(prevUrlOrPath) : prevUrlOrPath;
  if (prevPath) {
    try {
      await supabase.storage.from("branding").remove([prevPath]);
    } catch (e) {
      console.warn("[branding] remove variant file failed", variant, e);
    }
  }
  delete existingValue[urlKey];
  delete existingValue[pathKey];
  const { error } = await saveBrandingSettings(existingValue);
  if (error) throw error;
  brandingLoaded.value = false;
  await fetchBranding(true);
  logoVersion.value = Date.now();
}
function useBranding() {
  return {
    brandingLoaded,
    brandingLoading,
    brandingError,
    siteName,
    siteDescription,
    twitterHandle,
    footerCredits,
    socialLinks,
    lightLogoUrl,
    darkLogoUrl,
    faviconUrl,
    lightLogoPath,
    darkLogoPath,
    faviconPath,
    logoVersion,
    enabledLocales,
    primaryLocale,
    metaTranslations,
    fetchBranding,
    updateBranding,
    removeBrandingVariant,
    isLocaleEnabled,
    allConfiguredLocales,
    resolveLocalizedSiteName,
    resolveLocalizedSiteDescription
  };
}
const _sfc_main$7 = {
  __name: "LocaleSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, locales, t, setLocale } = useI18n();
    const branding = useBranding();
    const localeSettings = useState("pluma-branding-locales", () => null);
    const open = ref(false);
    const resolvedEnabled = computed(() => {
      if (branding.brandingLoaded?.value) {
        return branding.enabledLocales?.value || [];
      }
      return localeSettings.value?.enabledLocales || null;
    });
    const availableLocales = computed(() => {
      const enabled = resolvedEnabled.value;
      if (!Array.isArray(enabled)) return [];
      if (!enabled.length) return [];
      const list = unref(locales) || [];
      return list.filter((l) => enabled.includes(l.code)).map((l) => ({
        code: l.code,
        name: l.name || l.code
      }));
    });
    async function switchLocale(code) {
      open.value = false;
      if (!code || code === unref(locale)) return;
      if (!isLocaleEnabled(code)) return;
      const cookie = useCookie("pluma_locale", { sameSite: "lax", path: "/" });
      cookie.value = code;
      await setLocale(code);
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(availableLocales).length > 1) {
        _push(ssrRenderComponent(unref(DropdownMenuRoot), mergeProps({
          open: unref(open),
          "onUpdate:open": ($event) => isRef(open) ? open.value = $event : null
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(DropdownMenuTrigger), {
                class: "nav-pill data-[state=open]:bg-gray-200 dark:data-[state=open]:bg-gray-700/60",
                "aria-label": unref(t)("locale.switch")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "mdi:translate",
                      class: "text-base"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="hidden md:inline uppercase tracking-wide"${_scopeId2}>${ssrInterpolate(unref(locale))}</span>`);
                    _push3(ssrRenderComponent(unref(Icon), {
                      icon: "mdi:chevron-down",
                      class: "text-base opacity-70"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(Icon), {
                        icon: "mdi:translate",
                        class: "text-base"
                      }),
                      createVNode("span", { class: "hidden md:inline uppercase tracking-wide" }, toDisplayString$1(unref(locale)), 1),
                      createVNode(unref(Icon), {
                        icon: "mdi:chevron-down",
                        class: "text-base opacity-70"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(DropdownMenuPortal), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(DropdownMenuContent), {
                      class: "min-w-[220px] max-h-[60vh] overflow-auto p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/30 shadow-lg focus:outline-none origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade z-[200]",
                      "side-offset": 8,
                      align: "end"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(Icon), {
                            icon: "mdi:translate",
                            class: "text-sm"
                          }, null, _parent4, _scopeId3));
                          _push4(` ${ssrInterpolate(unref(t)("locale.switch"))}</div><!--[-->`);
                          ssrRenderList(unref(availableLocales), (loc) => {
                            _push4(ssrRenderComponent(unref(DropdownMenuItem), {
                              key: loc.code,
                              class: ["menu-item", loc.code === unref(locale) ? "font-semibold text-blue-600 dark:text-blue-400" : ""],
                              onSelect: ($event) => switchLocale(loc.code)
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<span class="uppercase text-[10px] opacity-60 w-6 shrink-0"${_scopeId4}>${ssrInterpolate(loc.code)}</span><span class="truncate flex-1"${_scopeId4}>${ssrInterpolate(loc.name)}</span>`);
                                  if (loc.code === unref(locale)) {
                                    _push5(ssrRenderComponent(unref(Icon), {
                                      icon: "mdi:check",
                                      class: "text-base opacity-80"
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(ssrRenderComponent(unref(Icon), {
                                      icon: "mdi:chevron-right",
                                      class: "text-xs opacity-40"
                                    }, null, _parent5, _scopeId4));
                                  }
                                } else {
                                  return [
                                    createVNode("span", { class: "uppercase text-[10px] opacity-60 w-6 shrink-0" }, toDisplayString$1(loc.code), 1),
                                    createVNode("span", { class: "truncate flex-1" }, toDisplayString$1(loc.name), 1),
                                    loc.code === unref(locale) ? (openBlock(), createBlock(unref(Icon), {
                                      key: 0,
                                      icon: "mdi:check",
                                      class: "text-base opacity-80"
                                    })) : (openBlock(), createBlock(unref(Icon), {
                                      key: 1,
                                      icon: "mdi:chevron-right",
                                      class: "text-xs opacity-40"
                                    }))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                          _push4(ssrRenderComponent(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode("div", { class: "px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400" }, [
                              createVNode(unref(Icon), {
                                icon: "mdi:translate",
                                class: "text-sm"
                              }),
                              createTextVNode(" " + toDisplayString$1(unref(t)("locale.switch")), 1)
                            ]),
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(availableLocales), (loc) => {
                              return openBlock(), createBlock(unref(DropdownMenuItem), {
                                key: loc.code,
                                class: ["menu-item", loc.code === unref(locale) ? "font-semibold text-blue-600 dark:text-blue-400" : ""],
                                onSelect: ($event) => switchLocale(loc.code)
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "uppercase text-[10px] opacity-60 w-6 shrink-0" }, toDisplayString$1(loc.code), 1),
                                  createVNode("span", { class: "truncate flex-1" }, toDisplayString$1(loc.name), 1),
                                  loc.code === unref(locale) ? (openBlock(), createBlock(unref(Icon), {
                                    key: 0,
                                    icon: "mdi:check",
                                    class: "text-base opacity-80"
                                  })) : (openBlock(), createBlock(unref(Icon), {
                                    key: 1,
                                    icon: "mdi:chevron-right",
                                    class: "text-xs opacity-40"
                                  }))
                                ]),
                                _: 2
                              }, 1032, ["class", "onSelect"]);
                            }), 128)),
                            createVNode(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(DropdownMenuContent), {
                        class: "min-w-[220px] max-h-[60vh] overflow-auto p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/30 shadow-lg focus:outline-none origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade z-[200]",
                        "side-offset": 8,
                        align: "end"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400" }, [
                            createVNode(unref(Icon), {
                              icon: "mdi:translate",
                              class: "text-sm"
                            }),
                            createTextVNode(" " + toDisplayString$1(unref(t)("locale.switch")), 1)
                          ]),
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(availableLocales), (loc) => {
                            return openBlock(), createBlock(unref(DropdownMenuItem), {
                              key: loc.code,
                              class: ["menu-item", loc.code === unref(locale) ? "font-semibold text-blue-600 dark:text-blue-400" : ""],
                              onSelect: ($event) => switchLocale(loc.code)
                            }, {
                              default: withCtx(() => [
                                createVNode("span", { class: "uppercase text-[10px] opacity-60 w-6 shrink-0" }, toDisplayString$1(loc.code), 1),
                                createVNode("span", { class: "truncate flex-1" }, toDisplayString$1(loc.name), 1),
                                loc.code === unref(locale) ? (openBlock(), createBlock(unref(Icon), {
                                  key: 0,
                                  icon: "mdi:check",
                                  class: "text-base opacity-80"
                                })) : (openBlock(), createBlock(unref(Icon), {
                                  key: 1,
                                  icon: "mdi:chevron-right",
                                  class: "text-xs opacity-40"
                                }))
                              ]),
                              _: 2
                            }, 1032, ["class", "onSelect"]);
                          }), 128)),
                          createVNode(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(DropdownMenuTrigger), {
                  class: "nav-pill data-[state=open]:bg-gray-200 dark:data-[state=open]:bg-gray-700/60",
                  "aria-label": unref(t)("locale.switch")
                }, {
                  default: withCtx(() => [
                    createVNode(unref(Icon), {
                      icon: "mdi:translate",
                      class: "text-base"
                    }),
                    createVNode("span", { class: "hidden md:inline uppercase tracking-wide" }, toDisplayString$1(unref(locale)), 1),
                    createVNode(unref(Icon), {
                      icon: "mdi:chevron-down",
                      class: "text-base opacity-70"
                    })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                createVNode(unref(DropdownMenuPortal), null, {
                  default: withCtx(() => [
                    createVNode(unref(DropdownMenuContent), {
                      class: "min-w-[220px] max-h-[60vh] overflow-auto p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/30 shadow-lg focus:outline-none origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade z-[200]",
                      "side-offset": 8,
                      align: "end"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400" }, [
                          createVNode(unref(Icon), {
                            icon: "mdi:translate",
                            class: "text-sm"
                          }),
                          createTextVNode(" " + toDisplayString$1(unref(t)("locale.switch")), 1)
                        ]),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(availableLocales), (loc) => {
                          return openBlock(), createBlock(unref(DropdownMenuItem), {
                            key: loc.code,
                            class: ["menu-item", loc.code === unref(locale) ? "font-semibold text-blue-600 dark:text-blue-400" : ""],
                            onSelect: ($event) => switchLocale(loc.code)
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "uppercase text-[10px] opacity-60 w-6 shrink-0" }, toDisplayString$1(loc.code), 1),
                              createVNode("span", { class: "truncate flex-1" }, toDisplayString$1(loc.name), 1),
                              loc.code === unref(locale) ? (openBlock(), createBlock(unref(Icon), {
                                key: 0,
                                icon: "mdi:check",
                                class: "text-base opacity-80"
                              })) : (openBlock(), createBlock(unref(Icon), {
                                key: 1,
                                icon: "mdi:chevron-right",
                                class: "text-xs opacity-40"
                              }))
                            ]),
                            _: 2
                          }, 1032, ["class", "onSelect"]);
                        }), 128)),
                        createVNode(unref(DropdownMenuArrow), { class: "fill-white dark:fill-gray-800" })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/LocaleSwitcher.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
function useContentLocale() {
  const { locale } = useI18n();
  const branding = useBranding();
  const enabledContentLocales = computed(() => {
    const enabled = branding.enabledLocales?.value;
    if (!Array.isArray(enabled) || !enabled.length) return CONTENT_LOCALES;
    return CONTENT_LOCALES.filter((l) => enabled.includes(l.code));
  });
  const contentLocale = computed(() => {
    const ui = locale.value || "en";
    if (isLocaleEnabled(ui)) return ui;
    return branding.primaryLocale?.value || "en";
  });
  function withLocale(queryBuilder) {
    return queryBuilder.eq("locale", contentLocale.value);
  }
  return {
    contentLocale,
    locales: enabledContentLocales,
    withLocale
  };
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const debounceMs = 260;
const _sfc_main$6 = {
  __name: "GlobalSearch",
  __ssrInlineRender: true,
  props: {
    modelValue: Boolean,
    initialQuery: { type: String, default: "" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    useLocalePath();
    const { contentLocale } = useContentLocale();
    const props = __props;
    const query = ref("");
    const results = ref([]);
    const selectedIndex = ref(-1);
    const searchInput = ref(null);
    const loading = ref(false);
    useRouter$1();
    const currentUser = ref(null);
    const currentProfileRole = ref(null);
    let debounceTimer = null;
    let lastIssued = 0;
    const searchablePages = computed(() => [
      { id: "home", label: t("nav.home"), route: "/", icon: "mdi:home" },
      { id: "archive", label: t("nav.archive"), route: "/archive", icon: "mdi:archive-outline" },
      {
        id: "dashboard",
        label: t("nav.dashboard"),
        route: "/dashboard",
        icon: "mdi:view-dashboard",
        requiresAuthorOrAdmin: true
      },
      {
        id: "new-post",
        label: t("posts.newPost"),
        route: "/dashboard/new-post",
        icon: "mdi:plus-box",
        requiresAuthorOrAdmin: true
      },
      {
        id: "profile",
        label: t("nav.profile"),
        route: "/profile",
        icon: "mdi:account",
        requiresAuth: true
      },
      {
        id: "login",
        label: t("nav.login"),
        route: "/login",
        icon: "mdi:login",
        requireAnonymous: true
      },
      {
        id: "signup",
        label: t("nav.signup"),
        route: "/signup",
        icon: "mdi:account-plus",
        requireAnonymous: true
      }
    ]);
    function pageVisible(p) {
      if (p.requireAnonymous) return !currentUser.value;
      if (p.requiresAuthorOrAdmin) {
        return !!currentUser.value && ["admin", "author"].includes(currentProfileRole.value);
      }
      if (p.requiresAuth) return !!currentUser.value;
      return true;
    }
    const typeLabels = computed(() => ({
      post: t("posts.title"),
      category: t("nav.categories"),
      profile: t("authors.title"),
      page: t("pages.title")
    }));
    watch(
      () => props.modelValue,
      async (v) => {
        if (v) {
          if (props.initialQuery) {
            query.value = props.initialQuery;
          }
          await nextTick();
          searchInput.value?.focus();
        } else clearQuery();
      }
    );
    function clearQuery() {
      query.value = "";
      results.value = [];
      selectedIndex.value = -1;
      loading.value = false;
    }
    function sanitize(str) {
      return String(str).replace(
        /[&<>"']/g,
        (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[s]
      );
    }
    function highlight(label, q) {
      if (!q) return sanitize(label);
      const re = new RegExp(
        "(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
        "ig"
      );
      return sanitize(label).replace(
        re,
        '<mark class="bg-yellow-200 dark:bg-yellow-600/60 text-gray-900 dark:text-yellow-50 rounded px-0.5">$1</mark>'
      );
    }
    const displayGroups = computed(() => {
      const grouped = {};
      results.value.forEach((item, idx) => {
        if (!grouped[item.type]) grouped[item.type] = [];
        grouped[item.type].push({
          ...item,
          flatIndex: idx,
          domId: "res-" + item.type + "-" + item.id
        });
      });
      return Object.keys(grouped).map((type) => ({ type, items: grouped[type] }));
    });
    const activeId = computed(() => {
      if (!query.value) {
        const item2 = quickLinks.value[selectedIndex.value];
        return item2 ? "quick-" + item2.id : null;
      }
      const item = results.value[selectedIndex.value];
      return item ? "res-" + item.type + "-" + item.id : null;
    });
    async function runSearch(term) {
      if (term.trim().length < 2) {
        results.value = [];
        selectedIndex.value = -1;
        loading.value = false;
        return;
      }
      const stamp = Date.now();
      lastIssued = stamp;
      loading.value = true;
      const search = `%${term.trim()}%`;
      const [posts, categories, profiles] = await Promise.all([
        supabase.from("posts").select("id, title, slug").eq("locale", contentLocale.value).eq("status", "published").or(`title.ilike.${search}`).order("created_at", { ascending: false }).limit(5),
        supabase.from("categories").select("id, name, slug").eq("locale", contentLocale.value).ilike("name", search).limit(5),
        supabase.from("profiles").select("id, display_name, username").in("role", ["author", "admin"]).or(`display_name.ilike.${search},username.ilike.${search}`).limit(5)
      ]);
      if (lastIssued !== stamp) return;
      const merged = [];
      if (posts.data)
        merged.push(
          ...posts.data.map((p) => ({
            id: p.id,
            type: "post",
            label: p.title,
            icon: "mdi:newspaper",
            route: `/posts/${p.slug}`,
            highlightedLabel: highlight(p.title, term)
          }))
        );
      if (categories.data)
        merged.push(
          ...categories.data.map((c) => ({
            id: c.id,
            type: "category",
            label: c.name,
            icon: "mdi:category",
            route: `/category/${c.slug || c.name}`,
            highlightedLabel: highlight(c.name, term)
          }))
        );
      if (profiles.data)
        merged.push(
          ...profiles.data.map((u) => ({
            id: u.id,
            type: "profile",
            label: u.display_name || u.username,
            icon: "mdi:account",
            route: `/author/${u.username}`,
            highlightedLabel: highlight(u.display_name || u.username, term)
          }))
        );
      const needle = term.trim().toLowerCase();
      const pageMatches = searchablePages.value.filter(pageVisible).filter((p) => p.label.toLowerCase().includes(needle)).slice(0, 5);
      merged.push(
        ...pageMatches.map((p) => ({
          id: p.id,
          type: "page",
          label: p.label,
          icon: p.icon || "mdi:file-document-outline",
          route: p.route,
          highlightedLabel: highlight(p.label, term)
        }))
      );
      results.value = merged;
      selectedIndex.value = -1;
      loading.value = false;
    }
    watch(query, (val) => {
      clearTimeout(debounceTimer);
      if (!val) {
        selectedIndex.value = quickLinks.value.length ? 0 : -1;
        results.value = [];
        loading.value = false;
        return;
      }
      debounceTimer = setTimeout(() => runSearch(val), debounceMs);
    });
    const quickLinks = computed(() => {
      if (query.value) return [];
      const base = [
        { id: "home", type: "page", label: t("nav.home"), icon: "mdi:home", route: "/" }
      ];
      if (currentUser.value)
        base.push({
          id: "dashboard",
          type: "page",
          label: t("nav.dashboard"),
          icon: "mdi:view-dashboard",
          route: "/dashboard"
        });
      if (currentUser.value && ["admin", "author"].includes(currentProfileRole.value))
        base.push({
          id: "new-post",
          type: "page",
          label: t("posts.newPost"),
          icon: "mdi:plus-box",
          route: "/dashboard/new-post"
        });
      base.forEach((b, i) => {
        b.flatIndex = i;
      });
      return base;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-28" }, _attrs))} data-v-289b3f74><div class="w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/50 backdrop-blur p-3 sm:p-4 flex flex-col" role="dialog" aria-modal="true" data-v-289b3f74><div class="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 focus-within:ring-2 focus-within:ring-blue-500 transition" data-v-289b3f74>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:magnify",
          class: "text-gray-500 dark:text-gray-400",
          width: 22
        }, null, _parent));
        _push(`<input type="text"${ssrRenderAttr("value", query.value)}${ssrRenderAttr("placeholder", unref(t)("search.placeholder"))} class="w-full bg-transparent text-sm sm:text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 outline-none py-1.5"${ssrRenderAttr("aria-label", unref(t)("search.title"))} data-v-289b3f74>`);
        if (query.value) {
          _push(`<button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition rounded-full p-1"${ssrRenderAttr("aria-label", unref(t)("search.clear"))} data-v-289b3f74>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:close-circle",
            width: 20
          }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="hidden sm:inline-flex items-center text-[11px] font-medium px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300" data-v-289b3f74>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:backspace",
          class: "text-lg"
        }, null, _parent));
        _push(`</button></div><div class="mt-3 relative flex-1 min-h-[180px] max-h-[480px] overflow-y-auto overscroll-contain" role="listbox"${ssrRenderAttr("aria-activedescendant", activeId.value)} data-v-289b3f74>`);
        if (!query.value && quickLinks.value.length) {
          _push(`<div class="pb-2" data-v-289b3f74><div class="sticky top-0 z-10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400" data-v-289b3f74>${ssrInterpolate(unref(t)("search.quickLinks"))}</div><ul class="mt-1 space-y-0.5" data-v-289b3f74><!--[-->`);
          ssrRenderList(quickLinks.value, (item) => {
            _push(`<li${ssrRenderAttr("id", "quick-" + item.id)} class="${ssrRenderClass([
              selectedIndex.value === item.flatIndex ? "bg-blue-50 dark:bg-blue-600/20 ring-1 ring-blue-200 dark:ring-blue-500" : "hover:bg-gray-100 dark:hover:bg-gray-800",
              "group cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
            ])}" data-v-289b3f74>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: item.icon,
              class: "text-blue-500"
            }, null, _parent));
            _push(`<span class="text-gray-800 dark:text-gray-200" data-v-289b3f74>${(item.highlightedLabel || sanitize(item.label)) ?? ""}</span></li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (loading.value) {
          _push(`<div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 px-4 py-6" data-v-289b3f74>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:progress-clock",
            class: "animate-spin"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("search.searching"))}</div>`);
        } else {
          _push(`<!--[--><!--[-->`);
          ssrRenderList(displayGroups.value, (group) => {
            _push(`<div class="mb-4 last:mb-2" data-v-289b3f74><div class="sticky top-0 z-10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-white/90 dark:bg-gray-900/90 backdrop-blur" data-v-289b3f74>${ssrInterpolate(typeLabels.value[group.type] || group.type)}</div><ul class="mt-1 space-y-0.5" data-v-289b3f74><!--[-->`);
            ssrRenderList(group.items, (item) => {
              _push(`<li${ssrRenderAttr("id", item.domId)} class="${ssrRenderClass([
                selectedIndex.value === item.flatIndex ? "bg-blue-50 dark:bg-blue-600/20 ring-1 ring-blue-200 dark:ring-blue-500" : "hover:bg-gray-100 dark:hover:bg-gray-800",
                "group cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
              ])}" data-v-289b3f74>`);
              _push(ssrRenderComponent(unref(Icon), {
                icon: item.icon,
                class: "text-blue-500"
              }, null, _parent));
              _push(`<span class="text-gray-800 dark:text-gray-200" data-v-289b3f74>${(item.highlightedLabel || sanitize(item.label)) ?? ""}</span></li>`);
            });
            _push(`<!--]--></ul></div>`);
          });
          _push(`<!--]-->`);
          if (query.value && !results.value.length && !loading.value) {
            _push(`<p class="px-4 py-8 text-center text-sm text-gray-500" data-v-289b3f74>${ssrInterpolate(unref(t)("search.noResults"))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div><div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400" data-v-289b3f74><div class="hidden sm:flex items-center gap-3" data-v-289b3f74><span class="flex items-center gap-1" data-v-289b3f74><kbd class="shortcut" data-v-289b3f74>↑</kbd><kbd class="shortcut" data-v-289b3f74>↓</kbd><span class="hidden md:inline" data-v-289b3f74>${ssrInterpolate(unref(t)("search.navigate"))}</span></span><span class="flex items-center gap-1" data-v-289b3f74><kbd class="shortcut" data-v-289b3f74>Enter</kbd><span class="hidden md:inline" data-v-289b3f74>${ssrInterpolate(unref(t)("common.open"))}</span></span><span class="flex items-center gap-1" data-v-289b3f74><kbd class="shortcut" data-v-289b3f74>Esc</kbd><span class="hidden md:inline" data-v-289b3f74>${ssrInterpolate(unref(t)("search.close"))}</span></span></div><span class="ml-auto text-[10px] font-medium tracking-wide" data-v-289b3f74>${ssrInterpolate(unref(t)("search.title"))}</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GlobalSearch.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const GlobalSearch = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-289b3f74"]]);
const _sfc_main$5 = {
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale, locales, setLocale } = useI18n();
    const localePath2 = useLocalePath();
    useContentLocale();
    const showSearch = ref(false);
    const initialSearchQuery = ref("");
    const theme = useThemeStore();
    const user = ref(null);
    const authReady = ref(false);
    const mobileMenuOpen = ref(false);
    ref("");
    const role = ref("");
    const categories = ref([]);
    const avatar_url = ref(null);
    const mobileCategoriesOpen = ref(false);
    const mobileLocalesOpen = ref(false);
    const branding = useBranding();
    const localeSettings = useState("pluma-branding-locales", () => null);
    const localizedSiteName = computed(
      () => branding.resolveLocalizedSiteName(locale.value) || ""
    );
    const router = useRouter$1();
    const route = useRoute();
    const isInstallPage = computed(() => {
      const p = route.path || "";
      return p === "/install" || p.endsWith("/install") || /(^|\/)install(\/|$)/.test(p);
    });
    const mobileLocales = computed(() => {
      const list = unref(locales) || [];
      let enabled = null;
      if (branding.brandingLoaded?.value) {
        enabled = branding.enabledLocales?.value || [];
      } else if (localeSettings.value?.enabledLocales) {
        enabled = localeSettings.value.enabledLocales;
      }
      if (!Array.isArray(enabled) || !enabled.length) return [];
      return list.filter((l) => enabled.includes(l.code)).map((l) => ({
        code: l.code,
        name: l.name || l.code
      }));
    });
    function go(path) {
      mobileMenuOpen.value = false;
      mobileCategoriesOpen.value = false;
      mobileLocalesOpen.value = false;
      router.push(localePath2(path));
    }
    const roleLabel = computed(() => {
      switch (role.value) {
        case "admin":
          return t("roles.admin");
        case "author":
          return t("roles.author");
        case "reader":
          return t("roles.reader");
        default:
          return t("roles.guest");
      }
    });
    const roleChipIcon = computed(() => {
      switch (role.value) {
        case "admin":
          return "mdi:shield-crown-outline";
        case "author":
          return "mdi:pen";
        case "reader":
          return "mdi:book-open-page-variant";
        default:
          return "mdi:account-outline";
      }
    });
    const roleChipClasses = computed(() => {
      switch (role.value) {
        case "admin":
          return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
        case "author":
          return "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300";
        case "reader":
          return "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300";
        default:
          return "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<!--[--><nav class="relative z-50 border-b border-gray-200 dark:border-gray-800"><div class="pointer-events-none absolute inset-0 overflow-hidden -z-10"><div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div><div class="absolute inset-0 bg-white/35 dark:bg-gray-900/55 backdrop-blur-md supports-[backdrop-filter]:bg-white/25 supports-[backdrop-filter]:dark:bg-gray-900/45"></div><div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-200/40 blur-2xl mix-blend-multiply dark:hidden"></div><div class="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-indigo-200/40 blur-2xl mix-blend-multiply dark:hidden"></div></div><div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative z-10"><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath2)("/"),
        class: "block max-h-10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(theme).theme === "light" && unref(branding).lightLogoUrl.value || unref(theme).theme === "dark" && unref(branding).darkLogoUrl.value) {
              _push2(`<img${ssrRenderAttr(
                "src",
                (unref(theme).theme === "light" ? unref(branding).lightLogoUrl.value || unref(branding).darkLogoUrl.value : unref(branding).darkLogoUrl.value || unref(branding).lightLogoUrl.value) + (((unref(theme).theme === "light" ? unref(branding).lightLogoUrl.value || unref(branding).darkLogoUrl.value : unref(branding).darkLogoUrl.value || unref(branding).lightLogoUrl.value)?.includes("?") ? "&" : "?") + "v=" + unref(branding).logoVersion.value)
              )}${ssrRenderAttr("alt", localizedSiteName.value + " logo")} class="h-10 w-auto object-contain select-none" draggable="false"${_scopeId}>`);
            } else {
              _push2(`<span class="text-xl font-bold text-gray-900 dark:text-gray-100"${_scopeId}>${ssrInterpolate(localizedSiteName.value)}</span>`);
            }
          } else {
            return [
              unref(theme).theme === "light" && unref(branding).lightLogoUrl.value || unref(theme).theme === "dark" && unref(branding).darkLogoUrl.value ? (openBlock(), createBlock("img", {
                key: 0,
                src: (unref(theme).theme === "light" ? unref(branding).lightLogoUrl.value || unref(branding).darkLogoUrl.value : unref(branding).darkLogoUrl.value || unref(branding).lightLogoUrl.value) + (((unref(theme).theme === "light" ? unref(branding).lightLogoUrl.value || unref(branding).darkLogoUrl.value : unref(branding).darkLogoUrl.value || unref(branding).lightLogoUrl.value)?.includes("?") ? "&" : "?") + "v=" + unref(branding).logoVersion.value),
                alt: localizedSiteName.value + " logo",
                class: "h-10 w-auto object-contain select-none",
                draggable: "false"
              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                key: 1,
                class: "text-xl font-bold text-gray-900 dark:text-gray-100"
              }, toDisplayString$1(localizedSiteName.value), 1))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hidden md:flex items-center gap-2 text-gray-700 dark:text-gray-300" id="nav-links">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath2)("/"),
        class: "nav-pill"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Icon), {
              icon: "mdi:home-outline",
              class: "text-lg"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("nav.home"))}`);
          } else {
            return [
              createVNode(unref(Icon), {
                icon: "mdi:home-outline",
                class: "text-lg"
              }),
              createTextVNode(" " + toDisplayString$1(unref(t)("nav.home")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (categories.value.length) {
        _push(ssrRenderComponent(_sfc_main$8, { categories: categories.value }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath2)("/archive"),
        class: "nav-pill"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Icon), {
              icon: "mdi:archive-outline",
              class: "text-lg"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("nav.archive"))}`);
          } else {
            return [
              createVNode(unref(Icon), {
                icon: "mdi:archive-outline",
                class: "text-lg"
              }),
              createTextVNode(" " + toDisplayString$1(unref(t)("nav.archive")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (role.value === "admin" || role.value === "author") {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath2)("/dashboard"),
          class: "nav-pill"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:view-dashboard-outline",
                class: "text-lg"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("nav.dashboard"))}`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:view-dashboard-outline",
                  class: "text-lg"
                }),
                createTextVNode(" " + toDisplayString$1(unref(t)("nav.dashboard")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="hidden md:flex items-center gap-3 relative">`);
      if (!isInstallPage.value) {
        _push(ssrRenderComponent(_sfc_main$7, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="nav-pill bg-gray-100 dark:bg-gray-700/40 hover:bg-gray-200 dark:hover:bg-gray-700/60">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:magnify",
        class: "text-xl"
      }, null, _parent));
      _push(`<span class="hidden lg:flex items-center text-sm text-gray-500 dark:text-gray-400" dir="ltr">${ssrInterpolate(unref(t)("nav.typeSlash"))} <kbd class="ms-1 me-1 px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700">/</kbd> ${ssrInterpolate(unref(t)("nav.toSearch"))}</span></button>`);
      if (authReady.value) {
        _push(ssrRenderComponent(_sfc_main$9, {
          user: user.value,
          "avatar-url": avatar_url.value
        }, null, _parent));
      } else {
        _push(`<div class="h-9 w-28 rounded-md bg-gray-200/70 dark:bg-gray-700/50 animate-pulse" aria-hidden="true"></div>`);
      }
      _push(`<button class="nav-pill gap-1 bg-gray-100 dark:bg-gray-700/40 hover:bg-gray-200 dark:hover:bg-gray-700/60"${ssrRenderAttr(
        "aria-label",
        unref(theme).theme === "light" ? unref(t)("nav.darkMode") : unref(t)("nav.lightMode")
      )}>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: unref(theme).theme === "light" ? "mdi:weather-night" : "mdi:white-balance-sunny",
        class: "text-xl"
      }, null, _parent));
      _push(`</button></div><button class="md:hidden flex items-center text-gray-700 dark:text-gray-300">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:menu",
        class: "text-2xl"
      }, null, _parent));
      _push(`</button></div>`);
      if (mobileMenuOpen.value) {
        _push(`<div class="mobile-menu md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-4 text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm"><div class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 backdrop-blur shadow-sm"><div class="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">`);
        if (avatar_url.value) {
          _push(`<img${ssrRenderAttr("src", avatar_url.value)} alt="avatar" class="w-full h-full object-cover">`);
        } else {
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:account",
            class: "text-2xl text-gray-500"
          }, null, _parent));
        }
        _push(`</div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">`);
        if (!authReady.value) {
          _push(`<!--[-->…<!--]-->`);
        } else {
          _push(`<!--[-->${ssrInterpolate(user.value?.display_name || user.value?.username || unref(t)("nav.guest"))}<!--]-->`);
        }
        _push(`</p><div class="mt-1 flex flex-wrap items-center gap-1">`);
        if (!authReady.value) {
          _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"> … </span>`);
        } else if (user.value) {
          _push(`<span class="${ssrRenderClass([roleChipClasses.value, "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"])}">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: roleChipIcon.value,
            class: "text-xs"
          }, null, _parent));
          _push(` ${ssrInterpolate(roleLabel.value)}</span>`);
        } else {
          _push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "mdi:account-outline",
            class: "text-xs"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("nav.guest"))}</span>`);
        }
        _push(`</div></div><div class="flex flex-col gap-2">`);
        if (!authReady.value) {
          _push(`<div class="h-8 w-20 rounded-md bg-gray-200/70 dark:bg-gray-700/50 animate-pulse"></div>`);
        } else {
          _push(`<!--[-->`);
          if (!user.value) {
            _push(`<button class="h-8 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60">${ssrInterpolate(unref(t)("nav.login"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          if (!user.value) {
            _push(`<button class="h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60">${ssrInterpolate(unref(t)("nav.signup"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          if (user.value) {
            _push(`<button class="h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60">${ssrInterpolate(unref(t)("nav.profile"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div></div><div class="flex flex-col gap-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath2)("/"),
          class: "flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline text-gray-700 dark:text-gray-300",
          onClick: ($event) => go("/")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:home-outline",
                class: "text-gray-700 dark:text-gray-300"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-gray-700 dark:text-gray-300"${_scopeId}>${ssrInterpolate(unref(t)("nav.home"))}</span>`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:home-outline",
                  class: "text-gray-700 dark:text-gray-300"
                }),
                createVNode("span", { class: "text-gray-700 dark:text-gray-300" }, toDisplayString$1(unref(t)("nav.home")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="relative"><button class="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60"><span class="flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Icon), { icon: "mdi:tag-outline" }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("nav.categories"))}</span>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: mobileCategoriesOpen.value ? "mdi:chevron-up" : "mdi:chevron-down",
          class: "text-xl"
        }, null, _parent));
        _push(`</button>`);
        if (mobileCategoriesOpen.value) {
          _push(`<div class="mt-2 ml-2 flex flex-col gap-1 text-sm"><!--[-->`);
          ssrRenderList(categories.value, (category) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: category.id,
              to: unref(localePath2)(`/category/${category.slug || category.name}`),
              class: "flex items-center gap-2 h-8 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700/60",
              onClick: ($event) => go(`/category/${category.slug || category.name}`)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(Icon), {
                    icon: "mdi:tag-outline",
                    class: "text-gray-700 dark:text-gray-300"
                  }, null, _parent2, _scopeId));
                  _push2(`<span class="text-gray-700 dark:text-gray-300"${_scopeId}>${ssrInterpolate(category.name)}</span>`);
                } else {
                  return [
                    createVNode(unref(Icon), {
                      icon: "mdi:tag-outline",
                      class: "text-gray-700 dark:text-gray-300"
                    }),
                    createVNode("span", { class: "text-gray-700 dark:text-gray-300" }, toDisplayString$1(category.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath2)("/archive"),
          class: "flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline text-gray-700 dark:text-gray-300",
          onClick: ($event) => go("/archive")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: "mdi:archive-outline",
                class: "text-gray-700 dark:text-gray-300"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-gray-700 dark:text-gray-300"${_scopeId}>${ssrInterpolate(unref(t)("nav.archive"))}</span>`);
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: "mdi:archive-outline",
                  class: "text-gray-700 dark:text-gray-300"
                }),
                createVNode("span", { class: "text-gray-700 dark:text-gray-300" }, toDisplayString$1(unref(t)("nav.archive")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (role.value === "admin" || role.value === "author") {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(localePath2)("/dashboard"),
            class: "flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline",
            onClick: ($event) => go("/dashboard")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Icon), {
                  icon: "mdi:view-dashboard-outline",
                  class: "text-gray-700 dark:text-gray-300"
                }, null, _parent2, _scopeId));
                _push2(`<span class="text-gray-700 dark:text-gray-300"${_scopeId}>${ssrInterpolate(unref(t)("nav.dashboard"))}</span>`);
              } else {
                return [
                  createVNode(unref(Icon), {
                    icon: "mdi:view-dashboard-outline",
                    class: "text-gray-700 dark:text-gray-300"
                  }),
                  createVNode("span", { class: "text-gray-700 dark:text-gray-300" }, toDisplayString$1(unref(t)("nav.dashboard")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-3 border-t pt-4 border-gray-200 dark:border-gray-700"><button class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline">`);
        _push(ssrRenderComponent(unref(Icon), { icon: "mdi:magnify" }, null, _parent));
        _push(`<span>${ssrInterpolate(unref(t)("nav.search"))}</span><kbd class="ml-auto px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm">/</kbd></button>`);
        if (!isInstallPage.value && mobileLocales.value.length > 1) {
          _push(`<div class="relative"><button type="button" class="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60"><span class="flex items-center gap-2">`);
          _push(ssrRenderComponent(unref(Icon), { icon: "mdi:translate" }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("locale.switch"))}</span>`);
          _push(ssrRenderComponent(unref(Icon), {
            icon: mobileLocalesOpen.value ? "mdi:chevron-up" : "mdi:chevron-down",
            class: "text-xl"
          }, null, _parent));
          _push(`</button>`);
          if (mobileLocalesOpen.value) {
            _push(`<div class="mt-2 ml-2 flex flex-col gap-1 text-sm"><!--[-->`);
            ssrRenderList(mobileLocales.value, (loc) => {
              _push(`<button type="button" class="flex items-center gap-2 h-8 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700/60 w-full text-start">`);
              _push(ssrRenderComponent(unref(Icon), {
                icon: "mdi:translate",
                class: "text-gray-700 dark:text-gray-300"
              }, null, _parent));
              _push(`<span class="text-gray-700 dark:text-gray-300">${ssrInterpolate(loc.name)}</span></button>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: unref(theme).theme === "light" ? "mdi:weather-night" : "mdi:white-balance-sunny"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(theme).theme === "light" ? unref(t)("nav.darkMode") : unref(t)("nav.lightMode"))}</button>`);
        if (user.value) {
          _push(`<button class="flex items-center gap-2 h-10 px-3 rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 no-underline">`);
          _push(ssrRenderComponent(unref(Icon), { icon: "mdi:logout" }, null, _parent));
          _push(` ${ssrInterpolate(unref(t)("nav.logout"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav>`);
      _push(ssrRenderComponent(GlobalSearch, {
        modelValue: showSearch.value,
        "onUpdate:modelValue": ($event) => showSearch.value = $event,
        "initial-query": initialSearchQuery.value
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Navbar.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
let projectName = "";
let projectDescription = "";
const projectInfo = {
  get name() {
    return projectName;
  },
  get description() {
    return projectDescription;
  },
  applyBranding(branding) {
    if (branding && Object.prototype.hasOwnProperty.call(branding, "siteName")) {
      projectName = branding.siteName || "";
    }
    if (branding && Object.prototype.hasOwnProperty.call(branding, "siteDescription")) {
      projectDescription = branding.siteDescription || "";
    }
    if (Array.isArray(branding?.socialLinks)) {
      this.socialLinks = Object.fromEntries(branding.socialLinks.filter((l) => l.url).map((l) => [l.label, { url: l.url, icon: l.icon || "mdi:link-variant" }]));
    }
  }
};
function buildFeedSearchParams({
  locale,
  primaryLocale: primaryLocale2 = "en",
  category,
  author,
  tag,
  alwaysIncludeLocale = false
} = {}) {
  const params = new URLSearchParams();
  const code = typeof locale === "string" ? locale.trim().toLowerCase() : "";
  const primary = typeof primaryLocale2 === "string" ? primaryLocale2.trim().toLowerCase() : "en";
  if (code && (alwaysIncludeLocale || code !== primary)) {
    params.set("locale", code);
  }
  if (category) params.set("category", category);
  if (author) params.set("author", author);
  if (tag) params.set("tag", tag);
  return params;
}
function feedHref(path, options = {}) {
  const params = buildFeedSearchParams(options);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
function rssHref(options = {}) {
  return feedHref("/rss.xml", options);
}
function sitemapHref(options = {}) {
  return feedHref("/sitemap.xml", options);
}
const _sfc_main$4 = {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const branding = useBranding();
    const siteTitle = computed(
      () => branding.resolveLocalizedSiteName(locale.value) || ""
    );
    const localizedDescription = computed(
      () => branding.resolveLocalizedSiteDescription(locale.value) || ""
    );
    const credits = computed(() => ({
      ...DEFAULT_FOOTER_CREDITS,
      ...branding.footerCredits?.value || {}
    }));
    const showCreditsRow = computed(
      () => credits.value.plumaWatermark || credits.value.rss || credits.value.sitemap
    );
    const feedOptions = computed(() => ({
      locale: locale.value,
      primaryLocale: branding.primaryLocale?.value || "en"
    }));
    const rssFeedHref = computed(() => rssHref(feedOptions.value));
    const sitemapFeedHref = computed(() => sitemapHref(feedOptions.value));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "relative mt-20 border-t border-gray-200 dark:border-gray-800 overflow-hidden" }, _attrs))}><div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div><div class="absolute inset-0 z-0 bg-white/40 dark:bg-gray-900/55 backdrop-blur-md supports-[backdrop-filter]:bg-white/25 supports-[backdrop-filter]:dark:bg-gray-900/45"></div><div class="pointer-events-none absolute -top-16 -right-24 w-72 h-72 rounded-full bg-blue-200/35 blur-3xl mix-blend-multiply dark:hidden"></div><div class="pointer-events-none absolute -bottom-24 -left-32 w-80 h-80 rounded-full bg-indigo-200/40 blur-3xl mix-blend-multiply dark:hidden"></div><div class="relative z-10 max-w-6xl mx-auto px-6 py-10"><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8"><div><h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:feather",
        class: "text-blue-500"
      }, null, _parent));
      _push(` ${ssrInterpolate(siteTitle.value)}</h2><p class="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-sm">${ssrInterpolate(localizedDescription.value)}</p></div>`);
      if (unref(branding).socialLinks.value && unref(branding).socialLinks.value.length || Object.keys(unref(projectInfo).socialLinks || {}).length) {
        _push(`<div class="md:text-right"><span class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500">${ssrInterpolate(unref(t)("footer.follow"))}</span><div class="mt-3 flex flex-wrap md:justify-end gap-3">`);
        if ((unref(branding).socialLinks.value || []).length) {
          _push(`<!--[-->`);
          ssrRenderList(unref(branding).socialLinks.value, (sl) => {
            _push(`<a${ssrRenderAttr("href", sl.url)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition"${ssrRenderAttr("title", sl.label)}>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: sl.icon || "mdi:link-variant",
              class: "w-5 h-5"
            }, null, _parent));
            _push(`</a>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(unref(projectInfo).socialLinks, (link, name) => {
            _push(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition"${ssrRenderAttr("title", name)}>`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: link.icon,
              class: "w-5 h-5"
            }, null, _parent));
            _push(`</a>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-[12px] text-gray-500 dark:text-gray-500"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} ${ssrInterpolate(siteTitle.value)}. ${ssrInterpolate(unref(t)("footer.rights"))}</div>`);
      if (showCreditsRow.value) {
        _push(`<div class="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[11px]">`);
        if (credits.value.plumaWatermark) {
          _push(`<p class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-gray-500 dark:text-gray-500"><span>${ssrInterpolate(unref(t)("footer.poweredBy"))}</span><a href="https://github.com/Daryan97/pluma" target="_blank" rel="noopener" class="font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"> Pluma </a></p>`);
        } else {
          _push(`<!---->`);
        }
        if (credits.value.rss || credits.value.sitemap) {
          _push(`<div class="flex items-center gap-3 ms-auto">`);
          if (credits.value.rss) {
            _push(`<a${ssrRenderAttr("href", rssFeedHref.value)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:rss",
              class: "text-sm"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("footer.rss"))}</a>`);
          } else {
            _push(`<!---->`);
          }
          if (credits.value.sitemap) {
            _push(`<a${ssrRenderAttr("href", sitemapFeedHref.value)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">`);
            _push(ssrRenderComponent(unref(Icon), {
              icon: "mdi:map-outline",
              class: "text-sm"
            }, null, _parent));
            _push(` ${ssrInterpolate(unref(t)("footer.sitemap"))}</a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></footer>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Footer.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const useRouteLoadingStore = defineStore("routeLoading", () => {
  const isLoading = ref(false);
  let hideTimeout = null;
  function start() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    isLoading.value = true;
  }
  function stop() {
    hideTimeout = setTimeout(() => {
      isLoading.value = false;
      hideTimeout = null;
    }, 180);
  }
  return {
    isLoading,
    start,
    stop
  };
});
const _sfc_main$3 = {
  __name: "RouteLoadingOverlay",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const { isLoading } = storeToRefs(useRouteLoadingStore());
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(isLoading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "fixed inset-0 z-50 overflow-hidden bg-white dark:bg-gray-900",
          role: "status",
          "aria-live": "polite",
          "aria-label": unref(t)("common.loading")
        }, _attrs))} data-v-60a01d39><div class="h-16 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between gap-4 animate-pulse" data-v-60a01d39><div class="flex items-center gap-3" data-v-60a01d39><div class="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div></div><div class="hidden sm:flex items-center gap-3" data-v-60a01d39><div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div></div></div><div class="max-w-6xl mx-auto px-4 pt-16 pb-10 animate-pulse" data-v-60a01d39><div class="flex flex-col items-center gap-6" data-v-60a01d39><div class="h-4 w-40 rounded-full bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="h-10 w-2/3 max-w-xl rounded-lg bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="h-4 w-1/2 max-w-md rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="h-12 w-full max-w-xl rounded-xl bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div></div></div><div class="max-w-5xl mx-auto px-4 space-y-8 animate-pulse" data-v-60a01d39><!--[-->`);
        ssrRenderList(2, (n) => {
          _push(`<div class="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden" data-v-60a01d39><div class="aspect-[16/7] bg-gray-200 dark:bg-gray-800" data-v-60a01d39></div><div class="p-6 space-y-4" data-v-60a01d39><div class="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="flex gap-3" data-v-60a01d39><div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div></div><div class="space-y-2" data-v-60a01d39><div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="h-3 w-11/12 rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div><div class="h-3 w-4/5 rounded bg-gray-200 dark:bg-gray-700" data-v-60a01d39></div></div></div></div>`);
        });
        _push(`<!--]--></div><span class="sr-only" data-v-60a01d39>${ssrInterpolate(unref(t)("common.loading"))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RouteLoadingOverlay.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const RouteLoadingOverlay = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-60a01d39"]]);
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { locale, locales, setLocale } = useI18n();
    const branding = useBranding();
    [__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "site-branding",
      async () => {
        await branding.fetchBranding(true);
        return true;
      },
      { server: true, lazy: false }
    )), await __temp, __restore();
    applyLocalizedBranding();
    watch(
      () => branding.faviconUrl?.value,
      (href) => {
        useHead({
          link: [{ rel: "icon", href: href || "/favicon.png", key: "favicon" }]
        });
      },
      { immediate: true }
    );
    async function clampLocaleToEnabled() {
      const code = unref(locale);
      const enabled = branding.enabledLocales?.value;
      const fallback = Array.isArray(enabled) && enabled.includes("en") ? "en" : branding.primaryLocale?.value || "en";
      if (!Array.isArray(enabled) || !enabled.length) return;
      if (enabled.includes(code)) return;
      if (fallback !== code) {
        const cookie = useCookie("pluma_locale", { sameSite: "lax", path: "/" });
        cookie.value = fallback;
        await setLocale(fallback);
      }
    }
    function applyLocalizedBranding() {
      projectInfo.applyBranding({
        siteName: branding.resolveLocalizedSiteName(unref(locale)),
        siteDescription: branding.resolveLocalizedSiteDescription(unref(locale)),
        socialLinks: branding.socialLinks.value
      });
    }
    watch(
      () => [
        unref(locale),
        branding.siteName?.value,
        branding.siteDescription?.value,
        branding.metaTranslations?.value,
        branding.socialLinks?.value
      ],
      () => {
        if (branding.brandingLoaded?.value) applyLocalizedBranding();
      },
      { deep: true }
    );
    watch(
      () => [branding.enabledLocales?.value, branding.primaryLocale?.value],
      () => {
        if (branding.brandingLoaded?.value) clampLocaleToEnabled();
      },
      { deep: true }
    );
    watch(
      locale,
      (code) => {
        const meta = unref(locales)?.find?.((l) => l.code === code);
        useHead({
          htmlAttrs: {
            lang: code,
            dir: meta?.dir || "ltr"
          }
        });
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900" }, _attrs))}>`);
      _push(ssrRenderComponent(RouteLoadingOverlay, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(`<main>`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    useLocalePath();
    const statusCode = computed(() => Number(props.error?.statusCode) || 500);
    const kind = computed(() => {
      const code = statusCode.value;
      if (code === 404) return "404";
      if (code === 401 || code === 403) return "403";
      if (code >= 500) return "500";
      return "generic";
    });
    const title = computed(() => t(`error.${kind.value}.title`));
    const description = computed(() => {
      const custom = props.error?.statusMessage || props.error?.message;
      if (kind.value === "generic" && custom && !/^Page not found$/i.test(custom)) {
        return custom;
      }
      return t(`error.${kind.value}.description`);
    });
    const icon = computed(() => {
      switch (kind.value) {
        case "404":
          return "mdi:map-search-outline";
        case "403":
          return "mdi:lock-outline";
        case "500":
          return "mdi:server-network-off";
        default:
          return "mdi:alert-circle-outline";
      }
    });
    const devDetail = computed(() => {
      return "";
    });
    useHead(() => ({
      title: `${statusCode.value} · ${title.value} | ${projectInfo.name}`,
      meta: [{ name: "robots", content: "noindex" }]
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(`<main><section class="relative overflow-hidden min-h-[70vh] flex items-center"><div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div><div class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div><div class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"></div><div class="max-w-3xl mx-auto px-4 py-20 lg:py-28 w-full text-center"><p class="text-7xl md:text-8xl font-extrabold tracking-tight tabular-nums bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white" aria-hidden="true">${ssrInterpolate(unref(statusCode))}</p><div class="mx-auto mt-4 mb-8 w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: unref(icon),
        class: "text-3xl"
      }, null, _parent));
      _push(`</div><h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">${ssrInterpolate(unref(title))}</h1><p class="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">${ssrInterpolate(unref(description))}</p>`);
      if (unref(devDetail)) {
        _push(`<p class="mt-4 text-left text-xs font-mono text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2 max-w-xl mx-auto break-words">${ssrInterpolate(unref(devDetail))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-10 flex flex-wrap items-center justify-center gap-3"><button type="button" class="inline-flex items-center gap-2 h-10 px-5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:home-outline",
        class: "text-lg"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("error.goHome"))}</button><button type="button" class="inline-flex items-center gap-2 h-10 px-5 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition">`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "mdi:arrow-left",
        class: "text-lg"
      }, null, _parent));
      _push(` ${ssrInterpolate(unref(t)("error.goBack"))}</button>`);
      if (unref(statusCode) >= 500) {
        _push(`<button type="button" class="inline-flex items-center gap-2 h-10 px-5 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "mdi:refresh",
          class: "text-lg"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("error.tryAgain"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section></main>`);
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    function invokeAppErrorHandler(err, target, info) {
      const errorHandler = nuxtApp.vueApp.config.errorHandler;
      if (errorHandler && !errorHandler.__nuxt_default) {
        try {
          errorHandler(err, target, info);
        } catch (handlerError) {
          console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
        }
      }
    }
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        invokeAppErrorHandler(err, target, info);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

export { CONTENT_LOCALES as C, DEFAULT_FOOTER_CREDITS as D, _export_sfc as _, useLocalePath as a, useContentLocale as b, useCookie as c, useBranding as d, entry_default as default, useRuntimeConfig as e, useAsyncData as f, __nuxt_component_0$1 as g, useHead as h, getRuntimeEnvSync as i, fetchBranding as j, useRoute as k, useRequestEvent as l, allConfiguredLocaleCodes as m, normalizeLocaleSettings as n, localizePath as o, projectInfo as p, absoluteAssetUrl as q, resolveSeoImage as r, supabase as s, robotsForClientPath as t, useI18n as u, resolveTwitterSite as v, buildHreflangs as w, useSeoMeta as x, stripLocalePrefix as y };
//# sourceMappingURL=server.mjs.map
