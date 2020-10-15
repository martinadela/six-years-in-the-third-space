;(function () {
    const CONFIG = {
        debug: {
            state: false,
            satellites: false,
            camera: false,
            universe: true,
        },
        transitions: {
            duration: 2000,
            reader: [0.9, 0.1],
            hudDuration: 200
        },
        app: {
            // Must not have trailing slash
            rootUrl: ''
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
            ambientIntensity: 1,
            directColor: 0xffffff,
            directIntensity: 0.5 * Math.PI,
            directPosition: new THREE.Spherical(0, 0, 0)
        },
        universe: {
            radius: 50000,
        },
        camera: {
            fieldOfViewDegrees: 75,
            near: 0.1,
            far: 100000,
            // Padding around the main scene on the index.
            // Given as a ratio of the size of the scene
            paddingRatio: 0.2,
        },
        planet: {
            radius: 8,
            color: 0xaaaaaa,
        },
        satellites: {
            planetaryRotationAxisRandomness: Math.PI * 0,
            planetaryRotationRadius: [60, 10],
            planetaryRotationAngleStep: (Math.PI / 2) * 0.0005,
            selfRotationIncrement: [0.002, 0.002],
            // Hover detection is executed only every N frames :
            hoverDetectDebounce: 10,
        },
        contributions: [
            {
                url: '/contributions/2',
                title: 'bla some title',
                satelliteModelUrl: '/satellites/satellite2.glb',
                contentUrl: '/pages/contributions/bla.html',
            },
            {
                url: '/contributions/3',
                title: 'blo some title',
                satelliteModelUrl: '/satellites/satellite3.glb',
                contentUrl: '/pages/contributions/blo.html',
            },
            // {
            //     url: '/contributions/4',
            //     title: 'bli some title',
            //     satelliteModelUrl: '/satellites/satellite4.glb',
            //     contentUrl: '/pages/contributions/bli.html',
            // },
            // {
            //     url: '/contributions/5',
            //     title: 'blu some title',
            //     satelliteModelUrl: '/satellites/satellite5.glb',
            //     contentUrl: '/pages/contributions/blu.html',
            // },
            // {
            //     url: '/contributions/6',
            //     title: 'bla some title',
            //     satelliteModelUrl: '/satellites/satellite6.glb',
            //     contentUrl: '/pages/contributions/bla.html',
            // },
            {
                url: '/contributions/7',
                title: 'bli some title',
                satelliteModelUrl: '/satellites/satellite7.glb',
                contentUrl: '/pages/contributions/bli.html',
            },
            {
                url: '/contributions/9',
                title: 'blu some title',
                satelliteModelUrl: '/satellites/satellite9.glb',
                contentUrl: '/pages/contributions/blu.html',
            },



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
            // {
            //     url: '/contributions/blu',
            //     title: 'blu some title',
            //     satelliteModelUrl: '/satellites/satellite4.glb',
            //     contentUrl: '/pages/contributions/blu.html',
            // },
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
