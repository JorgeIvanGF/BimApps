import * as React from 'react';
import * as Router from "react-router-dom";

import { IProject, Project, ProjectStatus, UserRole } from '../classes/Project';
import { ProjectsManager } from '../classes/ProjectsManager';
import { ProjectCard} from './ProjectCard';
import { ProjectModal } from './ProjectModal'; // Importamos el nuevo modal
import { SearchBox } from './ToDo/SearchBox';

interface ProjectPageProps{
	projectsManager: ProjectsManager;
}

export function ProjectsPage(props:ProjectPageProps) {

		// useSTATE_________________________________________________________________
		// 1.Create the State with the initial list of projects created by the PM
		// 2.Asign the return value and FN to a new consts 
	const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list)

	// NOTE:_____________________________________________________________________
		// Everytime a PJ is Created or Deleted, the callback FN is executed,
		// and that callback executes the FN provided by the useSate to UPDATE it.
		// ___________________________________________________________________________
	props.projectsManager.onCreatedProject = () => {setProjects([...props.projectsManager.list])}
	props.projectsManager.onDeletedProject = () => {setProjects([...props.projectsManager.list])}

	// To Update the UI of the ProjectsPage
	const projectCards = projects.map((project) => {
		return(
			// NOTE: Use ` ${} `to send to URL DYNAMICALLY the id from each PJ
			// 		 The "key" always in the PARENT component
			<Router.Link to={`/project/${project.id}`} key={project.id}> 
				<ProjectCard project={project} />
			</Router.Link>
		);
	})

	// NOTE:__________________________________________________________________________
		// React creates an Event everytime a STATE is UPDATED
		// => We can create a Callback FN to say what to do everytime an STATE is UPDATED
		// _______________________________________________________________________________
	React.useEffect(() => {
		console.log("Projects STATE Updated", projects)
	}, [projects])

	const onNewProjectClick = () => {
		const modal = document.getElementById("new-project-modal")
		if (!(modal && modal instanceof HTMLDialogElement)) {return}
		modal.showModal()
	}

  	const onFormSubmit = (e: React.FormEvent) => {
		const projectForm = document.getElementById("new-project-form")
		if (!(projectForm && projectForm instanceof HTMLFormElement)) {return}
		e.preventDefault()
		const formData = new FormData(projectForm)
		const projectData: IProject = {
		name: formData.get("name") as string,
		description: formData.get("description") as string,
		status: formData.get("status") as ProjectStatus,
		userRole: formData.get("userRole") as UserRole,
		finishDate: new Date(formData.get("finishDate") as string),
		progress: Number(formData.get("progress"))
	}
	try {
		const project = props.projectsManager.newProject(projectData)
		// console.log(project) // TO DEBUG
		projectForm.reset()
		const modal = document.getElementById("new-project-modal")
		if (!(modal && modal instanceof HTMLDialogElement)) {return}
		modal.close()
	} catch (err) {
	  	alert(err)
		}
	}

	const onExportProject = () => {
		props.projectsManager.exportToJSON()
	}

  	const onImportProject = () => {
		props.projectsManager.importFromJSON()
	}

	// When typing in the searchBox
	const handleProjectSearch = (value:string) =>{
		setProjects(props.projectsManager.filterProject(value));
	}

  	return (
		<div className="page" id="projects-page" style={{ display: "flex" }}>
			{/* Form for New Project */}
			<ProjectModal id="new-project-modal" title="New Project" onSubmit={(projectData) => props.projectsManager.newProject(projectData)}/>
			{/* Header */}
			<header>
				<h2>Projects</h2>
				<SearchBox onChange={(value) => {handleProjectSearch(value)}}/>
				<div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
				<span id="import-projects-btn" className="material-icons-round action-icon" onClick={onImportProject}>file_upload</span>
				<span id="export-projects-btn" className="material-icons-round action-icon" onClick={onExportProject}>file_download</span>
				<button onClick={onNewProjectClick} id="new-project-btn">
					<span className="material-icons-round">add</span>New Project
				</button>
				</div>
			</header>
			{/* Projects List */}
			<div id="projects-list">
				{projectCards}
			</div>
		</div>
  	)
}