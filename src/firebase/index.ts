// Import the functions you need from the SDKs you need
import * as Firestore from "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdJxCEMQILPHWJLDmPpZhj_SaEAljE3Kw",
  authDomain: "bim-dev-master-1bd5c.firebaseapp.com",
  projectId: "bim-dev-master-1bd5c",
  storageBucket: "bim-dev-master-1bd5c.firebasestorage.app",
  messagingSenderId: "842351689708",
  appId: "1:842351689708:web:2a1fa041bf6b5bbda08ac9",
  measurementId: "G-ZEQ2JW5EM5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Reference to the DataBase
export const firestoreDB = Firestore.getFirestore();

// FN to get the Collection
export function getCollection <T> (path: string){
	return Firestore.collection(firestoreDB,path) as Firestore.CollectionReference<T>

}

// FN to Delete a Project "Document"
export async function deleteDocument(path:string, id:string){
	// get the doc with the Collection Path and the doc ID
	const doc = Firestore.doc(firestoreDB,`${path}/${id}`);
	await Firestore.deleteDoc(doc);
}

// FN to UPDATE a Project "Document"
// Type: the updateDoc FN MUST have an Object as a 2nd Arg, so its needed to specify the tipe and the kind
//		ESTRUCTURA DE ENTRADA (TYPES & ARGS):
		/* 1. <T extends Record<string, any>> (Genérico):
		* - Es un "molde flexible" pero seguro. Obliga a que el argumento `data` sea estrictamente 
		* 	un objeto de JavaScript ("keys" de tipo string y "values" de cualquier tipo).
		* - Te permite indicarle a la función qué tipo de interfaz estás actualizando (ej: <IProject>) */
export async function updateDocument<T extends Record<string, any>> (path:string, id:string, data:T){
	// get the doc with the Collection Path and the doc ID
	const doc = Firestore.doc(firestoreDB,`${path}/${id}`);
	await Firestore.updateDoc(doc, data);
}