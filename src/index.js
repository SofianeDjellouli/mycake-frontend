import React, { Suspense, lazy } from "react";
import { render } from "react-dom";
import { fallback } from "./components";

const App = lazy(_ => import("./App"));

render(
	<Suspense {...{ fallback }}>
		<App />
	</Suspense>,
	document.getElementById("root")
);

