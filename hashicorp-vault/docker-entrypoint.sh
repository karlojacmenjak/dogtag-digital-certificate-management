#!/bin/sh
set -e

# Start Vault in the background
vault server -config=/vault/config/local.json &
VAULT_PID=$!

# Wait for Vault to start
echo "[vault-setup] Waiting for Vault to start..."
sleep 5

# Export vault address
export VAULT_ADDR='http://127.0.0.1:8200'

# Check if already initialized
if vault status | grep -q 'Initialized.*true'; then
  echo "[vault-setup] Vault is already initialized."
else
  echo "[vault-setup] Initializing Vault..."
  vault operator init -key-shares=1 -key-threshold=1 > /vault/config/init-keys.txt
  echo "[vault-setup] Initialization complete. Keys written to /vault/config/init-keys.txt"
fi

# Extract unseal key and root token
UNSEAL_KEY=$(grep 'Unseal Key 1:' /vault/config/init-keys.txt | awk '{print $NF}')
ROOT_TOKEN=$(grep 'Initial Root Token:' /vault/config/init-keys.txt | awk '{print $NF}')

# Unseal
echo "[vault-setup] Unsealing Vault..."
vault operator unseal "$UNSEAL_KEY"

# Login
echo "[vault-setup] Logging in with root token..."
vault login "$ROOT_TOKEN"

# Set environment variables from Docker
VAULT_USERNAME=${VAULT_USERNAME:-vaultuser}
VAULT_PASSWORD=${VAULT_PASSWORD:-changeme}

# Enable PKI
echo "[vault-setup] Enabling PKI secrets engine..."
vault secrets enable -path=pki pki || echo "[vault-setup] PKI already enabled"

# Set max TTL
echo "[vault-setup] Tuning PKI max TTL..."
vault secrets tune -max-lease-ttl=87600h pki

# Generate root certificate
echo "[vault-setup] Generating root certificate..."
vault write pki/root/generate/internal \
    common_name="example.com" \
    ttl=87600h > /vault/config/root-cert.json
echo "[vault-setup] Root certificate written to /vault/config/root-cert.json"

# Configure URLs
echo "[vault-setup] Configuring PKI URLs..."
vault write pki/config/urls \
    issuing_certificates="$VAULT_ADDR/v1/pki/ca" \
    crl_distribution_points="$VAULT_ADDR/v1/pki/crl"

# Enable userpass auth method
echo "[vault-setup] Enabling userpass auth method..."
vault auth enable userpass || echo "[vault-setup] userpass already enabled"

# Create the admin policy
echo "[vault-setup] Creating admin policy..."
vault policy write admin /vault/config/admin-policy.hcl

# Create the user and assign the policy
echo "[vault-setup] Creating user '$VAULT_USERNAME' with admin policy..."
vault write auth/userpass/users/$VAULT_USERNAME \
    password="$VAULT_PASSWORD" \
    policies=admin

# Done
echo "[vault-setup] Vault setup complete. Process will now continue in foreground."

# Bring Vault process back to foreground
wait $VAULT_PID
