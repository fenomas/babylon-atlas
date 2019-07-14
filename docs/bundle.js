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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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

eval("/* global BABYLON */\n\n//Optional support for loading json remotely\nvar loader\nif (true) {\n\tmodule.exports = Atlas\n\tloader = __webpack_require__(/*! load-json-xhr */ \"../node_modules/load-json-xhr/index.js\")\n} else {}\n\n\n\n\n/*\n*  Atlas constructor - keeps the json data and a base texture\n*/\n\n\nfunction Atlas(imgURL, jsonURL, scene, BAB, noMip, sampling) {\n\tif (!(this instanceof Atlas)) {\n\t\treturn new Atlas(imgURL, jsonURL, scene, BAB, noMip, sampling)\n\t}\n\n\tthis._ready = false\n\tthis._scene = scene\n\tthis._BABYLON = BAB\n\tthis._data = null\n\n\tthis.frames = []\n\n\tvar self = this\n\n\t// json loader and event\n\tif (typeof jsonURL === 'string') {\n\t\tloader(jsonURL, function (err, data) {\n\t\t\tif (err) throw err\n\t\t\tself._data = data\n\t\t\tinitData(self)\n\t\t})\n\t} else if (typeof jsonURL === 'object') {\n\t\t// if passed an object, assume it's the JSON\n\t\tself._data = jsonURL\n\t\tinitData(self)\n\t}\n\n\t// texture loader and event\n\tthis._baseTexture = new BAB.Texture(imgURL, scene, noMip, true, sampling)\n\n\t// atlas will almost always need alpha\n\tthis._baseTexture.hasAlpha = true\n}\n\n// called once json + image are both loaded\n/* Expects json like:\n\t{\"frames\":{\n\t\t\"frame_001\": {\"frame\": {\"x\":0, \"y\":32,\"w\":22,\"h\":18} },\n\t\t\"frame_002\": {\"frame\": {\"x\":53,\"y\":0, \"w\":22,\"h\":21} }\n\t}}\n*/\nfunction initData(self) {\n\tvar list = Object.keys(self._data.frames)\n\tfor (var i = 0; i < list.length; i++) {\n\t\tself.frames.push(list[i])\n\t}\n\tself._ready = true\n}\n\n\n\n\n\n/*\n*\n*    API\n* \n*/\n\n// return a plane-like sprite mesh showing the given atlas frame\n\nAtlas.prototype.makeSpriteMesh = function (frame, material) {\n\tvar BAB = this._BABYLON\n\tif (!frame) frame = 0\n\n\t// make a material unless one was passed in\n\tif (!material) {\n\t\tmaterial = new BAB.StandardMaterial('spriteMat', this._scene)\n\t\tmaterial.specularColor = new BAB.Color3(0, 0, 0)\n\t\tmaterial.emissiveColor = new BAB.Color3(1, 1, 1)\n\t\tmaterial.backFaceCulling = false\n\t}\n\n\t// basic plane mesh\n\tvar mesh = this._BABYLON.Mesh.CreatePlane('atlas sprite', 1, this._scene, true)\n\tmesh.material = material\n\tmesh.material.diffuseTexture = this._baseTexture\n\tmesh._currentAtlasFrame = null\n\n\t// set to correct frame\n\tthis.setMeshFrame(mesh, frame)\n\n\treturn mesh\n}\n\n\n\n// public accessor to set a created mesh's frame\nAtlas.prototype.setMeshFrame = function (mesh, frame) {\n\tif (frame === mesh._currentAtlasFrame) return\n\n\t// defer if needed\n\tif (!this._ready) {\n\t\tvar self = this\n\t\tsetTimeout(function () { self.setMeshFrame(mesh, frame) }, 10)\n\t\treturn\n\t} else {\n\t\tvar frameDat = getFrameData(this, frame)\n\t\tsetMeshUVs(this, mesh, frameDat)\n\t\tmesh._currentAtlasFrame = frame\n\t}\n}\n\n\n\n// Create a texture with the right uv settings for a given frame\n\nAtlas.prototype.makeSpriteTexture = function (frame) {\n\tvar tex = this._baseTexture.clone()\n\tthis.setTextureFrame(tex, frame)\n\treturn tex\n}\n\n\n\n// Set a created texture's uv settings to the given frame\n\nAtlas.prototype.setTextureFrame = function (tex, frame) {\n\t// defer if needed\n\tif (!this._ready) {\n\t\tvar self = this\n\t\tsetTimeout(function () { self.setTextureFrame(tex, frame) }, 10)\n\t\treturn\n\t} else {\n\t\tvar frameDat = getFrameData(this, frame)\n\t\tsetTextureUVs(this, tex, frameDat)\n\t}\n}\n\n\n\n\n// dispose method - disposes babylon objects\n\nAtlas.prototype.dispose = function () {\n\tthis._baseTexture.dispose()\n\tthis._data = null\n\tthis._scene = null\n\tthis._BABYLON = null\n\tthis.frames.length = 0\n}\n\n\n\n\n\n/*\n* \n*      Internals\n* \n*/\n\n\n// interpret string or number frame value, and return frame data from JSON\n\nfunction getFrameData(self, frame) {\n\tvar framestr = ''\n\tif (typeof frame === 'number') {\n\t\tframestr = self.frames[frame]\n\t} else {\n\t\tframestr = frame\n\t}\n\tvar dat = self._data.frames[framestr]\n\tif (!dat) {\n\t\tthrow new Error('babylon-atlas: frame \"' + framestr + '\" not found in atlas')\n\t}\n\n\treturn dat\n}\n\n\n\n\n// This is where the magic happens - for a given frame's x/y/width/height, \n// set the plane mesh's UVs to display that part of the texture\n\nfunction setMeshUVs(self, mesh, frameDat) {\n\tvar sw = self._data.meta.size.w\n\tvar sh = self._data.meta.size.h\n\tvar x = frameDat.frame.x / sw\n\tvar y = frameDat.frame.y / sh\n\tvar w = frameDat.frame.w / sw\n\tvar h = frameDat.frame.h / sh\n\n\tvar uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind)\n\tuvs[0] = x\n\tuvs[1] = 1 - y - h\n\tuvs[2] = x + w\n\tuvs[3] = 1 - y - h\n\tuvs[4] = x + w\n\tuvs[5] = 1 - y\n\tuvs[6] = x\n\tuvs[7] = 1 - y\n\tmesh.updateVerticesData(BABYLON.VertexBuffer.UVKind, uvs)\n}\n\n\n// Same thing but for textures\n\nfunction setTextureUVs(self, tex, frameDat) {\n\tvar sw = self._data.meta.size.w\n\tvar sh = self._data.meta.size.h\n\tvar x = frameDat.frame.x\n\tvar y = frameDat.frame.y\n\tvar w = frameDat.frame.w\n\tvar h = frameDat.frame.h\n\n\t// in Babylon 2.2 and below:\n\t// tex.uScale = w/sw\n\t// tex.vScale = h/sh\n\t// tex.uOffset = ( sw /2 - x)/w - 0.5\n\t// tex.vOffset = (-sh/2 + y)/h + 0.5\n\n\t// Babylon 2.3 and above:\n\ttex.uScale = w / sw\n\ttex.vScale = h / sh\n\ttex.uOffset = x / sw\n\ttex.vOffset = (sh - y - h) / sh\n}\n\n\n\n\n\n\n//# sourceURL=webpack:///../index.js?");

