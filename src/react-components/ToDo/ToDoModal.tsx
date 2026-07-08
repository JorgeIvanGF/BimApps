
import * as React from 'react';
import {IToDo} from './ToDoItem';
import { v4 as uuidv4 } from 'uuid';

interface ToDoModalProps{
	onAddToDo: (todo:IToDo) => void;
}

export function ToDoModal(props: ToDoModalProps ) {


	// To handel Submit
	const handleSubmit = (e: React.FormEvent) =>{
		e.preventDefault();
		const toDoForm = e.currentTarget as HTMLFormElement;
		const formData = new FormData(toDoForm);

		// Get the data from the Form
		const description = formData.get("description") as string;
		const status = formData.get("status") as "Pending" | "In Progress" | "Done";;
		const rawDate = formData.get("todo_Date") as string;

		if (!description || !status || !rawDate) {return};

		// Creates new To-Do meeting the ITodo interface
		const newToDo: IToDo = {
			id:uuidv4(),
			description: description,
			status: status,
			date: new Date(rawDate)
		}

		// Pass the data to Father
		props.onAddToDo(newToDo);

		// Reset the form
		toDoForm.reset();

		// Close the Dialog
		const dialog = document.getElementById("new_todo_modal") as HTMLDialogElement;
		if (dialog) {dialog.close()}
	}

	const handleCancel = () =>{
		const toDoForm = document.getElementById("new_todo_form") as HTMLFormElement;
		if (toDoForm) {toDoForm.reset()} //To clean the inputs Form

		// To Close the Dialog
		const dialog = document.getElementById("new_todo_modal") as HTMLDialogElement;
		if(dialog) {dialog.close()}
	}

	return (
		
		<dialog id="new_todo_modal">
			<form id="new_todo_form" onSubmit={handleSubmit}>
				{/* Top Part */}
				<div>
					<h2>New To-Do</h2>
				</div>
				{/* Input Part */}
				<div className="input-list">
					<div className="form-field-container">
						<label> <span className="material-icons-round">text_snippet</span> Description </label>
						<input name="description" type="text" placeholder="Describe the task" />
					</div>
					<div className="form-field-container">
						<label> <span className="material-icons-round">verified_user</span>Status</label>
						<select name="status">
							<option value="Pending">Pending</option>
							<option value="In Progress">In Progress</option>
							<option value="Done">Done</option>
						</select>
					</div>
					<div className="form-field-container">
						<label> <span className="material-icons-round">date_range</span>Due Date</label>
						<input name="todo_Date" type="date" />
					</div>
				</div>
				{/* Bottom Part */}
				<div id="form_buttons">
					<button onClick={handleCancel} type="button" id="cancel_todo" className="cancel_btn">{" "}Cancel{" "}</button>
					<button type="submit" id="accept_todo" className="accept_btn">{" "}Accept{" "}</button>
				</div>
			</form>
		</dialog>


	)
}