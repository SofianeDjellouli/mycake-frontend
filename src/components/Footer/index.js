import React, { memo } from "react";
import "./style.css";

const _Footer = _ => (
	<footer className="container">
		<p>Copyright © Sofiane Djellouli, 2020</p>
	</footer>
);

export const Footer = memo(_Footer);
