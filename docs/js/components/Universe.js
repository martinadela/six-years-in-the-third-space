;(function () {
    const TEXTURE_RESOLUTION = Math.round(
        Math.pow(((window.innerWidth / 1.7) * window.innerHeight) / 1.7, 0.5)
    ) // 1024 / 3
    console.log('RESOLUTION', TEXTURE_RESOLUTION)

    // REF : https://stackoverflow.com/questions/32233805/im-new-to-threejs-how-to-create-a-sky-dome
    class Universe {
        constructor() {
            this.rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0.3, 0.3, 0.65).normalize(),
                TSP.config.get('universe.rotationAngleStep')
            )
        }

        load() {
            return Promise.all([
                fetch(
                    TSP.utils.absoluteUrl('shaders/texture.vert')
                ).then((response) => response.text()),
                fetch(
                    TSP.utils.absoluteUrl('shaders/nebula.frag')
                ).then((response) => response.text()),
            ]).then((shaders) => {
                this.shaders = {
                    vertex: shaders[0],
                    fragment: shaders[1],
                }
                this.createObjects()
                return this
            })
        }

        show(scene) {
            scene.add(this.sphere)
        }

        createShaderMaterial(index, params) {
            return new THREE.ShaderMaterial({
                vertexShader: this.shaders.vertex,
                fragmentShader: this.shaders.fragment,
                uniforms: {
                    index: { type: 'i', value: index },
                    seed: { type: 'f', value: params.seed },
                    resolution: { type: 'f', value: params.resolution },
                    res1: { type: 'f', value: params.res1 },
                    res2: { type: 'f', value: params.res2 },
                    resMix: { type: 'f', value: params.resMix },
                    mixScale: { type: 'f', value: params.mixScale },
                    nebulaeMap: { type: 't', value: params.nebulaeMap },
                    starsQuantity: { type: 'f', value: params.starsQuantity },
                    filterColor: {
                        type: 'vec3',
                        value: new THREE.Vector3(
                            params.filterColor[0],
                            params.filterColor[1],
                            params.filterColor[2]
                        ),
                    },
                    filterOpacity: {
                        type: 'f',
                        value: params.filterOpacity,
                    },
                    nebulaOpacity: { type: 'f', value: params.nebulaOpacity },
                    whiteCloudsIntensity: {
                        type: 'f',
                        value: params.whiteCloudsIntensity,
                    },
                },
            })
        }

        createObjects() {
            const params = {
                seed: Math.round(TSP.utils.randRange(0, 1000)),
                resolution: TEXTURE_RESOLUTION,
                res1: TSP.utils.randRange(0.5, 2.0),
                res2: TSP.utils.randRange(0.5, 2.0),
                resMix: TSP.utils.randRange(0.5, 2.0),
                nebulaeMap: TEXTURE_GENERATOR.buildTexture(),
                starsQuantity: TSP.config.get('universe.starsQuantity'),
                filterColor: TSP.config.get('universe.filterColor'),
                filterOpacity: TSP.config.get('universe.filterOpacity'),
                nebulaOpacity: TSP.config.get('universe.nebulaOpacity'),
                whiteCloudsIntensity: TSP.config.get(
                    'universe.whiteCloudsIntensity'
                ),
            }

            this.sphere = TSP.utils.getTexturedSphereMesh(
                TSP.config.get('universe.radius'),
                (i) => {
                    const shaderMaterial = this.createShaderMaterial(i, params)
                    const material = new THREE.MeshBasicMaterial({
                        side: THREE.BackSide,
                    })
                    material.map = TSP.utils.prerenderTexture(
                        TSP.state.get('Canvas3D.component').getRenderer(),
                        shaderMaterial,
                        TEXTURE_RESOLUTION,
                        TEXTURE_RESOLUTION
                    )
                    return material
                }
            )
        }

        animate() {
            this.sphere.applyQuaternion(this.rotationQuaternion)
        }
    }

    class TextureGenerator extends HTMLElement {
        constructor() {
            super()
            this.canvas = document.createElement('canvas')
            this.canvas.width = 512
            this.canvas.height = 512
            this.canvas.style.width = '200px'
            this.canvas.style.height = '200px'
            this.ctx = this.canvas.getContext('2d')
            this.canvas.style.display = 'none'
            if (TSP.config.get('debug.universe')) {
                document.body.prepend(this.canvas)
                this.canvas.style.display = 'block'
                this.canvas.style.zIndex = '100'
                this.canvas.style.position = 'fixed'
                this.canvas.style.top = '0'
                this.canvas.style.left = '0'
            }
        }

        buildTexture() {
            const baseColor = 'rgba(0, 0, 0, 1)'
            const rgb1 = TSP.config.get('universe.nebulaColors')[0]
            const rgb2 = TSP.config.get('universe.nebulaColors')[1]
            const opacity = 0.5

            this.ctx.fillStyle = baseColor
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

            this.gradientCircle(
                `rgba(${rgb1[0]},${rgb1[1]},${rgb1[2]},${opacity})`,
                `rgba(${rgb2[0]},${rgb2[1]},${rgb2[2]},0)`
            )
            this.gradientCircle(
                `rgba(${rgb2[0]},${rgb2[1]},${rgb2[2]},${opacity})`,
                `rgba(${rgb1[0]},${rgb1[1]},${rgb1[2]},0)`
            )

            return new THREE.CanvasTexture(this.canvas)
        }

        gradientCircle(rgb1, rgb2) {
            let x1 = TSP.utils.randRange(0, this.canvas.width)
            let y1 = TSP.utils.randRange(0, this.canvas.height)
            let size = TSP.utils.randRange(100, 200)
            let x2 = x1
            let y2 = y1
            let r1 = 0
            let r2 = size

            let gradient = this.ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)
            gradient.addColorStop(0, rgb1)
            gradient.addColorStop(1, rgb2)

            this.ctx.fillStyle = gradient
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    customElements.define('tsp-universe-texture-generator', TextureGenerator)
    const TEXTURE_GENERATOR = document.createElement('tsp-universe-texture-generator')

    TSP.components.Universe = Universe
})()
