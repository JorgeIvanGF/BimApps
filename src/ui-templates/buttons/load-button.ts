	import * as BUI from "@thatopen/ui";
	import * as OBC from "@thatopen/components"
	import * as THREE from "three";
import { appIcons } from "../../globals";

	export interface LoadModelBtnState{
		components: OBC.Components;
	}

	export const loadModelBtnTemplate:BUI.StatefullComponent<LoadModelBtnState> = (
	state,
	) =>{

		// Deconstruct the state and get the components manager
		const {components} = state;

		// Set the Callbacks
		const onLoadIfc = () =>{
			const input = document.createElement("input");
			input.type = "file";
			input.multiple = false;
			input.accept = ".ifc";
		
			
			
			
			input.addEventListener("change", async()=>{
				// Check if file exists
				const file = input.files?.[0];
				if(!file) return;
				
				// To read IFC as binary data
				const buffer = await file.arrayBuffer();
				const bytes = new Uint8Array(buffer);
				
				// Get the IFC loader from OBC
				const ifcLoader = components.get(OBC.IfcLoader);
				// Give the info to the loader
				await ifcLoader.load(
					bytes,
					true,
					file.name.replace(".ifc", ""),				
				)				
				
			})
			
			input.click();
		}
		
		// FRAG LOADER
		const onLoadFrag = () =>{
			const input = document.createElement("input");
			input.type = "file";
			input.multiple = false;
			input.accept = ".frag";

			input.addEventListener("change", async()=>{
				// Check if file exists
				const file = input.files?.[0];
				if(!file) return;
				const buffer = await file.arrayBuffer();

				const fragments = components.get(OBC.FragmentsManager);
				fragments.core.load(buffer, {modelId: file.name.replace(".frag", "")})
			})
			input.click();
		}

		// To add a Listener (in UI TOE) use @"nameoftheevent"
		return BUI.html`<bim-button icon=${appIcons.ADD}>
			<bim-context-menu>
				<bim-button class="transparent" label="Load IFC" @click=${onLoadIfc}></bim-button>
				<bim-button class="transparent" label="Load FRAG" @click=${onLoadFrag}></bim-button>
			</bim-context-menu>
		</bim-button>`

	}