
import * as OBC from '@thatopen/components'

export const setupFragmentsManager = (components: OBC.Components, 
	world: OBC.SimpleWorld<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer>)=>{
	
	// The Manager itself
	const fragments = components.get(OBC.FragmentsManager);

	// The WORKER is set from de node_modules for simplicity.
	// To Build the App, the worker file should be set inside the PUBLIC folder at 
	// the root of the project, and be referenced as "worker.mjs"
	fragments.init("/node_modules/@thatopen/fragments/dist/Worker/worker.mjs")

	// The Frags Manager store ALL the Models loaded inside the "list" property
	// it's a special List that Triggers Events when smt is Added or Deleted.
	// Therefore when the model is loaded we do 3 things:
	// 1. Tell the model which CAMERA to use
	// 2. Add the Model to a ThreeJs SCENE (in the World)
	// 3. Tell the Frags Manager to UPDATE
	fragments.list.onItemSet.add(async ({value:model}) =>{
		// useCamera tells the Model which CAMERA to use to Update its
		// culling(NOt Rendering what Camera doesnt See) and LOD (in 3D Graphics context) state
		model.useCamera(world.camera.three);

		// Add the Model to the SCENE
		world.scene.three.add(model.object);

		// Instruct the Frags Mngr that the Model MUST be Updated
		await fragments.core.update(true);
	}) 

	// Its necessary to tell FragsMngr When to Update 
	// commonlly (right after the camera have finished a movement)
	world.camera.controls.addEventListener("rest", async () =>{
		await fragments.core.update(true);
	})
}