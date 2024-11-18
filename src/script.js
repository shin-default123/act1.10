import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

// Load textures
const textureLoader = new THREE.TextureLoader()

// Texture maps
const matcapTexture = textureLoader.load('/textures/matcaps/2.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')

// Materials
const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }) // Simple green material
const normalMaterial = new THREE.MeshNormalMaterial()
const wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 })
const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
const toonMaterial = new THREE.MeshToonMaterial()
toonMaterial.gradientMap = gradientTexture

// Standard Material with textures
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)
material.alphaMap = doorAlphaTexture
material.transparent = true

// Cube with standard material
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    material
)
cube.position.x = 4

// Materials adjustments for GUI
const gui = new dat.GUI()
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// Sphere Mesh with MeshBasicMaterial
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    greenMaterial
)
sphere.position.x = -2

// Plane Mesh with Wireframe Material
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    wireframeMaterial
)
plane.position.x = 0

// Torus Mesh with Matcap Material
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    matcapMaterial
)
torus.position.x = 2

// Cylinder Mesh with MeshNormalMaterial
const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 1, 32),
    normalMaterial
)
cylinder.position.x = 6

// Add meshes to the scene
scene.add(sphere, plane, torus, cube, cylinder)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // Soft light
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5).normalize()
scene.add(directionalLight)

// Add some more material options (e.g., Phong material for the cube)
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x1188ff, shininess: 100, specular: new THREE.Color(0x1188ff) })
const phongCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    phongMaterial
)
phongCube.position.x = -4
scene.add(phongCube)

// Add a new pyramid with transparent material
const transparentMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 })
const pyramid = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 1, 4),
    transparentMaterial
)
pyramid.position.x = -6
scene.add(pyramid)

/**
 * Debugging GUI setup
 */
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// Set the UV2 attribute for better texture mapping
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
