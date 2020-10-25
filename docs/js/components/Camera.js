;(function () {
    const PLANET_FOCUS_ON_URL = TSP.config.get('planet.focusOnUrl')

    class Camera {
        constructor() {
            const far = Math.round(
                TSP.config.get('universe.radius') * 2 +
                    TSP.config.get('universe.radius') * 0.1
            )

            window.camera = this.camera = new THREE.PerspectiveCamera(
                TSP.config.get('camera.fieldOfViewDegrees'),
                1,
                TSP.config.get('camera.near'),
                far
            )

            // ------------ state change handlers
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
            TSP.state.listen(
                'window.dimensions',
                this.windowDimensionsChanged.bind(this)
            )

            // ------------ initialize
            this.initialTransition = true
            this.tweens = new TWEEN.Group()
            this.debugCamera = null
            this.focusedObject = null
            this.updateSize()
            this.applyTransform(this.transformDefault())
        }

        windowDimensionsChanged() {
            this.updateSize()
            if (this.focusedObject === null) {
                this.applyTransform(this.transformDefault())
            }
        }

        updateSize() {
            const windowDimensions = TSP.state.get('window.dimensions')
            this.camera.aspect = windowDimensions.x / windowDimensions.y
            this.camera.updateProjectionMatrix()
        }

        refresh() {
            this.currentUrlChanged(TSP.state.get('App.currentUrl'))
        }

        currentUrlChanged(url) {
            // We schedule camera movement to next tick, to allow
            // all other pages to set themselve up (in particular allowing the satellite-viewer
            // to get in the right position)
            setTimeout(() => {
                this.focusedObject = null
                const satellite = TSP.state.get('Canvas3D.satellites')[url]
                if (url === PLANET_FOCUS_ON_URL) {
                    this.focusedObject = TSP.state.get('Canvas3D.planet')
                    this.withDebugging(() =>
                        this.animateTransform(this.transformFocused())
                    )
                } else if (satellite) {
                    this.focusedObject = satellite
                    this.withDebugging(() =>
                        this.animateTransform(this.transformFocused())
                    )
                } else if (url === '') {
                    this.withDebugging(() =>
                        this.animateTransform(this.transformDefault())
                    )
                } else {
                    this.withDebugging(() =>
                        this.animateTransform(this.transformDefault())
                    )
                }
                this.initialTransition = false  
            }, 0)
        }

        show(scene) {
            if (TSP.config.get('debug.camera') === true) {
                this.debugCamera = DebugCamera(scene, this.camera)
            }
        }

        transformDefault() {
            const orbitDiameter =
                (TSP.config.get('satellites.planetaryRotationRadius')[0] +
                    TSP.config.get('satellites.planetaryRotationRadius')[1]) *
                2
            const paddingRatio = TSP.config.get('camera.paddingRatio')
            // We need to adjust the camera to the biggest side of the window
            let cameraZ = TSP.utils.computeCameraDistance(
                this.camera,
                new THREE.Vector2(1, 1).multiplyScalar(
                    orbitDiameter * (1 + paddingRatio)
                )
            )

            // On first load of the website, we don't want to do weird camera movement
            if (this.initialTransition) {
                return {
                    translation: new THREE.Vector3(0, 0, cameraZ),
                    rotation: new THREE.Quaternion(),
                }
            }

            // Compute a random translation and a random rotation to make sure that the camera 
            // is not idle during a transition from page to page
            const sphericalPosition = TSP.utils.v3ToSpherical(this.camera.position) 
            sphericalPosition.phi = (sphericalPosition.phi + Math.random() * Math.PI / 5) % Math.PI
            sphericalPosition.theta = (sphericalPosition.theta + Math.random() * Math.PI / 6) % (2 * Math.PI)
            sphericalPosition.radius = cameraZ
            const translation = new THREE.Vector3().setFromSpherical(sphericalPosition)
            const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), translation.clone().normalize())
            return {
                translation: translation,
                rotation: rotation,
            }
        }

        transformFocused() {
            const objectBoundingBoxWorld = new THREE.Box3().setFromObject(
                this.focusedObject.getObject3D()
            )
            const objectBoundingBoxOnScreen = this.getObjectBoundingBoxOnScreen()
            return TSP.utils.computeCameraOrbitalTransform(
                this.camera,
                objectBoundingBoxWorld,
                TSP.utils.getCanvasBoundingBoxOnScreen(),
                objectBoundingBoxOnScreen
            )
        }

        transformOverview() {
            const objectBoundingBoxOnScreen = this.getObjectBoundingBoxOnScreen()
            const satelliteOrbitDiameter =
                TSP.config.get('satellites.planetaryRotationRadius')[0] * 2
            const boundingBoxWorld = new THREE.Box3().setFromCenterAndSize(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(
                    satelliteOrbitDiameter,
                    satelliteOrbitDiameter,
                    satelliteOrbitDiameter
                )
            )
            return TSP.utils.computeCameraOrbitalTransform(
                this.camera,
                boundingBoxWorld,
                TSP.utils.getCanvasBoundingBoxOnScreen(),
                objectBoundingBoxOnScreen
            )
        }

        getObjectBoundingBoxOnScreen() {
            const satelliteViewer = TSP.state
                .get('Reader.component')
                .querySelector('tsp-satellite-viewer')
            // Forces reflow before adding the transition class to ensure animation will be triggered
            // REF : https://gist.github.com/paulirish/5d52fb081b3570c81e3a
            // REF : https://stackoverflow.com/questions/21664940/force-browser-to-trigger-reflow-while-changing-css
            const satelliteViewerBoundingRect = satelliteViewer
                .getBoundingClientRect()

            return new THREE.Box2(
                new THREE.Vector2(
                    satelliteViewerBoundingRect.left,
                    satelliteViewerBoundingRect.top,
                ),
                new THREE.Vector2(
                    satelliteViewerBoundingRect.right,
                    satelliteViewerBoundingRect.bottom,
                )
            )
        }

        animateTransform(transform) {
            this.tweens.removeAll()
            TSP.utils.tweenTranslate(this.camera, transform.translation, {
                duration: TSP.config.get('transitions.duration'),
                group: this.tweens,
            })
            TSP.utils.tweenRotate(this.camera, transform.rotation, {
                duration: TSP.config.get('transitions.duration'),
                group: this.tweens,
            })
        }

        applyTransform(transform) {
            this.tweens.removeAll()
            this.camera.position.copy(transform.translation)
            this.camera.quaternion.copy(transform.rotation)
        }

        animate() {
            this.tweens.update()
        }

        withDebugging(initializeAnimation) {
            const realCamera = this.camera
            if (TSP.config.get('debug.camera') === true) {
                this.debugCamera.position.copy(this.camera.position)
                this.debugCamera.quaternion.copy(this.camera.quaternion)
                this.camera = this.debugCamera
            }
            initializeAnimation()
            if (TSP.config.get('debug.camera') === true) {
                this.camera = realCamera
            }
        }
    }

    const DebugCamera = (scene, camera) => {
        const group = new THREE.Group()
        scene.add(group)

        const sphereMesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(
                TSP.config.get('planet.radius') / 20,
                32,
                32
            ),
            new THREE.MeshBasicMaterial({
                color: 'red',
            })
        )
        group.add(sphereMesh)
        ;[
            [new THREE.Vector3(8, 0, 0), 'red'],
            [new THREE.Vector3(0, 8, 0), 'green'],
            [new THREE.Vector3(0, 0, 8), 'blue'],
        ].forEach((axis) => {
            const lineMesh = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, 0),
                    axis[0],
                ]),
                new THREE.MeshBasicMaterial({
                    color: axis[1],
                })
            )
            group.add(lineMesh)
        })

        const proxy = new Proxy(group, {
            get: function (target, prop, receiver) {
                if (!(prop in group) && prop in camera) {
                    return camera[prop]
                }
                return group[prop]
            },
        })
        window.debugCamera = proxy
        return proxy
    }

    TSP.components.Camera = Camera
})()
