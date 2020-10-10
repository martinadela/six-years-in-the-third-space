;(function() {

    class Camera {
        constructor () {
            this.camera = new THREE.PerspectiveCamera( 
                TSP.config.get('camera.fieldOfViewDegrees'),
                TSP.state.get('window.width') / TSP.state.get('window.height'), 
                TSP.config.get('camera.near'),
                TSP.config.get('camera.far'),
            )
            TSP.state.listen('App.currentUrl', this.currentUrlChanged.bind(this))
            this.resetPosition()
            this.animate = this._animateNoop
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
                this.chasedObject = object
                this.animate = this._animateChase
            } else {
                this.chasedObject = null
                this.animate = this._animateNoop
                this.resetPosition()
            }
        }

        _animateNoop() {}
        _animateChase() {
            const objectPosition = this.chasedObject.getPosition().clone()
            const newPosition = this.chasedObject.getPosition().clone()
            const objectDirection = this.chasedObject.getPosition().clone()
            newPosition.add(objectPosition.addScaledVector(objectDirection, -1.3))

            this.camera.position.x = newPosition.x
            this.camera.position.y = newPosition.y
            this.camera.position.z = newPosition.z

            this.camera.lookAt(this.chasedObject.getPosition())
        }
    }
    
    TSP.components.Camera = Camera
    
})()