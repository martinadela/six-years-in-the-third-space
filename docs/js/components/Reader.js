;(function () {
    const COLOR_BACKGROUND = TSP.config.get('styles.colors.ContentBackground')
    const COLOR_TEXT_BOLD = TSP.config.get('styles.colors.TextBold')
    const TRANSITION_DELAY =
        TSP.config.get('transitions.duration') *
        TSP.config.get('transitions.reader')[0]
    const TRANSITION_DURATION =
        TSP.config.get('transitions.duration') *
        TSP.config.get('transitions.reader')[1]
    const sheet = jss.default
        .createStyleSheet({
            main: {
                height: '100%',
                // necessary to show the button
                overflow: 'visible',
                // To allow positioning of button
                position: 'relative',
                // Transitions
                transition: `opacity ${TRANSITION_DURATION}ms ease-in-out 0ms`,
                opacity: 0,
                '&.enter': {
                    transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
                    transitionDelay: `${TRANSITION_DELAY}ms`,
                    opacity: 1,
                    // PageFrame disable pointer events to let control to orbit controls,
                    // so we need to reactivate it here
                    pointerEvents: 'initial',
                },
                '&.contributions $contentContainer': {
                    textAlign: 'justify',

                    '& p': {
                        marginBottom: '1em',
                        textAlign: 'justify',
                    },

                    '& h2': {
                        marginBottom: '0em',
                        '& .subtitle': {
                            fontSize: '80%',
                            marginBottom: '2em',
                        },
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
            },
            innerContainer: {
                backgroundColor: COLOR_BACKGROUND,
                padding: '1em',
                height: '100%',
                overflow: 'auto',
            },
            closeButton: {},
            contentContainer: {
                '& .fullwidthimage': {
                    '& img': {
                        width: '100%',
                        marginTop: '1em',
                        marginBottom: '1em',
                    },
                },
            },
        })
        .attach()

    const template = `
        <template id="Reader">
            <div class="${sheet.classes.main}">
                <tsp-top-page-button-container class="${sheet.classes.closeButton}">
                    <button>X</button>
                </tsp-top-page-button-container>
                <div class="${sheet.classes.innerContainer}">
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

            this.contentContainer = this.querySelector(
                `.${sheet.classes.contentContainer}`
            )
            this.closeButton = this.querySelector(
                `.${sheet.classes.closeButton}`
            )

            this.closeButton.addEventListener(
                'click',
                this.closeClicked.bind(this)
            )
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        connectedCallback() {}

        currentUrlChanged(url) {
            this.element.classList.remove('contributions')
            this.element.classList.remove('collaborators')
            if (url === '') {
                this.element.classList.remove('enter')
            } else if (this.contents.contributions[url]) {
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
                this.setContent404()
            }
        }

        closeClicked() {
            TSP.utils.navigateTo('')
        }

        setContent(className, content) {
            this.contentContainer.innerHTML = content.html
            this.element.classList.add('enter')
            this.element.classList.add(className)
        }

        setContent404() {
            this.contentContainer.innerHTML = 'Page not found'
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
                    this.contents[group][definitions[i].url] = {
                        html: html,
                    }
                })
            })
        }
    }

    customElements.define('tsp-reader', Reader)
})()
