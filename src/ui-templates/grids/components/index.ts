

import * as BUI from "@thatopen/ui"
import { ComponentsGrid } from "./src";
import { viewportContainerTemplate } from "../../containers";
import { itemsDataPanelTemplate, modelsPanelTemplate } from "../../sections";
import * as OBC from '@thatopen/components'


// Create the componentGridState
interface ComponentsGridState{
	components: OBC.Components
	viewport?: BUI.Viewport;
}

export const componentsGridTemplate: BUI.StatefullComponent<ComponentsGridState> = (state) => {

	// Destructure the state
	const { components, viewport } = state;

	// A callback FN to be executed when the grid is created. It can be used to set up event listeners, 
	// initialize state, or perform any other setup tasks that need to happen after the grid is created.
	const onCreated = (el?:Element) => {
		if (!el) return;
		const grid = el as ComponentsGrid;

		//Define grid elements:
		grid.elements ={
			viewport:{				
				template: viewportContainerTemplate,
				initialState:{viewport},
			},
			itemsData:{
				template: itemsDataPanelTemplate,
				initialState: {components}
			},
			models:{
				template: modelsPanelTemplate,
				initialState: {components}
			}
		}
		// Define the LAYOUTS of the Grid:
		grid.layouts = {
			Models:{
				template:`
					"models viewport itemsData" 1fr
					/ 16rem 1fr 22rem
				`,
			},
		}
		// To tell the grid which layout to use:
		grid.layout = "Models";
	}


	return BUI.html `<bim-grid ${BUI.ref(onCreated)} class="components-grid"></bim-grid>`
}


