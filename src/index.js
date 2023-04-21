
import packageJSON from '../package.json'
var version = packageJSON.version

import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { CreatePlane } from '@babylonjs/core/Meshes/Builders/planeBuilder'
import { VertexBuffer } from '@babylonjs/core/Buffers/buffer'
import { Mesh } from '@babylonjs/core/Meshes/mesh'

/*
*  Atlas constructor - keeps the json data and a base texture
*/


export function Atlas(imgURL, jsonURL, scene, noMip, sampling) {

	this.version = version
	this._ready = false
	this._scene = scene
	this._data = null

	this.frames = []

	var self = this

	// json loader and event
	if (typeof jsonURL === 'string') {
		fetch(jsonURL)
			.then(response => response.json())
			.then(data => {
				self._data = data
				initData(self)
			})
			.catch(err => {
				console.warn('Error loading json:', err)
			})
	} else if (typeof jsonURL === 'object') {
		// if passed an object, assume it's the JSON
		self._data = jsonURL
		initData(self)
	}

	// texture loader and event
	this._baseTexture = new Texture(imgURL, scene, noMip, true, sampling)

	// atlas will almost always need alpha
	this._baseTexture.hasAlpha = true
}

// called once json + image are both loaded
/* Expects json like:
	{"frames":{
		"frame_001": {"frame": {"x":0, "y":32,"w":22,"h":18} },
		"frame_002": {"frame": {"x":53,"y":0, "w":22,"h":21} }
	}}
*/
function initData(self) {
	var list = Object.keys(self._data.frames)
	for (var i = 0; i < list.length; i++) {
		self.frames.push(list[i])
	}
	self._ready = true
}





/*
*
*    API
* 
*/

// return a plane-like sprite mesh showing the given atlas frame

Atlas.prototype.makeSpriteMesh = function (frame, material) {
	if (!frame) frame = 0

	// make a material unless one was passed in
	if (!material) {
		material = new StandardMaterial('spriteMat', this._scene)
		material.specularColor.set(0, 0, 0)
		material.emissiveColor.set(1, 1, 1)
		material.backFaceCulling = true
	}

	// basic plane mesh
	var mesh = CreatePlane('atlas_sprite', {
		size: 1,
		updatable: true,
		sideOrientation: Mesh.DOUBLESIDE,
	}, this._scene)

	material.diffuseTexture = this._baseTexture
	mesh.material = material
	mesh['_currentAtlasFrame'] = null

	// set to correct frame
	this.setMeshFrame(mesh, frame)

	return mesh
}



// public accessor to set a created mesh's frame
Atlas.prototype.setMeshFrame = function (mesh, frame) {
	if (frame === mesh._currentAtlasFrame) return

	if (this._ready) {
		var frameDat = getFrameData(this, frame)
		setMeshUVs(this, mesh, frameDat)
		mesh._currentAtlasFrame = frame
	} else {
		// defer if json isn't loaded yet
		setTimeout(this.setMeshFrame.bind(this, mesh, frame), 50)
	}
}



// Create a texture with the right uv settings for a given frame

Atlas.prototype.makeSpriteTexture = function (frame) {
	var tex = this._baseTexture.clone()
	this.setTextureFrame(tex, frame)
	return tex
}



// Set a created texture's uv settings to the given frame

Atlas.prototype.setTextureFrame = function (tex, frame) {
	// defer if needed
	if (!this._ready) {
		var self = this
		setTimeout(function () { self.setTextureFrame(tex, frame) }, 10)
		return
	} else {
		var frameDat = getFrameData(this, frame)
		setTextureUVs(this, tex, frameDat)
	}
}




// dispose method - disposes babylon objects

Atlas.prototype.dispose = function () {
	this._baseTexture.dispose()
	this._data = null
	this._scene = null
	this._BABYLON = null
	this.frames.length = 0
}





/*
* 
*      Internals
* 
*/


// interpret string or number frame value, and return frame data from JSON

function getFrameData(self, frame) {
	var framestr = ''
	if (typeof frame === 'number') {
		framestr = self.frames[frame]
	} else {
		framestr = frame
	}
	var dat = self._data.frames[framestr]
	if (!dat) {
		throw new Error('babylon-atlas: frame "' + framestr + '" not found in atlas')
	}

	return dat
}




// This is where the magic happens - for a given frame's x/y/width/height, 
// set the plane mesh's UVs to display that part of the texture

function setMeshUVs(self, mesh, frameDat) {
	var sw = self._data.meta.size.w
	var sh = self._data.meta.size.h
	var x = frameDat.frame.x / sw
	var y = frameDat.frame.y / sh
	var w = frameDat.frame.w / sw
	var h = frameDat.frame.h / sh

	var uvs = mesh.getVerticesData(VertexBuffer.UVKind)

	uvs[0] = uvs[8] = x
	uvs[1] = uvs[9] = 1 - y - h
	uvs[2] = uvs[10] = x + w
	uvs[3] = uvs[11] = 1 - y - h
	uvs[4] = uvs[12] = x + w
	uvs[5] = uvs[13] = 1 - y
	uvs[6] = uvs[14] = x
	uvs[7] = uvs[15] = 1 - y

	mesh.updateVerticesData(VertexBuffer.UVKind, uvs)
}


// Same thing but for textures

function setTextureUVs(self, tex, frameDat) {
	var sw = self._data.meta.size.w
	var sh = self._data.meta.size.h
	var x = frameDat.frame.x
	var y = frameDat.frame.y
	var w = frameDat.frame.w
	var h = frameDat.frame.h

	// in Babylon 2.2 and below:
	// tex.uScale = w/sw
	// tex.vScale = h/sh
	// tex.uOffset = ( sw /2 - x)/w - 0.5
	// tex.vOffset = (-sh/2 + y)/h + 0.5

	// Babylon 2.3 and above:
	tex.uScale = w / sw
	tex.vScale = h / sh
	tex.uOffset = x / sw
	tex.vOffset = (sh - y - h) / sh
}




