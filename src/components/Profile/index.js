import React, { useContext, useCallback, useEffect, useState } from "react";
import { useTitle } from "hookrouter";
import { Grid, Button, FormHelperText } from "@material-ui/core";
import {
	GlobalContext,
	firebase,
	profile,
	handlePromise,
	useToggle,
	handleFiles
} from "../../utils";
import { FieldUpdate, Spinner } from "../";
import "./style.css";

const Profile = _ => {
	const { user: { photoURL, email, uid } = {} } = useContext(GlobalContext),
		[data, setData] = useState(profile),
		handleName = useCallback(
			name => {
				const { value, label } = data[name];
				return { value, label };
			},
			[data]
		),
		handleFile = useCallback(
			e =>
				handleFiles(e).then(([{ name, file }]) =>
					setData(({ photoURL, ...data }) => ({
						...data,
						photoURL: { error: "", value: file, name }
					}))
				),
			[]
		),
		handleEmail = useCallback(email => firebase.auth().currentUser.updateEmail(email), []),
		handlePassword = useCallback(
			password => firebase.auth().currentUser.updatePassword(password),
			[]
		),
		toggleLoading = useToggle();
	console.log(profile, data);
	useEffect(
		_ => {
			handlePromise(
				firebase
					.database()
					.ref(`users/${uid}`)
					.once("value")
					.then(snapshot => {
						let data = snapshot.val(),
							dataKeys = Object.keys(data),
							_profile = { ...profile };
						for (let i = 0; i < dataKeys.length; i++) {
							const field = dataKeys[i];
							_profile[field].value = data[field];
						}
						setData(_profile);
					}),
				toggleLoading.toggle
			);
		},
		[uid, toggleLoading.toggle]
	);
	useTitle("Jetpack - My profile");
	return (
		<main>
			{toggleLoading.toggled ? (
				Spinner()
			) : (
				<div className="container">
					<Grid container spacing={3} justify="center">
						<Grid item sm={6}>
							<Grid container spacing={3} justify="center">
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
								<FieldUpdate {...handleName("phoneNumber")} />
								<FieldUpdate {...handleName("DOB")} />
								<FieldUpdate {...handleName("addressLine1")} sm={12} />
								<FieldUpdate {...handleName("addressLine2")} />
								<FieldUpdate {...handleName("city")} />
								<FieldUpdate {...handleName("state")} />
								<FieldUpdate {...handleName("country")} />
								<FieldUpdate {...handleName("photoURL")} />
								<FieldUpdate {...handleName("email")} />
							</Grid>
						</Grid>
					</Grid>
				</div>
			)}
		</main>
	);
};

export default Profile;
