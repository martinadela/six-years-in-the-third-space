;(function () {
    class GradientTextureGenerator extends HTMLElement {
        constructor() {
            super()
            this.canvas = document.createElement('canvas')
            this.canvas.width = 512
            this.canvas.height = 512
            this.canvas.style.width = '200px'
            this.canvas.style.height = '200px'
            this.ctx = this.canvas.getContext('2d')
            this.canvas.style.display = 'none'
        }

        setDebug(debug, offsetLeft) {
            if (debug) {
                document.body.prepend(this.canvas)
                this.canvas.style.display = 'block'
                this.canvas.style.zIndex = '100'
                this.canvas.style.position = 'fixed'
                this.canvas.style.top = '0'
                this.canvas.style.left = offsetLeft || '0'
            }
        }

        buildTexture(opts) {
            const rgbs = opts.rgbs || [[0, 255, 0], [255, 0, 0]]
            const baseColor = opts.baseColor || 'rgba(0, 0, 0, 1)'
            const opacity = opts.opacity !== undefined ? opts.opacity : 0.5
            const iterations = opts.iterations || 3

            this.ctx.fillStyle = baseColor
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

            for (let i = 0; i < iterations; i++) {
                const rgb1 = _.sample(rgbs)
                const rgb2 = _.sample(_.without(rgbs, rgb1))
                this.gradientCircle(
                    `rgba(${rgb1[0]},${rgb1[1]},${rgb1[2]},${opacity})`,
                    `rgba(${rgb2[0]},${rgb2[1]},${rgb2[2]},0)`
                )
            }

            return new THREE.CanvasTexture(this.canvas)
        }

        gradientCircle(rgb1, rgb2) {
            let x1 = TSP.utils.randRange(0, this.canvas.width)
            let y1 = TSP.utils.randRange(0, this.canvas.height)
            let size = TSP.utils.randRange(100, 200)
            let x2 = x1
            let y2 = y1
            let r1 = 0
            let r2 = size

            let gradient = this.ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)
            gradient.addColorStop(0, rgb1)
            gradient.addColorStop(1, rgb2)

            this.ctx.fillStyle = gradient
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    customElements.define('tsp-gradient-texture-generator', GradientTextureGenerator)
})()