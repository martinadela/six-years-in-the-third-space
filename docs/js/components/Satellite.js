;(function() {

class Satellite  {

    constructor (url, modelUrl, planetaryRotationAxis) {
        this.url = url
        this.modelUrl = modelUrl
        this.model = null
    
        this.planetaryRotationAxis = planetaryRotationAxis
        this.planetaryRotationAngleStep = TSP.config.get('satellites.planetaryRotationAngleStep')
        this.planetaryRotationQuaternion = new THREE.Quaternion()
        this.planetaryRotationStep = this._planetaryRotationStep.bind(this)

        this._updatePlanetaryRotation()
    
        this.selfRotationAngleStep = TSP.config.get('satellites.selfRotationIncrement')
        TSP.state.listen('Canvas3D.hoveredObject', this.hoveredObjectChanged.bind(this))
    }
    
    load(loader) {
        const self = this
        return new Promise(function (resolve, reject) {
            loader.load(TSP.utils.absoluteUrl(self.modelUrl), function ( gltf ) {
                console.log('model loaded')
                self.model = gltf
                resolve(self)
            }, undefined, function (error) {
                console.error(error)
                reject(error)
            })
        })
    }

    show(scene) {
        // Initial position, we take a vector perpendicular to our planetaryRotationAxis
        const sphericalPosition = this.planetaryRotationAxis.getPerpendicularSpherical()
        sphericalPosition.radius = TSP.config.getRandomized('satellites.planetaryRotationRadius')
        this.moveToSpherical(sphericalPosition)
        scene.add(this.model.scene)
    }

    hoveredObjectChanged(hoveredObject) {
        if (hoveredObject === this) {
            this.planetaryRotationStep = this._planetaryRotationStepNoop
        } else {
            this.planetaryRotationStep = this._planetaryRotationStep.bind(this)
        }
    }

    _updatePlanetaryRotation() {
        this.planetaryRotationQuaternion.setFromAxisAngle(this.planetaryRotationAxis.getV3(), this.planetaryRotationAngleStep)
    }

    getPosition() {
        return this.model.scene.position
    }

    getDirection() {
        const nextPosition = this.model.scene.position.clone()
        nextPosition.applyQuaternion(this.planetaryRotationQuaternion)
        return nextPosition.sub(this.model.scene.position)
    }

    getObject3D() {
        return this.model.scene
    }

    moveToSpherical(sphericalPosition) {
        this.getPosition().setFromSpherical(sphericalPosition)
    }

    rotateIncrement(delta) {
        this.model.scene.rotation.x += delta.x || 0
        this.model.scene.rotation.y += delta.y || 0
        this.model.scene.rotation.z += delta.z || 0
    }

    _planetaryRotationStepNoop() {}
    _planetaryRotationStep() {
        this.model.scene.position.applyQuaternion(this.planetaryRotationQuaternion)
    }

    selfRotationStep() {
        const rotateIncrement = TSP.config.getRandomized('satellites.selfRotationIncrement')
        this.rotateIncrement({
            x: rotateIncrement,
            y: rotateIncrement,
        })
    }

    animate() {
        this.selfRotationStep()
        this.planetaryRotationStep()
    }

    toString() {
        return `Satellite("${this.url}")`
    }
}

TSP.components.Satellite = Satellite

})()