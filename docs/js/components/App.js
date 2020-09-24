;(function() {

class App {
    constructor() {
        this.canvas3D = document.createElement('canvas', {is: 'tsp-canvas-3d'})
        this.pageFrame = document.createElement('div', {is: 'tsp-page-frame'})
        document.querySelector('#root').appendChild(this.canvas3D)
        document.querySelector('#root').appendChild(this.pageFrame)
    
        TSP.state.listen('Canvas3D.loaded', this.show.bind(this))
        TSP.state.listen('Reader.loaded', this.show.bind(this))

        this.canvas3D.load()
        this.pageFrame.load()
    }

    show() {
        if (TSP.state.get('Canvas3D.loaded') && TSP.state.get('Reader.loaded')) {
            this.canvas3D.start()
        }
    }
}

TSP.components.App = App

})()