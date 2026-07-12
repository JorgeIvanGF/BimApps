import * as React from "react";

interface SearchBoxProps{
	onChange: (value:string) => void;
}

export function SearchBox(props:SearchBoxProps){
	return(
		<div style={{ display: "flex", alignItems:"center", columnGap:10,width:"35%"}}>
			<bim-text-input
				debounce="300"  //Time of waiting in milliseconds before triggering the onChange event
				oninput={(e)=>{props.onChange(e.target.value)}}
				placeholder="Search by name..." 
				// style={{width:"100%",height:"12px", backgroundColor:"var(--background-200)"}}
			></bim-text-input>
		</div>
	)
}