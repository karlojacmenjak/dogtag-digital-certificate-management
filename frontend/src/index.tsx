/* @refresh reload */
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import "./index.css";
import Dashboard from "./routes/Dashboard";
import RolesPage from "./routes/RolesPage";
import RoleDetails from "./routes/RoleDetails";
import EditRole from "./routes/EditRole";
import CertificatesPage from "./routes/CertificatesPage";
import GenerateCertificatePage from "./routes/GenerateCertificatePage";
import SignCertificatePage from "./routes/SignCertificatePage";
import CertificateDetailsPage from "./routes/CertificateDetailsPage";
import LoginPage from "./routes/LoginPage";

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
      <Route path="/" component={LoginPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/roles" component={RolesPage} />
      <Route path="/roles/details/:name" component={RoleDetails} />
      <Route path="/roles/create" component={EditRole} />
      <Route path="/roles/edit/:name" component={EditRole} />
      <Route
        path="/roles/:role_name/generate-certificate"
        component={GenerateCertificatePage}
      />
      <Route
        path="/roles/:role_name/sign-certificate"
        component={SignCertificatePage}
      />
      <Route path="/certificates" component={CertificatesPage} />
      <Route path="/certificates/:serial" component={CertificateDetailsPage} />
    </Router>
  ),
  root!
);
