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

const Profile = _ => {
	const { user: { uid } = {} } = useContext(GlobalContext),
		[data, setData] = useState(profile),
		handleName = useCallback(
			name => {
				const { value, label } = data[name];
				return { value, label, name, setData };
			},
			[data]
		),
		toggleImageLoading = useToggle(),
		handleFile = useCallback(
			e =>
				handleFiles(e).then(([{ name, file }]) => {
					setData(({ photoURL, ...data }) => ({
						...data,
						photoURL: { error: "", value: file, name }
					}));
					handlePromise(
						firebase
							.storage()
							.ref()
							.child(name)
							.putString(file, "data_url")
							.then(({ ref }) => ref.getDownloadURL())
							.then(photoURL => firebase.auth().currentUser.updateProfile({ photoURL })),
						toggleImageLoading.toggle
					);
				}),
			[toggleImageLoading.toggle]
		),
		handleEmail = useCallback(email => firebase.auth().currentUser.updateEmail(email), []),
		/*handlePassword = useCallback(
			password => firebase.auth().currentUser.updatePassword(password),
			[]
		),*/
		toggleLoading = useToggle(),
		{ photoURL } = data;
	console.log(data.DOB.value, toggleLoading.toggled);
	useEffect(
		_ => {
			if (uid)
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
		<main className="main-profile">
			{(toggleLoading.toggled && !photoURL.value) || !uid || true ? (
				Spinner()
			) : (
				<div className="container">
					<Grid container spacing={3} justify="center">
						<Grid item sm={6}>
							<Grid container spacing={3} justify="center" className="box">
								<Grid item sm={12} component="h1">
									My profile
								</Grid>
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
									<Button
										className="choose-picture"
										variant="contained"
										disabled={toggleImageLoading.toggled}
										onDrop={handleFile}>
										Change profile picture
										{toggleImageLoading.toggled && (
											<i className="fas fa-circle-notch fa-spin left" />
										)}
										<input
											type="file"
											onChange={handleFile}
											accept="image/png,image/jpeg,image/jpg"
										/>
									</Button>
									{photoURL.error && <FormHelperText error>{photoURL.error}</FormHelperText>}
								</Grid>
								<FieldUpdate {...handleName("email")} onSubmit={handleEmail} />
								<FieldUpdate {...handleName("phoneNumber")} />
								<FieldUpdate {...handleName("DOB")} />
								<FieldUpdate {...handleName("addressLine1")} />
								<FieldUpdate {...handleName("addressLine2")} />
								<FieldUpdate {...handleName("city")} />
								<FieldUpdate {...handleName("state")} />
								<FieldUpdate {...handleName("country")} />
							</Grid>
						</Grid>
					</Grid>
				</div>
			)}
		</main>
	);
};

export default Profile;
