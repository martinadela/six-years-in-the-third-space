;(function () {
    const COLOR_BACKGROUND = TSP.config.get('styles.colors.ContentBackground')
    const COLOR_HIGHLIGHT1 = TSP.config.get('styles.colors.Highlight1')
    const COLOR_BACKGROUND0 = `rgba(${COLOR_BACKGROUND[0]}, ${COLOR_BACKGROUND[1]}, ${COLOR_BACKGROUND[2]}, 0)`
    const COLOR_BACKGROUND1 = `rgba(${COLOR_BACKGROUND[0]}, ${COLOR_BACKGROUND[1]}, ${COLOR_BACKGROUND[2]}, 1)`
    const ENTER_TRANSITION_DELAY =
        TSP.config.get('transitions.duration') *
        TSP.config.get('transitions.reader')[0]
    const PAGE_TRANSITION_DURATION = TSP.config.get('transitions.duration')
    const TRANSITION_DURATION = 
        TSP.config.get('transitions.duration') *
        TSP.config.get('transitions.reader')[1]
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const Z_INDEX_INNER_CONTAINER = TSP.config.get('styles.zIndexes.reader')
    const Z_INDEX_TOP_BUTTONS = TSP.config.get('styles.zIndexes.topButtons')
    const GRADIENT_PADDING_TOP_DESKTOP = '20em'
    const GRADIENT_PADDING_TOP_MOBILE = '10em'
    const PAGE_FRAME_PADDING_DESKTOP = TSP.config.get('pageFrame.paddingDesktop')
    const PAGE_FRAME_PADDING_MOBILE = TSP.config.get('pageFrame.paddingMobile')
    const HEIGHT_HEADER = TSP.config.get('reader.headerHeight')
        
    const sheet = jss.default
        .createStyleSheet({
            main: {
                height: '100%',
                // necessary to show the button
                overflow: 'visible',
                // To allow positioning of buttons
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
            contentContainer: {
                padding: `0 ${PAGE_FRAME_PADDING_DESKTOP}`,
                [MOBILE_MEDIA_QUERY]: {
                    padding: `0 ${PAGE_FRAME_PADDING_MOBILE}`,
                }
            },
            scrollButton: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                cursor: 'pointer',
                textAlign: 'center',
                transition: `opacity 200ms ease-in-out`,
                opacity: 1,
                paddingBottom: '0.5rem',
                '&.hidden': {
                    opacity: 0
                },
                '@media (max-aspect-ratio: 1/1)': {
                    display: 'none'
                },
                '& svg': {
                    animation: '$blink 2s ease-in-out infinite',
                    transform: 'rotate(90deg)',
                    height: '5em',
                    width: 'auto',
                    '& path': {
                        fill: 'none',
                        stroke: COLOR_HIGHLIGHT1,
                        strokeWidth: '0.7px',
                    }
                }
            },
            '@keyframes blink': {
                '0%': {
                    opacity: 1,
                },
                '50%': {
                    opacity: 0,
                },
                '100%': {
                    opacity: 1,
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
                        <tsp-reader-header></tsp-reader-header>
                        <div class="${sheet.classes.scrollButton}">
                            ${TSP.components.triangleSvg()}
                        </div>
                        <div class="${sheet.classes.contentContainer}">
                            <tsp-reader-content></tsp-reader-content>
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

            this.readerHeader = this.querySelector('tsp-reader-header')

            this.innerContainer = this.querySelector(
                `.${sheet.classes.innerContainer}`
            )
            this.contentContainer = this.querySelector(
                `.${sheet.classes.contentContainer}`
            )
            this.closeButton = this.querySelector(
                `.${sheet.classes.closeButton}`
            )
            this.scrollButton = this.querySelector(`.${sheet.classes.scrollButton}`)

            this.closeButton.addEventListener(
                'click',
                this.closeClicked.bind(this)
            )
            this.scrollButton.addEventListener(
                'click',
                this.scrollButtonClicked.bind(this)
            )
            this.innerContainer.addEventListener('scroll', this.containerScrolled.bind(this))

            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
            TSP.state.set('Reader.component', this)
        }

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
                    this.contents.contributions[url],
                    true
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

        scrollButtonClicked() {
            this.innerContainer.scrollTo({
                top: this.innerContainer.getBoundingClientRect().height,
                behavior: 'smooth',
            })
        }

        containerScrolled() {
            // As soon as the container is scrolled once, we hide the scrollButton forever
            this.scrollButton.classList.add('hidden')
            // const offset = TSP.utils.getScrollOffset(
            //     this.innerContainer,
            //     this.innerContainer.querySelector('.background'),
            // )
            // if (offset !== 0) {
            //     this.scrollButton.classList.add('hidden')
            // } else {
            //     this.scrollButton.classList.remove('hidden')
            // }
        }

        setContent(content, hasNoSatellite) {
            const exitingContent = this.querySelector('tsp-reader-content')
            const enteringContent = document.createElement('tsp-reader-content')
            enteringContent.setHtml(content.html)
            this.readerHeader.setContent(content.title, content.subtitle, content.subtitleUrl, hasNoSatellite)

            // Since the scroll is not instant, we need to make sure that the camera movement is refreshed
            // once the scroll is over and all elements are in position.
            TSP.utils.smoothScrollTo(
                this.innerContainer,
                this.innerContainer.querySelector('.background'), 
                0, 
                () => TSP.state.get('Canvas3D.component').tspCamera.refresh()
            )

            exitingContent.exitTransition()
                .then(() => {
                    this.contentContainer.appendChild(enteringContent)
                    return TSP.utils.waitAtleast(
                        PAGE_TRANSITION_DURATION - 2 * TRANSITION_DURATION, 
                        TSP.utils.allImagesLoaded(enteringContent)
                    )
                })
                .then(() => 
                    enteringContent.enterTransition()
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
            Promise.all([
                this.loadContent(
                    'contributions',
                    contributions
                ),
                this.loadContent(
                    'collaborators',
                    collaborators
                ),
                this.loadContent(
                    'otherPages',
                    otherPages
                ),
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
