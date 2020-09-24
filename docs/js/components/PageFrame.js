;(function() {

const sheet = jss.default
    .createStyleSheet({
        main: {
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: TSP.state.get('PageFrame.zIndex'),
            padding: '2.5rem 2.5rem',
            width: '100%',
            height: '100%',
        },

        innerContainer: {
            display: 'flex',
            flexDirection: 'row',
            border: `solid ${TSP.state.get('styles.colors.Green')} ${TSP.state.get('styles.dimensions.borderThickness')}`,
            width: '100%',
            height: '100%',
        },

        reader: {
            flex: 1
        }
    }).attach()

const template = `
    <template id="PageFrame">
        <div class="${sheet.classes.innerContainer}">
            <div class="${sheet.classes.reader}">
                BLABLA
            </div>
            <div is="tsp-sidebar" />
        </div>
    </template>
`

class PageFrame extends HTMLDivElement {
    constructor() {
        super()
        this.classList.add(sheet.classes.main)
        this.appendChild(TSP.utils.template(template))
    }
}

customElements.define('tsp-page-frame', PageFrame, {extends: 'div'})

})()