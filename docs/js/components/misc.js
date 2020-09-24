;(function() {

class Anchor extends HTMLAnchorElement {
    constructor() {
        super()
        this.addEventListener('click', function(e) {
            e.preventDefault()
            TSP.utils.navigateTo(this.href)
        })
    }
}

customElements.define('tsp-anchor', Anchor, { extends: 'a' })

})()