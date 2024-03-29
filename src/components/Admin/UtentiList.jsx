import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUtenti, deleteUser, restoreUser } from "../../redux/reducer/utentiApi";
import { Each } from "../Tips/Each";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Url } from "../../Config/config";
import useUserRole from "../../hooks/useUserRole";

const UtentiList = () => {
	const dispatch = useDispatch();
	const { role, isLoading } = useUserRole(); // Destruttura qui sia role che isLoading
	console.log(role, isLoading);
	const { users, status, error } = useSelector((state) => state.utenti);
	const navigate = useNavigate();

	console.log(users);

	useEffect(() => {
		dispatch(fetchUtenti());
	}, [dispatch]);

	const handleDelete = async (id) => {
		await dispatch(deleteUser(id));
		await dispatch(fetchUtenti());
	};

	const handleRestore = async (id) => {
		await dispatch(restoreUser(id));
		await dispatch(fetchUtenti());
	};

	return (
		<>
			{status === "loading" && <div>Loading...</div>}
			{error && <div>Ops, Try again!</div>}
			<Row>
				<Each
					of={users || []}
					render={(user) => (
						<Col xs={12} md={6} lg={4} className="g-4">
							<Card key={user.userId} className="shadow-sm border-0 rounded">
								{user.imageUrl && (
									// <div className="d-flex align-items-center justify-content-center">
									<img
										className="img-circle"
										src={user.imageUrl ? `${Url}${user.imageUrl.replace(/\\/g, "/")}` : "/placeholder.png"}
									/>
									// </div>
								)}
								<CardBody>
									<Card.Title>{user.username}</Card.Title>
									<Card.Text>Email: {user.email}</Card.Text>
									<Card.Text>Stato: {user.isActive ? "Attivo" : "Non attivo"}</Card.Text>
									<Card.Text>
										Preferenze: {user.preferenzeUtentes?.length > 0 ? user.preferenzeUtentes.length : "n/n"}
									</Card.Text>
									<Card.Text>Post: {user.posts?.length > 0 ? user.posts.length : "n/n"}</Card.Text>
									<Card.Text>
										Ultimo Accesso: {user.logAttivita && user.logAttivita[user.logAttivita.length - 1]}
									</Card.Text>
									{(role === "Admin" || role === "Moderatore") && (
										<>
											<Button variant="danger" onClick={() => handleDelete(user.userId)}>
												Soft Delete
											</Button>
											<Button variant="primary" onClick={() => handleRestore(user.userId)}>
												Restore
											</Button>
										</>
									)}
									<Button variant="outline-primary" onClick={() => navigate(`/utenti/${user.userId}/edit`)}>
										Modifica
									</Button>
								</CardBody>
							</Card>
						</Col>
					)}
				/>
			</Row>
		</>
	);
};

export default UtentiList;
