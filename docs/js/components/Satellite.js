;(function() {

function Satellite (id, modelUrl, planetaryRotationAxis) {
    this.id = id
    this.modelUrl = modelUrl
    this.model = null

    this.planetaryRotationAxis = planetaryRotationAxis
    this.planetaryRotationAngleStep = TSP.stateGet('satellites.planetaryRotationAngleStep')
    this.planetaryRotationQuaternion = new THREE.Quaternion()

    this._updatePlanetaryRotation()

    this.selfRotationAngleStep = TSP.stateGet('satellites.selfRotationIncrement')
}

Satellite.prototype.load = function(loader) {
    const self = this
    return new Promise(function (resolve, reject) {
        loader.load(TSP.stateGet('app.urlRoot') + self.modelUrl, function ( gltf ) {
            console.log('model loaded')
            self.model = gltf
            resolve(self)
        }, undefined, function (error) {
            console.error(error)
            reject(error)
        })
    })
}

Satellite.prototype.show = function(scene) {
    // Initial position, we take a vector perpendicular to our planetaryRotationAxis
    const sphericalPosition = this.planetaryRotationAxis.getPerpendicularSpherical()
    sphericalPosition.radius = TSP.stateGetRandomized('satellites.planetaryRotationRadius')
    this.moveToSpherical(sphericalPosition)
    scene.add(this.model.scene)
}

Satellite.prototype.planetaryRotationStep = function() {
    this.model.scene.position.applyQuaternion(this.planetaryRotationQuaternion)
}

Satellite.prototype.selfRotationStep = function() {
    const rotateIncrement = TSP.stateGetRandomized('satellites.selfRotationIncrement')
    this.rotateIncrement({
        x: rotateIncrement,
        y: rotateIncrement,
    })
}

Satellite.prototype._updatePlanetaryRotation = function() {
    this.planetaryRotationQuaternion.setFromAxisAngle(this.planetaryRotationAxis.getV3(), this.planetaryRotationAngleStep)
}

Satellite.prototype.getPosition = function() {
    return this.model.scene.position
}

Satellite.prototype.moveToSpherical = function(sphericalPosition) {
    this.getPosition().setFromSpherical(sphericalPosition)
}

Satellite.prototype.rotateIncrement = function(delta) {
    this.model.scene.rotation.x += delta.x || 0
    this.model.scene.rotation.y += delta.y || 0
    this.model.scene.rotation.z += delta.z || 0
}

Satellite.prototype.animate = function() {
    this.selfRotationStep()
    this.planetaryRotationStep()
}

TSP.components.Satellite = Satellite

})()