import React, { useCallback, useState } from "react";
import { useTitle, navigate } from "hookrouter";
import { Grid, Button } from "@material-ui/core";
import { RenderInput, GridForm } from "../";
import { useToggle, firebase, handlePromise } from "../../utils";
import { questions } from "./utils";
import "./style.css";

const SecurityCheck = _ => {
	const [form, setForm] = useState(questions),
		onChange = useCallback(
			({ target: { name, value } }) =>
				setForm(form => ({ ...form, [name]: { ...form[name], value, error: "" } })),
			[]
		),
		toggleSend = useToggle(),
		handleName = useCallback(
			name => ({
				onChange,
				className: "form-input",
				name,
				"aria-label": name,
				placeholder: form[name].label,
				...form[name]
			}),
			[form, onChange]
		),
		handleSubmit = useCallback(
			e => {
				e.preventDefault();
				let errors = {};
				const formKeys = Object.keys(form);
				for (let i = 0; i < formKeys.length; i++)
					if (!form[formKeys[i]].value) errors[formKeys[i]] = "This field is required";
				const errorKeys = Object.keys(errors);
				if (errorKeys.length)
					setForm(form => {
						let _form = {};
						for (let i = 0; i < errorKeys.length; i++) {
							const field = errorKeys[i];
							_form[field] = { ...form[field], error: errors[field] };
						}
						return { ...form, ..._form };
					});
				else {
					handlePromise(
						firebase
							.database()
							.ref("users")
							.orderByChild("email")
							.equalTo(form.email.value)
							.on("child_added", snapshot => {
								/*const data = snapshot.val(),
									dataKeys = Object.keys(data),
									{ email, ..._form } = form;
								for (let i = 0; i < dataKeys.length; i++) {
									let key = dataKeys[i];
									if (_form[key].value !== data[key]) throw new Error("Incorrect answer");
								}*/
							}),
						toggleSend.toggle
					).then(_ => navigate("/profile"));
				}
			},
			[form, toggleSend.toggle]
		);
	useTitle("Jetpack - Security Check");

	return (
		<main>
			<div className="container">
				<h2>Please answer your security questions</h2>
				<Grid container spacing={3} justify="center">
					<Grid item sm={6}>
						<GridForm onSubmit={handleSubmit}>
							<RenderInput {...handleName("email")} sm={12} />
							<RenderInput {...handleName("q1")} sm={12} />
							<RenderInput {...handleName("q2")} sm={12} />
							<RenderInput {...handleName("q3")} sm={12} />
							<div className="justify-center">
								<Button
									disabled={toggleSend.toggled}
									type="submit"
									variant="contained"
									color="primary">
									{toggleSend.toggled && <i className="fas fa-circle-notch fa-spin right" />}
									Submit
								</Button>
							</div>
						</GridForm>
					</Grid>
				</Grid>
			</div>
		</main>
	);
};

export default SecurityCheck;
