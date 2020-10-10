;(function () {
    const sheet = jss.default
        .createStyleSheet({
            main: {
                height: '100%',
                overflow: 'auto',
            },
        })
        .attach()

    class Reader extends HTMLDivElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            this.contents = {}
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
                this.innerHTML = ''
            } else if (this.contents[url]) {
                this.innerHTML = this.contents[url]
            }
        }

        load() {
            const self = this
            this.contents = {}
            const satelliteDefinitions = TSP.config.get('satellites.satellites')
            Promise.all(
                satelliteDefinitions.map((satelliteDefinition) => {
                    return TSP.utils.fetch(satelliteDefinition.contributionUrl)
                })
            ).then((contents) => {
                contents.forEach((html, i) => {
                    self.contents[satelliteDefinitions[i].url] = html
                })
                TSP.state.set('Reader.loaded', true)
            })
        }
    }

    customElements.define('tsp-reader', Reader, { extends: 'div' })
})()
