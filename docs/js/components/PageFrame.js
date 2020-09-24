;(function() {

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
            border: `solid ${TSP.state.get('styles.colors.Green')} ${TSP.state.get('styles.dimensions.borderThickness')}`,
            width: '100%',
            height: '100%',
        },

        readerContainer: {
            flex: 1
        }
    }).attach()

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
        TSP.state.listen('Canvas3D.hoveredObject', this.hoveredObjectChanged.bind(this))
        this.addEventListener('click', this.onClick.bind(this), false)
    }

    connectedCallback() {
        this.reader = this.querySelector('div[is="tsp-reader"]')
    }

    onClick() {
        const hoveredObject = TSP.state.get('Canvas3D.hoveredObject')
        if (hoveredObject !== null) {
            TSP.utils.navigateTo(hoveredObject.url)
            TSP.state.set('Camera.chase', hoveredObject)
        }
    }

    hoveredObjectChanged(hoveredObject) {
        if (hoveredObject !== null) {
            this.style.cursor = 'pointer'
        } else {
            this.style.cursor = 'initial'
        }
    }

    load() {
        this.reader.load()
    }
}

customElements.define('tsp-page-frame', PageFrame, {extends: 'div'})

})()