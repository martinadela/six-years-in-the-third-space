;(function() {

const sheet = jss.default
    .createStyleSheet({
        main: {
            position: 'absolute',
            left: '0',
            top: '0',
            display: 'block',
            zIndex: TSP.state.get('Canvas3D.zIndex'),
        }
    }).attach()

class Canvas3D extends HTMLCanvasElement {
    constructor() {
        super()
        this.classList.add(sheet.classes.main)

        this.camera = new THREE.PerspectiveCamera( 
            TSP.state.get('camera.fieldOfViewDegrees'),
            TSP.state.get('window.width') / TSP.state.get('window.height'), 
            TSP.state.get('camera.near'),
            TSP.state.get('camera.far'),
        )
        this.camera.position.z = TSP.state.get('camera.z')
    
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(TSP.state.get('background.color'))
        this.scene.add(this.camera)
    
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this
        })
        this.renderer.physicallyCorrectLights = true
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.setSize( TSP.state.get('window.width'), TSP.state.get('window.height') )
    
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    
        const ambientLight  = new THREE.AmbientLight(TSP.state.get('lights.ambientColor'), TSP.state.get('lights.ambientIntensity'))
        ambientLight.name = 'ambient_light'
        this.camera.add(ambientLight)
    
        const directionalLight  = new THREE.DirectionalLight(TSP.state.get('lights.directColor'), TSP.state.get('lights.directIntensity'))
        directionalLight.position.set(0.5, 0, 0.866) // ~60º
        directionalLight.name = 'main_light'
        this.camera.add(directionalLight)
    
        this.lights = [ambientLight, directionalLight]
    
        this.loader = new THREE.GLTFLoader()
    
        this.createObjects()
    }

    connectedCallback() {
        this.updateSize()
    }

    updateSize() {
        this.width = TSP.state.get('window.width')
        this.height = TSP.state.get('window.height')
    }

    createObjects = function() {
        const self = this
        this.planet = new TSP.components.Planet()
    
        const satelliteDefinitions = TSP.state.get('satellites.satellites')
        this.satellites = {}
    
        const satelliteCount = Object.keys(satelliteDefinitions).length
        const planetaryRotationAxes = TSP.utils.sphericalSpacedOnSphere(satelliteCount)
            .map(function(spherical) {
                // spherical.phi = (spherical.phi + Math.random() * PLANETARY_ROTATION_AXIS_RANDOMNESS) % (2 * Math.PI)
                // spherical.theta = (spherical.theta + Math.random() * PLANETARY_ROTATION_AXIS_RANDOMNESS) % (2 * Math.PI)
                return new TSP.components.RotationAxis(spherical)
            })
    
        Object.entries(satelliteDefinitions).forEach(function(pair, i) {
            const satelliteId = pair[0]
            const satelliteParams = pair[1]
            self.satellites[satelliteId] = new TSP.components.Satellite(
                satelliteId, 
                satelliteParams.modelUrl,
                planetaryRotationAxes[i],
            )
        })
    }

    load() {
        const self = this
        Promise.all(Object.values(this.satellites).map(function (satellite) {
            return satellite.load(self.loader)
        })).then(function() {
            TSP.state.set('Canvas3D.loaded', true)
        })
    }

    start() {
        const self = this
        this.planet.show(this.scene)
        Object.values(this.satellites).forEach(function(satellite) {
            satellite.show(self.scene)
            if (TSP.state.get('debug') === true) {
                satellite.planetaryRotationAxis.show(self.scene)
            }
        })
        if (TSP.state.get('debug') === true) {
            this.axesHelper = new THREE.AxesHelper( TSP.state.get('planet.radius') + 5 )
            this.scene.add( this.axesHelper )
        }
        this.animate()
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.controls.update()
        Object.values(this.satellites).forEach(function(satellite) {
            satellite.animate()
        })
        this.renderer.render(this.scene, this.camera)
    }
}

customElements.define('tsp-canvas-3d', Canvas3D, {extends: 'canvas'})

TSP.components.Canvas3D = Canvas3D

})()