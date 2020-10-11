;(function () {
    const sheet = jss.default
        .createStyleSheet({
            main: {
                position: 'absolute',
                left: '0',
                top: '0',
                display: 'block',
            },
        })
        .attach()

    class Canvas3D extends HTMLCanvasElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)

            // ------------ Camera
            this.tspCamera = new TSP.components.Camera()

            // ------------ Scene
            this.scene = new THREE.Scene()
            const texture = new THREE.TextureLoader().load(
                TSP.utils.absoluteUrl(TSP.config.get('background.imageUrl'))
            )
            this.scene.background = texture
            this.scene.add(this.tspCamera.camera)

            // ------------ Renderer
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                canvas: this,
            })
            this.renderer.physicallyCorrectLights = true
            this.renderer.outputEncoding = THREE.sRGBEncoding

            // ------------ Lights
            const ambientLight = new THREE.AmbientLight(
                TSP.config.get('lights.ambientColor'),
                TSP.config.get('lights.ambientIntensity')
            )
            ambientLight.name = 'ambient_light'
            this.tspCamera.camera.add(ambientLight)

            const directionalLight = new THREE.DirectionalLight(
                TSP.config.get('lights.directColor'),
                TSP.config.get('lights.directIntensity')
            )
            directionalLight.position.set(0.5, 0, 0.866) // ~60º
            directionalLight.name = 'main_light'
            this.tspCamera.camera.add(directionalLight)

            this.lights = [ambientLight, directionalLight]

            // ------------ state change handlers
            TSP.state.listen(
                'window.width',
                this.updateSize.bind(this)
            )
            TSP.state.listen(
                'window.height',
                this.updateSize.bind(this)
            )
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )

            // ------------
            this.loader = new THREE.GLTFLoader()
            this.mouse = new THREE.Vector2()
            this.hoverableObjectsManager = new Canvas3DHoverableObjectsManager()
            this.createObjects()
        }

        connectedCallback() {
            this.updateSize()
        }

        updateSize() {
            this.width = TSP.state.get('window.width') * this.pixelRatio
            this.height = TSP.state.get('window.height') * this.pixelRatio
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.setSize(
                TSP.state.get('window.width'),
                TSP.state.get('window.height')
            )
        }

        currentUrlChanged(url) {
            if (url === '') {
                this.animateHovered = this._animateHovered
            } else {
                this.animateHovered = this._animateNoop
            }
        }

        createObjects() {
            this.planet = new TSP.components.Planet()

            const satelliteDefinitions = TSP.config.get('satellites.satellites')
            const planetaryRotationAxes = TSP.utils
                .sphericalSpacedOnSphere(satelliteDefinitions.length)
                .map((spherical) => 
                    new TSP.components.RotationAxis(spherical)
                )

            const satellitesState = {}
            this.satellites = satelliteDefinitions.map(
                (satelliteDefinition, i) => {
                    const satellite = new TSP.components.Satellite(
                        satelliteDefinition.url,
                        satelliteDefinition.modelUrl,
                        planetaryRotationAxes[i]
                    )
                    satellitesState[satelliteDefinition.url] = satellite
                    return satellite
                }
            )
            TSP.state.set('Canvas3D.satellites', satellitesState)
        }

        load() {
            Promise.all(
                Object.values(this.satellites).map((satellite) => {
                    return satellite.load(this.loader)
                })
            ).then(() => {
                TSP.state.set('Canvas3D.loaded', true)
            })
        }

        start() {
            this.planet.show(this.scene)
            this.tspCamera.show(this.scene)
            Object.values(this.satellites).forEach((satellite) => {
                satellite.show(this.scene)
                this.hoverableObjectsManager.addHoverable(satellite.getHoverableObject3D(), satellite)
                if (TSP.config.get('debug.satellites') === true) {
                    satellite.planetaryRotationAxis.show(this.scene)
                }
            })
            if (TSP.config.get('debug.satellites') === true) {
                this.axesHelper = new THREE.AxesHelper(
                    TSP.config.get('planet.radius') + 5
                )
                this.scene.add(this.axesHelper)
            }

            window.addEventListener(
                'mousemove',
                (event) => {
                    // calculate mouse position in normalized device coordinates
                    // (-1 to +1) for both components
                    // Ref : https://threejs.org/docs/#api/en/core/Raycaster
                    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
                },
                false
            )
            this.animate()
        }

        animate() {
            requestAnimationFrame(this.animate.bind(this))
            this.animateHovered()

            Object.values(this.satellites).forEach((satellite) => satellite.animate())
            this.tspCamera.animate()
            this.renderer.render(this.scene, this.tspCamera.camera)
        }

        _animateNoop() {}
        _animateHovered() {
            this.hoverableObjectsManager.detect(this.mouse, this.tspCamera.camera, (_, hoveredObject) => {
                TSP.state.set('Canvas3D.hoveredObject', hoveredObject)
            })
        }
    }

    customElements.define('tsp-canvas-3d', Canvas3D, { extends: 'canvas' })

    class Canvas3DHoverableObjectsManager {
        constructor() {
            this.raycaster = new THREE.Raycaster()
            this.hoveredObject = null
            this.hoverableObjects3D = []
            this.hoverableObjectsUuid = {}
        }

        addHoverable(object3D, datum) {
            this.hoverableObjects3D.push(object3D)
            this.hoverableObjectsUuid[object3D.uuid] = datum
        }

        detect(mouse, camera, onHoveredChanged) {
            this.raycaster.setFromCamera(mouse, camera)
            const intersects = this.raycaster.intersectObjects(
                this.hoverableObjects3D,
                true
            )
            let newHoveredObject = null
            if (intersects.length) {
                const hoveredObjects = intersects.map((intersected) => this._findHoverableObject(intersected.object))
                // If the currently hovered object is still intersected, we don't change the state
                if (hoveredObjects.indexOf(this.hoveredObject) !== -1) {
                    return
                }
                newHoveredObject = hoveredObjects[0]
            }
            if (newHoveredObject !== this.hoveredObject) {
                this.hoveredObject = newHoveredObject
                onHoveredChanged(newHoveredObject, newHoveredObject ? this._getDatum(newHoveredObject): null)
            }
        }

        _findHoverableObject(object3D) {
            while (
                !(object3D.uuid in this.hoverableObjectsUuid) &&
                object3D.parent
            ) {
                object3D = object3D.parent
            }
            if (!this.hoverableObjectsUuid[object3D.uuid]) {
                console.error(`object cannot be found`)
            }
            return object3D
        }

        _getDatum(object3D) {
            return this.hoverableObjectsUuid[object3D.uuid]
        }
    }

    TSP.components.Canvas3D = Canvas3D
})()
