

import * as BUI from "@thatopen/ui"
import { ComponentsGrid } from "./src";
import { viewportContainerTemplate } from "../../containers";


// Create the componentGridState
interface ComponentsGridState{
	viewport?: BUI.Viewport;
}

export const componentsGridTemplate: BUI.StatefullComponent<ComponentsGridState> = (state) => {

	// Destructure the state
	const { viewport } = state;

	// A callback FN to be executed when the grid is created. It can be used to set up event listeners, 
	// initialize state, or perform any other setup tasks that need to happen after the grid is created.
	const onCreated = (e?:Element) => {
		if (!e) return;
		const grid = e as ComponentsGrid;

		//Define grid elements:
		grid.elements ={
			viewport:{				
				template: viewportContainerTemplate,
				initialState:{viewport},
			},
		}
		// Define the LAYOUTS of the Grid:
		grid.layouts = {
			Models:{
				template:`
					"viewport" 1fr
					/ 1fr
				`,
			},
		}
		// To tell the grid which layout to use:
		grid.layout = "Models";
	}


	return BUI.html `<bim-grid ${BUI.ref(onCreated)} class="components-grid"></bim-grid>`
}


