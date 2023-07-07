import { createRoot } from "react-dom/client";
import App from "./app/App";
import store from "./app/redux/store";
import { Provider } from "react-redux";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
