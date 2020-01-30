import React, { lazy } from "react";

const Home = lazy(_ => import("../components/Home"));
const Login = lazy(_ => import("../components/Login"));
const Profile = lazy(_ => import("../components/Profile"));
const SignUp = lazy(_ => import("../components/SignUp"));
// const SecurityCheck = lazy(_ => import("../components/SecurityCheck"));

export const routes = {
	"/": _ => <Home />,
	"/login": _ => <Login />,
	"/sign-up": _ => <SignUp />,
	"/profile": _ => <Profile />,
	// "/security-check": _ => <SecurityCheck />,
	"/:random*": _ => <Home />
};
