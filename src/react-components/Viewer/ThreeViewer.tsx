import * as React from 'react';

// For 3D
import * as THREE from "three"; // For 3D: Threejs
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"; // For simple Controls Interface in the scene
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"; // For the OBJ Loader
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"; // For the MTL file for where to apply the Materials (in the OBJ file)
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Fot GLTF files


export function ThreeViewer(){

	// The variables to Nullify when closing the viewer
	let scene: THREE.Scene | null;
	let camera: THREE.PerspectiveCamera | null;
	let renderer: THREE.WebGLRenderer | null;
	let boxGeometry: THREE.BoxGeometry | null;
	let basicMaterial: THREE.MeshStandardMaterial | null;
	let cube: THREE.Mesh | null;
	let axes: THREE.AxesHelper | null;
	let grid: THREE.GridHelper | null;
	let gui: GUI | null;
	let cubeControls: GUI | null;
	let ambientLight: THREE.AmbientLight | null;
	let directionalLight: THREE.DirectionalLight | null;
	let spotLight: THREE.SpotLight | null;
	let objLoader: OBJLoader | null;
	let mtlLoader: MTLLoader | null;
	let mesh:GLTF | null;

	let animationFrameId: number;
	let resizeObserver: ResizeObserver | null = null;


	// To assure everything is loaded before execute the code
	const setViewer = () =>{
		const viewerContainer = document.getElementById("viewer-container") as HTMLElement; 
		if (!viewerContainer) return;
	
		// 1. INITIALIZE THREE.JS CORE SCENE______________________________________________
		scene = new THREE.Scene();
		if(!scene){return};
		camera = new THREE.PerspectiveCamera(75);
		camera.position.z = 5;
	
		renderer = new THREE.WebGLRenderer({alpha:true, antialias:true}); 
		viewerContainer.append(renderer.domElement);
	
		// Create scene actors using strictly your elements
		boxGeometry = new THREE.BoxGeometry(); 
		basicMaterial = new THREE.MeshStandardMaterial();
		cube = new THREE.Mesh(boxGeometry, basicMaterial);
		
		
		axes = new THREE.AxesHelper(); // Axes
		
		// Grid
		grid = new THREE.GridHelper();
		grid.material.transparent = true;
		grid.material.opacity = 0.4;
		grid.material.color = new THREE.Color("#f1f1f1");
		
		// Controls Simple Interface:
		gui = new GUI()
		
		// Cube
		if (!cube) return;
		cubeControls = gui.addFolder("Cube"); // Create a place passing the folder's name to add the controls
		cubeControls.add(cube, "visible");

		// 🌟 SOLUCIÓN para "color": Le indicamos a TypeScript que trate el material explícitamente como MeshStandardMaterial
		const currentMaterial = cube.material as THREE.MeshStandardMaterial;
		cubeControls.addColor(currentMaterial, "color");

		cubeControls.add(cube.position, "x", -10,10,0.5); // Only add ONE property at a time
		cubeControls.add(cube.position, "y", -10,10,0.5); // Only add ONE property at a time
		cubeControls.add(cube.position, "z", -10,10,0.5); // Only add ONE property at a time
	
		
		// ...............................   LIGHTS   .........................................................
		
			// Ambient Light
		ambientLight = new THREE.AmbientLight();
		ambientLight.intensity = 0.6;
		
			// Directional Light
		directionalLight = new THREE.DirectionalLight(); 
		const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.5,"#a6ff00");
	
		const directionalLightControls = gui.addFolder("Directional Light");
		directionalLightControls.add(directionalLightHelper, "visible")
		directionalLightControls.addColor(directionalLightHelper, "color")
		directionalLightControls.add(directionalLight, "intensity", 0,5,0.1)
		directionalLightControls.add(directionalLight.position, "x", -20,20,0.5)
		directionalLightControls.add(directionalLight.position, "y", -20,20,0.5)
		directionalLightControls.add(directionalLight.position, "z", -20,20,0.5)
	
			// Spot Lighht
		spotLight = new THREE.SpotLight();
		const spotLightHelper = new THREE.SpotLightHelper(spotLight);
	
		const spotLightControls = gui.addFolder("SpotLight");
		spotLightControls.add(spotLightHelper, "visible");
		spotLightControls.addColor(spotLight, "color");
		spotLightControls.add(spotLight.position, "x", -20,20,0.5)
		spotLightControls.add(spotLight.position, "y", -20,20,0.5)
		spotLightControls.add(spotLight.position, "z", -20,20,0.5)
		spotLightControls.add(spotLight, "intensity", 0,10,0.1);
		spotLightControls.add(spotLight, "distance", 0,100,0.1);
		spotLightControls.add(spotLight, "angle", 0,Math.PI/2,0.1);
		spotLightControls.add(spotLight, "penumbra", 0,1,0.1);
		spotLightControls.add(spotLight, "decay", 1,2,0.1);
		
		
			// ...........................Adding to the Scene..................................................
		scene.add(cube, directionalLight, ambientLight, axes, grid, directionalLightHelper, spotLight, spotLightHelper );
		
		
			// OBJ file
		objLoader = new OBJLoader();
		mtlLoader = new MTLLoader();

		
		// First Set the Materials and then Apply them to the obj
		mtlLoader.load("../Assets/Gear/Gear1.mtl", (materials) =>{
			if(!objLoader) return;
			materials.preload();
			objLoader.setMaterials(materials);
			objLoader.load("../Assets/Gear/Gear1.obj", (mesh) =>{
				// scene.add(mesh); // to Add the "group" of meshes of the file
			})
		})
	
	
			// GLTF File
		const gltfLoader = new GLTFLoader();
		gltfLoader.load("../../myAssets/Assets/Fosil/scene.gltf", (gltf) => {
			if (!scene || !cube) {return}
			scene.remove(cube);
			const model = gltf.scene;
			scene.add(model);
			mesh = gltf;
		})
	
	
	
		// 2. INITIALIZE ORBIT CONTROLS _________________________________________________
		const cameraControls = new OrbitControls(camera, viewerContainer);
	
		// 3. DYNAMIC VIEWPORT RESIZE ENGINE ____________________________________________
		// This function now ONLY handles layout measurements
		function resizeViewer() {
			const width = viewerContainer.clientWidth;
			const height = viewerContainer.clientHeight;
	
			if (width === 0 || height === 0) return;

			if(!renderer || !camera) return;
	
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix(); 
		}
	
		// 4. INFINITE ANIMATION LOOP_____________________________________________________
		// This loops independently at 60fps to redraw the frame when the mouse moves
		function renderScene() {

			// 🔥 Capturamos el ID del frame actual antes de continuar el bucle
   			animationFrameId = window.requestAnimationFrame(renderScene);
	
			// Required to tell the controls to evaluate mouse/touch dragging
			cameraControls.update();
	
			// For Lights Helpers Updates
			directionalLightHelper.update();
			spotLightHelper.update();

			if(!renderer || !scene || !camera) return;
			// Take the snapshot of the scene
			renderer.render(scene, camera);
		}
	
		// 5. OBSERVERS & TRIGGERS __________________________________________________________
		resizeObserver = new ResizeObserver(() => {
			resizeViewer();
		});
		resizeObserver.observe(viewerContainer);
		
		// Initial triggers to start the app
		resizeViewer();
		
		// Start the animation engine!
		renderScene();

	}
	React.useEffect(()=>{
		setViewer();

		// 🛑 FUNCIÓN DE LIMPIEZA (Se ejecuta automáticamente cuando te sales del visor)
        return () => {
            console.log("Cleaning up Three.js Viewer resources...");

            // 1. Frenar el motor de animación (Cancela el requestAnimationFrame)
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }

            // 2. Desconectar el observador de cambio de tamaño
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }

            // 3. Destruir la interfaz flotante GUI (Evita que se dupliquen paneles)
            if (gui) {
                gui.destroy();
                gui = null;
            }

            // 4. Liberar buffers de la GPU (VRAM)
            if (boxGeometry) {
                boxGeometry.dispose();
                boxGeometry = null;
            }
            if (basicMaterial) {
                basicMaterial.dispose();
                basicMaterial = null;
            }

            // 5. Eliminar el lienzo canvas del DOM y apagar el WebGLRenderer
            if (renderer) {
                renderer.domElement.remove();
                renderer.dispose();
                renderer = null;
            }

            // 6. Nullify de las variables restantes para recolección de basura (Garbage Collector)
            scene = null;
            camera = null;
            cube = null;
            axes = null;
            grid = null;
            cubeControls = null;
            ambientLight = null;
            directionalLight = null;
            spotLight = null;
            objLoader = null;
            mtlLoader = null;
            mesh = null;
        }
	}, [ ])

	return(
		// Viewer Container
		<div id="viewer-container"	className="dashboard-card"	style={{ minWidth: 0 }}>
		</div>
	)
}