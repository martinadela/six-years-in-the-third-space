;(function () {
    const TRANSITION_DURATION = 200
    const BORDER_STYLE = `solid ${TSP.config.get(
        'styles.colors.Highlight1'
    )} ${TSP.config.get('styles.dimensions.borderThickness')}`
    const SIDEBAR_WIDTH_DESKTOP_PERCENT = TSP.config.get(
        'styles.dimensions.sidebarDesktopWidth'
    )
    const SIDEBAR_WIDTH_MOBILE_PERCENT = TSP.config.get(
        'styles.dimensions.sidebarMobileWidth'
    )
    const IS_MOBILE = TSP.config.get('styles.isMobile')

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
            '& a': {
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
                    '& button[is="tsp-expand-menu-button"]': {
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
                <div is="tsp-text-ribbon" class="${
                    sheetDesktop.classes.textRibbon
                }"></div>
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
                minWidth: '18em',
                height: '100%',
                position: 'absolute',
                top: 0,
                right: 0,
                
                transition: `transform ${TRANSITION_DURATION}ms ease-in-out, background ${TRANSITION_DURATION}ms ease-in-out`,
                '& $innerContainer': {
                    transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
                },
                '&:not(.mainPage)': {
                    transform: `translateX(calc(100% - ${BUTTON_SIZE}))`,
                    '&:not(.expanded) $innerContainer': {
                        opacity: 0,
                    },
                },
                '&.mainPage': {
                    '&:not(.expanded) $expandMenuButtonContainer': {
                        display: 'none',
                    },
                    '& $ulContainer': {
                        transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
                        transform: 'translateX(100%)'
                    },
                },
                '&.expanded': {
                    transform: 'translateX(0%)',
                    background: 'rgb(255,255,255)',
                    background:
                        `linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) calc(100% - ${BUTTON_SIZE} / 2), rgba(255,255,255,0) 100%)`,
                    '& > button[is="tsp-expand-menu-button"]': {
                        display: 'inline-block',
                    },
                    '& $innerContainer': {
                        opacity: 1,
                    },
                    '& $expandMenuButtonMainPage': {
                        display: 'none'
                    },
                    '&.mainPage': {
                        '& $ulContainer': {
                            transform: 'translateX(0%)'
                        },
                    },
    
                },
            },
            innerContainer: {},
            h1: {
                ...sharedStyles.h1,
            },
            ulContainer: {},
            ul: {},
            li: {
                ...sharedStyles.li,
                textAlign: 'right',
            },
            expandMenuButtonContainer: {
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
            expandMenuButtonMainPage: {
                fontSize: '100%'
            },
        })
        .attach()

    const templateMobile = `
        <template id="SideBarMobile">
            <div is="tsp-top-page-button-container" class="${sheetMobile.classes.expandMenuButtonContainer}" >
                <button 
                    is="tsp-expand-menu-button"
                >
                    <span>▾</span>
                    <span>X</span>
                </button>
            </div>

            <div class="${sheetMobile.classes.innerContainer}">
                ${sharedHtml.h1(sheetMobile, `
                    <button 
                        is="tsp-expand-menu-button"
                        class="${sheetMobile.classes.expandMenuButtonMainPage}"
                    >◀</button>
                `)}
                ${sharedHtml.ulContainer(sheetMobile)}
            </div>
        </template>
    `

    //****************************** Component ******************************/

    class SideBar extends HTMLDivElement {
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
            if (IS_MOBILE()) {
                this.classList.add(sheetMobile.classes.main)
                this.appendChild(TSP.utils.template(templateMobile))
            } else {
                this.classList.add(sheetDesktop.classes.main)
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
                this.classList.remove('mainPage')
                // On desktop open sidebar when not main page
                if (!IS_MOBILE()) {
                    TSP.state.set('SideBar.expanded', true)
                }
            }
        }
    }

    customElements.define('tsp-sidebar', SideBar, { extends: 'div' })
})()
