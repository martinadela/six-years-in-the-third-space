;(function() {

TSP.utils = {}

TSP.utils.degreesToRadians = (angle) => angle * math.pi / 180

TSP.utils.sphericalSpacedOnSphere = (numPoints, radius) => {
    const sphericals = []
    const rowOrColumnCount = Math.pow(numPoints, 0.5)
    let rowCount = Math.ceil(rowOrColumnCount)
    let columnCount = (rowCount * Math.floor(rowOrColumnCount)) < numPoints ? Math.ceil(rowOrColumnCount) : Math.floor(rowOrColumnCount)
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < columnCount; col++) {
            // We must avoid to pick phi = 0, otherise theta has no influence
            const phi = (Math.PI / rowCount) * (0.5 + row)
            const theta = col * (2 * Math.PI / columnCount)
            sphericals.push(new THREE.Spherical(radius, phi, theta))
        }
    }
    return sphericals
}

TSP.utils.sphericalToV3 = (spherical) => {
    const v3 = new THREE.Vector3()
    v3.setFromSpherical(spherical)
    return v3
}

TSP.utils.incrementSpherical = (spherical, delta) => {
    spherical.phi = (spherical.phi + (delta.phi || 0)) % (Math.PI)
    spherical.theta = (spherical.theta + (delta.theta || 0)) % (2 * Math.PI)
}

TSP.utils.randomizeValue = (params) => {
    const mean = params[0]
    const uncertainty = params[1]
    return mean + (Math.random() * 2 - 1) * uncertainty
}

TSP.utils.template = (templateText) => {
    const div = document.createElement('div')
    div.innerHTML = templateText
    const templateId = div.querySelector('template').id
    if (!document.querySelector('#' + templateId)) {
        document.body.insertAdjacentHTML('beforeend', templateText)
    }
    const template = document.querySelector('#' + templateId)
    return template.content.cloneNode(true)
}

TSP.utils.absoluteUrl = (relativeUrl) => 
    TSP.config.get('app.rootUrl') + relativeUrl

TSP.utils.fetch = (url) => {
    return fetch(TSP.utils.absoluteUrl(url))
        .then((response) => {
            if (response.status !== 200) {
                throw new Error(`fetch status ${response.status} > ${url}`)
            }
            return response.text()
        })
}

TSP.utils.navigateTo = (relativeUrl) => {
    const url = TSP.utils.absoluteUrl(relativeUrl)
    history.pushState({}, '', url)
    TSP.state.set('App.currentUrl', relativeUrl)
}

TSP.utils.normalizeUrl = (url) => {
    if (url.endsWith('/')) { 
        return url.slice(0, -1) 
    } else { 
        return url
    }
}

TSP.utils.getOrThrow = (source, path) => {
    const value = _.get(source, path)
    if (_.isUndefined(value)) {
        throw new Error('Unknown state path "' + path + '"')
    }
    return value
}

})()