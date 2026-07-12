import * as React from "react";
import * as Router from "react-router-dom";
import { appIcons } from "../globals";

export function Sidebar() {
  return (
    <aside id="sidebar">
      <img id="company-logo" src="./assets/company-logo.svg" alt="Construction Company" />
      <ul id="nav-buttons">
		<Router.Link to="/">
        	<bim-button icon={appIcons.APARTMENT} label="Projects" style={{ fontSize: "5rem" }}></bim-button>
		</Router.Link>
		<Router.Link to="/project">
  	      <bim-button icon={appIcons.PEOPLE} label="Users"></bim-button>
		</Router.Link>
      </ul>
    </aside>
  )
}