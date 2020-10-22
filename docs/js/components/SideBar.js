;(function () {
    const TRANSITION_DURATION = 400
    const SIDEBAR_WIDTH_MOBILE_PERCENT = TSP.config.get(
        'sidebar.mobileWidth'
    )
    const COLOR_HIGHLIGHT1 = TSP.config.get('styles.colors.Highlight1')
    const PAGE_TRANSITION_DURATION = TSP.config.get('transitions.duration')
    const BACKGROUND = TSP.config.get('styles.colors.SideBarBackground')
    const Z_INDEX_SIDE_BAR = TSP.config.get('styles.zIndexes.sideBar')
    const BUTTON_SIZE = TSP.config.get('styles.dimensions.buttonSize')
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const DESKTOP_MEDIA_QUERY = TSP.config.get('styles.desktop.mediaQuery')

    const sheet = jss.default
        .createStyleSheet({
            main: {
                color: COLOR_HIGHLIGHT1,
                fontFamily: TSP.config.get('styles.fontFamilies.title'),
                zIndex: Z_INDEX_SIDE_BAR,
                width: `${SIDEBAR_WIDTH_MOBILE_PERCENT}%`,
                [DESKTOP_MEDIA_QUERY]: {
                    maxWidth: '20em',
                },
                height: '100%',
                position: 'absolute',
                top: 0,
                right: 0,
                
                transition: `transform ${TRANSITION_DURATION}ms ease-in-out, background ${TRANSITION_DURATION}ms ease-in-out`,
                '& $innerContainer': {
                    transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
                },
                '& $expandMenuButtonTop': {
                    // To force transition to trigger on first page
                    opacity: 0,
                },
                '&:not(.mainPage)': {
                    transform: `translateX(100%)`,
                    '&:not(.expanded) $innerContainer': {
                        opacity: 0,
                    },
                    // Transition expandMenuButtonTop when entering other than main page
                    '& $expandMenuButtonTop': {
                        transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
                        opacity: 1,
                    },
                    '& $expandMenuButtonTitle': {
                        display: 'none'
                    },
                },
                '&.mainPage': {
                    '&.expanded $expandMenuButtonTop': {
                        opacity: 1,
                    },
                    '& $ulContainer': {
                        transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
                        transform: 'translateX(100%)'
                    },
                    '& h1': {
                        pointerEvents: 'initial',
                    }
                },
                '&.expanded': {
                    transform: 'translateX(0%)',
                    background: BACKGROUND,
                    '& > tsp-expand-menu-button': {
                        display: 'inline-block',
                    },
                    '& $innerContainer': {
                        opacity: 1,
                    },
                    '& $expandMenuButtonTitle': {
                        display: 'none'
                    },
                    '&.mainPage': {
                        '& $ulContainer': {
                            transform: 'translateX(0%)'
                        },
                    },
                    [MOBILE_MEDIA_QUERY]: {
                        '& $expandMenuButtonTop': {
                            left: `calc(-${BUTTON_SIZE} / 2)`,
                        },
                    }
                },
                [MOBILE_MEDIA_QUERY]: {
                    '&:not(.mainPage):not(.expanded)': {
                        '& $expandMenuButtonTop': {
                            left: `-${BUTTON_SIZE}`,
                        },
                    },    
                },
                '&.mainPage:not(.expanded)': {
                    '& $expandMenuButtonTop': {
                        // We don't want transition here, because the svg icons are just brutally switched
                        opacity: 0,
                    },
                }
            },
            innerContainer: {},
            h1: {
                textTransform: 'uppercase',
                fontFamily: TSP.config.get('styles.fontFamilies.title'),
                fontWeight: 'normal',
                fontStyle: 'italic',
                textAlign: 'right',
                padding: TSP.config.get('styles.spacings.size1'),
                paddingLeft: 0,
                cursor: 'pointer',
            },
            ulContainer: {},
            li: {
                fontFamily: TSP.config.get('styles.fontFamilies.title'),
                color: COLOR_HIGHLIGHT1,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                cursor: 'pointer',
                '& tsp-anchor': {
                    display: 'inline-block',
                    height: '100%',
                    width: '100%',
                    padding: TSP.config.get('styles.spacings.size1'),
                    color: COLOR_HIGHLIGHT1,
                    pointerEvents: 'all',
                },
                textAlign: 'right',
            },
            expandMenuButtonTop: {
                '& button': {
                    '& svg': {
                        '&:first-child': {
                            transform: 'rotate(180deg)'
                        },
                        '&:last-child': {
                            display: 'none',
                        },
                    },
                    '&.expanded': {
                        '& svg:first-child': {
                            display: 'none',
                        },
                        '& svg:last-child': {
                            display: 'block',
                        },
                    }
                }
            },
            expandMenuButtonTitle: {
                fontSize: '0.7em',
                position: 'relative',
                marginRight: '0.15em',
                top: '0.1em',
                '& svg': {
                    width: '0.8em',
                    transform: 'rotate(180deg)',
                    '& path': {
                        stroke: COLOR_HIGHLIGHT1
                    }
                }
            },
        })
        .attach()

    const template = `
        <template id="SideBarMobile">
            <tsp-top-page-button-container class="${sheet.classes.expandMenuButtonTop}" >
                <tsp-expand-menu-button>
                    ${TSP.components.burgerSvg()}
                    ${TSP.components.crossSvg()}
                </tsp-expand-menu-button>
            </tsp-top-page-button-container>

            <div class="${sheet.classes.innerContainer}">
                <h1 class="${sheet.classes.h1}">
                    <div>
                        <p>Six years</p> 
                        <p>in the</p> 
                        <p>
                            <tsp-expand-menu-button
                                class="${sheet.classes.expandMenuButtonTitle}"
                            >${TSP.components.triangleSvg()}
                            </tsp-expand-menu-button>Third Space
                        </p>
                    </div>
                </h1>
                <div class="${sheet.classes.ulContainer}">
                    <ul>
                        <li class="${sheet.classes.li}">
                            <tsp-anchor href="/book-index">
                                Index
                            </tsp-anchor>
                        </li>
                        <li class="${sheet.classes.li}">
                            <tsp-anchor href="/about-this-book">
                                About this book
                            </tsp-anchor>
                        </li>
                        <li class="${sheet.classes.li}">
                            <tsp-anchor href="/third-space-collective">
                                Third space collective
                            </tsp-anchor>
                        </li>
                    </ul>
                </div>
            </div>
        </template>
    `

    class SideBar extends HTMLElement {
        constructor() {
            super()
            this.mountHtml()

            TSP.state.listen(
                'SideBar.expanded',
                this.expandedChanged.bind(this)
            )
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        mountHtml() {
            this.innerHTML = ''
            // Add the `mainPage` by default, to facilitate enter transitions.
            this.classList.add(sheet.classes.main)
            this.classList.add('mainPage')
            this.appendChild(TSP.utils.template(template))
            this.querySelector('h1').addEventListener('click', () => {
                this.querySelector('h1 tsp-expand-menu-button').click()
            }, false)
        }

        windowDimensionsChanged() {
            this.mountHtml()
        }

        expandedChanged(expanded) {
            if (expanded) {
                this.classList.add('expanded')
            } else {
                this.classList.remove('expanded')
            }
        }

        currentUrlChanged(url) {
            // On mobile close sidebar when changing page
            TSP.state.set('SideBar.expanded', false)
            if (url === '') {
                this.classList.add('mainPage')
            } else {
                // Delay a bit the transition to allow page to fade in
                if (this.classList.contains('mainPage')) {
                    setTimeout(() => this.classList.remove('mainPage'), 0.9 * PAGE_TRANSITION_DURATION)
                }
            }
        }
    }

    customElements.define('tsp-sidebar', SideBar)
})()