/***/ }),

/***/ "../node_modules/define-properties/index.js":
/*!**************************************************!*\
  !*** ../node_modules/define-properties/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar keys = __webpack_require__(/*! object-keys */ \"../node_modules/object-keys/index.js\");\nvar hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';\n\nvar toStr = Object.prototype.toString;\nvar concat = Array.prototype.concat;\nvar origDefineProperty = Object.defineProperty;\n\nvar isFunction = function (fn) {\n\treturn typeof fn === 'function' && toStr.call(fn) === '[object Function]';\n};\n\nvar arePropertyDescriptorsSupported = function () {\n\tvar obj = {};\n\ttry {\n\t\torigDefineProperty(obj, 'x', { enumerable: false, value: obj });\n\t\t// eslint-disable-next-line no-unused-vars, no-restricted-syntax\n\t\tfor (var _ in obj) { // jscs:ignore disallowUnusedVariables\n\t\t\treturn false;\n\t\t}\n\t\treturn obj.x === obj;\n\t} catch (e) { /* this is IE 8. */\n\t\treturn false;\n\t}\n};\nvar supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();\n\nvar defineProperty = function (object, name, value, predicate) {\n\tif (name in object && (!isFunction(predicate) || !predicate())) {\n\t\treturn;\n\t}\n\tif (supportsDescriptors) {\n\t\torigDefineProperty(object, name, {\n\t\t\tconfigurable: true,\n\t\t\tenumerable: false,\n\t\t\tvalue: value,\n\t\t\twritable: true\n\t\t});\n\t} else {\n\t\tobject[name] = value;\n\t}\n};\n\nvar defineProperties = function (object, map) {\n\tvar predicates = arguments.length > 2 ? arguments[2] : {};\n\tvar props = keys(map);\n\tif (hasSymbols) {\n\t\tprops = concat.call(props, Object.getOwnPropertySymbols(map));\n\t}\n\tfor (var i = 0; i < props.length; i += 1) {\n\t\tdefineProperty(object, props[i], map[props[i]], predicates[props[i]]);\n\t}\n};\n\ndefineProperties.supportsDescriptors = !!supportsDescriptors;\n\nmodule.exports = defineProperties;\n\n\n//# sourceURL=webpack:///../node_modules/define-properties/index.js?");

/***/ }),

