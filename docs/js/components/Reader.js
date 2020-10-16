;(function () {
    const HIGHLIGHT_COLOR1 = TSP.config.get('styles.colors.Highlight1')
    const BACKGROUND_COLOR = TSP.config.get('styles.colors.ContentBackground')
    const COLOR_TEXT_BOLD = TSP.config.get('styles.colors.TextBold')
    const TRANSITION_DELAY = TSP.config.get('transitions.duration') * TSP.config.get('transitions.reader')[0]
    const TRANSITION_DURATION = TSP.config.get('transitions.duration') * TSP.config.get('transitions.reader')[1]
    const sheet = jss.default
        .createStyleSheet({
            main: {
                height: '100%',
                // necessary to show the button
                overflow: 'visible',
                // To allow positioning of button
                position: 'relative',
                // Transitions
                transition: `opacity ${TRANSITION_DURATION}ms ease-in-out ${TRANSITION_DELAY}ms`,
                opacity: 0,
                '&.enter': {
                    opacity: 1,
                    // PageFrame disable pointer events to let control to orbit controls, 
                    // so we need to reactivate it here
                    pointerEvents: 'initial',
                },
                '&.exit': {
                    transition: `opacity ${TRANSITION_DURATION}ms ease-in-out 0ms`,
                },
            },
            contributionContainer: {
                backgroundColor: BACKGROUND_COLOR,
                padding: '1em',
                height: '100%',
                overflow: 'auto',
            },
            closeButton: {
                position: 'absolute',
                cursor: 'pointer',
                height: '4rem',
                width: '4rem',
                transform: 'translate(-50%, -50%)',
                backgroundColor: BACKGROUND_COLOR,
                border: `solid ${TSP.config.get('styles.dimensions.borderThickness')} ${HIGHLIGHT_COLOR1}`,
                color: HIGHLIGHT_COLOR1,
                borderRadius: '2rem',
                fontSize: '200%',
            },
            contributionBody: {
                textAlign: 'justify',

                '& p': {
                    marginBottom: '1em',
                    textAlign: 'justify',
                },

                '& h2': {
                    marginBottom: '0em',
                    marginTop: '1em',
                    '& .subtitle': {
                        fontSize: "80%",
                        marginBottom: "2em",
                    },
                },

                '& .textcontent': {
                    textAlign: "left",
                },

                '& .poemparagraph': {
                    textAlign: 'left',
                },

                '& .note': { 
                    position: 'relative',
                    top: '-0.5em', 
                },

                '& .fullwidthimage': {
                    '& img': {
                        width: '100%',
                        marginTop: '1em',
                        marginBottom: '1em',    
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
            }
        })
        .attach()

        const template = `
            <template id="Reader">
                <button class="${sheet.classes.closeButton}">X</button>
                <div class="${sheet.classes.contributionContainer}">
                    <div class="${sheet.classes.contributionBody}"></div>
                </div>
            </template>
        `

    class Reader extends HTMLDivElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            this.contents = {}
            this.appendChild(TSP.utils.template(template))
            
            this.contributionBody = this.querySelector(`.${sheet.classes.contributionBody}`)
            this.closeButton = this.querySelector(`.${sheet.classes.closeButton}`)

            this.closeButton.addEventListener('click', this.closeClicked.bind(this))
            TSP.state.listen(
                'App.currentUrl',
                this.currentUrlChanged.bind(this)
            )
        }

        connectedCallback() {
            this.currentUrlChanged(TSP.state.get('App.currentUrl'))
        }

        currentUrlChanged(url) {
            if (url === '') {
                this.classList.remove('enter')
                this.classList.add('exit')
            } else if (this.contents[url]) {
                this.contributionBody.innerHTML = this.contents[url].html
                this.classList.add('enter')
                this.classList.remove('exit')
            }
        }

        closeClicked() {
            TSP.utils.navigateTo('')
        }

        load() {
            const self = this
            this.contents = {}
            const contributions = TSP.config.get('contributions')
            Promise.all(
                contributions.map((contribution) => {
                    return TSP.utils.fetch(contribution.contentUrl)
                })
            ).then((contents) => {
                contents.forEach((html, i) => {
                    self.contents[contributions[i].url] = { 
                        html: html,
                        title: contributions[i].title
                    }
                })
                TSP.state.set('Reader.loaded', true)
            })
        }
    }

    customElements.define('tsp-reader', Reader, { extends: 'div' })
})()
