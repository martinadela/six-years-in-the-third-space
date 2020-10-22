;(function () {
    const COLOR_BACKGROUND = TSP.config.get('styles.colors.ContentBackground')
    const COLOR_TEXT_BOLD = TSP.config.get('styles.colors.TextBold')
    const ENTER_TRANSITION_DELAY =
        TSP.config.get('transitions.duration') *
        TSP.config.get('transitions.reader')[0]
    const PAGE_TRANSITION_DURATION = TSP.config.get('transitions.duration')
    const TRANSITION_DURATION = 
        TSP.config.get('transitions.duration') *
        TSP.config.get('transitions.reader')[1]
    const MOBILE_TITLE_WIDTH = TSP.config.get('reader.mobileTitleWidth')
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const DESKTOP_MEDIA_QUERY = TSP.config.get('styles.desktop.mediaQuery')
    const Z_INDEX_INNER_CONTAINER = TSP.config.get('styles.zIndexes.reader')
    const Z_INDEX_TOP_BUTTONS = TSP.config.get('styles.zIndexes.topButtons')
    const PAGE_FRAME_PADDING_MOBILE = TSP.config.get('pageFrame.paddingMobile')
    const VERTICAL_PADDING_CONTENT = TSP.config.get('styles.spacings.contentVerticalPadding')
    
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
                '& h2': {
                    [MOBILE_MEDIA_QUERY]: {
                        width: `${MOBILE_TITLE_WIDTH}%`,
                        // take the width available and remove page padding
                        height: `calc((100vw - ${MOBILE_TITLE_WIDTH}vw) - 2 * ${PAGE_FRAME_PADDING_MOBILE})`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'left',
                    },
                    marginBottom: '0em',
                    '& .subtitle': {
                        fontSize: '80%',
                        marginBottom: '2em',
                    },
                },
            },
            contentContainer: {
                '& .fullwidthimage': {
                    '& img': {
                        width: '100%',
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                },
                '&.contributions $contentContainer': {
                    textAlign: 'justify',

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
                },
                '&.collaborators $contentContainer': {
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
            innerContainer: {
                backgroundColor: COLOR_BACKGROUND,
                padding: VERTICAL_PADDING_CONTENT,
                [DESKTOP_MEDIA_QUERY]: {
                    // Smaller padding because of the scrollbar
                    paddingRight: '0.2em',
                },
                overflowY: 'scroll',
                height: '100%',
                // To position the satellite viewer
                position: 'relative',
                zIndex: Z_INDEX_INNER_CONTAINER
            },
            closeButton: {
                zIndex: Z_INDEX_TOP_BUTTONS
            },
            headerContainer: {
                display: 'flex',
                flexDirection: 'row',
                '& > *': {
                    flex: 1,
                },
                [DESKTOP_MEDIA_QUERY]: {
                    '& tsp-satellite-viewer': {
                        display: 'none'
                    }
                }
            }
        })
        .attach()

    const template = `
        <template id="Reader">
            <div class="${sheet.classes.main}">
                <tsp-top-page-button-container class="${sheet.classes.closeButton}">
                    <button>${TSP.components.crossSvg()}</button>
                </tsp-top-page-button-container>
                <div class="${sheet.classes.innerContainer}">
                    <div class="${sheet.classes.headerContainer}">
                        <h2></h2>
                        <tsp-satellite-viewer></tsp-satellite-viewer>
                    </div>
                    <div class="${sheet.classes.contentContainer}"></div>
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
            this.closeButton = this.querySelector(
                `.${sheet.classes.closeButton}`
            )
            this.h2 = this.querySelector(
                `.${sheet.classes.headerContainer} h2`
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
            }
            
            if (this.contents.contributions[url]) {
                this.setContent(
                    'contributions',
                    this.contents.contributions[url]
                )
            } else if (this.contents.collaborators[url]) {
                this.setContent(
                    'collaborators',
                    this.contents.collaborators[url]
                )
            } else if (this.contents.otherPages[url]) {
                this.setContent('otherPages', this.contents.otherPages[url])
            } else {
                debugger
                this.setContent404()
            }
        }

        closeClicked() {
            TSP.utils.navigateTo('')
        }

        setContent(className, content) {
            this.element.classList.remove('contributions')
            this.element.classList.remove('collaborators')
            this.element.classList.add(className)

            const exitingContentContainer = this.querySelectorAll(`.${sheet.classes.contentContainer}`)
            
            const enteringContentContainer = document.createElement('div')
            enteringContentContainer.classList.add(sheet.classes.contentContainer)
            enteringContentContainer.innerHTML = content.html

            TSP.utils
                .elementsTransitionHelper(exitingContentContainer, {
                    classPrevious: 'enter',
                    classTransition: 'exit',
                    duration: TRANSITION_DURATION,
                })
                .then((exitingContentContainer) => {
                    exitingContentContainer.forEach(element => element.remove())
                    this.setTitle(enteringContentContainer)
                    this.headerContainer.after(enteringContentContainer)
                    return TSP.utils.waitAtleast(
                        PAGE_TRANSITION_DURATION - 2 * TRANSITION_DURATION, 
                        TSP.utils.allImagesLoaded(enteringContentContainer)
                    )
                })
                .then(() => 
                    TSP.utils.elementsTransitionHelper([enteringContentContainer], {
                        classTransition: 'enter',
                        duration: TRANSITION_DURATION,
                    })
                )
        }

        setContent404() {
            this.h2.innerHTML = 'Page not found'
            this.element.classList.add('enter')
        }

        setTitle(enteringContentContainer) {
            const enteringH2 = enteringContentContainer.querySelector('h2')
            if (enteringH2) {
                this.h2.innerHTML = enteringH2.innerHTML
                enteringH2.remove()
            } else {
                this.h2.innerHTML = 'NO TITLE FOUND'
                console.error(`h2 not found in page`)
            }
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
                    this.contents[group][definitions[i].url] = {
                        html: html,
                    }
                })
            })
        }
    }

    customElements.define('tsp-reader', Reader)
})()