/***/ "../node_modules/es-abstract/GetIntrinsic.js":
/*!***************************************************!*\
  !*** ../node_modules/es-abstract/GetIntrinsic.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/* globals\n\tSet,\n\tMap,\n\tWeakSet,\n\tWeakMap,\n\n\tPromise,\n\n\tSymbol,\n\tProxy,\n\n\tAtomics,\n\tSharedArrayBuffer,\n\n\tArrayBuffer,\n\tDataView,\n\tUint8Array,\n\tFloat32Array,\n\tFloat64Array,\n\tInt8Array,\n\tInt16Array,\n\tInt32Array,\n\tUint8ClampedArray,\n\tUint16Array,\n\tUint32Array,\n*/\n\nvar undefined; // eslint-disable-line no-shadow-restricted-names\n\nvar ThrowTypeError = Object.getOwnPropertyDescriptor\n\t? (function () { return Object.getOwnPropertyDescriptor(arguments, 'callee').get; }())\n\t: function () { throw new TypeError(); };\n\nvar hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';\n\nvar getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto\n\nvar generator; // = function * () {};\nvar generatorFunction = generator ? getProto(generator) : undefined;\nvar asyncFn; // async function() {};\nvar asyncFunction = asyncFn ? asyncFn.constructor : undefined;\nvar asyncGen; // async function * () {};\nvar asyncGenFunction = asyncGen ? getProto(asyncGen) : undefined;\nvar asyncGenIterator = asyncGen ? asyncGen() : undefined;\n\nvar TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);\n\nvar INTRINSICS = {\n\t'$ %Array%': Array,\n\t'$ %ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,\n\t'$ %ArrayBufferPrototype%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer.prototype,\n\t'$ %ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,\n\t'$ %ArrayPrototype%': Array.prototype,\n\t'$ %ArrayProto_entries%': Array.prototype.entries,\n\t'$ %ArrayProto_forEach%': Array.prototype.forEach,\n\t'$ %ArrayProto_keys%': Array.prototype.keys,\n\t'$ %ArrayProto_values%': Array.prototype.values,\n\t'$ %AsyncFromSyncIteratorPrototype%': undefined,\n\t'$ %AsyncFunction%': asyncFunction,\n\t'$ %AsyncFunctionPrototype%': asyncFunction ? asyncFunction.prototype : undefined,\n\t'$ %AsyncGenerator%': asyncGen ? getProto(asyncGenIterator) : undefined,\n\t'$ %AsyncGeneratorFunction%': asyncGenFunction,\n\t'$ %AsyncGeneratorPrototype%': asyncGenFunction ? asyncGenFunction.prototype : undefined,\n\t'$ %AsyncIteratorPrototype%': asyncGenIterator && hasSymbols && Symbol.asyncIterator ? asyncGenIterator[Symbol.asyncIterator]() : undefined,\n\t'$ %Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,\n\t'$ %Boolean%': Boolean,\n\t'$ %BooleanPrototype%': Boolean.prototype,\n\t'$ %DataView%': typeof DataView === 'undefined' ? undefined : DataView,\n\t'$ %DataViewPrototype%': typeof DataView === 'undefined' ? undefined : DataView.prototype,\n\t'$ %Date%': Date,\n\t'$ %DatePrototype%': Date.prototype,\n\t'$ %decodeURI%': decodeURI,\n\t'$ %decodeURIComponent%': decodeURIComponent,\n\t'$ %encodeURI%': encodeURI,\n\t'$ %encodeURIComponent%': encodeURIComponent,\n\t'$ %Error%': Error,\n\t'$ %ErrorPrototype%': Error.prototype,\n\t'$ %eval%': eval, // eslint-disable-line no-eval\n\t'$ %EvalError%': EvalError,\n\t'$ %EvalErrorPrototype%': EvalError.prototype,\n\t'$ %Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,\n\t'$ %Float32ArrayPrototype%': typeof Float32Array === 'undefined' ? undefined : Float32Array.prototype,\n\t'$ %Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,\n\t'$ %Float64ArrayPrototype%': typeof Float64Array === 'undefined' ? undefined : Float64Array.prototype,\n\t'$ %Function%': Function,\n\t'$ %FunctionPrototype%': Function.prototype,\n\t'$ %Generator%': generator ? getProto(generator()) : undefined,\n\t'$ %GeneratorFunction%': generatorFunction,\n\t'$ %GeneratorPrototype%': generatorFunction ? generatorFunction.prototype : undefined,\n\t'$ %Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,\n\t'$ %Int8ArrayPrototype%': typeof Int8Array === 'undefined' ? undefined : Int8Array.prototype,\n\t'$ %Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,\n\t'$ %Int16ArrayPrototype%': typeof Int16Array === 'undefined' ? undefined : Int8Array.prototype,\n\t'$ %Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,\n\t'$ %Int32ArrayPrototype%': typeof Int32Array === 'undefined' ? undefined : Int32Array.prototype,\n\t'$ %isFinite%': isFinite,\n\t'$ %isNaN%': isNaN,\n\t'$ %IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,\n\t'$ %JSON%': JSON,\n\t'$ %JSONParse%': JSON.parse,\n\t'$ %Map%': typeof Map === 'undefined' ? undefined : Map,\n\t'$ %MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),\n\t'$ %MapPrototype%': typeof Map === 'undefined' ? undefined : Map.prototype,\n\t'$ %Math%': Math,\n\t'$ %Number%': Number,\n\t'$ %NumberPrototype%': Number.prototype,\n\t'$ %Object%': Object,\n\t'$ %ObjectPrototype%': Object.prototype,\n\t'$ %ObjProto_toString%': Object.prototype.toString,\n\t'$ %ObjProto_valueOf%': Object.prototype.valueOf,\n\t'$ %parseFloat%': parseFloat,\n\t'$ %parseInt%': parseInt,\n\t'$ %Promise%': typeof Promise === 'undefined' ? undefined : Promise,\n\t'$ %PromisePrototype%': typeof Promise === 'undefined' ? undefined : Promise.prototype,\n\t'$ %PromiseProto_then%': typeof Promise === 'undefined' ? undefined : Promise.prototype.then,\n\t'$ %Promise_all%': typeof Promise === 'undefined' ? undefined : Promise.all,\n\t'$ %Promise_reject%': typeof Promise === 'undefined' ? undefined : Promise.reject,\n\t'$ %Promise_resolve%': typeof Promise === 'undefined' ? undefined : Promise.resolve,\n\t'$ %Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,\n\t'$ %RangeError%': RangeError,\n\t'$ %RangeErrorPrototype%': RangeError.prototype,\n\t'$ %ReferenceError%': ReferenceError,\n\t'$ %ReferenceErrorPrototype%': ReferenceError.prototype,\n\t'$ %Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,\n\t'$ %RegExp%': RegExp,\n\t'$ %RegExpPrototype%': RegExp.prototype,\n\t'$ %Set%': typeof Set === 'undefined' ? undefined : Set,\n\t'$ %SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),\n\t'$ %SetPrototype%': typeof Set === 'undefined' ? undefined : Set.prototype,\n\t'$ %SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,\n\t'$ %SharedArrayBufferPrototype%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer.prototype,\n\t'$ %String%': String,\n\t'$ %StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,\n\t'$ %StringPrototype%': String.prototype,\n\t'$ %Symbol%': hasSymbols ? Symbol : undefined,\n\t'$ %SymbolPrototype%': hasSymbols ? Symbol.prototype : undefined,\n\t'$ %SyntaxError%': SyntaxError,\n\t'$ %SyntaxErrorPrototype%': SyntaxError.prototype,\n\t'$ %ThrowTypeError%': ThrowTypeError,\n\t'$ %TypedArray%': TypedArray,\n\t'$ %TypedArrayPrototype%': TypedArray ? TypedArray.prototype : undefined,\n\t'$ %TypeError%': TypeError,\n\t'$ %TypeErrorPrototype%': TypeError.prototype,\n\t'$ %Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,\n\t'$ %Uint8ArrayPrototype%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array.prototype,\n\t'$ %Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,\n\t'$ %Uint8ClampedArrayPrototype%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray.prototype,\n\t'$ %Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,\n\t'$ %Uint16ArrayPrototype%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array.prototype,\n\t'$ %Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,\n\t'$ %Uint32ArrayPrototype%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array.prototype,\n\t'$ %URIError%': URIError,\n\t'$ %URIErrorPrototype%': URIError.prototype,\n\t'$ %WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,\n\t'$ %WeakMapPrototype%': typeof WeakMap === 'undefined' ? undefined : WeakMap.prototype,\n\t'$ %WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,\n\t'$ %WeakSetPrototype%': typeof WeakSet === 'undefined' ? undefined : WeakSet.prototype\n};\n\nmodule.exports = function GetIntrinsic(name, allowMissing) {\n\tif (arguments.length > 1 && typeof allowMissing !== 'boolean') {\n\t\tthrow new TypeError('\"allowMissing\" argument must be a boolean');\n\t}\n\n\tvar key = '$ ' + name;\n\tif (!(key in INTRINSICS)) {\n\t\tthrow new SyntaxError('intrinsic ' + name + ' does not exist!');\n\t}\n\n\t// istanbul ignore if // hopefully this is impossible to test :-)\n\tif (typeof INTRINSICS[key] === 'undefined' && !allowMissing) {\n\t\tthrow new TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');\n\t}\n\treturn INTRINSICS[key];\n};\n\n\n//# sourceURL=webpack:///../node_modules/es-abstract/GetIntrinsic.js?");

/***/ }),

