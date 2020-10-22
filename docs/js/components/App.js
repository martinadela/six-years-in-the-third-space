;(function () {
    const DESKTOP_MEDIA_QUERY = TSP.config.get('styles.desktop.mediaQuery')
    const COLOR_SCROLLBAR_BACKGROUND = TSP.config.get(
        'styles.colors.ScrollbarBackground'
    )
    const COLOR_SCROLLBAR = TSP.config.get('styles.colors.Scrollbar')
    const COLOR_SCROLLBAR_BORDER = TSP.config.get(
        'styles.colors.ScrollbarBorder'
    )
    const COLOR_LINK = TSP.config.get('styles.colors.Links')
    const FONT_SIZE_DESKTOP = TSP.config.get('styles.fontSizes.desktop')
    const FONT_FAMILY_NORMAL = TSP.config.get('styles.fontFamilies.normal')
    const COLOR_TEXT = TSP.config.get('styles.colors.Text')
    const TRANSITION_DURATION = 500

    const sheet = jss.default
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
                    [DESKTOP_MEDIA_QUERY]: {
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${COLOR_SCROLLBAR} ${COLOR_SCROLLBAR_BACKGROUND}`,
                    },
                    boxSizing: 'border-box',
                    margin: 0,
                    padding: 0,
                },
                [DESKTOP_MEDIA_QUERY]: {
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
                },
                ul: {
                    listStyle: 'none',
                },
                a: {
                    color: COLOR_LINK,
                    textDecoration: 'none',
                },
            },
            main: {
                '& $innerContainer': {
                    transition: `opacity ${TRANSITION_DURATION}ms`,
                    opacity: 0,
                },
                '& $loaderContainer': {
                    transition: `opacity ${TRANSITION_DURATION}ms`,
                    opacity: 1,
                },
                '&.loaded': {
                    '& $innerContainer': {
                        opacity: 1,
                    },
                    '& $loaderContainer': {
                        opacity: 0,
                    }
                }
            },
            innerContainer: {},
            loaderContainer: {
                background: TSP.config.get('styles.colors.LoaderBackground'),
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: '0',
                left: '0',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                '& .triangle-skew-spin>div': {
                    borderBottomColor: TSP.config.get('styles.colors.Loader')
                }
            }
        })
        .attach()

    const template = `
        <template id="App">
            <div class="${sheet.classes.main}">
                <div class="${sheet.classes.innerContainer}">
                    <tsp-canvas-3d></tsp-canvas-3d>
                    <tsp-page-frame></tsp-page-frame>
                    <tsp-hud></tsp-hud>
                </div>
                <div class="${sheet.classes.loaderContainer} loader">
                    <div class="triangle-skew-spin"><div></div></div>
                </div>
            </div>
        </template>
    `

    class App extends HTMLElement {
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
            this.canvas3D = this.querySelector('tsp-canvas-3d')
            this.pageFrame = this.querySelector('tsp-page-frame')
            TSP.state.set('Canvas3D.component', this.canvas3D)
            this.canvas3D.load()
            this.pageFrame.load()
        }

        show() {
            if (
                TSP.state.get('Canvas3D.loaded') &&
                TSP.state.get('Reader.loaded')
            ) {
                this.querySelector(`.${sheet.classes.main}`).classList.add('loaded')
                setTimeout(() => {
                    this.querySelector(`.${sheet.classes.loaderContainer}`).remove()
                }, TRANSITION_DURATION + 100)
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

    customElements.define('tsp-app', App)
})()
