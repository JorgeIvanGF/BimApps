
import * as OBC from '@thatopen/components';
import { createWorld, setupFragmentsManager, setupHighlighter, setupIfcLoader } from './src';
import * as BUI from "@thatopen/ui";
import { loadModelBtnTemplate } from '../../ui-templates';

export const setupComponents = async () => {
	// Any app powered by TOE Must start with the Root call function to setup the components
	// There ONLY has to be ONE Root call function in the entire app,its like a MANAGER and it has to be called before any other component is used
	const components = new OBC.Components();

	// The World component is the main component that will be used to render the 3D scene
	// It is a combination of "Scene" + "Camera" + "Renderer" + "Controls" + "Lights" + "Environment"
	// It used the function to create a new one and return it and the viewport
	const { world, viewport } = createWorld(components);

	// Setup the IFC Loader
	setupIfcLoader(components);

	// Setup Fragments Manager (for Multithreading)
	setupFragmentsManager(components,world);

	// Setup the Highlighter(to select elements in the model)
	setupHighlighter(components, world);

	/*********************************************************************
	// CREATE a BUTTON:
	// Every time you create an Element with a Statefull Template, you get a TUPLE which the first entry is the HTML Element
	// and the 2nd entry is a Function to Update the State of the elemente
	const [loadModelsBtn] = BUI.Component.create(loadModelBtnTemplate, {components})
	// Temporary styles
	loadModelsBtn.style.position = "absolute";
	loadModelsBtn.style.top = "1rem";
	loadModelsBtn.style.left = "1rem";
	// Append the btn to the Viewport
	viewport.append(loadModelsBtn) 
	****************************************************************************/

	// Initialize the components as the world is already created
	components.init()

	// Returns to use Outside the FN
	return { components, viewport };



}