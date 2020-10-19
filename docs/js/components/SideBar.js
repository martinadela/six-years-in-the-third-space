;(function () {
    const TRANSITION_DURATION = 400
    const PAGE_TRANSITION_DURATION = TSP.config.get('transitions.duration')
    const BORDER_STYLE = `solid ${TSP.config.get(
        'styles.colors.Highlight1'
    )} ${TSP.config.get('styles.dimensions.borderThickness')}`
    const SIDEBAR_WIDTH_DESKTOP_PERCENT = TSP.config.get(
        'sidebar.desktopWidth'
    )
    const SIDEBAR_WIDTH_MOBILE_PERCENT = TSP.config.get(
        'sidebar.mobileWidth'
    )
    const IS_MOBILE = TSP.config.get('styles.isMobile')
    const BACKGROUND_MOBILE = TSP.config.get('styles.colors.SideBarBackground')

    const sharedStyles = {
        main: {
            color: TSP.config.get('styles.colors.Highlight1'),
            fontFamily: TSP.config.get('styles.fontFamilies.title'),
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
                    <p>
                        ${expandButton ? expandButton : ''}
                        Third Space
                    </p>
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
                        <tsp-anchor href="/about">
                            About this book
                        </tsp-anchor>
                    </li>
                    <li class="${sheet.classes.li}">
                        <tsp-anchor href="/third-space">
                            Third space collective
                        </tsp-anchor>
                    </li>
                </ul>
            </div>
            `,
    }

    //****************************** DESKTOP ******************************/

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
                }
            },
            innerContainer: {},
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
                    transform: `translateX(calc(100% - ${BUTTON_SIZE}))`,
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
                    // We don't want transition here, because the icon is just brutally switched
                    '&:not(.expanded) $expandMenuButtonTop': {
                        opacity: 0,
                    },
                    '&.expanded $expandMenuButtonTop': {
                        opacity: 1,
                    },
                    '& $ulContainer': {
                        transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
                        transform: 'translateX(100%)'
                    },
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
                    }
    
                },
            },
            innerContainer: {},
            h1: {
                ...sharedStyles.h1,
                paddingLeft: 0,
                pointerEvents: 'initial',
            },
            ulContainer: {},
            ul: {},
            li: {
                ...sharedStyles.li,
                textAlign: 'right',
            },
            expandMenuButtonTop: {
                '& button': {
                    '& span': {
                        display: 'inline-block',
                        '&:first-child': {
                            transform: 'rotate(90deg)'
                        },
                        '&:last-child': {
                            display: 'none',
                        },
                    },
                    '&.expanded': {
                        '& span:first-child': {
                            display: 'none',
                        },
                        '& span:last-child': {
                            display: 'inline-block',
                        },
                    }
                }
            },
            expandMenuButtonTitle: {
                fontSize: '0.6em',
                position: 'relative',
                bottom: '0.2em',
            },
        })
        .attach()

    const templateMobile = `
        <template id="SideBarMobile">
            <tsp-top-page-button-container class="${sheetMobile.classes.expandMenuButtonTop}" >
                <tsp-expand-menu-button>
                    <span>▾</span>
                    <span>X</span>
                </tsp-expand-menu-button>
            </tsp-top-page-button-container>

            <div class="${sheetMobile.classes.innerContainer}">
                ${sharedHtml.h1(sheetMobile, `
                    <tsp-expand-menu-button
                        class="${sheetMobile.classes.expandMenuButtonTitle}"
                    >◀</tsp-expand-menu-button>
                `)}
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
