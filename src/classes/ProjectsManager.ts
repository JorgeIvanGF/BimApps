import { IProject, Project } from "./Project"
import { updateDocument } from "../firebase"

export class ProjectsManager {

	list: Project[] = []
	onCreatedProject = (project:Project) => {} // A callback FN when a PJ is Created
	onDeletedProject = (id:string) => {} // A callback FN when a PJ is Deleted

/* 	constructor() {
		const project = this.newProject({
		name: "Default Project",
		description: "This is just a default app project",
		status: "pending",
		userRole: "architect",
		finishDate: new Date(),
		progress: 10
		})
   
  } */


  filterProject(value:string){
	// Filter in the list of PJs
	const filteredProjects = this.list.filter((project)=>{
		return project.name.includes(value)
	})
	return filteredProjects;
  }

  newProject(data: IProject, id?: string) {
    const projectNames = this.list.map((project) => {
      return project.name
    })
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exists`)
    }
    const project = new Project(data, id)
    this.list.push(project)
	this.onCreatedProject(project); // Execute the callback FN
    return project
  }


  	// Update the project details page with the info of the modified project
	updateProject(project: Project, data: IProject): void {

		project.name = data.name;
		project.description = data.description;
		project.userRole = data.userRole;
		project.status = data.status;		
		project.progress = data.progress;

		// To force finishDate becomes Date Obj
		if (data.finishDate) {
			const parsedDate = new Date(data.finishDate);
			// If its Not valid => new date.
			project.finishDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
		} else {
			project.finishDate = new Date();
		}


		// if data comes from a Project or JSON file
		if (data.toDos && Array.isArray(data.toDos)) {
			if (data === project) {
				// Do Nothing
			} else {
				// from JSON file (iterating)
				data.toDos.forEach(newTodo => {
					// Check if already exists
					if(!project.toDos) return;
					const existingTodo = project.toDos.find(t => t.description.toLowerCase() === newTodo.description.toLowerCase());
					
					if (existingTodo) {
						//Update teh info
						existingTodo.status = newTodo.status;
						existingTodo.date = newTodo.date;
					} else {
						// If its new
						project.addToDo(newTodo);
					}
				});
			}
		}
	}


  getProject(id: string) {
    const project = this.list.find((project) => {
      return project.id === id
    })
    return project
  }
  
  deleteProject(id: string) {
    const project = this.getProject(id)
    if (!project) { return }   
    const remaining = this.list.filter((project) => {
      return project.id !== id
    })
    this.list = remaining
	this.onDeletedProject(id)
  }
  
  exportToJSON(fileName: string = "projects") {
    const json = JSON.stringify(this.list, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }
  
  importFromJSON1() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()

    reader.addEventListener("load", () => {
      const json = reader.result
      if (!json) { return }

      const projects: IProject[] = JSON.parse(json as string)
      for (const project of projects) {
        try {
			// to change from string to Date type:
			project.finishDate = new Date(project.finishDate)
          	this.newProject(project, project.id)
        } catch (error) {
			// 3. 🔄 PLAN B (Red de seguridad): Si el nombre ya existe, 'newProject' lanzará un error.
                // En vez de congelar la app, buscamos el proyecto existente por su ID y lo actualizamos.
                if (project.id) {
                    const existingProject = this.getProject(project.id)
                    if (existingProject) {
                        this.updateProject(existingProject, project)
                        console.log(`Proyecto "${project.name}" ya existía. Datos actualizados.`);
					}
				}
			}
		}
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsText(filesList[0])
    })
    input.click()
  }
  
  importFromJSON() {
	  const input = document.createElement('input')
	  input.type = 'file'
	  input.accept = 'application/json'
	  const reader = new FileReader()
	  
	  // Convertimos el callback en async para poder usar await con la base de datos
	  reader.addEventListener("load", async () => {
		  const json = reader.result
		  if (!json) { return }
		  
		  const projects: IProject[] = JSON.parse(json as string)
		  
		  for (const projectData of projects) {
			  try {
				  // A. Reparamos la fecha de string a Date
				  projectData.finishDate = new Date(projectData.finishDate)
				  
				  // B. Creamos la instancia en memoria local respetando su ID original
				  const newProjInstance = this.newProject(projectData, projectData.id)
				  
				  // 🚨 C. ¡EL PASO NUEVO QUE FALTABA! Guardamos en la base de datos de Firestore inmediatamente
				  // Usamos el id de la instancia (ya sea el original o el que se autogeneró si no venía)
				  await updateDocument<IProject>(`/projects`, newProjInstance.id, projectData);
				  console.log(`Proyecto "${newProjInstance.name}" importado localmente y guardado en Firestore.`);
				  
			  } catch (error) {
				  // Si el nombre ya existía localmente, 'newProject' lanzará un error. 
				  // En ese caso, actualizamos los datos locales y también forzamos la actualización en la nube.
				  if (projectData.id) {
					  const existingProject = this.getProject(projectData.id)
					  if (existingProject) {
						  this.updateProject(existingProject, projectData)
						  
						  // Sincronizamos la actualización en la nube por si el JSON traía cambios
						  await updateDocument<IProject>(`/projects`, projectData.id, projectData);
						  console.log(`Proyecto existente "${projectData.name}" actualizado localmente y en Firestore.`);
					  }
				  }
			  }
		  }
	  })
	  
	  input.addEventListener('change', () => {
		  const filesList = input.files
		  if (!filesList) { return }
		  reader.readAsText(filesList[0])
	  })
	  
	  input.click()
  }
}

