;(function () {
    const COLOR_SCROLLBAR_BACKGROUND = TSP.config.get(
        'styles.colors.ScrollbarBackground'
    )
    const COLOR_SCROLLBAR = TSP.config.get('styles.colors.Scrollbar')
    const COLOR_SCROLLBAR_BORDER = TSP.config.get(
        'styles.colors.ScrollbarBorder'
    )
    const FONT_SIZE_DESKTOP = TSP.config.get('styles.fontSizes.desktop')
    const FONT_FAMILY_NORMAL = TSP.config.get('styles.fontFamilies.normal')
    const FONT_FAMILY_TITLE = TSP.config.get('styles.fontFamilies.title')
    const COLOR_TEXT = TSP.config.get('styles.colors.Text')
    const COLOR_H2 = TSP.config.get('styles.colors.H2')

    jss.default
        .createStyleSheet({
            '@global': {
                'body, html': {
                    margin: '0',
                    padding: '0',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    color: COLOR_TEXT,
                    letterSpacing: '0.1em',
                    fontFamily: FONT_FAMILY_NORMAL,
                    fontSize: FONT_SIZE_DESKTOP,
                    textAlign: 'justify',
                    [`@media screen and (max-height: 750px)`]: {
                        fontSize: FONT_SIZE_DESKTOP - 1,
                    },
                    [`@media screen and (max-height: 700px)`]: {
                        fontSize: FONT_SIZE_DESKTOP - 2,
                    },
                    [`@media screen and (max-height: 650px)`]: {
                        fontSize: FONT_SIZE_DESKTOP - 3,
                    },
                    [`@media screen and (max-height: 600px)`]: {
                        fontSize: FONT_SIZE_DESKTOP - 4,
                    },
                },
                // REF scrollbars : https://www.digitalocean.com/community/tutorials/css-scrollbars
                '*': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${COLOR_SCROLLBAR} ${COLOR_SCROLLBAR_BACKGROUND}`,
                    boxSizing: 'border-box',
                    margin: 0,
                    padding: 0,
                },
                '*::-webkit-scrollbar': {
                    width: '12px',
                },
                '*::-webkit-scrollbar-track': {
                    background: COLOR_SCROLLBAR_BACKGROUND,
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: COLOR_SCROLLBAR,
                    borderRadius: '20px',
                    border: `3px solid ${COLOR_SCROLLBAR_BORDER}`,
                },
                h2: {
                    color: COLOR_H2,
                    fontFamily: FONT_FAMILY_TITLE,
                },
                ul: {
                    listStyle: 'none',
                },
                a: {
                    textDecoration: 'none',
                },
            },
        })
        .attach()

    const template = `
        <template id="App">
            <canvas is="tsp-canvas-3d"></canvas>
            <div is="tsp-page-frame"></div>
            <div is="tsp-hud"></div>
        </template>
    `

    class App extends HTMLDivElement {
        constructor() {
            super()
            this.appendChild(TSP.utils.template(template))

            // ------------ event handlers
            window.addEventListener('popstate', (e) => {
                TSP.state.set(
                    'App.currentUrl',
                    TSP.utils.relativeUrl(document.location.pathname)
                )
            })
            window.addEventListener('resize', () => {
                const rect = document.body.getBoundingClientRect()
                TSP.state.set(
                    'window.dimensions',
                    new THREE.Vector2(rect.width, rect.height)
                )
            })
            window.addEventListener('touchstart', () => {
                TSP.state.set('App.isTouch', true)
            })

            // ------------ state change handlers
            TSP.state.listen('Canvas3D.loaded', this.show.bind(this))
            TSP.state.listen('Reader.loaded', this.show.bind(this))
            TSP.state.listen(
                'Canvas3D.hoveredObject',
                this.hoveredObjectChanged.bind(this)
            )
        }

        connectedCallback() {
            this.canvas3D = this.querySelector('canvas[is="tsp-canvas-3d"]')
            this.pageFrame = this.querySelector('div[is="tsp-page-frame"]')
            TSP.state.set('Canvas3D.component', this.canvas3D)
            this.canvas3D.load()
            this.pageFrame.load()
        }

        show() {
            if (
                TSP.state.get('Canvas3D.loaded') &&
                TSP.state.get('Reader.loaded')
            ) {
                this.canvas3D.start()
                // We trigger the route change only after the canvas has started,
                // otherwise we will miss some state (satellites, positions, etc ...)
                TSP.utils.navigateTo(TSP.utils.relativeUrl(location.pathname))
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
