/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./example.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../index.js":
/*!*******************!*\
  !*** ../index.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* global BABYLON */\n\n//Optional support for loading json remotely\nif (true) {\n\tmodule.exports = Atlas\n\n\tvar loader = __webpack_require__(/*! load-json-xhr */ \"../node_modules/load-json-xhr/index.js\")\n} else { var loader; }\n\n\n\n\n/*\n*  Atlas constructor - keeps the json data and a base texture\n*/\n\n\nfunction Atlas(imgURL, jsonURL, scene, BAB, noMip, sampling) {\n\tif (!(this instanceof Atlas)) {\n\t\treturn new Atlas(imgURL, jsonURL, scene, BAB, noMip, sampling)\n\t}\n\n\tthis._ready = false\n\tthis._scene = scene\n\tthis._BABYLON = BAB\n\tthis._data = null\n\n\tthis.frames = []\n\n\tvar dataReady = false\n\tvar texReady = false\n\tvar self = this\n\n\t// json loader and event\n\tif (typeof jsonURL === 'string') {\n\t\tloader(jsonURL, function (err, data) {\n\t\t\tif (err) throw err\n\t\t\tself._data = data\n\t\t\tinitData(self)\n\t\t})\n\t} else if (typeof jsonURL === 'object') {\n\t\t// if passed an object, assume it's the JSON\n\t\tself._data = jsonURL\n\t\tinitData(self)\n\t}\n\n\t// texture loader and event\n\tthis._baseTexture = new BAB.Texture(imgURL, scene, noMip, true, sampling)\n\n\t// atlas will almost always need alpha\n\tthis._baseTexture.hasAlpha = true\n}\n\n// called once json + image are both loaded\n/* Expects json like:\n\t{\"frames\":{\n\t\t\"frame_001\": {\"frame\": {\"x\":0, \"y\":32,\"w\":22,\"h\":18} },\n\t\t\"frame_002\": {\"frame\": {\"x\":53,\"y\":0, \"w\":22,\"h\":21} }\n\t}}\n*/\nfunction initData(self) {\n\tvar list = Object.keys(self._data.frames)\n\tfor (var i = 0; i < list.length; i++) {\n\t\tself.frames.push(list[i])\n\t}\n\tself._ready = true\n}\n\n\n\n\n\n/*\n*\n*    API\n* \n*/\n\n// return a plane-like sprite mesh showing the given atlas frame\n\nAtlas.prototype.makeSpriteMesh = function (frame, material) {\n\tvar BAB = this._BABYLON\n\tif (!frame) frame = 0\n\n\t// make a material unless one was passed in\n\tif (!material) {\n\t\tmaterial = new BAB.StandardMaterial('spriteMat', this._scene)\n\t\tmaterial.specularColor = new BAB.Color3(0, 0, 0)\n\t\tmaterial.emissiveColor = new BAB.Color3(1, 1, 1)\n\t\tmaterial.backFaceCulling = false\n\t}\n\n\t// basic plane mesh\n\tvar mesh = this._BABYLON.Mesh.CreatePlane('atlas sprite', 1, this._scene, true)\n\tmesh.material = material\n\tmesh.material.diffuseTexture = this._baseTexture\n\tmesh._currentAtlasFrame = null\n\n\t// set to correct frame\n\tthis.setMeshFrame(mesh, frame)\n\n\treturn mesh\n}\n\n\n\n// public accessor to set a created mesh's frame\nAtlas.prototype.setMeshFrame = function (mesh, frame) {\n\tif (frame === mesh._currentAtlasFrame) return\n\n\t// defer if needed\n\tif (!this._ready) {\n\t\tvar self = this\n\t\tsetTimeout(function () { self.setMeshFrame(mesh, frame) }, 10)\n\t\treturn\n\t} else {\n\t\tvar frameDat = getFrameData(this, frame)\n\t\tsetMeshUVs(this, mesh, frameDat)\n\t\tmesh._currentAtlasFrame = frame\n\t}\n}\n\n\n\n// Create a texture with the right uv settings for a given frame\n\nAtlas.prototype.makeSpriteTexture = function (frame) {\n\tvar tex = this._baseTexture.clone()\n\tthis.setTextureFrame(tex, frame)\n\treturn tex\n}\n\n\n\n// Set a created texture's uv settings to the given frame\n\nAtlas.prototype.setTextureFrame = function (tex, frame) {\n\t// defer if needed\n\tif (!this._ready) {\n\t\tvar self = this\n\t\tsetTimeout(function () { self.setTextureFrame(tex, frame) }, 10)\n\t\treturn\n\t} else {\n\t\tvar frameDat = getFrameData(this, frame)\n\t\tsetTextureUVs(this, tex, frameDat)\n\t}\n}\n\n\n\n\n// dispose method - disposes babylon objects\n\nAtlas.prototype.dispose = function () {\n\tthis._baseTexture.dispose()\n\tthis._data = null\n\tthis._scene = null\n\tthis._BABYLON = null\n\tthis.frames.length = 0\n}\n\n\n\n\n\n/*\n* \n*      Internals\n* \n*/\n\n\n// interpret string or number frame value, and return frame data from JSON\n\nfunction getFrameData(self, frame) {\n\tvar framestr = ''\n\tif (typeof frame === 'number') {\n\t\tframestr = self.frames[frame]\n\t} else {\n\t\tframestr = frame\n\t}\n\tvar dat = self._data.frames[framestr]\n\tif (!dat) {\n\t\tthrow new Error('babylon-atlas: frame \"' + framestr + '\" not found in atlas')\n\t}\n\n\treturn dat\n}\n\n\n\n\n// This is where the magic happens - for a given frame's x/y/width/height, \n// set the plane mesh's UVs to display that part of the texture\n\nfunction setMeshUVs(self, mesh, frameDat) {\n\tvar sw = self._data.meta.size.w\n\tvar sh = self._data.meta.size.h\n\tvar x = frameDat.frame.x / sw\n\tvar y = frameDat.frame.y / sh\n\tvar w = frameDat.frame.w / sw\n\tvar h = frameDat.frame.h / sh\n\n\tvar uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind)\n\tuvs[0] = x\n\tuvs[1] = 1 - y - h\n\tuvs[2] = x + w\n\tuvs[3] = 1 - y - h\n\tuvs[4] = x + w\n\tuvs[5] = 1 - y\n\tuvs[6] = x\n\tuvs[7] = 1 - y\n\tmesh.updateVerticesData(BABYLON.VertexBuffer.UVKind, uvs)\n}\n\n\n// Same thing but for textures\n\nfunction setTextureUVs(self, tex, frameDat) {\n\tvar sw = self._data.meta.size.w\n\tvar sh = self._data.meta.size.h\n\tvar x = frameDat.frame.x\n\tvar y = frameDat.frame.y\n\tvar w = frameDat.frame.w\n\tvar h = frameDat.frame.h\n\n\t// in Babylon 2.2 and below:\n\t// tex.uScale = w/sw\n\t// tex.vScale = h/sh\n\t// tex.uOffset = ( sw /2 - x)/w - 0.5\n\t// tex.vOffset = (-sh/2 + y)/h + 0.5\n\n\t// Babylon 2.3 and above:\n\ttex.uScale = w / sw\n\ttex.vScale = h / sh\n\ttex.uOffset = x / sw\n\ttex.vOffset = (sh - y - h) / sh\n}\n\n\n\n\n\n\n//# sourceURL=webpack:///../index.js?");

