import React, { useCallback, useState, useContext, useEffect } from "react";
import { useTitle, navigate } from "hookrouter";
import { Grid, Button, FormHelperText } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import {
	useToggle,
	handleFiles,
	firebase,
	handlePromise,
	profile,
	GlobalContext
} from "../../utils";
import { RenderInput, RenderPassword, RenderPhone, GridForm } from "../";
import "./style.css";

const SignUp = _ => {
	const { setSnackbar } = useContext(GlobalContext),
		[APIerror, setAPIError] = useState(""),
		[form, setForm] = useState(profile),
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
		handleFile = useCallback(
			e =>
				handleFiles(e).then(([{ name, file }]) =>
					setForm(({ photoURL, ...form }) => ({
						...form,
						photoURL: { error: "", value: file, name }
					}))
				),
			[]
		),
		handleDOB = useCallback(value => onChange({ target: { name: "DOB", value } }), [onChange]),
		handleSubmit = useCallback(
			e => {
				e.preventDefault();
				if (!toggleSend.toggled) {
					let errors = {};
					const formKeys = Object.keys(form);
					for (let i = 0; i < formKeys.length; i++)
						if (!form[formKeys[i]].value) errors[formKeys[i]] = "This field is required";
					const { password, confirmPassword, email, confirmEmail, photoURL, ...rest } = form;
					if (password.value !== confirmPassword.value)
						errors.confirmPassword = "Passwords must match.";
					if (email.value !== confirmEmail.value) errors.confirmEmail = "Emails must match.";
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
						const { value, name } = photoURL;
						let _photoURL;
						handlePromise(
							firebase
								.storage()
								.ref()
								.child(name)
								.putString(value, "data_url")
								.then(({ ref }) => ref.getDownloadURL())
								.then(value => (_photoURL = value))
								.then(_ =>
									firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
								)
								.then(({ user }) => {
									user.updateProfile({ photoURL: _photoURL });
									return user.uid;
								})
								.then(uid => {
									let data = {};
									const restKeys = ["email", "photoURL", ...Object.keys(rest)];
									for (let i = 0; i < restKeys.length; i++) {
										let field = restKeys[i];
										data[field] = form[field].value;
									}
									data.DOB = form.DOB.value.toJSON();
									return firebase
										.database()
										.ref(`users/${uid}`)
										.set(data)
										.then(_ => true);
								}),
							toggleSend.toggle,
							({ message }) => {
								setSnackbar({ message });
								setAPIError(message);
							}
						).then(bool => {
							if (bool) {
								setForm(profile);
								navigate("/");
							}
						});
					}
				}
			},
			[form, toggleSend.toggle, setSnackbar, toggleSend.toggled]
		),
		{
			DOB: { value, error },
			photoURL
		} = form;

	useTitle("MyCake - Sign Up");

	useEffect(
		_ => _ => {
			setForm(profile);
			setAPIError("");
		},
		[]
	);

	return (
		<main>
			<div className="container profile sign-up">
				<Grid container spacing={3} justify="center">
					<Grid item sm={6}>
						<GridForm onSubmit={handleSubmit}>
							<Grid item sm={12} component="h1">
								Sign Up
							</Grid>
							<RenderInput autoFocus {...handleName("email")} type="email" />
							<RenderInput {...handleName("confirmEmail")} type="email" />
							<Grid item xs={12} sm={6}>
								<img
									alt="Profile"
									height="125"
									width="125"
									className="profile-image"
									src={photoURL.value || "./img/patientMale.svg"}
								/>
							</Grid>
							<Grid item xs={12} sm={6} className="justify-center column">
								<Button className="choose-picture" variant="contained" onDrop={handleFile}>
									Change profile picture
									<input
										type="file"
										onChange={handleFile}
										accept="image/png,image/jpeg,image/jpg"
									/>
								</Button>
								{photoURL.error && <FormHelperText error>{photoURL.error}</FormHelperText>}
							</Grid>
							<RenderPhone {...handleName("phoneNumber")} />
							<Grid item xs={12} sm={6}>
								<DatePicker
									fullWidth
									openTo="year"
									format="DD/MM/YYYY"
									emptyLabel="Date of birth"
									views={["year", "month", "date"]}
									disableFuture
									{...{ value }}
									onChange={handleDOB}
									inputProps={{ "aria-label": "Date of birth", className: "form-input" }}
									InputProps={{
										disableUnderline: true,
										...(!value && { style: { color: "gray" } })
									}}
								/>
								{!!error && <FormHelperText error>{error}</FormHelperText>}
							</Grid>
							<RenderInput {...handleName("addressLine1")} sm={12} />
							<RenderInput {...handleName("addressLine2")} />
							<RenderInput {...handleName("city")} />
							<RenderInput {...handleName("state")} />
							<RenderInput {...handleName("country")} />
							<RenderPassword {...handleName("password")} />
							<RenderPassword {...handleName("confirmPassword")} />
							<Grid item sm={12} component="h4">
								Security questions
							</Grid>
							{["q1", "q2", "q3"].map(e => (
								<RenderInput key={e} {...handleName(e)} sm={12} />
							))}
							<div className="justify-center">
								<Button
									disabled={toggleSend.toggled}
									type="submit"
									variant="contained"
									color="primary">
									{toggleSend.toggled && <i className="fas fa-circle-notch fa-spin right" />} Sign
									Up
								</Button>
							</div>
							{APIerror && <FormHelperText error>{APIerror}</FormHelperText>}
						</GridForm>
					</Grid>
				</Grid>
			</div>
		</main>
	);
};

export default SignUp;