/***/ "../node_modules/es-abstract/es5.js":
/*!******************************************!*\
  !*** ../node_modules/es-abstract/es5.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar GetIntrinsic = __webpack_require__(/*! ./GetIntrinsic */ \"../node_modules/es-abstract/GetIntrinsic.js\");\n\nvar $Object = GetIntrinsic('%Object%');\nvar $TypeError = GetIntrinsic('%TypeError%');\nvar $String = GetIntrinsic('%String%');\n\nvar assertRecord = __webpack_require__(/*! ./helpers/assertRecord */ \"../node_modules/es-abstract/helpers/assertRecord.js\");\nvar $isNaN = __webpack_require__(/*! ./helpers/isNaN */ \"../node_modules/es-abstract/helpers/isNaN.js\");\nvar $isFinite = __webpack_require__(/*! ./helpers/isFinite */ \"../node_modules/es-abstract/helpers/isFinite.js\");\n\nvar sign = __webpack_require__(/*! ./helpers/sign */ \"../node_modules/es-abstract/helpers/sign.js\");\nvar mod = __webpack_require__(/*! ./helpers/mod */ \"../node_modules/es-abstract/helpers/mod.js\");\n\nvar IsCallable = __webpack_require__(/*! is-callable */ \"../node_modules/is-callable/index.js\");\nvar toPrimitive = __webpack_require__(/*! es-to-primitive/es5 */ \"../node_modules/es-to-primitive/es5.js\");\n\nvar has = __webpack_require__(/*! has */ \"../node_modules/has/src/index.js\");\n\n// https://es5.github.io/#x9\nvar ES5 = {\n\tToPrimitive: toPrimitive,\n\n\tToBoolean: function ToBoolean(value) {\n\t\treturn !!value;\n\t},\n\tToNumber: function ToNumber(value) {\n\t\treturn +value; // eslint-disable-line no-implicit-coercion\n\t},\n\tToInteger: function ToInteger(value) {\n\t\tvar number = this.ToNumber(value);\n\t\tif ($isNaN(number)) { return 0; }\n\t\tif (number === 0 || !$isFinite(number)) { return number; }\n\t\treturn sign(number) * Math.floor(Math.abs(number));\n\t},\n\tToInt32: function ToInt32(x) {\n\t\treturn this.ToNumber(x) >> 0;\n\t},\n\tToUint32: function ToUint32(x) {\n\t\treturn this.ToNumber(x) >>> 0;\n\t},\n\tToUint16: function ToUint16(value) {\n\t\tvar number = this.ToNumber(value);\n\t\tif ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }\n\t\tvar posInt = sign(number) * Math.floor(Math.abs(number));\n\t\treturn mod(posInt, 0x10000);\n\t},\n\tToString: function ToString(value) {\n\t\treturn $String(value);\n\t},\n\tToObject: function ToObject(value) {\n\t\tthis.CheckObjectCoercible(value);\n\t\treturn $Object(value);\n\t},\n\tCheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {\n\t\t/* jshint eqnull:true */\n\t\tif (value == null) {\n\t\t\tthrow new $TypeError(optMessage || 'Cannot call method on ' + value);\n\t\t}\n\t\treturn value;\n\t},\n\tIsCallable: IsCallable,\n\tSameValue: function SameValue(x, y) {\n\t\tif (x === y) { // 0 === -0, but they are not identical.\n\t\t\tif (x === 0) { return 1 / x === 1 / y; }\n\t\t\treturn true;\n\t\t}\n\t\treturn $isNaN(x) && $isNaN(y);\n\t},\n\n\t// https://www.ecma-international.org/ecma-262/5.1/#sec-8\n\tType: function Type(x) {\n\t\tif (x === null) {\n\t\t\treturn 'Null';\n\t\t}\n\t\tif (typeof x === 'undefined') {\n\t\t\treturn 'Undefined';\n\t\t}\n\t\tif (typeof x === 'function' || typeof x === 'object') {\n\t\t\treturn 'Object';\n\t\t}\n\t\tif (typeof x === 'number') {\n\t\t\treturn 'Number';\n\t\t}\n\t\tif (typeof x === 'boolean') {\n\t\t\treturn 'Boolean';\n\t\t}\n\t\tif (typeof x === 'string') {\n\t\t\treturn 'String';\n\t\t}\n\t},\n\n\t// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type\n\tIsPropertyDescriptor: function IsPropertyDescriptor(Desc) {\n\t\tif (this.Type(Desc) !== 'Object') {\n\t\t\treturn false;\n\t\t}\n\t\tvar allowed = {\n\t\t\t'[[Configurable]]': true,\n\t\t\t'[[Enumerable]]': true,\n\t\t\t'[[Get]]': true,\n\t\t\t'[[Set]]': true,\n\t\t\t'[[Value]]': true,\n\t\t\t'[[Writable]]': true\n\t\t};\n\n\t\tfor (var key in Desc) { // eslint-disable-line\n\t\t\tif (has(Desc, key) && !allowed[key]) {\n\t\t\t\treturn false;\n\t\t\t}\n\t\t}\n\n\t\tvar isData = has(Desc, '[[Value]]');\n\t\tvar IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');\n\t\tif (isData && IsAccessor) {\n\t\t\tthrow new $TypeError('Property Descriptors may not be both accessor and data descriptors');\n\t\t}\n\t\treturn true;\n\t},\n\n\t// https://ecma-international.org/ecma-262/5.1/#sec-8.10.1\n\tIsAccessorDescriptor: function IsAccessorDescriptor(Desc) {\n\t\tif (typeof Desc === 'undefined') {\n\t\t\treturn false;\n\t\t}\n\n\t\tassertRecord(this, 'Property Descriptor', 'Desc', Desc);\n\n\t\tif (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {\n\t\t\treturn false;\n\t\t}\n\n\t\treturn true;\n\t},\n\n\t// https://ecma-international.org/ecma-262/5.1/#sec-8.10.2\n\tIsDataDescriptor: function IsDataDescriptor(Desc) {\n\t\tif (typeof Desc === 'undefined') {\n\t\t\treturn false;\n\t\t}\n\n\t\tassertRecord(this, 'Property Descriptor', 'Desc', Desc);\n\n\t\tif (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {\n\t\t\treturn false;\n\t\t}\n\n\t\treturn true;\n\t},\n\n\t// https://ecma-international.org/ecma-262/5.1/#sec-8.10.3\n\tIsGenericDescriptor: function IsGenericDescriptor(Desc) {\n\t\tif (typeof Desc === 'undefined') {\n\t\t\treturn false;\n\t\t}\n\n\t\tassertRecord(this, 'Property Descriptor', 'Desc', Desc);\n\n\t\tif (!this.IsAccessorDescriptor(Desc) && !this.IsDataDescriptor(Desc)) {\n\t\t\treturn true;\n\t\t}\n\n\t\treturn false;\n\t},\n\n\t// https://ecma-international.org/ecma-262/5.1/#sec-8.10.4\n\tFromPropertyDescriptor: function FromPropertyDescriptor(Desc) {\n\t\tif (typeof Desc === 'undefined') {\n\t\t\treturn Desc;\n\t\t}\n\n\t\tassertRecord(this, 'Property Descriptor', 'Desc', Desc);\n\n\t\tif (this.IsDataDescriptor(Desc)) {\n\t\t\treturn {\n\t\t\t\tvalue: Desc['[[Value]]'],\n\t\t\t\twritable: !!Desc['[[Writable]]'],\n\t\t\t\tenumerable: !!Desc['[[Enumerable]]'],\n\t\t\t\tconfigurable: !!Desc['[[Configurable]]']\n\t\t\t};\n\t\t} else if (this.IsAccessorDescriptor(Desc)) {\n\t\t\treturn {\n\t\t\t\tget: Desc['[[Get]]'],\n\t\t\t\tset: Desc['[[Set]]'],\n\t\t\t\tenumerable: !!Desc['[[Enumerable]]'],\n\t\t\t\tconfigurable: !!Desc['[[Configurable]]']\n\t\t\t};\n\t\t} else {\n\t\t\tthrow new $TypeError('FromPropertyDescriptor must be called with a fully populated Property Descriptor');\n\t\t}\n\t},\n\n\t// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5\n\tToPropertyDescriptor: function ToPropertyDescriptor(Obj) {\n\t\tif (this.Type(Obj) !== 'Object') {\n\t\t\tthrow new $TypeError('ToPropertyDescriptor requires an object');\n\t\t}\n\n\t\tvar desc = {};\n\t\tif (has(Obj, 'enumerable')) {\n\t\t\tdesc['[[Enumerable]]'] = this.ToBoolean(Obj.enumerable);\n\t\t}\n\t\tif (has(Obj, 'configurable')) {\n\t\t\tdesc['[[Configurable]]'] = this.ToBoolean(Obj.configurable);\n\t\t}\n\t\tif (has(Obj, 'value')) {\n\t\t\tdesc['[[Value]]'] = Obj.value;\n\t\t}\n\t\tif (has(Obj, 'writable')) {\n\t\t\tdesc['[[Writable]]'] = this.ToBoolean(Obj.writable);\n\t\t}\n\t\tif (has(Obj, 'get')) {\n\t\t\tvar getter = Obj.get;\n\t\t\tif (typeof getter !== 'undefined' && !this.IsCallable(getter)) {\n\t\t\t\tthrow new TypeError('getter must be a function');\n\t\t\t}\n\t\t\tdesc['[[Get]]'] = getter;\n\t\t}\n\t\tif (has(Obj, 'set')) {\n\t\t\tvar setter = Obj.set;\n\t\t\tif (typeof setter !== 'undefined' && !this.IsCallable(setter)) {\n\t\t\t\tthrow new $TypeError('setter must be a function');\n\t\t\t}\n\t\t\tdesc['[[Set]]'] = setter;\n\t\t}\n\n\t\tif ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {\n\t\t\tthrow new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');\n\t\t}\n\t\treturn desc;\n\t}\n};\n\nmodule.exports = ES5;\n\n\n//# sourceURL=webpack:///../node_modules/es-abstract/es5.js?");

