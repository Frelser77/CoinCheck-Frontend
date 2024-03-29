import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer, PERSIST } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loginReducer from "../reducer/loginUser";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import expireReducer from "redux-persist-expire";
import { jwtDecode } from "jwt-decode";
import { logout } from "../reducer/loginUser";
import utentiReducer from "../reducer/utentiApi";
import cartReducer from "../reducer/cartReducer";
import productsReducer from "../reducer/Abbonamenti/abbonamentoFetch";
import coinbaseReducer from "../reducer/CoinbaseApi/CoinbaseApi";
import volumeSummaryReducer from "../reducer/CoinbaseApi/VolumeSummary";
import cryptoNewsReducer from "../reducer/CryptocCompareApi/fetchNews";
import favoritesReducer from "../reducer/CryptoDataBase/favoriteSlice";
// Il tuo middleware per controllare la scadenza del token
const checkTokenExpirationMiddleware = (store) => (next) => (action) => {
	const token = store.getState().login.token;
	if (token) {
		const decodedToken = jwtDecode(token);
		if (decodedToken.exp < Date.now() / 1000) {
			next(logout());

			return;
		}
	}
	next(action);
};

// Questa è la configurazione del persist per il tuo loginReducer
const loginPersistConfig = {
	key: "login",
	storage: storage,
	stateReconciler: autoMergeLevel2,
	transforms: [
		expireReducer("auth", {
			expireSeconds: 1800, // 30 minuti
			expiredState: {},
			autoExpire: true,
		}),
	],
};

const coinbasePersistConfig = {
	key: "coinbase",
	storage: storage,
	whitelist: ["coins"],
	stateReconciler: autoMergeLevel2,
};

const newsPersistConfig = {
	key: "news",
	storage: storage,
	stateReconciler: autoMergeLevel2,
};

const favoritesPersistConfig = {
	key: "favorites",
	storage: storage,
	whitelist: ["userPreferences"],
	stateReconciler: autoMergeLevel2,
};

// Questo è il rootReducer con il loginReducer persistito
const rootReducer = combineReducers({
	login: persistReducer(loginPersistConfig, loginReducer),
	utenti: utentiReducer,
	cart: cartReducer,
	products: productsReducer,
	coinbase: persistReducer(coinbasePersistConfig, coinbaseReducer),
	volumeSummary: volumeSummaryReducer,
	news: persistReducer(newsPersistConfig, cryptoNewsReducer),
	favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
	// Altri reducers qui se necessario
});

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [PERSIST], // , PURGE, REGISTER,FLUSH, REHYDRATE,PAUSE,
			},
		}).concat(checkTokenExpirationMiddleware),
});

const persistor = persistStore(store);

export { store, persistor };
