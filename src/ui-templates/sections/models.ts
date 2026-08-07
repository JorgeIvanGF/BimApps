
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'
import * as OBC from '@thatopen/components'
import { appIcons } from '../../globals';
import { loadModelBtnTemplate } from '../buttons';

export interface ModelsPanelState{
	components:OBC.Components;
}

export const modelsPanelTemplate: BUI.StatefullComponent<ModelsPanelState> = (state) =>{

	const {components} = state;

	const [modelsList] = CUI.tables.modelsList({
		components,
	})

	const [loadModelsBtn] = BUI.Component.create(loadModelBtnTemplate, { components })
	loadModelsBtn.style.flex = "0"; // To Expand the size of the Search Input

	const onSearch = (e: Event) => {
		const input = e.target as BUI.TextInput;
		modelsList.queryString = input.value;
	}
	
	return BUI.html`
	<bim-panel-section class="models-header" fixed icon=${appIcons.PROJECT} 
		label="Models" >
		<div style="display:flex; gap:0.5rem;">
			<bim-text-input @input=${onSearch} placeholder="Search models..." debounce="200"></bim-text-input>
			${loadModelsBtn}
		</div>
		${modelsList}
	</bim-panel-section>
	`
}