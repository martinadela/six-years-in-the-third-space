;(function() {

function App() {
    this.canvas3D = new TSP.components.Canvas3D()
    this.canvas3D.load()
    TSP.stateListen('Canvas3D.loaded', this.show.bind(this))
}

App.prototype.show = function() {
    this.canvas3D.start()
}

TSP.components.App = App

})()