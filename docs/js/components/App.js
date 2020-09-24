;(function() {

function App() {
    this.canvas3D = document.createElement('canvas', {is: 'tsp-canvas-3d'})
    this.canvas3D.load()
    document.querySelector('#root').appendChild(this.canvas3D)

    TSP.state.listen('Canvas3D.loaded', this.show.bind(this))
    TSP.state.listen('app.currentUrl', this.renderRoute.bind(this))
}

App.prototype.show = function() {
    this.canvas3D.start()
    document.querySelector('#root').insertAdjacentHTML('afterbegin', '<div is="tsp-page-frame">')
}

App.prototype.renderRoute = function() {
    
}

TSP.components.App = App

})()