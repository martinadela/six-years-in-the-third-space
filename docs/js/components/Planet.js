;(function () {
    const URL = TSP.config.get('planet.focusOnUrl')
    const RADIUS = TSP.config.get('planet.radius')

    class Planet {
        constructor() {
            this.geometry = new THREE.SphereBufferGeometry(
                RADIUS,
                32,
                32
            )
            this.material = new THREE.MeshBasicMaterial({
                color: TSP.config.get('planet.color'),
            })
            this.mesh = new THREE.Mesh(this.geometry, this.material)
            this.boundingSphere = new THREE.Sphere(this.mesh.position, RADIUS)
        }

        show(scene) {
            scene.add(this.mesh)
        }

        getObject3D() {
            return this.mesh
        }

        getUrl() {
            return URL
        }

        getHoverableObject3D() {
            return this.mesh
        }
        
        getBoundingSphere() {
            return this.boundingSphere
        }
    }

    TSP.utils.assertImplements(Planet, TSP.utils.interfaces.hoverable)
    TSP.components.Planet = Planet
})()
