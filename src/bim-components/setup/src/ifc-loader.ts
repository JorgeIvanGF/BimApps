
import * as OBC from "@thatopen/components"

export const setupIfcLoader = (components:OBC.Components) =>{
	const ifcLoader = components.get(OBC.IfcLoader)
	ifcLoader.settings.autoSetWasm = false; //For configurate the Loader component manually

	// It Sets the Path from which the base web-ifc code is gonna to be taken
	ifcLoader.settings.wasm = {absolute: true, path: "https://unpkg.com/web-ifc@0.0.77/"}

}