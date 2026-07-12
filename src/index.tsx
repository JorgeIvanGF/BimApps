import * as THREE from "three" // 3D Library
import * as React from "react" // React
import * as ReactDOM from "react-dom/client" 
import * as Router from "react-router-dom"  // The Router

import { Sidebar } from "./react-components/Sidebar"
import { ProjectsPage } from "./react-components/ProjectsPage"
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage"
import { ProjectsManager } from './classes/ProjectsManager';

// Importing That Open Engine UI
import * as BUI from "@thatopen/ui"


// Initialize the UI
BUI.Manager.init();

// To inform TypeScript whta is a Bim-Label
declare global {
	namespace JSX{
		interface IntrinsicElements{
			"bim-label": any;
			"bim-button": any;
			"bim-text-input": any;
		}
	}
}

// Create a ProejctsManager Instance
const projectsManager = new ProjectsManager();

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
  <>
	<Router.BrowserRouter> {/* The main Route: Everything must be INSIDE */}
		<Sidebar />
		<Router.Routes> {/* Inside ALL the "changing" components */}
			{/* NOTE: To define DYNAMIC DATA in the URL path, use ":" + name of the PARAM we wnat to take from URL*/}
			<Router.Route path="/" element={<ProjectsPage projectsManager={projectsManager} />}></Router.Route>
			<Router.Route path="/project/:id" element={<ProjectDetailsPage projectsManager={projectsManager} />}></Router.Route>
		</Router.Routes>
	</Router.BrowserRouter>
  </>
)

/* //ThreeJS viewer
const scene = new THREE.Scene()

const viewerContainer = document.getElementById("viewer-container") as HTMLElement

const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
viewerContainer.append(renderer.domElement)

function resizeViewer() {
  const containerDimensions = viewerContainer.getBoundingClientRect()
  renderer.setSize(containerDimensions.width, containerDimensions.height)
  const aspectRatio = containerDimensions.width / containerDimensions.height
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()
}

window.addEventListener("resize", resizeViewer)

resizeViewer()

const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry, material)

const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.4

scene.add(directionalLight, ambientLight)

const cameraControls = new OrbitControls(camera, viewerContainer)

function renderScene() {
  renderer.render(scene, camera)
  requestAnimationFrame(renderScene)
}

renderScene()

const axes = new THREE.AxesHelper()
const grid = new THREE.GridHelper()
grid.material.transparent = true
grid.material.opacity = 0.4
grid.material.color = new THREE.Color("#808080")

scene.add(axes, grid)

const gui = new GUI()

const cubeControls = gui.addFolder("Cube")

cubeControls.add(cube.position, "x", -10, 10, 1)
cubeControls.add(cube.position, "y", -10, 10, 1)
cubeControls.add(cube.position, "z", -10, 10, 1)
cubeControls.add(cube, "visible")
cubeControls.addColor(cube.material, "color")

const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()

mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
  materials.preload()
  objLoader.setMaterials(materials)
  objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
    scene.add(mesh)
  })
}) */