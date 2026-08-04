
import * as OBC from '@thatopen/components'
import * as BUI from '@thatopen/ui'
import { appIcons } from "../../globals"
import * as CUI from '@thatopen/ui-obc'
import * as OBF from '@thatopen/components-front'


export interface ItemsDataPanelState{
	components: OBC.Components;
}

export const itemsDataPanelTemplate:BUI.StatefullComponent<ItemsDataPanelState> = (state) =>{

	const {components}=state;								//The Cmpnts Manager
	const highlighter = components.get(OBF.Highlighter)		//The Highlighter

	const [propsTable, updatePropsTable] = CUI.tables.itemsData({
		components,
		modelIdMap:{},
	})

	// To know which element has been selected
	highlighter.events.select.onHighlight.add((modelIdMap) =>{
		updatePropsTable({modelIdMap})
	})

	// Clear the table when is UNselected
	highlighter.events.select.onClear.add(()=>{
		updatePropsTable({modelIdMap:{}})
	})

	
	return BUI.html`<bim-panel-section fixed icon=${appIcons.APARTMENT} label="Selection Data">
		${propsTable}
	</bim-panel-section>`;
}