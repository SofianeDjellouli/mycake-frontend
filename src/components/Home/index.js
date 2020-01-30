import React, { useContext, useCallback } from "react";
import { navigate, useTitle } from "hookrouter";
import { Button, Grid } from "@material-ui/core";
import { GlobalContext } from "../../utils";
import "./style.css";

const Home = _ => {
	const { user } = useContext(GlobalContext),
		handleSignUp = useCallback(_ => navigate("/sign-up"), []);
	useTitle("MyCake - Home");

	return (
		<main>
			<section className="hero">
				<picture>
					<img src="/img/sf3.jpg" alt="San Francisco Bridge" />
				</picture>
				<h1>FREELANCE JOBS FROM TOP TECH COMPANIES</h1>
				<h2>
					Silicon Valley CTOs will teach you
					<br />
					how to work with companies in the Silicon Valley and beyond
				</h2>
				{!user && (
					<Button onClick={handleSignUp} variant="contained" color="primary">
						Sign Up
					</Button>
				)}
			</section>
			<section className="features">
				<div className="container">
					<h1>HERE'S HOW MYCAKE WORKS</h1>
					<Grid container spacing={4} className="features-grid">
						{[
							{
								title: "Interviews",
								text:
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
							},
							{
								title: "Coaching",
								text:
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
							},
							{
								title: "Job Placement",
								text:
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
							},
							{
								title: "Ongoing Support",
								text:
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
							}
						].map(({ title, text }, i) => (
							<Grid item key={title} sm={6}>
								<img src={`/img/${i + 1}.jpg`} alt={title} />
								<h4>{title}</h4>
								<p>{text}</p>
							</Grid>
						))}
					</Grid>
				</div>
			</section>
		</main>
	);
};

export default Home;
