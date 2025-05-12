# Bank Certificate Authority Demo

This project demonstrates a simplified Public Key Infrastructure (PKI) setup using [HashiCorp Vault](https://www.vaultproject.io/) to act as a Certificate Authority (CA) within a fictional banking system. The setup includes:

- A Vault instance to issue certificates.
- A Flutter app to generate Certificate Signing Requests (CSRs).
- A simple Express.js server simulating a bank, secured with HTTPS.
- A frontend interface built with Vite to interact with Vault.

---

## 📁 Project Structure

```
.
├── bank/               # HTTPS server simulating a bank using a Vault-issued cert
├── csr_app/            # Flutter app for generating CSRs
├── frontend/           # Vite-based web frontend to interact with Vault
├── hashicorp-vault/    # Custom Vault setup for CA purposes
├── compose.yaml        # Docker Compose setup for Vault + Frontend
└── docs/               # Technical documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (for `csr_app`)
- Node.js (if you want to run the bank server manually)

---

### Step 1: Start Vault and Frontend

```bash
docker compose up --build
```

This will:

- Launch Vault on [http://localhost:8200](http://localhost:8200)
- Launch the frontend on [http://localhost:3000](http://localhost:3000)

> Make sure to unseal Vault and configure it using the scripts/policies in `hashicorp-vault/`.

---

### Step 2: Run the CSR Generator App

Navigate to the `csr_app/` directory and run:

```bash
flutter pub get
flutter run
```

This will launch a UI to create a CSR.

---

### Step 3: Issue Certificate via Vault

- Use the frontend or Vault API to submit the CSR and receive a signed certificate.
- The signed cert can be stored in `bank/secrets/` as `cert.crt` and the corresponding private key as `private.pem`.

---

### Step 4: Run the Bank Server

```bash
cd bank
npm install
sudo node main.js
```

This starts the HTTPS server on [https://localhost](https://localhost). Ensure `secrets/private.pem` and `secrets/cert.crt` are present.

---

## 🔐 Vault Configuration

Vault is configured via:

- `local.json`: Base configuration
- `admin-policy.hcl`: Example policy file
- `docker-entrypoint.sh`: Bootstrapping logic for development

---

## 📄 License

This project is licensed under the MIT License.

---

## 📚 Docs

See the `docs/` folder for academic or technical writeups.
