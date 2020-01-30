import React, { memo, useCallback } from "react";
import "./style.css";

const _Footer = _ => {
	const handleGitHub = useCallback(_ => window.open("https://github.com/SofianeDjellouli"), []),
		handleLinkedin = useCallback(
			_ => window.open("https://www.linkedin.com/in/sofiane-djellouli/"),
			[]
		);
	return (
		<footer className="container">
			<p>Copyright © Sofiane Djellouli, 2020</p>
			<p>
				<i onClick={handleGitHub} className="fab fa-github right" />
				<i onClick={handleLinkedin} className="fab fa-linkedin" />
			</p>
		</footer>
	);
};

export const Footer = memo(_Footer);