/***/ }),

/***/ "../node_modules/for-each/index.js":
/*!*****************************************!*\
  !*** ../node_modules/for-each/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var isFunction = __webpack_require__(/*! is-function */ \"../node_modules/is-function/index.js\")\n\nmodule.exports = forEach\n\nvar toString = Object.prototype.toString\nvar hasOwnProperty = Object.prototype.hasOwnProperty\n\nfunction forEach(list, iterator, context) {\n    if (!isFunction(iterator)) {\n        throw new TypeError('iterator must be a function')\n    }\n\n    if (arguments.length < 3) {\n        context = this\n    }\n    \n    if (toString.call(list) === '[object Array]')\n        forEachArray(list, iterator, context)\n    else if (typeof list === 'string')\n        forEachString(list, iterator, context)\n    else\n        forEachObject(list, iterator, context)\n}\n\nfunction forEachArray(array, iterator, context) {\n    for (var i = 0, len = array.length; i < len; i++) {\n        if (hasOwnProperty.call(array, i)) {\n            iterator.call(context, array[i], i, array)\n        }\n    }\n}\n\nfunction forEachString(string, iterator, context) {\n    for (var i = 0, len = string.length; i < len; i++) {\n        // no such thing as a sparse string.\n        iterator.call(context, string.charAt(i), i, string)\n    }\n}\n\nfunction forEachObject(object, iterator, context) {\n    for (var k in object) {\n        if (hasOwnProperty.call(object, k)) {\n            iterator.call(context, object[k], k, object)\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///../node_modules/for-each/index.js?");

