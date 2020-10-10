;(function () {
    class Planet {
        constructor() {
            this.geometry = new THREE.SphereBufferGeometry(
                TSP.config.get('planet.radius'),
                32,
                32
            )
            this.material = new THREE.MeshBasicMaterial({
                color: TSP.config.get('planet.color'),
            })
            this.mesh = new THREE.Mesh(this.geometry, this.material)
        }

        show(scene) {
            scene.add(this.mesh)
        }

        getObject3D() {
            return this.mesh
        }
    }

    TSP.components.Planet = Planet
})()
