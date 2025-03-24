/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import "./index.css";
import App from "./routes/App";
import Dashboard from "./routes/Dashboard";

const root = document.getElementById("root");
const html = document.getElementsByTagName("html")[0];
html.dataset.theme = "cupcake";

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  ),
  root!
);