/***/ }),

/***/ "../node_modules/global/window.js":
/*!****************************************!*\
  !*** ../node_modules/global/window.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(global) {var win;\n\nif (typeof window !== \"undefined\") {\n    win = window;\n} else if (typeof global !== \"undefined\") {\n    win = global;\n} else if (typeof self !== \"undefined\"){\n    win = self;\n} else {\n    win = {};\n}\n\nmodule.exports = win;\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ \"../node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///../node_modules/global/window.js?");

/***/ }),

/***/ "../node_modules/is-function/index.js":
/*!********************************************!*\
  !*** ../node_modules/is-function/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = isFunction\n\nvar toString = Object.prototype.toString\n\nfunction isFunction (fn) {\n  var string = toString.call(fn)\n  return string === '[object Function]' ||\n    (typeof fn === 'function' && string !== '[object RegExp]') ||\n    (typeof window !== 'undefined' &&\n     // IE8 and below\n     (fn === window.setTimeout ||\n      fn === window.alert ||\n      fn === window.confirm ||\n      fn === window.prompt))\n};\n\n\n//# sourceURL=webpack:///../node_modules/is-function/index.js?");

/***/ }),

/***/ "../node_modules/load-json-xhr/index.js":
/*!**********************************************!*\
  !*** ../node_modules/load-json-xhr/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var xhr = __webpack_require__(/*! xhr */ \"../node_modules/xhr/index.js\");\n\nmodule.exports = function getJSON(opt, cb) {\n  cb = typeof cb === 'function' ? cb : noop;\n\n  if (typeof opt === 'string')\n    opt = { uri: opt };\n  else if (!opt)\n    opt = { };\n\n  // if (!opt.headers)\n  //   opt.headers = { \"Content-Type\": \"application/json\" };\n\n  var jsonResponse = /^json$/i.test(opt.responseType);\n  return xhr(opt, function(err, res, body) {\n    if (err)\n      return cb(err);\n    if (!/^2/.test(res.statusCode))\n      return cb(new Error('http status code: ' + res.statusCode));\n\n    if (jsonResponse) { \n      cb(null, body);\n    } else {\n      var data;\n      try {\n        data = JSON.parse(body);\n      } catch (e) {\n        cb(new Error('cannot parse json: ' + e));\n      }\n      if(data) cb(null, data);\n    }\n  })\n}\n\nfunction noop() {}\n\n//# sourceURL=webpack:///../node_modules/load-json-xhr/index.js?");

/***/ }),

/***/ "../node_modules/parse-headers/parse-headers.js":
/*!******************************************************!*\
  !*** ../node_modules/parse-headers/parse-headers.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var trim = __webpack_require__(/*! trim */ \"../node_modules/trim/index.js\")\n  , forEach = __webpack_require__(/*! for-each */ \"../node_modules/for-each/index.js\")\n  , isArray = function(arg) {\n      return Object.prototype.toString.call(arg) === '[object Array]';\n    }\n\nmodule.exports = function (headers) {\n  if (!headers)\n    return {}\n\n  var result = {}\n\n  forEach(\n      trim(headers).split('\\n')\n    , function (row) {\n        var index = row.indexOf(':')\n          , key = trim(row.slice(0, index)).toLowerCase()\n          , value = trim(row.slice(index + 1))\n\n        if (typeof(result[key]) === 'undefined') {\n          result[key] = value\n        } else if (isArray(result[key])) {\n          result[key].push(value)\n        } else {\n          result[key] = [ result[key], value ]\n        }\n      }\n  )\n\n  return result\n}\n\n//# sourceURL=webpack:///../node_modules/parse-headers/parse-headers.js?");

/***/ }),

