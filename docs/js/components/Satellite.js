;(function () {
    class Satellite {
        constructor(url, modelUrl, planetaryRotationAxis) {
            this.url = url
            this.modelUrl = modelUrl
            this.model = null

            this.group = new THREE.Group()
            this.clickSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(
                TSP.config.get('satellites.clickRadius'),
                6,
                6
            ), new THREE.MeshBasicMaterial({
                color: 'red', opacity: TSP.config.get('debug.satellites') ? 0.4 : 0, transparent: true,
            }))
            this.group.add(this.clickSphere)

            this.planetaryRotationAxis = planetaryRotationAxis
            this.planetaryRotationAngleStep = TSP.config.get(
                'satellites.planetaryRotationAngleStep'
            )
            this.planetaryRotationQuaternion = new THREE.Quaternion()
            this.planetaryRotationStep = this._planetaryRotationStep.bind(this)

            this._updatePlanetaryRotation()

            this.selfRotationAngleStep = TSP.config.get(
                'satellites.selfRotationIncrement'
            )
            TSP.state.listen(
                'Canvas3D.hoveredObject',
                this.hoveredObjectChanged.bind(this)
            )
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        load(loader) {
            return new Promise((resolve, reject) => {
                loader.load(
                    TSP.utils.absoluteUrl(this.modelUrl),
                    (gltf) => {
                        console.log('model loaded')
                        this.model = gltf
                        this.group.add(this.model.scene)
                        resolve(this)
                    },
                    undefined,
                    (error) => {
                        console.error(error)
                        reject(error)
                    }
                )
            })
        }

        show(scene) {
            // Initial position, we take a vector perpendicular to our planetaryRotationAxis
            const sphericalPosition = this.planetaryRotationAxis.getPerpendicularSpherical()
            sphericalPosition.radius = TSP.config.getRandomized(
                'satellites.planetaryRotationRadius'
            )
            this.moveToSpherical(sphericalPosition)
            scene.add(this.group)
        }

        hoveredObjectChanged(hoveredObject) {
            if (hoveredObject === this) {
                this.planetaryRotationStep = this._planetaryRotationStepNoop
            } else {
                this.planetaryRotationStep = this._planetaryRotationStep.bind(
                    this
                )
            }
        }

        currentUrlChanged(url) {
            if (url === this.url) {
                this.planetaryRotationStep = this._planetaryRotationStepNoop
            } else {
                this.planetaryRotationStep = this._planetaryRotationStep.bind(
                    this
                )
            }
        }

        _updatePlanetaryRotation() {
            this.planetaryRotationQuaternion.setFromAxisAngle(
                this.planetaryRotationAxis.getV3(),
                this.planetaryRotationAngleStep
            )
        }

        getPosition() {
            return this.group.position
        }

        getDirection() {
            const currentPosition = this.getPosition().clone()
            const nextPosition = this.getPosition().clone()
                .applyQuaternion(this.planetaryRotationQuaternion)
            return nextPosition.sub(currentPosition).normalize()
        }

        getHoverableObject3D() {
            return this.clickSphere
        }

        moveToSpherical(sphericalPosition) {
            this.getPosition().setFromSpherical(sphericalPosition)
        }

        rotateIncrement(delta) {
            this.group.rotation.x += delta.x || 0
            this.group.rotation.y += delta.y || 0
            this.group.rotation.z += delta.z || 0
        }

        _planetaryRotationStepNoop() {}
        _planetaryRotationStep() {
            this.group.position.applyQuaternion(
                this.planetaryRotationQuaternion
            )
        }

        selfRotationStep() {
            const rotateIncrement = TSP.config.getRandomized(
                'satellites.selfRotationIncrement'
            )
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
