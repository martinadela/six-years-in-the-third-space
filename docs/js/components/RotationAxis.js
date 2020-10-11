;(function () {
    class RotationAxis {
        constructor(spherical) {
            this.spherical = spherical
        }

        show(scene) {
            const material = new THREE.LineBasicMaterial({ color: 0x666666 })
            const sphericalFurther = this.spherical.clone()
            sphericalFurther.radius += 200
            const points = [
                TSP.utils.sphericalToV3(this.spherical),
                TSP.utils.sphericalToV3(sphericalFurther),
            ]

            var geometry = new THREE.BufferGeometry().setFromPoints(points)
            var line = new THREE.Line(geometry, material)
            scene.add(line)
        }

        getV3() {
            return TSP.utils.sphericalToV3(this.spherical).normalize()
        }

        getPerpendicularSpherical() {
            const perpendicularSpherical = this.spherical.clone()
            TSP.utils.incrementSpherical(perpendicularSpherical, {
                phi: Math.PI / 2,
            })
            return perpendicularSpherical
        }
    }

    TSP.components.RotationAxis = RotationAxis
})()
