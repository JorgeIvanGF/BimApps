
import * as React from 'react';
import * as Router from "react-router-dom";
import { ProjectsManager } from '../classes/ProjectsManager';
import { ProjectInfo } from './ProjectInfo';
import { ProjectModal } from './ProjectModal'; // Importamos el nuevo modal
import { IProject, Project } from '../classes/Project';



interface ProjectDetailsPageProps{
	projectsManager: ProjectsManager;
}


export function ProjectDetailsPage(props:ProjectDetailsPageProps){

	// NOTE: To retrieve information from the URL, use a Hook Router.
	// 		 To tell URL which parameter expect to retrieve from it <id:string>
	const routeParams = Router.useParams<{id:string}>();	
	if (!routeParams.id) {return <p>Error: ${routeParams.id} ID de proyecto no válido</p>} // Error check
	const projectData = props.projectsManager.getProject(routeParams.id)
	if (!projectData) {return <p>Error: El proyecto con ID "{routeParams.id}" no fue encontrado.</p>} // Error check
	// console.log(" El ID es: ", routeParams.id) // TO DEBUG


	// A State for render changes when changing Project
	const [project, setProject] = React.useState(projectData)

	// FN to Open the correct Modal
	const handleOpenEditModal = () => {
		const modal = document.getElementById("edit-project-modal"); // <--- Ahora busca SU PROPIO modal
        if (modal && modal instanceof HTMLDialogElement) {
            modal.showModal();
		}
	}

	// FN when User clicks on "Accept" Btn 
	const handleUpdateProject = (updatedData: IProject) => {
        // Modificamos directamente las propiedades de la instancia de tu clase original
        project.name = updatedData.name;
        project.description = updatedData.description;
        project.status = updatedData.status;
        project.userRole = updatedData.userRole;
        project.finishDate = updatedData.finishDate;
		project.progress = updatedData.progress;

        // ¡CLAVE! Seteamos el estado con una copia del proyecto modificado. 
        // Esto obliga a React a refrescar la pantalla inmediatamente con los textos nuevos.
        setProject(new Project(project)); // TO DEBUG
    };

	return(

		<div className="page" id="project-details" >
			{/* Header */}
			<header>
				<div>
					<h2 data-project-info="name">{project.name}</h2>
					<p style={{ color: "#969696" }}>{project.description}</p>
				</div>
			</header>
			{/* Main Content */}
			<div className="main-page-content">
				<div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
					<ProjectInfo project={project} onEditClick={handleOpenEditModal}/>
					{/* To-Do Main */}
					<div className="dashboard-card" style={{ flexGrow: 1 }}>
						{/* To-Do header */}
						<div style={{padding: "20px 30px",display: "flex",alignItems: "center",justifyContent: "space-between"}}>
							<h4>To-Do</h4>
							<div style={{display: "flex",alignItems: "center",justifyContent: "end",columnGap: 20}}>
								<div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
									<span className="material-icons-round">search</span>
									<input type="text" placeholder="Search To-Do's by name"	style={{ width: "100%" }}/>
								</div>
								<span className="material-icons-round">add</span>
							</div>
						</div>
						{/* To-Do Item */}
						<div style={{display: "flex",flexDirection: "column",padding: "10px 30px",rowGap: 20}}>
							<div className="todo-item">
								<div style={{display: "flex",justifyContent: "space-between",alignItems: "center"}}>
									{/* Icon + Description */}
									<div style={{ display: "flex", columnGap: 15, alignItems: "center" }}>
										<span className="material-icons-round" style={{padding: 10,backgroundColor: "#686868",borderRadius: 10}}>construction</span>
										<p>Make anything here as you want, even something longer.</p>
									</div>
									{/* Estimated Date */}
									<p style={{ textWrap: "nowrap", marginLeft: 10 }}>Fri, 20 sep</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="viewer-container"	className="dashboard-card"	style={{ minWidth: 0 }}>
				</div>
			</div>

			{/* Rendring the Modal of Edit */}
			<ProjectModal id="edit-project-modal" title="Edit Project" project={project} onSubmit={handleUpdateProject}/>
		</div>

	)

}