;(function () {
    const URL = TSP.config.get('planet.focusOnUrl')
    const BASE_RADIUS = TSP.config.get('planet.radius')
    const COLOR1 = TSP.config.get('planet.color1')
    const COLOR2 = TSP.config.get('planet.color2')
    const TSP_TEXTURE_GENERATOR = document.createElement(
        'tsp-image-texture-generator'
    )

    const VERTEX_SHADER = `
        varying vec3 vColor;

        attribute vec3 newPosition;
        attribute vec3 color;

        void main() {
            vColor = color;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
    `

    const FRAGMENT_SHADER = `
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `

    class Planet {
        constructor() {
            this.rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.3, 0.3, 0.65).normalize(),
                TSP.config.get('planet.rotationAngleStep')
            )
            this.clickSphere = new THREE.Mesh(
                new THREE.SphereBufferGeometry(
                    BASE_RADIUS * 1.5,
                    6,
                    6
                ),
                new THREE.MeshBasicMaterial({
                    opacity: 0,
                    transparent: true,
                })
            )
        }

        show(scene) {
            scene.add(this.mesh)
            scene.add(this.clickSphere)
        }

        createObjects() {
            this.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 64, 64, 64)
            const positionArray = this.geometry.attributes.position.array
            const uvArray = this.geometry.attributes.uv.array
            const positionCount = positionArray.length / 3.0

            const newPositionArray = new Float32Array(positionCount * 3)
            const colorArray = new Float32Array(positionCount * 3)

            const uv = new THREE.Vector2()
            const position = new THREE.Vector3()
            
            const color2 = new THREE.Vector3(COLOR2[0], COLOR2[1], COLOR2[2]).divideScalar(255)
            const color1 = new THREE.Vector3(COLOR1[0], COLOR1[1], COLOR1[2]).divideScalar(255)
            const colorScale = color1.clone().sub(color2)

            for (let i = 0; i < positionCount; i++) {
                if (i % (positionCount / 6) === 0) {
                    TSP_TEXTURE_GENERATOR.scrambleCanvas(new THREE.Vector2(0.5, 0.5))
                }
                TSP.utils.readAttributeToVector2(uvArray, i, uv)
                TSP.utils.readAttributeToVector3(positionArray, i, position)

                const altitude = computeAltitude(uv)

                const radius = BASE_RADIUS + altitudeAmplitude * altitude
                const newPosition = position
                    .clone()
                    .normalize()
                    .multiplyScalar(radius)

                TSP.utils.setVector3ToAttribute(
                    newPosition,
                    newPositionArray,
                    i
                )
                TSP.utils.setVector3ToAttribute(
                    color2.clone().add(colorScale.clone().multiplyScalar(1.0 - altitude)), 
                    colorArray, i)
            }
            
            this.geometry.setAttribute(
                'newPosition',
                new THREE.BufferAttribute(newPositionArray, 3)
            )
            this.geometry.setAttribute(
                'color',
                new THREE.BufferAttribute(colorArray, 3)
            )

            const shaderMaterial = new THREE.ShaderMaterial({
                vertexShader: VERTEX_SHADER,
                fragmentShader: FRAGMENT_SHADER,
            })

            this.mesh = new THREE.Mesh(this.geometry, shaderMaterial)

            this.boundingSphere = new THREE.Sphere(
                this.mesh.position,
                BASE_RADIUS
            )
        }

        load() {
            return TSP.utils
                .loadTexture('/images/third-space-logo-processed.png')
                .then((tspTexture) => {
                    TSP_TEXTURE_GENERATOR.renderTexture({
                        image: tspTexture.image,
                    })
                    this.createObjects()
                })
        }

        animate() {
            this.mesh.applyQuaternion(this.rotationQuaternion)
        }

        getObject3D() {
            return this.clickSphere
        }

        getUrl() {
            return URL
        }

        getHoverableObject3D() {
            return this.clickSphere
        }

        getBoundingSphere() {
            return this.boundingSphere
        }
    }

    TSP.utils.assertImplements(Planet, TSP.utils.interfaces.hoverable)
    TSP.components.Planet = Planet

    const altitudeAtSeams = 0
    const altitudeAmplitude = 1.0
    const altitudeSmoothing = 0.1
    const seamThreshold = 0.1
    const quantization = 1.0

    const altitudeLogMapping = (altitude) => {
        return (
            (Math.log(altitudeSmoothing + altitude) -
                Math.log(altitudeSmoothing)) /
            (Math.log(altitudeSmoothing + 1.0) - Math.log(altitudeSmoothing))
        )
    }

    const mapColorToAltitude = (uv) => {
        const avgColor = TSP_TEXTURE_GENERATOR.getPixelColor(uv, new THREE.Vector3())
        const colorLightness = avgColor.length() / Math.pow(3.0, 0.5)
        const altitude = altitudeLogMapping(1.0 - colorLightness)
        if (quantization > 0.0) {
            return TSP.utils.quantize(altitude, quantization)
        }
        return altitude
    }

    const computeAltitude = (uv) => {
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
        }
        return altitude
    }
})()
