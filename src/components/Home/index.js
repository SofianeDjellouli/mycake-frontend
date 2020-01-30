import React, { useContext, useCallback } from "react";
import { navigate, useTitle } from "hookrouter";
import { Button, Grid } from "@material-ui/core";
import { GlobalContext } from "../../utils";
import "./style.css";

const Home = _ => {
	const { user } = useContext(GlobalContext),
		handleSignUp = useCallback(_ => navigate("/sign-up"), []);
	useTitle("Jetpack - Home");

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
					<h1>HERE'S HOW JETCAKE WORKS</h1>
					<Grid container spacing={4} className="features-grid">
						{[
							{
								title: "Interviews",
								text:
									"Apply here at JetCake. You will go through a challenging yet friendly sets of interviews. Top candidates will be invited to Step 2"
							},
							{
								title: "Coaching",
								text:
									"You will be coached through a series of real-world projects that will hone your skills in effective communication, accurate estimation, agile methodologies, product concepts, and more"
							},
							{
								title: "Job Placement",
								text:
									"If you complete all projects successfully, you will be connected with top tech companies at JetCake Network"
							},
							{
								title: "Ongoing Support",
								text:
									"You are not alone while on a job or assignment, as you always have access to JetCake Developer Network for ongoing support, learning, and growth"
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
