;(function () {
    const NEBULA_COLOR1 = [235, 194, 226]
    const NEBULA_COLOR2 = [255, 199, 149]
    const NEBULA_GRADIENT = `linear-gradient(17deg, rgba(255,255,255,0.5) 0%, rgba(${NEBULA_COLOR1[0]},${NEBULA_COLOR1[1]},${NEBULA_COLOR1[2]},0.35) 40%, rgba(${NEBULA_COLOR2[0]},${NEBULA_COLOR2[1]},${NEBULA_COLOR2[2]},0.35) 60%, rgba(255,255,255,0.5) 100%)`

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
                ContentBackground: 'rgba(255, 255, 255, 0.0)',
                ButtonBackground: 'rgba(255, 255, 255, 0.9)',
                ScrollbarBackground: 'transparent',
                ScrollbarBorder: 'white',
                Scrollbar: '#F7903C',
                Text: 'rgb(112, 109, 109)',
                TextBold: 'rgb(19, 18, 18)',
                H2: 'rgb(25, 233, 53)',
                Loader: '#3DA6FC',
                LoaderBackground: NEBULA_GRADIENT,
                SideBarBackground: NEBULA_GRADIENT,
            },
            spacings: {
                size2: '2rem',
                size1: '1rem',
            },
            dimensions: {
                borderThickness: '4px',
                buttonSize: '4rem',
            },
            fontSizes: {
                desktop: 14,
            },
            fontFamilies: {
                title: "'Cormorant Infant', serif",
                normal: "'Archivo', sans-serif",
            },
            zIndexes: {
                reader: 1,
                topButtons: 5,
                sideBar: 10,
            },
            mobile: {
                width: STYLES_MOBILE_THRESHOLD.width,
                height: STYLES_MOBILE_THRESHOLD.height,
                mediaQuery: `@media screen and (max-width: ${STYLES_MOBILE_THRESHOLD.width}px) , screen and (max-height: ${STYLES_MOBILE_THRESHOLD.height}px)`,
            },
            isMobile: () => {
                const windowDimensions = TSP.state.get('window.dimensions')
                return windowDimensions.x < TSP.config.get('styles.mobile.width') || windowDimensions.y < TSP.config.get('styles.mobile.height')
            }
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
                NEBULA_COLOR1,
                NEBULA_COLOR2,
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
                url: '/contributions/theskymovedcitytocity',
                satelliteModelUrl: '/satellites/satellite2.glb',
                contentUrl: '/pages/contributions/theskymovedcitytocity.html',
            },
            {
                url: '/contributions/fromheretothere',
                satelliteModelUrl: '/satellites/satellite3.glb',
                contentUrl: '/pages/contributions/fromheretothere.html',
            },
            {
                url: '/contributions/elaborately-collaborating-and-working-together',
                satelliteModelUrl: '/satellites/satellite4.glb',
                contentUrl: '/pages/contributions/elaborately-collaborating-and-working-together.html',
            },

            {
                url: '/contributions/collaborating-as-a-multiplicity–a-dialogue-with-other-dialogues',
                satelliteModelUrl: '/satellites/satellite5.glb',
                contentUrl: '/pages/contributions/collaborating-as-a-multiplicity–a-dialogue-with-other-dialogues.html',
            },

            {
                url: '/contributions/what-keeps-us-going',
                satelliteModelUrl: '/satellites/satellite6.glb',
                contentUrl: '/pages/contributions/what-keeps-us-going.html',
            },

            {
                url: '/contributions/supradigm',
                satelliteModelUrl: '/satellites/satellite7.glb',
                contentUrl: '/pages/contributions/supradigm.html',
            },

            {
                url: '/contributions/SAFE_R_Evolving-the-Conditions-for-Collaboration-Or-From-Safer-Spaces-to-Safer-People',
                satelliteModelUrl: '/satellites/satellite8.glb',
                contentUrl: '/pages/contributions/ALI.html'
                
            },


        ],

        collaborators: [
            {
                url: '/collaborators/Vidha-Saumya',
                contentUrl: '/pages/collaborators/Vidha-Saumya.html',
            },

            {
                url: '/collaborators/Marten-Esko',
                contentUrl: '/pages/collaborators/Marten-Esko.html',
            },

            {
                url: '/collaborators/Marko-Timlin',
                contentUrl: '/pages/collaborators/Marko-Timlin.html',
            },

            {
                url: '/collaborators/Tina-Madsen',
                contentUrl: '/pages/collaborators/Tina-Madsen.html',
            },

            {
                url: '/collaborators/Diana-Soria',
                contentUrl: '/pages/collaborators/Diana-Soria.html',
            },

            {
                url: '/collaborators/Adrian-Balseca',
                contentUrl: '/pages/collaborators/Adrian-Balseca.html',
            },
            {
                url: '/collaborators/Ali-Akbar-Mehta',
                contentUrl: '/pages/collaborators/Ali-Akbar-Mehta.html',
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
            desktopWidth: 30, // in percents
            mobileWidth: 50, // in percents
            textRollDuration: 20, // in seconds
            textRolling:
                'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.  What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },

        reader: {
            mobileTitleWidth: 50, // in percents
        },

        pageFrame: {
            paddingDesktop: '2.5rem',
            paddingMobile: '1rem',
        }
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
