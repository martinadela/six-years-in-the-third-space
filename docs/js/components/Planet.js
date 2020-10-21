;(function () {
    const URL = TSP.config.get('planet.focusOnUrl')
    const BASE_RADIUS = TSP.config.get('planet.radius')
    const TSP_TEXTURE_GENERATOR = document.createElement(
        'tsp-image-texture-generator'
    )
    TSP_TEXTURE_GENERATOR.setDebug(true)

    const vShader = `
        varying float vAltitude;
        varying vec3 vColor;

        attribute float altitude;
        attribute vec3 newPosition;
        attribute vec3 color;

        void main() {
            vColor = color;
            vAltitude = altitude;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
    `

    const fShader = `
        varying float vAltitude;
        varying vec3 vColor;

        void main() {
            vec4 total = vec4(vColor, 1.0);
            gl_FragColor = total;
        }
    `

    class Planet {
        constructor() {}

        show(scene) {
            scene.add(this.mesh)
        }

        createObjects() {
            this.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 64, 64, 64)
            const positionArray = this.geometry.attributes.position.array
            const uvArray = this.geometry.attributes.uv.array
            const positionCount = positionArray.length / 3.0

            const altitudeArray = new Float32Array(positionCount)
            const newPositionArray = new Float32Array(positionCount * 3)
            const colorArray = new Float32Array(positionCount * 3)

            const uv = new THREE.Vector2()
            const rgb = new THREE.Vector3()
            const position = new THREE.Vector3()
            for (let i = 0; i < positionCount; i++) {
                TSP.utils.readAttributeToVector2(uvArray, i, uv)
                TSP.utils.readAttributeToVector3(positionArray, i, position)

                const altitude = computeAltitude(uv, position)
                altitudeArray[i] = altitude

                const radius = BASE_RADIUS + altitudeAmplitude * altitude
                const newPosition = position.clone()
                    .normalize()
                    .multiplyScalar(radius)
                
                rgb.set(1 - altitude, 1 - altitude, 1 - altitude)

                TSP.utils.setVector3ToAttribute(newPosition, newPositionArray, i)
                TSP.utils.setVector3ToAttribute(rgb, colorArray, i)
            }

            // 1. Test mapping 6 faces with different colors
            // 2. Compute altitude and matching color mapping in JS
            // 3. Write simple shader to just apply them

            this.geometry.setAttribute(
                'altitude',
                new THREE.BufferAttribute(altitudeArray, 1)
            )
            this.geometry.setAttribute(
                'newPosition',
                new THREE.BufferAttribute(newPositionArray, 3)
            )
            this.geometry.setAttribute(
                'color',
                new THREE.BufferAttribute(colorArray, 3)
            )

            // create the material and now
            // include the attributes property
            const shaderMaterial = new THREE.ShaderMaterial({
                vertexShader: vShader,
                fragmentShader: fShader,
            })

            this.mesh = new THREE.Mesh(this.geometry, shaderMaterial)

            this.boundingSphere = new THREE.Sphere(
                this.mesh.position,
                BASE_RADIUS
            )
        }

        load() {
            return TSP.utils
                .loadTexture('/images/third-space-logo-no-text.png')
                .then((tspTexture) => {
                    TSP_TEXTURE_GENERATOR.renderTexture({
                        image: tspTexture.image,
                    })
                    this.createObjects()
                })
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

    const rescaleMin = 0.1
    const rescaleFactor = 1.0 / (1.0 - 0.1)
    const seed = Math.round(TSP.utils.randRange(0, 1000))

    // ----------- Rough, basic noise
    const altitudeAtSeams = 0
    const noiseAmount = 1.0
    const altitudeAmplitude = 0.9
    const altitudeSmoothing = 0.01
    const averagingRange = 0.002
    const averagingGridSize = 4
    const seamThreshold = 0.1
    const quantization = 0

    // Gold Noise ©2015 dcerisano@standard3d.com
    // - based on the Golden Ratio
    // - uniform normalized distribution
    // - fastest static noise generator function (also runs at low precision)
    const PHI = 1.61803398874989484820459 // Φ = Golden Ratio

    const goldNoise = (position) => {
        const val = Math.tan(position.clone().multiplyScalar(PHI).distanceTo(position) * seed) * position.x
        return val - Math.floor(val)
    }

    const altitudeLogMapping = (altitude) => {
        return (
            (Math.log(altitudeSmoothing + altitude) -
                Math.log(altitudeSmoothing)) /
            (Math.log(altitudeSmoothing + 1.0) - Math.log(altitudeSmoothing))
        )
    }

    const getColorSquareAvg = (uv) => {
        const currentColor = new THREE.Vector3()
        const avgColor = new THREE.Vector3(0, 0, 0)
        for (let i = -averagingGridSize / 2; i < averagingGridSize / 2; i++) {
            for (
                let j = -averagingGridSize / 2;
                j < averagingGridSize / 2;
                j++
            ) {
                uv = uv
                    .clone()
                    .add(
                        new THREE.Vector2(
                            i * averagingRange,
                            j * averagingRange
                        )
                    )
                TSP_TEXTURE_GENERATOR.getPixelColor(uv, currentColor)
                avgColor.add(currentColor)
            }
        }
        return avgColor.divideScalar(Math.pow(averagingGridSize, 2))
    }

    const rescaleAltitude = (altitude) => {
        return Math.min(
            Math.max((altitude - rescaleMin) * rescaleFactor, 0.0),
            1.0
        )
    }

    const mapColorToAltitude = (uv) => {
        const avgColor = getColorSquareAvg(uv)
        const colorLightness = avgColor.length() / Math.pow(3.0, 0.5)
        const altitude = altitudeLogMapping(1.0 - colorLightness)
        if (quantization > 0.0) {
            return TSP.utils.quantize(altitude, quantization)
        }
        return altitude
    }

    const computeAltitude = (uv, position) => {
        let altitude = altitudeAtSeams
        // Make sure that around the seams of the 6 faces of the cube, we don't change the altitude so
        // we have a smooth connection between all the faces.
        if (
            uv.x >= seamThreshold &&
            uv.y >= seamThreshold &&
            uv.x <= 1.0 - seamThreshold &&
            uv.y <= 1.0 - seamThreshold
        ) {
            altitude = mapColorToAltitude(uv)
            altitude *= 1.0 - noiseAmount + noiseAmount * goldNoise(position)
        }
        return rescaleAltitude(altitude)
    }
})()
