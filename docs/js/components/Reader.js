;(function () {
    const HIGHLIGHT_COLOR1 = TSP.config.get('styles.colors.Highlight1')
    const BACKGROUND_COLOR = TSP.config.get('styles.colors.ContentBackground')
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
            contributionBody: {},
            contributionTitle: {},
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
        })
        .attach()

        const template = `
            <template id="Reader">
                <button class="${sheet.classes.closeButton}">X</button>
                <div class="${sheet.classes.contributionContainer}">
                    <h1 class="${sheet.classes.contributionTitle}"></h1>
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
            this.contributionTitle = this.querySelector(`.${sheet.classes.contributionTitle}`)
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
                this.contributionTitle.innerHTML = this.contents[url].title
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
