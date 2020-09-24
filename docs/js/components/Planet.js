;(function() {

function Planet () {
    this.geometry = new THREE.SphereBufferGeometry( TSP.state.get('planet.radius'), 32, 32 )
    this.material = new THREE.MeshBasicMaterial( { color: TSP.state.get('planet.color') } )
    this.mesh = new THREE.Mesh( this.geometry, this.material )
}

Planet.prototype.show = function(scene) {
    scene.add(this.mesh)
}

TSP.components.Planet = Planet

})()