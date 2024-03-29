;(function () {
    const COLOR_TEXT_BOLD = TSP.config.get('styles.colors.TextBold')
    const COLOR_TEXT = TSP.config.get('styles.colors.Text')
    const TRANSITION_DURATION =
        TSP.config.get('transitions.duration') *
        TSP.config.get('transitions.reader')[1]
    const MOBILE_MEDIA_QUERY = TSP.config.get('styles.mobile.mediaQuery')
    const DESKTOP_MEDIA_QUERY = TSP.config.get('styles.desktop.mediaQuery')
    const FONT_FAMILY_TITLE = TSP.config.get('styles.fontFamilies.title')

    const sheet = jss.default
        .createStyleSheet({
            main: {
                textAlign: 'justify',
                margin: 'auto',
                maxWidth: '1000px',
                paddingBottom: '2em',
                fontSize: "125%",

                '& .fullwidthimage': {
                    '& img': {
                        width: '100%',
                        [MOBILE_MEDIA_QUERY]: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
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
                        },
                    },
                },

                '& p': {
                    marginBottom: '1em',
                    textAlign: 'justify',
                },

                '& .intro': {
                    fontWeight: 'bold',
                    marginBottom: '8em',
                },

                '& .bio': {
                    fontSize: '120%',
                    margin: '2em 0',
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
                    fontSize: '80%',
                },

                '& .footnotes': {
                    borderTop: `1px solid ${COLOR_TEXT}`,
                    paddingTop: '1em',
                    '& .index': {
                        fontWeight: 'bold',
                    }
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

                '& .image-with-side-caption': {
                    display: 'flex',
                    flexDirection: 'row',
                    [DESKTOP_MEDIA_QUERY]: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        '& > div': {
                            flex: 1,
                            width: '50%',
                            '&.imagecaption:last-child': {
                                textAlign: 'right',
                            },
                        },
                    },
                    [MOBILE_MEDIA_QUERY]: {
                        flexDirection: 'column-reverse',
                        '&.right': {
                            flexDirection: 'column',
                        }
                    }
                },

                '& .index-contribution': {
                    marginBottom: '1em',
                    fontSize: '120%',
                    textAlign: 'left',
                    fontFamily: FONT_FAMILY_TITLE,
                    '& .title': {
                        textTransform: 'uppercase',
                    },
                    '& .collaborator tsp-anchor': {
                        color: COLOR_TEXT,
                    }
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

    class ReaderContent extends HTMLElement {
        constructor() {
            super()
            this.element = document.createElement('div')
            this.element.classList.add(sheet.classes.main)
            this.currentTransition = null
        }

        connectedCallback() {
            this.appendChild(this.element)
        }

        setHtml(htmlStr) {
            this.element.innerHTML = htmlStr
        }

        exitTransition() {
            if (this.currentTransition) {
                this.currentTransition.cancel()
                this.currentTransition = null
            }
            this.currentTransition = TSP.utils
                .elementsTransitionHelper([this.element], {
                    classPrevious: 'enter',
                    classTransition: 'exit',
                    duration: TRANSITION_DURATION,
                })
            this.currentTransition.then(() => {
                    this.remove()
                    this.currentTransition = null
                })
            return this.currentTransition
        }

        enterTransition() {
            if (this.currentTransition) {
                this.currentTransition.cancel()
                this.currentTransition = null
            }
            this.currentTransition = TSP.utils.elementsTransitionHelper([this.element], {
                classTransition: 'enter',
                duration: TRANSITION_DURATION,
            })
            this.currentTransition.then(() => {
                this.currentTransition = null
            })
            return this.currentTransition
        }
    }

    customElements.define('tsp-reader-content', ReaderContent)
})()
