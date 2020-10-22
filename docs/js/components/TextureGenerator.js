;(function () {
    class TextureGenerator extends HTMLElement {
        constructor() {
            super()
            this.canvas = document.createElement('canvas')
            this.ctx = this.canvas.getContext('2d')
            this.canvas.style.display = 'none'
            this.setSize(512, 512)
        }

        setDebug(debug, offsetLeft) {
            if (debug) {
                document.body.prepend(this.canvas)
                this.canvas.style.display = 'block'
                this.canvas.style.zIndex = '100'
                this.canvas.style.position = 'fixed'
                this.canvas.style.top = '0'
                this.canvas.style.left = offsetLeft || '0'
                this.canvas.style.border = '1px solid red'
            }
        }

        setSize(width, height) {
            this.canvas.width = width
            this.canvas.height = height
            this.canvas.style.width = '150px'
            this.canvas.style.height = 'auto'
            this.canvasDimensions = new THREE.Vector2(width, height)
        }

        // Gets the pixel at UV (coordinates normalized between 0 and 1) 
        // and sets the result to rgb (rgb values values between 0 and 1).
        getPixelColor(uv, rgb) {
            const x = Math.floor((this.canvas.width - 1) * uv.x)
            const y = Math.floor((this.canvas.height - 1) * uv.y)
            const p = this.ctx.getImageData(x, y, 1, 1).data
            return rgb.set(p[0], p[1], p[2]).divideScalar(255)
        }

    }

    class GradientTextureGenerator extends TextureGenerator {

        renderTexture(opts) {
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

    class ImageTextureGenerator extends TextureGenerator {

        renderTexture(opts) {
            const image = opts.image
            this.setSize(image.width, image.height)
            this.ctx.drawImage(image, 0, 0, image.width, image.height)
            return new THREE.CanvasTexture(this.canvas)
        }

        scrambleCanvas(sizeUv) {
            const scrambleSize = sizeUv.clone().multiply(this.canvasDimensions)
            const scrambleRange = this.canvasDimensions.clone().sub(scrambleSize)

            const scrambleOrigin = scrambleRange.clone()
                .multiply(
                    new THREE.Vector2(Math.random(), Math.random())
                )
            
            const scrambleTarget = scrambleRange.clone()
                .multiply(
                    new THREE.Vector2(Math.random(), Math.random())
                )
            
            this.ctx.putImageData(
                this.ctx.getImageData(
                    scrambleOrigin.x, scrambleOrigin.y, 
                    scrambleSize.x, scrambleSize.y), 
                scrambleTarget.x, scrambleTarget.y)
        }

    }

    customElements.define('tsp-image-texture-generator', ImageTextureGenerator)
})()