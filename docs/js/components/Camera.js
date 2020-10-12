;(function () {
    class Camera {
        constructor() {
            this.camera = new THREE.PerspectiveCamera(
                TSP.config.get('camera.fieldOfViewDegrees'),
                1,
                TSP.config.get('camera.near'),
                TSP.config.get('camera.far')
            )

            // ------------ state change handlers
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
            TSP.state.listen(
                'window.width',
                this.windowDimensionsChanged.bind(this)
            )
            TSP.state.listen(
                'window.height',
                this.windowDimensionsChanged.bind(this)
            )

            // ------------ initialize
            this.updateSize()
            this.resetPosition()
            this.animate = this._animateNoop
            this.debugCamera = null
        }

        windowDimensionsChanged() {
            this.updateSize()
            if (this.chasing === null) {
                this.resetPosition()
            }
        }

        resetPosition() {
            const orbitDiameter = (
                TSP.config.get('satellites.planetaryRotationRadius')[0] 
                + TSP.config.get('satellites.planetaryRotationRadius')[1]) * 2
                + TSP.config.get('satellites.clickRadius')
            const paddingRatio = TSP.config.get('camera.paddingRatio')
            // We need to adjust the camera to the biggest side of the window
            let cameraZ = TSP.utils.computeCameraDistance(
                this.camera.aspect, this.camera.fov, orbitDiameter * (1 + paddingRatio), orbitDiameter * (1 + paddingRatio))
            this.camera.position.set(0, 0, cameraZ)
            this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        }

        updateSize() {
            this.camera.aspect = TSP.state.get('window.width') / TSP.state.get('window.height')
            this.camera.updateProjectionMatrix()
        }

        currentUrlChanged(url) {
            const object = TSP.state.get('Canvas3D.satellites')[url]
            if (object) {
                const quaternion = new THREE.Quaternion()
                quaternion.setFromAxisAngle(
                    object.planetaryRotationAxis.getV3(),
                    (Math.PI / 6)
                )
                this.chasing = {
                    object: object,
                    quaternion: quaternion,
                }
                if (TSP.config.get('debug.camera') === true) {
                    this.animate = this._animateChaseDebug
                } else {
                    this.animate = this._animateChase
                }
            } else {
                this.chasing = null
                this.animate = this._animateNoop
                this.resetPosition()
            }
        }

        _animateNoop() {}
        _animateChase() {
            const planeScreenWidth = TSP.state.get('window.width')
            const planeScreenHeight = TSP.state.get('window.height')
            const objectCanvasWidth = TSP.config.get('satellites.clickRadius') * 2
            const objectPositionV3 = this.chasing.object.getPosition().clone()

            // Get dimensions / offsets of the object to focus, in screen coordinates 
            const sidebarBoundingRect = TSP.state.get('Sidebar.element').getBoundingClientRect()
            const objectScreenWidth = sidebarBoundingRect.width
            const objectScreenHeight = objectScreenWidth
            // Calculate the [X, Y] of the object in screen (pixel) coordinates, and centered on 0.
            const objectScreenX = (sidebarBoundingRect.left + objectScreenWidth / 2) - planeScreenWidth / 2
            const objectScreenY = (sidebarBoundingRect.bottom - objectScreenHeight / 2) - planeScreenHeight / 2

            // Get the equivalent dimensions / offset [X, Y] of the object in canvas coordinates.
            const canvasScreenRatio = (objectCanvasWidth / objectScreenWidth)
            const planeCanvasWidth = planeScreenWidth * canvasScreenRatio
            const planeCanvasHeight = planeScreenHeight * canvasScreenRatio
            const objectCanvasX = -objectScreenX * canvasScreenRatio
            const objectCanvasY = objectScreenY * canvasScreenRatio

            // Compute transforms to place the camera in the right position / angle
            const cameraDistance = TSP.utils.computeCameraDistance(this.camera.aspect, this.camera.fov, planeCanvasWidth, planeCanvasHeight)
            const transforms = TSP.utils.sphericalFocus(objectPositionV3, cameraDistance, objectCanvasX, objectCanvasY)
            this.camera.position.copy(transforms.translation)
            this.camera.quaternion.copy(transforms.rotation)

            // As the object is not changing position, we switch back to no animation
            this.animate = this._animateNoop
        }
        _animateChaseDebug() {
            const realCamera = this.camera
            this.debugCamera.position.copy(this.camera.position)
            this.debugCamera.quaternion.copy(this.camera.quaternion)
            this.camera = this.debugCamera
            this._animateChase()
            this.camera = realCamera
        }

        show(scene) {
            if (TSP.config.get('debug.camera') === true) {
                this.debugCamera = DebugCamera(scene, this.camera)
            }
        }

    }

    const DebugCamera = (scene, camera) => {
        const group = new THREE.Group()
        scene.add(group)

        const sphereMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(
            TSP.config.get('planet.radius') / 20,
            32,
            32
        ), new THREE.MeshBasicMaterial({
            color: 'red',
        }))
        group.add( sphereMesh )

        ;([
            [new THREE.Vector3(8, 0, 0), 'red'],
            [new THREE.Vector3(0, 8, 0), 'green'],
            [new THREE.Vector3(0, 0, 8), 'blue'],
        ]).forEach((axis) => {
            const lineMesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                axis[0],
            ]), new THREE.MeshBasicMaterial({
                color: axis[1],
            }))
            group.add( lineMesh )
        })

        const proxy = new Proxy(group, {
            get: function(target, prop, receiver) {
                if (!(prop in group) && (prop in camera)) {
                    return camera[prop]
                }
                return group[prop]
            }
        })
        window.debugCamera = proxy
        return proxy
    }

    TSP.components.Camera = Camera
})()
