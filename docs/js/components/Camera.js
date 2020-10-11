;(function () {
    class Camera {
        constructor() {
            this.camera = new THREE.PerspectiveCamera(
                TSP.config.get('camera.fieldOfViewDegrees'),
                TSP.state.get('window.width') / TSP.state.get('window.height'),
                TSP.config.get('camera.near'),
                TSP.config.get('camera.far')
            )
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
            this.resetPosition()
            this.animate = this._animateNoop
            this.debugCamera = null
        }

        resetPosition() {
            this.camera.position.x = 0
            this.camera.position.y = 0
            this.camera.position.z = TSP.config.get('camera.z')
            this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        }

        currentUrlChanged(url) {
            const object = TSP.state.get('Canvas3D.satellites')[url]
            if (object) {
                const quaternion = new THREE.Quaternion()
                quaternion.setFromAxisAngle(
                    object.planetaryRotationAxis.getV3(),
                    (Math.PI / 6)
                )
                this.chaseData = { 
                    object: object,
                    quaternion: quaternion,
                }
                if (TSP.config.get('debugCamera') === true) {
                    this.animate = this._animateChaseDebug
                } else {
                    this.animate = this._animateChase
                }
            } else {
                this.chaseData = null
                this.animate = this._animateNoop
                this.resetPosition()
            }
        }

        _animateNoop() {}
        _animateChase() {
            const objectPosition = this.chaseData.object.getPosition().clone()
            this.camera.position.copy(objectPosition)
            this.camera.position.applyQuaternion(this.chaseData.quaternion)
            this.camera.lookAt(objectPosition)
        }
        _animateChaseDebug() {
            const realCamera = this.camera
            this.camera = this.debugCamera
            this._animateChase()
            this.camera = realCamera

        }

        show(scene) {
            if (TSP.config.get('debugCamera') === true) {
                this.debugCamera = DebugCamera(scene)
            }
        }

    }

    const DebugCamera = (scene) => {
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

        const zLineMesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 8),
        ]), new THREE.MeshBasicMaterial({
            color: 'blue',
        }))
        group.add( zLineMesh )
    
        const xLineMesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(8, 0, 0),
        ]), new THREE.MeshBasicMaterial({
            color: 'red',
        }))
        group.add( xLineMesh )

        const yLineMesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 8, 0),
        ]), new THREE.MeshBasicMaterial({
            color: 'green',
        }))
        group.add( yLineMesh )

        const proxy = new Proxy(group, {})
        window.debugCamera = proxy
        return proxy
    }

    TSP.components.Camera = Camera
})()
