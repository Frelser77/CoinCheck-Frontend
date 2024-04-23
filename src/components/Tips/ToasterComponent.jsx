//ToasterComponent.jsx

import { ToastContainer } from "react-toastify";

const ToasterComponent = () => {
	return (
		<ToastContainer
			position="top-right"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			toastStyle={{ backgroundColor: "#0c0a2b" }}
		/>
	);
};

export default ToasterComponent;
