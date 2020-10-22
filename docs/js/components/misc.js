;(function () {
    const COLOR_BUTTON_BACKGROUND = TSP.config.get('styles.colors.ButtonBackground')
    const COLOR_HIGHLIGHT1 = TSP.config.get('styles.colors.Highlight1')
    const BORDER_THICKNESS = TSP.config.get('styles.dimensions.borderThickness')
    const COLOR_BORDER = TSP.config.get('styles.colors.Border')
    const BUTTON_SIZE = TSP.config.get('styles.dimensions.buttonSize')
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const PAGE_FRAME_PADDING_MOBILE = TSP.config.get('pageFrame.paddingMobile')

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
                '& svg': {
                    // To force the flex display to have an effect
                    display: 'block',
                    '& path': {
                        fill: COLOR_HIGHLIGHT1,
                        stroke: COLOR_HIGHLIGHT1
                    }
                },
                backgroundColor: COLOR_BUTTON_BACKGROUND,
                border: `solid ${BORDER_THICKNESS} ${COLOR_BORDER}`,
                borderRadius: `calc(${BUTTON_SIZE} / 2)`,
                pointerEvents: 'initial',
                '& button': {
                    display: 'block',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    color: COLOR_HIGHLIGHT1,
                    fontSize: '200%',
                    '&:focus': {
                        outline: 0,
                    },
                },
                position: 'absolute',
                left: 0,
                top: 0,
                transform: 'translate(-50%, -50%)',
                [MOBILE_MEDIA_QUERY]: {
                    transform: 'initial',
                    top: `calc(-${PAGE_FRAME_PADDING_MOBILE} - ${BORDER_THICKNESS})`,
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

    TSP.components.crossSvg = () => `
        <svg
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            version="1.1"
        >
        <path
            d="m 11.273162,9.9689188 7.34455,7.1793612 -1.175435,1.12806 -7.34455,-7.161311 L 2.7531774,18.27634 1.5777411,17.14828 8.9222907,9.9689188 1.5777411,2.8076072 2.7531774,1.6614968 10.097727,8.8228083 17.460788,1.6614968 18.636224,2.7895574 Z"
            style="fill-opacity:1;stroke:none;stroke-width:0"
        />
        </svg>
    `

    TSP.components.triangleSvg = () => `
        <svg
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            version="1.1"
        >
        <path
            style="fill:none;fill-opacity:1;stroke-width:1.90134;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
            d="M 18.12581,9.9609181 5,18.259221 V 1.6626149 Z"
            />
        </svg> 
    `

    TSP.components.burgerSvg = () => `
        <svg
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 5.2916665 5.2916668"
            version="1.1"
        >
            <path
                style="fill:none;stroke-width:0.396875;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                d="M 0,0.7614375 H 5.2916667"
            />
            <path
                style="fill:none;stroke-width:0.396875;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
                d="M 0,4.5304375 H 5.292"
            />
            <path
                style="fill:none;stroke-width:0.396875;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none"
                d="M 0,2.6458372 H 5.292"
            />
        </svg>
     `
})()
