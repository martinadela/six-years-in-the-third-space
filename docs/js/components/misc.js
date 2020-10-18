;(function () {
    class Anchor extends HTMLAnchorElement {
        constructor() {
            super()
            this.addEventListener('click', (e) => {
                e.preventDefault()
                TSP.utils.navigateTo(this.getAttribute('href'))
            })
        }
    }

    customElements.define('tsp-anchor', Anchor, { extends: 'a' })
})()
