;(function () {
    const HIGHLIGHT_COLOR1 = TSP.config.get('styles.colors.Highlight1')
    const EXPAND_TRANSITION_DURATION = TSP.config.get(
        'transitions.sidebarDuration'
    )

    const sheet = jss.default
        .createStyleSheet({
            main: {
                display: 'block',
                background: 'none',
                color: HIGHLIGHT_COLOR1,
                border: 'none',
                cursor: 'pointer',
                pointerEvents: 'initial',
                '&:focus': {
                    outline: 0,
                },
                transition: `transform ${EXPAND_TRANSITION_DURATION}ms ease-in-out`,
                transform: 'translateY(-50%) rotate(0deg)',
                '&.expanded': {
                    transform: 'translateY(-50%) rotate(180deg)',
                },
                '&[orientation="horizontal"]': {
                    transform: 'rotate(90deg)',
                    '&.expanded': {
                        transform: 'rotate(270deg)',
                    },
                },
                '&.locked': {
                    display: 'none',
                },
            },
        })
        .attach()

    class ExpandMenuButton extends HTMLButtonElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            this.innerText = '▾'
            TSP.state.listen(
                'SideBar.expanded',
                this.expandedChanged.bind(this)
            )
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        connectedCallback() {
            this.addEventListener('click', this.onClicked.bind(this))
        }

        onClicked(event) {
            // To avoid double triggering of the "expand"
            event.stopImmediatePropagation()
            TSP.state.set(
                'SideBar.expanded',
                !TSP.state.get('SideBar.expanded')
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
                this.classList.remove('locked')
            } else {
                this.classList.add('locked')
            }
        }
    }

    customElements.define('tsp-expand-menu-button', ExpandMenuButton, {
        extends: 'button',
    })
})()
