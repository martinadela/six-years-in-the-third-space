;(function () {
    const HIGHLIGHT_COLOR1 = TSP.config.get('styles.colors.Highlight1')
    const TRANSITION_DURATION = TSP.config.get('transitions.hudDuration')
    const HUD_CLASS_NAMES = ['arrow', 'soundControls']

    const sheet = jss.default
        .createStyleSheet({
            main: {
                pointerEvents: 'none',
                userSelect: 'none',
                position: 'absolute',
                transition: `top ${TRANSITION_DURATION}ms ease-in-out`,
            },
            hud: {
                position: 'absolute',
                width: '100%',
                top: '50%',
                left: '50%',
                color: HIGHLIGHT_COLOR1,
                fontSize: '300%',
                transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
                opacity: 0,
                '&.active': {
                    opacity: 1,
                }
            },
        })
        .attach()

    const template = `
        <template id="Hud">
            <div class="${sheet.classes.main}">
                <tsp-hud-arrow></tsp-hud-arrow>
                <tsp-hud-sound-controls></tsp-hud-sound-controls>
            </div>
        </template>
    `

    class Hud extends HTMLElement {
        constructor() {
            super()
            this.appendChild(TSP.utils.template(template))
            this.element = this.querySelector(`.${sheet.classes.main}`)
            this.huds = {
                arrow: this.querySelector(`tsp-hud-arrow`),
                soundControls: this.querySelector(`tsp-hud-sound-controls`),
            }

            // ------------ state change handlers
            TSP.state.listen(
                'Canvas3D.hoveredObject',
                this.hoveredObjectChanged.bind(this)
            )
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
            TSP.state.listen(
                'Canvas3D.orbitControls',
                this.orbitControlsChanged.bind(this)
            )
        }

        connectedCallback() {
            this.bringOut()
        }

        bringOut() {
            this.element.style.top = 0
            HUD_CLASS_NAMES.forEach(hudClassName =>
                this.huds[hudClassName].setActive(false)
            )
        }

        bringIn(hoveredObject) {
            const hudClassName = hoveredObject.getHudClassName()
            if (!HUD_CLASS_NAMES.includes(hudClassName)) {
                throw new Error(`invalid hud classname ${hudClassName}`)
            }
            HUD_CLASS_NAMES.forEach(hudClassName =>
                this.huds[hudClassName].setActive(false)
            )
            this.huds[hudClassName].setActive(true)

            const circle = TSP.utils.getBoundingCircleInScreen(
                TSP.state.get('Canvas3D.component').getCamera(),
                hoveredObject.getBoundingSphere(),
                TSP.utils.getCanvasBoundingBoxOnScreen()
            )

            this.element.style.left = `${circle.center.x - circle.radius}px`
            this.element.style.top = `${circle.center.y - circle.radius}px`
            this.element.style.borderRadius = `${circle.radius}px`
            this.element.style.height = `${circle.radius * 2}px`
            this.element.style.width = `${circle.radius * 2}px`

            if (TSP.config.get('debug.satellites')) {
                this.element.style.border = `solid 1px blue`
            }
        }

        currentUrlChanged(url) {
            const hoveredObject = TSP.state.get('Canvas3D.hoveredObject')
            if (url === '' && hoveredObject !== null) {
                this.bringIn(hoveredObject)
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

        orbitControlsChanged() {
            const hoveredObject = TSP.state.get('Canvas3D.hoveredObject')
            if (hoveredObject) {
                this.bringIn(hoveredObject)
            }
        }
    }

    customElements.define('tsp-hud', Hud)

    class HudGeneric extends HTMLElement {
        setActive(isActive) {
            if (isActive) {
                this.element.classList.add('active')
            } else {
                this.element.classList.remove('active')
            }
        }
    }

    // -------------------- ARROW -------------------- //
    const hudArrowSheet = jss.default
        .createStyleSheet({
            main: {
                transformOrigin: '0 0',
                '&.active': {
                    animation: '$circle 20s linear infinite',
                }
            },
            '@keyframes circle': {
                from: {
                    transform: 'rotate(0deg) translate(50%, -50%)',
                },
                to: {
                    transform: 'rotate(360deg) translate(50%, -50%)',
                },
            },
        }).attach()

    class HudArrow extends HudGeneric {
        constructor() {
            super()
            this.element = document.createElement('div')
            this.element.classList.add(sheet.classes.hud, hudArrowSheet.classes.main)
            this.element.innerHTML = '⇦'
            this.appendChild(this.element)
        }
    }

    customElements.define('tsp-hud-arrow', HudArrow)

    // -------------------- SOUND CONTROLS -------------------- //
    const hudSoundControlsSheet = jss.default
        .createStyleSheet({
            main: {
                // Used to center buttons
                position: 'relative',
                transform: 'translate(50%, -50%)',
                color: HIGHLIGHT_COLOR1,
                '&.active': {
                    pointerEvents: 'initial',
                },
                transform: 'translate(-50%, -50%)',
                '& .pause': {
                    display: 'none'
                },
                '&.playing': {
                    '& .pause': {
                        display: 'block'
                    },
                    '& .play': {
                        display: 'none'
                    }
                },
                '& button': {
                    display: 'block',
                    position: 'absolute',
                    transform: 'translate(0%, -25%)',
                    top: 0,
                    left: 0,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: HIGHLIGHT_COLOR1,
                    textTransform: 'uppercase',
                    '& svg': {
                        '& path, & rect': {
                            fill: HIGHLIGHT_COLOR1
                        }
                    }
                }
            },
        }).attach()

    const templateHudSoundControls = `
        <template id="HudSoundControls">
            <div class="${sheet.classes.hud} ${hudSoundControlsSheet.classes.main}">
                <button class="play">
                    ${TSP.components.triangleSvg()}
                    <div>Play</div>
                </button>
                <button class="pause">
                    ${TSP.components.pauseSvg()}
                    <div>Pause</div>
                </button>
            </div>
        </template>
    `

    class HudSoundControls extends HudGeneric {
        constructor() {
            super()
            this.appendChild(TSP.utils.template(templateHudSoundControls))
            this.element = this.querySelector(`.${hudSoundControlsSheet.classes.main}`)
            this.element.addEventListener('click', this.onClick.bind(this))
            TSP.state.listen('App.playing', this.playingChanged.bind(this))
        }

        onClick() {
            TSP.state.set('App.playing', !TSP.state.get('App.playing'))
        }

        playingChanged(playing) {
            if (playing) {
                this.element.classList.add('playing')
            } else {
                this.element.classList.remove('playing')
            }
        }
    }

    customElements.define('tsp-hud-sound-controls', HudSoundControls)
    
})()