/***/ }),

/***/ "../node_modules/es-abstract/helpers/assertRecord.js":
/*!***********************************************************!*\
  !*** ../node_modules/es-abstract/helpers/assertRecord.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ \"../node_modules/es-abstract/GetIntrinsic.js\");\n\nvar $TypeError = GetIntrinsic('%TypeError%');\nvar $SyntaxError = GetIntrinsic('%SyntaxError%');\n\nvar has = __webpack_require__(/*! has */ \"../node_modules/has/src/index.js\");\n\nvar predicates = {\n  // https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type\n  'Property Descriptor': function isPropertyDescriptor(ES, Desc) {\n    if (ES.Type(Desc) !== 'Object') {\n      return false;\n    }\n    var allowed = {\n      '[[Configurable]]': true,\n      '[[Enumerable]]': true,\n      '[[Get]]': true,\n      '[[Set]]': true,\n      '[[Value]]': true,\n      '[[Writable]]': true\n    };\n\n    for (var key in Desc) { // eslint-disable-line\n      if (has(Desc, key) && !allowed[key]) {\n        return false;\n      }\n    }\n\n    var isData = has(Desc, '[[Value]]');\n    var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');\n    if (isData && IsAccessor) {\n      throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');\n    }\n    return true;\n  }\n};\n\nmodule.exports = function assertRecord(ES, recordType, argumentName, value) {\n  var predicate = predicates[recordType];\n  if (typeof predicate !== 'function') {\n    throw new $SyntaxError('unknown record type: ' + recordType);\n  }\n  if (!predicate(ES, value)) {\n    throw new $TypeError(argumentName + ' must be a ' + recordType);\n  }\n  console.log(predicate(ES, value), value);\n};\n\n\n//# sourceURL=webpack:///../node_modules/es-abstract/helpers/assertRecord.js?");

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isFinite.js":
/*!*******************************************************!*\
  !*** ../node_modules/es-abstract/helpers/isFinite.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var $isNaN = Number.isNaN || function (a) { return a !== a; };\n\nmodule.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };\n\n\n//# sourceURL=webpack:///../node_modules/es-abstract/helpers/isFinite.js?");

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isNaN.js":
/*!****************************************************!*\
  !*** ../node_modules/es-abstract/helpers/isNaN.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = Number.isNaN || function isNaN(a) {\n\treturn a !== a;\n};\n\n\n//# sourceURL=webpack:///../node_modules/es-abstract/helpers/isNaN.js?");

/***/ }),

/***/ "../node_modules/es-abstract/helpers/mod.js":
/*!**************************************************!*\
  !*** ../node_modules/es-abstract/helpers/mod.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function mod(number, modulo) {\n\tvar remain = number % modulo;\n\treturn Math.floor(remain >= 0 ? remain : remain + modulo);\n};\n\n\n//# sourceURL=webpack:///../node_modules/es-abstract/helpers/mod.js?");

/***/ }),

/***/ "../node_modules/es-abstract/helpers/sign.js":
/*!***************************************************!*\
  !*** ../node_modules/es-abstract/helpers/sign.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function sign(number) {\n\treturn number >= 0 ? 1 : -1;\n};\n\n\n//# sourceURL=webpack:///../node_modules/es-abstract/helpers/sign.js?");

/***/ }),

