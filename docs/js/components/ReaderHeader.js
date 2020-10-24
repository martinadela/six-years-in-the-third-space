;(function () {
    const COLOR_SUBTITLE = TSP.config.get('styles.colors.H2Subtitle')
    const COLOR_H2 = TSP.config.get('styles.colors.H2')
    const FONT_FAMILY_TITLE = TSP.config.get('styles.fontFamilies.title')
    const HEIGHT_HEADER = TSP.config.get('reader.headerHeight')
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const PAGE_FRAME_PADDING_MOBILE = TSP.config.get('pageFrame.paddingMobile')
        
    const sheet = jss.default
        .createStyleSheet({
            main: {
                position: 'relative',
                // take the width available and remove page padding
                height: `calc(${HEIGHT_HEADER})`,
                '& tsp-satellite-viewer': {
                    position: 'absolute',
                    width: '50%',
                    left: '50%',
                    top: 0,
                    height: '100%',
                },
                '&.hasNoSatellite': {
                    '& $h2Container': {
                        width: '100%',
                    },
                    '& tsp-satellite-viewer': {
                        // We set opacity to 0, otherwise the camera will fail getting a proper 
                        // position for the object
                        opacity: 0,
                        width: '100%',
                        left: 0,
                    }
                }
            },
            h2Container : {
                width: '50%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',

                '& h2': {
                    textAlign: 'center',
                    color: COLOR_H2,
                    padding: '0 2em',
                    fontFamily: FONT_FAMILY_TITLE,
                    textTransform: 'uppercase',
                    fontStyle: 'italic',
                    fontSize: '100%',
                    fontWeight: 'normal',
                    [MOBILE_MEDIA_QUERY]: {
                        fontSize: '80%',
                        paddingLeft: PAGE_FRAME_PADDING_MOBILE,
                    },
                    marginBottom: '0em',
                    '& > div:last-child': {
                        marginTop: '1em'
                    },
                    '& span': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '& .title, & .subtitle': {
                        marginBottom: '2em',
                        color: COLOR_SUBTITLE,
                        fontStyle: 'initial',
                    },
                    '& .title': {
                        fontSize: '180%',
                    },
                    '& .subtitle': {
                        fontSize: '100%',
                        '& .empty': {
                            display: 'none'
                        },
                        '& a': {
                            color: COLOR_SUBTITLE,
                        }
                    },
                },
            },
        })
        .attach()

    const template = `
        <template id="ReaderHeader">
            <div class="${sheet.classes.main}">
                <div class="${sheet.classes.h2Container}">
                    <h2>
                        <div>
                            <span class="title">
                                Stuff asking stuff / Stuff of stuff / Stuff about stuff / Inside out stuff /
                                Vital stuff* inside and outside
                            </span>
                        </div>
                
                        <div>
                            <span class="subtitle">
                                <tsp-anchor href=""></tsp-anchor>
                            </span>
                        </div>
                    </h2>
                </div>
                <tsp-satellite-viewer></tsp-satellite-viewer>
            </div>
        </template>
    `

    class ReaderHeader extends HTMLElement {
        constructor() {
            super()
            this.appendChild(TSP.utils.template(template))
            this.element = this.querySelector(`.${sheet.classes.main}`)

            this.titleElement = this.querySelector(
                `.${sheet.classes.h2Container} h2 .title`
            )
            this.subtitleElement = this.querySelector(
                `.${sheet.classes.h2Container} h2 .subtitle tsp-anchor`
            )
        }

        setContent(title, subtitle, subtitleUrl, hasNoSatellite) {
            this.titleElement.innerHTML = title
            if (subtitle) {
                this.subtitleElement.classList.remove('empty')
                this.subtitleElement.innerHTML = subtitle
            } else {
                this.subtitleElement.classList.add('empty')
            }
            this.subtitleElement.setAttribute('href', subtitleUrl)

            if (hasNoSatellite) {
                this.element.classList.remove('hasNoSatellite')
            } else {
                this.element.classList.add('hasNoSatellite')
            }
        }
    }

    customElements.define('tsp-reader-header', ReaderHeader)
})()