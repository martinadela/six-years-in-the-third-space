;(function () {

    // REF : https://stackoverflow.com/questions/32233805/im-new-to-threejs-how-to-create-a-sky-dome
    class Universe {
        constructor() {
            const texture = new THREE.TextureLoader().load(
                TSP.utils.absoluteUrl(TSP.config.get('universe.imageUrl'))
            )
            texture.wrapS = THREE.MirroredRepeatWrapping
            texture.wrapT = THREE.MirroredRepeatWrapping
            texture.repeat.set(4, 4)
            const skyGeo = new THREE.SphereGeometry(TSP.config.get('universe.radius'), 25, 25)
            const material = new THREE.MeshPhongMaterial({ 
                map: texture,
            })
            this.mesh = new THREE.Mesh(skyGeo, material)
            this.mesh.material.side = THREE.BackSide
        }

        show(scene) {
            scene.add(this.mesh)
        }
    }

    TSP.components.Universe = Universe
})()