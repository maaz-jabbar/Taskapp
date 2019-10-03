import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import allReducers from "./reducers/index";
import { persistStore, persistReducer } from "redux-persist";
import { AsyncStorage } from "react-native";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  timeout: null,
  
};

const persistedReducer = persistReducer(persistConfig, allReducers);

export const store = createStore(persistedReducer, {}, applyMiddleware(thunk));

store.subscribe(() => console.log(store.getState()));

export const persistor = persistStore(store);

// export default createStore(allReducers, {} , applyMiddleware(thunk))
