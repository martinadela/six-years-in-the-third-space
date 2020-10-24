;(function () {
    const TRACKLIST = TSP.config.get('audioPlayer.trackList')

    class AudioPlayer extends HTMLElement {
        constructor() {
            super()
            this.element = document.createElement('audio')
            this.appendChild(this.element)
            this.currentTrack = 0
            this.setSource(TRACKLIST[this.currentTrack])
            TSP.state.listen(
                'App.playing',
                this.playingChanged.bind(this)
            )
            this.element.addEventListener('ended', this.onTrackEnded.bind(this))
        }

        setSource(sourceUrl) {
            this.element.src = sourceUrl
        }

        playingChanged(playing) {
            if (playing) {
                this.element.play()
            } else {
                this.element.pause()
            }
        }

        onTrackEnded() {
            this.currentTrack = (this.currentTrack + 1) % TRACKLIST.length
            this.setSource(TRACKLIST[this.currentTrack])
            this.element.play()
        }
    }

    customElements.define('tsp-audio-player', AudioPlayer)
})()