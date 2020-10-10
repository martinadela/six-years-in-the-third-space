;(function() {

const STATE = {
    window: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    App: {
        currentUrl: document.location.pathname,
    },
    Canvas3D: {
        loaded: false,
        hoveredObject: null,
        satellites: {}
    },
    Reader: {
        loaded: false
    },
    Camera: {}
}

TSP.state = {}

const LISTENERS = {}

TSP.state.get = (path) => {
    return TSP.utils.getOrThrow(STATE, path)
}

TSP.state.set = (path, newValue) => {
    const value = TSP.utils.getOrThrow(STATE, path)
    if (typeof value !== typeof newValue) {
        throw new Error('Invalid types : ' + value + ' and ' + newValue)
    }
    _.set(STATE, path, newValue)
    ;(LISTENERS[path] || []).forEach((callback) => {
        callback(newValue, value, path)
    }) 
}

TSP.state.listen = (path, callback) => {
    const value = TSP.utils.getOrThrow(STATE, path)
    if (_.isObject(value) || _.isArray(value)) {
        throw new Error('Path "' + path.join(', ') + ' is a complex value and cant be listened to.')
    }
    LISTENERS[path] = LISTENERS[path] || []
    LISTENERS[path].push(callback)
    LISTENERS[path] = _.uniq(LISTENERS[path])
}

})()