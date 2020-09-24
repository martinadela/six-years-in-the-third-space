;(function() {
const app = new TSP.components.App()

window.addEventListener('popstate', function(e) {
    TSP.state.set('App.currentUrl', document.location.pathname)
})

// TODO : remove urlRoot
TSP.utils.navigateTo(location.pathname)

})()