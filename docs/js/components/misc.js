;(function () {
    const COLOR_BACKGROUND = TSP.config.get('styles.colors.ContentBackground')
    const COLOR_HIGHLIGHT1 = TSP.config.get('styles.colors.Highlight1')
    const BUTTON_SIZE = TSP.config.get('styles.dimensions.buttonSize')
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')

    class Anchor extends HTMLElement {
        constructor() {
            super()
            this.addEventListener('click', (e) => {
                e.preventDefault()
                TSP.utils.navigateTo(this.getAttribute('href'))
            })
        }
    }

    customElements.define('tsp-anchor', Anchor)

    const topPageButtonContainerSheet = jss.default
        .createStyleSheet({
            main: {
                cursor: 'pointer',
                height: BUTTON_SIZE,
                width: BUTTON_SIZE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLOR_BACKGROUND,
                border: `solid ${TSP.config.get(
                    'styles.dimensions.borderThickness'
                )} ${COLOR_HIGHLIGHT1}`,
                borderRadius: `calc(${BUTTON_SIZE} / 2)`,
                pointerEvents: 'initial',
                '& button': {
                    border: 'none',
                    background: 'none',
                    color: COLOR_HIGHLIGHT1,
                    fontSize: '200%',
                },
                position: 'absolute',
                left: 0,
                top: 0,
                transform: 'translate(-50%, -50%)',
                [MOBILE_MEDIA_QUERY]: {
                    transform: 'initial',
                    top: `calc(-1rem - 3px)`,
                }
            },
        })
        .attach()

    class TopPageButtonContainer extends HTMLElement {
        constructor() {
            super()
            this.classList.add(topPageButtonContainerSheet.classes.main)
            this.addEventListener('click', this.onclick.bind(this), false)
        }

        onclick() {
            this.querySelector('button').click()
        }
    }

    customElements.define('tsp-top-page-button-container', TopPageButtonContainer)
})()
