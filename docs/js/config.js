;(function () {
    const CONFIG = {
        debug: true,
        debugCamera: false,
        app: {
            // Must not have trailing slash
            rootUrl: '',
        },
        styles: {
            colors: {
                Green: '#00FF2E',
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
            satellites: [
                {
                    url: '/contributions/bla',
                    modelUrl: 'satellites/satellite2.glb',
                    contributionUrl: '/pages/contributions/bla.html',
                },
                // {
                //     url: '/contributions/blo',
                //     modelUrl: 'satellites/satellite3.glb',
                //     contributionUrl: '/pages/contributions/blo.html',
                // },
                // {
                //     url: '/contributions/bli',
                //     modelUrl: 'satellites/satellite4.glb',
                //     contributionUrl: '/pages/contributions/bli.html',
                // },
                // {
                //     url: '/contributions/blu',
                //     modelUrl: 'satellites/satellite5.glb',
                //     contributionUrl: '/pages/contributions/blu.html',
                // },

                // {
                //     url: '/contributions/bla',
                //     modelUrl: 'satellites/satellite2.glb',
                //     contributionUrl: '/pages/contributions/bla.html',
                // },
                // {
                //     url: '/contributions/bli',
                //     modelUrl: 'satellites/satellite4.glb',
                //     contributionUrl: '/pages/contributions/bli.html',
                // },
                // {
                //     url: '/contributions/blu',
                //     modelUrl: 'satellites/satellite5.glb',
                //     contributionUrl: '/pages/contributions/blu.html',
                // },
                // {
                //     url: '/contributions/blo',
                //     modelUrl: 'satellites/satellite3.glb',
                //     contributionUrl: '/pages/contributions/blo.html',
                // },
                // {
                //     url: '/contributions/bla',
                //     modelUrl: 'satellites/satellite2.glb',
                //     contributionUrl: '/pages/contributions/bla.html',
                // },
                // {
                //     url: '/contributions/blo',
                //     modelUrl: 'satellites/satellite3.glb',
                //     contributionUrl: '/pages/contributions/blo.html',
                // },
                // {
                //     url: '/contributions/bli',
                //     modelUrl: 'satellites/satellite4.glb',
                //     contributionUrl: '/pages/contributions/bli.html',
                // },
                // {
                //     url: '/contributions/bla',
                //     modelUrl: 'satellites/satellite2.glb',
                //     contributionUrl: '/pages/contributions/bla.html',
                // },
                // {
                //     url: '/contributions/blu',
                //     modelUrl: 'satellites/satellite5.glb',
                //     contributionUrl: '/pages/contributions/blu.html',
                // },
                // {
                //     url: '/contributions/blo',
                //     modelUrl: 'satellites/satellite3.glb',
                //     contributionUrl: '/pages/contributions/blo.html',
                // },
                // {
                //     url: '/contributions/bli',
                //     modelUrl: 'satellites/satellite5.glb',
                //     contributionUrl: '/pages/contributions/bli.html',
                // },
                // {
                //     url: '/contributions/blu',
                //     modelUrl: 'satellites/satellite4.glb',
                //     contributionUrl: '/pages/contributions/blu.html',
                // },
            ],
        },
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
