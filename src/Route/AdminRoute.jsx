// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectUserRole } from "../redux/reducer/loginUser";

// export function AdminRoute() {
// 	const userRole = useSelector(selectUserRole);

// 	if (userRole !== "Admin") {
// 		// Redirect to the home page if not an admin
// 		return <Navigate to="/" />;
// 	}

// 	// Render children if an admin
// 	return <Outlet />;
// }

// import { useSelector } from "react-redux";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { selectUserRole } from "../redux/reducer/loginUser";
// export function RoleRoute({ allowedRoles }) {
// 	const userRole = useSelector(selectUserRole);
// 	const location = useLocation();

// 	return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/" state={{ from: location }} />;
// }

// Componente per le rotte protette
// const AdminRoute = ({ component: Component, ...rest }) => (
// 	<Route {...rest} render={(props) => (isAdminAuthenticated() ? <Component {...props} /> : <Redirect to="/login" />)} />
// );

import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAdminAuthenticated } from "../components/Auth/authService";

const AdminRoute = ({ component: Component, ...rest }) => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [checkingStatus, setCheckingStatus] = useState(true);

	useEffect(() => {
		const checkAdmin = async () => {
			const isAuthenticated = await isAdminAuthenticated();
			setIsAdmin(isAuthenticated);
			setCheckingStatus(false);
		};

		checkAdmin();
	}, []);

	if (checkingStatus) {
		return <div>Verifying admin status...</div>;
	}

	return <Route {...rest} render={(props) => (isAdmin ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default AdminRoute;