/***/ "../node_modules/es-to-primitive/es5.js":
/*!**********************************************!*\
  !*** ../node_modules/es-to-primitive/es5.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar toStr = Object.prototype.toString;\n\nvar isPrimitive = __webpack_require__(/*! ./helpers/isPrimitive */ \"../node_modules/es-to-primitive/helpers/isPrimitive.js\");\n\nvar isCallable = __webpack_require__(/*! is-callable */ \"../node_modules/is-callable/index.js\");\n\n// http://ecma-international.org/ecma-262/5.1/#sec-8.12.8\nvar ES5internalSlots = {\n\t'[[DefaultValue]]': function (O) {\n\t\tvar actualHint;\n\t\tif (arguments.length > 1) {\n\t\t\tactualHint = arguments[1];\n\t\t} else {\n\t\t\tactualHint = toStr.call(O) === '[object Date]' ? String : Number;\n\t\t}\n\n\t\tif (actualHint === String || actualHint === Number) {\n\t\t\tvar methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];\n\t\t\tvar value, i;\n\t\t\tfor (i = 0; i < methods.length; ++i) {\n\t\t\t\tif (isCallable(O[methods[i]])) {\n\t\t\t\t\tvalue = O[methods[i]]();\n\t\t\t\t\tif (isPrimitive(value)) {\n\t\t\t\t\t\treturn value;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tthrow new TypeError('No default value');\n\t\t}\n\t\tthrow new TypeError('invalid [[DefaultValue]] hint supplied');\n\t}\n};\n\n// http://ecma-international.org/ecma-262/5.1/#sec-9.1\nmodule.exports = function ToPrimitive(input) {\n\tif (isPrimitive(input)) {\n\t\treturn input;\n\t}\n\tif (arguments.length > 1) {\n\t\treturn ES5internalSlots['[[DefaultValue]]'](input, arguments[1]);\n\t}\n\treturn ES5internalSlots['[[DefaultValue]]'](input);\n};\n\n\n//# sourceURL=webpack:///../node_modules/es-to-primitive/es5.js?");

/***/ }),

/***/ "../node_modules/es-to-primitive/helpers/isPrimitive.js":
/*!**************************************************************!*\
  !*** ../node_modules/es-to-primitive/helpers/isPrimitive.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function isPrimitive(value) {\n\treturn value === null || (typeof value !== 'function' && typeof value !== 'object');\n};\n\n\n//# sourceURL=webpack:///../node_modules/es-to-primitive/helpers/isPrimitive.js?");

/***/ }),

/***/ "../node_modules/for-each/index.js":
/*!*****************************************!*\
  !*** ../node_modules/for-each/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isCallable = __webpack_require__(/*! is-callable */ \"../node_modules/is-callable/index.js\");\n\nvar toStr = Object.prototype.toString;\nvar hasOwnProperty = Object.prototype.hasOwnProperty;\n\nvar forEachArray = function forEachArray(array, iterator, receiver) {\n    for (var i = 0, len = array.length; i < len; i++) {\n        if (hasOwnProperty.call(array, i)) {\n            if (receiver == null) {\n                iterator(array[i], i, array);\n            } else {\n                iterator.call(receiver, array[i], i, array);\n            }\n        }\n    }\n};\n\nvar forEachString = function forEachString(string, iterator, receiver) {\n    for (var i = 0, len = string.length; i < len; i++) {\n        // no such thing as a sparse string.\n        if (receiver == null) {\n            iterator(string.charAt(i), i, string);\n        } else {\n            iterator.call(receiver, string.charAt(i), i, string);\n        }\n    }\n};\n\nvar forEachObject = function forEachObject(object, iterator, receiver) {\n    for (var k in object) {\n        if (hasOwnProperty.call(object, k)) {\n            if (receiver == null) {\n                iterator(object[k], k, object);\n            } else {\n                iterator.call(receiver, object[k], k, object);\n            }\n        }\n    }\n};\n\nvar forEach = function forEach(list, iterator, thisArg) {\n    if (!isCallable(iterator)) {\n        throw new TypeError('iterator must be a function');\n    }\n\n    var receiver;\n    if (arguments.length >= 3) {\n        receiver = thisArg;\n    }\n\n    if (toStr.call(list) === '[object Array]') {\n        forEachArray(list, iterator, receiver);\n    } else if (typeof list === 'string') {\n        forEachString(list, iterator, receiver);\n    } else {\n        forEachObject(list, iterator, receiver);\n    }\n};\n\nmodule.exports = forEach;\n\n\n//# sourceURL=webpack:///../node_modules/for-each/index.js?");

/***/ }),

/***/ "../node_modules/function-bind/implementation.js":
/*!*******************************************************!*\
  !*** ../node_modules/function-bind/implementation.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/* eslint no-invalid-this: 1 */\n\nvar ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';\nvar slice = Array.prototype.slice;\nvar toStr = Object.prototype.toString;\nvar funcType = '[object Function]';\n\nmodule.exports = function bind(that) {\n    var target = this;\n    if (typeof target !== 'function' || toStr.call(target) !== funcType) {\n        throw new TypeError(ERROR_MESSAGE + target);\n    }\n    var args = slice.call(arguments, 1);\n\n    var bound;\n    var binder = function () {\n        if (this instanceof bound) {\n            var result = target.apply(\n                this,\n                args.concat(slice.call(arguments))\n            );\n            if (Object(result) === result) {\n                return result;\n            }\n            return this;\n        } else {\n            return target.apply(\n                that,\n                args.concat(slice.call(arguments))\n            );\n        }\n    };\n\n    var boundLength = Math.max(0, target.length - args.length);\n    var boundArgs = [];\n    for (var i = 0; i < boundLength; i++) {\n        boundArgs.push('$' + i);\n    }\n\n    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);\n\n    if (target.prototype) {\n        var Empty = function Empty() {};\n        Empty.prototype = target.prototype;\n        bound.prototype = new Empty();\n        Empty.prototype = null;\n    }\n\n    return bound;\n};\n\n\n//# sourceURL=webpack:///../node_modules/function-bind/implementation.js?");

/***/ }),

/***/ "../node_modules/function-bind/index.js":
/*!**********************************************!*\
  !*** ../node_modules/function-bind/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar implementation = __webpack_require__(/*! ./implementation */ \"../node_modules/function-bind/implementation.js\");\n\nmodule.exports = Function.prototype.bind || implementation;\n\n\n//# sourceURL=webpack:///../node_modules/function-bind/index.js?");

/***/ }),

/***/ "../node_modules/global/window.js":
/*!****************************************!*\
  !*** ../node_modules/global/window.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(global) {var win;\n\nif (typeof window !== \"undefined\") {\n    win = window;\n} else if (typeof global !== \"undefined\") {\n    win = global;\n} else if (typeof self !== \"undefined\"){\n    win = self;\n} else {\n    win = {};\n}\n\nmodule.exports = win;\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ \"../node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///../node_modules/global/window.js?");

/***/ }),

/***/ "../node_modules/has/src/index.js":
/*!****************************************!*\
  !*** ../node_modules/has/src/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar bind = __webpack_require__(/*! function-bind */ \"../node_modules/function-bind/index.js\");\n\nmodule.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);\n\n\n//# sourceURL=webpack:///../node_modules/has/src/index.js?");

/***/ }),

