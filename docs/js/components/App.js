;(function () {
    const template = `
    <template id="App">
        <canvas is="tsp-canvas-3d"></canvas>
        <div is="tsp-page-frame"></div>
    </template>
`

    class App extends HTMLDivElement {
        constructor() {
            super()
            this.appendChild(TSP.utils.template(template))
            this.addEventListener('click', this.onClick.bind(this), false)
            TSP.state.listen('Canvas3D.loaded', this.show.bind(this))
            TSP.state.listen('Reader.loaded', this.show.bind(this))
            window.addEventListener('popstate', (e) => {
                TSP.state.set(
                    'App.currentUrl',
                    TSP.utils.relativeUrl(document.location.pathname)
                )
            })
            TSP.state.listen(
                'Canvas3D.hoveredObject',
                this.hoveredObjectChanged.bind(this)
            )
        }

        connectedCallback() {
            this.canvas3D = this.querySelector('canvas[is="tsp-canvas-3d"]')
            this.pageFrame = this.querySelector('div[is="tsp-page-frame"]')

            // TODO : remove urlRoot
            TSP.utils.navigateTo(location.pathname)

            this.canvas3D.load()
            this.pageFrame.load()
        }

        show() {
            if (
                TSP.state.get('Canvas3D.loaded') &&
                TSP.state.get('Reader.loaded')
            ) {
                this.canvas3D.start()
            }
        }

        onClick() {
            const hoveredObject = TSP.state.get('Canvas3D.hoveredObject')
            if (hoveredObject !== null) {
                TSP.utils.navigateTo(hoveredObject.url)
            }
        }

        hoveredObjectChanged(hoveredObject) {
            if (hoveredObject !== null) {
                this.style.cursor = 'pointer'
            } else {
                this.style.cursor = 'initial'
            }
        }
    }

    customElements.define('tsp-app', App, { extends: 'div' })
})()
