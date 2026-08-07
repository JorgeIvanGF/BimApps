import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"
import {
	ViewerToolbarState,
	viewerToolbarTemplate,
} from "../containers/viewport-toolbar"

type BottomToolbar = {
	name:"bottomToolbar",
	state:ViewerToolbarState
};

type ViewportGridElements = [BottomToolbar];
type ViewportGridLayouts = ["main"];

export type ViewportGrid = BUI.Grid<ViewportGridLayouts, ViewportGridElements>;

interface ViewportGridState{
	components: OBC.Components;
}

export const viewportGridTemplate: BUI.StatefullComponent<ViewportGridState> = (state,) => {
	const {components} = state;

	const elements: BUI.GridComponents<ViewportGridElements> = {
		bottomToolbar: {
			template: viewerToolbarTemplate,
			initialState: {components},
		},
	};

	const onCreated = (el?: Element) => {
		if (!el) return;
		const grid = el as ViewportGrid;
		grid.elements = elements;

		grid.layouts = {
			main: {
				template: `
				"empty" 1fr
				"bottomToolbar" auto
				/ 1fr
				`,
			},
		};

		grid.layout = "main";
	};

	return BUI.html`<bim-grid floating ${BUI.ref(onCreated)} class="viewport-grid"></bim-grid>`;
}