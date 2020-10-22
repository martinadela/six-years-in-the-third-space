;(function () {
    const TRANSITION_DURATION = 400
    const COLOR_HIGHLIGHT1 = TSP.config.get('styles.colors.Highlight1')
    const PAGE_TRANSITION_DURATION = TSP.config.get('transitions.duration')
    const COLOR_BORDER = TSP.config.get('styles.colors.Border')
    const BORDER_STYLE = `solid ${COLOR_BORDER} ${TSP.config.get('styles.dimensions.borderThickness')}`
    const SIDEBAR_WIDTH_DESKTOP_PERCENT = TSP.config.get(
        'sidebar.desktopWidth'
    )
    const SIDEBAR_WIDTH_MOBILE_PERCENT = TSP.config.get(
        'sidebar.mobileWidth'
    )
    const IS_MOBILE = TSP.config.get('styles.isMobile')
    const BACKGROUND_MOBILE = TSP.config.get('styles.colors.SideBarBackground')
    const Z_INDEX_SIDE_BAR = TSP.config.get('styles.zIndexes.sideBar')

    const sharedStyles = {
        main: {
            color: TSP.config.get('styles.colors.Highlight1'),
            fontFamily: TSP.config.get('styles.fontFamilies.title'),
            zIndex: Z_INDEX_SIDE_BAR,
        },
        h1: {
            textTransform: 'uppercase',
            fontFamily: TSP.config.get('styles.fontFamilies.title'),
            fontWeight: 'normal',
            fontStyle: 'italic',
            textAlign: 'right',
            padding: TSP.config.get('styles.spacings.size1'),
        },
        li: {
            fontFamily: TSP.config.get('styles.fontFamilies.title'),
            color: TSP.config.get('styles.colors.Highlight1'),
            textTransform: 'uppercase',
            fontStyle: 'italic',
            cursor: 'pointer',
            '& tsp-anchor': {
                display: 'inline-block',
                height: '100%',
                width: '100%',
                padding: TSP.config.get('styles.spacings.size1'),
                color: TSP.config.get('styles.colors.Highlight1'),
                pointerEvents: 'all',
            },
        },
    }

    const sharedHtml = {
        h1: (sheet, expandButton) =>
            `
            <h1 class="${sheet.classes.h1}">
                <div>
                    <p>Six years</p> 
                    <p>in the</p> 
                    <p>${expandButton ? expandButton : ''}Third Space</p>
                </div>
            </h1>
            `,
        ulContainer: (sheet) =>
            `
            <div class="${sheet.classes.ulContainer}">
                <ul class="${sheet.classes.ul}">
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
            `,
    }

    //****************************** DESKTOP ******************************/
    const VERTICAL_PADDING_CONTENT = TSP.config.get('styles.spacings.contentVerticalPadding')

    const sheetDesktop = jss.default
        .createStyleSheet({
            main: {
                ...sharedStyles.main,
                width: `${SIDEBAR_WIDTH_DESKTOP_PERCENT}%`,
                maxWidth: '30em',
                '& ul': {
                    transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
                    transform: 'translateY(-100%)',
                },
                '& $ulContainer': {
                    /* to allow sliding animation from top, we need to hide overflow */
                    overflow: 'hidden',
                },
                '&.expanded': {
                    '& ul': {
                        transform: 'translateY(0%)',
                    },
                },
                '&:not(.mainPage)': {
                    '& tsp-expand-menu-button': {
                        display: 'none'
                    }
                },
                '& tsp-satellite-viewer': {
                    paddingRight: VERTICAL_PADDING_CONTENT
                }
            },
            innerContainer: {
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                '& tsp-satellite-viewer': {
                    flex: 1,
                }
            },
            h1: {
                ...sharedStyles.h1,
                '& p': {
                    marginBottom: '3.5rem',
                    '&:last-child': {
                        marginBottom: '0',
                    },
                },
                borderLeft: BORDER_STYLE,
                borderBottom: BORDER_STYLE,
                '@media screen and (min-width: 1100px)': {
                    fontSize: '250%',
                },
            },
            ulContainer: {},
            ul: {},
            li: {
                ...sharedStyles.li,
                borderBottom: BORDER_STYLE,
                borderLeft: BORDER_STYLE,
                textAlign: 'left',
            },
            textRibbon: {
                borderBottom: BORDER_STYLE,
                borderLeft: BORDER_STYLE,
            },
        })
        .attach()

    const templateDesktop = `
        <template id="SideBarDesktop">
            <div class="${sheetDesktop.classes.innerContainer}">
                ${sharedHtml.h1(sheetDesktop)}
                <tsp-text-ribbon class="${
                    sheetDesktop.classes.textRibbon
                }"></tsp-text-ribbon>
                ${sharedHtml.ulContainer(sheetDesktop)}
                <tsp-satellite-viewer></tsp-satellite-viewer>
            </div>
        </template>
    `

    //****************************** MOBILE ******************************/
    const BUTTON_SIZE = TSP.config.get('styles.dimensions.buttonSize')

    const sheetMobile = jss.default
        .createStyleSheet({
            main: {
                ...sharedStyles.main,
                width: `${SIDEBAR_WIDTH_MOBILE_PERCENT}%`,
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
                    background: BACKGROUND_MOBILE,
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
                    '& $expandMenuButtonTop': {
                        left: `calc(-${BUTTON_SIZE} / 2)`,
                    },
                },
                '&:not(.mainPage):not(.expanded)': {
                    '& $expandMenuButtonTop': {
                        left: `-${BUTTON_SIZE}`,
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
                ...sharedStyles.h1,
                paddingLeft: 0,
                cursor: 'pointer',
            },
            ulContainer: {},
            ul: {},
            li: {
                ...sharedStyles.li,
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

    const templateMobile = `
        <template id="SideBarMobile">
            <tsp-top-page-button-container class="${sheetMobile.classes.expandMenuButtonTop}" >
                <tsp-expand-menu-button>
                    ${TSP.components.burgerSvg()}
                    ${TSP.components.crossSvg()}
                </tsp-expand-menu-button>
            </tsp-top-page-button-container>

            <div class="${sheetMobile.classes.innerContainer}">
                ${sharedHtml.h1(sheetMobile, 
                    `<tsp-expand-menu-button
                        class="${sheetMobile.classes.expandMenuButtonTitle}"
                    >${TSP.components.triangleSvg()}</tsp-expand-menu-button>`
                )}
                ${sharedHtml.ulContainer(sheetMobile)}
            </div>
        </template>
    `

    //****************************** Component ******************************/

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
            if (IS_MOBILE()) {
                this.classList.add(sheetMobile.classes.main)
                this.classList.add('mainPage')
                this.appendChild(TSP.utils.template(templateMobile))
                this.querySelector('h1').addEventListener('click', () => this.querySelector('h1 tsp-expand-menu-button').click(), false)
            } else {
                this.classList.add(sheetDesktop.classes.main)
                this.classList.add('mainPage')
                this.appendChild(TSP.utils.template(templateDesktop))
            }
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
            if (IS_MOBILE()) {
                TSP.state.set('SideBar.expanded', false)
            }
            if (url === '') {
                this.classList.add('mainPage')
                // On desktop close sidebar when not main page
                if (!IS_MOBILE()) {
                    TSP.state.set('SideBar.expanded', false)
                }
            } else {
                // Delay a bit the transition to allow page to fade in
                if (this.classList.contains('mainPage')) {
                    setTimeout(() => this.classList.remove('mainPage'), 0.9 * PAGE_TRANSITION_DURATION)
                }
                // On desktop open sidebar when not main page
                if (!IS_MOBILE()) {
                    TSP.state.set('SideBar.expanded', true)
                }
            }
        }
    }

    customElements.define('tsp-sidebar', SideBar)
})()
