import React from "react";
import { useSelector } from "react-redux";
import { Navbar, Nav, Container, NavDropdown, DropdownItem } from "react-bootstrap";
import LogoutButton from "../Auth/Logout";
import { NavLink, useLocation } from "react-router-dom";
import useUserRole from "../../hooks/useUserRole";

const MyNavbar = () => {
	const location = useLocation();
	const user = useSelector((state) => state.login.user);
	const userId = user?.userId;
	const { role, isLoading } = useUserRole();

	const isUserListPath = location.pathname === "/utentiList/";

	// Se il percorso non è /utentiList, non renderizzare nulla
	if (!isUserListPath) return null;

	return (
		<Navbar expand="lg" className="sticky-top my-nav">
			<Container>
				<Navbar.Brand>
					<NavLink to="/" className="nav-link">
						LOGO
					</NavLink>
				</Navbar.Brand>
				<NavLink to="/abbonamenti" className="nav-link">
					Abbonamenti
				</NavLink>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						<NavLink className="nav-link">{user && <h5 className="p-0 m-0">Bentornato, {user.username}!</h5>}</NavLink>
						<NavDropdown title="Account" id="basic-nav-dropdown">
							{userId ? (
								<>
									<NavDropdown.Item as={NavLink} to={`/utenti/${userId}`}>
										Profilo
									</NavDropdown.Item>
									{(role === "Admin" || role === "Moderatore") && (
										<NavDropdown.Item as={NavLink} to="/utentiList/">
											Utenti
										</NavDropdown.Item>
									)}
									<NavDropdown.Divider />
									<NavDropdown.Item>
										<LogoutButton />
									</NavDropdown.Item>
								</>
							) : (
								<>
									<NavDropdown.Item as={NavLink} to="/login">
										Login
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item as={NavLink} to="/register">
										Register
									</NavDropdown.Item>
								</>
							)}
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default MyNavbar;
