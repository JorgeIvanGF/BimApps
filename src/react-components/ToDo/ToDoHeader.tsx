import * as React from 'react';
import { SearchBox } from './SearchBox';

// Definimos las props (los cables de comunicación hacia el padre)
interface TodoHeaderProps {
    onAddClick: () => void; // Cable 1: Se dispara al hacer clic en el botón "+"
    onSearchChange: (text: string) => void; // Cable 2: Envía el texto que el usuario escribe en tiempo real
}

export function ToDoHeader(props:TodoHeaderProps){
	return(
		/* To-Do header */
		<div style={{padding: "20px 30px",display: "flex",alignItems: "center",justifyContent: "space-between"}}>
			<h4>To-Do</h4>
			<div style={{display: "flex",alignItems: "center",justifyContent: "end",columnGap: 20}}>
				<div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
					<span className="material-icons-round">search</span>
					{/* <input type="text" placeholder="Search To-Do's by name"	style={{ width: "100%" }}/> */}
					<SearchBox onChange={(value)=>{props.onSearchChange(value)}}/>
				</div>
				<span onClick={props.onAddClick}  className="material-icons-round addToDoBtn">add</span>
			</div>
		</div>
	)
}