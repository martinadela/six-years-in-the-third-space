;(function () {
    const TRANSITION_DURATION = 200
    const HIGHLIGHT_COLOR1 = TSP.config.get('styles.colors.Highlight1')
    const BORDER_STYLE = `solid ${TSP.config.get(
        'styles.colors.Highlight1'
    )} ${TSP.config.get('styles.dimensions.borderThickness')}`
    const TEXT_ROLL_DURATION = TSP.config.get('sidebar.textRollDuration')
    const TEXT_RIBBON = `What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.  What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.`
    const SIDEBAR_WIDTH_PERCENT = 30

    const sheet = jss.default
        .createStyleSheet({
            main: {
                width: `${SIDEBAR_WIDTH_PERCENT}%`,
                maxWidth: '20em',
                color: TSP.config.get('styles.colors.Highlight1'),
                fontFamily: TSP.config.get('styles.fontFamilies.title')
            },
            innerContainer: {},
            title: {
                textTransform: 'uppercase',
                fontFamily: TSP.config.get('styles.fontFamilies.title'),
                fontWeight: 'normal',
                fontStyle: 'italic',
                textAlign: 'right',
                padding: TSP.config.get('styles.spacings.size1'),
                '& p': {
                    marginBottom: '4rem',
                    '&:last-child': {
                        marginBottom: '0',
                    },
                },
                borderLeft: BORDER_STYLE,
                borderBottom: BORDER_STYLE,
            },
            textRibbon: {
                // To be able to position the button
                position: 'relative',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                '&> div:first-child': {
                    display: 'inline-block',
                    animation: `$roll ${TEXT_ROLL_DURATION}s linear infinite`,
                },
                fontFamily: "'Cormorant Infant', serif",
                textTransform: 'uppercase',
                borderLeft: BORDER_STYLE,
                borderBottom: BORDER_STYLE,
                padding: TSP.config.get('styles.spacings.size1'),
                cursor: 'pointer',
                userSelect: 'none',
                pointerEvents: 'initial',
                '&.locked': {
                    pointerEvents: 'none',
                }
            },
            '@keyframes roll': {
                '0%': {
                    transform: `translateX(${SIDEBAR_WIDTH_PERCENT}vw)`
                },
                '100%': {
                    transform: 'translateX(-100%)'
                },
            },
            expandButton: {
                display: 'block',
                background: 'none',
                color: HIGHLIGHT_COLOR1,
                top: '50%',
                right: 0,
                position: 'absolute',
                border: 'none',
                marginRight: '0.5em',
                fontSize: '150%',
                cursor: 'pointer',
                transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
                transform: 'translateY(-50%) rotate(0deg)',
                '&.expanded': {
                    transform: 'translateY(-50%) rotate(180deg)',
                },
                '&.locked': {
                    display: 'none',
                }
            },
            ulContainer: {
                overflow: 'hidden',
            },
            ul: {
                transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
                transform: 'translateY(-100%)',
                '&.expanded': {
                    transform: 'translateY(0%)',
                }
            },
            li: {
                fontFamily: TSP.config.get('styles.fontFamilies.title'),
                color: TSP.config.get('styles.colors.Highlight1'),
                '& a': {
                    color: TSP.config.get('styles.colors.Highlight1'),
                    pointerEvents: 'all'
                },
                borderBottom: BORDER_STYLE,
                borderLeft: BORDER_STYLE,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                padding: TSP.config.get('styles.spacings.size1'),
            },
        })
        .attach()

    const template = `
        <template id="SideBar">
            <div class="${sheet.classes.innerContainer}">
                <h1 class="${sheet.classes.title}">
                    <p>Six years</p> 
                    <p>in the</p> 
                    <p>Third Space</p>
                </h1>
                <div class="${sheet.classes.textRibbon}" />
                    <div>${TEXT_RIBBON}</div>
                    <button class="${sheet.classes.expandButton}">▾</button>
                </div>

                <div class="${sheet.classes.ulContainer}">
                    <ul class="${sheet.classes.ul}">
                        <li class="${sheet.classes.li}">
                            <a is="tsp-anchor" href="/contributors">
                                Contributors
                            </a>
                        </li>
                        <li class="${sheet.classes.li}">
                            <a is="tsp-anchor" href="/works">
                                Works
                            </a>
                        </li>
                        <li class="${sheet.classes.li}">
                            <a is="tsp-anchor" href="/about">
                                About this book
                            </a>
                        </li>
                        <li class="${sheet.classes.li}">
                            <a is="tsp-anchor" href="/third-space">
                                Third space collective
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </template>
    `

    class SideBar extends HTMLDivElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            this.appendChild(TSP.utils.template(template))

            this.textRibbon = this.querySelector(`.${sheet.classes.textRibbon}`)
            this.ul = this.querySelector(`.${sheet.classes.ul}`)
            this.expandButton = this.querySelector(`.${sheet.classes.expandButton}`)

            TSP.state.listen('SideBar.expanded', this.expandedChanged.bind(this))
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        connectedCallback() {
            this.textRibbon.addEventListener('click', this.onExpandClicked.bind(this))
        }

        onExpandClicked() {
            TSP.state.set('SideBar.expanded', !TSP.state.get('SideBar.expanded'))
        }

        expandedChanged(expanded) {
            if (expanded) {
                this.ul.classList.add('expanded')
                this.expandButton.classList.add('expanded')
            } else {
                this.ul.classList.remove('expanded')
                this.expandButton.classList.remove('expanded')
            }
        }

        currentUrlChanged(url) {
            if (url === '') {
                TSP.state.set('SideBar.expanded', false)
                this.expandButton.classList.remove('locked')
                this.textRibbon.classList.remove('locked')
            } else {
                TSP.state.set('SideBar.expanded', true)
                this.expandButton.classList.add('locked')
                this.textRibbon.classList.add('locked')
            }
        }
    }

    customElements.define('tsp-sidebar', SideBar, { extends: 'div' })
})()
