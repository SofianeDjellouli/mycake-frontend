import { createContext } from "react";
import { isDev } from "./";

export const GlobalContext = createContext({});

export const loadStyle = (e) =>
	new Promise((resolve, reject) => {
		if (document.querySelector(`[href="${e}"]`)) resolve();
		else {
			let script = document.createElement("link");
			script.setAttribute("href", e);
			script.setAttribute("rel", "stylesheet");
			window.document.head.appendChild(script);
			script.addEventListener("load", resolve);
			script.addEventListener("error", reject);
		}
	});

export const debounce = (func) => {
	var timeout = null;
	return (...args) => {
		clearTimeout(timeout);
		return new Promise((resolve) => (timeout = setTimeout(() => resolve(func(...args)), 250)));
	};
};

export const handlePromise = (promise, setLoading, handleError) => {
	if (setLoading) setLoading(true);
	window.document.body.style.cursor = "progress";
	return promise
		.catch((e) => {
			if (isDev) console.error(e);
			if (handleError) handleError(e.message);
		})
		.then((e) => {
			if (setLoading) setLoading(false);
			window.document.body.style.cursor = "";
			return e;
		});
};

export const handleFiles = (event) =>
	new Promise((resolve, reject) => {
		event.preventDefault();
		let data = event.dataTransfer ? [...event.dataTransfer.files] : [...event.target.files];
		event.target.value = null;
		if (data && data.length) {
			let promises = [];
			for (let i = 0; i < data.length; i++) {
				let { name, type, size } = data[i];
				if (size > 10000000) return reject("A single file can't be larger than 10 Mb.");
				else if (!["image/png", "image/jpeg", "image/jpg", "application/pdf"].includes(type))
					return reject("Files must be of type pdf, png, jpg or jpeg.");
				else {
					let reader = new FileReader();
					promises.push(
						new Promise(
							(resolve) => (reader.onloadend = (_) => resolve({ name, file: reader.result }))
						)
					);
					reader.readAsDataURL(data[i]);
				}
			}
			Promise.all(promises).then(resolve);
		}
	});
