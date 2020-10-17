;(function () {
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const TRANSITION_DURATION = 200
    const BORDER_STYLE = `solid ${TSP.config.get(
        'styles.colors.Highlight1'
    )} ${TSP.config.get('styles.dimensions.borderThickness')}`
    const SIDEBAR_WIDTH_PERCENT = TSP.config.get('styles.dimensions.sidebarDesktopWidth')

    const sheet = jss.default
        .createStyleSheet({
            main: {
                width: `${SIDEBAR_WIDTH_PERCENT}%`,
                maxWidth: '20em',
                color: TSP.config.get('styles.colors.Highlight1'),
                fontFamily: TSP.config.get('styles.fontFamilies.title'),
                [MOBILE_MEDIA_QUERY]: {
                    width: '100%',
                    maxWidth: 'initial',
                }
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
                    marginBottom: '3.5rem',
                    '&:last-child': {
                        marginBottom: '0',
                    },
                    [MOBILE_MEDIA_QUERY]: {
                        marginBottom: '0',
                    }
                },
                borderLeft: BORDER_STYLE,
                borderBottom: BORDER_STYLE,
                [MOBILE_MEDIA_QUERY]: {
                    borderLeft: 'none',
                    borderBottom: 'none',
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
                    display: 'inline-block',
                    height: '100%',
                    width: '100%',
                    padding: TSP.config.get('styles.spacings.size1'),
                    color: TSP.config.get('styles.colors.Highlight1'),
                    pointerEvents: 'all'
                },
                borderBottom: BORDER_STYLE,
                borderLeft: BORDER_STYLE,
                textTransform: 'uppercase',
                fontStyle: 'italic',
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
                <div is="tsp-text-ribbon"></div>

                <div class="${sheet.classes.ulContainer}">
                    <ul class="${sheet.classes.ul}">
                        <li class="${sheet.classes.li}">
                            <a is="tsp-anchor" href="/book-index">
                                Index
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

            this.ul = this.querySelector(`.${sheet.classes.ul}`)

            TSP.state.listen('SideBar.expanded', this.expandedChanged.bind(this))
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        expandedChanged(expanded) {
            if (expanded) {
                this.ul.classList.add('expanded')
            } else {
                this.ul.classList.remove('expanded')
            }
        }

        currentUrlChanged(url) {
            if (url === '') {
                TSP.state.set('SideBar.expanded', false)
            } else {
                TSP.state.set('SideBar.expanded', true)
            }
        }
    }

    customElements.define('tsp-sidebar', SideBar, { extends: 'div' })
})()
