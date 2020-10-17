;(function () {
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const BORDER_STYLE = `solid ${TSP.config.get(
        'styles.colors.Highlight1'
    )} ${TSP.config.get('styles.dimensions.borderThickness')}`
    const TEXT_ROLL_DURATION = TSP.config.get('sidebar.textRollDuration')
    const TEXT_RIBBON = TSP.config.get('sidebar.textRolling')
    const SIDEBAR_WIDTH_PERCENT = TSP.config.get('styles.dimensions.sidebarDesktopWidth')

    const textRibbonSheet = jss.default
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
                fontFamily: "'Cormorant Infant', serif",
                textTransform: 'uppercase',
                borderLeft: BORDER_STYLE,
                borderBottom: BORDER_STYLE,
                [MOBILE_MEDIA_QUERY]: {
                    borderLeft: 'none',
                    orderBottom: 'none',
                },
                padding: TSP.config.get('styles.spacings.size1'),
                cursor: 'pointer',
                userSelect: 'none',
                pointerEvents: 'initial',
                '&.locked': {
                    pointerEvents: 'none',
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
        })
        .attach()

    const template = `
<template id="TextRibbon">
    <div>${TEXT_RIBBON}</div>
    <button is="tsp-expand-menu-button"></button>
</template>
`

    class TextRibbon extends HTMLDivElement {
        constructor() {
            super()
            this.classList.add(textRibbonSheet.classes.main)
            this.appendChild(TSP.utils.template(template))
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
