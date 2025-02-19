import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

// Global material for text and donuts
const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture

/**
 * Variables for Text
 */
const textParams = {
    firstLine: 'Alex Anderson',
    secondLine: 'Software Developer',
    thirdLine: 'Creative Designer',
}

/**
 * Fonts
 */
const fontLoader = new FontLoader()
let font

// Load the font and create text geometries
fontLoader.load('./fonts/helvetiker_regular.typeface.json', (loadedFont) => {
    font = loadedFont // Save the loaded font to use later
    createText() // Initial text creation
})

// Create a group to hold the text lines
const textGroup = new THREE.Group()
scene.add(textGroup)

// Keep track of text meshes for disposal
let firstLineMesh, secondLineMesh, thirdLineMesh

// Function to create or update the text meshes
const createText = () => {
    // Dispose of the old geometries if they exist
    if (firstLineMesh) {
        firstLineMesh.geometry.dispose()
        textGroup.remove(firstLineMesh)
    }
    if (secondLineMesh) {
        secondLineMesh.geometry.dispose()
        textGroup.remove(secondLineMesh)
    }
    if (thirdLineMesh) {
        thirdLineMesh.geometry.dispose()
        textGroup.remove(thirdLineMesh)
    }

    // First line of text
    const firstLineGeometry = new TextGeometry(textParams.firstLine, {
        font: font,
        size: 0.5,
        depth: 0.2, // Corrected 'height' to 'depth'
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
    })
    firstLineGeometry.center()
    firstLineMesh = new THREE.Mesh(firstLineGeometry, material)
    textGroup.add(firstLineMesh)

    // Second line of text
    const secondLineGeometry = new TextGeometry(textParams.secondLine, {
        font: font,
        size: 0.5,
        depth: 0.2, // Corrected 'height' to 'depth'
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
    })
    secondLineGeometry.center()
    secondLineMesh = new THREE.Mesh(secondLineGeometry, material)
    textGroup.add(secondLineMesh)

    // Third line of text
    const thirdLineGeometry = new TextGeometry(textParams.thirdLine, {
        font: font,
        size: 0.5,
        depth: 0.2, // Corrected 'height' to 'depth'
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
    })
    thirdLineGeometry.center()
    thirdLineMesh = new THREE.Mesh(thirdLineGeometry, material)
    textGroup.add(thirdLineMesh)

    // Position the text lines
    firstLineMesh.position.y = 0.7
    secondLineMesh.position.y = 0
    thirdLineMesh.position.y = -0.7
}

// Lil-gui controls for changing the text
gui.add(textParams, 'firstLine').name('First Line').onChange(createText)
gui.add(textParams, 'secondLine').name('Second Line').onChange(createText)
gui.add(textParams, 'thirdLine').name('Third Line').onChange(createText)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Adding Donuts
 */
console.time('donuts')

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 30, 45)

for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material)

    donut.position.x = (Math.random() - 0.5) * 11
    donut.position.y = (Math.random() - 0.5) * 11
    donut.position.z = (Math.random() - 0.5) * 11

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.x = scale
    donut.scale.y = scale
    donut.scale.z = scale
    // donut.scale.set(scale, scale, scale)

    scene.add(donut)
}

console.timeEnd('donuts')
