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

/***/ "../src/index.js":
/*!***********************!*\
  !*** ../src/index.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n\nmodule.exports = Atlas\n\n\n/*\n*  Atlas constructor - keeps the json data and a base texture\n*/\n\n\nfunction Atlas(imgURL, jsonURL, scene, BAB, noMip, sampling) {\n\tif (!(this instanceof Atlas)) {\n\t\treturn new Atlas(imgURL, jsonURL, scene, BAB, noMip, sampling)\n\t}\n\n\tthis._ready = false\n\tthis._scene = scene\n\tthis._BABYLON = BAB\n\tthis._data = null\n\n\tthis.frames = []\n\n\tvar self = this\n\n\t// json loader and event\n\tif (typeof jsonURL === 'string') {\n\t\tfetch(jsonURL)\n\t\t\t.then(response => response.json())\n\t\t\t.then(data => {\n\t\t\t\tself._data = data\n\t\t\t\tinitData(self)\n\t\t\t})\n\t\t\t.catch(err => {\n\t\t\t\tconsole.warn('Error loading json:', err)\n\t\t\t})\n\t} else if (typeof jsonURL === 'object') {\n\t\t// if passed an object, assume it's the JSON\n\t\tself._data = jsonURL\n\t\tinitData(self)\n\t}\n\n\t// texture loader and event\n\tthis._baseTexture = new BAB.Texture(imgURL, scene, noMip, true, sampling)\n\n\t// atlas will almost always need alpha\n\tthis._baseTexture.hasAlpha = true\n}\n\n// called once json + image are both loaded\n/* Expects json like:\n\t{\"frames\":{\n\t\t\"frame_001\": {\"frame\": {\"x\":0, \"y\":32,\"w\":22,\"h\":18} },\n\t\t\"frame_002\": {\"frame\": {\"x\":53,\"y\":0, \"w\":22,\"h\":21} }\n\t}}\n*/\nfunction initData(self) {\n\tvar list = Object.keys(self._data.frames)\n\tfor (var i = 0; i < list.length; i++) {\n\t\tself.frames.push(list[i])\n\t}\n\tself._ready = true\n}\n\n\n\n\n\n/*\n*\n*    API\n* \n*/\n\n// return a plane-like sprite mesh showing the given atlas frame\n\nAtlas.prototype.makeSpriteMesh = function (frame, material) {\n\tvar BAB = this._BABYLON\n\tif (!frame) frame = 0\n\n\t// make a material unless one was passed in\n\tif (!material) {\n\t\tmaterial = new BAB.StandardMaterial('spriteMat', this._scene)\n\t\tmaterial.specularColor = new BAB.Color3(0, 0, 0)\n\t\tmaterial.emissiveColor = new BAB.Color3(1, 1, 1)\n\t\tmaterial.backFaceCulling = false\n\t}\n\n\t// basic plane mesh\n\tvar mesh = this._BABYLON.Mesh.CreatePlane('atlas sprite', 1, this._scene, true)\n\tmesh.material = material\n\tmesh.material.diffuseTexture = this._baseTexture\n\tmesh._currentAtlasFrame = null\n\n\t// set to correct frame\n\tthis.setMeshFrame(mesh, frame)\n\n\treturn mesh\n}\n\n\n\n// public accessor to set a created mesh's frame\nAtlas.prototype.setMeshFrame = function (mesh, frame) {\n\tif (frame === mesh._currentAtlasFrame) return\n\n\t// defer if needed\n\tif (!this._ready) {\n\t\tvar self = this\n\t\tsetTimeout(function () { self.setMeshFrame(mesh, frame) }, 10)\n\t\treturn\n\t} else {\n\t\tvar frameDat = getFrameData(this, frame)\n\t\tsetMeshUVs(this, mesh, frameDat)\n\t\tmesh._currentAtlasFrame = frame\n\t}\n}\n\n\n\n// Create a texture with the right uv settings for a given frame\n\nAtlas.prototype.makeSpriteTexture = function (frame) {\n\tvar tex = this._baseTexture.clone()\n\tthis.setTextureFrame(tex, frame)\n\treturn tex\n}\n\n\n\n// Set a created texture's uv settings to the given frame\n\nAtlas.prototype.setTextureFrame = function (tex, frame) {\n\t// defer if needed\n\tif (!this._ready) {\n\t\tvar self = this\n\t\tsetTimeout(function () { self.setTextureFrame(tex, frame) }, 10)\n\t\treturn\n\t} else {\n\t\tvar frameDat = getFrameData(this, frame)\n\t\tsetTextureUVs(this, tex, frameDat)\n\t}\n}\n\n\n\n\n// dispose method - disposes babylon objects\n\nAtlas.prototype.dispose = function () {\n\tthis._baseTexture.dispose()\n\tthis._data = null\n\tthis._scene = null\n\tthis._BABYLON = null\n\tthis.frames.length = 0\n}\n\n\n\n\n\n/*\n* \n*      Internals\n* \n*/\n\n\n// interpret string or number frame value, and return frame data from JSON\n\nfunction getFrameData(self, frame) {\n\tvar framestr = ''\n\tif (typeof frame === 'number') {\n\t\tframestr = self.frames[frame]\n\t} else {\n\t\tframestr = frame\n\t}\n\tvar dat = self._data.frames[framestr]\n\tif (!dat) {\n\t\tthrow new Error('babylon-atlas: frame \"' + framestr + '\" not found in atlas')\n\t}\n\n\treturn dat\n}\n\n\n\n\n// This is where the magic happens - for a given frame's x/y/width/height, \n// set the plane mesh's UVs to display that part of the texture\n\nfunction setMeshUVs(self, mesh, frameDat) {\n\tvar sw = self._data.meta.size.w\n\tvar sh = self._data.meta.size.h\n\tvar x = frameDat.frame.x / sw\n\tvar y = frameDat.frame.y / sh\n\tvar w = frameDat.frame.w / sw\n\tvar h = frameDat.frame.h / sh\n\tvar BAB = self._BABYLON\n\n\tvar uvs = mesh.getVerticesData(BAB.VertexBuffer.UVKind)\n\tuvs[0] = x\n\tuvs[1] = 1 - y - h\n\tuvs[2] = x + w\n\tuvs[3] = 1 - y - h\n\tuvs[4] = x + w\n\tuvs[5] = 1 - y\n\tuvs[6] = x\n\tuvs[7] = 1 - y\n\tmesh.updateVerticesData(BAB.VertexBuffer.UVKind, uvs)\n}\n\n\n// Same thing but for textures\n\nfunction setTextureUVs(self, tex, frameDat) {\n\tvar sw = self._data.meta.size.w\n\tvar sh = self._data.meta.size.h\n\tvar x = frameDat.frame.x\n\tvar y = frameDat.frame.y\n\tvar w = frameDat.frame.w\n\tvar h = frameDat.frame.h\n\n\t// in Babylon 2.2 and below:\n\t// tex.uScale = w/sw\n\t// tex.vScale = h/sh\n\t// tex.uOffset = ( sw /2 - x)/w - 0.5\n\t// tex.vOffset = (-sh/2 + y)/h + 0.5\n\n\t// Babylon 2.3 and above:\n\ttex.uScale = w / sw\n\ttex.vScale = h / sh\n\ttex.uOffset = x / sw\n\ttex.vOffset = (sh - y - h) / sh\n}\n\n\n\n\n\n\n//# sourceURL=webpack:///../src/index.js?");

/***/ }),

