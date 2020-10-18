;(function () {
    const STYLES_MOBILE_THRESHOLD = {
        width: 800,
        height: 550,
    }

    const CONFIG = {
        debug: {
            state: false,
            satellites: false,
            camera: false,
            universe: false,
            performance: false,
        },
        transitions: {
            duration: 2000,
            reader: [0.9, 0.1],
            hudDuration: 200,
            sidebarDuration: 200,
        },
        app: {
            // Must not have trailing slash
            rootUrl: '',
        },
        styles: {
            colors: {
                Highlight1: '#3DA6FC', // dark blue sky
                // Highlight1: '#FF8575', // orange
                ContentBackground: 'rgba(255, 255, 255, 0.9)',
                ScrollbarBackground: 'transparent',
                ScrollbarBorder: 'white',
                Scrollbar: '#F7903C',
                Text: 'rgb(112, 109, 109)',
                TextBold: 'rgb(19, 18, 18)',
                H2: 'rgb(25, 233, 53)',
            },
            spacings: {
                size2: '2rem',
                size1: '1rem',
            },
            dimensions: {
                borderThickness: '4px',
                sidebarDesktopWidth: 30,
            },
            fontSizes: {
                desktop: 14,
            },
            fontFamilies: {
                title: "'Cormorant Infant', serif",
                normal: "'Archivo', sans-serif",
            },
            mobile: {
                width: STYLES_MOBILE_THRESHOLD.width,
                height: STYLES_MOBILE_THRESHOLD.height,
                mediaQuery: `@media screen and (max-width: ${STYLES_MOBILE_THRESHOLD.width}px) , screen and (max-height: ${STYLES_MOBILE_THRESHOLD.height}px)`,
            },
        },
        lights: {
            ambientColor: 0xffffff,
            ambientIntensity: 0.5,
            directColor: 0xffffff,
            directIntensity: 4 * Math.PI,
            directPosition: new THREE.Spherical(0, 0, 0),
            spotIntensity: 400,
        },
        universe: {
            // 2 colors in RGB format.
            nebulaColors: [
                [235, 194, 226],
                [255, 199, 149],
            ],
            // Between 0 and 2
            starsQuantity: 1.7,
            // Color of the general filter of the sky color
            filterColor: [216, 211, 242],
            filterOpacity: 0.7,
            nebulaOpacity: 0.8,
            whiteCloudsIntensity: 0.1,
            rotationAngleStep: (Math.PI / 2) * 0.00015,
            radius: 10000,
        },
        camera: {
            fieldOfViewDegrees: 75,
            near: 0.1,
            far: 100000,
            // Padding around the main scene on the index.
            // Given as a ratio of the size of the scene
            paddingRatio: 0.0,
        },
        planet: {
            radius: 8,
            color: 0xaaaaaa,
            focusOnUrl: '/third-space',
        },
        satellites: {
            planetaryRotationAxisRandomness: Math.PI * 0,
            planetaryRotationRadius: [100, 10],
            planetaryRotationAngleStep: (Math.PI / 2) * 0.0005,
            selfRotationIncrement: [0.003, 0.0015],
            // Hover detection is executed only every N frames :
            hoverDetectDebounce: 10,
        },
        contributions: [
            {
                url: '/contributions/The-Sky-Moved-City-to-City',
                satelliteModelUrl: '/satellites/satellite2.glb',
                contentUrl:
                    '/pages/contributions/The-Sky-Moved-City-to-City.html',
            },
            // {
            //     url: '/contributions/3',
            //     satelliteModelUrl: '/satellites/satellite3.glb',
            //     contentUrl: '/pages/contributions/blo.html',
            // },
            // {
            //     url: '/contributions/4',
            //     satelliteModelUrl: '/satellites/satellite4.glb',
            //     contentUrl: '/pages/contributions/bli.html',
            // },
            // {
            //     url: '/contributions/5',
            //     satelliteModelUrl: '/satellites/satellite5.glb',
            //     contentUrl: '/pages/contributions/blu.html',
            // },
            // {
            //     url: '/contributions/6',
            //     satelliteModelUrl: '/satellites/satellite6.glb',
            //     contentUrl: '/pages/contributions/bla.html',
            // },
            // {
            //     url: '/contributions/7',
            //     satelliteModelUrl: '/satellites/satellite7.glb',
            //     contentUrl: '/pages/contributions/bli.html',
            // },
            // {
            //     url: '/contributions/9',
            //     satelliteModelUrl: '/satellites/satellite9.glb',
            //     contentUrl: '/pages/contributions/blu.html',
            // },

            // {
            //     url: '/contributions/blo',
            //     satelliteModelUrl: '/satellites/satellite3.glb',
            //     contentUrl: '/pages/contributions/blo.html',
            // },
            // {
            //     url: '/contributions/bla',
            //     satelliteModelUrl: '/satellites/satellite2.glb',
            //     contentUrl: '/pages/contributions/bla.html',
            // },
            // {
            //     url: '/contributions/blo',
            //     satelliteModelUrl: '/satellites/satellite3.glb',
            //     contentUrl: '/pages/contributions/blo.html',
            // },
            // {
            //     url: '/contributions/bli',
            //     satelliteModelUrl: '/satellites/satellite4.glb',
            //     contentUrl: '/pages/contributions/bli.html',
            // },
            // {
            //     url: '/contributions/bla',
            //     satelliteModelUrl: '/satellites/satellite2.glb',
            //     contentUrl: '/pages/contributions/bla.html',
            // },
            // {
            //     url: '/contributions/blu',
            //     satelliteModelUrl: '/satellites/satellite5.glb',
            //     contentUrl: '/pages/contributions/blu.html',
            // },
            // {
            //     url: '/contributions/blo',
            //     satelliteModelUrl: '/satellites/satellite3.glb',
            //     contentUrl: '/pages/contributions/blo.html',
            // },
            // {
            //     url: '/contributions/bli',
            //     satelliteModelUrl: '/satellites/satellite5.glb',
            //     contentUrl: '/pages/contributions/bli.html',
            // },
            // {
            //     url: '/contributions/blu',
            //     satelliteModelUrl: '/satellites/satellite4.glb',
            //     contentUrl: '/pages/contributions/blu.html',
            // },
        ],

        collaborators: [
            {
                url: '/collaborators/Marten-Esko',
                contentUrl: '/pages/collaborators/Marten-Esko.html',
            },
        ],

        otherPages: [
            {
                url: '/book-index',
                contentUrl: '/pages/book-index.html',
            },
            {
                url: '/about',
                contentUrl: '/pages/about.html',
            },
            {
                url: '/third-space',
                contentUrl: '/pages/third-space.html',
            },
        ],

        sidebar: {
            textRollDuration: 20, // in seconds
            textRolling:
                'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.  What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
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
