
import * as React from 'react';


// 1. EL CONTRATO DE DATOS: Estructura pura de cómo es una tarea en tu app
export interface IToDo {
	id: string;
	description: string;
	status: "Pending" | "In Progress" | "Done";
	date: Date;
	color?:string;
}

// 2. EL CONTRATO VISUAL: Lo que este componente le exige a su padre para poder renderizarse
interface ToDoItemProps {
	todo: IToDo;
}

// 3. Main Function
export function ToDoItem(props:ToDoItemProps){

	// Formateamos la fecha dinámicamente (ej: "Fri, 20 Sep")
	const formattedDate = props.todo.date.toLocaleDateString('en-US', {
		weekday: 'short',
		day: 'numeric',
		month: 'short'
	});

	return(
		/* To-Do Item */
		<div style={{display: "flex",flexDirection: "column",padding: "10px 30px",rowGap: 20}}>
			<div className="todo-item">
				<div style={{display: "flex",justifyContent: "space-between",alignItems: "center"}}>
					{/* Icon + Description */}
					<div style={{ display: "flex", columnGap: 15, alignItems: "center" }}>
						<span className="material-icons-round" style={{padding: 10,backgroundColor: "#686868",borderRadius: 10}}>construction</span>
						<p style={{ color: "#fff", margin: 0 }}>{props.todo.description}</p>
					</div>
					{/* Estimated Date */}
					<p style={{ textWrap: "nowrap", marginLeft: 10 }}>{formattedDate}</p>
				</div>
			</div>
		</div>
	)
}