;(function () {
    const sheet = jss.default
        .createStyleSheet({
            main: {
                position: 'absolute',
                left: 0,
                top: 0,
                padding: '2.5rem 2.5rem',
                width: '100%',
                height: '100%',
            },

            innerContainer: {
                display: 'flex',
                flexDirection: 'row',
                border: `solid ${TSP.config.get(
                    'styles.colors.Highlight1'
                )} ${TSP.config.get('styles.dimensions.borderThickness')}`,
                width: '100%',
                height: '100%',
            },

            readerContainer: {
                flex: 1,
                // Counter-intuitively, with the flex it forces the component to shrink / expand to the right size
                width: '0%'
            },
        })
        .attach()

    const template = `
        <template id="PageFrame">
            <div class="${sheet.classes.innerContainer}">
                <div class="${sheet.classes.readerContainer}">
                    <div is="tsp-reader"></div>
                </div>
                <div is="tsp-sidebar"></div>
            </div>
        </template>
    `

    class PageFrame extends HTMLDivElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            this.appendChild(TSP.utils.template(template))
        }

        connectedCallback() {
            this.reader = this.querySelector('div[is="tsp-reader"]')
            this.sideBar = this.querySelector('div[is="tsp-sidebar"]')
            TSP.state.set('Sidebar.element', this.sideBar)
        }

        load() {
            this.reader.load()
        }
    }

    customElements.define('tsp-page-frame', PageFrame, { extends: 'div' })
})()
