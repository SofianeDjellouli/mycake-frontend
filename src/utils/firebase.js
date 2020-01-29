import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/storage";
import "@firebase/database";

// const {} = process.env

firebase.initializeApp({
	apiKey: "AIzaSyA-rM9uj51FZ8Ef_bBKKdcpnPgdbBZttt4",
	authDomain: "jetcakefrontend.firebaseapp.com",
	databaseURL: "https://jetcakefrontend.firebaseio.com",
	projectId: "jetcakefrontend",
	storageBucket: "jetcakefrontend.appspot.com",
	messagingSenderId: "918533226559",
	appId: "1:918533226559:web:ea64829caabc09230cb88a"
});

export { firebase };
