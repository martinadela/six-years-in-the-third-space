;(function () {
    const borderStyle = `solid ${TSP.config.get(
        'styles.colors.Green'
    )} ${TSP.config.get('styles.dimensions.borderThickness')}`

    const sheet = jss.default
        .createStyleSheet({
            main: {
                width: '30%',
                maxWidth: '20em',
                color: TSP.config.get('styles.colors.Green'),
            },
            innerContainer: {
                borderLeft: borderStyle,
                borderBottom: borderStyle,
            },
            title: {
                textTransform: 'uppercase',
                fontFamily: TSP.config.get('styles.fontFamilies.title'),
                fontSize: '120%',
                fontWeight: 'normal',
                fontStyle: 'italic',
                textAlign: 'right',
                padding: TSP.config.get('styles.spacings.size1'),
                '& p': {
                    marginBottom: '4rem',
                    '&:last-child': {
                        marginBottom: '0',
                    },
                },
            },
            ul: {
                height: 0,
                overflow: 'hidden',
            },
            li: {
                fontFamily: TSP.config.get('styles.fontFamilies.title'),
                fontSize: '120%',
                color: TSP.config.get('styles.colors.Green'),
                '& a': {
                    color: TSP.config.get('styles.colors.Green'),
                },
                borderTop: borderStyle,
                borderTop: borderStyle,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                padding: TSP.config.get('styles.spacings.size1'),
            },
        })
        .attach()

    const template = `
        <template id="SideBar">
            <div class="${sheet.classes.innerContainer}">
                <h1 class="${sheet.classes.title}">
                    <p>Six years</p> 
                    <p>in the</p> 
                    <p>Third Space</p>
                </h1>
                <ul class="${sheet.classes.ul}">
                    <li class="${sheet.classes.li}">
                        <a is="tsp-anchor" href="/contributors">
                            Contributors
                        </a>
                    </li>
                    <li class="${sheet.classes.li}">
                        <a is="tsp-anchor" href="/works">
                            Works
                        </a>
                    </li>
                    <li class="${sheet.classes.li}">
                        <a is="tsp-anchor" href="/about">
                            About this book
                        </a>
                    </li>
                    <li class="${sheet.classes.li}">
                        <a is="tsp-anchor" href="/third-space">
                            Third space collective
                        </a>
                    </li>
                </ul>
            </div>
        </template>
    `

    class SideBar extends HTMLDivElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            this.appendChild(TSP.utils.template(template))
        }
    }

    customElements.define('tsp-sidebar', SideBar, { extends: 'div' })
})()
