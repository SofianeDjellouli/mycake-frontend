import React, { useState, useCallback } from "react";
import { navigate, A, useTitle } from "hookrouter";
import { Button, Grid } from "@material-ui/core";
import { useToggle, handlePromise, firebase } from "../../utils";
import { RenderPassword, RenderInput, GridForm } from "../";
import { defaultForm } from "./utils.js";
import "./style.css";

const Login = _ => {
	const [form, setForm] = useState(defaultForm),
		onChange = useCallback(
			({ target: { name, value } }) =>
				setForm(form => ({ ...form, [name]: { ...form[name], value, error: "" } })),
			[]
		),
		handleName = useCallback(
			name => ({ onChange, className: "form-input", name, "aria-label": name, ...form[name] }),
			[form, onChange]
		),
		toggleLogin = useToggle(),
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
						firebase.auth().signInWithEmailAndPassword(form.email.value, form.password.value),
						toggleLogin.toggle
					).then(_ => navigate("/profile"));
				}
			},
			[form, toggleLogin.toggle]
		);
	useTitle("Jetpack - Login");

	return (
		<main className="container">
			<Grid container spacing={3} justify="center">
				<Grid item sm={6}>
					<GridForm onSubmit={handleSubmit}>
						<Grid item sm={12} component="h1">
							Login
						</Grid>
						<RenderInput {...handleName("email")} type="email" sm={12} />
						<RenderPassword {...handleName("password")} sm={12} />
						<div className="justify-center">
							<Button
								type="submit"
								disabled={toggleLogin.toggled}
								variant="contained"
								color="primary">
								{toggleLogin.toggled && <i className="fas fa-circle-notch fa-spin right" />}
								Login
							</Button>
						</div>
						<p className="login-bottom-links">
							<A href="/sign-up">Don't have an account? Sign up</A>
							<br />
							<br />
							<A href="/security-check">I forgot my password</A>
						</p>
					</GridForm>
				</Grid>
			</Grid>
		</main>
	);
};

export default Login;
