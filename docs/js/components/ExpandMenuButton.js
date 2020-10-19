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

    class ExpandMenuButton extends HTMLElement {
        constructor() {
            super()
            this.element = document.createElement('button')
            this.element.innerHTML = this.innerHTML
            this.innerHTML = ''
            this.appendChild(this.element)
            this.element.className = this.className
            this.element.classList.add(sheet.classes.main)
            this.className = ''
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
                this.element.classList.add('expanded')
            } else {
                this.element.classList.remove('expanded')
            }
        }
    }

    customElements.define('tsp-expand-menu-button', ExpandMenuButton)
})()
