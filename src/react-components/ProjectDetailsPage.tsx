
import * as React from 'react';
import * as Router from "react-router-dom";
import { ProjectsManager } from '../classes/ProjectsManager';
import { ProjectInfo } from './ProjectInfo';
import { ProjectModal } from './ProjectModal'; // Importamos el nuevo modal
import { ToDoItem } from './ToDo/ToDoItem'; // Importamos el nuevo modal
import { IProject, Project } from '../classes/Project';
import { ToDoHeader } from './ToDo/ToDoHeader';
import { SearchBox } from './ToDo/SearchBox';
import { ToDoSection} from './ToDo/ToDoSection';



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

	// 🔄 EFECTO CLAVE: Si cambias de proyecto por la barra de navegación, actualizamos el estado actual
    React.useEffect(() => {
        setProject(projectData);
    }, [projectData]);

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

	const pruebaOnChange = (value:string)=>{
		console.log("Esto es el valor: ", value);
	}
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
						<div>
							<SearchBox onChange={(value)=>{pruebaOnChange(value)}}/>
						</div>
						<ToDoSection/>
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