/***/ "../node_modules/trim/index.js":
/*!*************************************!*\
  !*** ../node_modules/trim/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nexports = module.exports = trim;\n\nfunction trim(str){\n  return str.replace(/^\\s*|\\s*$/g, '');\n}\n\nexports.left = function(str){\n  return str.replace(/^\\s*/, '');\n};\n\nexports.right = function(str){\n  return str.replace(/\\s*$/, '');\n};\n\n\n//# sourceURL=webpack:///../node_modules/trim/index.js?");

/***/ }),

/***/ "../node_modules/webpack/buildin/global.js":
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\r\n\r\n// This works in non-strict mode\r\ng = (function() {\r\n\treturn this;\r\n})();\r\n\r\ntry {\r\n\t// This works if eval is allowed (see CSP)\r\n\tg = g || Function(\"return this\")() || (1, eval)(\"this\");\r\n} catch (e) {\r\n\t// This works if the window reference is available\r\n\tif (typeof window === \"object\") g = window;\r\n}\r\n\r\n// g can still be undefined, but nothing to do about it...\r\n// We return undefined, instead of nothing here, so it's\r\n// easier to handle this case. if(!global) { ...}\r\n\r\nmodule.exports = g;\r\n\n\n//# sourceURL=webpack:///../node_modules/webpack/buildin/global.js?");

/***/ }),

