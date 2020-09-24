;(function() {

    const sheet = jss.default
        .createStyleSheet({
            main: {
                height: '100%',
                overflow: 'auto',
            }
        }).attach()
    
    class Reader extends HTMLDivElement {
        constructor() {
            super()
            this.classList.add(sheet.classes.main)
            this.contents = {}
            TSP.state.listen('App.currentUrl', this.updateContent.bind(this))
        }
    
        connectedCallback() {
            this.updateContent(TSP.state.get('App.currentUrl'))
        }

        updateContent(url) {
            if (this.contents[url]) {
                this.innerHTML = this.contents[url]
            }
        }

        load() {
            const self = this
            this.contents = {}
            const satelliteDefinitions = TSP.state.get('satellites.satellites')
            Promise.all(satelliteDefinitions.map(function(satelliteDefinition) {
                return TSP.utils.fetch(satelliteDefinition.contributionUrl)
            })).then(function(contents) {
                contents.forEach(function(html, i) {
                    self.contents[satelliteDefinitions[i].url] = html
                })
                TSP.state.set('Reader.loaded', true)
            })
        }
    }
    
    customElements.define('tsp-reader', Reader, {extends: 'div'})
    
    })()