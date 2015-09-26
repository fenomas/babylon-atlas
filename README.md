babylon-atlas
==========

Wrangles sprites out of texture atlases for Babylon.js

**Note:** v0.2.0 of this module updates to support breaking changes in 
Babylon.js v2.3, currently in preview. For Babylon 2.2 and below move this
repo to any commit before v0.2.0.

### Usage:

```javascript
var createAtlas = require('babylon-atlas')
var myAtlas = createAtlas('sprites.png', 'sprites.json', scene, BABYLON)

// make a plane mesh showing a given sprite (frame) from the atlas
var mesh = myAtlas.makeSpriteMesh( 'player_walk_001' )

// use the atlas to change the mesh to a different sprite
myAtlas.setMeshFrame( mesh, 'player_jump' )

// or just grab a texture for a particular sprite
myAtlas.getTexture( 'player_jump' ) // returns a BABYLON.Texture
```

Live demo [here](http://andyhall.github.io/babylon-atlas/example/).

### Format

Expexts texture atlas JSON to look something like this:

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

// array of frame names
atlas.frames.length  // 0 until atlas loads

// create a mesh showing one sprite from atlas
//    frame: number (frame index) or string (frame name). default: 0
//    material: if omitted a default material will be created
var mesh = atlas.makeSpriteMesh( frame, material ) 

// set frame of existing mesh. 
//    frame: as previous
atlas.setMeshFrame( mesh, frame ) 

// returns a plain Babylon texture with the right UVs for the given frame 
myAtlas.getTexture( frame )

// disposal
myAtlas.dispose()
```