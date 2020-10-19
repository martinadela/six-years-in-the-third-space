;(function () {
    class Lights {
        constructor(camera, scene) {
            this.camera = camera

            this.ambientLight = new THREE.AmbientLight(
                TSP.config.get('lights.ambientColor'),
                TSP.config.get('lights.ambientIntensity')
            )
            camera.add(this.ambientLight)

            this.directionalLight = new THREE.DirectionalLight(
                TSP.config.get('lights.directColor'),
                TSP.config.get('lights.directIntensity')
            )
            const directionalLightSphericalPosition = TSP.config.get(
                'lights.directPosition'
            )
            directionalLightSphericalPosition.radius *= TSP.config.get(
                'universe.radius'
            )
            this.directionalLight.position.setFromSpherical(
                directionalLightSphericalPosition
            )
            camera.add(this.directionalLight)

            window.light = this.spotLight = new THREE.SpotLight(
                0xffffff,
                0,
                0,
                Math.PI / 4
            )
            scene.add(this.spotLight)

            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        currentUrlChanged(url) {
            const satellite = TSP.state.get('Canvas3D.satellites')[url]
            if (satellite) {
                this.spotLightSatellite(satellite)
            } else {
                this.spotLightOff()
            }
        }

        spotLightSatellite(satellite) {
            this.spotLight.intensity = TSP.config.get('lights.spotIntensity')
            this.spotLight.target = satellite.getObject3D()
            setTimeout(() => {
                this.spotLight.position.copy(this.camera.position)
            }, TSP.config.get('transitions.duration'))
        }

        spotLightOff() {
            this.spotLight.intensity = 0
        }
    }

    TSP.components.Lights = Lights
})()