/***/ "../node_modules/xhr/index.js":
/*!************************************!*\
  !*** ../node_modules/xhr/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar window = __webpack_require__(/*! global/window */ \"../node_modules/global/window.js\")\nvar isFunction = __webpack_require__(/*! is-function */ \"../node_modules/is-function/index.js\")\nvar parseHeaders = __webpack_require__(/*! parse-headers */ \"../node_modules/parse-headers/parse-headers.js\")\nvar xtend = __webpack_require__(/*! xtend */ \"../node_modules/xtend/immutable.js\")\n\nmodule.exports = createXHR\ncreateXHR.XMLHttpRequest = window.XMLHttpRequest || noop\ncreateXHR.XDomainRequest = \"withCredentials\" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest\n\nforEachArray([\"get\", \"put\", \"post\", \"patch\", \"head\", \"delete\"], function(method) {\n    createXHR[method === \"delete\" ? \"del\" : method] = function(uri, options, callback) {\n        options = initParams(uri, options, callback)\n        options.method = method.toUpperCase()\n        return _createXHR(options)\n    }\n})\n\nfunction forEachArray(array, iterator) {\n    for (var i = 0; i < array.length; i++) {\n        iterator(array[i])\n    }\n}\n\nfunction isEmpty(obj){\n    for(var i in obj){\n        if(obj.hasOwnProperty(i)) return false\n    }\n    return true\n}\n\nfunction initParams(uri, options, callback) {\n    var params = uri\n\n    if (isFunction(options)) {\n        callback = options\n        if (typeof uri === \"string\") {\n            params = {uri:uri}\n        }\n    } else {\n        params = xtend(options, {uri: uri})\n    }\n\n    params.callback = callback\n    return params\n}\n\nfunction createXHR(uri, options, callback) {\n    options = initParams(uri, options, callback)\n    return _createXHR(options)\n}\n\nfunction _createXHR(options) {\n    if(typeof options.callback === \"undefined\"){\n        throw new Error(\"callback argument missing\")\n    }\n\n    var called = false\n    var callback = function cbOnce(err, response, body){\n        if(!called){\n            called = true\n            options.callback(err, response, body)\n        }\n    }\n\n    function readystatechange() {\n        if (xhr.readyState === 4) {\n            setTimeout(loadFunc, 0)\n        }\n    }\n\n    function getBody() {\n        // Chrome with requestType=blob throws errors arround when even testing access to responseText\n        var body = undefined\n\n        if (xhr.response) {\n            body = xhr.response\n        } else {\n            body = xhr.responseText || getXml(xhr)\n        }\n\n        if (isJson) {\n            try {\n                body = JSON.parse(body)\n            } catch (e) {}\n        }\n\n        return body\n    }\n\n    function errorFunc(evt) {\n        clearTimeout(timeoutTimer)\n        if(!(evt instanceof Error)){\n            evt = new Error(\"\" + (evt || \"Unknown XMLHttpRequest Error\") )\n        }\n        evt.statusCode = 0\n        return callback(evt, failureResponse)\n    }\n\n    // will load the data & process the response in a special response object\n    function loadFunc() {\n        if (aborted) return\n        var status\n        clearTimeout(timeoutTimer)\n        if(options.useXDR && xhr.status===undefined) {\n            //IE8 CORS GET successful response doesn't have a status field, but body is fine\n            status = 200\n        } else {\n            status = (xhr.status === 1223 ? 204 : xhr.status)\n        }\n        var response = failureResponse\n        var err = null\n\n        if (status !== 0){\n            response = {\n                body: getBody(),\n                statusCode: status,\n                method: method,\n                headers: {},\n                url: uri,\n                rawRequest: xhr\n            }\n            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE\n                response.headers = parseHeaders(xhr.getAllResponseHeaders())\n            }\n        } else {\n            err = new Error(\"Internal XMLHttpRequest Error\")\n        }\n        return callback(err, response, response.body)\n    }\n\n    var xhr = options.xhr || null\n\n    if (!xhr) {\n        if (options.cors || options.useXDR) {\n            xhr = new createXHR.XDomainRequest()\n        }else{\n            xhr = new createXHR.XMLHttpRequest()\n        }\n    }\n\n    var key\n    var aborted\n    var uri = xhr.url = options.uri || options.url\n    var method = xhr.method = options.method || \"GET\"\n    var body = options.body || options.data\n    var headers = xhr.headers = options.headers || {}\n    var sync = !!options.sync\n    var isJson = false\n    var timeoutTimer\n    var failureResponse = {\n        body: undefined,\n        headers: {},\n        statusCode: 0,\n        method: method,\n        url: uri,\n        rawRequest: xhr\n    }\n\n    if (\"json\" in options && options.json !== false) {\n        isJson = true\n        headers[\"accept\"] || headers[\"Accept\"] || (headers[\"Accept\"] = \"application/json\") //Don't override existing accept header declared by user\n        if (method !== \"GET\" && method !== \"HEAD\") {\n            headers[\"content-type\"] || headers[\"Content-Type\"] || (headers[\"Content-Type\"] = \"application/json\") //Don't override existing accept header declared by user\n            body = JSON.stringify(options.json === true ? body : options.json)\n        }\n    }\n\n    xhr.onreadystatechange = readystatechange\n    xhr.onload = loadFunc\n    xhr.onerror = errorFunc\n    // IE9 must have onprogress be set to a unique function.\n    xhr.onprogress = function () {\n        // IE must die\n    }\n    xhr.onabort = function(){\n        aborted = true;\n    }\n    xhr.ontimeout = errorFunc\n    xhr.open(method, uri, !sync, options.username, options.password)\n    //has to be after open\n    if(!sync) {\n        xhr.withCredentials = !!options.withCredentials\n    }\n    // Cannot set timeout with sync request\n    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly\n    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent\n    if (!sync && options.timeout > 0 ) {\n        timeoutTimer = setTimeout(function(){\n            if (aborted) return\n            aborted = true//IE9 may still call readystatechange\n            xhr.abort(\"timeout\")\n            var e = new Error(\"XMLHttpRequest timeout\")\n            e.code = \"ETIMEDOUT\"\n            errorFunc(e)\n        }, options.timeout )\n    }\n\n    if (xhr.setRequestHeader) {\n        for(key in headers){\n            if(headers.hasOwnProperty(key)){\n                xhr.setRequestHeader(key, headers[key])\n            }\n        }\n    } else if (options.headers && !isEmpty(options.headers)) {\n        throw new Error(\"Headers cannot be set on an XDomainRequest object\")\n    }\n\n    if (\"responseType\" in options) {\n        xhr.responseType = options.responseType\n    }\n\n    if (\"beforeSend\" in options &&\n        typeof options.beforeSend === \"function\"\n    ) {\n        options.beforeSend(xhr)\n    }\n\n    // Microsoft Edge browser sends \"undefined\" when send is called with undefined value.\n    // XMLHttpRequest spec says to pass null as body to indicate no body\n    // See https://github.com/naugtur/xhr/issues/100.\n    xhr.send(body || null)\n\n    return xhr\n\n\n}\n\nfunction getXml(xhr) {\n    if (xhr.responseType === \"document\") {\n        return xhr.responseXML\n    }\n    var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === \"parsererror\"\n    if (xhr.responseType === \"\" && !firefoxBugTakenEffect) {\n        return xhr.responseXML\n    }\n\n    return null\n}\n\nfunction noop() {}\n\n\n//# sourceURL=webpack:///../node_modules/xhr/index.js?");

