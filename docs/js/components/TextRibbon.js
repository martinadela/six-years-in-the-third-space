;(function () {
    const HIGHLIGHT_COLOR1 = TSP.config.get('styles.colors.Highlight1')
    const EXPAND_TRANSITION_DURATION = TSP.config.get(
        'transitions.sidebarDuration'
    )
    const TEXT_ROLL_DURATION = TSP.config.get('sidebar.textRollDuration')
    const TEXT_RIBBON = TSP.config.get('sidebar.textRolling')

    const sheet = jss.default
        .createStyleSheet({
            main: {
                '--textRibbonRollTransformStart': `translateX(100vw)`,
                // To be able to position the button
                position: 'relative',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                '&> div:first-child': {
                    display: 'inline-block',
                    animation: `$roll ${TEXT_ROLL_DURATION}s linear infinite`,
                },
                color: HIGHLIGHT_COLOR1,
                fontFamily: "'Cormorant Infant', serif",
                textTransform: 'uppercase',
                padding: TSP.config.get('styles.spacings.size1'),
                cursor: 'pointer',
                userSelect: 'none',
                pointerEvents: 'initial',
                '&.locked, &.noExpandButton': {
                    pointerEvents: 'none',
                    '& tsp-expand-menu-button': {
                        display: 'none',
                    },
                },
            },
            '@keyframes roll': {
                '0%': {
                    transform: `var(--textRibbonRollTransformStart)`,
                },
                '100%': {
                    transform: 'translateX(-100%)',
                },
            },
            expandMenuButton: {
                top: '49%',
                right: 0,
                position: 'absolute',
                marginRight: '0.5em',
                fontSize: '100%',
                transition: `transform ${EXPAND_TRANSITION_DURATION}ms ease-in-out`,
                transform: 'translateY(-50%) rotate(90deg)',
                '& svg': {
                    height: '1em',
                    '& path': {
                        stroke: HIGHLIGHT_COLOR1
                    }
                },
                '&.expanded': {
                    transform: 'translateY(-50%) rotate(270deg)',
                },
            },
        })
        .attach()

    const template = `
        <template id="TextRibbon">
            <div class="${sheet.classes.main}">
                <div>${TEXT_RIBBON}</div>
                <tsp-expand-menu-button class="${sheet.classes.expandMenuButton}">
                    ${TSP.components.triangleSvg()}
                </tsp-expand-menu-button>
            </div>
        </template>
    `

    class TextRibbon extends HTMLElement {
        constructor() {
            super()
            this.appendChild(TSP.utils.template(template))
            this.element = this.querySelector(`.${sheet.classes.main}`)
            this.element.classList.add(this.className)
            this.className = ""
            if (this.getAttribute('no-expand-button') !== null) {
                this.element.classList.add('noExpandButton')
            }
            const boundingRect = this.getBoundingClientRect()
            this.element.style.setProperty('--textRibbonRollTransformStart', `translateX(${boundingRect.width}px)`)

            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        connectedCallback() {
            this.element.addEventListener('click', this.onClicked.bind(this))
        }

        onClicked() {
            TSP.state.set(
                'SideBar.expanded',
                !TSP.state.get('SideBar.expanded')
            )
        }

        currentUrlChanged(url) {
            if (url === '') {
                this.element.classList.remove('locked')
            } else {
                this.element.classList.add('locked')
            }
        }
    }

    customElements.define('tsp-text-ribbon', TextRibbon)
})()
