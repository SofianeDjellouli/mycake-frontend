import React, { useContext, useCallback, useEffect, useState } from "react";
import { useTitle } from "hookrouter";
import { Grid, Button, FormHelperText } from "@material-ui/core";
import dayjs from "dayjs";
import {
	GlobalContext,
	firebase,
	profile,
	handlePromise,
	useToggle,
	handleFiles,
} from "../../utils";
import { FieldUpdate, Spinner, DOBUpdate } from "../";
import "./style.css";

const Profile = (_) => {
	const { user: { uid } = {}, setUser, setSnackbar } = useContext(GlobalContext),
		[data, setData] = useState(profile),
		handleName = useCallback(
			(name) => {
				const { value, label } = data[name];
				return { value, label, name, setData };
			},
			[data]
		),
		toggleImageLoading = useToggle(),
		handleFile = useCallback(
			(e) =>
				handlePromise(
					handleFiles(e)
						.then(([{ name, file }]) => {
							setData(({ photoURL, ...data }) => ({
								...data,
								photoURL: { error: "", value: file, name },
							}));
							setUser((user) => ({ ...user, photoURL: file }));
							return firebase.storage().ref().child(name).putString(file, "data_url");
						})
						.then(({ ref }) => ref.getDownloadURL())
						.then((photoURL) =>
							Promise.all([
								firebase.auth().currentUser.updateProfile({ photoURL }),
								firebase.database().ref(`users/${uid}`).update({ photoURL }),
							])
						),
					toggleImageLoading.toggle,
					setSnackbar
				),
			[toggleImageLoading.toggle, uid, setUser, setSnackbar]
		),
		handleEmail = useCallback(
			(email) =>
				firebase
					.auth()
					.currentUser.updateEmail(email)
					.then((_) => firebase.database().ref(`users/${uid}`).update({ email })),
			[uid]
		),
		/*handlePassword = useCallback(
			password => firebase.auth().currentUser.updatePassword(password),
			[]
		),*/
		toggleLoading = useToggle(),
		{
			photoURL,
			DOB: { value },
		} = data;

	useEffect(
		(_) => {
			if (uid)
				handlePromise(
					firebase
						.database()
						.ref(`users/${uid}`)
						.once("value")
						.then((snapshot) => {
							let data = snapshot.val(),
								dataKeys = Object.keys(data),
								_profile = { ...profile };
							for (let i = 0; i < dataKeys.length; i++) {
								const field = dataKeys[i];
								_profile[field].value = data[field];
							}
							_profile.DOB.value = dayjs(_profile.DOB.value);
							setData(_profile);
						}),
					toggleLoading.toggle,
					setSnackbar
				);
		},
		[uid, toggleLoading.toggle, setSnackbar]
	);
	useTitle("MyCake - My profile");

	return (
		<main className="profile-update">
			{(toggleLoading.toggled && !photoURL.value) || !uid ? (
				Spinner()
			) : (
				<div className="container profile">
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
								<DOBUpdate {...{ value }} />
								{["addressLine1", "addressLine2", "city", "state", "country"].map((e) => (
									<FieldUpdate {...handleName(e)} key={e} />
								))}
								<Grid item sm={12} component="h3">
									Security questions
								</Grid>
								{["q1", "q2", "q3"].map((e) => (
									<FieldUpdate {...handleName(e)} sm={12} key={e} />
								))}
							</Grid>
						</Grid>
					</Grid>
				</div>
			)}
		</main>
	);
};

export default Profile;
