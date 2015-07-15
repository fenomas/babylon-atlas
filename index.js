/* global BABYLON */

module.exports = Atlas

var loader = require('load-json-xhr')




// Atlas constructor - keeps the json data and a base texture

function Atlas(imgURL, jsonURL, scene, BAB, noMip, sampling) {
  if (!(this instanceof Atlas)) {
    return new Atlas(imgURL, jsonURL, scene, BAB, noMip, sampling)
  }

  this._ready = false
  this._scene = scene
  this._BABYLON = BAB
  this._data = null
  this._texcache = {}

  this.frames = []

  var dataReady = false
  var texReady = false
  var self = this

  // json loader and event
  loader(jsonURL, function(err, data) {
    if (err) throw err
    self._data = data
    dataReady = true
    if (texReady) initSelf(self);
  })

  // texture loader and event
  this._baseTexture = new BAB.Texture(imgURL, scene, noMip, true, sampling, function() {
    texReady = true
    if (dataReady) initSelf(self);
  })

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
function initSelf(self) {
  for (var s in self._data.frames) {
    self.frames.push(s)
  }
  self._ready = true
}


// Get a texture with the right uv settings for a given frame

Atlas.prototype.getTexture = function(frame) {
  if (this._texcache[frame]) return this._texcache[frame]
  
  var tex = this._baseTexture.clone()
  setTextureSettings(this, frame, tex)
  this._texcache[frame] = tex
  return tex
}



Atlas.prototype.makeSpriteMesh = function(frame, material) {
  var BAB = this._BABYLON
  if (!frame)    frame = 0
  
  // make a material unless one was passed in
  if (!material) {
    material = new BAB.StandardMaterial('spriteMat', this._scene)
    material.specularColor = new BAB.Color3(0,0,0)
    material.emissiveColor = new BAB.Color3(1,1,1)
    material.backFaceCulling = false
  }

  // plane mesh and setup
  var mesh = this._BABYLON.Mesh.CreatePlane('atlas sprite', 1, this._scene)
  mesh.material = material
  material.diffuseTexture = this._baseTexture.clone()
  // decoration property used by this module
  mesh._currentAtlasFrame = null

  setFrame(this, mesh, frame)
  return mesh
}


// public accessor
Atlas.prototype.setMeshFrame = function(mesh, frame) {
  setFrame(this, mesh, frame)
}




// Set a mesh's texture to show a given frame of the altas.
// Also decorates mesh object with property to track current atlas frame

function setFrame(self, mesh, frame) {
  if (frame === mesh._currentAtlasFrame) return

  setTextureSettings(self, frame, mesh.material.diffuseTexture)

  mesh._currentAtlasFrame = frame
}


// function where the main magic is
// defers own call if json/texture data is still loading

function setTextureSettings(self, frame, tex) {
  if (!self._ready) {
    setTimeout(function() { setTextureSettings(self, frame, tex) }, 10)
    return
  }
  
  var framestr = (typeof frame === 'number') ? self.frames[frame] : frame
  var dat = self._data.frames[framestr]
  if (!dat) {
    throw new Error('babylon-atlas: frame "'+framestr+'" not found in atlas')
  }
  
  var size = self._baseTexture.getSize()
  var w = dat.frame.w
  var h = dat.frame.h
  var x = dat.frame.x
  var y = dat.frame.y

  tex.uScale = w/size.width
  tex.vScale = h/size.height
  tex.uOffset = ( size.width /2 - x)/w - 0.5
  tex.vOffset = (-size.height/2 + y)/h + 0.5
}



// dispose method - disposes babylon objects

Atlas.prototype.dispose = function() {
  this._baseTexture.dispose()
  this._data = null
  this._scene = null
  this._BABYLON = null
  this.frames.length = 0
}


