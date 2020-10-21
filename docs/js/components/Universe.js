;(function () {
    const TEXTURE_RESOLUTION = Math.round(
        Math.pow(((window.innerWidth / 1.7) * window.innerHeight) / 1.7, 0.5)
    )
    const NEBULA_RGB1 = TSP.config.get('universe.nebulaColors')[0]
    const NEBULA_RGB2 = TSP.config.get('universe.nebulaColors')[1]
    const TEXTURE_GENERATOR = document.createElement('tsp-gradient-texture-generator')    
    TEXTURE_GENERATOR.setDebug(TSP.config.get('debug.universe'))

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
            return TSP.utils.loadShaders([
                {
                    url: 'shaders/universe.vert',
                },
                {
                    url: 'shaders/universe.frag',
                    dependencyUrls: ['shaders/perlin-noise.shader', 'shaders/worley.shader'],
                },
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
            const filterColor = TSP.config.get('universe.filterColor')
            return new THREE.ShaderMaterial({
                vertexShader: this.shaders.vertex,
                fragmentShader: this.shaders.fragment,
                uniforms: {
                    index: { type: 'i', value: index },
                    seed: { type: 'f', value: params.seed },
                    resolution: { type: 'f', value: TEXTURE_RESOLUTION },
                    res1: { type: 'f', value: params.res1 },
                    res2: { type: 'f', value: params.res2 },
                    resMix: { type: 'f', value: params.resMix },
                    nebulaeMap: { type: 't', value: params.nebulaeMap },
                    starsQuantity: { type: 'f', value: TSP.config.get('universe.starsQuantity') },
                    filterColor: {
                        type: 'vec3',
                        value: new THREE.Vector3(
                            filterColor[0],
                            filterColor[1],
                            filterColor[2]
                        ),
                    },
                    filterOpacity: {
                        type: 'f',
                        value: TSP.config.get('universe.filterOpacity'),
                    },
                    nebulaOpacity: { type: 'f', value: TSP.config.get('universe.nebulaOpacity') },
                    whiteCloudsIntensity: {
                        type: 'f',
                        value: TSP.config.get(
                            'universe.whiteCloudsIntensity'
                        ),
                    },
                },
            })
        }

        createObjects() {
            const params = {
                seed: Math.round(TSP.utils.randRange(0, 1000)),
                res1: TSP.utils.randRange(0.5, 2.0),
                res2: TSP.utils.randRange(0.5, 2.0),
                resMix: TSP.utils.randRange(0.5, 2.0),
                nebulaeMap: TEXTURE_GENERATOR.buildTexture({rgbs: [NEBULA_RGB1, NEBULA_RGB2] }),
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

    TSP.components.Universe = Universe
})()
