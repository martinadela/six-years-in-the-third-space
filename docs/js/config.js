;(function () {
    const NEBULA_COLOR1 = [235, 194, 226] // Pink
    const NEBULA_COLOR2 = [255, 199, 149] // Orange
    const NEBULA_GRADIENT = `linear-gradient(17deg, rgba(255,255,255,0.5) 0%, rgba(${NEBULA_COLOR1[0]},${NEBULA_COLOR1[1]},${NEBULA_COLOR1[2]},0.35) 40%, rgba(${NEBULA_COLOR2[0]},${NEBULA_COLOR2[1]},${NEBULA_COLOR2[2]},0.35) 60%, rgba(255,255,255,0.5) 100%)`

    const COLOR_HIGHLIGHT1 = '#FA8802'
    const COLOR_H2 = `#FA8802`
    const COLOR_TEXT = 'rgb(112, 109, 109)'

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
            reader: [0.8, 0.2],
            hudDuration: 200,
            sidebarDuration: 200,
        },
        app: {
            // Must not have trailing slash
            rootUrl: '',
        },
        styles: {
            colors: {
                Highlight1: COLOR_HIGHLIGHT1, // dark blue sky
                // Highlight1: '#FF8575', // orange
                Links: COLOR_TEXT,
                Border: COLOR_HIGHLIGHT1,
                ContentBackground: [255, 255, 255],
                ButtonBackground: 'rgba(255, 255, 255, 0.65)',
                ScrollbarBackground: 'transparent',
                ScrollbarBorder: 'LightGrey',
                Scrollbar: COLOR_HIGHLIGHT1,
                Text: COLOR_TEXT,
                TextBold: 'rgb(19, 18, 18)',
                H2: COLOR_H2,
                H2Subtitle: COLOR_H2,
                Loader: COLOR_HIGHLIGHT1,
                LoaderBackground: NEBULA_GRADIENT,
                SideBarBackground: NEBULA_GRADIENT,
            },
            spacings: {
                size2: '2rem',
                size1: '1rem',
                contentVerticalPadding: '1rem',
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
            desktop: {
                mediaQuery: `@media screen and (min-width: ${STYLES_MOBILE_THRESHOLD.width}px) and (min-height: ${STYLES_MOBILE_THRESHOLD.height}px)`,
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
            spotIntensity: 0,
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
            rotationAngleStep: (Math.PI / 2) * 0.0002,
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
            focusOnUrl: '/third-space-collective',
            rotationAngleStep: (Math.PI / 2) * 0.001,
            color1: [250, 250, 250],
            color2: [240, 240, 240],
        },
        satellites: {
            planetaryRotationAxisRandomness: Math.PI * 0,
            planetaryRotationRadius: [100, 10],
            planetaryRotationAngleStep: [(Math.PI / 2) * 0.0005, (Math.PI / 2) * 0.0001],
            selfRotationIncrement: [0.003, 0.0015],
            // Hover detection is executed only every N frames :
            hoverDetectDebounce: 4,
        },
        contributions: [
            {
                url: '/contributions/theskymovedcitytocity',
                satelliteModelUrl: '/satellites/satellite2.glb',
                contentUrl: '/pages/contributions/theskymovedcitytocity.html',
                title: 'The Sky Moved City to City',
                subtitle: 'Vidha Saumya',
                subtitleUrl: '/collaborators/Vidha-Saumya'
            },
            {
                url: '/contributions/fromheretothere',
                satelliteModelUrl: '/satellites/satellite3.glb',
                contentUrl: '/pages/contributions/fromheretothere.html',
                title: 'From Here to There',
                subtitle: 'Marko Timlin',
                subtitleUrl: '/collaborators/Marko-Timlin',
                
            },
            {
                url: '/contributions/elaborately-collaborating-and-working-together',
                satelliteModelUrl: '/satellites/satellite4.glb',
                contentUrl: '/pages/contributions/elaborately-collaborating-and-working-together.html',
                title: 'elaborately collaborating and working together',
                subtitle: 'Marten Esko',
                subtitleUrl: '/collaborators/Marten-Esko',
                
            },

            {
                url: '/contributions/collaborating-as-a-multiplicity-a-dialogue-with-other-dialogues',
                satelliteModelUrl: '/satellites/satellite5.glb',
                contentUrl: '/pages/contributions/collaborating-as-a-multiplicity–a-dialogue-with-other-dialogues.html',
                title: 'Collaborating as a Multiplicity – A Dialogue With Other Dialogues',
                subtitle: 'Tina Mariane Krogh Madsen',
                subtitleUrl: '/collaborators/Tina-Madsen',
                
            },

            {
                url: '/contributions/what-keeps-us-going',
                satelliteModelUrl: '/satellites/satellite6.glb',
                contentUrl: '/pages/contributions/what-keeps-us-going.html',
                title: 'What keeps us going',
                subtitle: 'Diana Soria',
                subtitleUrl: '/collaborators/Diana-Soria',
                
            },

            {
                url: '/contributions/supradigm',
                satelliteModelUrl: '/satellites/satellite7.glb',
                contentUrl: '/pages/contributions/supradigm.html',
                title: 'SUPRADIGM/SUPRADIGMA',
                subtitle: 'Adrián Balseca',
                subtitleUrl: '/collaborators/Adrian-Balseca',
                
            },

            {
                url: '/contributions/SAFE_R_Evolving-the-Conditions-for-Collaboration-Or-From-Safer-Spaces-to-Safer-People',
                satelliteModelUrl: '/satellites/satellite8.glb',
                contentUrl: '/pages/contributions/ALI.html',
                title: 'SAFE{R}: Evolving the Conditions for Collaboration Or From ‘Safer Spaces’ to ‘Safer People’',
                subtitle: 'Ali Akbar Mehta',
                subtitleUrl: '/collaborators/Ali-Akbar-Mehta',
                
                
            },

            {
                url: '/contributions/rec-on-org',
                satelliteModelUrl: '/satellites/satellite9.glb',
                contentUrl: '/pages/contributions/rec-on.org.html',
                title: 're-con.org',
                subtitle: 'Antye Greie Ripatti',
                subtitleUrl: '/collaborators/Antye-Greie-Ripatti',
                
                
            },

            {
                url: '/contributions/Stuff-asking-stuff-Stuff-of-stuff-Stuff-about-stuff-Inside-out-stuff-Vital-stuff-inside-and-outside',
                satelliteModelUrl: '/satellites/satellite10.glb',
                contentUrl: '/pages/contributions/kraamtext.html',
                title: ' Stuff asking stuff / Stuff of stuff / Stuff about stuff / Inside out stuff / Vital stuff* inside and outside',
                subtitle: 'Minna Hint & Killu Sukmit (Kraam Art Space)',
                subtitleUrl: '/collaborators/kraam',
                
            },

            {
                url: '/contributions/Venyvat-Huoneet-Stretchy-Rooms',
                satelliteModelUrl: '/satellites/satellite11.glb',
                contentUrl: '/pages/contributions/Stretchy-Rooms.html',
                title: 'Venyvät huoneet / Stretchy Rooms',
                subtitle: 'Juulia Terho & Milja-Maaria Terho',
                subtitleUrl: '/collaborators/Juulia-Terho-Milja-Maaria-Terho',
                
            },

            {
                url: '/contributions/Mythological-Migrations-On-Collaboration-Organization-and-Production',
                satelliteModelUrl: '/satellites/satellite12.glb',
                contentUrl: '/pages/contributions/Mythological-Migrations.html',
                title: 'Mythological Migrations: On Collaboration, Organization, and Production',
                subtitle: 'Abdullah Qureshi & Danai Anagnostou',
                subtitleUrl: '/collaborators/Abdullah-Qureshi-Danai-Anagnostou',
            },

            {
                url: '/contributions/Terms-Conditions-What-do-we-need-in-order-to-work-together',
                satelliteModelUrl: '/satellites/satellite13.glb',
                contentUrl: '/pages/contributions/Terms-Conditions.html',
                title: 'Terms & Conditions: What do we need in order to work together?',
                subtitle: 'Feminist Culture House',
                subtitleUrl: '/collaborators/Feminist-Culture-House',
            },

            {
                url: '/contributions/Reading-as-collaboration-deconstructing-single-narratives-and-the-myth-of-the-individual',
                satelliteModelUrl: '/satellites/satellite14.glb',
                contentUrl: '/pages/contributions/Reading-as-collaboration.html',
                title: 'Reading as collaboration: deconstructing single narratives and the myth of the individual',
                subtitle: 'Yvonne Billimore',
                subtitleUrl: '/collaborators/Yvonne-Billimore',
                
            },

            {
                url: '/contributions/RSVP-Letters-and-Dates-between-Spaces',
                satelliteModelUrl: '/satellites/satellite15.glb',
                contentUrl: '/pages/contributions/RSVP.html',
                title: 'RSVP - Letters and Dates between Spaces',
                subtitle: 'RSVP - Letters and Dates between Spaces is a durational project between Third Space and Iida Nissinen, Laura Rämö, Tuisku Lehto, and Oona Heinänen: a group working within the QUERQ community.',
                subtitleUrl: 'collaborators/Iida Nissinen-Tuisku Lehto-Laura Rämö-Oona Heinänen-QUERQ',
                
                
            },

            {
                url: '/contributions/speaker',
                satelliteModelUrl: '/satellites/speaker.glb',
                contentUrl: '/pages/contributions/RSVP.html',
                title: 'Reading as collaboration: deconstructing single narratives and the myth of the individual',
                subtitle: 'Yvonne Billimore',
                subtitleUrl: '/collaborators/Yvonne-Billimore',
                
                
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

            {
                url: '/collaborators/Antye-Greie-Ripatti',
                contentUrl: '/pages/collaborators/Antye-Greie-Ripatti.html',
            },

            {
                url: '/collaborators/kraam',
                contentUrl: '/pages/collaborators/kraam.html',
            },
            {
                url: '/collaborators/Juulia-Terho-Milja-Maaria-Terho',
                contentUrl: '/pages/collaborators/Juulia-Terho-Milja-Maaria-Terho.html',
            },
            {
                url: '/collaborators/Abdullah-Qureshi-Danai-Anagnostou',
                contentUrl: '/pages/collaborators/Abdullah-Qureshi-Danai-Anagnostou.html',
            },

            {
                url: '/collaborators/Feminist-Culture-House',
                contentUrl: '/pages/collaborators/Feminist-Culture-House.html',
            },

            {
                url: '/collaborators/Yvonne-Billimore',
                contentUrl: '/pages/collaborators/Yvonne-Billimore.html',
            },

            {
                url: '/collaborators/Iida Nissinen-Tuisku Lehto-Laura Rämö-Oona Heinänen-QUERQ',
                contentUrl: '/pages/collaborators/Iida Nissinen-Tuisku Lehto-Laura Rämö-Oona Heinänen-QUERQ.html',
            },


           
            
        ],

        otherPages: [
            {
                url: '/book-index',
                contentUrl: '/pages/book-index.html',
            },
            {
                url: '/about-this-book',
                contentUrl: '/pages/about-this-book.html',
            },
            {
                url: '/third-space-collective',
                contentUrl: '/pages/third-space-collective.html',
            },
        ],

        sidebar: {
            desktopWidth: 30, // in percents
            mobileWidth: 50, // in percents
            textRollDuration: 1620, // in seconds
            textRolling:`  
                ***Cartography of 6 years at Third Space***
                Sepideh: So we're gonna start the conversation, what does (the) Third Space mean to us. Who wants to start?
                
                Ana: I can start. I wanted to share the thoughts I had in my mind after I decided to gather a group of people and do something with the space. Before Third Space I had this project with two friends, but that somehow never worked out. So, it is funny to say, but Third Space was actually born out of a failure. I had the feeling that this cannot fail, that I have to do something else. And that’s when I met Rosamaria, Chris and Juan. First, with Juan, it came to my mind to organize a night of concerts because, at that time, it was difficult to get a space to perform from one day to the other, in a spontaneous way. After we had this huge success with the first concert, the Sound Room was born. It was amazing that after the previous failure we could continue doing something meaningful: one could always invite an artist to perform and people would gather and have a good time. It gave me a lot of hope and that feeling of “WOW, did we just do that?” We were super excited to start something new and were just following our intuition, nothing else. We all had a clear idea that we can do something together, and so we joined forces and started Third Space. Imagine, that's a really cool thing to say, we went from failure to success, and that success was because of a group of people, not enabled by one person.
                
                Sepideh: That's very meaningful, what does it mean to you now?
                
                Ana: At the beginning I wanted to perform and visiblize the sound art and experimental music scenes. Later I realized there were a lot of people in need of a space, and so we decided to offer it to them. That is how this kind of a personal space became a public one. We opened it to everybody and that's when the work really started. There was a lot of passion involved, a lot of energy and a youthful attempt at creating something new and working with people.
                
                Third Space is a collectively created artwork. It is part of my family and I still feel that we can do great things together. It is also like home, where I can do something meaningful with friends, with likeminded people I care about. Being able to invite people to share their art and viewpoint has given me a lot of satisfaction, and also a lot of strength to continue making art and fighting for a more inclusive, respectful, and honest art scene. Third Space is a “place” where cultures meet and form a hybrid that becomes an entity in itself. In this sense I find it amazing to allocate culture outside the museums, and to make it available to the public free of charge.
                
                Rosamaría: Yes. What did Third Space mean at the beginning and what does it mean for me now? At the beginning it was very exciting because I met new people: being a foreigner, learning different things in a different country, finding people that I feel I can trust and there are good vibes... also we were Mexicans ⎼sorry but that for me was very important⎼ beyond that, it was a very nice experience to meet interesting people. It was very attractive for me at that moment to think of us like a gang that could do something together. On the other hand, it was a challenge because back then my skills in English were very poor. It was at times very frustrating not to be able to share my point of view directly with others, and there were misunderstandings about what I meant. But then, and still now, I am very thankful for the history we have as a collective, it gave me a lot of trust in myself by developing my language skills but also by fueling different kinds of ideas. 
                
                Third Space was also fascinating for me as a person who did not come from a formal artistic academic background. I was here with a lot of passion to do things in connection with art, culture and human rights. It was intriguing to notice how sometimes the speech that comes from people behind institutions is a bit rigid and based on theories that are impossible to fit in certain atmospheres. When I was reading the Third Space theory for the first time, I loved it. A theory of a space with hybrid identities, a place of possibilities... but then reality confronted us. At the end we are human beings with our own imaginaries, with our own prejudices, with our own pre-constructions and it was, I think, the breaking point for us: the confrontation with the unexpected. And precisely these confrontations made us understand that space is more than a theory. 
                
                Once somebody referred to the space with the term “motel, motel gallery”. I kept thinking I like this term. Perhaps we enabled a place that hosts different proposals and that especially accepts people that seek to erase the borders that separate us ⎼ although after all these years I believe this is not possible. We gave the space to somebody else and that person was responsible for returning the space in the same way he/she/they received it. It was so intense when we had a very full calendar and we only gave away and got back the keys;  and yet I am proud because we received over 50 projects. We gave space to a lot of artists and also the opportunity for spontaneous happenings. We together have provided a space for people, and now it is so sad that the space is closed because it is so small, and in this coronavirus situation we cannot organize live events. Now it is the time to think about our future as a collective and also what happens with the space if the current restrictions remain.
                So who wants to continue? 
                
                Sepideh: Thank you, do you want to continue Martina?
                
                Martina: When I first joined Third Space I was invited by two members that were already part of the collective for a long time. I remember I had visited the gallery on several occasions  before joining. I was really amazed by the content presented through the exhibitions and seminars in the space. They made me feel really motivated to join.
                
                I was looking for a community to work with: the idea of a collective always made sense to me, as in Latin America for many artists it was a great way to sustain a shared project. In a way I wanted to be part of something, I had just arrived in Finland and I was alone. I really wanted to work with people and create something together but I also wanted to know the Finnish art scene in depth and be able to understand it better.
                
                So that was my initial motivation to join, to build a shared project with people, It was very exciting. Nevertheless, at that particular moment there was a kind of rupture in the collective. I just joined in what seemed a breaking point between people and their points of view. That period was tough because it felt there was a deep fracture between ways of working and ways of being. For me it was challenging to integrate in these circumstances. It felt like two roads were opening up in front of us, and that I had to somehow choose a side. It was very complex to think of working together at that precise moment when a sense of unity was lost. During this time, conversations about whose voice is being heard, who is talking and who is listening in the collective were taking place.
                
                There started to be an awareness about the voices that spoke in relation to the voices that were silenced, and I think that that stayed with me for the whole journey here in the collective. The act of listening started to have an essential and urgent role in building back the relationships of trust inside the working group. To be active listeners furthermore allowed us to also learn from each other and be more involved in each other’s practice. Oh, there has been a huge process of growth over the way.
                
                Furthermore, we actively tried to think together in strategies that could make us really engage in collaboration with each other. Care not only for the shared projects but also for each one of us and our personal situations. It became essential that all hierarchies of labour inside the collective would be questioned and brought forward and that we could develop a more horizontal structure, where everyone would feel safe expressing themselves and sharing their ideas. It was quite challenging for a while to arrive at consensus, negotiate, and really learn to work as a team.
                
                Sepideh: Yes. 
                
                Martina: This whole process of learning and growth has been really important. I think we have finally arrived at a moment where the collective feels like a space for friendship. A space of trust. Beyond the work we've been doing all these years and the effort we have all made to push the space forward, it feels we all share a feeling of fulfillment and excitement about the future.
                
                So, it's been a really intense journey, from this rupture, to building this true connectivity between each other. We have worked so hard to commit, understand, and to listen to each other. It is beautiful to think of our role as listeners, and facilitators. I think this is so necessary in society, to have spaces that are open for the community and for others to occupy. This is also why it has been essential and primordial to keep the space free of charge for artists. We believe that with collective effort it is possible to maintain a space afloat without asking rent from artists. I have encountered people who run other artist-run spaces in Helsinki who have said they wish they could keep their space free of charge but they can’t. Well, it is possible and it is fair. Of course it takes commitment, but for us it has never made sense to have a space that would charge others to work or exhibit.  Artists need to be paid and acknowledged for their work, not the other way around. Culture as a network needs to exist through generosity between cultural actors. 
                
                To feel that a shared care exists for Third Space to become what we want it to become makes us feel hopeful for the work done. We know that if our internal dynamics are fruitful, we can offer better opportunities for others that want to use the space. It has been interesting to realize the role these four walls have had through the years. A place that has hosted action, conversation, reflection, hybrid manifestations of culture, and critical thinking. Yes, this aspect of critical thinking has always been essential. As the content shapes the space it inhabits, Third Space is what it is today because of the projects we have hosted. A space that is never neutral but always aware of the content is being promoted and its meaning and consequence. 
                
                As a collective, and as a group of individuals who come together, we echo our own cultures, and the places we come from, but we are simultaneously immersed in an exercise of building a hybrid culture together. In trying to build this shared project our intersubjectivities come to play a part in how we see the present and the future of the space. It is a great opportunity and also a big challenge.
                
                Third Space has been for me, an exercise of collective thinking, collective effort and collective intention. It has been a tool for change that is at the same time always changing within itself.  It has changed from what it started and we know it will continue changing in the future. So in the end, working in the collective has always involved negotiating change and also trying to sustain and push forward certain practices that work. I think it is important that cultural spaces are inherently flexible and are open to question themselves constantly in order to improve and evolve.
                
                Yes, I think that's a big virtue. So yeah, I feel grateful for all the phases we went through and now seeing how we have evolved together into this space for friendship, trust and work that exists today.
                
                Sepideh: Yes, I also recall several occasions in our history that it felt there was not much hope due to disagreements, it was incredibly hard to go forward. Failures and mistakes are not often publicly shared or discussed in the art scene, vulnerabilities and the most stressful part of the processes usually remain unspoken. There have been occasions in which we all felt vulnerable; particularly when crossing boundaries and at some point it went so extreme it created a crack in the surface of the collective.   
                
                Martina: And for you, Sepideh, how was it when you started, what was it that you were hoping for?
                
                Sepideh: It was in 2015 that I joined the collective, I had followed the activities of Third Space from a distance. I visited the space for the first time in 2013, when Ana had a concert. It was cool and the space was so small but so many people were squeezed inside. Then in 2015, I had my exhibition at Third Space. I asked Ana how one can become part of the collective, she said she can discuss it with the others. Apparently nobody disagreed and so I joined the collective. When I think about how Third Space was back then, and what it meant to me, it was to be part of something meaningful. It was not easy: to be an immigrant and not knowing how the art scene functioned and how one could exist in it. It really helped me to understand my own capacities in curating, collaboration, and advocacy work. Since joining Third Space I have been actively engaged in the politics of the art scene. Many conversations, events, and seminars happened in our space which were all aligned with the Third Space curatorial, practical, or theoretical framework. 
                 
                I could say my own experience within the collective was so different from what an outsider might have seen looking at all the activities happening in the space. It was where everything including concepts and theories, became more tangible: the conflict, fragility, and unity, all at the same time. Different ideologies, different practices, different backgrounds, different ways of doing, and different approaches even to the physical space. It became more and more clear to me that there were so many differences that those could easily create and ignite a conflict.
                 
                My overall experience within the collective, particularly in the past, has been learning and at the same time unlearning certain things. The fact that from theory to practice there is a huge gap is what I concretely learned from Third space. Sometimes theory is too far from action. How we can put our theories into action, this is what I am interested in our collective work. It is not disappointing, it is actually amazing to be pragmatic. 
                
                As you said, Martina, the ability to listen, and also failure in listening; whose voice is heard and whose is not, who speaks fluent English and who does not, through this dynamic one can learn a lot, and I did. The capacity of our collective has been fascinating, the possibility of getting to know everybody individually, and to establish friendships, without that I couldn’t continue. Getting to know each other takes time, and so does finding some sort of ground to work together. It is not easy and there are failures which makes it all harder. Despite all the difficulties, with trust and hard work we have made it possible.  
                 
                The identity of Third Space has been extremely hybrid, at times one could feel it is not possible to put all these patches together and move forward. There existed so many differences, some people were good in working with theoretical frameworks and philosophizing and some were good in practicalities and making actual (physical) work in the space. At times, it felt the balance was lost: of course voices of the people who were more into theory would prevail over the ones who would run the space. So, the ones who would take care of practicalities to repair the space, clean, and host the artists, were reduced to “not important” enough to be heard particularly in the collective’s decision making processes. 
                
                Nevertheless, we, together have done a massive work by hosting over three hundred events at Third Space, we got the “in between space” to come into reality. The trust we established amongst ourselves over time helped us to carry on and to improve our ways of working together. More importantly we have been there for the artists and other collaborators to incubate their ideas and projects in our space. This has been a collective work out of passion, a place of interest. We work voluntarily without wages and on top of that we pay the rent from our own pocket to support the artists whose practices are not part of the mainstream. Sometimes we receive a modest grant to pay the rent (partially) and buy equipment for everyone to use in the space.
                 
                What does Third Space mean to me now, is our collective, us, and of course hosting others and their ideas in our space, the failures and mistakes. It is the process of making and learning from each other and together.
                 
                Ana: Yeah, and you know, we are humans and it is impossible not to make mistakes. If we can just embrace failure, then we will always be strong.
                 
                Sepideh: Yeah, but what I did not expect was that the situation would reach such a vulnerable point that collaboration and sometimes friendship seemed to become difficult to hold on. It has been learning for me on how to repair, to recover, and to accept that it can happen with differences in ideologies.
                 
                Ana: It has also been a process of learning that sometimes collaboration is simply impossible. It is important to recognize how and when to work with others.
                 
                Sepideh: Also to compromise, compromising in what we do, how we do, and why we do it, has been always present until today, and will be in future as well.
                
                Elina: It is interesting to look back at the time I joined as I really didn't know what I was coming into. I joined shortly after Martina, who invited me, and who was actually the only member 
                
                I knew ⎼I had met Rosamaria a few times, but the rest I didn’t know at all. I still expected to be introduced into somehow defined working culture and order, but it soon became clear that I entered 
                
                at an exceptionally chaotic moment, and just about everything was open. Most elemental questions on the collective(’s) practices were on the table to be renegotiated just there and then. The whole deal 
                
                turned out to be something way more intimate than I had thought, and extremely engaging in ways beyond collegial collaboration. There was quite a bit of tension and anxiety there, not only in the aftermath 
                of the recent upheavals but also with tackling new conflicts. In the discussions, the health of the community or group often overrode the curatorial agenda in urgency. We had intense discussions on what actually 
                is a collective and what is a working group, how to differentiate the two, and which one would we be. 
                
                Right now I feel like within the collective something has really moved forward, there’s genuine befriending and healing in the atmosphere amongst us. Despite the partially very stressful journey, the experience 
                has turned out extremely important. After all, the very group we are now never sat down as friends and colleagues who wanted to create something together and came up with Third Space ⎼what the collective is today is a 
                result of a complicated chain of events. Like you have mentioned, we come from diverse places via different paths and approaches, both workwise and as individuals. Working together it has become evident: we are certainly 
                dealing with two entangled projects, one being the shaping and sustaining of a safer space for good internal relationships that nourish collaboration, and the second being the substantial work of co-creating and co-curating, 
                also together with other people, spaces, and organizers. Like said, our logic of operating is by principle non-hierarchical and non-institutional, it is also very elastic and organic, and this locks us in constant negotiations. 
                In this sense the openness that I was surprised about in the beginning has indeed remained. We recognize the fragility and fluidity of the concepts that define our statement: it must be regularly revised. 
                
                I guess that in the end, as you pointed out already, the engine that has kept Third Space running despite the struggles must really be the mutual will to learn from and with each other: approaching heterogeneity as a condition for growing. 
                While honest communication, respect, flexibility, sensitivity, and sense of responsibility should be essential in any form of collaboration, these notions are very relevant indeed for our statement and objective as an artist-run space and 
                cultural project that aims at fostering inclusivity and diversity. Third Space is  never going to be ready and, as we state, 
                its identity and thus its practice is transcultural: it too is many, and relative, and transmuting along with its members and makers. At the core, there is this idea of Third Space as an on-going project, both in theory and practice, as a 
                collective and within the art scene.`,
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
