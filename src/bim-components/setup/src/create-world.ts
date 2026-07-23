
import * as OBC from '@thatopen/components';
import * as BUI from '@thatopen/ui';

export const createWorld = (components: OBC.Components) => {

	// 1. Create or get the "Manager"
	const worlds = components.get(OBC.Worlds);

	// 2. Create a new world, expecting those types of components to be used in the world.
	const world = worlds.create<
		OBC.SimpleScene,
		OBC.OrthoPerspectiveCamera,
		OBC.SimpleRenderer
	>();

	// 3. Create a Scene
	world.scene = new OBC.SimpleScene(components);

		// 3.1 It's possible to setup the scene as we want (as done in previous lessons) or use this:
	world.scene.setup();
	world.scene.three.background = null; // Set the background to transparent

	// 4. Create a Viewport on the fly using TOE system
	const viewport = BUI.Component.create<BUI.Viewport>(
		() => {
			return BUI.html`<bim-viewport></bim-viewport>`;
		},
	);

	// 5. Create a renderer for the world, using the viewport we just created
	world.renderer = new OBC.SimpleRenderer(components, viewport);

	// 6. Create a camera for the world
	world.camera = new OBC.OrthoPerspectiveCamera(components);

		// 6.1 Setup Camara: Resizing
	const resizeWorld = () => {
		try{
			world.renderer?.resize();
			world.camera.updateAspect();
		}catch(e){
			console.warn("Resize world was not possible");
		}
	};

		// 6.2 Add a listener to the viewport to resize the world when the viewport is resized
	viewport.addEventListener('resize', resizeWorld);

	// 7. Initialize the raycaster for the world, so we can use it to detect clicks on objects in the scene
	components.get(OBC.Raycasters).get(world);

	// 8. Add a Grid to the Scene
	components.get(OBC.Grids).create(world);

	// 9. Return the main elements to be used outside this function
	return {world,viewport};
}