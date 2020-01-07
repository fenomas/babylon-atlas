/* global BABYLON */


// set up standard sort of scene
var vec3 = BABYLON.Vector3
var cv = document.getElementById('canvas')
var engine = new BABYLON.Engine(cv)
var scene = new BABYLON.Scene(engine)
scene.clearColor = new BABYLON.Color3(0.8, 0.85, 0.9)
var camera = new BABYLON.ArcRotateCamera('camera', -1, 1.2, 6, new vec3(0, 1, 0), scene)
var light = new BABYLON.HemisphericLight('light', new vec3(0.1, 1, 0.3), scene)
camera.attachControl(cv)
var plane = BABYLON.Mesh.CreateGround('ground', 5, 5, 1, scene)


// atlas constructor
var createAtlas = require('..')

// make an atlas for a given image+JSON
var myAtlas = createAtlas('sprites.png', 'sprites.json', scene, BABYLON)
window.atlas = myAtlas

var mesh = myAtlas.makeSpriteMesh()
mesh.position.y = 1.2
mesh.scaling.x = 1.5
mesh.scaling.y = 2


// in this demo sprites need full alpha - not true of all textures
mesh.material.opacityTexture = mesh.material.diffuseTexture


// cycle through frames
var num = 0
setInterval(function () {
	if (!myAtlas.frames.length) return // json not loaded yet
	num = (num + 1) % myAtlas.frames.length

	myAtlas.setMeshFrame(mesh, myAtlas.frames[num])
	// or just: myAtlas.setMeshFrame(mesh, num)
}, 500)



// make a second mesh from the same atlas
var mesh2 = myAtlas.makeSpriteMesh(1)
mesh2.position.y = 1.2
mesh2.position.z = 1
mesh2.position.x = 1



// make a mesh manually and set its texture to be a sprite
var mesh3 = BABYLON.Mesh.CreatePlane('m3', 1, scene)
mesh3.material = new BABYLON.StandardMaterial('mat', scene)
mesh3.material.specularColor = new BABYLON.Color3(0, 0, 0)
mesh3.material.emissiveColor = new BABYLON.Color3(1, 1, 1)
mesh3.material.backFaceCulling = false
mesh3.position.y = .8
mesh3.position.z = -1
mesh3.position.x = -1

mesh3.material.diffuseTexture = myAtlas.makeSpriteTexture(6)

var num2 = 0
var fr2 = [4, 5, 6]
setInterval(function () {
	if (!myAtlas.frames.length) return // json not loaded yet
	num2 = (num2 + 1) % fr2.length
	myAtlas.setTextureFrame(mesh3.material.diffuseTexture, fr2[num2])
}, 1000)



// render the scene
function render() {
	scene.render()
	requestAnimationFrame(render)
}
render()

