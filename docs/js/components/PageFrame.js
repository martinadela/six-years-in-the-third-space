;(function () {
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')

    const sheet = jss.default
        .createStyleSheet({
            main: {
                position: 'absolute',
                left: 0,
                top: 0,
                padding: '2.5rem 2.5rem',
                [MOBILE_MEDIA_QUERY]: {
                    padding: '1rem 1rem',
                },
                width: '100%',
                height: '100%',
                // To keep size right even when sidebar is offset
                overflow: 'hidden',
                // To allow orbital controls
                pointerEvents: 'none',
            },

            innerContainer: {
                /* To allow absolute positioning of side bar */
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                border: `solid ${TSP.config.get(
                    'styles.colors.Highlight1'
                )} ${TSP.config.get('styles.dimensions.borderThickness')}`,
                width: '100%',
                height: '100%',
                [MOBILE_MEDIA_QUERY]: {
                    flexDirection: 'column',
                },
            },

            readerContainer: {
                flex: 1,
                // Counter-intuitively, with the flex it forces the component to shrink / expand to the right size
                width: '0%',
                [MOBILE_MEDIA_QUERY]: {
                    width: '100%',
                    height: '0%',
                },
            },

            textRibbon: {
                display: 'none',
                [MOBILE_MEDIA_QUERY]: {
                    display: 'block',
                },
            },
        })
        .attach()

    const template = `
        <template id="PageFrame">
            <div class="${sheet.classes.innerContainer}">
                <div class="${sheet.classes.readerContainer}">
                    <div is="tsp-reader"></div>
                </div>
                <div is="tsp-text-ribbon" no-expand-button class="${sheet.classes.textRibbon}"></div>
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
            TSP.state.set('SideBar.component', this.sideBar)
        }

        load() {
            this.reader.load()
        }
    }

    customElements.define('tsp-page-frame', PageFrame, { extends: 'div' })
})()
