import React from "react";
import { BeatLoader } from "react-spinners";

const Loader = ({ isLoading }) => {
	if (!isLoading) return null;

	return (
		<div
			className="overlay"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.5)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 9999,
			}}
		>
			<BeatLoader size={15} color="#FFFFFF" loading={isLoading} />
		</div>
	);
};

export default Loader;
