;(function () {
    const COLOR_BACKGROUND = TSP.config.get('styles.colors.ContentBackground')
    const COLOR_BACKGROUND0 = `rgba(${COLOR_BACKGROUND[0]}, ${COLOR_BACKGROUND[1]}, ${COLOR_BACKGROUND[2]}, 0)`
    const COLOR_BACKGROUND1 = `rgba(${COLOR_BACKGROUND[0]}, ${COLOR_BACKGROUND[1]}, ${COLOR_BACKGROUND[2]}, 1)`
    const COLOR_SUBTITLE = TSP.config.get('styles.colors.H2Subtitle')
    const COLOR_TEXT_BOLD = TSP.config.get('styles.colors.TextBold')
    const COLOR_H2 = TSP.config.get('styles.colors.H2')
    const FONT_FAMILY_TITLE = TSP.config.get('styles.fontFamilies.title')
    const ENTER_TRANSITION_DELAY =
        TSP.config.get('transitions.duration') *
        TSP.config.get('transitions.reader')[0]
    const PAGE_TRANSITION_DURATION = TSP.config.get('transitions.duration')
    const TRANSITION_DURATION = 
        TSP.config.get('transitions.duration') *
        TSP.config.get('transitions.reader')[1]
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const DESKTOP_MEDIA_QUERY = TSP.config.get('styles.desktop.mediaQuery')
    const Z_INDEX_INNER_CONTAINER = TSP.config.get('styles.zIndexes.reader')
    const Z_INDEX_TOP_BUTTONS = TSP.config.get('styles.zIndexes.topButtons')
    const GRADIENT_PADDING_TOP_DESKTOP = '20em'
    const GRADIENT_PADDING_TOP_MOBILE = '10em'
    const PAGE_FRAME_PADDING_DESKTOP = TSP.config.get('pageFrame.paddingDesktop')
    const PAGE_FRAME_PADDING_MOBILE = TSP.config.get('pageFrame.paddingMobile')
    const HEIGHT_HEADER = `min(100vw - 2 * ${PAGE_FRAME_PADDING_DESKTOP}, 100vh - 2 * ${PAGE_FRAME_PADDING_DESKTOP})`
        
    const sheet = jss.default
        .createStyleSheet({
            main: {
                height: '100%',
                // necessary to show the button
                overflow: 'visible',
                // To allow positioning of button
                position: 'relative',
                // Transitions
                transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
                opacity: 0,
                '&.enter': {
                    opacity: 1,
                    // PageFrame disable pointer events to let control to orbit controls,
                    // so we need to reactivate it here
                    pointerEvents: 'initial',
                },
            },
            closeButton: {
                zIndex: Z_INDEX_TOP_BUTTONS
            },
            innerContainer: {
                overflowY: 'scroll',
                height: '100%',
                // To position the satellite viewer
                position: 'relative',
                zIndex: Z_INDEX_INNER_CONTAINER,
                '& .background': {
                    background: `linear-gradient(180deg, ${COLOR_BACKGROUND0} calc(${HEIGHT_HEADER} - ${GRADIENT_PADDING_TOP_DESKTOP}), ${COLOR_BACKGROUND1} calc(${HEIGHT_HEADER}), ${COLOR_BACKGROUND1} 100%)`,
                    [MOBILE_MEDIA_QUERY]: {
                        background: `linear-gradient(180deg, ${COLOR_BACKGROUND0} calc(${HEIGHT_HEADER} - ${GRADIENT_PADDING_TOP_MOBILE}), ${COLOR_BACKGROUND1} calc(${HEIGHT_HEADER}), ${COLOR_BACKGROUND1} 100%)`,
                    }
                }
            },
            headerContainer: {
                display: 'flex',
                // take the width available and remove page padding
                height: `calc(${HEIGHT_HEADER})`,
                flexDirection: 'row',
                '& > *': {
                    flex: 1,
                },
            },
            h2Container : {
                width: '50%',
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
                    fontSize: '180%',
                    fontWeight: 'normal',
                    [MOBILE_MEDIA_QUERY]: {
                        textAlign: 'left',
                        fontSize: '130%',
                        paddingLeft: PAGE_FRAME_PADDING_MOBILE,
                    },
                    marginBottom: '0em',
                    '& span': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '& .title, & .subtitle': {
                        marginBottom: '2em',
                        color: COLOR_SUBTITLE,
                        fontStyle: 'initial',
                    },
                    '& .title': {
                    },
                    '& .subtitle': {
                        fontSize: '60%',
                        '& a': {
                            color: COLOR_SUBTITLE,
                        }
                    },
                },
            },
            contentContainer: {
                padding: `0 ${PAGE_FRAME_PADDING_DESKTOP}`,
                [MOBILE_MEDIA_QUERY]: {
                    padding: `0 ${PAGE_FRAME_PADDING_MOBILE}`,
                }
            },
            content: {
                textAlign: 'justify',
                margin: 'auto',
                maxWidth: '1000px',

                '& .fullwidthimage': {
                    '& img': {
                        width: '100%',
                        [MOBILE_MEDIA_QUERY]: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        }
                    },
                },

                '& .flexibleimage': {
                    [DESKTOP_MEDIA_QUERY]: {
                        float: 'right',
                        marginLeft: '1em',
                        width: '50%',
                    },
                    '& img': {
                        width: '100%',
                        [MOBILE_MEDIA_QUERY]: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        }
                    },
                },

                '& p': {
                    marginBottom: '1em',
                    textAlign: 'justify',
                },

                '& .textcontent': {
                    textAlign: 'left',
                },

                '& .poemparagraph': {
                    textAlign: 'left',
                },

                '& .note': {
                    position: 'relative',
                    top: '-0.5em',
                },

                '& .imagecaption': {
                    marginBottom: '2em',
                },

                '& .imagecaption-title': {
                    fontWeight: 'bold',
                },

                '& .imagecaption-description': {
                    fontStyle: 'italic',
                },

                '& .bold': {
                    color: COLOR_TEXT_BOLD,
                    marginTop: '1em',
                },
                '&.collaborators $content': {
                    '& .names': {
                        color: 'rgb(248, 51, 16)',
                        marginBottom: '0em',
                        marginTop: '3em',
                    },
                },

                transition: `opacity ${TRANSITION_DURATION}ms ease-in-out 0ms`,
                opacity: 0,
                '&.enter': {
                    opacity: 1,
                },
                '&.exit': {
                    opacity: 0,
                },
            },
        })
        .attach()

    const template = `
        <template id="Reader">
            <div class="${sheet.classes.main}">
                <tsp-top-page-button-container class="${sheet.classes.closeButton}">
                    <button>${TSP.components.crossSvg()}</button>
                </tsp-top-page-button-container>
                <div class="${sheet.classes.innerContainer}">
                    <div class="background">
                        <div class="${sheet.classes.headerContainer}">
                            <div class="${sheet.classes.h2Container}">
                                <h2>
                                    <span class="title">
                                        Stuff asking stuff / Stuff of stuff / Stuff about stuff / Inside out stuff /
                                        Vital stuff* inside and outside
                                    </span><br/>
                            
                                    <span class="subtitle">
                                        <tsp-anchor href="/collaborators/kraam">
                                            Minna Hint & Killu Sukmit (Kraam Art Space)
                                        </tsp-anchor>
                                    </span>
                                </h2>
                            </div>
                            <tsp-satellite-viewer></tsp-satellite-viewer>
                        </div>
                        <div class="${sheet.classes.contentContainer}">
                        </div>
                    </div>
                </div>
            </div>
        </template>
    `

    class Reader extends HTMLElement {
        constructor() {
            super()
            this.contents = {
                contributions: {},
                collaborators: {},
                otherPages: {},
            }
            this.appendChild(TSP.utils.template(template))
            this.element = this.querySelector(`.${sheet.classes.main}`)

            this.headerContainer = this.querySelector(
                `.${sheet.classes.headerContainer}`
            )
            this.innerContainer = this.querySelector(
                `.${sheet.classes.innerContainer}`
            )
            this.contentContainer = this.querySelector(
                `.${sheet.classes.contentContainer}`
            )
            this.closeButton = this.querySelector(
                `.${sheet.classes.closeButton}`
            )
            this.titleElement = this.querySelector(
                `.${sheet.classes.h2Container} h2 .title`
            )
            this.subtitleElement = this.querySelector(
                `.${sheet.classes.h2Container} h2 .subtitle tsp-anchor`
            )

            this.closeButton.addEventListener(
                'click',
                this.closeClicked.bind(this)
            )
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
            TSP.state.set('Reader.component', this)
        }

        connectedCallback() {}

        currentUrlChanged(url) {
            if (url === '') {
                TSP.utils
                    .elementsTransitionHelper([this.element], {
                        classPrevious: 'enter',
                        classTransition: 'exit',
                        duration: TRANSITION_DURATION,
                    })
                return
            } else {
                // Delay entering, so we let the canvas3d transition happen first
                TSP.utils.timeoutPromise(ENTER_TRANSITION_DELAY)
                    .then(() => 
                        TSP.utils.elementsTransitionHelper([this.element], {
                            classPrevious: 'exit',
                            classTransition: 'enter',
                            duration: TRANSITION_DURATION,
                        })
                    )
                this.innerContainer.scrollTo({top: 0, behavior: 'smooth'});
            }
            
            if (this.contents.contributions[url]) {
                this.setContent(
                    this.contents.contributions[url]
                )
            } else if (this.contents.collaborators[url]) {
                this.setContent(
                    this.contents.collaborators[url]
                )
            } else if (this.contents.otherPages[url]) {
                this.setContent(this.contents.otherPages[url])
            } else {
                debugger
                this.setContent404()
            }
        }

        closeClicked() {
            TSP.utils.navigateTo('')
        }

        setContent(content) {
            const exitingContent = this.querySelectorAll(`.${sheet.classes.content}`)
            
            const enteringContent = document.createElement('div')
            enteringContent.classList.add(sheet.classes.content)
            enteringContent.innerHTML = content.html

            TSP.utils
                .elementsTransitionHelper(exitingContent, {
                    classPrevious: 'enter',
                    classTransition: 'exit',
                    duration: TRANSITION_DURATION,
                })
                .then((exitingContent) => {
                    exitingContent.forEach(element => element.remove())

                    this.titleElement.innerHTML = content.title
                    this.subtitleElement.innerHTML = content.subtitle
                    this.subtitleElement.href = content.subtitleUrl

                    this.contentContainer.appendChild(enteringContent)
                    return TSP.utils.waitAtleast(
                        PAGE_TRANSITION_DURATION - 2 * TRANSITION_DURATION, 
                        TSP.utils.allImagesLoaded(enteringContent)
                    )
                })
                .then(() => 
                    TSP.utils.elementsTransitionHelper([enteringContent], {
                        classTransition: 'enter',
                        duration: TRANSITION_DURATION,
                    })
                )
        }

        setContent404() {
            this.titleElement.innerHTML = 'Page not found'
            this.element.classList.add('enter')
        }

        load() {
            const contributions = TSP.config.get('contributions')
            const collaborators = TSP.config.get('collaborators')
            const otherPages = TSP.config.get('otherPages')

            const loadContributionsPromise = this.loadContent(
                'contributions',
                contributions
            )
            const loadCollaboratorsPromise = this.loadContent(
                'collaborators',
                collaborators
            )
            const loadOtherPagesPromise = this.loadContent(
                'otherPages',
                otherPages
            )

            Promise.all([
                loadContributionsPromise,
                loadCollaboratorsPromise,
                loadOtherPagesPromise,
            ]).then(() => {
                TSP.state.set('Reader.loaded', true)
            })
        }

        loadContent(group, definitions) {
            return Promise.all(
                definitions.map((definition) =>
                    TSP.utils.fetch(definition.contentUrl)
                )
            ).then((contents) => {
                contents.forEach((html, i) => {
                    const definition = definitions[i]
                    this.contents[group][definition.url] = {
                        html: html,
                        title: definition.title,
                        subtitle: definition.subtitle,
                        subtitleUrl: definition.subtitleUrl,
                    }
                })
            })
        }
    }

    customElements.define('tsp-reader', Reader)
})()
