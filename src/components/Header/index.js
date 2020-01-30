import React, { memo, useContext, useCallback, useState } from "react";
import { navigate } from "hookrouter";
import {
	IconButton,
	Button,
	Avatar,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText
} from "@material-ui/core";
import { GlobalContext, firebase, useMobile } from "../../utils";
import "./style.css";

const _Header = _ => {
	const { user } = useContext(GlobalContext),
		[anchorEl, setAnchorEl] = useState(null),
		handleMenu = useCallback(({ currentTarget }) => setAnchorEl(currentTarget), []),
		handleClose = useCallback(_ => setAnchorEl(null), []),
		handleLogOut = useCallback(
			_ =>
				firebase
					.auth()
					.signOut()
					.then(_ => navigate("/")),
			[]
		),
		isMobile = useMobile(),
		handleHome = useCallback(_ => navigate("/"), []),
		handleLogin = useCallback(_ => navigate("/login"), []),
		hasUser = typeof user === "object";
	return (
		<header>
			<div id="fixed-header">
				<div className="container">
					<h1 onClick={handleHome}>JetCake</h1>
					{user !== "loading" &&
						(hasUser ? (
							isMobile ? (
								<IconButton className="end-right" onClick={handleMenu}>
									<i className="fas fa-bars" />
								</IconButton>
							) : (
								<div className="end-right align-center">
									Welcome
									<Avatar className="left pointer" onClick={handleMenu} src={user.photoURL} />
								</div>
							)
						) : (
							<Button variant="contained" onClick={handleLogin} className="end-right">
								Login
							</Button>
						))}
					{hasUser && (
						<Menu
							disableScrollLock
							className="header-menu"
							open={!!anchorEl}
							onClose={handleClose}
							onClick={handleClose}
							getContentAnchorEl={null}
							anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							transformOrigin={{ vertical: "top", horizontal: "right" }}
							{...{ anchorEl }}>
							{[
								{ i: "fas fa-user", title: "Profile", onClick: _ => navigate("/profile") },
								{ i: "fas fa-sign-out-alt", title: "Log out", onClick: handleLogOut }
							].map(({ i, title, onClick }) => (
								<MenuItem key={title} {...{ onClick }}>
									<ListItemIcon>
										<i className={i} />
									</ListItemIcon>
									<ListItemText primary={title} />
								</MenuItem>
							))}
						</Menu>
					)}
				</div>
			</div>
		</header>
	);
};

export const Header = memo(_Header);
