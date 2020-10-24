;(function () {
    const COLOR_HIGHLIGHT1 = TSP.config.get('styles.colors.Highlight1')

    const sheet = jss.default
        .createStyleSheet({
            main: {
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                '&.hideNextPrevious': {
                    '& $nextPreviousButton': {
                        opacity: 0,
                        pointerEvents: 'none',
                    }
                }
            },
            nextPreviousButton: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer',
                pointerEvents: 'initial',
                '& svg': {
                    '& path': {
                        stroke: COLOR_HIGHLIGHT1,
                        fill: 'none',
                    }
                },
                '&:first-child': {
                    '& svg': {
                        transform: 'rotate(180deg)'
                    }
                }
            },
            innerContainer: {
                flex: 1,
            },
        })
        .attach()
    
    const template = `
        <template id="SatelliteViewer">
            <div class="${sheet.classes.nextPreviousButton}">${TSP.components.triangleSvg()}</div>
            <div class="${sheet.classes.innerContainer}"></div>
            <div class="${sheet.classes.nextPreviousButton}">${TSP.components.triangleSvg()}</div>
        </template>
    `

    class SatelliteViewer extends HTMLElement {
        constructor() {
            super()
            this.element = document.createElement('div')
            this.appendChild(this.element)
            this.element.classList.add(sheet.classes.main)
            this.element.appendChild(TSP.utils.template(template))

            this.previousButton = this.querySelector(`.${sheet.classes.nextPreviousButton}:first-child`)
            this.nextButton = this.querySelector(`.${sheet.classes.nextPreviousButton}:last-child`)

            this.previousButton.addEventListener('click', this.onPreviousClick.bind(this), false)
            this.nextButton.addEventListener('click', this.onNextClick.bind(this), false)
        }

        onPreviousClick() {
            const state = this.getCurrentState()
            const previous = (state.current - 1) < 0 ? (state.contributions.length - 1) : (state.current - 1)
            const previousContribution = state.contributions[previous]
            TSP.utils.navigateTo(previousContribution.url)
        }

        onNextClick() {
            const state = this.getCurrentState()
            const next = (state.current + 1) % state.contributions.length
            const nextContribution = state.contributions[next]
            TSP.utils.navigateTo(nextContribution.url)
        }

        getCurrentState() {
            const currentUrl = TSP.state.get('App.currentUrl')
            const contributions = TSP.config.get('contributions')
            const currentIndex = _.findIndex(contributions, (contribution) => contribution.url === currentUrl)
            return {
                contributions: contributions,
                current: currentIndex || 0
            }
        }
    }

    customElements.define('tsp-satellite-viewer', SatelliteViewer)
})()