;(function() {
const app = new TSP.components.App()

window.addEventListener('popstate', function(e) {
    TSP.state.set('app.currentUrl', document.location.pathname)
})

})()