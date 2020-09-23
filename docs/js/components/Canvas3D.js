;(function() {

function Canvas3D () {
    this.camera = new THREE.PerspectiveCamera( 
        TSP.stateGet('camera.fieldOfViewDegrees'),
        TSP.stateGet('window.width') / TSP.stateGet('window.height'), 
        TSP.stateGet('camera.near'),
        TSP.stateGet('camera.far'),
    )
    this.camera.position.z = TSP.stateGet('camera.z')

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(TSP.stateGet('background.color'))
    this.scene.add(this.camera)

    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.physicallyCorrectLights = true
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.setSize( TSP.stateGet('window.width'), TSP.stateGet('window.height') )

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)

    const ambientLight  = new THREE.AmbientLight(TSP.stateGet('lights.ambientColor'), TSP.stateGet('lights.ambientIntensity'))
    ambientLight.name = 'ambient_light'
    this.camera.add(ambientLight)

    const directionalLight  = new THREE.DirectionalLight(TSP.stateGet('lights.directColor'), TSP.stateGet('lights.directIntensity'))
    directionalLight.position.set(0.5, 0, 0.866) // ~60º
    directionalLight.name = 'main_light'
    this.camera.add(directionalLight)

    this.lights = [ambientLight, directionalLight]

    this.loader = new THREE.GLTFLoader()

    document.body.appendChild(this.renderer.domElement)

    this.createObjects()
}

Canvas3D.prototype.createObjects = function() {
    const self = this
    this.planet = new TSP.components.Planet()

    const satelliteDefinitions = TSP.stateGet('satellites.satellites')
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

Canvas3D.prototype.load = function() {
    const self = this
    Promise.all(Object.values(this.satellites).map(function (satellite) {
        return satellite.load(self.loader)
    })).then(function() {
        TSP.stateSet('Canvas3D.loaded', true)
    })
}

Canvas3D.prototype.start = function() {
    const self = this
    this.planet.show(this.scene)
    Object.values(this.satellites).forEach(function(satellite) {
        satellite.show(self.scene)
        if (TSP.stateGet('debug') === true) {
            satellite.planetaryRotationAxis.show(self.scene)
        }
    })
    if (TSP.stateGet('debug') === true) {
        this.axesHelper = new THREE.AxesHelper( TSP.stateGet('planet.radius') + 5 )
        this.scene.add( this.axesHelper )
    }
    this.animate()
}

Canvas3D.prototype.animate = function() {
    requestAnimationFrame(this.animate.bind(this))
    this.controls.update()
    Object.values(this.satellites).forEach(function(satellite) {
        satellite.animate()
    })
    this.renderer.render(this.scene, this.camera)
}

TSP.components.Canvas3D = Canvas3D

})()