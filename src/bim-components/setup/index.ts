
import * as OBC from '@thatopen/components';
import { createWorld } from './src';

export const setupComponents = async () => {
	// Any app powered by TOE Must start with the Root call function to setup the components
	// There ONLY has to be ONE Root call function in the entire app,its like a MANAGER and it has to be called before any other component is used
	const components = new OBC.Components();

	// The World component is the main component that will be used to render the 3D scene
	// It is a combination of "Scene" + "Camera" + "Renderer" + "Controls" + "Lights" + "Environment"
	// It used the function to create a new one and return it and the viewport
	const { world, viewport } = createWorld(components);

	// Initialize the components as the world is already created
	components.init()

	// Returns to use Outside the FN
	return { components, viewport };



}