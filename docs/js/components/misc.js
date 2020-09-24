;(function() {

class Anchor extends HTMLAnchorElement {
    constructor() {
        super()
        this.addEventListener('click', function(e) {
            e.preventDefault()
            const url = TSP.state.state.get('app.rootUrl') + this.href
            history.pushState({}, '', url)
            TSP.state.set('app.currentUrl', document.location.pathname)
        })
    }
}

customElements.define('tsp-anchor', Anchor, { extends: 'a' })

})()