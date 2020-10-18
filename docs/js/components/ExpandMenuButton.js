;(function () {
    const HIGHLIGHT_COLOR1 = TSP.config.get('styles.colors.Highlight1')
    const sheet = jss.default
        .createStyleSheet({
            main: {
                background: 'none',
                color: HIGHLIGHT_COLOR1,
                border: 'none',
                cursor: 'pointer',
                pointerEvents: 'initial',
                '&:focus': {
                    outline: 0,
                },
            },
        })
        .attach()

    class ExpandMenuButton extends HTMLButtonElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            TSP.state.listen(
                'SideBar.expanded',
                this.expandedChanged.bind(this)
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
    }

    customElements.define('tsp-expand-menu-button', ExpandMenuButton, {
        extends: 'button',
    })
})()