/***/ }),

/***/ "../node_modules/xtend/immutable.js":
/*!******************************************!*\
  !*** ../node_modules/xtend/immutable.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = extend\n\nvar hasOwnProperty = Object.prototype.hasOwnProperty;\n\nfunction extend() {\n    var target = {}\n\n    for (var i = 0; i < arguments.length; i++) {\n        var source = arguments[i]\n\n        for (var key in source) {\n            if (hasOwnProperty.call(source, key)) {\n                target[key] = source[key]\n            }\n        }\n    }\n\n    return target\n}\n\n\n//# sourceURL=webpack:///../node_modules/xtend/immutable.js?");

/***/ }),

/***/ "./example.js":
/*!********************!*\
  !*** ./example.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* global BABYLON */\n\n\n// set up standard sort of scene\nvar vec3 = BABYLON.Vector3\nvar cv = document.getElementById('canvas')\nvar engine = new BABYLON.Engine(cv)\nvar scene = new BABYLON.Scene(engine)\nscene.clearColor = new BABYLON.Color3(0.8, 0.85, 0.9)\nvar camera = new BABYLON.ArcRotateCamera('camera', -1, 1.2, 6, new vec3(0, 1, 0), scene)\nvar light = new BABYLON.HemisphericLight('light', new vec3(0.1, 1, 0.3), scene)\ncamera.attachControl(cv)\nvar plane = BABYLON.Mesh.CreateGround('ground', 5, 5, 1, scene)\n\n\n// atlas constructor\nvar createAtlas = __webpack_require__(/*! ../ */ \"../index.js\")\n\n// make an atlas for a given image+JSON\nvar myAtlas = createAtlas('sprites.png', 'sprites.json', scene, BABYLON)\nwindow.atlas = myAtlas\n\nvar mesh = myAtlas.makeSpriteMesh()\nmesh.position.y = 1.2\nmesh.scaling.x = 1.5\nmesh.scaling.y = 2\n\n\n// in this demo sprites need full alpha - not true of all textures\nmesh.material.opacityTexture = mesh.material.diffuseTexture\n\n\n// cycle through frames\nvar num = 0\nsetInterval(function () {\n\tif (!myAtlas.frames.length) return // json not loaded yet\n\tnum = (num + 1) % myAtlas.frames.length\n\n\tmyAtlas.setMeshFrame(mesh, myAtlas.frames[num])\n\t// or just: myAtlas.setMeshFrame(mesh, num)\n}, 500)\n\n\n\n// make a second mesh from the same atlas\nvar mesh2 = myAtlas.makeSpriteMesh(1)\nmesh2.position.y = 1.2\nmesh2.position.z = 1\nmesh2.position.x = 1\n\n\n\n// make a mesh manually and set its texture to be a sprite\nvar mesh3 = BABYLON.Mesh.CreatePlane('m3', 1, scene)\nmesh3.material = new BABYLON.StandardMaterial('mat', scene)\nmesh3.material.specularColor = new BABYLON.Color3(0, 0, 0)\nmesh3.material.emissiveColor = new BABYLON.Color3(1, 1, 1)\nmesh3.material.backFaceCulling = false\nmesh3.position.y = .8\nmesh3.position.z = -1\nmesh3.position.x = -1\n\nmesh3.material.diffuseTexture = myAtlas.makeSpriteTexture(6)\n\nvar num2 = 0\nvar fr2 = [4, 5, 6]\nsetInterval(function () {\n\tif (!myAtlas.frames.length) return // json not loaded yet\n\tnum2 = (num2 + 1) % fr2.length\n\tatlas.setTextureFrame(mesh3.material.diffuseTexture, fr2[num2])\n}, 1000)\n\n\n\n// render the scene\nfunction render() {\n\tscene.render()\n\trequestAnimationFrame(render)\n}\nrender()\n\n\n\n//# sourceURL=webpack:///./example.js?");

/***/ })

/******/ });