import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import configureStore from "./store/configureStore";

createRoot(document.getElementById("root")).render(
  <Provider store={configureStore()}>
    <App />
  </Provider>
);