/***/ "../node_modules/is-callable/index.js":
/*!********************************************!*\
  !*** ../node_modules/is-callable/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar fnToStr = Function.prototype.toString;\n\nvar constructorRegex = /^\\s*class\\b/;\nvar isES6ClassFn = function isES6ClassFunction(value) {\n\ttry {\n\t\tvar fnStr = fnToStr.call(value);\n\t\treturn constructorRegex.test(fnStr);\n\t} catch (e) {\n\t\treturn false; // not a function\n\t}\n};\n\nvar tryFunctionObject = function tryFunctionToStr(value) {\n\ttry {\n\t\tif (isES6ClassFn(value)) { return false; }\n\t\tfnToStr.call(value);\n\t\treturn true;\n\t} catch (e) {\n\t\treturn false;\n\t}\n};\nvar toStr = Object.prototype.toString;\nvar fnClass = '[object Function]';\nvar genClass = '[object GeneratorFunction]';\nvar hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';\n\nmodule.exports = function isCallable(value) {\n\tif (!value) { return false; }\n\tif (typeof value !== 'function' && typeof value !== 'object') { return false; }\n\tif (typeof value === 'function' && !value.prototype) { return true; }\n\tif (hasToStringTag) { return tryFunctionObject(value); }\n\tif (isES6ClassFn(value)) { return false; }\n\tvar strClass = toStr.call(value);\n\treturn strClass === fnClass || strClass === genClass;\n};\n\n\n//# sourceURL=webpack:///../node_modules/is-callable/index.js?");

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

/***/ "../node_modules/object-keys/implementation.js":
/*!*****************************************************!*\
  !*** ../node_modules/object-keys/implementation.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar keysShim;\nif (!Object.keys) {\n\t// modified from https://github.com/es-shims/es5-shim\n\tvar has = Object.prototype.hasOwnProperty;\n\tvar toStr = Object.prototype.toString;\n\tvar isArgs = __webpack_require__(/*! ./isArguments */ \"../node_modules/object-keys/isArguments.js\"); // eslint-disable-line global-require\n\tvar isEnumerable = Object.prototype.propertyIsEnumerable;\n\tvar hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');\n\tvar hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');\n\tvar dontEnums = [\n\t\t'toString',\n\t\t'toLocaleString',\n\t\t'valueOf',\n\t\t'hasOwnProperty',\n\t\t'isPrototypeOf',\n\t\t'propertyIsEnumerable',\n\t\t'constructor'\n\t];\n\tvar equalsConstructorPrototype = function (o) {\n\t\tvar ctor = o.constructor;\n\t\treturn ctor && ctor.prototype === o;\n\t};\n\tvar excludedKeys = {\n\t\t$applicationCache: true,\n\t\t$console: true,\n\t\t$external: true,\n\t\t$frame: true,\n\t\t$frameElement: true,\n\t\t$frames: true,\n\t\t$innerHeight: true,\n\t\t$innerWidth: true,\n\t\t$onmozfullscreenchange: true,\n\t\t$onmozfullscreenerror: true,\n\t\t$outerHeight: true,\n\t\t$outerWidth: true,\n\t\t$pageXOffset: true,\n\t\t$pageYOffset: true,\n\t\t$parent: true,\n\t\t$scrollLeft: true,\n\t\t$scrollTop: true,\n\t\t$scrollX: true,\n\t\t$scrollY: true,\n\t\t$self: true,\n\t\t$webkitIndexedDB: true,\n\t\t$webkitStorageInfo: true,\n\t\t$window: true\n\t};\n\tvar hasAutomationEqualityBug = (function () {\n\t\t/* global window */\n\t\tif (typeof window === 'undefined') { return false; }\n\t\tfor (var k in window) {\n\t\t\ttry {\n\t\t\t\tif (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {\n\t\t\t\t\ttry {\n\t\t\t\t\t\tequalsConstructorPrototype(window[k]);\n\t\t\t\t\t} catch (e) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t} catch (e) {\n\t\t\t\treturn true;\n\t\t\t}\n\t\t}\n\t\treturn false;\n\t}());\n\tvar equalsConstructorPrototypeIfNotBuggy = function (o) {\n\t\t/* global window */\n\t\tif (typeof window === 'undefined' || !hasAutomationEqualityBug) {\n\t\t\treturn equalsConstructorPrototype(o);\n\t\t}\n\t\ttry {\n\t\t\treturn equalsConstructorPrototype(o);\n\t\t} catch (e) {\n\t\t\treturn false;\n\t\t}\n\t};\n\n\tkeysShim = function keys(object) {\n\t\tvar isObject = object !== null && typeof object === 'object';\n\t\tvar isFunction = toStr.call(object) === '[object Function]';\n\t\tvar isArguments = isArgs(object);\n\t\tvar isString = isObject && toStr.call(object) === '[object String]';\n\t\tvar theKeys = [];\n\n\t\tif (!isObject && !isFunction && !isArguments) {\n\t\t\tthrow new TypeError('Object.keys called on a non-object');\n\t\t}\n\n\t\tvar skipProto = hasProtoEnumBug && isFunction;\n\t\tif (isString && object.length > 0 && !has.call(object, 0)) {\n\t\t\tfor (var i = 0; i < object.length; ++i) {\n\t\t\t\ttheKeys.push(String(i));\n\t\t\t}\n\t\t}\n\n\t\tif (isArguments && object.length > 0) {\n\t\t\tfor (var j = 0; j < object.length; ++j) {\n\t\t\t\ttheKeys.push(String(j));\n\t\t\t}\n\t\t} else {\n\t\t\tfor (var name in object) {\n\t\t\t\tif (!(skipProto && name === 'prototype') && has.call(object, name)) {\n\t\t\t\t\ttheKeys.push(String(name));\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tif (hasDontEnumBug) {\n\t\t\tvar skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);\n\n\t\t\tfor (var k = 0; k < dontEnums.length; ++k) {\n\t\t\t\tif (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {\n\t\t\t\t\ttheKeys.push(dontEnums[k]);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn theKeys;\n\t};\n}\nmodule.exports = keysShim;\n\n\n//# sourceURL=webpack:///../node_modules/object-keys/implementation.js?");

/***/ }),

