import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/storage";
import "@firebase/database";

// const {} = process.env

firebase.initializeApp({
	apiKey: "AIzaSyDdzfzYh3sGo7j81JAgqSR-B6mfSZCmngE",
	authDomain: "sofianefrontend.firebaseapp.com",
	databaseURL: "https://sofianefrontend.firebaseio.com",
	projectId: "sofianefrontend",
	storageBucket: "sofianefrontend.appspot.com",
	messagingSenderId: "1012464103890",
	appId: "1:1012464103890:web:d5135eca47668fa150980b"
});

export { firebase };
