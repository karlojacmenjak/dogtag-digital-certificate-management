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

# Create entity for the user
echo "[vault-setup] Creating Identity entity for user '$VAULT_USERNAME'..."
ENTITY_ID=$(vault write -format=json identity/entity name="$VAULT_USERNAME" \
  policies="admin" \
  metadata=team=dev \
  | jq -r ".data.id")

# Lookup accessor for userpass method
USERPASS_ACCESSOR=$(vault auth list -format=json | jq -r '.["userpass/"].accessor')

# Create entity alias to map userpass login to the entity
echo "[vault-setup] Creating entity alias..."
vault write identity/entity-alias name="$VAULT_USERNAME" \
  canonical_id="$ENTITY_ID" \
  mount_accessor="$USERPASS_ACCESSOR"


# Done
echo "[vault-setup] Vault setup complete. Process will now continue in foreground."

# Enable CORS
if ! curl -s --header "X-Vault-Token: $ROOT_TOKEN" http://127.0.0.1:8200/v1/sys/config/cors | grep -q '"allowed_origins":'; then
  echo "[vault-setup] Setting CORS configuration..."
  curl --location 'http://127.0.0.1:8200/v1/sys/config/cors' \
    --header "X-Vault-Token: $ROOT_TOKEN" \
    --header 'Content-Type: application/json' \
    --data '{
      "allowed_origins": "*"
    }'
else
  echo "[vault-setup] CORS already configured."
fi


# Bring Vault process back to foreground
wait $VAULT_PID
