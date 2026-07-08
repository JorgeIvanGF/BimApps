
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
import { IToDo } from './ToDo/ToDoItem'; // Importamos la interfaz del To-Do
import { ThreeViewer } from './Viewer/ThreeViewer';

// For Firestore DataBase
import { deleteDocument } from '../firebase';
import { updateDocument } from '../firebase';


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
	const handleUpdateProject = async (updatedData: IProject) => {

		try{
			// Reparar Fecha:
			const safeFinishDate = updatedData.finishDate ? new Date(updatedData.finishDate) : new Date();

			// 2. 🚨 LA SOLUCIÓN CLAVE: Sanitizar y reparar las fechas de cada ToDo individualmente
			const rawToDos = project.toDos || [];
			const safeToDos = rawToDos.map(todo => {
				let processedToDoDate = new Date();
				if (todo.date) {
					const parsedDate = new Date(todo.date);
					// Si la fecha del ToDo no es válida (Invalid Date), usamos la de hoy como salvavidas
					processedToDoDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
				}
				return {
					...todo,
					date: processedToDoDate // Nos aseguramos de mandar un objeto Date real a Firestore
				};
			});

			// Inyectamos los toDos actuales del proyecto en los datos que van a Firestore
			const dataToSend: IProject = {
				...updatedData,
				finishDate:safeFinishDate,
				toDos: safeToDos // 👈 Aseguramos que viaje el array de tareas
			};

			// Update the Project in Firestore DataBase:
			await updateDocument<IProject>(`/projects`, project.id, dataToSend);
			console.log("¡Proyecto con ToDos actualizado con éxito en Firestore!"); //TO DEBUG
	
			// Modificamos directamente las propiedades de la instancia de tu clase original
			project.name = updatedData.name;
			project.description = updatedData.description;
			project.status = updatedData.status;
			project.userRole = updatedData.userRole;
			project.finishDate = safeFinishDate;
			project.progress = updatedData.progress;
			project.toDos = safeToDos; // Sincronizamos las tareas locales purificadas
			
			const updatedProjectInstance = new Project(project, project.id);
	
			// 🔄 Sincronizamos la lista global del manager con los nuevos datos generales
			props.projectsManager.list = props.projectsManager.list.map((proj) => {
				return proj.id === project.id ? updatedProjectInstance : proj;
			});
	
			// ¡CLAVE! Seteamos el estado con una copia del proyecto modificado. 
			// Esto obliga a React a refrescar la pantalla inmediatamente con los textos nuevos.
			setProject(updatedProjectInstance); // 
		}
		catch (error){
			// Si el usuario se queda sin internet o fallan las reglas de Firebase, protegemos la app
			console.error("Error al actualizar en Firestore:", error);
			alert("Hubo un error de conexión. No se pudieron guardar los cambios en la base de datos.");
		}
    };

	// ⚡ OPERACIÓN MAESTRA: Manejador para coordinar y sincronizar los To-Dos con el ProjectsManager
    const handleToDosChange = async (updatedToDos: IToDo[]) => {

		try{

			// 	******* AQUI IRÍA GUARDAR EL LIST UPDATED DE TODOS *********
			// Creamos el payload de actualización parcial conteniendo únicamente el array modificado
			const dataToSend = {
				toDos: updatedToDos
			};
			// Actualizamos de manera directa la propiedad "toDos" del documento en la base de datos
			await updateDocument<any>(`/projects`, project.id, dataToSend);
			console.log("¡Lista de ToDos actualizada con éxito en Firestore!");
		
	
			// 1. Guardamos la nueva lista en la instancia del proyecto local
			project.toDos = updatedToDos;
	
			// 2. Creamos una nueva instancia clonada para forzar el renderizado
			const updatedProjectInstance = new Project(project, project.id);
	
			// 3. 🔄 Sincronizamos con el array global de ProjectsManager en memoria
			props.projectsManager.list = props.projectsManager.list.map((proj) => {
				if (proj.id === project.id) {
					return updatedProjectInstance; // Reemplazamos la instancia obsoleta por la actualizada con To-Dos
				}
				return proj;
			});
	
			// 4. Actualizamos el estado de React para renderizar los cambios en los To-Dos
			setProject(updatedProjectInstance);
		}
		catch (error){
			console.error("Error al actualizar los ToDos en Firestore:", error);
        	alert("Hubo un error de conexión. La tarea se actualizó en pantalla pero no pudo guardarse en la nube.");
		}
    };

	const pruebaOnChange = (value:string)=>{
		console.log("Esto es el valor: ", value);
	}

	// Red de protección por si .toDos no se inicializó correctamente en el JSON anterior
    const currentToDos = project.toDos || [];

	// Para DELETE Projects __________________________________________________________________
	const navigateTo = Router.useNavigate() // Navegar a ...
	props.projectsManager.onDeletedProject = async (id) => {
		await deleteDocument(`/projects`,id)
		navigateTo("/") // Navigate to Home
	}

	return(

		<div className="page" id="project-details" >
			{/* Header */}
			<header>				
				<div>
					<h2 data-project-info="name">{project.name}</h2>
					<p style={{ color: "#969696" }}>{project.description}</p>
				</div>
				<button 
					onClick={()=>{props.projectsManager.deleteProject(project.id)}} 
					style={{backgroundColor:"#b40000b2"}}> Delete Project
				</button>
				
			</header>
			{/* Main Content */}
			<div className="main-page-content">
				<div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
					<ProjectInfo project={project} onEditClick={handleOpenEditModal}/>
					{/* To-Do Main */}
					<div className="dashboard-card" style={{ flexGrow: 1 }}>
						{/* <div>
							<SearchBox onChange={(value)=>{pruebaOnChange(value)}}/>
						</div> */}
						<ToDoSection toDos={currentToDos} onToDosChange={handleToDosChange}/>
					</div>
				</div>
				{/* Viewer Container */}
				<ThreeViewer/>

			</div>

			{/* Rendring the Modal of Edit */}
			<ProjectModal id="edit-project-modal" title="Edit Project" project={project} onSubmit={handleUpdateProject}/>
		</div>

	)

}