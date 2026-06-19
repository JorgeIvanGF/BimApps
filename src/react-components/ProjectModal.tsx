import * as React from 'react';
import { IProject, Project, ProjectStatus, UserRole } from '../classes/Project';

interface ProjectModalProps {
	id: string;
	title: string;
	project?: Project; // Opcional: si viene, es modo EDICIÓN. Si no, es modo CREACIÓN.
	onSubmit: (data: IProject) => void;
}

export function ProjectModal(props: ProjectModalProps) {
	
	const onCancel = () => {
		const modal = document.getElementById(props.id);
		if (modal && modal instanceof HTMLDialogElement) {
			modal.close();
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const projectForm = e.currentTarget as HTMLFormElement;
		const formData = new FormData(projectForm);
		
		// Si es edición y la fecha no se tocó, hay que formatearla bien o usar la anterior
		const dateString = formData.get("finishDate") as string;

		const projectData: IProject = {
			name: formData.get("name") as string,
			description: formData.get("description") as string,
			status: formData.get("status") as ProjectStatus,
			userRole: formData.get("userRole") as UserRole,
			finishDate: dateString ? new Date(dateString) : (props.project?.finishDate || new Date()), //TO DEBUG (no entiendo)
			progress: Number(formData.get("progress"))
		};

		props.onSubmit(projectData);
		projectForm.reset();
		onCancel();
	};

	// Formatear la fecha del proyecto para el input type="date" (YYYY-MM-DD)
	const defaultDate = props.project?.finishDate 
		? props.project.finishDate.toISOString().split('T')[0] 
		: "";

	return (
		<dialog id={props.id}>
			<form onSubmit={handleSubmit} id={`${props.id}-form`}>
				******* NUEVO MODAL *******	
				<h2>{props.title}</h2>
				<div className="input-list">
					{/* Name */}
					<div className="form-field-container">
						<label><span className="material-icons-round">apartment</span>Name</label>
						<input
							name="name"
							type="text"
							placeholder="What's the name of your project?"
							defaultValue={props.project?.name || ""}
						/>
						<p style={{ color: "gray", fontSize: "var(--font-sm)", marginTop: 5, fontStyle: "italic" }}>
							TIP: Give it a short name
						</p>
					</div>
					{/* Description */}
					<div className="form-field-container">
						<label><span className="material-icons-round">subject</span>Description</label>
						<textarea
							name="description"
							cols={30}
							rows={5}
							placeholder="Give your project a nice description!"
							defaultValue={props.project?.description || ""}
						/>
					</div>
					{/* Role */}
					<div className="form-field-container">
						<label><span className="material-icons-round">person</span>Role</label>
						<select name="userRole" defaultValue={props.project?.userRole || "architect"}>
							<option value="architect">Architect</option>
							<option value="engineer">Engineer</option>
							<option value="developer">Developer</option>
						</select>
					</div>
					{/* Status */}
					<div className="form-field-container">
						<label><span className="material-icons-round">not_listed_location</span>Status</label>
						<select name="status" defaultValue={props.project?.status || "pending"}>
							<option value="pending">Pending</option>
							<option value="active">Active</option>
							<option value="finished">Finished</option>
						</select>
					</div>
					{/* Finish Date */}
					<div className="form-field-container">
						<label htmlFor="finishDate"><span className="material-icons-round">calendar_month</span>Finish Date</label>
						<input name="finishDate" type="date" defaultValue={defaultDate} />
					</div>
					{/* Progress */}
					<div className="form-field-container">
						<label>	<span className="material-icons-round">trending_up</span> Progress </label>
						<input name="progress" type="number" placeholder="Estimated progress" defaultValue={props.project?.progress || 0} />
					</div>
					{/* Buttons */}
					<div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
						<button type="button" onClick={onCancel} style={{ backgroundColor: "transparent" }}>
							Cancel
						</button>
						<button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
							Accept
						</button>
					</div>
				</div>
			</form>
		</dialog>
	);
}