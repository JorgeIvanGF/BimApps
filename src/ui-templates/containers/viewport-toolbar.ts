
import * as BUI from "@thatopen/ui"
import * as OBC from "@thatopen/components"
import * as OBF from "@thatopen/components-front"
import { appIcons } from "../../globals";
import * as THREE from "three";

export interface ViewerToolbarState{
	components: OBC.Components;
}

export const viewerToolbarTemplate: BUI.StatefullComponent<ViewerToolbarState> = (state) =>{

	const {components} = state;

	let colorInput: BUI.ColorInput | undefined;

	
	const onInputCreated = (el?:Element) =>{
		if (!el) return;
		colorInput = el as BUI.ColorInput;
	}
	
	// With Loading Indicator UI
	const onApplyColor = async({target:button}:{target: BUI.Button}) =>{
		if(!colorInput) return;
		const {color} = colorInput;
		const highlighter = components.get(OBF.Highlighter);
		const selection = highlighter.selection.select; // This is the ModelIdMpa
		if(OBC.ModelIdMapUtils.isEmpty(selection)) return;
		// Check if the color is already in the highlighter styles, if not, add it
		// The color is a string in hex format, we need to convert it to THREE.Color
		button.loading = true; // Start loading indicator
		if(!highlighter.styles.has(color)) {
			highlighter.styles.set(color, {
				color:new THREE.Color(color), 
				renderedFaces: 1,
				opacity:1,
				transparent:false,
			})
		}
		// Apply the color to the selection
		await Promise.all([highlighter.highlightByID(
			color,
			selection,
			false, // indicates that previous items colorized  with the same style will keep the color
			false, // Indicates that camera NOT zoom on the colorized items
		),
		highlighter.clear("select")]) // Clear the selection after applying the color

		button.loading = false; // Stop loading indicator

		BUI.ContextMenu.removeMenus(); // Close all context menus after applying the color
	}

	const onClear = async({target}: {target: BUI.Button}) =>{
		target.loading = true;
		const highlighter = components.get(OBF.Highlighter);
		await highlighter.clear();
		BUI.ContextMenu.removeMenus(); // Close all context menus after clearing the color
		target.loading = false;
	}

	const onHide = async({target}: {target: BUI.Button}) =>{

		// To get the selected items:
		const highlighter = components.get(OBF.Highlighter);
		const selection = highlighter.selection.select; // This is the ModelIdMap of selectd objects 
		if(OBC.ModelIdMapUtils.isEmpty(selection)) return;
		target.loading = true;
		const hider = components.get(OBC.Hider); // The Visibility Manager

		// We can collect the async FNs and trigger them All at the same time 
		// So we can HIDE and DESELECT the items in parallel
		const promises = [hider.set(false, selection), highlighter.clear("select")]; 
		await Promise.all(promises);

		target.loading = false;
	}

	const onIsolate = async ({target}: {target: BUI.Button})=>{

		// To get the selected items:
		const highlighter = components.get(OBF.Highlighter);
		const selection = highlighter.selection.select; // This is the ModelIdMap of selectd objects 
		if(OBC.ModelIdMapUtils.isEmpty(selection)) return;

		target.loading = true; // Start loading indicator

		const hider = components.get(OBC.Hider); // The Visibility Manager
		await hider.isolate(selection); // Isolate all items
		target.loading = false; // Stop loading indicator
	}

	const onShowAll = async({target}: {target: BUI.Button}) =>{
		target.loading = true; // Start loading indicator
		const hider = components.get(OBC.Hider); // The Visibility Manager
		await hider.set(true); // Show all items
		target.loading = false; // Stop loading indicator
	}

	return BUI.html`
	<bim-toolbar>
		<bim-toolbar-section label="Visibility" icon=${appIcons.SHOW}>
			<bim-button label="Show All" icon=${appIcons.SHOW} @click=${onShowAll}></bim-button>
		</bim-toolbar-section>
		<bim-toolbar-section label="Selection Toolbar" icon=${appIcons.SELECT} style="display: flex; flex-direction: column-reverse;">
			<bim-button label="Isolate" icon=${appIcons.ISOLATE} @click=${onIsolate}></bim-button>
			<bim-button label="Hide" icon=${appIcons.HIDE} @click=${onHide}></bim-button>
			<bim-button label="Colorize" icon=${appIcons.COLORIZE}>
				<bim-context-menu>
					<div style="display:flex; flex-direction:column; gap:0.5rem;">
						<bim-color-input ${BUI.ref(onInputCreated)}> </bim-color-input>
						<div style="display:flex; gap:0.75rem;">
							<bim-button label="Apply" icon=${appIcons.APPLY} @click=${onApplyColor}></bim-button>
							<bim-button label="Clear" icon=${appIcons.CLEAR} @click=${onClear}></bim-button>
						</div>
					</div>
				</bim-context-menu>
			</bim-button>
		</bim-toolbar-section>
	</bim-toolbar>`
}