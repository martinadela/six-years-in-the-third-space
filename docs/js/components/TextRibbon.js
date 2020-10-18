;(function () {
    const HIGHLIGHT_COLOR1 = TSP.config.get('styles.colors.Highlight1')
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const EXPAND_TRANSITION_DURATION = TSP.config.get(
        'transitions.sidebarDuration'
    )
    const TEXT_ROLL_DURATION = TSP.config.get('sidebar.textRollDuration')
    const TEXT_RIBBON = TSP.config.get('sidebar.textRolling')
    const SIDEBAR_WIDTH_PERCENT = TSP.config.get(
        'styles.dimensions.sidebarDesktopWidth'
    )

    const sheet = jss.default
        .createStyleSheet({
            main: {
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
                [MOBILE_MEDIA_QUERY]: {
                    borderLeft: 'none',
                    orderBottom: 'none',
                },
                padding: TSP.config.get('styles.spacings.size1'),
                cursor: 'pointer',
                userSelect: 'none',
                pointerEvents: 'initial',
                '&.locked, &[no-expand-button]': {
                    pointerEvents: 'none',
                    '& button[is="tsp-expand-menu-button"]': {
                        display: 'none',
                    },
                },
            },
            '@keyframes roll': {
                '0%': {
                    transform: `translateX(${SIDEBAR_WIDTH_PERCENT}vw)`,
                },
                '100%': {
                    transform: 'translateX(-100%)',
                },
            },
            expandMenuButton: {
                top: '50%',
                right: 0,
                position: 'absolute',
                marginRight: '0.5em',
                fontSize: '150%',
                transition: `transform ${EXPAND_TRANSITION_DURATION}ms ease-in-out`,
                transform: 'translateY(-50%) rotate(0deg)',
                '&.expanded': {
                    transform: 'translateY(-50%) rotate(180deg)',
                },
            },
        })
        .attach()

    const template = `
        <template id="TextRibbon">
            <div>${TEXT_RIBBON}</div>
            <button is="tsp-expand-menu-button" class="${sheet.classes.expandMenuButton}">▾</button>
        </template>
    `

    class TextRibbon extends HTMLDivElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            this.appendChild(TSP.utils.template(template))
            // this.showExpandButton = this.getAttribute()

            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        connectedCallback() {
            this.addEventListener('click', this.onClicked.bind(this))
        }

        onClicked() {
            TSP.state.set(
                'SideBar.expanded',
                !TSP.state.get('SideBar.expanded')
            )
        }

        currentUrlChanged(url) {
            if (url === '') {
                this.classList.remove('locked')
            } else {
                this.classList.add('locked')
            }
        }
    }

    customElements.define('tsp-text-ribbon', TextRibbon, { extends: 'div' })
})()
