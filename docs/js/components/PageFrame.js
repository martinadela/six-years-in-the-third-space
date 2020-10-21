;(function () {
    const PAGE_FRAME_PADDING_DESKTOP = TSP.config.get('pageFrame.paddingDesktop')
    const PAGE_FRAME_PADDING_MOBILE = TSP.config.get('pageFrame.paddingMobile')
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')

    const sheet = jss.default
        .createStyleSheet({
            main: {
                position: 'absolute',
                left: 0,
                top: 0,
                padding: PAGE_FRAME_PADDING_DESKTOP,
                [MOBILE_MEDIA_QUERY]: {
                    padding: PAGE_FRAME_PADDING_MOBILE,
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
            <div class="${sheet.classes.main}">
                <div class="${sheet.classes.innerContainer}">
                    <div class="${sheet.classes.readerContainer}">
                        <tsp-reader></tsp-reader>
                    </div>
                    <tsp-text-ribbon no-expand-button class="${sheet.classes.textRibbon}"></tsp-text-ribbon>
                    <tsp-sidebar></tsp-sidebar>
                </div>
            </div>
        </template>
    `

    class PageFrame extends HTMLElement {
        constructor() {
            super()
            this.appendChild(TSP.utils.template(template))
            TSP.state.set('PageFrame.component', this)
        }

        connectedCallback() {
            this.reader = this.querySelector('tsp-reader')
            this.sideBar = this.querySelector('tsp-sidebar')
            TSP.state.set('SideBar.component', this.sideBar)
        }

        load() {
            this.reader.load()
        }
    }

    customElements.define('tsp-page-frame', PageFrame)
})()
