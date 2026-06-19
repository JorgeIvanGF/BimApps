import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
  	name: string
	description: string
	status: ProjectStatus
	userRole: UserRole
	finishDate: Date
	progress: number
}

export class Project implements IProject {
	//To satisfy IProject
  	name: string
	description: string
	status: "pending" | "active" | "finished"
	userRole: "architect" | "engineer" | "developer"
  	finishDate: Date
	progress: number;
  
  //Class internals  
	cost: number = 0
	id: string

  	constructor(data: IProject) {
		// Asignación explícita: Súper segura, legible y adorada por TypeScript
		this.name = data.name
		this.description = data.description
		this.status = data.status
		this.userRole = data.userRole
		this.finishDate = data.finishDate 
		this.progress = data.progress;
		this.id = uuidv4()
	}

	initials():string{
		// Calculate the initials for the project card:
		const words = this.name.trim().split(/\s+/);
		const initials = words.length > 1 
			? (words[0][0] + words[1][0]).toUpperCase()
			: this.name.substring(0, 2).toUpperCase();
		return (initials);
	}

}