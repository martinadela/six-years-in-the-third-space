;(function () {
    const CONFIG = {
        debug: {
            state: false,
            satellites: false,
            camera: false,
        },
        app: {
            // Must not have trailing slash
            rootUrl: '',
        },
        styles: {
            colors: {
                Highlight1: '#00FF2E',
                ContentBackground: 'rgba(255, 255, 255, 0.9)',
                ScrollbarBackground: 'transparent',
                ScrollbarBorder: 'white',
                Scrollbar: '#00FF2E',
            },
            spacings: {
                size2: '2rem',
                size1: '1rem',
            },
            dimensions: {
                borderThickness: '4px',
            },
            fontSizes: {
                menu: '15%',
            },
            fontFamilies: {
                title: "'Cormorant Infant', serif",
                normal: "'Archivo', sans-serif",
            },
        },
        lights: {
            ambientColor: 0xffffff,
            ambientIntensity: 2,
            directColor: 0xffffff,
            directIntensity: 2 * Math.PI,
        },
        background: {
            // color: 0xcccccc,
            imageUrl: '/images/background.jpg',
        },
        camera: {
            fieldOfViewDegrees: 75,
            near: 0.1,
            far: 100,
            // Padding around the main scene on the index.
            // Given as a ratio of the size of the scene
            paddingRatio: 1,
        },
        planet: {
            radius: 14,
            color: 0xaaaaaa,
        },
        satellites: {
            planetaryRotationAxisRandomness: Math.PI * 0,
            planetaryRotationRadius: [25, 0.5],
            planetaryRotationAngleStep: (Math.PI / 2) * 0.002,
            selfRotationIncrement: [0.002, 0.002],
            // Size of the click / hover area for a satellite
            clickRadius: 4,
            // Hover detection is executed only every N frames :
            hoverDetectDebounce: 10,
        },
        contributions: [
            {
                url: '/contributions/bla',
                title: 'bla some title',
                satelliteModelUrl: '/satellites/satellite2.glb',
                contentUrl: '/pages/contributions/bla.html',
            },
            // {
            //     url: '/contributions/blo',
            //     title: 'blo some title',
            //     satelliteModelUrl: '/satellites/satellite3.glb',
            //     contentUrl: '/pages/contributions/blo.html',
            // },
            // {
            //     url: '/contributions/bli',
            //     title: 'bli some title',
            //     satelliteModelUrl: '/satellites/satellite4.glb',
            //     contentUrl: '/pages/contributions/bli.html',
            // },
            // {
            //     url: '/contributions/blu',
            //     title: 'blu some title',
            //     satelliteModelUrl: '/satellites/satellite5.glb',
            //     contentUrl: '/pages/contributions/blu.html',
            // },

            // {
            //     url: '/contributions/bla',
            //     title: 'bla some title',
            //     satelliteModelUrl: '/satellites/satellite2.glb',
            //     contentUrl: '/pages/contributions/bla.html',
            // },
            // {
            //     url: '/contributions/bli',
            //     title: 'bli some title',
            //     satelliteModelUrl: '/satellites/satellite4.glb',
            //     contentUrl: '/pages/contributions/bli.html',
            // },
            // {
            //     url: '/contributions/blu',
            //     title: 'blu some title',
            //     satelliteModelUrl: '/satellites/satellite5.glb',
            //     contentUrl: '/pages/contributions/blu.html',
            // },
            // {
            //     url: '/contributions/blo',
            //     title: 'blo some title',
            //     satelliteModelUrl: '/satellites/satellite3.glb',
            //     contentUrl: '/pages/contributions/blo.html',
            // },
            // {
            //     url: '/contributions/bla',
            //     title: 'bla some title',
            //     satelliteModelUrl: '/satellites/satellite2.glb',
            //     contentUrl: '/pages/contributions/bla.html',
            // },
            // {
            //     url: '/contributions/blo',
            //     title: 'blo some title',
            //     satelliteModelUrl: '/satellites/satellite3.glb',
            //     contentUrl: '/pages/contributions/blo.html',
            // },
            // {
            //     url: '/contributions/bli',
            //     title: 'bli some title',
            //     satelliteModelUrl: '/satellites/satellite4.glb',
            //     contentUrl: '/pages/contributions/bli.html',
            // },
            // {
            //     url: '/contributions/bla',
            //     title: 'bla some title',
            //     satelliteModelUrl: '/satellites/satellite2.glb',
            //     contentUrl: '/pages/contributions/bla.html',
            // },
            // {
            //     url: '/contributions/blu',
            //     title: 'blu some title',
            //     satelliteModelUrl: '/satellites/satellite5.glb',
            //     contentUrl: '/pages/contributions/blu.html',
            // },
            // {
            //     url: '/contributions/blo',
            //     title: 'blo some title',
            //     satelliteModelUrl: '/satellites/satellite3.glb',
            //     contentUrl: '/pages/contributions/blo.html',
            // },
            // {
            //     url: '/contributions/bli',
            //     title: 'bli some title',
            //     satelliteModelUrl: '/satellites/satellite5.glb',
            //     contentUrl: '/pages/contributions/bli.html',
            // },
            {
                url: '/contributions/blu',
                title: 'blu some title',
                satelliteModelUrl: '/satellites/satellite4.glb',
                contentUrl: '/pages/contributions/blu.html',
            },
        ],

    }

    TSP.config = {}

    TSP.config.get = (path) => {
        return TSP.utils.getOrThrow(CONFIG, path)
    }

    TSP.config.getRandomized = (path) => {
        const randomizationParams = TSP.config.get(path)
        return TSP.utils.randomizeValue(randomizationParams)
    }
})()
