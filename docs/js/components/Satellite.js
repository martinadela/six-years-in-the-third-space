;(function () {
    class Satellite {
        constructor(url, modelUrl, planetaryRotationAxis, hudClassName) {
            this.url = url
            this.modelUrl = modelUrl
            this.hudClassName = hudClassName
            this.model = null

            this.group = new THREE.Group()
            this.clickSphere = null
            this.boundingSphere = null

            this.planetaryRotationAxis = planetaryRotationAxis
            this.planetaryRotationAngleStep = TSP.config.getRandomized(
                'satellites.planetaryRotationAngleStep'
            )
            this.planetaryRotationQuaternion = new THREE.Quaternion()
            this.planetaryRotationStep = this._planetaryRotationStep.bind(this)

            this.updatePlanetaryRotation()

            this.selfRotationIncrement = TSP.config.getRandomized(
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

        load() {
            return new Promise((resolve, reject) => {
                TSP.state.get('Canvas3D.gltfLoader').load(
                    TSP.utils.absoluteUrl(this.modelUrl),
                    (gltf) => {
                        console.log('model loaded')
                        this.model = gltf
                        this.updateClickSphere()
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
            this.getPosition().setFromSpherical(sphericalPosition)
            scene.add(this.group)
        }

        updateClickSphere() {
            this.boundingSphere = TSP.utils.getObjectBoundingSphereInWorld(
                this.model.scene
            )
            this.clickSphere = new THREE.Mesh(
                new THREE.SphereBufferGeometry(
                    this.boundingSphere.radius * (1 + 0.3),
                    6,
                    6
                ),
                new THREE.MeshBasicMaterial({
                    color: 'red',
                    opacity: TSP.config.get('debug.satellites') ? 0.4 : 0,
                    transparent: true,
                })
            )
            this.clickSphere.position.copy(this.boundingSphere.center)
            this.group.add(this.clickSphere)
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

        updatePlanetaryRotation() {
            this.planetaryRotationQuaternion.setFromAxisAngle(
                this.planetaryRotationAxis.getV3(),
                this.planetaryRotationAngleStep
            )
        }

        getPosition() {
            return this.group.position
        }

        getRotation() {
            return this.group.rotation
        }

        getHoverableObject3D() {
            return this.clickSphere
        }

        getBoundingSphere() {
            return new THREE.Sphere(
                new THREE.Vector3().setFromMatrixPosition(
                    this.clickSphere.matrixWorld
                ),
                this.boundingSphere.radius
            )
        }

        getHudClassName() {
            return this.hudClassName
        }

        getUrl() {
            return this.url
        }

        getObject3D() {
            return this.group
        }

        _planetaryRotationStepNoop() {}
        _planetaryRotationStep() {
            this.group.position.applyQuaternion(
                this.planetaryRotationQuaternion
            )
        }

        selfRotationStep() {
            const rotation = this.getRotation()
            rotation.x += this.selfRotationIncrement
            rotation.y += this.selfRotationIncrement
        }

        animate() {
            this.selfRotationStep()
            this.planetaryRotationStep()
        }

        toString() {
            return `Satellite("${this.url}")`
        }
    }

    TSP.utils.assertImplements(Satellite, TSP.utils.interfaces.hoverable)
    TSP.utils.assertImplements(Satellite, TSP.utils.interfaces.hudTarget)

    TSP.components.Satellite = Satellite
})()
