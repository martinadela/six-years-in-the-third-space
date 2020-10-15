;(function () {
    const HIGHLIGHT_COLOR1 = TSP.config.get('styles.colors.Highlight1')
    const TRANSITION_DURATION = TSP.config.get('transitions.hudDuration')

    const sheet = jss.default
        .createStyleSheet({
            'main': {
                pointerEvents: 'none',
                userSelect: 'none',
                position: 'absolute',
                transition: `top ${TRANSITION_DURATION}ms ease-in-out, opacity ${TRANSITION_DURATION}ms ease-in-out`,
            },
            'arrow': {
                position: 'absolute',
                width: '100%',
                top: '50%',
                left: '50%',
                color: HIGHLIGHT_COLOR1,
                fontSize: '300%',
                transformOrigin: '0 0',
                animation: '$circle 20s linear infinite'
            },
            '@keyframes circle': {
                'from': {
                    transform: 'rotate(0deg) translate(50%, -50%)'
                },
                'to': {
                    transform: 'rotate(360deg) translate(50%, -50%)'
                },
            },
        })
        .attach()


    const template = `
        <template id="Hud">
            <div class=${sheet.classes.arrow}>⇦</div>
        </template>
    `

    class Hud extends HTMLDivElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            this.appendChild(TSP.utils.template(template))
            this.bringOut()

            // ------------ state change handlers
            TSP.state.listen(
                'Canvas3D.hoveredObject',
                this.hoveredObjectChanged.bind(this)
            )
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        connectedCallback() {
            this.canvas3D = this.querySelector('canvas[is="tsp-canvas-3d"]')
            this.pageFrame = this.querySelector('div[is="tsp-page-frame"]')
        }

        bringOut() {
            this.style.top = 0
            this.style.opacity = 0
        }

        bringIn(hoveredObject) {
            const circle = TSP.utils.getBoundingCircleInScreen(
                TSP.state.get('Canvas3D.component').getCamera(),
                hoveredObject.getBoundingSphere(),
                TSP.utils.getCanvasBoundingBoxOnScreen(),
            )

            this.style.opacity = 1
            this.style.left = `${circle.center.x - circle.radius}px`
            this.style.top = `${circle.center.y - circle.radius}px`
            this.style.borderRadius = `${circle.radius}px`
            this.style.height = `${circle.radius * 2}px`
            this.style.width = `${circle.radius * 2}px`

            if (TSP.config.get('debug.satellites')) {
                this.style.border = `solid 1px blue`
            }
        }

        currentUrlChanged(url) {
            const hoveredObject = TSP.state.get('Canvas3D.hoveredObject')
            if (url === '' && hoveredObject !== null) {
                this.bringIn()
            } else {
                this.bringOut()
            }
        }

        hoveredObjectChanged(hoveredObject) {
            if (hoveredObject !== null) {
                this.bringIn(hoveredObject)
            } else {
                this.bringOut()
            }
        }
    }

    customElements.define('tsp-hud', Hud, { extends: 'div' })
})()
