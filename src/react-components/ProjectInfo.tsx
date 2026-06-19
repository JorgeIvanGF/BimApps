

import * as React from 'react';
import { Project } from '../classes/Project';

interface ProjectInfoProps{
	project:Project
	onEditClick:()=>void
}

/* const onEditProjectClick = () => {
	console.log("Entra al form")
	const modal = document.getElementById("new-project-modal")
	console.log( "modal: ", modal)
	if (!(modal && modal instanceof HTMLDialogElement)) {return}
	modal.showModal()
} */

export function ProjectInfo(props:ProjectInfoProps){
	
	return (
		<div className="dashboard-card" style={{ padding: "30px 0" }}>
			{/* "Header" */}
			<div style={{display: "flex",justifyContent: "space-between",alignItems: "center",padding: "0px 30px",marginBottom: 30}}>
				<p data-project-info="initials"> {props.project.initials()} </p>
				<button onClick={props.onEditClick} className="btn-secondary">
					<p style={{ width: "100%" }}>Edit</p>
				</button>
			</div>
			<div style={{ padding: "0 30px" }}>
				{/* Titles */}
				<div>
					<h5>{props.project.name}</h5>
					<p>{props.project.description}</p>
				</div>
				{/* Information */}
				<div data-project-info="information" >
					<div>
						<p data_project-info="tittle-field"> Status </p>
						<p style={{ textTransform: "capitalize" }}>{props.project.status}</p>
					</div>
					<div>
						<p data_project-info="tittle-field"> Cost </p>
						<p>${props.project.cost}</p>
					</div>
					<div>
						<p data_project-info="tittle-field"> Role </p>
						<p style={{ textTransform: "capitalize" }}>{props.project.userRole}</p>
					</div>
					<div>
						<p data_project-info="tittle-field"> Finish Date </p>
						<p>{props.project.finishDate.toLocaleDateString()}</p>
					</div>
				</div>
				{/* Progress-Bar */}				
				<div style={{backgroundColor: "#404040",borderRadius: 9999,overflow: "auto"}}> {/* background */}					
					<div style={{width: `${props.project.progress}%`,backgroundColor: "green",padding: "4px 0",	textAlign: "center"	}}> {/* Green-Part */}
						{props.project.progress}%
					</div>
				</div>
			</div>
		</div>
	)
}