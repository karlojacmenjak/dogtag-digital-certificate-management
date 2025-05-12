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

## ⚠️ Security Disclaimer

The Vault bootstrap process in `hashicorp-vault/docker-entrypoint.sh` is designed **strictly for demonstration purposes** and must **not be used in production environments**. Here's why:

### ❌ Unsafe Behaviors in the Demo Script

- **Plaintext secrets**: The unseal key and root token are written to disk (`init-keys.txt`) without encryption.
- **Auto-unseal logic**: The script unseals Vault automatically on startup, which defeats Vault’s secure initialization process.
- **Minimal key shares**: Vault is initialized with `-key-shares=1 -key-threshold=1`, meaning anyone with that one key can unseal Vault.
- **Root token usage**: The script logs in as root for configuration, a bad practice that violates the principle of least privilege.
- **No TLS**: Vault runs over HTTP (`http://127.0.0.1:8200`), which is acceptable only for local testing.
- **No authentication or control**: The script assumes full access and blindly enables/configures PKI backends and policies.

### ✅ If You're Adapting This for Real Use

- Enable TLS on Vault with a valid certificate.
- Use a secure auto-unseal method (e.g., cloud KMS integration).
- Never store sensitive keys unencrypted on disk.
- Revoke the root token after initial configuration.
- Use policies and AppRole for secure access control.
- Use multi-key initialization with quorum (e.g., 5 shares, threshold 3).

This setup is intentionally insecure to help you learn the moving parts of Vault and PKI. Treat it like a sandbox, not a foundation.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📚 Docs

See the `docs/` folder for academic or technical writeups.
