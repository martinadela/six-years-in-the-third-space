class NebulaeGradient {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'nebulaeCanvas'
        this.canvas.width = 512
        this.canvas.height = 512
        this.canvas.style.width = '200px'
        this.canvas.style.height = '200px'
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.ctx = this.canvas.getContext('2d')

        document.body.prepend(this.canvas)
        this.toggleCanvasDisplay(true)
    }

    generateTexture() {
        const baseColor = 'rgba(0, 0, 0, 1)'
        const rgb1 = { r: 255, g: 237, b: 0 }
        const rgb2 = { r: 255, g: 119, b: 0 }
        const opacity = 0.5

        this.ctx.fillStyle = baseColor
        this.ctx.fillRect(0, 0, this.width, this.height)

        this.gradientCircle(
            `rgba(${rgb1.r},${rgb1.g},${rgb1.b},${opacity})`,
            `rgba(${rgb2.r},${rgb2.g},${rgb2.b},0)`
        )
        this.gradientCircle(
            `rgba(${rgb2.r},${rgb2.g},${rgb2.b},${opacity})`,
            `rgba(${rgb1.r},${rgb1.g},${rgb1.b},0)`
        )

        this.texture = new THREE.CanvasTexture(this.canvas)
    }

    toggleCanvasDisplay(value) {
        if (value) {
            this.canvas.style.display = 'block'
        } else {
            this.canvas.style.display = 'none'
        }
    }

    gradientCircle(rgb1, rgb2) {
        let x1 = this.randRange(0, this.width)
        let y1 = this.randRange(0, this.height)
        let size = this.randRange(100, 200)
        let x2 = x1
        let y2 = y1
        let r1 = 0
        let r2 = size

        let gradient = this.ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)
        gradient.addColorStop(0, rgb1)
        gradient.addColorStop(1, rgb2)

        this.ctx.fillStyle = gradient
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    randRange(low, high) {
        let range = high - low
        let n = Math.random() * range
        return low + n
    }
}
