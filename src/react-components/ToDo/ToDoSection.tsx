import * as React from 'react';
import { ToDoHeader } from './ToDoHeader';
import { ToDoItem, IToDo } from './ToDoItem';
import { ToDoModal } from './ToDoModal';

interface ToDoSectionProps{
	toDos:IToDo[];
	onToDosChange: (newToDos: IToDo[])=>void;
}

export function ToDoSection(props: ToDoSectionProps) {
	// 1. Estados principal el texto de búsqueda
	const [searchQuery, setSearchQuery] = React.useState<string>("");

	// 2. Operación: Abrir el modal nativo <dialog> buscando su ID en el DOM
	const handleOpenModal = () => {
		const dialog = document.getElementById("new_todo_modal") as HTMLDialogElement;
		if (dialog) {
			dialog.showModal(); // Método nativo del navegador para levantar el modal en el Top Layer
		}
	};

	// 3. Recibe el nuevo To-Do desde el Modal, clona la lista que nos dio el padre y la actualiza
    const handleAddToDo = (newToDo: IToDo) => {
        const updatedList = [...props.toDos, newToDo];
        props.onToDosChange(updatedList); // 💬 Le avisa al padre para que actualice la clase Project
    };

	// 4. Operación: Actualizar el estado del filtro cuando el usuario escribe en el SearchBox
	const handleSearchChange = (text: string) => {
		setSearchQuery(text);
	};

	// 5. Lógica de Filtrado Dinámico: Filtra en tiempo real sin destruir la lista original
	const filteredToDos = props.toDos.filter((todo) => {
		return todo.description.toLowerCase().includes(searchQuery.toLowerCase());
	});

	return (
		<div className="todo-section-container" style={{ backgroundColor: "#2c2f33", borderRadius: "10px", overflow: "hidden" }}>
			
			{/* Conectamos los cables del Header (Abrir modal y capturar tipeo) */}
			<ToDoHeader 
				onAddClick={handleOpenModal} 
				onSearchChange={handleSearchChange} 
			/>

			{/* Listado dinámico de To-Do's */}
			<div className="todo-list-body" style={{ padding: "0 30px 20px 30px" }}>
				{filteredToDos.length === 0 ? (
					<p style={{ color: "#a3a6aa", textAlign: "center", margin: "20px 0" }}>No tasks found</p>
				) : (
					filteredToDos.map((todo) => (
						/* Le pasamos el ID único a React como "key" obligatoria */
						<ToDoItem key={todo.id} todo={todo} />
					))
				)}
			</div>

			{/* Inyectamos el modal y le conectamos el cable para recibir datos */}
			<ToDoModal onAddToDo={handleAddToDo} />
		</div>
	);
}
