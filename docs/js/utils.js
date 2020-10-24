;(function () {
    TSP.utils = {}

    TSP.utils.timeoutPromise = (delay, value) => {
        let timeoutHandle = null
        const promise = new Promise((resolve) => {
            timeoutHandle = setTimeout(() => resolve(value), delay)
        })
        promise.cancel = () => {
            if (timeoutHandle !== null) {
                clearTimeout(timeoutHandle)
            }
        }
        return promise
    }

    TSP.utils.waitAtleast = (delay, promise) => {
        return TSP.utils.timeoutPromise(delay).then(() => promise)
    }

    TSP.utils.imgLoaded = (img) => {
        return new Promise((resolve) => {
            // This is also true if image responded with 404 or other error
            if (img.complete) {
                resolve(img)
                return
            }
            img.onload = () => resolve(img)
        })
    }

    TSP.utils.allImagesLoaded = (element) => {
        const allImages = element.querySelectorAll('img')
        // Fullfils too if `allImages` is empty
        return Promise.all(
            Array.prototype.map.call(allImages, TSP.utils.imgLoaded)
        )
    }

    TSP.utils.getScrollOffset = (
        scrollContainer,
        scrolledContent,
    ) =>
        scrollContainer.getBoundingClientRect().top - scrolledContent.getBoundingClientRect().top

    // REF : https://stackoverflow.com/a/55686711/312598
    TSP.utils.smoothScrollTo = (
        scrollContainer,
        scrolledContent,
        offset,
        callback
    ) => {
        const fixedOffset = (
            scrollContainer.getBoundingClientRect().top + offset
        ).toFixed()
        const onScroll = () => {
            if (
                scrolledContent.getBoundingClientRect().top.toFixed() ===
                fixedOffset
            ) {
                scrollContainer.removeEventListener('scroll', onScroll)
                callback()
            }
        }
        scrollContainer.addEventListener('scroll', onScroll)
        onScroll()
        scrollContainer.scrollTo({
            top: offset,
            behavior: 'smooth',
        })
    }

    // TODO : clean cancellable promise
    TSP.utils.elementsTransitionHelper = (elements, opts) => {
        const duration = opts.duration === undefined ? 400 : opts.duration
        const classPrevious = opts.classPrevious
        const classTransition = opts.classTransition || 'transition-progress'
        const classFinal = opts.classFinal
        if (elements.length) {
            // Forces reflow before adding the transition class to ensure animation will be triggered
            // REF : https://gist.github.com/paulirish/5d52fb081b3570c81e3a
            // REF : https://stackoverflow.com/questions/21664940/force-browser-to-trigger-reflow-while-changing-css
            void elements[0].offsetLeft
        }
        elements.forEach((element) => {
            if (classPrevious) {
                element.classList.remove(classPrevious)
            }
            element.classList.add(classTransition)
        })
        const timeoutPromise = TSP.utils.timeoutPromise(duration)
        const finalPromise = timeoutPromise.then(() => {
            elements.forEach((element) => {
                if (classFinal) {
                    element.classList.remove(classTransition)
                    element.classList.add(classFinal)
                }
            })
            return elements
        })
        finalPromise.cancel = timeoutPromise.cancel
        return finalPromise
    }

    TSP.utils.quantize = (value, quantization) =>
        Math.round(value / quantization) * quantization

    TSP.utils.sphericalSpacedOnSphere = (numPoints, radius) => {
        const sphericals = []
        const rowOrColumnCount = Math.pow(numPoints, 0.5)
        let rowCount = Math.ceil(rowOrColumnCount)
        let columnCount =
            rowCount * Math.floor(rowOrColumnCount) < numPoints
                ? Math.ceil(rowOrColumnCount)
                : Math.floor(rowOrColumnCount)
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < columnCount; col++) {
                // We must avoid to pick phi = 0, otherise theta has no influence
                const phi = (Math.PI / rowCount) * (0.5 + row)
                const theta = col * ((2 * Math.PI) / columnCount)
                sphericals.push(new THREE.Spherical(radius, phi, theta))
            }
        }
        return sphericals
    }

    TSP.utils.sphericalToV3 = (spherical) => {
        const v3 = new THREE.Vector3()
        v3.setFromSpherical(spherical)
        return v3
    }

    TSP.utils.v3ToSpherical = (v3) => {
        const spherical = new THREE.Spherical()
        spherical.setFromVector3(v3)
        return spherical
    }

    TSP.utils.v3ToTranslationMatrix = (v3) =>
        new THREE.Matrix4().makeTranslation(v3.x, v3.y, v3.z)

    TSP.utils.incrementSpherical = (spherical, delta) => {
        spherical.phi = (spherical.phi + (delta.phi || 0)) % Math.PI
        spherical.theta = (spherical.theta + (delta.theta || 0)) % (2 * Math.PI)
    }

    TSP.utils.scaleBox2 = (box, scale) => {
        const boxSize = box.getSize(new THREE.Vector2())
        return box.expandByPoint(
            new THREE.Vector2(
                box.min.x + scale * boxSize.x,
                box.min.y + scale * boxSize.y
            )
        )
    }

    // calculate position in normalized device coordinates
    // (-1 to +1) for both components
    // Ref : https://threejs.org/docs/#api/en/core/Raycaster
    TSP.utils.toNDCPosition = (
        position_Screen,
        canvasDimensions_Screen,
        position_NDC
    ) => {
        position_NDC.x = (position_Screen.x / canvasDimensions_Screen.x) * 2 - 1
        position_NDC.y =
            -(position_Screen.y / canvasDimensions_Screen.y) * 2 + 1
        return position_NDC
    }

    // REF : https://stackoverflow.com/questions/25224153/how-can-i-get-the-normalized-vector-of-the-direction-an-object3d-is-facing
    TSP.utils.getObjectDirection = (object3D) => {
        const vector = new THREE.Vector3(0, 0, 1)
        return vector.applyQuaternion(object3D.quaternion)
    }

    class ScreenWorldConverter {
        // `projectionRatio` is world / screen
        constructor(projectionRatio) {
            this.projectionRatio = projectionRatio
        }

        toWorldSize(size_Screen) {
            return this.projectionRatio * size_Screen
        }

        toScreenSize(size_World) {
            return size_World / this.projectionRatio
        }
    }

    ScreenWorldConverter.fromVectors2 = (vector_World, vector_Screen) => {
        const projectionRatio = vector_World.divide(vector_Screen).x
        return new ScreenWorldConverter(projectionRatio)
    }

    // Returns the Plane perpendicular to the camera view that contains `position`
    TSP.utils.getPerspectivePlane = (camera, position) => {
        const planeNormal = TSP.utils.getObjectDirection(camera).normalize()
        return new THREE.Plane().setFromNormalAndCoplanarPoint(
            planeNormal,
            position
        )
    }

    TSP.utils.getCanvasBoundingBoxOnScreen = () => {
        return new THREE.Box2(
            new THREE.Vector2(0, 0),
            new THREE.Vector2(window.innerWidth, window.innerHeight)
        )
    }

    TSP.utils.getObjectBoundingSphereInWorld = (object3D) => {
        return new THREE.Box3()
            .setFromObject(object3D)
            .getBoundingSphere(new THREE.Sphere())
    }

    // REF : https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
    TSP.utils.worldPositionToScreenPosition = (
        camera,
        worldPosition,
        canvasBoundingBox_Screen
    ) => {
        const canvasDimensions_Screen = canvasBoundingBox_Screen.getSize(
            new THREE.Vector2()
        )

        const screenPosition = new THREE.Vector3()
            .copy(worldPosition)
            .project(camera)

        // Transform from centered position (in World), to a position relative to top / left in Screen.
        const pixelHalfCanvasDimensions = canvasDimensions_Screen.multiplyScalar(
            0.5
        )
        return pixelHalfCanvasDimensions.add(
            new THREE.Vector2(screenPosition.x, -screenPosition.y).multiply(
                pixelHalfCanvasDimensions
            )
        )
    }

    TSP.utils.getBoundingCircleInScreen = (
        camera,
        boundingSphere_World,
        canvasBoundingBox_Screen
    ) => {
        const canvasDimensions_World = TSP.utils.computeVisibleRectangle(
            camera,
            boundingSphere_World.center
        )
        const canvasDimensions_Screen = canvasBoundingBox_Screen.getSize(
            new THREE.Vector2()
        )
        const converter = ScreenWorldConverter.fromVectors2(
            canvasDimensions_World,
            canvasDimensions_Screen
        )

        const circleCenter_Screen = TSP.utils.worldPositionToScreenPosition(
            camera,
            boundingSphere_World.center,
            canvasBoundingBox_Screen
        )
        const circleRadius_Screen = converter.toScreenSize(
            boundingSphere_World.radius
        )
        return { center: circleCenter_Screen, radius: circleRadius_Screen }
    }

    // Compute the minimum distance to place a perspective camera from a rectangle
    // of dimensions `Vector2(x, y)`, so that the rectangle is entirely visible.
    // REF : https://stackoverflow.com/questions/13350875/three-js-width-of-view
    TSP.utils.computeCameraDistance = (camera, rectDimensions) => {
        const fovRadians = THREE.MathUtils.degToRad(camera.fov)
        // We need to adjust the camera to the biggeest side of the window
        let distance =
            rectDimensions.x / (2 * camera.aspect * Math.tan(fovRadians / 2))
        if (camera.aspect > 1) {
            distance = rectDimensions.y / (2 * Math.tan(fovRadians / 2))
        }
        return distance
    }

    // Computes the visible dimensions (in World coordinates) of the rectangle that contains `position`.
    TSP.utils.computeVisibleRectangle = (camera, position) => {
        const fovRadians = THREE.MathUtils.degToRad(camera.fov)
        const perspectivePlane = TSP.utils.getPerspectivePlane(camera, position)
        const distance = Math.abs(
            perspectivePlane.distanceToPoint(camera.position)
        )
        return new THREE.Vector2(camera.aspect, 1).multiplyScalar(
            2 * distance * Math.tan(fovRadians / 2)
        )
    }

    // Compute an orbital transform for `camera`, so that `boundingBox_World` is placed inside `boundingBox_Screen`.
    // TODO : for all these calculations, use NDC.
    TSP.utils.computeCameraOrbitalTransform = (
        camera,
        boundingBox_World,
        canvasBoundingBox_Screen,
        boundingBox_Screen
    ) => {
        const boundingBoxCenter_World = boundingBox_World.getCenter(
            new THREE.Vector3()
        )

        // -------- 1. Process on-screen dimensions / positions for the canvas and the bounding box
        const canvasDimensions_Screen = canvasBoundingBox_Screen.getSize(
            new THREE.Vector2()
        )
        const boundingBoxDimensions_Screen = boundingBox_Screen.getSize(
            new THREE.Vector2()
        )
        const boundingBoxMaxSize_Screen = Math.max(
            boundingBoxDimensions_Screen.x,
            boundingBoxDimensions_Screen.y
        )

        // -------- 2. Project on-screen dimensions / positions to the units in Three.js coordinate system (meters)
        const boundingBoxDimensions_World = boundingBox_World.getSize(
            new THREE.Vector3()
        )
        const boundingBoxMaxSize_World = Math.max(
            boundingBoxDimensions_World.x,
            boundingBoxDimensions_World.y,
            boundingBoxDimensions_World.z
        )

        const projectionRatio =
            boundingBoxMaxSize_World / boundingBoxMaxSize_Screen
        const visibleRectangle_World = canvasDimensions_Screen
            .clone()
            .multiplyScalar(projectionRatio)
        const cameraOffset_World = boundingBox_Screen.min
            .clone()
            // Translate to the center of the bounding box instead of top-left corner
            .addScaledVector(boundingBoxDimensions_Screen, 0.5)
            // Translate to the center of the canvas instead of top-left corner
            .addScaledVector(canvasDimensions_Screen, -0.5)
            .multiply(new THREE.Vector2(-projectionRatio, projectionRatio))

        // -------- 3. Compute `rotation` and `translation` to bring the camera in position
        const rotation = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            boundingBoxCenter_World.clone().normalize()
        )

        const translation = new THREE.Vector3()
        // i. move back from `radius of boundingBoxCenter_World` + `distance`
        const boundingBoxCenterSpherical = TSP.utils.v3ToSpherical(
            boundingBoxCenter_World
        )
        translation.z =
            boundingBoxCenterSpherical.radius +
            TSP.utils.computeCameraDistance(camera, visibleRectangle_World)
        // ii. apply the offsets
        translation.applyMatrix4(
            TSP.utils.v3ToTranslationMatrix(
                new THREE.Vector3(cameraOffset_World.x, cameraOffset_World.y, 0)
            )
        )
        // iii. apply the rotation to bring `translation` to `boundingBoxCenter_World`
        translation.applyQuaternion(rotation)

        return {
            translation: translation,
            rotation: rotation,
        }
    }

    // Simple shader loader that also does a simple build step, prepending declared dependencies to the shader files.
    TSP.utils.loadShaders = (shaderDefinitions) => {
        const dependencyUrls = shaderDefinitions.reduce(
            (allDependencies, shaderDefinition) => {
                return allDependencies.concat(
                    shaderDefinition.dependencyUrls || []
                )
            },
            []
        )
        const dependencies = {}
        return Promise.all(
            _.uniq(dependencyUrls).map((dependencyUrl) =>
                TSP.utils.fetch(dependencyUrl).then((dependencyText) => {
                    dependencies[dependencyUrl] = dependencyText
                })
            )
        ).then(() =>
            Promise.all(
                shaderDefinitions.map((shaderDefinition) =>
                    TSP.utils.fetch(shaderDefinition.url).then((shaderText) => {
                        ;(shaderDefinition.dependencyUrls || []).forEach(
                            (dependencyUrl) => {
                                if (!dependencies[dependencyUrl]) {
                                    debugger
                                }
                                shaderText =
                                    dependencies[dependencyUrl] +
                                    '\n// ------------- INSERTED DEPENDENCY ------------- \n' +
                                    shaderText
                            }
                        )
                        return shaderText
                    })
                )
            )
        )
    }

    TSP.utils.readAttributeToVector3 = (bufferAttributeArray, index, vector) =>
        vector.set(
            bufferAttributeArray[3 * index],
            bufferAttributeArray[3 * index + 1],
            bufferAttributeArray[3 * index + 2]
        )

    TSP.utils.readAttributeToVector2 = (bufferAttributeArray, index, vector) =>
        vector.set(
            bufferAttributeArray[2 * index],
            bufferAttributeArray[2 * index + 1]
        )

    TSP.utils.setVector3ToAttribute = (vector, bufferAttributeArray, index) => {
        bufferAttributeArray[3 * index] = vector.x
        bufferAttributeArray[3 * index + 1] = vector.y
        bufferAttributeArray[3 * index + 2] = vector.z
        return bufferAttributeArray
    }

    TSP.utils.setVector2ToAttribute = (vector, bufferAttributeArray, index) => {
        bufferAttributeArray[2 * index] = vector.x
        bufferAttributeArray[2 * index + 1] = vector.y
        return bufferAttributeArray
    }

    TSP.utils.loadTexture = (url) => {
        return new Promise((resolve, reject) => {
            const texture = new THREE.TextureLoader().load(
                url,
                resolve,
                undefined,
                reject
            )
        })
    }

    TSP.utils.prerenderTexture = (renderer, material, width, height) => {
        const renderTarget = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
        })

        const camera = new THREE.OrthographicCamera(
            -width / 2,
            width / 2,
            height / 2,
            -height / 2,
            -100,
            100
        )
        camera.position.z = 10

        const scene = new THREE.Scene()
        const planeGeometry = new THREE.PlaneGeometry(width, height)
        const planeMesh = new THREE.Mesh(planeGeometry, material)
        planeMesh.position.z = -10
        scene.add(planeMesh)

        renderer.setRenderTarget(renderTarget)
        renderer.render(scene, camera)
        renderer.setRenderTarget(null)

        planeGeometry.dispose()

        return renderTarget.texture
    }

    // Create a textured sphere mesh, by morphing a box. This allows for easier mapping of a flat texture to a sphere.
    // However, when using a ShaderMaterial, this also requires to map the box coordinates into spherical coordinates.
    // REF : https://blogg.bekk.no/procedural-planet-in-webgl-and-three-js-fc77f14f5505
    TSP.utils.getTexturedSphereMesh = (radius, createMaterial) => {
        const materials = []
        for (let i = 0; i < 6; i++) {
            materials[i] = createMaterial(i)
        }

        const geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32)
        for (let i in geometry.vertices) {
            let vertex = geometry.vertices[i]
            vertex.normalize().multiplyScalar(radius)
        }
        return new THREE.Mesh(geometry, materials)
    }

    TSP.utils.getTexturedSphereBufferMesh = (createMaterial) => {
        const materials = []
        for (let i = 0; i < 6; i++) {
            materials[i] = createMaterial(i)
        }

        const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 64, 64, 64)

        // displacement = new Float32Array( geometry.attributes.position.count );
        // noise = new Float32Array( geometry.attributes.position.count );

        // for ( var i = 0; i < displacement.length; i ++ ) {
        //     noise[ i ] = Math.random() * 5;
        //     displacement[ i ] = 1//Math.sin( 0.1 * i + time );
        //     noise[ i ] += 0.5 * ( 0.5 - Math.random() );
        //     noise[ i ] = THREE.MathUtils.clamp( noise[ i ], - 5, 5 );
        //     displacement[ i ] += noise[ i ];
        // }

        // geometry.setAttribute( 'displacement', new THREE.BufferAttribute( displacement, 1 ) );

        return new THREE.Mesh(geometry, materials)
    }

    TSP.utils.randRange = (lower, upper) =>
        lower + Math.random() * (upper - lower)

    TSP.utils.tweenTranslate = (object3D, translation, opts) => {
        const duration = opts.duration || 2000
        return new TWEEN.Tween(
            {
                x: object3D.position.x,
                y: object3D.position.y,
                z: object3D.position.z,
            },
            opts.group
        )
            .to(
                {
                    x: translation.x,
                    y: translation.y,
                    z: translation.z,
                },
                duration
            )
            .onUpdate((values) => {
                object3D.position.copy(values)
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start()
    }

    TSP.utils.tweenRotate = (object3D, rotation, opts) => {
        const duration = opts.duration || 2000
        return new TWEEN.Tween(
            {
                x: object3D.quaternion.x,
                y: object3D.quaternion.y,
                z: object3D.quaternion.z,
                w: object3D.quaternion.w,
            },
            opts.group
        )
            .to(
                {
                    x: rotation.x,
                    y: rotation.y,
                    z: rotation.z,
                    w: rotation.w,
                },
                duration
            )
            .onUpdate((values) => {
                object3D.quaternion.copy(values)
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start()
    }

    TSP.utils.randomizeValue = (params) => {
        const mean = params[0]
        const uncertainty = params[1]
        return mean + (Math.random() * 2 - 1) * uncertainty
    }

    TSP.utils.template = (templateText) => {
        const div = document.createElement('div')
        div.innerHTML = templateText
        const templateId = div.querySelector('template').id
        if (!document.querySelector('#' + templateId)) {
            document.body.insertAdjacentHTML('beforeend', templateText)
        }
        const template = document.querySelector('#' + templateId)
        return template.content.cloneNode(true)
    }

    TSP.utils.fetch = (url) => {
        return fetch(TSP.utils.absoluteUrl(url)).then((response) => {
            if (response.status !== 200) {
                throw new Error(`fetch status ${response.status} > ${url}`)
            }
            return response.text()
        })
    }

    TSP.utils.navigateTo = (relativeUrl) => {
        const url = TSP.utils.absoluteUrl(relativeUrl)
        history.pushState({}, '', url)
        TSP.state.set('App.currentUrl', relativeUrl)
    }

    const normalizeUrl = (TSP.utils.normalizeUrl = (url, forceAbsolute) => {
        if (url.endsWith('/')) {
            url = url.slice(0, -1)
        }
        if (forceAbsolute && !url.startsWith('/')) {
            url = '/' + url
        }
        return url
    })

    TSP.utils.absoluteUrl = (relativeUrl) =>
        normalizeUrl(TSP.config.get('app.rootUrl') + relativeUrl, true)

    TSP.utils.relativeUrl = (absoluteUrl) =>
        normalizeUrl(absoluteUrl.replace(TSP.config.get('app.rootUrl'), ''))

    TSP.utils.getOrThrow = (source, path) => {
        const value = _.get(source, path)
        if (_.isUndefined(value)) {
            throw new Error('Unknown state path "' + path + '"')
        }
        return value
    }

    TSP.utils.assertImplements = (_class, interface) => {
        const missing = []
        interface.forEach((methodName) => {
            if (typeof _class.prototype[methodName] !== 'function') {
                missing.push(methodName)
            }
        })
        if (missing.length) {
            throw new Error(`Class "${_class.name}" misses implementation for methods "${missing.join(', ')}"`)
        }
    }

    TSP.utils.interfaces = {
        hoverable: ['getUrl', 'getHoverableObject3D'],
        hudTarget: ['getBoundingSphere', 'getHudClassName'],
    }
})()
