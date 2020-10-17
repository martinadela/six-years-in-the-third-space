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
                '& h1 button[is="tsp-expand-menu-button"]': {
                    display: 'none'
                },
                [MOBILE_MEDIA_QUERY]: {
                    width: '100%',
                    maxWidth: 'initial',
                    '& div[is="tsp-text-ribbon"]': {
                        display: 'none'
                    },
                    '& h1 button[is="tsp-expand-menu-button"]': {
                        display: 'inline-block'
                    },
                    '& $innerContainer': {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                    }
                },

                /********** Menu transitions **********/
                /* to hide the translated menu when collapsed on mobile */
                overflow: 'hidden',
                '& ul': {
                    transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
                    transform: 'translateY(-100%)',
                    [MOBILE_MEDIA_QUERY]: {
                        transform: 'translateY(0%)',
                    },
                },
                '& $ulContainer': {
                    /* to allow sliding animation from top, we need to hide overflow */
                    overflow: 'hidden',
                    [MOBILE_MEDIA_QUERY]: {
                        /* to allow absolute positioning of background */
                        position: 'relative',
                        /* to show background, we need overflow visible */
                        overflow: 'visible',
                        transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
                        transform: 'translateX(150%)',
                    },
                },
                '&.expanded': {
                    '& $ulContainer': {
                        [MOBILE_MEDIA_QUERY]: {
                            transform: 'translateX(0%)',
                        }
                    },
                    '& ul': {
                        transform: 'translateY(0%)',
                    }
                },
    
            },
            innerContainer: {},
            h1: {
                textTransform: 'uppercase',
                fontFamily: TSP.config.get('styles.fontFamilies.title'),
                fontWeight: 'normal',
                fontStyle: 'italic',
                textAlign: 'right',
                padding: TSP.config.get('styles.spacings.size1'),
                /* to appear above background on mobile */
                zIndex: 1,
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
            ulContainer: {},
            mobileMenuBackground: {
                [MOBILE_MEDIA_QUERY]: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '100vh',
                    width: '100%',
                    background: 'rgb(255,255,255)',
                    background: 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 84%, rgba(255,255,255,0) 100%)',
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
            textRibbonMobile: {
                borderBottom: BORDER_STYLE,
                borderLeft: BORDER_STYLE,
            },
            expandMenuButtonMobile: {
                fontSize: '130%'
            }
        })
        .attach()

    const template = `
        <template id="SideBar">
            <div class="${sheet.classes.innerContainer}">
                <h1 class="${sheet.classes.h1}">
                    <div>
                        <p>Six years</p> 
                        <p>in the</p> 
                        <p>Third Space</p>
                    </div>
                    <button is="tsp-expand-menu-button" orientation="horizontal" class="${sheet.classes.expandMenuButtonMobile}"></button>
                </h1>

                <div is="tsp-text-ribbon" class="${sheet.classes.textRibbonMobile}"></div>

                <div class="${sheet.classes.ulContainer}">
                    <div class="${sheet.classes.mobileMenuBackground}"></div>
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

            TSP.state.listen('SideBar.expanded', this.expandedChanged.bind(this))
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        expandedChanged(expanded) {
            if (expanded) {
                this.classList.add('expanded')
            } else {
                this.classList.remove('expanded')
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
