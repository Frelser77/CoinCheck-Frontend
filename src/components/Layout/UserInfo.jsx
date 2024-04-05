import React from "react";
import { useSelector } from "react-redux";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Url } from "../../Config/config";
import useUserRole from "../../hooks/useUserRole";
import Loader from "./Loader";

const UserInfoCard = () => {
	const navigate = useNavigate();
	const user = useSelector((state) => state.login.user);
	const { role, isLoading } = useUserRole();
	console.log(role);

	if (!user || !user.userId) {
		return <div>L'utente non è loggato</div>;
	}

	// Funzione per ottenere la classe in base al ruolo
	const getRoleClass = (role) => {
		switch (role) {
			case "Admin":
				return "card-role-admin";
			case "Moderatore":
				return "card-role-moderator";
			case "UtenteBasic":
				return "card-role-basic";
			case "UtenteMedium":
				return "card-role-medium";
			case "UtentePro":
				return "card-role-pro";
			default:
				return "";
		}
	};

	const imageUrl = user.imageUrl.startsWith("http") ? user.imageUrl : `${Url}${user.imageUrl}`;

	const handleCardClick = () => {
		navigate(`/utenti/${user.userId}`);
	};

	const cardClass = getRoleClass(role);

	return (
		<>
			<Loader isLoading={isLoading} />
			<div className="user-cards-container">
				<Card onClick={handleCardClick} className={`${cardClass} user-card`} style={{ cursor: "pointer" }}>
					<Row className="justify-content-center align-items-center p-2">
						<Col xs={5}>
							<Card.Img variant="top" src={imageUrl} className="user-img-info img-sm" />
						</Col>
						<Col>
							<Card.Body>
								<Card.Title>{user.username}</Card.Title>
							</Card.Body>
						</Col>
					</Row>
				</Card>
			</div>
		</>
	);
};

export default UserInfoCard;
