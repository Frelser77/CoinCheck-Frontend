import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/redux/store/store";
// import "boxicons/css/boxicons.min.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./styles/componentscss";
const root = createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>
);
