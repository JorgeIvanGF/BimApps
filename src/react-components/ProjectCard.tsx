

import * as React from 'react';
import { Project  } from '../classes/Project';
import { appIcons } from '../globals';



interface ProjectCardProps{
	project:Project;
}


export function ProjectCard(props:ProjectCardProps) {
	// Define the colors for the card
	const backColor = "#ca8134";	
	const infoColor = "#bdbdbd";

	return (
		<div className="project-card" onClick={()=>{}}>
			<div className="card-header">
				<bim-label className="avatar-initials"style={{ backgroundColor: backColor}} >
					{props.project.initials()}
				</bim-label>
				<div>
					<bim-label style={{color:"white", fontSize:"1.1rem"}}>{props.project.name}</bim-label>
					<bim-label style={{fontSize:"0.8rem"}}>{props.project.description}</bim-label>
				</div>
			</div>
			<div className="card-content">
				<div className="card-property">
					<bim-label icon={appIcons.STATUS}>Status</bim-label >
					<bim-label style={{ color: infoColor }}>{props.project.status}</bim-label>
				</div>
				<div className="card-property">
					<bim-label icon={appIcons.ROLE}>Role</bim-label>
					<bim-label style={{ color: infoColor }}>{props.project.userRole}</bim-label>
				</div>
				<div className="card-property">
					<bim-label icon={appIcons.COST} >Cost</bim-label>
					<bim-label style={{ color: infoColor }}>{props.project.cost}</bim-label>
				</div>
				<div className="card-property">
					<bim-label icon={appIcons.PROGRESS}>Estimated Progress</bim-label>
					<bim-label style={{ color: infoColor }}>{props.project.progress}%</bim-label>
				</div>
			</div>
		</div>
		
	)
}