/***/ "../node_modules/object-keys/index.js":
/*!********************************************!*\
  !*** ../node_modules/object-keys/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar slice = Array.prototype.slice;\nvar isArgs = __webpack_require__(/*! ./isArguments */ \"../node_modules/object-keys/isArguments.js\");\n\nvar origKeys = Object.keys;\nvar keysShim = origKeys ? function keys(o) { return origKeys(o); } : __webpack_require__(/*! ./implementation */ \"../node_modules/object-keys/implementation.js\");\n\nvar originalKeys = Object.keys;\n\nkeysShim.shim = function shimObjectKeys() {\n\tif (Object.keys) {\n\t\tvar keysWorksWithArguments = (function () {\n\t\t\t// Safari 5.0 bug\n\t\t\tvar args = Object.keys(arguments);\n\t\t\treturn args && args.length === arguments.length;\n\t\t}(1, 2));\n\t\tif (!keysWorksWithArguments) {\n\t\t\tObject.keys = function keys(object) { // eslint-disable-line func-name-matching\n\t\t\t\tif (isArgs(object)) {\n\t\t\t\t\treturn originalKeys(slice.call(object));\n\t\t\t\t}\n\t\t\t\treturn originalKeys(object);\n\t\t\t};\n\t\t}\n\t} else {\n\t\tObject.keys = keysShim;\n\t}\n\treturn Object.keys || keysShim;\n};\n\nmodule.exports = keysShim;\n\n\n//# sourceURL=webpack:///../node_modules/object-keys/index.js?");

/***/ }),

/***/ "../node_modules/object-keys/isArguments.js":
/*!**************************************************!*\
  !*** ../node_modules/object-keys/isArguments.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar toStr = Object.prototype.toString;\n\nmodule.exports = function isArguments(value) {\n\tvar str = toStr.call(value);\n\tvar isArgs = str === '[object Arguments]';\n\tif (!isArgs) {\n\t\tisArgs = str !== '[object Array]' &&\n\t\t\tvalue !== null &&\n\t\t\ttypeof value === 'object' &&\n\t\t\ttypeof value.length === 'number' &&\n\t\t\tvalue.length >= 0 &&\n\t\t\ttoStr.call(value.callee) === '[object Function]';\n\t}\n\treturn isArgs;\n};\n\n\n//# sourceURL=webpack:///../node_modules/object-keys/isArguments.js?");

/***/ }),

/***/ "../node_modules/parse-headers/parse-headers.js":
/*!******************************************************!*\
  !*** ../node_modules/parse-headers/parse-headers.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var trim = __webpack_require__(/*! string.prototype.trim */ \"../node_modules/string.prototype.trim/index.js\")\n  , forEach = __webpack_require__(/*! for-each */ \"../node_modules/for-each/index.js\")\n  , isArray = function(arg) {\n      return Object.prototype.toString.call(arg) === '[object Array]';\n    }\n\nmodule.exports = function (headers) {\n  if (!headers)\n    return {}\n\n  var result = {}\n\n  forEach(\n      trim(headers).split('\\n')\n    , function (row) {\n        var index = row.indexOf(':')\n          , key = trim(row.slice(0, index)).toLowerCase()\n          , value = trim(row.slice(index + 1))\n\n        if (typeof(result[key]) === 'undefined') {\n          result[key] = value\n        } else if (isArray(result[key])) {\n          result[key].push(value)\n        } else {\n          result[key] = [ result[key], value ]\n        }\n      }\n  )\n\n  return result\n}\n\n\n//# sourceURL=webpack:///../node_modules/parse-headers/parse-headers.js?");

/***/ }),

/***/ "../node_modules/string.prototype.trim/implementation.js":
/*!***************************************************************!*\
  !*** ../node_modules/string.prototype.trim/implementation.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar bind = __webpack_require__(/*! function-bind */ \"../node_modules/function-bind/index.js\");\nvar ES = __webpack_require__(/*! es-abstract/es5 */ \"../node_modules/es-abstract/es5.js\");\nvar replace = bind.call(Function.call, String.prototype.replace);\n\nvar leftWhitespace = /^[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]+/;\nvar rightWhitespace = /[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]+$/;\n\nmodule.exports = function trim() {\n\tvar S = ES.ToString(ES.CheckObjectCoercible(this));\n\treturn replace(replace(S, leftWhitespace, ''), rightWhitespace, '');\n};\n\n\n//# sourceURL=webpack:///../node_modules/string.prototype.trim/implementation.js?");

/***/ }),

/***/ "../node_modules/string.prototype.trim/index.js":
/*!******************************************************!*\
  !*** ../node_modules/string.prototype.trim/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar bind = __webpack_require__(/*! function-bind */ \"../node_modules/function-bind/index.js\");\nvar define = __webpack_require__(/*! define-properties */ \"../node_modules/define-properties/index.js\");\n\nvar implementation = __webpack_require__(/*! ./implementation */ \"../node_modules/string.prototype.trim/implementation.js\");\nvar getPolyfill = __webpack_require__(/*! ./polyfill */ \"../node_modules/string.prototype.trim/polyfill.js\");\nvar shim = __webpack_require__(/*! ./shim */ \"../node_modules/string.prototype.trim/shim.js\");\n\nvar boundTrim = bind.call(Function.call, getPolyfill());\n\ndefine(boundTrim, {\n\tgetPolyfill: getPolyfill,\n\timplementation: implementation,\n\tshim: shim\n});\n\nmodule.exports = boundTrim;\n\n\n//# sourceURL=webpack:///../node_modules/string.prototype.trim/index.js?");

/***/ }),

/***/ "../node_modules/string.prototype.trim/polyfill.js":
/*!*********************************************************!*\
  !*** ../node_modules/string.prototype.trim/polyfill.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar implementation = __webpack_require__(/*! ./implementation */ \"../node_modules/string.prototype.trim/implementation.js\");\n\nvar zeroWidthSpace = '\\u200b';\n\nmodule.exports = function getPolyfill() {\n\tif (String.prototype.trim && zeroWidthSpace.trim() === zeroWidthSpace) {\n\t\treturn String.prototype.trim;\n\t}\n\treturn implementation;\n};\n\n\n//# sourceURL=webpack:///../node_modules/string.prototype.trim/polyfill.js?");

/***/ }),

/***/ "../node_modules/string.prototype.trim/shim.js":
/*!*****************************************************!*\
  !*** ../node_modules/string.prototype.trim/shim.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar define = __webpack_require__(/*! define-properties */ \"../node_modules/define-properties/index.js\");\nvar getPolyfill = __webpack_require__(/*! ./polyfill */ \"../node_modules/string.prototype.trim/polyfill.js\");\n\nmodule.exports = function shimStringTrim() {\n\tvar polyfill = getPolyfill();\n\tdefine(String.prototype, { trim: polyfill }, { trim: function () { return String.prototype.trim !== polyfill; } });\n\treturn polyfill;\n};\n\n\n//# sourceURL=webpack:///../node_modules/string.prototype.trim/shim.js?");

/***/ }),

/***/ "../node_modules/webpack/buildin/global.js":
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///../node_modules/webpack/buildin/global.js?");

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