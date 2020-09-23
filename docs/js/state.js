;(function() {

const LISTENERS = {}

const STATE = {
    debug: false,
    app: {
        urlRoot: ''
    },
    lights: {
        ambientColor: 0xFFFFFF,
        ambientIntensity: 2,
        directColor: 0xFFFFFF,
        directIntensity: 2 * Math.PI,
    },
    background: {
        color: 0xcccccc,
    },
    camera: {
        fieldOfViewDegrees: 75,
        near: 0.1,
        far: 100,
        z: 50,
    },
    planet: {
        radius: 14,
        color: 0xaaaaaa,
    },
    satellites: {
        planetaryRotationAxisRandomness: Math.PI * 0,
        planetaryRotationRadius: [25, 0.5],
        planetaryRotationAngleStep: Math.PI / 2 * 0.002,
        selfRotationIncrement: [0.002, 0.002],
        satellites: {
            golfBall: {
                modelUrl: 'satellites/satellite2.glb'
            },
            discoBall: {
                modelUrl: 'satellites/satellite3.glb'
            },
            diamond: {
                modelUrl: 'satellites/satellite4.glb'
            },
            blueHubble: {
                modelUrl: 'satellites/satellite5.glb'
            },
        }
    },
    window: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    Canvas3D: {
        loaded: false
    }
}

const _getOrThrow = function(path) {
    const value = _.get(STATE, path)
    if (_.isUndefined(value)) {
        throw new Error('Unknown state path "' + path + '"')
    }
    return value
}

TSP.stateGet = function(path) {
    const value = _getOrThrow(path)
    if (_.isArray(value) || _.isObject(value)) {
        return _.cloneDeep(value)
    } else {
        return value
    }
}

TSP.stateGetRandomized = function(path) {
    const randomizationParams = TSP.stateGet(path)
    return TSP.utils.randomizeValue(randomizationParams)
}

TSP.stateSet = function(path, newValue) {
    const value = _getOrThrow(path)
    if (typeof value !== typeof newValue) {
        throw new Error('Invalid types : ' + value + ' and ' + newValue)
    }
    _.set(STATE, path, newValue)
    ;(LISTENERS[path] || []).forEach(function(callback) {
        callback(newValue, value, path)
    }) 
}

TSP.stateListen = function(path, callback) {
    const value = _getOrThrow(path)
    if (_.isObject(value) || _.isArray(value)) {
        throw new Error('Path "' + path.join(', ') + ' is a complex value and cant be listened to.')
    }
    LISTENERS[path] = LISTENERS[path] || []
    LISTENERS[path].push(callback)
    LISTENERS[path] = _.uniq(LISTENERS[path])
}

})()