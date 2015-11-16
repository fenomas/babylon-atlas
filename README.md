babylon-atlas
==========

Wrangles sprites out of texture atlases for Babylon.js

This module gives two separate (and orthogonal) ways to use texture atlases with
Babylon.js, depending on whether you want to work with meshes or textures. 
Behind the scenes, the `mesh` APIs deal with vertex UV values, while 
the `texture` APIs work with the texture's `uvScale`/`uvOffset` properties.

** Updates: **

 * v0.3.0: API changed to reflect parallel support for mesh/texture-based usage 
 * v0.2.0: supports breaking changes in Babylon.js v2.3. 
   When using Babylon 2.2 and below, move this
   repo to any commit before v0.2.0.

### Usage:

```javascript
var createAtlas = require('babylon-atlas')
var atlas = createAtlas('sprites.png', 'sprites.json', scene, BABYLON)

// making a plane mesh showing frames from the atlas
var mesh = atlas.makeSpriteMesh('player_walk')
atlas.setMeshFrame(mesh, 'player_jump')

// working with textures
var mat = myExistingMesh.material
mat.diffuseTexture = atlas.createSpriteTexture('player_walk')
atlas.setTextureFrame(mat.diffuseTexture, 'player_jump')
```

Live demo [here](http://andyhall.github.io/babylon-atlas/example/).

### Format

Expects texture atlas JSON to look something like this:

```json
      {"frames":{
        "frame_001": {"frame": {"x":0, "y":32,"w":22,"h":18} },
        "frame_002": {"frame": {"x":53,"y":0, "w":22,"h":21} }
      }}
```
which is, I guess, a sort-of standard format.

### Installation

```shell
npm install babylon-atlas
```

To run demo locally:

```shell
cd babylon-atlas
npm install
npm test
```

### API

```javascript
// require the constructor
var createAtlas = require('babylon-atlas')

// create an atlas - last two args optional
var atlas = createAtlas( imgURL, jsonURL, scene, BABYLON, noMipMap, samplingMode )

// frame names are accessible as an array of strings
// this will be empty until the atlas loads, but other APIs will still work
atlas.frames

// create a mesh showing one sprite from atlas
//    frame: number (frame index) or string (frame name). default: 0
//    material: if omitted a default material will be created
var mesh = atlas.makeSpriteMesh( frame, material ) 

// set frame of existing mesh. 
//    frame: as previous
atlas.setMeshFrame( mesh, frame ) 

// create a texture showing one sprite from atlas
//    frame: number (frame index) or string (frame name). default: 0
var texture = atlas.makeSpriteTexture( frame )

// set frame of texture 
//    frame: as previous
atlas.setTextureFrame( texture, frame ) 

// disposal
atlas.dispose()
```