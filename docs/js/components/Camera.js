;(function() {

    class Camera {
        constructor () {
            this.camera = new THREE.PerspectiveCamera( 
                TSP.state.get('camera.fieldOfViewDegrees'),
                TSP.state.get('window.width') / TSP.state.get('window.height'), 
                TSP.state.get('camera.near'),
                TSP.state.get('camera.far'),
            )
            this.camera.position.z = TSP.state.get('camera.z')
            TSP.state.listen('Camera.chase', this.onChase.bind(this))
            this.animate = this._animateNoop
        }

        onChase(object) {
            if (object) {
                this.chasedObject = object
                this.animate = this._animateChase
            } else {
                this.chasedObject = null
                this.animate = this._animateNoop
            }
        }

        _animateNoop() {}
        _animateChase() {
            const newPosition = this.chasedObject.getPosition()
            this.camera.position.x = newPosition.x
            this.camera.position.y = newPosition.y
            this.camera.position.z = newPosition.z
        }
    }
    
    TSP.components.Camera = Camera
    
})()