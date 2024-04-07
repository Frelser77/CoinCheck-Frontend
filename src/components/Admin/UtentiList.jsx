import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUtenti, deleteUser, restoreUser } from "../../redux/reducer/Utenti/utentiApi";
import { Each } from "../Tips/Each";
import { Button, ButtonGroup, Card, CardBody, CardGroup, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Url } from "../../Config/config";
import useUserRole from "../../hooks/useUserRole";
import { setSelectedUserId } from "../../redux/reducer/Utenti/selectedUserIdSlice";
import Loader from "../Layout/Loader";
import CustomImage from "../Utenti/CustomImage";

const UtentiList = () => {
	const dispatch = useDispatch();
	const { role, isLoading } = useUserRole();
	console.log(role, isLoading);
	const users = useSelector((state) => state.utenti.users);
	const status = useSelector((state) => state.utenti.status);
	const error = useSelector((state) => state.utenti.error);

	useEffect(() => {
		if (status === "idle" || status === "failed") {
			dispatch(fetchUtenti());
		}
	}, [dispatch, status]);

	if (status === "loading" || isLoading) {
		return <Loader isLoading={true} />;
	}

	if (error) {
		toast.error("Si è verificato un errore: " + error);
	}

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
			<Loader isLoading={isLoading && status} />
			<Row className="zone-7 p-1 mt-3">
				<h2 className="text-center text">Lista Utenti</h2>
				<Each
					of={users || []}
					render={(user) => (
						<Col xs={12} md={6} lg={4} className="g-4">
							<Card key={user.userId} className="shadow-sm border-0 rounded h-100">
								<OverlayTrigger key="top" placement="top" overlay={<Tooltip id={`tooltip-top`}>Modifica</Tooltip>}>
									{user.imageUrl && (
										<div className="d-flex align-items-center justify-content-center my-3">
											<CustomImage
												src={user.imageUrl}
												alt={user.username}
												className="my-custom-class"
												onClick={() => dispatch(setSelectedUserId(user.userId))}
												Url={Url}
											/>
										</div>
									)}
								</OverlayTrigger>
								<CardBody className="d-flex flex-column justify-content-center align-items-start">
									<Card.Text className="large-text fw-semibold">{user.username}</Card.Text>
									<Card.Text className="small-text">Email: {user.email}</Card.Text>
									<Card.Text className="small-text">Stato: {user.isActive ? "Attivo" : "Non attivo"}</Card.Text>
									<Card.Text className="small-text">
										Preferenze: {user.preferenzeUtentes?.length > 0 ? user.preferenzeUtentes.length : "n/n"}
									</Card.Text>
									<Card.Text className="small-text">
										Post: {user.posts?.length > 0 ? user.posts.length : "n/n"}
									</Card.Text>
									<Card.Text className="small-text">
										Ultimo Accesso: {user.logAttivita && user.logAttivita[user.logAttivita.length - 1]}
									</Card.Text>
									<div className="d-flex align-items-center justify-content-between gap-1">
										{(role === "Admin" || role === "Moderatore") && (
											<>
												{user.isActive ? (
													<Button
														size="sm"
														variant="outline-danger"
														className="p-1"
														onClick={() => handleDelete(user.userId)}
													>
														Inactive
													</Button>
												) : (
													<Button
														size="sm"
														variant="outline-success"
														className="p-1"
														onClick={() => handleRestore(user.userId)}
													>
														Restore
													</Button>
												)}
											</>
										)}
										{/* <Button
											size="sm"
											variant="outline-primary"
											onClick={() => dispatch(setSelectedUserId(user.userId))}
											className="p-1"
										>
											Modifica
										</Button> */}
									</div>
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