/***/ "./example.js":
/*!********************!*\
  !*** ./example.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* global BABYLON */\n\n\n// set up standard sort of scene\nvar vec3 = BABYLON.Vector3\nvar cv = document.getElementById('canvas')\nvar engine = new BABYLON.Engine(cv)\nvar scene = new BABYLON.Scene(engine)\nscene.clearColor = new BABYLON.Color3(0.8, 0.85, 0.9)\nvar camera = new BABYLON.ArcRotateCamera('camera', -1, 1.2, 6, new vec3(0, 1, 0), scene)\nvar light = new BABYLON.HemisphericLight('light', new vec3(0.1, 1, 0.3), scene)\ncamera.attachControl(cv)\nvar plane = BABYLON.Mesh.CreateGround('ground', 5, 5, 1, scene)\n\n\n// atlas constructor\nvar createAtlas = __webpack_require__(/*! .. */ \"../src/index.js\")\n\n// make an atlas for a given image+JSON\nvar myAtlas = createAtlas('sprites.png', 'sprites.json', scene, BABYLON)\nwindow.atlas = myAtlas\n\nvar mesh = myAtlas.makeSpriteMesh()\nmesh.position.y = 1.2\nmesh.scaling.x = 1.5\nmesh.scaling.y = 2\n\n\n// in this demo sprites need full alpha - not true of all textures\nmesh.material.opacityTexture = mesh.material.diffuseTexture\n\n\n// cycle through frames\nvar num = 0\nsetInterval(function () {\n\tif (!myAtlas.frames.length) return // json not loaded yet\n\tnum = (num + 1) % myAtlas.frames.length\n\n\tmyAtlas.setMeshFrame(mesh, myAtlas.frames[num])\n\t// or just: myAtlas.setMeshFrame(mesh, num)\n}, 500)\n\n\n\n// make a second mesh from the same atlas\nvar mesh2 = myAtlas.makeSpriteMesh(1)\nmesh2.position.y = 1.2\nmesh2.position.z = 1\nmesh2.position.x = 1\n\n\n\n// make a mesh manually and set its texture to be a sprite\nvar mesh3 = BABYLON.Mesh.CreatePlane('m3', 1, scene)\nmesh3.material = new BABYLON.StandardMaterial('mat', scene)\nmesh3.material.specularColor = new BABYLON.Color3(0, 0, 0)\nmesh3.material.emissiveColor = new BABYLON.Color3(1, 1, 1)\nmesh3.material.backFaceCulling = false\nmesh3.position.y = .8\nmesh3.position.z = -1\nmesh3.position.x = -1\n\nmesh3.material.diffuseTexture = myAtlas.makeSpriteTexture(6)\n\nvar num2 = 0\nvar fr2 = [4, 5, 6]\nsetInterval(function () {\n\tif (!myAtlas.frames.length) return // json not loaded yet\n\tnum2 = (num2 + 1) % fr2.length\n\tmyAtlas.setTextureFrame(mesh3.material.diffuseTexture, fr2[num2])\n}, 1000)\n\n\n\n// render the scene\nfunction render() {\n\tscene.render()\n\trequestAnimationFrame(render)\n}\nrender()\n\n\n\n//# sourceURL=webpack:///./example.js?");

/***/ })

/******/ });